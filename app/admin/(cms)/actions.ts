"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { requireStaff } from "@/lib/admin/auth"
import { instagramUrlError, titleFromFilename } from "@/lib/admin/work-validation"
import {
  checked,
  field,
  integerField,
  messageUrl,
  optionalField,
  slugify,
} from "@/lib/admin/forms"

const projectTypes = new Set(["photography", "video", "mixed"])
const projectStatuses = new Set(["draft", "published", "archived"])

function errorMessage(error: { message?: string } | null, fallback: string) {
  return error?.message || fallback
}

function done(path: string, message: string): never {
  revalidatePath("/admin")
  redirect(messageUrl(path, "success", message))
}

function fail(path: string, message: string): never {
  redirect(messageUrl(path, "error", message))
}

export async function logoutAction() {
  const { supabase } = await requireStaff()
  await supabase.auth.signOut()
  redirect("/admin/login")
}

function revalidateWork() {
  revalidatePath("/admin")
  revalidatePath("/admin/projects")
  revalidatePath("/")
  revalidatePath("/work")
}

export async function createWorkDraftAction(input: {
  title: string
  filename: string
  instagramUrl: string
  sortOrder: number
}) {
  const { supabase } = await requireStaff()
  const instagramError = instagramUrlError(input.instagramUrl)
  if (instagramError) return { error: instagramError }

  const title = input.title.trim() || titleFromFilename(input.filename)
  const slug = `${slugify(title) || "work"}-${crypto.randomUUID().slice(0, 8)}`
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title,
      slug,
      project_type: "video",
      status: "draft",
      instagram_url: input.instagramUrl.trim(),
      sort_order: Number.isFinite(input.sortOrder) ? Math.max(0, Math.trunc(input.sortOrder)) : 0,
    })
    .select("id")
    .single()

  if (error || !data) return { error: errorMessage(error, "The work record could not be created.") }
  revalidateWork()
  return { id: data.id }
}

