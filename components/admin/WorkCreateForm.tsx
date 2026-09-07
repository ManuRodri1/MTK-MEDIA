"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState, type FormEvent } from "react"
import { Check, Film, LoaderCircle, UploadCloud } from "lucide-react"

import { createWorkDraftAction, finishWorkAction } from "@/app/admin/(cms)/actions"
import { uploadProjectMedia } from "@/lib/admin/project-media-upload"

const fieldClass = "mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-2 outline-transparent outline-offset-1 hover:bg-slate-50 focus-visible:border-slate-800 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-55"

export function WorkCreateForm() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState("")
  const [error, setError] = useState("")
  const [draftId, setDraftId] = useState<string | null>(null)
  const [published, setPublished] = useState(true)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || !file) return
    const form = new FormData(event.currentTarget)
    setBusy(true)
    setError("")
    setProgress(0)

    try {
      setStage("Creating work")
      const created = await createWorkDraftAction({
        title: String(form.get("title") || ""),
        filename: file.name,
        instagramUrl: String(form.get("instagram_url") || ""),
        sortOrder: Number(form.get("sort_order") || 0),
      })
      if (!created.id) throw new Error(created.error || "The work record could not be created.")
      setDraftId(created.id)

      setStage("Uploading video")
      await uploadProjectMedia({
        projectId: created.id,
        file,
        onProgress: setProgress,
        onDiagnostic: (entry) => {
          if (entry.stage === "supabase_insert") setStage("Saving video")
        },
      })

      const publishNow = form.get("published") === "on"
      setStage(publishNow ? "Publishing" : "Saving draft")
      const finished = await finishWorkAction({ id: created.id, published: publishNow })
      if (!finished.ok) throw new Error(finished.error || "The work could not be saved.")

      router.push(`/admin/projects?success=${encodeURIComponent(publishNow ? "Work published." : "Draft saved.")}`)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The work could not be saved. Try again.")
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6" aria-busy={busy}>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-5">
          <label className="text-sm font-semibold text-slate-800">
            Title <span className="font-normal text-slate-500">(optional)</span>
            <input className={fieldClass} name="title" placeholder="Uses the video filename when empty" disabled={busy} />
          </label>

          <label className="text-sm font-semibold text-slate-800">
            Video
            <span className={`mt-2 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-5 text-center ${file ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50"} ${busy ? "cursor-not-allowed opacity-55" : "hover:border-slate-500"}`}>
              {file ? <Film className="h-8 w-8 text-blue-700" aria-hidden="true" /> : <UploadCloud className="h-8 w-8 text-slate-500" aria-hidden="true" />}
              <span className="mt-3 font-medium text-slate-900">{file?.name || "Choose an MP4, MOV, or WEBM video"}</span>
              <span className="mt-1 font-normal text-slate-500">Large videos upload in secure chunks.</span>
              <input ref={fileRef} className="sr-only" type="file" name="video" required accept=".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm" disabled={busy} onChange={(event) => { setFile(event.target.files?.[0] || null); setError("") }} />
            </span>
          </label>

          <label className="text-sm font-semibold text-slate-800">
            Instagram URL
            <input className={fieldClass} name="instagram_url" type="url" inputMode="url" required placeholder="https://www.instagram.com/reel/…" disabled={busy} />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-800">
              Order <span className="font-normal text-slate-500">(optional)</span>
              <input className={fieldClass} name="sort_order" type="number" min="0" defaultValue="0" disabled={busy} />
            </label>
            <label className="flex min-h-11 items-center gap-3 self-end rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-800">
              <input className="h-4 w-4 accent-blue-700" name="published" type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} disabled={busy} />
              Publish when upload finishes
            </label>
          </div>

          <p className="text-sm text-slate-500">A poster is generated automatically from the uploaded video.</p>
        </div>
      </section>

      {stage ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4" role="status" aria-live="polite">
          <div className="flex items-center gap-3 text-sm font-semibold text-blue-900">
            {busy ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
            {stage}{stage.includes("Upload") || stage.includes("video") ? ` · ${progress}%` : ""}
          </div>
          {progress > 0 && progress < 100 ? <progress className="mt-3 h-2 w-full accent-blue-700" max="100" value={progress}>{progress}%</progress> : null}
        </div>
      ) : null}

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{error}{draftId ? <> The draft is safe. <Link className="font-semibold underline" href={`/admin/projects/${draftId}`}>Open it to retry.</Link></> : null}</div> : null}

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Link className="inline-flex min-h-11 items-center px-4 text-sm font-semibold text-slate-600 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600" href="/admin/projects">Cancel</Link>
        <button className="inline-flex min-h-11 min-w-32 items-center justify-center rounded-md bg-blue-700 px-5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55" type="submit" disabled={busy || !file}>
          {busy ? stage : published ? "Publish" : "Save draft"}
        </button>
      </div>
    </form>
  )
}
