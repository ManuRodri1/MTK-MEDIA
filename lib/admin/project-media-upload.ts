"use client"

import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from "@supabase/supabase-js"

import {
  getVideoThumbnailUrl,
  shouldUseChunkedCloudinaryUpload,
  uploadToCloudinary,
  uploadToCloudinaryChunked,
  UploadPipelineError,
  validateCloudinarySignature,
  type MediaType,
  type UploadDiagnostics,
} from "@/lib/cloudinary/upload"
import { createClient } from "@/lib/supabase/client"
import type { ProjectMedia } from "@/lib/supabase/database.types"

export const supportedMediaMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/webm",
])

type DiagnosticEntry = Record<string, unknown>

function truncate(value: string, maximumLength = 2_000) {
  return value.length > maximumLength ? `${value.slice(0, maximumLength)}…` : value
}

function safeSupabaseError(error: { code?: string; message: string; details?: string; hint?: string }) {
  return {
    code: error.code || null,
    message: error.message,
    details: error.details || null,
    hint: error.hint || null,
  }
}

async function createSignatureRequestError(error: unknown) {
  const diagnostics: DiagnosticEntry = { stage: "signature", eventType: "error" }

  if (error instanceof FunctionsHttpError) {
    const response = error.context
    diagnostics.httpStatus = response.status
    diagnostics.statusText = response.statusText
    diagnostics.sbErrorCode = response.headers.get("sb-error-code")
    diagnostics.responseText = truncate(await response.clone().text())
  } else if (error instanceof FunctionsRelayError) {
    diagnostics.eventType = "relay_error"
  } else if (error instanceof FunctionsFetchError) {
    diagnostics.eventType = "fetch_error"
  }

  const message = error instanceof Error ? error.message : "Unknown signature request error"
  return new UploadPipelineError("signature_error", `Unable to request upload signature: ${message}`, diagnostics)
}

type UploadProjectMediaOptions = {
  projectId: string
  file: File
  onProgress?: (progress: number) => void
  onDiagnostic?: (diagnostic: DiagnosticEntry | UploadDiagnostics) => void
}

export async function uploadProjectMedia({ projectId, file, onProgress, onDiagnostic }: UploadProjectMediaOptions): Promise<ProjectMedia> {
  if (!supportedMediaMimeTypes.has(file.type)) {
    throw new UploadPipelineError("http_error", "Choose a supported image or video file.", { stage: "file_validation", eventType: "unsupported_type" })
  }

  const mediaType: MediaType = file.type.startsWith("video/") ? "video" : "image"
  const supabase = createClient()
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session) {
    throw new UploadPipelineError("signature_error", "Your session expired. Sign in again.", { stage: "signature", eventType: "missing_session" })
  }

  const { data: signedPayload, error: signatureError } = await supabase.functions.invoke<unknown>("cloudinary-signature", {
    body: { projectId, mediaType },
    headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
  })
  if (signatureError) throw await createSignatureRequestError(signatureError)

  const signed = validateCloudinarySignature(signedPayload, mediaType)
  onDiagnostic?.({
    stage: "signature",
    eventType: "success",
    cloudName: signed.cloudName,
    resourceType: signed.resourceType,
    uploadUrl: signed.uploadUrl,
  })

  const upload = shouldUseChunkedCloudinaryUpload(mediaType, file.size)
    ? uploadToCloudinaryChunked
    : uploadToCloudinary
  const uploaded = await upload(file, signed, onProgress ?? (() => {}), onDiagnostic ?? (() => {}))

  const { data: lastMedia, error: orderError } = await supabase
    .from("project_media")
    .select("id,sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (orderError) {
    throw new UploadPipelineError("supabase_insert_error", "The file uploaded, but its record could not be saved.", {
      stage: "supabase_insert",
      eventType: "sort_order_error",
      cloudinaryAsset: { assetId: uploaded.asset_id, publicId: uploaded.public_id, secureUrl: uploaded.secure_url },
      supabaseError: safeSupabaseError(orderError),
      orphanAsset: true,
    })
  }

  const firstAsset = !lastMedia
  const thumbnailUrl = mediaType === "video"
    ? getVideoThumbnailUrl(signed.cloudName, uploaded.public_id)
    : uploaded.secure_url
  const { data: saved, error: saveError } = await supabase
    .from("project_media")
    .insert({
      project_id: projectId,
      media_type: mediaType,
      media_role: firstAsset ? "hero" : "gallery",
      cloudinary_asset_id: uploaded.asset_id,
      cloudinary_public_id: uploaded.public_id,
      cloudinary_url: uploaded.secure_url,
      thumbnail_url: thumbnailUrl,
      original_filename: uploaded.original_filename || file.name.replace(/\.[^.]+$/, ""),
      format: uploaded.format || file.name.split(".").pop()?.toLowerCase() || null,
      width: uploaded.width ?? null,
      height: uploaded.height ?? null,
      bytes: uploaded.bytes ?? file.size,
      duration_seconds: mediaType === "video" ? uploaded.duration ?? null : null,
      processing_status: "ready",
      is_cover: firstAsset,
      sort_order: (lastMedia?.sort_order ?? -1) + 1,
    })
    .select("*")
    .single()

  if (saveError || !saved) {
    throw new UploadPipelineError("supabase_insert_error", "The file uploaded, but its record could not be saved.", {
      stage: "supabase_insert",
      eventType: "insert_error",
      cloudinaryAsset: { assetId: uploaded.asset_id, publicId: uploaded.public_id, secureUrl: uploaded.secure_url },
      supabaseError: saveError ? safeSupabaseError(saveError) : null,
      orphanAsset: true,
    })
  }

  onDiagnostic?.({ stage: "supabase_insert", eventType: "success", rowId: saved.id, projectId, mediaType })
  return saved
}
