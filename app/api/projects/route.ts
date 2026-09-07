import { NextResponse } from "next/server"
import { fetchProjects } from "@/lib/airtable"

export async function GET() {
  try {
    const projects = await fetchProjects()
    return NextResponse.json(projects)
  } catch (error) {
    console.error("[v0] Error in projects API route:", error)
    return NextResponse.json([])
  }
}
