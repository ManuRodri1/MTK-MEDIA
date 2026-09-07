"use client"

import { useState } from "react"

import type { Client, Project, Service } from "@/lib/supabase/database.types"

type ProjectFormProps = {
  action: (formData: FormData) => void | Promise<void>
  clients: Client[]
  services: Service[]
  project?: Project
  selectedServiceIds?: string[]
}

const inputClass = "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"

export function ProjectForm({ action, clients, services, project, selectedServiceIds = [] }: ProjectFormProps) {
  const editing = Boolean(project)
  const [clientMode, setClientMode] = useState<"existing" | "new">("existing")

  return (
    <form action={action} className="space-y-7">
      {project ? <input name="id" type="hidden" value={project.id} /> : null}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold">Client</h2>
        {!editing ? (
          <div className="mt-4 flex gap-2">
            <button className={`rounded-md px-3 py-2 text-sm font-semibold ${clientMode === "existing" ? "bg-slate-950 text-white" : "border border-slate-300"}`} onClick={() => setClientMode("existing")} type="button">Select client</button>
            <button className={`rounded-md px-3 py-2 text-sm font-semibold ${clientMode === "new" ? "bg-slate-950 text-white" : "border border-slate-300"}`} onClick={() => setClientMode("new")} type="button">+ Create new client</button>
          </div>
        ) : null}
        <input name="client_mode" type="hidden" value={clientMode} />

        {editing || clientMode === "existing" ? (
          <label className="mt-4 block text-sm font-medium">
            Client *
            <select className={inputClass} defaultValue={project?.client_id || ""} name="client_id" required>
              <option value="">Select a client</option>
              {clients.map((client) => <option key={client.id} value={client.id}>{client.name}{client.is_active ? "" : " (inactive)"}</option>)}
            </select>
          </label>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">Client name *<input className={inputClass} name="new_client_name" required /></label>
            <label className="block text-sm font-medium">Client slug<input className={inputClass} name="new_client_slug" placeholder="generated-from-name" /></label>
            <label className="block text-sm font-medium sm:col-span-2">Description<textarea className={inputClass} name="new_client_description" rows={3} /></label>
            <label className="block text-sm font-medium">Website<input className={inputClass} name="new_client_website_url" type="url" /></label>
            <label className="block text-sm font-medium">Instagram<input className={inputClass} name="new_client_instagram_url" type="url" /></label>
            <label className="block text-sm font-medium sm:col-span-2">Logo URL<input className={inputClass} name="new_client_logo_url" type="url" /></label>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold">Project details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">Project name *<input className={inputClass} defaultValue={project?.title || ""} name="title" required /></label>
          <label className="block text-sm font-medium">Slug<input className={inputClass} defaultValue={project?.slug || ""} name="slug" placeholder="generated-from-name" /></label>
          <label className="block text-sm font-medium sm:col-span-2">Short description<textarea className={inputClass} defaultValue={project?.short_description || ""} name="short_description" rows={2} /></label>
          <label className="block text-sm font-medium sm:col-span-2">Full description<textarea className={inputClass} defaultValue={project?.description || ""} name="description" rows={7} /></label>
          <label className="block text-sm font-medium">Project type *
            <select className={inputClass} defaultValue={project?.project_type || "mixed"} name="project_type" required>
              <option value="photography">Photography</option>
              <option value="video">Video</option>
              <option value="mixed">Mixed</option>
            </select>
          </label>
          <label className="block text-sm font-medium">Status *
            <select className={inputClass} defaultValue={project?.status || "draft"} name="status" required>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label className="block text-sm font-medium">Project date<input className={inputClass} defaultValue={project?.project_date || ""} name="project_date" type="date" /></label>
          <label className="block text-sm font-medium">Sort order<input className={inputClass} defaultValue={project?.sort_order || 0} min="0" name="sort_order" type="number" /></label>
          <label className="block text-sm font-medium">Instagram URL<input className={inputClass} defaultValue={project?.instagram_url || ""} name="instagram_url" type="url" /></label>
          <label className="block text-sm font-medium">External URL<input className={inputClass} defaultValue={project?.external_url || ""} name="external_url" type="url" /></label>
          <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2"><input defaultChecked={project?.is_featured || false} name="is_featured" type="checkbox" /> Featured project</label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold">Services</h2>
        <p className="mt-1 text-sm text-slate-500">Select every service delivered for this project.</p>
        {services.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <label key={service.id} className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm font-medium">
                <input defaultChecked={selectedServiceIds.includes(service.id)} name="service_ids" type="checkbox" value={service.id} />
                <span>{service.name}{service.is_active ? "" : " (inactive)"}</span>
              </label>
            ))}
          </div>
        ) : <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">Create services first, or save the project without services.</p>}
      </section>

      <div className="flex justify-end">
        <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700" type="submit">
          {editing ? "Save project" : "Create project"}
        </button>
      </div>
    </form>
  )
}
