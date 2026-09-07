import type { PublicProject } from "./public-work"

export type WorkItem = {
  id: string; slug: string; title: string | null; client: string | null; category: string; year: string | null
  mediaType: "image" | "video"; coverUrl: string; videoUrl: string | null; posterUrl: string; ratio: number
  alt: string; featured: boolean; order: number; description: string | null; instagramUrl: string | null
}

const placeholderTitle = /^(?:untitled(?:\s+work)?|(?:video|project)\s*[-_#]?\s*\d+)$/i

function publicTitle(value: string | null | undefined) {
  const title = value?.trim()
  return title && !placeholderTitle.test(title) ? title : null
}

// Presentation only: no queries or changes to the existing backend.
export function toWorkItems(projects: PublicProject[]): WorkItem[] {
  return projects.flatMap((project) => {
    const ready = project.media.filter((media) => media.processing_status === "ready" && media.cloudinary_url)
    const videos = ready.filter((media) => media.media_type === "video")
    const cover = videos.find((media) => media.is_cover) ?? videos.find((media) => media.media_role === "hero") ?? videos[0]
    if (!cover?.cloudinary_url) return []
    const isVideo = cover.media_type === "video"
    const poster = cover.thumbnail_url ?? (isVideo
      ? cover.cloudinary_url.replace("/upload/", "/upload/so_1,f_jpg,q_auto:good,c_limit,w_1400/").replace(/\.[a-z0-9]+$/i, ".jpg")
      : cover.cloudinary_url)
    const date = project.project_date ? new Date(project.project_date) : null
    return [{
      id: project.id, slug: project.slug, title: publicTitle(project.title), client: project.client?.name ?? null,
      category: project.services.map((service) => service.name).join(" / ") || project.project_type,
      year: date && !Number.isNaN(date.getTime()) ? String(date.getUTCFullYear()) : null,
      mediaType: isVideo ? "video" as const : "image" as const, coverUrl: cover.cloudinary_url,
      videoUrl: isVideo ? cover.cloudinary_url : null, posterUrl: poster,
      ratio: cover.width && cover.height && cover.height > 0 ? cover.width / cover.height : 4 / 3,
      alt: cover.alt_text ?? "", featured: project.is_featured, order: project.sort_order, description: project.short_description, instagramUrl: project.instagram_url,
    }]
  })
}

export function selectFeaturedWork(items: WorkItem[], options: { limit?: number; fallbackToAll?: boolean } = {}) {
  const { limit, fallbackToAll = true } = options
  const featured = items.filter((item) => item.featured)
  const selection = featured.length || !fallbackToAll ? featured : items
  const ordered = [...selection].sort((a, b) => a.order - b.order)
  return limit === undefined ? ordered : ordered.slice(0, Math.max(0, limit))
}

export function selectHomepageWork(items: WorkItem[], limit = 4) {
  const ordered = [...items].sort((a, b) => a.order - b.order)
  const featured = ordered.filter((item) => item.featured)
  const remainder = ordered.filter((item) => !item.featured)
  return [...featured, ...remainder].slice(0, Math.max(0, limit))
}
