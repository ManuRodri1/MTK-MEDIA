"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { BrandLogo } from "./BrandLogo"
import styles from "./PublicChrome.module.css"
import { localizedHref, resolveLocale } from "@/lib/locale"

export function PublicHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = resolveLocale(searchParams.get("lang") ?? undefined)
  const [open, setOpen] = useState(false)
  const [overHero, setOverHero] = useState(overlay)
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!overlay) return
    const hero = document.getElementById("showreel")
    if (!hero) return
    const observer = new IntersectionObserver(([entry]) => setOverHero(entry.intersectionRatio > 0.95), { threshold: [0, 0.95] })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [overlay])

  useEffect(() => { setOpen(false); document.documentElement.lang = locale }, [pathname, searchParams, locale])
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => { if (!headerRef.current?.contains(event.target as Node)) setOpen(false) }
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); menuRef.current?.focus() } }
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", escape)
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape) }
  }, [open])

  const setLocale = (nextLocale: "en" | "es") => {
    const next = new URLSearchParams(searchParams.toString())
    if (nextLocale === "es") next.set("lang", "es")
    else next.delete("lang")
    router.replace(`${pathname}${next.size ? `?${next.toString()}` : ""}`, { scroll: false })
  }
  const links = [
    { href: "/portfolio", label: locale === "es" ? "Portafolio" : "Portfolio" },
    { href: "/work", label: locale === "es" ? "Trabajo" : "Work" },
    { href: "/services", label: locale === "es" ? "Servicios" : "Services" },
    { href: "/contact", label: locale === "es" ? "Contacto" : "Contact" },
  ]
  const languages = <div className={styles.localeSwitch} aria-label={locale === "es" ? "Idioma" : "Language"}>
    <button type="button" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>EN</button>
    <span aria-hidden="true">/</span>
    <button type="button" aria-pressed={locale === "es"} onClick={() => setLocale("es")}>ES</button>
  </div>

  return <header ref={headerRef} className={`${styles.header} ${overlay ? styles.headerFixed : ""} ${overHero && !open ? styles.headerOverlay : styles.headerSolid}`}>
    <Link className={styles.brandLink} href={localizedHref("/", locale)} aria-label={locale === "es" ? "MTK Media — inicio" : "MTK Media home"}><BrandLogo /></Link>
    <div className={styles.desktopGroup}>
      <nav className={styles.desktopNav} aria-label={locale === "es" ? "Navegación principal" : "Primary navigation"}>
        {links.map((link) => <Link key={link.href} href={localizedHref(link.href, locale)} aria-current={pathname.startsWith(link.href) ? "page" : undefined}>{link.label}</Link>)}
      </nav>
      {languages}
    </div>
    <button ref={menuRef} className={styles.menuButton} type="button" aria-expanded={open} aria-controls="public-menu" onClick={() => setOpen(!open)}>
      {open ? (locale === "es" ? "Cerrar" : "Close") : (locale === "es" ? "Menú" : "Menu")} <span aria-hidden="true">{open ? "−" : "+"}</span>
    </button>
    {open ? <nav id="public-menu" className={styles.mobileNav} aria-label={locale === "es" ? "Navegación móvil" : "Mobile navigation"}>
      {links.map((link) => <Link key={link.href} href={localizedHref(link.href, locale)} aria-current={pathname.startsWith(link.href) ? "page" : undefined}>{link.label}</Link>)}
      {languages}
    </nav> : null}
  </header>
}
