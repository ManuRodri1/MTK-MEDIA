import { handleRsvp } from "@/lib/invitation-rsvp"

export const runtime = "nodejs"

export async function POST(request: Request) {
  return handleRsvp(request)
}
