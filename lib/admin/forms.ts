export function field(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

export function optionalField(formData: FormData, name: string) {
  return field(formData, name) || null
}

export function integerField(formData: FormData, name: string) {
  const parsed = Number.parseInt(field(formData, name), 10)
  return Number.isFinite(parsed) ? parsed : 0
}

export function checked(formData: FormData, name: string) {
  return formData.get(name) === "on" || formData.get(name) === "true"
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function messageUrl(path: string, type: "error" | "success", message: string) {
  const params = new URLSearchParams({ [type]: message })
  return `${path}?${params.toString()}`
}
