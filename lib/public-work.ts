import "server-only"

import { cache } from "react"

import { createPublicClient } from "@/lib/supabase/public"
import type { Database } from "@/lib/supabase/database.types"

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"]
type MediaRow = Database["public"]["Tables"]["project_media"]["Row"]
type ServiceRow = Database["public"]["Tables"]["services"]["Row"]

export type PublicMedia = Pick<
  MediaRow,
  | "id"
  | "media_type"
  | "media_role"
  | "cloudinary_url"
  | "thumbnail_url"
  | "width"
  | "height"
  | "duration_seconds"
  | "alt_text"
  | "caption"
  | "is_cover"
  | "is_featured"
  | "sort_order"
  | "processing_status"
>

export type PublicProject = Pick<
  ProjectRow,
  | "id"
  | "title"
  | "slug"
  | "short_description"
  | "description"
  | "project_type"
  | "project_date"
  | "instagram_url"
  | "external_url"
  | "is_featured"
  | "sort_order"
  | "published_at"
> & {
  client: { name: string; slug: string } | null
  services: Array<{ name: string; slug: string }>
  media: PublicMedia[]
}

export type PublicService = Pick<ServiceRow, "id" | "name" | "slug" | "description" | "sort_order">

const projectColumns = "id,client_id,title,slug,short_description,description,project_type,project_date,instagram_url,external_url,is_featured,sort_order,published_at"
const mediaColumns = "id,project_id,media_type,media_role,cloudinary_url,thumbnail_url,width,height,duration_seconds,alt_text,caption,is_cover,is_featured,sort_order,processing_status"

async function loadPublishedProjects(slug?: string): Promise<PublicProject[]> {
  const supabase = createPublicClient()
  let projectQuery = supabase
    .from("projects")
    .select(projectColumns)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false })

  if (slug) projectQuery = projectQuery.eq("slug", slug)

  const { data: projects, error: projectError } = await projectQuery
  if (projectError) throw new Error(`Could not load published projects: ${projectError.message}`)
  if (!projects?.length) return []

  const projectIds = projects.map((project) => project.id)
  const clientIds = projects.flatMap((project) => (project.client_id ? [project.client_id] : []))

  const [mediaResult, relationResult, clientResult] = await Promise.all([
    supabase
      .from("project_media")
      .select(mediaColumns)
      .in("project_id", projectIds)
      .eq("processing_status", "ready")
      .not("cloudinary_url", "is", null)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("project_services")
      .select("project_id,service_id")
      .in("project_id", projectIds),
    clientIds.length
      ? supabase.from("clients").select("id,name,slug").in("id", clientIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  if (mediaResult.error) throw new Error(`Could not load public media: ${mediaResult.error.message}`)
  if (relationResult.error) throw new Error(`Could not load project services: ${relationResult.error.message}`)
  if (clientResult.error) throw new Error(`Could not load project clients: ${clientResult.error.message}`)

  const serviceIds = [...new Set((relationResult.data ?? []).map((row) => row.service_id))]
  const serviceResult = serviceIds.length
    ? await supabase.from("services").select("id,name,slug").in("id", serviceIds)
    : { data: [], error: null }
  if (serviceResult.error) throw new Error(`Could not load public services: ${serviceResult.error.message}`)

  const clients = new Map((clientResult.data ?? []).map((client) => [client.id, client]))
  const services = new Map((serviceResult.data ?? []).map((service) => [service.id, service]))

  return projects.flatMap((project) => {
    const media = (mediaResult.data ?? []).filter((item) => item.project_id === project.id)
    if (!media.length) return []

    const projectServices = (relationResult.data ?? [])
      .filter((relation) => relation.project_id === project.id)
      .flatMap((relation) => {
        const service = services.get(relation.service_id)
        return service ? [{ name: service.name, slug: service.slug }] : []
      })

    const client = project.client_id ? clients.get(project.client_id) : null

    return [{
      id: project.id,
      title: project.title,
      slug: project.slug,
      short_description: project.short_description,
      description: project.description,
      project_type: project.project_type,
      project_date: project.project_date,
      instagram_url: project.instagram_url,
      external_url: project.external_url,
      is_featured: project.is_featured,
      sort_order: project.sort_order,
      published_at: project.published_at,
      client: client ? { name: client.name, slug: client.slug } : null,
      services: projectServices,
      media,
    }]
  })
}

export const getPublishedProjects = cache(() => loadPublishedProjects())

export const getPublishedProjectBySlug = cache(async (slug: string) => {
  const projects = await loadPublishedProjects(slug)
  return projects[0] ?? null
})

export const getActiveServices = cache(async (): Promise<PublicService[]> => {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("services")
    .select("id,name,slug,description,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })

  if (error) throw new Error(`Could not load public services: ${error.message}`)
  return data ?? []
})

export function selectWorkCover(project: PublicProject) {
  return project.media.find((media) => media.is_cover)
    ?? project.media.find((media) => media.media_role === "hero")
    ?? project.media[0]
}

export function selectProjectHero(project: PublicProject) {
  return project.media.find((media) => media.media_role === "hero")
    ?? project.media.find((media) => media.is_cover)
    ?? project.media[0]
}

export function mediaRatio(media: PublicMedia) {
  if (!media.width || !media.height || media.height <= 0) return null
  return media.width / media.height
}
