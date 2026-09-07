export type PublicLocale = "en" | "es"

export function resolveLocale(value: string | string[] | undefined): PublicLocale {
  return (Array.isArray(value) ? value[0] : value) === "es" ? "es" : "en"
}

export function localizedHref(href: string, locale: PublicLocale) {
  if (locale === "en") return href
  const separator = href.includes("?") ? "&" : "?"
  return `${href}${separator}lang=es`
}
