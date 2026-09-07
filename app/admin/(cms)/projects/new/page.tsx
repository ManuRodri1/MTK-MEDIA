import Link from "next/link"

import { AdminNotice } from "@/components/admin/AdminNotice"
import { WorkCreateForm } from "@/components/admin/WorkCreateForm"

type PageProps = { searchParams: Promise<{ error?: string; success?: string }> }

export default async function NewProjectPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/projects" className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-700">← Back to work</Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Add work</h1>
      <p className="mt-2 text-slate-600">Choose a video, paste its Instagram link, and publish.</p>
      <div className="mt-6"><AdminNotice error={params.error} success={params.success} /></div>
      <WorkCreateForm />
    </div>
  )
}
