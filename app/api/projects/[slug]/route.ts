import { NextResponse } from "next/server"
import { fetchProjectBySlug } from "@/lib/airtable"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const project = await fetchProjectBySlug(slug)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("[v0] Error in project API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
