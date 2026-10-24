import { parseGuestName } from "./invitation-guest"

const UPSTREAM = "https://mtk-subio-la-libra.gustavoreynosomtk.chatgpt.site/api/rsvp"
const MAX_BYTES = 4096

function reply(status: number, body: object) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } })
}

async function readLimited(stream: ReadableStream<Uint8Array> | null) {
  if (!stream) throw new Error("empty")
  const reader = stream.getReader()
  const decoder = new TextDecoder("utf-8", { fatal: true })
  let text = ""
  let bytes = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_BYTES) {
        await reader.cancel()
        throw new RangeError("too_large")
      }
      text += decoder.decode(value, { stream: true })
    }
    return text + decoder.decode()
  } finally {
    reader.releaseLock()
  }
}

export async function handleRsvp(request: Request, send: typeof fetch = fetch) {
  const origin = request.headers.get("origin")
  let permittedOrigin = origin === "https://www.mtkmediagroup.com" || origin === "https://mtkmediagroup.com"
  if (!permittedOrigin && origin && process.env.NODE_ENV !== "production") {
    try {
      const parsed = new URL(origin)
      permittedOrigin = parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname) && parsed.host === request.headers.get("host")
    } catch { /* Malformed origins remain rejected. */ }
  }
  if (!origin || !permittedOrigin || request.headers.get("sec-fetch-site") === "cross-site") {
    return reply(403, { ok: false, error: "invalid_origin" })
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return reply(415, { ok: false, error: "json_required" })
  }
  if (Number(request.headers.get("content-length")) > MAX_BYTES) {
    return reply(413, { ok: false, error: "request_too_large" })
  }
  let input: unknown
  try {
    input = JSON.parse(await readLimited(request.body))
  } catch (error) {
    return reply(error instanceof RangeError ? 413 : 400, { ok: false, error: "invalid_request" })
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return reply(400, { ok: false, error: "invalid_request" })
  }
  const data = input as Record<string, unknown>
  const name = typeof data.name === "string" ? data.name.trim().replace(/\s+/g, " ") : ""
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : ""
  const language = data.language
  const guest = parseGuestName(data.guest_name)
  if (!guest.valid) return reply(400, { ok: false, error: "invalid_guest_name" })
  if (data.website || name.length < 2 || name.length > 100 || /[\u0000-\u001f\u007f]/.test(name) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || (language !== "es" && language !== "en")) {
    return reply(400, { ok: false, error: "invalid_fields" })
  }
  try {
    const response = await send(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Origin: origin },
      body: JSON.stringify({ name, email, language, ...(guest.name === undefined ? {} : { guest_name: guest.name }) }),
      cache: "no-store",
      credentials: "omit",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) {
      await response.body?.cancel()
      return reply(response.status === 429 ? 429 : 502, { ok: false, error: response.status === 429 ? "try_later" : "registration_unavailable" })
    }
    if (!response.headers.get("content-type")?.includes("application/json")) {
      await response.body?.cancel()
      return reply(502, { ok: false, error: "registration_unavailable" })
    }
    const result = JSON.parse(await readLimited(response.body))
    if (result?.ok !== true) return reply(502, { ok: false, error: "registration_unavailable" })
    // Never relay upstream personal data, error details, or administrative fields.
    return reply(200, { ok: true })
  } catch {
    // A timeout may follow a successful insert. The upstream deduplicates retries.
    return reply(502, { ok: false, error: "registration_unavailable" })
  }
}