export async function finishWorkAction(input: { id: string; published: boolean }) {
  const { supabase } = await requireStaff()
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("instagram_url,published_at")
    .eq("id", input.id)
    .single()
  if (projectError || !project) return { error: "The work record could not be found." }

  if (input.published) {
    const instagramError = instagramUrlError(project.instagram_url || "")
    if (instagramError) return { error: instagramError }
    const { count, error: mediaError } = await supabase
      .from("project_media")
      .select("id", { count: "exact", head: true })
      .eq("project_id", input.id)
      .eq("media_type", "video")
      .eq("processing_status", "ready")
    if (mediaError || !count) return { error: "Upload a ready video before publishing." }
  }

  const { error } = await supabase
    .from("projects")
    .update({
      status: input.published ? "published" : "draft",
      published_at: input.published ? project.published_at || new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
  if (error) return { error: errorMessage(error, "The publishing state could not be saved.") }

  revalidateWork()
  return { ok: true }
}

export async function updateWorkAction(formData: FormData) {
  const { supabase } = await requireStaff()
  const id = field(formData, "id")
  const path = id ? `/admin/projects/${id}` : "/admin/projects"
  const title = field(formData, "title")
  const instagramUrl = field(formData, "instagram_url")
  const instagramError = instagramUrlError(instagramUrl)
  if (!id) fail(path, "The work record is missing its id.")
  if (!title) fail(path, "Add a title before saving this work.")
  if (instagramError) fail(path, instagramError)

  const published = checked(formData, "published")
  if (published) {
    const { count } = await supabase
      .from("project_media")
      .select("id", { count: "exact", head: true })
      .eq("project_id", id)
      .eq("media_type", "video")
      .eq("processing_status", "ready")
    if (!count) fail(path, "Upload a ready video before publishing.")
  }

  const { data: current } = await supabase.from("projects").select("published_at").eq("id", id).single()
  const { error } = await supabase
    .from("projects")
    .update({
      title,
      instagram_url: instagramUrl,
      sort_order: Math.max(0, integerField(formData, "sort_order")),
      status: published ? "published" : "draft",
      published_at: published ? current?.published_at || new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
  if (error) fail(path, errorMessage(error, "The work could not be saved."))

  revalidateWork()
  redirect(messageUrl("/admin/projects", "success", "Work saved."))
}

export async function setWorkPublishedAction(formData: FormData) {
  const id = field(formData, "id")
  const published = field(formData, "published") === "true"
  if (!id) fail("/admin/projects", "The work record is missing its id.")
  const result = await finishWorkAction({ id, published })
  if (result.error) fail("/admin/projects", result.error)
  redirect(messageUrl("/admin/projects", "success", published ? "Work published." : "Work unpublished."))
}

export async function deleteWorkRecordAction(id: string) {
  const { supabase } = await requireStaff()
  const { count } = await supabase.from("project_media").select("id", { count: "exact", head: true }).eq("project_id", id)
  if (count) return { error: "Delete the uploaded media before deleting this work." }
  const { error: relationError } = await supabase.from("project_services").delete().eq("project_id", id)
  if (relationError) return { error: errorMessage(relationError, "The work relationships could not be deleted.") }
  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) return { error: errorMessage(error, "The work record could not be deleted.") }
  revalidateWork()
  return { ok: true }
}

export async function createClientAction(formData: FormData) {
  const { supabase } = await requireStaff()
  const name = field(formData, "name")
  const slug = slugify(field(formData, "slug") || name)

  if (!name || !slug) fail("/admin/clients", "Client name and slug are required.")

  const { error } = await supabase.from("clients").insert({
    name,
    slug,
    description: optionalField(formData, "description"),
    website_url: optionalField(formData, "website_url"),
    instagram_url: optionalField(formData, "instagram_url"),
    logo_url: optionalField(formData, "logo_url"),
    is_active: checked(formData, "is_active"),
    sort_order: integerField(formData, "sort_order"),
  })

  if (error) fail("/admin/clients", errorMessage(error, "Unable to create client."))
  done("/admin/clients", "Client created.")
}

export async function updateClientAction(formData: FormData) {
  const { supabase } = await requireStaff()
  const id = field(formData, "id")
  const name = field(formData, "name")
  const slug = slugify(field(formData, "slug") || name)

  if (!id || !name || !slug) fail("/admin/clients", "Client name and slug are required.")

  const { error } = await supabase
    .from("clients")
    .update({
      name,
      slug,
      description: optionalField(formData, "description"),
      website_url: optionalField(formData, "website_url"),
      instagram_url: optionalField(formData, "instagram_url"),
      logo_url: optionalField(formData, "logo_url"),
      is_active: checked(formData, "is_active"),
      sort_order: integerField(formData, "sort_order"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) fail("/admin/clients", errorMessage(error, "Unable to update client."))
  done("/admin/clients", "Client updated.")
}

export async function toggleClientAction(formData: FormData) {
  const { supabase } = await requireStaff()
  const id = field(formData, "id")
  const nextActive = field(formData, "next_active") === "true"
  if (!id) fail("/admin/clients", "Missing client id.")

  const { error } = await supabase
    .from("clients")
    .update({ is_active: nextActive, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) fail("/admin/clients", errorMessage(error, "Unable to change client status."))
  done("/admin/clients", nextActive ? "Client activated." : "Client deactivated.")
}

export async function createServiceAction(formData: FormData) {
  const { supabase } = await requireStaff()
  const name = field(formData, "name")
  const slug = slugify(field(formData, "slug") || name)
  if (!name || !slug) fail("/admin/services", "Service name and slug are required.")

  const { error } = await supabase.from("services").insert({
    name,
    slug,
    description: optionalField(formData, "description"),
    is_active: checked(formData, "is_active"),
    sort_order: integerField(formData, "sort_order"),
  })

  if (error) fail("/admin/services", errorMessage(error, "Unable to create service."))
  done("/admin/services", "Service created.")
}

export async function updateServiceAction(formData: FormData) {
  const { supabase } = await requireStaff()
  const id = field(formData, "id")
  const name = field(formData, "name")
  const slug = slugify(field(formData, "slug") || name)
  if (!id || !name || !slug) fail("/admin/services", "Service name and slug are required.")

  const { error } = await supabase
    .from("services")
    .update({
      name,
      slug,
      description: optionalField(formData, "description"),
      is_active: checked(formData, "is_active"),
      sort_order: integerField(formData, "sort_order"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) fail("/admin/services", errorMessage(error, "Unable to update service."))
  done("/admin/services", "Service updated.")
}

export async function toggleServiceAction(formData: FormData) {
  const { supabase } = await requireStaff()
  const id = field(formData, "id")
  const nextActive = field(formData, "next_active") === "true"
  if (!id) fail("/admin/services", "Missing service id.")

  const { error } = await supabase
    .from("services")
    .update({ is_active: nextActive, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) fail("/admin/services", errorMessage(error, "Unable to change service status."))
  done("/admin/services", nextActive ? "Service activated." : "Service deactivated.")
}

function projectValues(formData: FormData) {
  const title = field(formData, "title")
  const slug = slugify(field(formData, "slug") || title)
  const projectType = field(formData, "project_type")
  const status = field(formData, "status")

  if (!title || !slug) return { error: "Project title and slug are required." } as const
  if (!projectTypes.has(projectType)) return { error: "Invalid project type." } as const
  if (!projectStatuses.has(status)) return { error: "Invalid project status." } as const

  return {
    value: {
      title,
      slug,
      short_description: optionalField(formData, "short_description"),
      description: optionalField(formData, "description"),
      project_type: projectType,
      status,
      project_date: optionalField(formData, "project_date"),
      instagram_url: optionalField(formData, "instagram_url"),
      external_url: optionalField(formData, "external_url"),
      is_featured: checked(formData, "is_featured"),
      sort_order: integerField(formData, "sort_order"),
      published_at: status === "published" ? new Date().toISOString() : null,
    },
  } as const
}

function selectedServices(formData: FormData) {
  return [...new Set(formData.getAll("service_ids").filter((value): value is string => typeof value === "string" && value.length > 0))]
}

export async function createProjectAction(formData: FormData) {
  const { supabase } = await requireStaff()
  const parsed = projectValues(formData)
  if ("error" in parsed) fail("/admin/projects/new", parsed.error || "Invalid project data.")

  let clientId = field(formData, "client_id")
  let createdClientId: string | null = null

  if (field(formData, "client_mode") === "new") {
    const newClientName = field(formData, "new_client_name")
    const newClientSlug = slugify(field(formData, "new_client_slug") || newClientName)
    if (!newClientName || !newClientSlug) {
      fail("/admin/projects/new", "New client name and slug are required.")
    }

    const { data: createdClient, error: clientError } = await supabase
      .from("clients")
      .insert({
        name: newClientName,
        slug: newClientSlug,
        description: optionalField(formData, "new_client_description"),
        website_url: optionalField(formData, "new_client_website_url"),
        instagram_url: optionalField(formData, "new_client_instagram_url"),
        logo_url: optionalField(formData, "new_client_logo_url"),
        is_active: true,
      })
      .select("id")
      .single()

    if (clientError || !createdClient) {
      fail("/admin/projects/new", errorMessage(clientError, "Unable to create the new client."))
    }
    clientId = createdClient.id
    createdClientId = createdClient.id
  }

  if (!clientId) fail("/admin/projects/new", "Select or create a client.")

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({ ...parsed.value, client_id: clientId })
    .select("id")
    .single()

  if (projectError || !project) {
    if (createdClientId) await supabase.from("clients").delete().eq("id", createdClientId)
    fail("/admin/projects/new", errorMessage(projectError, "Unable to create project."))
  }

  const serviceIds = selectedServices(formData)
  if (serviceIds.length) {
    const { error: servicesError } = await supabase.from("project_services").insert(
      serviceIds.map((serviceId) => ({ project_id: project.id, service_id: serviceId })),
    )
    if (servicesError) {
      await supabase.from("projects").delete().eq("id", project.id)
      if (createdClientId) await supabase.from("clients").delete().eq("id", createdClientId)
      fail("/admin/projects/new", errorMessage(servicesError, "Unable to connect project services."))
    }
  }

  revalidatePath("/admin")
  redirect(messageUrl(`/admin/projects/${project.id}`, "success", "Project created."))
}

export async function updateProjectAction(formData: FormData) {
  const { supabase } = await requireStaff()
  const id = field(formData, "id")
  const path = id ? `/admin/projects/${id}` : "/admin/projects"
  if (!id) fail(path, "Missing project id.")

  const parsed = projectValues(formData)
  if ("error" in parsed) fail(path, parsed.error || "Invalid project data.")
  const clientId = field(formData, "client_id")
  if (!clientId) fail(path, "Select a client.")

  const { data: current, error: currentError } = await supabase
    .from("projects")
    .select("published_at")
    .eq("id", id)
    .single()
  if (currentError || !current) fail(path, "Project not found.")

  const publishedAt = parsed.value.status === "published"
    ? current.published_at || new Date().toISOString()
    : null

  const { error } = await supabase
    .from("projects")
    .update({ ...parsed.value, client_id: clientId, published_at: publishedAt, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) fail(path, errorMessage(error, "Unable to update project."))

  const desired = selectedServices(formData)
  const { data: existing, error: relationReadError } = await supabase
    .from("project_services")
    .select("service_id")
    .eq("project_id", id)
  if (relationReadError) fail(path, errorMessage(relationReadError, "Unable to read project services."))

  const currentIds = new Set((existing || []).map((item) => item.service_id))
  const toAdd = desired.filter((serviceId) => !currentIds.has(serviceId))
  const toRemove = [...currentIds].filter((serviceId) => !desired.includes(serviceId))

  if (toAdd.length) {
    const { error: addError } = await supabase.from("project_services").insert(
      toAdd.map((serviceId) => ({ project_id: id, service_id: serviceId })),
    )
    if (addError) fail(path, errorMessage(addError, "Project saved, but services could not be added."))
  }

  if (toRemove.length) {
    const { error: removeError } = await supabase
      .from("project_services")
      .delete()
      .eq("project_id", id)
      .in("service_id", toRemove)
    if (removeError) fail(path, errorMessage(removeError, "Project saved, but services could not be removed."))
  }

  done(path, "Project updated.")
}

export async function setProjectStatusAction(formData: FormData) {
  const { supabase } = await requireStaff()
  const id = field(formData, "id")
  const status = field(formData, "status")
  if (!id || !projectStatuses.has(status)) fail("/admin/projects", "Invalid project status change.")

  const { data: current } = await supabase.from("projects").select("published_at").eq("id", id).single()
  const { error } = await supabase
    .from("projects")
    .update({
      status,
      published_at: status === "published" ? current?.published_at || new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) fail("/admin/projects", errorMessage(error, "Unable to change project status."))
  done("/admin/projects", `Project moved to ${status}.`)
}
