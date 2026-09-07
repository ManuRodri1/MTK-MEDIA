export type MediaType = "image" | "video"

export const MAX_SIMPLE_VIDEO_BYTES = 100 * 1024 * 1024
export const LARGE_UPLOAD_CHUNK_BYTES = 8 * 1024 * 1024
const LARGE_UPLOAD_MAX_ATTEMPTS = 3

export function shouldUseChunkedCloudinaryUpload(mediaType: MediaType, fileSize: number) {
  return mediaType === "video" && fileSize > MAX_SIMPLE_VIDEO_BYTES
}

export function getCloudinaryUploadChunks(
  fileSize: number,
  chunkSize = LARGE_UPLOAD_CHUNK_BYTES,
) {
  if (!Number.isSafeInteger(fileSize) || fileSize <= 0) {
    throw new Error("File size must be a positive safe integer.")
  }
  if (!Number.isSafeInteger(chunkSize) || chunkSize <= 0) {
    throw new Error("Chunk size must be a positive safe integer.")
  }

  const chunks: Array<{ start: number; endExclusive: number }> = []
  for (let start = 0; start < fileSize; start += chunkSize) {
    chunks.push({ start, endExclusive: Math.min(start + chunkSize, fileSize) })
  }
  return chunks
}

export type CloudinarySignature = {
  cloudName: string
  apiKey: string
  resourceType: MediaType
  uploadUrl: string
  timestamp: number
  signature: string
  uploadPreset: string
  assetFolder: string
  tags: string
  expiresAt?: number
}

export type CloudinaryUploadResult = {
  asset_id: string
  public_id: string
  secure_url: string
  original_filename?: string
  format?: string
  width?: number
  height?: number
  bytes?: number
  duration?: number
  resource_type: MediaType
}

type CloudinaryChunkResult = Partial<CloudinaryUploadResult> & {
  done?: boolean
  error?: { message?: string }
}

type CloudinaryError = {
  error?: { message?: string }
}

export type UploadErrorCode =
  | "signature_error"
  | "cors_error"
  | "http_error"
  | "network_error"
  | "abort"
  | "timeout"
  | "cloudinary_api_error"
  | "supabase_insert_error"
  | "large_file_requires_chunked_upload"

export type UploadDiagnostics = {
  stage: "cloudinary_upload"
  eventType: "progress" | "load" | "error" | "abort" | "timeout"
  readyState: number
  httpStatus: number
  statusText: string
  responseText: string
  cloudinaryMessage: string | null
  fileName: string
  fileType: string
  fileSize: number
  bytesUploaded: number
  totalBytes: number
  percentage: number
  endpoint: string
  resourceType: MediaType
  formDataFields: string[]
  responseHeaders: Record<string, string>
  corsProbe?: "passed" | "failed"
  assetId?: string
  publicId?: string
  secureUrl?: string
}

export class UploadPipelineError extends Error {
  code: UploadErrorCode
  diagnostics: Record<string, unknown>

  constructor(code: UploadErrorCode, message: string, diagnostics: Record<string, unknown>) {
    super(message)
    this.name = "UploadPipelineError"
    this.code = code
    this.diagnostics = diagnostics
  }
}

const requiredSignatureFields = [
  "cloudName",
  "apiKey",
  "resourceType",
  "uploadUrl",
  "timestamp",
  "signature",
  "uploadPreset",
  "assetFolder",
  "tags",
] as const

const formDataFields = [
  "file",
  "api_key",
  "timestamp",
  "signature",
  "upload_preset",
  "asset_folder",
  "tags",
]

const safeResponseHeaderNames = [
  "content-type",
  "server-timing",
  "x-cld-error",
  "x-cld-request-id",
  "x-request-id",
]

function truncate(value: string, maximumLength = 2_000) {
  return value.length > maximumLength ? `${value.slice(0, maximumLength)}…` : value
}

function readSafeResponseHeaders(request: XMLHttpRequest) {
  const headers: Record<string, string> = {}

  for (const name of safeResponseHeaderNames) {
    const value = request.getResponseHeader(name)
    if (value) headers[name] = value
  }

  return headers
}

function readCloudinaryMessage(responseText: string) {
  try {
    const payload = JSON.parse(responseText) as CloudinaryError
    return payload.error?.message || null
  } catch {
    return null
  }
}

