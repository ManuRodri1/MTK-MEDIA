/** Plain-text optional guest name. Missing/null preserves the legacy RSVP contract. */
export function parseGuestName(value: unknown):
  | { valid: true; name: string | undefined }
  | { valid: false } {
  if (value === undefined || value === null) return { valid: true, name: undefined }
  if (typeof value !== "string" || /[\u0000-\u001f\u007f<>]/.test(value)) return { valid: false }
  const name = value.normalize("NFC").trim().replace(/\s+/g, " ")
  if (name.length < 2 || name.length > 100) return { valid: false }
  return { valid: true, name }
}
