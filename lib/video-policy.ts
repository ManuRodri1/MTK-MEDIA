type PlaybackContext = {
  autoPlay: boolean
  reducedMotion: boolean
  saveData: boolean
  nearby: boolean
  visible: boolean
  hidden: boolean
  requested: "play" | "pause" | null
}

/** A manual play request may override motion/data preferences, never visibility. */
export function videoPolicy(context: PlaybackContext) {
  const permitted = !context.reducedMotion && !context.saveData
  const desired = context.requested !== "pause" && (context.requested === "play" || (context.autoPlay && permitted))
  const play = desired && context.visible && !context.hidden
  return { permitted, play, load: (desired && context.nearby && !context.hidden) || play }
}
