"use client"

import { useEffect, useRef, useState } from "react"

type PublicVideoProps = {
  src: string
  poster?: string
  title: string
  hero?: boolean
  className?: string
}

export function PublicVideo({ src, poster, title, hero = false, className }: PublicVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [autoplay, setAutoplay] = useState(false)

  useEffect(() => {
    if (!hero) return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const allowed = !reducedMotion.matches && !connection?.saveData
    setAutoplay(allowed)

    if (allowed) void videoRef.current?.play().catch(() => undefined)
  }, [hero])

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      poster={poster}
      title={title}
      aria-label={title}
      muted={hero}
      loop={hero}
      autoPlay={autoplay}
      playsInline
      controls
      preload={hero ? "metadata" : "none"}
    />
  )
}
