import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  })
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4))
  return atob(normalized + padding)
}

function getUserIdFromJwt(authHeader: string): string | null {
  try {
    const token = authHeader.replace(/^Bearer\s+/i, "")
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const payload = JSON.parse(base64UrlDecode(parts[1]))
    return typeof payload.sub === "string" ? payload.sub : null
  } catch {
    return null
  }
}

async function sha1Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

async function dataRequest(url: string, serviceRoleKey: string, init: RequestInit = {}) {
  return fetch(url, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Accept: "application/json",
      ...(init.headers || {}),
    },
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405)

  const authHeader = req.headers.get("Authorization") ?? ""
  const userId = getUserIdFromJwt(authHeader)
  if (!userId) return json({ error: "Unauthorized" }, 401)

  const supabaseUrl = Deno.env.get("SUPABASE_URL")
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME")
  const apiKey = Deno.env.get("CLOUDINARY_API_KEY")
  const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET")
  if (!supabaseUrl || !serviceRoleKey || !cloudName || !apiKey || !apiSecret) {
    return json({ error: "Server configuration is incomplete" }, 500)
  }

  let body: { mediaId?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: "Invalid JSON body" }, 400)
  }
  const mediaId = body.mediaId?.trim()
  if (!mediaId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(mediaId)) {
    return json({ error: "Invalid mediaId" }, 400)
  }

  const profileResponse = await dataRequest(
    `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=role&limit=1`,
    serviceRoleKey,
  )
  if (!profileResponse.ok) return json({ error: "Unable to validate staff access" }, 500)
  const profiles = await profileResponse.json()
  const role = Array.isArray(profiles) ? profiles[0]?.role : null
  if (role !== "admin" && role !== "editor") return json({ error: "Forbidden" }, 403)

  const mediaResponse = await dataRequest(
    `${supabaseUrl}/rest/v1/project_media?id=eq.${encodeURIComponent(mediaId)}&select=id,project_id,media_type,cloudinary_public_id&limit=1`,
    serviceRoleKey,
  )
  if (!mediaResponse.ok) return json({ error: "Unable to read media metadata" }, 500)
  const rows = await mediaResponse.json()
  const media = Array.isArray(rows) ? rows[0] : null
  if (!media) return json({ error: "Media not found" }, 404)

  let cloudinaryResult = "not_applicable"
  if (media.cloudinary_public_id) {
    const timestamp = Math.floor(Date.now() / 1000)
    const invalidate = "true"
    const serialized = `invalidate=${invalidate}&public_id=${media.cloudinary_public_id}&timestamp=${timestamp}`
    const signature = await sha1Hex(serialized + apiSecret)
    const formData = new FormData()
    formData.append("public_id", media.cloudinary_public_id)
    formData.append("timestamp", String(timestamp))
    formData.append("invalidate", invalidate)
    formData.append("api_key", apiKey)
    formData.append("signature", signature)

    const resourceType = media.media_type === "video" ? "video" : "image"
    const destroyResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
      { method: "POST", body: formData },
    )
    const destroyText = await destroyResponse.text()
    let destroyPayload: { result?: string; error?: { message?: string } } = {}
    try {
      destroyPayload = JSON.parse(destroyText)
    } catch {
      return json({ error: "Cloudinary returned an invalid delete response", cloudinaryStatus: destroyResponse.status }, 502)
    }

    cloudinaryResult = destroyPayload.result || "unknown"
    if (!destroyResponse.ok || !["ok", "not found"].includes(cloudinaryResult)) {
      return json({
        error: destroyPayload.error?.message || "Cloudinary asset deletion failed",
        cloudinaryStatus: destroyResponse.status,
        cloudinaryResult,
      }, 502)
    }
  }

  const deleteResponse = await dataRequest(
    `${supabaseUrl}/rest/v1/project_media?id=eq.${encodeURIComponent(mediaId)}`,
    serviceRoleKey,
    { method: "DELETE", headers: { Prefer: "return=minimal" } },
  )
  if (!deleteResponse.ok) {
    return json({ error: "Cloudinary asset was deleted but its database row remains", cloudinaryDeleted: true }, 500)
  }

  return json({ success: true, mediaId, projectId: media.project_id, cloudinaryResult })
})
