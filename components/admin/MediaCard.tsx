"use client"

import { useState, type MouseEvent } from "react"
import { Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteProjectMedia } from "@/lib/cloudinary/delete"
import type { ProjectMedia } from "@/lib/supabase/database.types"

type MediaCardProps = {
  media: ProjectMedia
  onDeleted: (media: ProjectMedia) => void
  simple?: boolean
}

function formatBytes(bytes: number | null) {
  if (bytes === null) return "Unknown size"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDuration(seconds: number | null) {
  if (seconds === null) return "Unknown duration"
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function MediaCard({ media, onDeleted, simple = false }: MediaCardProps) {
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")
  const filename = media.original_filename
    ? `${media.original_filename}${media.format ? `.${media.format}` : ""}`
    : "Untitled asset"
  const dimensions = media.width && media.height ? `${media.width} × ${media.height}` : "Unknown dimensions"

  async function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (deleting) return

    setDeleting(true)
    setDeleteError("")

    try {
      await deleteProjectMedia(media.id)
      setConfirmationOpen(false)
      setDeleting(false)
      onDeleted(media)
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Unable to delete this file.")
      setDeleting(false)
    }
  }

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className={simple ? "mx-auto aspect-[9/16] max-h-[34rem] bg-slate-950" : "aspect-video bg-slate-950"}>
        {media.media_type === "video" && media.cloudinary_url ? (
          <video
            className="h-full w-full object-contain"
            src={media.cloudinary_url}
            poster={media.thumbnail_url || undefined}
            controls
            preload="metadata"
          />
        ) : media.cloudinary_url ? (
          // Cloudinary assets are intentionally served without Next Image optimization.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="h-full w-full object-contain"
            src={media.cloudinary_url}
            alt={media.alt_text || filename}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">Preview unavailable</div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="break-words font-medium text-slate-950">{filename}</p>
          {!simple ? <p className="mt-1 text-sm text-slate-500">
            {media.media_type === "video" ? `${formatDuration(media.duration_seconds)} · ` : ""}
            {dimensions} · {(media.format || "unknown").toUpperCase()} · {formatBytes(media.bytes)}
          </p> : null}
        </div>

        {!simple ? <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cloudinary public_id</p>
          <code className="mt-1 block break-all text-xs text-slate-700">
            {media.cloudinary_public_id || "Not available"}
          </code>
        </div> : null}

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
          <p className="text-xs text-slate-500">Remove this file before uploading its replacement.</p>
          <AlertDialog open={confirmationOpen} onOpenChange={(open) => { if (!deleting) { setConfirmationOpen(open); if (open) setDeleteError("") } }}>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" size="sm" aria-label={`Delete ${filename}`}>
                <Trash2 aria-hidden="true" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this file?</AlertDialogTitle>
                <AlertDialogDescription>
                  <span className="font-medium text-slate-900">{filename}</span> will be permanently removed from Cloudinary and this project. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {deleteError ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-800" role="alert">{deleteError}</p> : null}
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" disabled={deleting} onClick={handleDelete}>
                  {deleting ? "Deleting…" : "Delete permanently"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </article>
  )
}