function describeCloudinaryFailure(cloudinaryMessage: string | null, fallback: string) {
  const detail = cloudinaryMessage || fallback
  if (/file size too large|maximum.*file size/i.test(detail)) {
    return `${detail}. This upload is already using chunks, so the remaining limit is set by the Cloudinary account plan.`
  }
  return detail
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function validateCloudinarySignature(
  value: unknown,
  expectedResourceType: MediaType,
): CloudinarySignature {
  if (!isRecord(value)) {
    throw new UploadPipelineError(
      "signature_error",
      "The signing function returned an invalid response object.",
      { stage: "signature", eventType: "validation_error" },
    )
  }

  const missingFields = requiredSignatureFields.filter((field) => {
    const fieldValue = value[field]
    if (field === "timestamp") return typeof fieldValue !== "number" || !Number.isFinite(fieldValue)
    return typeof fieldValue !== "string" || fieldValue.trim().length === 0
  })

  if (missingFields.length > 0) {
    throw new UploadPipelineError(
      "signature_error",
      `The signing response is missing required fields: ${missingFields.join(", ")}`,
      { stage: "signature", eventType: "validation_error", missingFields },
    )
  }

  const signed = value as CloudinarySignature

  if (signed.resourceType !== expectedResourceType) {
    throw new UploadPipelineError(
      "signature_error",
      `The signing response returned resourceType=${signed.resourceType}; expected ${expectedResourceType}.`,
      {
        stage: "signature",
        eventType: "validation_error",
        expectedResourceType,
        receivedResourceType: signed.resourceType,
      },
    )
  }

  let uploadUrl: URL
  try {
    uploadUrl = new URL(signed.uploadUrl)
  } catch {
    throw new UploadPipelineError(
      "signature_error",
      "The signing response returned an invalid uploadUrl.",
      { stage: "signature", eventType: "validation_error", uploadUrl: signed.uploadUrl },
    )
  }

  const expectedSuffix = `/${expectedResourceType}/upload`
  if (
    uploadUrl.protocol !== "https:"
    || uploadUrl.hostname !== "api.cloudinary.com"
    || !uploadUrl.pathname.endsWith(expectedSuffix)
  ) {
    throw new UploadPipelineError(
      "signature_error",
      `The signed uploadUrl must target Cloudinary ${expectedSuffix}.`,
      {
        stage: "signature",
        eventType: "validation_error",
        uploadUrl: signed.uploadUrl,
        expectedSuffix,
      },
    )
  }

  return signed
}

async function probeCloudinaryCors(uploadUrl: string) {
  try {
    const response = await fetch(uploadUrl, { method: "OPTIONS", mode: "cors" })
    return response.ok ? "passed" as const : "failed" as const
  } catch {
    return "failed" as const
  }
}

export function uploadToCloudinary(
  file: File,
  signed: CloudinarySignature,
  onProgress?: (progress: number) => void,
  onDiagnostics?: (diagnostics: UploadDiagnostics) => void,
) {
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("api_key", signed.apiKey)
    formData.append("timestamp", String(signed.timestamp))
    formData.append("signature", signed.signature)
    formData.append("upload_preset", signed.uploadPreset)
    formData.append("asset_folder", signed.assetFolder)
    formData.append("tags", signed.tags)

    let bytesUploaded = 0
    let totalBytes = file.size
    let percentage = 0
    const request = new XMLHttpRequest()
    request.open("POST", signed.uploadUrl)
    request.timeout = 300_000

    const buildDiagnostics = (
      eventType: UploadDiagnostics["eventType"],
      extra: Partial<UploadDiagnostics> = {},
    ): UploadDiagnostics => ({
      stage: "cloudinary_upload",
      eventType,
      readyState: request.readyState,
      httpStatus: request.status,
      statusText: request.statusText,
      responseText: truncate(request.responseText || ""),
      cloudinaryMessage: readCloudinaryMessage(request.responseText || ""),
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      bytesUploaded,
      totalBytes,
      percentage,
      endpoint: signed.uploadUrl,
      resourceType: signed.resourceType,
      formDataFields,
      responseHeaders: request.readyState === XMLHttpRequest.DONE
        ? readSafeResponseHeaders(request)
        : {},
      ...extra,
    })

    request.upload.onprogress = (event) => {
      bytesUploaded = event.loaded
      totalBytes = event.lengthComputable ? event.total : file.size
      percentage = totalBytes > 0 ? Math.round((bytesUploaded / totalBytes) * 100) : 0
      onProgress?.(percentage)
      onDiagnostics?.(buildDiagnostics("progress"))
    }

    request.onerror = () => {
      void probeCloudinaryCors(signed.uploadUrl).then((corsProbe) => {
        const code: UploadErrorCode = corsProbe === "failed" ? "cors_error" : "network_error"
        const diagnostics = buildDiagnostics("error", { corsProbe })
        onDiagnostics?.(diagnostics)
        reject(new UploadPipelineError(
          code,
          corsProbe === "failed"
            ? "Cloudinary upload failed before an HTTP response and the CORS probe also failed."
            : "Cloudinary upload transport failed before an HTTP response; Cloudinary CORS is reachable.",
          diagnostics,
        ))
      })
    }

    request.onabort = () => {
      const diagnostics = buildDiagnostics("abort")
      onDiagnostics?.(diagnostics)
      reject(new UploadPipelineError("abort", "Cloudinary upload was aborted.", diagnostics))
    }

    request.ontimeout = () => {
      const diagnostics = buildDiagnostics("timeout")
      onDiagnostics?.(diagnostics)
      reject(new UploadPipelineError(
        "timeout",
        `Cloudinary upload timed out after ${Math.round(request.timeout / 1_000)} seconds.`,
        diagnostics,
      ))
    }

    request.onload = () => {
      const cloudinaryMessage = readCloudinaryMessage(request.responseText || "")
      const diagnostics = buildDiagnostics("load", { cloudinaryMessage })
      onDiagnostics?.(diagnostics)

      let payload: CloudinaryUploadResult | CloudinaryError
      try {
        payload = JSON.parse(request.responseText) as CloudinaryUploadResult | CloudinaryError
      } catch {
        reject(new UploadPipelineError(
          "http_error",
          `Cloudinary returned a non-JSON response (${request.status || "no status"}).`,
          diagnostics,
        ))
        return
      }

      if (request.status < 200 || request.status >= 300) {
        const code: UploadErrorCode = cloudinaryMessage ? "cloudinary_api_error" : "http_error"
        reject(new UploadPipelineError(
          code,
          `Cloudinary upload failed (${request.status}): ${describeCloudinaryFailure(cloudinaryMessage, request.statusText || "Unknown error")}`,
          diagnostics,
        ))
        return
      }

      const result = payload as CloudinaryUploadResult
      if (!result.asset_id || !result.public_id || !result.secure_url) {
        reject(new UploadPipelineError(
          "cloudinary_api_error",
          "Cloudinary response is missing required asset metadata.",
          diagnostics,
        ))
        return
      }

      bytesUploaded = file.size
      totalBytes = file.size
      percentage = 100
      const successDiagnostics = buildDiagnostics("load", {
        assetId: result.asset_id,
        publicId: result.public_id,
        secureUrl: result.secure_url,
      })
      onDiagnostics?.(successDiagnostics)
      onProgress?.(100)
      resolve(result)
    }

    request.send(formData)
  })
}

