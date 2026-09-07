"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Play, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { localizedHref, type PublicLocale } from "@/lib/locale"
import type { WorkItem } from "@/lib/work-items"
import styles from "@/app/home.module.css"

function WorkPreview({ item, onClose }: { item: WorkItem; onClose: () => void }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = ref.current
    if (!video) return
    let started = false
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.15) video.pause()
      else if (!started && !document.hidden) {
        started = true
        // Mounted only by the visitor's preview action; native controls remain
        // available if the browser declines this first playback request.
        void video.play().catch(() => {})
      }
    }, { threshold: [0, 0.15] })
    observer.observe(video)
    const hide = () => { if (document.hidden) video.pause() }
    const mute = (event: Event) => { if ((event as CustomEvent).detail !== video) video.muted = true }
    document.addEventListener("visibilitychange", hide); window.addEventListener("mtk:audio", mute)
    return () => { observer.disconnect(); video.pause(); document.removeEventListener("visibilitychange", hide); window.removeEventListener("mtk:audio", mute) }
  }, [])
  return <video ref={ref} className={styles.workPreview} src={item.videoUrl!} poster={item.posterUrl} controls autoPlay muted playsInline preload="none" aria-label={item.title ?? "MTK work video"} onError={onClose} onVolumeChange={(event) => {
    if (!event.currentTarget.muted) window.dispatchEvent(new CustomEvent("mtk:audio", { detail: event.currentTarget }))
  }} />
}

export function SelectedWorkReel({ items, locale }: { items: WorkItem[]; locale: PublicLocale }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const es = locale === "es"
  const multiple = items.length > 1
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const ratios = new Map<Element, number>()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => ratios.set(entry.target, entry.intersectionRatio))
      const best = [...ratios].sort((a, b) => b[1] - a[1])[0]
      if (best && best[1] > 0.5) {
        const index = Number((best[0] as HTMLElement).dataset.index)
        setActive(index)
        setPreview((current) => current === items[index]?.id ? current : null)
      }
    }, { root: track, threshold: [0, 0.25, 0.5, 0.7, 0.9] })
    Array.from(track.children).forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [items])

  const go = (index: number) => {
    const track = trackRef.current
    const entry = track?.children[index] as HTMLElement | undefined
    if (!track || !entry) return
    const left = entry.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft
    track.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
    setActive(index); setPreview(null)
  }
  if (!items.length) return <p className={styles.empty}>{es ? "El próximo corte está en proceso." : "The next cut is in progress."}</p>
  return <div className={styles.workReel}>
    <div className={styles.reelTopline}>
      <p className={styles.reelCount} aria-live="polite" aria-atomic="true"><span>{String(active + 1).padStart(2, "0")}</span> / {String(items.length).padStart(2, "0")}</p>
      {multiple ? <div className={styles.reelNavigation}>
        <button type="button" aria-label={es ? "Proyecto anterior" : "Previous project"} disabled={active === 0} onClick={() => go(active - 1)}><ArrowLeft aria-hidden="true" /></button>
        <button type="button" aria-label={es ? "Proyecto siguiente" : "Next project"} disabled={active === items.length - 1} onClick={() => go(active + 1)}><ArrowRight aria-hidden="true" /></button>
      </div> : <span>{es ? "Selección MTK" : "The MTK selection"}</span>}
    </div>
    <div ref={trackRef} className={styles.reelTrack} data-single={!multiple || undefined} role="region" aria-label={es ? "Proyectos seleccionados" : "Selected projects"} tabIndex={multiple ? 0 : undefined} onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return
      if (event.key === "ArrowRight") { event.preventDefault(); go(Math.min(items.length - 1, active + 1)) }
      if (event.key === "ArrowLeft") { event.preventDefault(); go(Math.max(0, active - 1)) }
      if (event.key === "Home") { event.preventDefault(); go(0) }
      if (event.key === "End") { event.preventDefault(); go(items.length - 1) }
    }}>
      {items.map((item, index) => <article key={item.id} data-index={index} className={styles.reelEntry}>
        <div className={styles.workVisual} data-portrait={item.ratio < 0.8 || undefined}>
          <Image className={styles.workAtmosphere} src={item.posterUrl} alt="" fill sizes="(min-width: 960px) 85vw, 90vw" loading="lazy" aria-hidden="true" />
          <Link className={styles.workImageLink} href={localizedHref(`/work/${item.slug}`, locale)} aria-label={`${es ? "Ver proyecto" : "View project"}: ${item.title}`}>
            <Image className={styles.workCover} src={item.posterUrl} alt={item.alt} fill sizes="(min-width: 960px) 75vw, 90vw" loading="lazy" />
          </Link>
          {item.videoUrl && preview !== item.id ? <button className={styles.previewButton} type="button" onClick={() => setPreview(item.id)} aria-label={`${es ? "Reproducir avance" : "Play preview"}: ${item.title}`}><Play aria-hidden="true" /><span>{es ? "Ver avance" : "Preview film"}</span></button> : null}
          {preview === item.id ? <><WorkPreview item={item} onClose={() => setPreview(null)} /><button type="button" className={styles.closePreview} aria-label={es ? "Cerrar avance" : "Close preview"} onClick={() => setPreview(null)}><X aria-hidden="true" /></button></> : null}
        </div>
        <div className={styles.reelCredits}>
          <div><span className={styles.projectNumber}>{String(index + 1).padStart(2, "0")}</span>{item.title ? <h3><Link href={localizedHref(`/work/${item.slug}`, locale)}>{item.title} <span aria-hidden="true">↗</span></Link></h3> : null}</div>
          <dl>{item.client ? <div><dt>{es ? "Cliente" : "Client"}</dt><dd>{item.client}</dd></div> : null}<div><dt>{es ? "Disciplina" : "Discipline"}</dt><dd>{item.category}</dd></div>{item.year ? <div><dt>{es ? "Año" : "Year"}</dt><dd>{item.year}</dd></div> : null}</dl>
        </div>
      </article>)}
    </div>
    {multiple ? <nav className={styles.reelIndex} aria-label={es ? "Índice de proyectos" : "Project index"}>{items.map((item, index) => <button type="button" key={item.id} aria-label={`${String(index + 1).padStart(2, "0")}: ${item.title}`} aria-current={active === index ? "true" : undefined} onClick={() => go(index)}>{String(index + 1).padStart(2, "0")}</button>)}</nav> : null}
  </div>
}
