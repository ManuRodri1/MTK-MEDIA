import { AdminNotice } from "@/components/admin/AdminNotice"
import { requireStaff } from "@/lib/admin/auth"

import { createClientAction, toggleClientAction, updateClientAction } from "../actions"

type PageProps = {
  searchParams: Promise<{ q?: string; error?: string; success?: string }>
}

const inputClass = "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"

export default async function ClientsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { supabase } = await requireStaff()
  const { data, error } = await supabase.from("clients").select("*").order("sort_order").order("name")
  const query = (params.q || "").toLowerCase()
  const clients = (data || []).filter((client) => !query || client.name.toLowerCase().includes(query) || client.slug.includes(query))

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <p className="text-sm font-semibold text-blue-700">Core data</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Clients</h1>
        <p className="mt-2 text-slate-600">Create, edit and deactivate the companies attached to projects.</p>
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[360px_1fr]">
        <section className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">New client</h2>
          <form action={createClientAction} className="mt-4 space-y-4">
            <label className="block text-sm font-medium">Name *<input className={inputClass} name="name" required /></label>
            <label className="block text-sm font-medium">Slug<input className={inputClass} name="slug" placeholder="generated-from-name" /></label>
            <label className="block text-sm font-medium">Description<textarea className={inputClass} name="description" rows={3} /></label>
            <label className="block text-sm font-medium">Website<input className={inputClass} name="website_url" type="url" /></label>
            <label className="block text-sm font-medium">Instagram<input className={inputClass} name="instagram_url" type="url" /></label>
            <label className="block text-sm font-medium">Logo URL<input className={inputClass} name="logo_url" type="url" /></label>
            <label className="block text-sm font-medium">Sort order<input className={inputClass} defaultValue="0" min="0" name="sort_order" type="number" /></label>
            <label className="flex items-center gap-2 text-sm font-medium"><input defaultChecked name="is_active" type="checkbox" /> Active</label>
            <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700" type="submit">Create client</button>
          </form>
        </section>

        <section>
          <AdminNotice error={params.error || error?.message} success={params.success} />
          <form className="mb-4 flex gap-2" method="get">
            <input className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" defaultValue={params.q} name="q" placeholder="Search clients" />
            <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold" type="submit">Search</button>
          </form>

          <div className="space-y-3">
            {clients.map((client) => (
              <article key={client.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold">{client.name}</h2>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${client.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                        {client.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">/{client.slug}</p>
                  </div>
                  <form action={toggleClientAction}>
                    <input name="id" type="hidden" value={client.id} />
                    <input name="next_active" type="hidden" value={String(!client.is_active)} />
                    <button className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold" type="submit">
                      {client.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </div>

                <details className="mt-4 border-t border-slate-100 pt-3">
                  <summary className="cursor-pointer text-sm font-semibold text-blue-700">Edit client</summary>
                  <form action={updateClientAction} className="mt-4 grid gap-4 sm:grid-cols-2">
                    <input name="id" type="hidden" value={client.id} />
                    <label className="block text-sm font-medium">Name *<input className={inputClass} defaultValue={client.name} name="name" required /></label>
                    <label className="block text-sm font-medium">Slug *<input className={inputClass} defaultValue={client.slug} name="slug" required /></label>
                    <label className="block text-sm font-medium sm:col-span-2">Description<textarea className={inputClass} defaultValue={client.description || ""} name="description" rows={3} /></label>
                    <label className="block text-sm font-medium">Website<input className={inputClass} defaultValue={client.website_url || ""} name="website_url" type="url" /></label>
                    <label className="block text-sm font-medium">Instagram<input className={inputClass} defaultValue={client.instagram_url || ""} name="instagram_url" type="url" /></label>
                    <label className="block text-sm font-medium">Logo URL<input className={inputClass} defaultValue={client.logo_url || ""} name="logo_url" type="url" /></label>
                    <label className="block text-sm font-medium">Sort order<input className={inputClass} defaultValue={client.sort_order} min="0" name="sort_order" type="number" /></label>
                    <label className="flex items-center gap-2 text-sm font-medium"><input defaultChecked={client.is_active} name="is_active" type="checkbox" /> Active</label>
                    <div className="sm:col-span-2"><button className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white" type="submit">Save client</button></div>
                  </form>
                </details>
              </article>
            ))}
            {!clients.length ? <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">No clients found.</p> : null}
          </div>
        </section>
      </div>
    </div>
  )
}
