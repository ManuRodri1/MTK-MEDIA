"use client"

import { useState } from "react"

import type { ProjectMedia } from "@/lib/supabase/database.types"

import { MediaCard } from "./MediaCard"
import { MediaUploader } from "./MediaUploader"

type ProjectMediaSectionProps = {
  projectId: string
  initialMedia: ProjectMedia[]
  videoOnly?: boolean
}

export function ProjectMediaSection({ projectId, initialMedia, videoOnly = false }: ProjectMediaSectionProps) {
  const [media, setMedia] = useState(() => [...initialMedia].sort((left, right) => left.sort_order - right.sort_order))
  const [notice, setNotice] = useState("")

  const addMedia = (saved: ProjectMedia) => {
    setNotice("")
    setMedia((current) => [...current.filter((item) => item.id !== saved.id), saved].sort((left, right) => left.sort_order - right.sort_order))
  }

  const removeMedia = (deleted: ProjectMedia) => {
    setMedia((current) => current.filter((item) => item.id !== deleted.id))
    setNotice(`${deleted.original_filename || "File"} was deleted from Cloudinary and this project.`)
  }

  return (
    <section className="mt-8 space-y-5" aria-labelledby="project-media-title">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" id="project-media-title">Video</h2>
        <p className="mt-1 text-sm text-slate-600">
          {videoOnly ? "Upload a replacement after removing the current video." : "Upload images and videos. New assets are appended to the current media order."}
        </p>
      </div>

      {!videoOnly || !media.some((item) => item.media_type === "video") ? (
        <MediaUploader projectId={projectId} onSaved={addMedia} videoOnly={videoOnly} />
      ) : (
        <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">Remove the current video before uploading its replacement.</p>
      )}

      {notice ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800" role="status">{notice}</p> : null}

      {media.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {media.map((item) => <MediaCard key={item.id} media={item} onDeleted={removeMedia} simple={videoOnly} />)}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No video has been uploaded yet.
        </p>
      )}
    </section>
  )
}
