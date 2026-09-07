import { NextResponse } from "next/server"
import { fetchBlogPosts } from "@/lib/airtable"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const language = searchParams.get("language") as "EN" | "ES" | null

  try {
    const posts = await fetchBlogPosts(language || undefined)
    return NextResponse.json(posts)
  } catch (error) {
    console.error("[v0] Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}
