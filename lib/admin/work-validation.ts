export function instagramUrlError(value: string) {
  if (!value.trim()) return "Paste the Instagram URL for this video."

  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase().replace(/^www\./, "")
    if (!(["http:", "https:"].includes(url.protocol)) || (host !== "instagram.com" && host !== "instagr.am")) {
      return "Use a complete Instagram URL, for example https://www.instagram.com/reel/…"
    }
  } catch {
    return "Use a complete Instagram URL, for example https://www.instagram.com/reel/…"
  }

  return null
}

export function titleFromFilename(filename: string) {
  const withoutExtension = filename.replace(/\.[^.]+$/, "")
  const readable = withoutExtension.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim()
  return readable || "Untitled work"
}
