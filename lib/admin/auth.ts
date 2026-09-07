import "server-only"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

const STAFF_ROLES = new Set(["admin", "editor"])

export async function requireStaff() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims

  if (!claims?.sub) redirect("/admin/login")

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", claims.sub)
    .single()

  if (error || !profile || !STAFF_ROLES.has(profile.role)) {
    redirect("/admin/login?unauthorized=1")
  }

  return {
    supabase,
    profile,
    userId: claims.sub,
    email: typeof claims.email === "string" ? claims.email : "MTK staff",
  }
}
