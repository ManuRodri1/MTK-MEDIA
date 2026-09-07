"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { MediaCard } from "@/components/admin/MediaCard"
import { MediaUploader } from "@/components/admin/MediaUploader"
import { Button } from "@/components/ui/button"
import type { ProjectMedia } from "@/lib/supabase/database.types"
import { createClient } from "@/lib/supabase/client"

type MediaTestClientProps = {
  userEmail: string
  projectId: string
  initialMedia: ProjectMedia[]
}

export function MediaTestClient({ userEmail, projectId, initialMedia }: MediaTestClientProps) {
  const router = useRouter()
  const [media, setMedia] = useState(initialMedia)
  const [loggingOut, setLoggingOut] = useState(false)
  const [notice, setNotice] = useState("")

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace("/admin/login")
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">MTK Media</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Cloudinary Integration Test</h1>
            <p className="mt-2 text-sm text-slate-600">
              Signed direct uploads for <code>mtk-cloudinary-integration-test</code>
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <span className="max-w-56 truncate text-sm text-slate-600" title={userEmail}>{userEmail}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? "Logging out…" : "Logout"}
            </Button>
          </div>
        </header>

        <MediaUploader
          projectId={projectId}
          onSaved={(savedMedia) => {
            setNotice("")
            setMedia((currentMedia) =>
              [...currentMedia.filter((item) => item.id !== savedMedia.id), savedMedia].sort(
                (a, b) => a.sort_order - b.sort_order,
              ),
            )
          }}
        />

        {notice ? <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800" role="status">{notice}</p> : null}

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Existing media</h2>
              <p className="mt-1 text-sm text-slate-600">Persisted rows ordered by sort_order.</p>
            </div>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
              {media.length} {media.length === 1 ? "asset" : "assets"}
            </span>
          </div>

          {media.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {media.map((item) => <MediaCard key={item.id} media={item} onDeleted={(deleted) => {
                setMedia((current) => current.filter((item) => item.id !== deleted.id))
                setNotice(`${deleted.original_filename || "File"} was deleted from Cloudinary and this project.`)
              }} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No media has been saved for this project yet.
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
