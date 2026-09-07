"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { deleteWorkRecordAction } from "@/app/admin/(cms)/actions"
import { deleteProjectMedia } from "@/lib/cloudinary/delete"
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

export function DeleteWorkButton({ id, title, mediaIds }: { id: string; title: string; mediaIds: string[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function remove() {
    setBusy(true)
    setError("")
    try {
      for (const mediaId of mediaIds) await deleteProjectMedia(mediaId)
      const result = await deleteWorkRecordAction(id)
      if (!result.ok) throw new Error(result.error || "The work could not be deleted.")
      router.push(`/admin/projects?success=${encodeURIComponent("Work deleted.")}`)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The work could not be deleted.")
      setBusy(false)
    }
  }

  return <AlertDialog>
    <AlertDialogTrigger className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600">Delete</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader><AlertDialogTitle>Delete “{title}”?</AlertDialogTitle><AlertDialogDescription>This permanently removes its uploaded media from Cloudinary and deletes the work record. This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
      {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
      <AlertDialogFooter><AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel><AlertDialogAction className="bg-red-700 text-white hover:bg-red-800" disabled={busy} onClick={(event) => { event.preventDefault(); void remove() }}>{busy ? "Deleting…" : "Delete work"}</AlertDialogAction></AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
}
