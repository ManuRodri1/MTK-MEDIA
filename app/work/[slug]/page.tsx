import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { PublicVideo } from "@/components/public/PublicVideo"
import { cloudinaryDeliveryUrl } from "@/lib/cloudinary/delivery"
import { localizedHref, resolveLocale } from "@/lib/locale"
import { getPublishedProjectBySlug, mediaRatio, selectProjectHero, type PublicMedia } from "@/lib/public-work"

import styles from "../work.module.css"

export const dynamic = "force-dynamic"

type PageProps = { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string | string[] }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getPublishedProjectBySlug(slug)
  if (!project) return { title: "Project not found" }
  const title = project.client ? `${project.title} — ${project.client.name}` : project.title
  return {
    title,
    description: project.short_description ?? `A project by MTK Media: ${project.title}.`,
    alternates: { canonical: `/work/${project.slug}` },
  }
}

function ratioClass(media: PublicMedia) {
  if (media.is_featured) return styles.mediaFeatured
  const ratio = mediaRatio(media)
  if (ratio === null) return styles.mediaContained
  if (ratio < 0.8) return styles.mediaPortrait
  if (ratio <= 1.2) return styles.mediaSquare
  if (ratio <= 1.9) return styles.mediaLandscape
  return styles.mediaUltra
}

function MediaFigure({ media, projectTitle, hero = false }: { media: PublicMedia; projectTitle: string; hero?: boolean }) {
  const source = media.cloudinary_url!
  const posterSource = media.thumbnail_url ?? (media.media_type === "video" ? cloudinaryDeliveryUrl(source, "poster") : source)
  const ratio = mediaRatio(media) ?? (media.media_role === "reel" ? 9 / 16 : 4 / 3)
  return (
    <figure className={hero ? styles.heroFigure : ratioClass(media)}>
      <div className={styles.figureMedia} style={{ aspectRatio: ratio }}>
        {media.media_type === "video" ? (
          <PublicVideo
            className={styles.mediaElement}
            src={cloudinaryDeliveryUrl(source, "video")}
            poster={cloudinaryDeliveryUrl(posterSource, "large")}
            title={`Video — ${projectTitle}`}
            hero={hero}
          />
        ) : (
          <Image
            className={styles.mediaElement}
            src={cloudinaryDeliveryUrl(source, hero || media.is_featured ? "large" : "contained")}
            alt={media.alt_text ?? ""}
            fill
            sizes={hero || media.is_featured ? "100vw" : "(min-width: 960px) 66vw, 100vw"}
            priority={hero}
          />
        )}
      </div>
      {media.caption ? <figcaption>{media.caption}</figcaption> : null}
    </figure>
  )
}

export default async function ProjectPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const locale = resolveLocale((await searchParams).lang)
  const t = locale === "es"
    ? { back: "← Trabajo", reels: "Reels", bts: "Detrás de cámaras", close: "¿Tienes un proyecto en mente?", instagram: "Instagram ↗", visit: "Visitar proyecto ↗", backWork: "Volver a Trabajo", contact: "Hablemos" }
    : { back: "← Work", reels: "Reels", bts: "Behind the scenes", close: "Have a project in mind?", instagram: "Instagram ↗", visit: "Visit project ↗", backWork: "Back to Work", contact: "Start a conversation" }
  const project = await getPublishedProjectBySlug(slug)
  if (!project) notFound()

  const hero = selectProjectHero(project)
  const remaining = project.media.filter((media) => media.id !== hero.id)
  const mainMedia = remaining.filter((media) => media.media_role !== "behind_the_scenes" && media.media_role !== "reel")
  const reels = remaining.filter((media) => media.media_role === "reel")
  const behindTheScenes = remaining.filter((media) => media.media_role === "behind_the_scenes")
  const year = project.project_date ? new Intl.DateTimeFormat(locale, { year: "numeric" }).format(new Date(`${project.project_date}T00:00:00`)) : null
  const credits = [project.client?.name, year, project.project_type, ...project.services.map((service) => service.name)].filter(Boolean)

  return (
    <article className={styles.projectPage}>
      <header className={styles.projectOpening}>
        <Link className={styles.backLink} href={localizedHref("/work", locale)}>{t.back}</Link>
        <h1>{project.title}</h1>
        {credits.length ? <p className={styles.creditLine}>{credits.join(" · ")}</p> : null}
        {project.short_description ? <p className={styles.projectLede}>{project.short_description}</p> : null}
      </header>

      <MediaFigure media={hero} projectTitle={project.title} hero />

      {project.description ? <section className={styles.projectNarrative}><p>{project.description}</p></section> : null}

      {mainMedia.length ? (
        <section className={styles.mediaSequence} aria-label="Project gallery">
          {mainMedia.map((media) => <MediaFigure key={media.id} media={media} projectTitle={project.title} />)}
        </section>
      ) : null}

      {reels.length ? (
        <section className={styles.reelChapter} aria-labelledby="reels-title">
          <h2 id="reels-title">{t.reels}</h2>
          <div className={styles.reelGrid}>{reels.map((media) => <MediaFigure key={media.id} media={media} projectTitle={project.title} />)}</div>
        </section>
      ) : null}

      {behindTheScenes.length ? (
        <section className={styles.btsChapter} aria-labelledby="bts-title">
          <h2 id="bts-title">{t.bts}</h2>
          <div className={styles.btsGrid}>{behindTheScenes.map((media) => <MediaFigure key={media.id} media={media} projectTitle={project.title} />)}</div>
        </section>
      ) : null}

      <footer className={styles.projectClose}>
        <p>{t.close}</p>
        <div>
          {project.instagram_url ? <a href={project.instagram_url} target="_blank" rel="noopener noreferrer">{t.instagram}</a> : null}
          {project.external_url ? <a href={project.external_url} target="_blank" rel="noopener noreferrer">{t.visit}</a> : null}
          <Link href={localizedHref("/work", locale)}>{t.backWork}</Link>
          <Link className={styles.primaryLink} href={localizedHref("/contact", locale)}>{t.contact} <span aria-hidden="true">↗</span></Link>
        </div>
      </footer>
    </article>
  )
}