export async function uploadToCloudinaryChunked(
  file: File,
  signed: CloudinarySignature,
  onProgress?: (progress: number) => void,
  onDiagnostics?: (diagnostics: UploadDiagnostics) => void,
) {
  const uploadId = crypto.randomUUID()
  let finalResult: CloudinaryUploadResult | null = null

  for (const { start, endExclusive } of getCloudinaryUploadChunks(file.size)) {
    const chunk = file.slice(start, endExclusive, file.type)
    let result: CloudinaryChunkResult | null = null

    for (let attempt = 1; attempt <= LARGE_UPLOAD_MAX_ATTEMPTS; attempt += 1) {
      try {
        result = await uploadCloudinaryChunk(
          chunk,
          file,
          signed,
          uploadId,
          start,
          endExclusive,
          onProgress,
          onDiagnostics,
        )
        break
      } catch (error) {
        if (attempt === LARGE_UPLOAD_MAX_ATTEMPTS || !isRetryableChunkError(error)) throw error
        await waitForRetry(500 * (2 ** (attempt - 1)))
      }
    }

    if (result && (result.done === true || (result.asset_id && result.public_id && result.secure_url))) {
      finalResult = result as CloudinaryUploadResult
    }
  }

  if (!finalResult?.asset_id || !finalResult.public_id || !finalResult.secure_url) {
    throw new UploadPipelineError(
      "cloudinary_api_error",
      "Cloudinary chunked upload finished without complete asset metadata.",
      { stage: "cloudinary_upload", eventType: "error", uploadId },
    )
  }

  onProgress?.(100)
  return finalResult
}

