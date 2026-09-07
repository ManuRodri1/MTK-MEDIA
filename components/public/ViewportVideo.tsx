"use client"

import Image from "next/image"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import { useViewportVideo } from "@/hooks/use-viewport-video"
import type { PublicLocale } from "@/lib/locale"
import styles from "@/app/home.module.css"

type Props = { src: string; poster: string; label: string; locale: PublicLocale; className?: string; eager?: boolean; autoPlay?: boolean; sound?: boolean }

export function ViewportVideo({ src, poster, label, locale, className = "", eager = false, autoPlay = true, sound = false }: Props) {
  const { videoRef, playing, muted, failed, loading, ready, motionAllowed, togglePlayback, toggleSound } = useViewportVideo({ src, eager, autoPlay })
  const t = locale === "es"
    ? { play: "Reproducir", pause: "Pausar", soundOn: "Activar sonido", soundOff: "Silenciar", error: "El video no está disponible. Se muestra su póster." }
    : { play: "Play", pause: "Pause", soundOn: "Unmute", soundOff: "Mute", error: "Video unavailable. Its poster is shown." }
  const playbackLabel = `${playing ? t.pause : t.play}: ${label}`
  return <div className={`${styles.viewportVideo} ${className}`} data-failed={failed || undefined} data-ready={ready || undefined}>
    <Image src={poster} alt="" fill sizes={eager ? "(min-width: 960px) 48vw, 100vw" : "(min-width: 768px) 50vw, 100vw"} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "low"} className={styles.videoPoster} />
    <video ref={videoRef} className={styles.managedVideo} width={720} height={1280} autoPlay={autoPlay && motionAllowed} muted loop playsInline preload={eager ? "metadata" : "none"} aria-label={label} aria-hidden={!ready} />
    <div className={styles.mediaControls} role="group" aria-label={label}>
      <button type="button" className={styles.playControl} aria-label={playbackLabel} title={playbackLabel} aria-pressed={playing} aria-busy={loading} disabled={failed} onClick={togglePlayback}>
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </button>
      {sound ? <button type="button" className={styles.soundControl} aria-label={muted ? t.soundOn : t.soundOff} title={muted ? t.soundOn : t.soundOff} aria-pressed={!muted} disabled={failed} onClick={toggleSound}>
        {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
      </button> : null}
    </div>
    {failed ? <p className={styles.videoStatus} role="status">{t.error}</p> : null}
  </div>
}
