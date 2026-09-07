"use client"

import { useRef, useState, type ChangeEvent, type DragEvent } from "react"
import { UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  LARGE_UPLOAD_CHUNK_BYTES,
  MAX_SIMPLE_VIDEO_BYTES,
  shouldUseChunkedCloudinaryUpload,
  UploadPipelineError,
  type UploadDiagnostics,
} from "@/lib/cloudinary/upload"
import { supportedMediaMimeTypes, uploadProjectMedia } from "@/lib/admin/project-media-upload"
import type { ProjectMedia } from "@/lib/supabase/database.types"

type UploadState =
  | "Idle"
  | "Requesting signature"
  | "Uploading"
  | "Saving metadata"
  | "Complete"
  | "Error"

type MediaUploaderProps = {
  projectId: string
  onSaved: (media: ProjectMedia) => void
  videoOnly?: boolean
}

type DiagnosticEntry = Record<string, unknown>

function formatBytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export function MediaUploader({ projectId, onSaved, videoOnly = false }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [state, setState] = useState<UploadState>("Idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [diagnostics, setDiagnostics] = useState<DiagnosticEntry[]>([])
  const busy = ["Requesting signature", "Uploading", "Saving metadata"].includes(state)
  const largeUploadSelected = Boolean(
    file && shouldUseChunkedCloudinaryUpload("video", file.size) && file.type.startsWith("video/"),
  )

  function updateDiagnostics(next: DiagnosticEntry | UploadDiagnostics) {
    const stage = String(next.stage || "unknown")
    setDiagnostics((current) => {
      const existingIndex = current.findIndex((entry) => String(entry.stage) === stage)
      if (existingIndex === -1) return [...current, next]

      const updated = [...current]
      updated[existingIndex] = next
      return updated
    })
  }

  function selectFile(nextFile: File | undefined) {
    setError("")
    setProgress(0)
    setState("Idle")
    setDiagnostics([])

    if (!nextFile) {
      setFile(null)
      return
    }

    if (!supportedMediaMimeTypes.has(nextFile.type) || (videoOnly && !nextFile.type.startsWith("video/"))) {
      setFile(null)
      setState("Error")
      setError(videoOnly ? "Choose an MP4, MOV, or WEBM video." : "Choose a JPG, PNG, WEBP, MP4, MOV, or WEBM file.")
      return
    }

    setFile(nextFile)

    if (nextFile.type.startsWith("video/") && nextFile.size > MAX_SIMPLE_VIDEO_BYTES) {
      updateDiagnostics({
        stage: "file_validation",
        eventType: "chunked_upload_selected",
        fileName: nextFile.name,
        fileType: nextFile.type,
        fileSize: nextFile.size,
        maximumSimpleUploadBytes: MAX_SIMPLE_VIDEO_BYTES,
        chunkBytes: LARGE_UPLOAD_CHUNK_BYTES,
      })
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0])
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (busy) return
    setDragActive(false)
    selectFile(event.dataTransfer.files?.[0])
  }

  async function handleUpload() {
    if (!file || busy) return
    setError("")
    setProgress(0)
    setDiagnostics([])

    try {
      setState("Requesting signature")
      setState("Uploading")
      const saved = await uploadProjectMedia({
        projectId,
        file,
        onProgress: (nextProgress) => setProgress((currentProgress) => Math.max(currentProgress, nextProgress)),
        onDiagnostic: (entry) => {
          updateDiagnostics(entry)
          if (entry.stage === "supabase_insert") setState("Saving metadata")
        },
      })
      setState("Complete")
      setProgress(100)
      setFile(null)
      if (inputRef.current) inputRef.current.value = ""
      onSaved(saved)
    } catch (caughtError) {
      setState("Error")

      if (caughtError instanceof UploadPipelineError) {
        setError(`[${caughtError.code}] ${caughtError.message}`)
        updateDiagnostics(caughtError.diagnostics)
        console.error("[Gate 0 upload]", caughtError.code, caughtError.diagnostics)
      } else {
        const message = caughtError instanceof Error ? caughtError.message : "Unexpected upload error"
        setError(message)
        updateDiagnostics({ stage: "unknown", eventType: "error", message })
      }
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50"
        } ${busy ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        onClick={() => !busy && inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault()
          if (!busy) setDragActive(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={busy ? -1 : 0}
        onKeyDown={(event) => {
          if (!busy && (event.key === "Enter" || event.key === " ")) inputRef.current?.click()
        }}
      >
        <UploadCloud className="mx-auto h-9 w-9 text-slate-500" aria-hidden="true" />
        <p className="mt-3 font-medium text-slate-900">
          {file ? file.name : videoOnly ? "Drop a video here, or choose a file" : "Drop one image or video here, or choose a file"}
        </p>
        <p className="mt-1 text-sm text-slate-500">{videoOnly ? "MP4, MOV, or WEBM" : "JPG, PNG, WEBP, MP4, MOV, or WEBM"}</p>
        <p className="mt-1 text-xs text-slate-500">
          Videos over 100 MB use chunked upload. Cloudinary account limits still apply.
        </p>
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept={videoOnly ? ".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm" : ".jpg,.jpeg,.png,.webp,.mp4,.mov,.webm,image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"}
          onChange={handleFileChange}
          disabled={busy}
        />
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Status: {state}</p>
          {error ? <p className="mt-1 max-w-2xl text-sm text-red-700" role="alert">{error}</p> : null}
          {largeUploadSelected && state === "Idle" ? (
            <p className="mt-1 text-sm text-blue-700">
              {formatBytes(file?.size ?? 0)} video ready. It will upload in {formatBytes(LARGE_UPLOAD_CHUNK_BYTES)} parts.
            </p>
          ) : null}
          {largeUploadSelected && state === "Uploading" ? (
            <p className="mt-1 text-sm text-blue-700">Large-file upload active. Keep this tab open until it reaches 100%.</p>
          ) : null}
          {state === "Complete" ? (
            <p className="mt-1 text-sm text-emerald-700">Video uploaded and saved.</p>
          ) : null}
        </div>
        <Button type="button" onClick={handleUpload} disabled={!file || busy}>
          {busy ? state : "Upload file"}
        </Button>
      </div>

      {state === "Uploading" ? (
        <div className="mt-4" aria-label={`Upload progress ${progress}%`}>
          <Progress value={progress} />
          <p className="mt-1 text-right text-xs text-slate-500">{progress}%</p>
        </div>
      ) : null}

      {process.env.NODE_ENV === "development" && diagnostics.length > 0 ? (
        <details className="mt-5 rounded-lg border border-slate-200 bg-slate-950 p-4 text-slate-100" open={state === "Error"}>
          <summary className="cursor-pointer text-sm font-semibold">Gate 0 diagnostics</summary>
          <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-all text-xs" data-testid="upload-diagnostics">
            {JSON.stringify(diagnostics, null, 2)}
          </pre>
        </details>
      ) : null}
    </section>
  )
}
