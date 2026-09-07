import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Film } from "lucide-react"

import { AdminNotice } from "@/components/admin/AdminNotice"
import { DeleteWorkButton } from "@/components/admin/DeleteWorkButton"
import { requireStaff } from "@/lib/admin/auth"

import { setWorkPublishedAction } from "../actions"

type PageProps = { searchParams: Promise<{ error?: string; success?: string }> }

export default async function WorkPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { supabase } = await requireStaff()
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id,title,status,instagram_url,sort_order,updated_at")
    .eq("project_type", "video")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false })
  const ids = (projects || []).map((project) => project.id)
  const mediaResult = ids.length
    ? await supabase.from("project_media").select("id,project_id,media_type,thumbnail_url,cloudinary_url,sort_order,processing_status").in("project_id", ids).order("sort_order")
    : { data: [], error: null }
  const media = mediaResult.data || []

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold text-blue-700">MTK Media</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Work</h1><p className="mt-2 text-slate-600">Upload, publish, and order the videos shown on the website.</p></div>
        <Link href="/admin/projects/new" className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue-700 px-5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">+ Add video</Link>
      </div>

      <div className="mt-7"><AdminNotice error={params.error || error?.message || mediaResult.error?.message} success={params.success} /></div>

      <div className="mt-5 space-y-3">
        {(projects || []).map((project, index) => {
          const projectMedia = media.filter((item) => item.project_id === project.id)
          const video = projectMedia.find((item) => item.media_type === "video" && item.processing_status === "ready")
          const poster = video?.thumbnail_url || null
          return <article key={project.id} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[3rem_6rem_minmax(0,1fr)_auto] sm:items-center sm:p-5">
            <p className="text-sm font-semibold tabular-nums text-slate-500">{String(index + 1).padStart(2, "0")}</p>
            <div className="relative aspect-[9/16] overflow-hidden rounded-md bg-slate-950">
              {poster ? <Image src={poster} alt="" fill sizes="96px" className="object-cover" /> : <Film className="absolute inset-0 m-auto h-6 w-6 text-slate-500" aria-hidden="true" />}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-lg font-bold">{project.title}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${project.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{project.status === "published" ? "Published" : "Draft"}</span></div>
              {project.instagram_url ? <a className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-blue-700 hover:underline" href={project.instagram_url} target="_blank" rel="noopener noreferrer">Instagram <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a> : <p className="mt-2 text-sm text-red-700">Instagram URL missing</p>}
            </div>
            <div className="flex flex-wrap items-center gap-1 sm:justify-end">
              <Link className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600" href={`/admin/projects/${project.id}`}>Edit</Link>
              <form action={setWorkPublishedAction}><input name="id" type="hidden" value={project.id} /><input name="published" type="hidden" value={project.status === "published" ? "false" : "true"} /><button className="min-h-11 rounded-md px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600" type="submit">{project.status === "published" ? "Unpublish" : "Publish"}</button></form>
              <DeleteWorkButton id={project.id} title={project.title} mediaIds={projectMedia.map((item) => item.id)} />
            </div>
          </article>
        })}
        {!projects?.length ? <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center"><Film className="mx-auto h-7 w-7 text-slate-400" aria-hidden="true" /><h2 className="mt-3 font-bold">No work videos yet</h2><p className="mt-1 text-sm text-slate-500">Add the first video and it can be live in one publish.</p><Link className="mt-5 inline-flex min-h-11 items-center rounded-md bg-blue-700 px-5 text-sm font-semibold text-white" href="/admin/projects/new">Add video</Link></div> : null}
      </div>
    </div>
  )
}
