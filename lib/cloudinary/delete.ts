import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/client"
import { validateDeleteMediaResponse } from "./delete-response"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

async function deletionError(error: unknown) {
  if (error instanceof FunctionsHttpError) {
    const response = error.context
    try {
      const payload = await response.clone().json() as unknown
      if (isRecord(payload) && typeof payload.error === "string") return payload.error
    } catch {
      // Fall back to the stable status message below.
    }
    return `The delete service returned ${response.status}.`
  }
  if (error instanceof FunctionsRelayError) return "The delete service is temporarily unavailable."
  if (error instanceof FunctionsFetchError) return "Unable to reach the delete service. Check your connection."
  return error instanceof Error ? error.message : "Unable to delete this file."
}

export async function deleteProjectMedia(mediaId: string) {
  const supabase = createClient()
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

  if (sessionError || !sessionData.session) {
    throw new Error("Your session expired. Sign in again before deleting this file.")
  }

  const { data, error } = await supabase.functions.invoke<unknown>("cloudinary-media-delete", {
    body: { mediaId },
    headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
  })

  if (error) throw new Error(await deletionError(error))
  return validateDeleteMediaResponse(data, mediaId)
}
