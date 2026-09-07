"use client"

import { useEffect, useRef, useState } from "react"
import { videoPolicy } from "@/lib/video-policy"

type Options = { src: string; autoPlay?: boolean; eager?: boolean }

export function useViewportVideo({ src, autoPlay = true, eager = false }: Options) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const requested = useRef<"play" | "pause" | null>(null)
  const syncRef = useRef<() => void>(() => {})
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [motionAllowed, setMotionAllowed] = useState(false)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    let visible = false
    let nearby = eager
    let alive = true
    const permitted = () => !motion.matches && !connection?.saveData
    setMotionAllowed(permitted())
    const ensureSource = () => { if (!video.getAttribute("src")) { video.src = src; video.load() } }
    const policy = () => videoPolicy({ autoPlay, reducedMotion: motion.matches, saveData: !!connection?.saveData, nearby, visible, hidden: document.hidden, requested: requested.current })
    const sync = () => {
      const decision = policy()
      if (decision.load) ensureSource()
      if (!decision.play) { video.pause(); return }
      ensureSource()
      void video.play().catch(() => { if (alive) { setPlaying(false); setLoading(false) } })
    }
    syncRef.current = sync
    const onPlaying = () => {
      if (!policy().play) { video.pause(); return }
      setPlaying(true); setLoading(false)
    }
    const onReady = () => setReady(true)
    const onPause = () => { setPlaying(false); setLoading(false) }
    const onWaiting = () => { if (!video.paused) setLoading(true) }
    const onError = () => { setFailed(true); setPlaying(false); setLoading(false) }
    const onVolume = () => setMuted(video.muted)
    const onOtherAudio = (event: Event) => { if ((event as CustomEvent).detail !== video) video.muted = true }
    const onPreference = () => { setMotionAllowed(permitted()); requested.current = null; sync() }
    const nearObserver = new IntersectionObserver(([entry]) => { nearby = entry.isIntersecting || eager; sync() }, { rootMargin: eager ? "0px" : "240px" })
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.12
      if (visible) setSeen(true)
      sync()
    }, { threshold: [0, 0.12] })
    nearObserver.observe(video); viewObserver.observe(video)
    video.addEventListener("playing", onPlaying); video.addEventListener("pause", onPause)
    video.addEventListener("loadeddata", onReady)
    video.addEventListener("waiting", onWaiting); video.addEventListener("error", onError); video.addEventListener("volumechange", onVolume)
    document.addEventListener("visibilitychange", sync); window.addEventListener("mtk:audio", onOtherAudio)
    motion.addEventListener("change", onPreference)
    sync()
    return () => {
      alive = false; nearObserver.disconnect(); viewObserver.disconnect()
      video.removeEventListener("playing", onPlaying); video.removeEventListener("pause", onPause)
      video.removeEventListener("loadeddata", onReady)
      video.removeEventListener("waiting", onWaiting); video.removeEventListener("error", onError); video.removeEventListener("volumechange", onVolume)
      document.removeEventListener("visibilitychange", sync); window.removeEventListener("mtk:audio", onOtherAudio)
      motion.removeEventListener("change", onPreference); video.pause()
    }
  }, [src, autoPlay, eager])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return
    // Follow the rendered control's intent even if the browser temporarily
    // suspends decoding before delivering its pause event.
    requested.current = playing ? "pause" : "play"
    syncRef.current()
  }
  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    if (!video.muted) {
      window.dispatchEvent(new CustomEvent("mtk:audio", { detail: video }))
      requested.current = "play"; syncRef.current()
    }
  }
  return { videoRef, playing, muted, failed, loading, ready, seen, motionAllowed, togglePlayback, toggleSound }
}
