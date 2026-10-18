"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import styles from "./PortfolioGallery.module.css"

export type GalleryItem = {
  id: string; title: string; src: string; preview?: string; poster?: string; thumbnail?: string;
  width: number; height: number; alt_en: string; alt_es: string;
}

export function PortfolioGallery({ items, kind, locale }: { items: GalleryItem[]; kind: "events" | "photography"; locale: "en" | "es" }) {
  const es = locale === "es"
  const [selected, setSelected] = useState<number | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const isVideo = kind === "events"

  useEffect(() => {
    const root = galleryRef.current
    if (!root || typeof IntersectionObserver === "undefined") return
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    const inView = new Set<HTMLVideoElement>()
    const videos = Array.from(root.querySelectorAll("video"))
    const play = (v: HTMLVideoElement) => {
      if (document.hidden || reduced.matches || selected !== null) return
      if (!v.src && v.dataset.src) v.src = v.dataset.src
      v.muted = true; v.defaultMuted = true
      void v.play().catch(() => {})
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      const v = entry.target as HTMLVideoElement
      if (entry.isIntersecting) { inView.add(v); play(v) }
      else { inView.delete(v); v.pause() }
    }), { threshold: 0.12 })
    videos.forEach(v => observer.observe(v))
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return
      if (!reduced.matches && !(entry.target as HTMLElement).dataset.revealed) entry.target.animate([
        { opacity: 0, transform: "translateY(24px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 500, easing: "cubic-bezier(.2,.7,.2,1)" })
      ;(entry.target as HTMLElement).dataset.revealed = "true"
      reveal.unobserve(entry.target)
    }), { threshold: 0.08 })
    root.querySelectorAll("article").forEach(card => reveal.observe(card))
    const visibility = () => videos.forEach(v => {
      if (document.hidden || reduced.matches || selected !== null) v.pause()
      else if (inView.has(v)) play(v)
    })
    document.addEventListener("visibilitychange", visibility)
    reduced.addEventListener("change", visibility)
    return () => { observer.disconnect(); reveal.disconnect(); videos.forEach(v => v.pause()); document.removeEventListener("visibilitychange", visibility); reduced.removeEventListener("change", visibility) }
  }, [selected])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (selected !== null) { if (!dialog.open) dialog.showModal(); document.body.style.overflow = "hidden" }
    if (selected === null && dialog.open) { dialog.close(); document.body.style.overflow = ""; triggerRef.current?.focus() }
    return () => { document.body.style.overflow = "" }
  }, [selected])

  const item = selected === null ? null : items[selected]
  const close = () => setSelected(null)
  const navigate = (offset: number) => setSelected(current => current === null ? null : (current + offset + items.length) % items.length)

  return <>
    <div ref={galleryRef} className={isVideo ? styles.events : styles.masonry}>
      {items.map((entry, index) => <article key={entry.id} className={`${styles.card} ${isVideo && entry.width > entry.height ? styles.landscape : ""}`}>
        <button className={styles.open} onClick={event => { triggerRef.current = event.currentTarget; setSelected(index) }} aria-label={`${es ? "Abrir" : "Open"}: ${isVideo ? entry.title : es ? entry.alt_es : entry.alt_en}`}>
          <div className={styles.media} style={{ aspectRatio: `${entry.width} / ${entry.height}` }}>
            {isVideo ? <video data-src={entry.preview || entry.src} poster={entry.poster} width={entry.width} height={entry.height} muted loop playsInline preload="none" aria-label={entry.title} />
              : <Image src={entry.thumbnail || entry.src} alt={es ? entry.alt_es : entry.alt_en} width={entry.width} height={entry.height} sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw" loading={index < 4 ? "eager" : "lazy"} />}
            <span className={styles.expand} aria-hidden="true">{isVideo ? "▶" : "+"}</span>
          </div>
          {isVideo && <div className={styles.caption}><span>{entry.title}</span><span aria-hidden="true">↗</span></div>}
        </button>
      </article>)}
    </div>
    <dialog ref={dialogRef} className={styles.dialog} onCancel={close} onClose={close} onClick={event => { if (event.target === event.currentTarget) close() }} onKeyDown={event => { if (event.key === "ArrowLeft") navigate(-1); if (event.key === "ArrowRight") navigate(1) }} aria-label={es ? "Visor de portafolio" : "Portfolio viewer"}>
      <button className={styles.close} onClick={close} aria-label={es ? "Cerrar" : "Close"}>×</button>
      {item && <div className={styles.viewer}>
        {isVideo ? <video key={item.id} src={item.src} poster={item.poster} controls autoPlay playsInline className={styles.fullMedia} aria-label={item.title} />
          : <Image key={item.id} src={item.src} alt={es ? item.alt_es : item.alt_en} width={item.width} height={item.height} className={styles.fullMedia} sizes="90vw" />}
        <div className={styles.viewerNav}>
          <button onClick={() => navigate(-1)} aria-label={es ? "Anterior" : "Previous"}>←</button>
          <p>{isVideo ? item.title : es ? item.alt_es : item.alt_en}<span>{(selected ?? 0) + 1} / {items.length}</span></p>
          <button onClick={() => navigate(1)} aria-label={es ? "Siguiente" : "Next"}>→</button>
        </div>
      </div>}
    </dialog>
  </>
}
