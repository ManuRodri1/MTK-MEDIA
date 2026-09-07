import Link from "next/link"
import { notFound } from "next/navigation"

import { AdminNotice } from "@/components/admin/AdminNotice"
import { DeleteWorkButton } from "@/components/admin/DeleteWorkButton"
import { ProjectMediaSection } from "@/components/admin/ProjectMediaSection"
import { WorkDetailsForm } from "@/components/admin/WorkDetailsForm"
import { requireStaff } from "@/lib/admin/auth"

import { updateWorkAction } from "../../actions"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; success?: string }>
}

export default async function EditWorkPage({ params, searchParams }: PageProps) {
  const [{ id }, messages] = await Promise.all([params, searchParams])
  const { supabase } = await requireStaff()
  const [workResult, mediaResult] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("project_media").select("*").eq("project_id", id).order("sort_order"),
  ])
  if (!workResult.data) notFound()

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/projects" className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-700">← Back to work</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-3xl font-bold tracking-tight">Edit work</h1><p className="mt-2 text-slate-600">Update the essentials or replace the uploaded video.</p></div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${workResult.data.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{workResult.data.status === "published" ? "Published" : "Draft"}</span>
      </div>
      <div className="mt-6"><AdminNotice error={messages.error} success={messages.success} /></div>
      <WorkDetailsForm work={workResult.data} action={updateWorkAction} />
      <ProjectMediaSection projectId={id} initialMedia={mediaResult.data || []} videoOnly />
      <div className="mt-10 border-t border-slate-300 pt-6"><DeleteWorkButton id={id} title={workResult.data.title} mediaIds={(mediaResult.data || []).map((media) => media.id)} /></div>
    </div>
  )
}
