export type DeleteMediaResponse = {
  success: true
  mediaId: string
  projectId: string
  cloudinaryResult: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function validateDeleteMediaResponse(value: unknown, expectedMediaId: string): DeleteMediaResponse {
  if (
    !isRecord(value)
    || value.success !== true
    || value.mediaId !== expectedMediaId
    || typeof value.projectId !== "string"
    || typeof value.cloudinaryResult !== "string"
  ) {
    throw new Error("The delete service returned an invalid response.")
  }

  return value as DeleteMediaResponse
}
