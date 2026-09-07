import { redirect } from "next/navigation"

import { MediaTestClient } from "@/components/admin/MediaTestClient"
import { createClient } from "@/lib/supabase/server"

const TEST_PROJECT_SLUG = "mtk-cloudinary-integration-test"

export const dynamic = "force-dynamic"

export default async function MediaTestPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims

  if (!claims?.sub) redirect("/admin/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", claims.sub)
    .single()

  if (!profile || !["admin", "editor"].includes(profile.role)) {
    redirect("/admin/login?unauthorized=1")
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", TEST_PROJECT_SLUG)
    .single()

  if (projectError || !project) {
    throw new Error(`Unable to load the integration test project: ${projectError?.message || "not found"}`)
  }

  const { data: media, error: mediaError } = await supabase
    .from("project_media")
    .select("*")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: true })

  if (mediaError) {
    throw new Error(`Unable to load existing project media: ${mediaError.message}`)
  }

  return (
    <MediaTestClient
      userEmail={typeof claims.email === "string" ? claims.email : "Authenticated staff"}
      projectId={project.id}
      initialMedia={media || []}
    />
  )
}
