"use client"

import Image from "next/image"
import { ExternalLink, Pause, Play } from "lucide-react"
import { useState } from "react"

import { useViewportVideo } from "@/hooks/use-viewport-video"
import type { PublicLocale } from "@/lib/locale"
import type { WorkItem } from "@/lib/work-items"

import styles from "./EditorialWorkGrid.module.css"

type GridVariant = "library" | "featured"

function WorkVideo({ item, index, locale, headingLevel }: { item: WorkItem; index: number; locale: PublicLocale; headingLevel: 2 | 3 }) {
  const { videoRef, playing, failed, ready, seen, motionAllowed, togglePlayback } = useViewportVideo({ src: item.videoUrl!, autoPlay: true })
  const [posterReady, setPosterReady] = useState(false)
  const es = locale === "es"
  const itemNumber = String(index + 1).padStart(2, "0")
  const accessibleName = item.title ?? `${es ? "Video de MTK" : "MTK work video"} ${itemNumber}`
  const playbackLabel = `${playing ? (es ? "Pausar" : "Pause") : (es ? "Reproducir" : "Play")}: ${accessibleName}`
  const Heading = headingLevel === 2 ? "h2" : "h3"

  return <article className={styles.item} data-revealed={seen || undefined}>
    <p className={styles.indexLine}><span>{itemNumber}</span><span>/ Video</span></p>
    <div className={styles.media} data-ready={ready || undefined} data-failed={failed || undefined}>
      <div className={styles.fallback} aria-hidden="true"><span>MTK Media</span><span>{es ? "Cargando corte" : "Loading cut"}</span></div>
      <Image className={styles.poster} data-loaded={posterReady || undefined} src={item.posterUrl} alt="" fill sizes="(min-width: 1440px) 25vw, (min-width: 960px) 33vw, (min-width: 640px) 50vw, 100vw" loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} onLoad={() => setPosterReady(true)} onError={() => setPosterReady(false)} />
      <video ref={videoRef} className={styles.video} autoPlay={motionAllowed} muted loop playsInline preload="metadata" aria-label={accessibleName} />
      {item.instagramUrl ? <a className={styles.watchOverlay} href={item.instagramUrl} target="_blank" rel="noopener noreferrer">{es ? "Ver" : "Watch"} <ExternalLink aria-hidden="true" /></a> : null}
      <button className={styles.playButton} type="button" onClick={togglePlayback} aria-label={playbackLabel} title={playbackLabel} disabled={failed} aria-pressed={playing}>
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </button>
      {failed ? <p className={styles.error} role="status">{es ? "Vista previa no disponible" : "Preview unavailable"}</p> : null}
    </div>
    {item.title || item.instagramUrl ? <div className={styles.caption}>
      {item.title ? <Heading>{item.title}</Heading> : null}
      {item.instagramUrl ? <a href={item.instagramUrl} target="_blank" rel="noopener noreferrer">{es ? "Ver en Instagram" : "Watch on Instagram"} <ExternalLink aria-hidden="true" /></a> : null}
    </div> : null}
  </article>
}

export function EditorialWorkGrid({ items, locale, headingLevel = 3, variant = "library" }: { items: WorkItem[]; locale: PublicLocale; headingLevel?: 2 | 3; variant?: GridVariant }) {
  if (!items.length) return <p className={styles.empty}>{locale === "es" ? "El próximo corte está en proceso." : "The next cut is in progress."}</p>
  return <div className={styles.grid} data-variant={variant} data-single={items.length === 1 || undefined}>{items.map((item, index) => <WorkVideo key={item.id} item={item} index={index} locale={locale} headingLevel={headingLevel} />)}</div>
}