function isRetryableChunkError(error: unknown) {
  if (!(error instanceof UploadPipelineError)) return false
  if (error.code === "network_error" || error.code === "timeout") return true

  const httpStatus = Number(error.diagnostics.httpStatus)
  return httpStatus === 408 || httpStatus === 429 || httpStatus >= 500
}

function waitForRetry(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds))
}

function uploadCloudinaryChunk(
  chunk: Blob,
  originalFile: File,
  signed: CloudinarySignature,
  uploadId: string,
  start: number,
  endExclusive: number,
  onProgress?: (progress: number) => void,
  onDiagnostics?: (diagnostics: UploadDiagnostics) => void,
) {
  return new Promise<CloudinaryChunkResult>((resolve, reject) => {
    const request = new XMLHttpRequest()
    const formData = new FormData()
    formData.append("file", chunk, originalFile.name)
    formData.append("api_key", signed.apiKey)
    formData.append("timestamp", String(signed.timestamp))
    formData.append("signature", signed.signature)
    formData.append("upload_preset", signed.uploadPreset)
    formData.append("asset_folder", signed.assetFolder)
    formData.append("tags", signed.tags)

    request.open("POST", signed.uploadUrl)
    request.timeout = 300_000
    request.setRequestHeader("X-Unique-Upload-Id", uploadId)
    request.setRequestHeader(
      "Content-Range",
      `bytes ${start}-${endExclusive - 1}/${originalFile.size}`,
    )

    const diagnostics = (
      eventType: UploadDiagnostics["eventType"],
      loaded = 0,
    ): UploadDiagnostics => {
      const bytesUploaded = Math.min(start + loaded, originalFile.size)
      const percentage = Math.round((bytesUploaded / originalFile.size) * 100)
      return {
        stage: "cloudinary_upload",
        eventType,
        readyState: request.readyState,
        httpStatus: request.status,
        statusText: request.statusText,
        responseText: truncate(request.responseText || ""),
        cloudinaryMessage: readCloudinaryMessage(request.responseText || ""),
        fileName: originalFile.name,
        fileType: originalFile.type,
        fileSize: originalFile.size,
        bytesUploaded,
        totalBytes: originalFile.size,
        percentage,
        endpoint: signed.uploadUrl,
        resourceType: signed.resourceType,
        formDataFields,
        responseHeaders: request.readyState === XMLHttpRequest.DONE
          ? readSafeResponseHeaders(request)
          : {},
      }
    }

    request.upload.onprogress = (event) => {
      const state = diagnostics("progress", event.loaded)
      onProgress?.(state.percentage)
      onDiagnostics?.(state)
    }
    request.onerror = () => {
      const state = diagnostics("error")
      onDiagnostics?.(state)
      reject(new UploadPipelineError("network_error", "Cloudinary chunk upload failed before a response.", state))
    }
    request.onabort = () => {
      const state = diagnostics("abort")
      onDiagnostics?.(state)
      reject(new UploadPipelineError("abort", "Cloudinary chunk upload was aborted.", state))
    }
    request.ontimeout = () => {
      const state = diagnostics("timeout")
      onDiagnostics?.(state)
      reject(new UploadPipelineError("timeout", "Cloudinary chunk upload timed out.", state))
    }
    request.onload = () => {
      const state = diagnostics("load", chunk.size)
      onDiagnostics?.(state)
      let payload: CloudinaryChunkResult
      try {
        payload = JSON.parse(request.responseText) as CloudinaryChunkResult
      } catch {
        reject(new UploadPipelineError("http_error", "Cloudinary returned invalid chunk JSON.", state))
        return
      }
      if (request.status < 200 || request.status >= 300 || payload.error) {
        const cloudinaryMessage = payload.error?.message || null
        reject(new UploadPipelineError(
          "cloudinary_api_error",
          `Cloudinary chunk upload failed (${request.status}): ${describeCloudinaryFailure(cloudinaryMessage, request.statusText || "Unknown error")}`,
          state,
        ))
        return
      }
      onProgress?.(state.percentage)
      resolve(payload)
    }

    request.send(formData)
  })
}

export function getVideoThumbnailUrl(cloudName: string, publicId: string) {
  const encodedPublicId = publicId.split("/").map(encodeURIComponent).join("/")
  return `https://res.cloudinary.com/${encodeURIComponent(cloudName)}/video/upload/so_0,w_960,c_limit/${encodedPublicId}.jpg`
}
