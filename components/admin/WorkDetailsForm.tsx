import type { Project } from "@/lib/supabase/database.types"

const fieldClass = "mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-2 outline-transparent outline-offset-1 hover:bg-slate-50 focus-visible:border-slate-800 focus-visible:outline-blue-600"

export function WorkDetailsForm({ work, action }: { work: Project; action: (formData: FormData) => void | Promise<void> }) {
  return (
    <form action={action} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <input name="id" type="hidden" value={work.id} />
      <div className="grid gap-5">
        <label className="text-sm font-semibold text-slate-800">Title<input className={fieldClass} name="title" required defaultValue={work.title} /></label>
        <label className="text-sm font-semibold text-slate-800">Instagram URL<input className={fieldClass} name="instagram_url" type="url" required defaultValue={work.instagram_url || ""} placeholder="https://www.instagram.com/reel/…" /></label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-800">Order<input className={fieldClass} name="sort_order" type="number" min="0" defaultValue={work.sort_order} /></label>
          <label className="flex min-h-11 items-center gap-3 self-end rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-800">
            <input className="h-4 w-4 accent-blue-700" name="published" type="checkbox" defaultChecked={work.status === "published"} /> Published
          </label>
        </div>
        <div className="flex justify-end"><button className="min-h-11 rounded-md bg-blue-700 px-5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:translate-y-px" type="submit">Save work</button></div>
      </div>
    </form>
  )
}
