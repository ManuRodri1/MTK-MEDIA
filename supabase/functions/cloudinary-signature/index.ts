import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
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
  const data = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest("SHA-1", data)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

async function readRows<T>(url: string, serviceRoleKey: string): Promise<T[]> {
  const response = await fetch(url, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Accept: "application/json",
    },
  })

  if (!response.ok) throw new Error(`Data API lookup failed (${response.status})`)
  return await response.json() as T[]
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

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Supabase server configuration is incomplete" }, 500)
  }
  if (!cloudName || !apiKey || !apiSecret) {
    return json({ error: "Cloudinary server configuration is incomplete" }, 500)
  }

  let body: { projectId?: string; mediaType?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: "Invalid JSON body" }, 400)
  }

  const projectId = body.projectId?.trim()
  const mediaType = body.mediaType?.trim().toLowerCase()

  if (!projectId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(projectId)) {
    return json({ error: "Invalid projectId" }, 400)
  }
  if (mediaType !== "image" && mediaType !== "video") {
    return json({ error: "mediaType must be 'image' or 'video'" }, 400)
  }

  try {
    const profiles = await readRows<{ role?: string }>(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=role&limit=1`,
      serviceRoleKey,
    )
    const role = profiles[0]?.role
    if (role !== "admin" && role !== "editor") return json({ error: "Forbidden" }, 403)

    const projects = await readRows<{ slug?: string }>(
      `${supabaseUrl}/rest/v1/projects?id=eq.${encodeURIComponent(projectId)}&select=slug&limit=1`,
      serviceRoleKey,
    )
    const projectSlug = projects[0]?.slug?.trim().toLowerCase()
    if (!projectSlug) return json({ error: "Project not found" }, 404)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(projectSlug)) {
      return json({ error: "Project has an invalid slug" }, 409)
    }

    const uploadPreset = mediaType === "image" ? "mtk_portfolio_images" : "mtk_portfolio_videos"
    const assetFolder = `MTK-Media/projects/${projectSlug}/${mediaType === "image" ? "images" : "videos"}`
    const tags = `mtk-media,portfolio,${mediaType},${projectSlug}`
    const timestamp = Math.floor(Date.now() / 1000)
    const paramsToSign: Record<string, string> = {
      asset_folder: assetFolder,
      tags,
      timestamp: String(timestamp),
      upload_preset: uploadPreset,
    }
    const serialized = Object.entries(paramsToSign)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${key}=${value}`)
      .join("&")
    const signature = await sha1Hex(serialized + apiSecret)

    return json({
      cloudName,
      apiKey,
      resourceType: mediaType,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${mediaType}/upload`,
      timestamp,
      signature,
      uploadPreset,
      assetFolder,
      tags,
      expiresAt: timestamp + 3600,
    })
  } catch (error) {
    console.error("cloudinary-signature lookup error", error)
    return json({ error: "Unable to authorize upload" }, 500)
  }
})
