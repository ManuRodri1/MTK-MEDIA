"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { BrandLogo } from "./BrandLogo"
import { localizedHref, resolveLocale } from "@/lib/locale"
import { siteConfig } from "@/lib/site-config"
import styles from "./PublicChrome.module.css"

export function PublicFooter() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = resolveLocale(searchParams.get("lang") ?? undefined)
  const es = locale === "es"
  const changeLocale = (language: "en" | "es") => {
    const next = new URLSearchParams(searchParams.toString())
    if (language === "es") next.set("lang", "es"); else next.delete("lang")
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false })
  }
  return <footer className={styles.footer}>
    <div className={styles.footerMain}>
      <div className={styles.footerIdentity}>
        <Link className={styles.footerBrand} href={localizedHref("/", locale)} aria-label={es ? "MTK Media — inicio" : "MTK Media home"}><BrandLogo large /></Link>
        <p>Marketing.<br />Technology.<br />Kreativity.<br />Evolved.</p>
      </div>
      <div className={styles.footerDirectory}>
        <Link className={styles.footerProject} href={localizedHref("/contact", locale)}>{es ? "Iniciar un proyecto" : "Start a project"} <span aria-hidden="true">→</span></Link>
        <div className={styles.footerLinks}>
          <nav aria-label={es ? "Navegación del pie de página" : "Footer navigation"}>
            <h2>{es ? "Explorar" : "Explore"}</h2>
            <Link href={localizedHref("/work", locale)}>{es ? "Trabajo" : "Work"}</Link>
            <Link href={localizedHref("/services", locale)}>{es ? "Servicios" : "Services"}</Link>
            <Link href={localizedHref("/contact", locale)}>{es ? "Contacto" : "Contact"}</Link>
          </nav>
          <div><h2>Social</h2>{siteConfig.social.map((social) => <a key={social.name} href={social.href} target="_blank" rel="noreferrer">{social.name} <span aria-hidden="true">↗</span></a>)}</div>
          <div className={styles.footerLocation}><h2>{es ? "Estudio" : "Studio"}</h2><p>Santo Domingo<br />{es ? "República Dominicana" : "Dominican Republic"}</p>
            <div className={styles.localeSwitch} aria-label={es ? "Idioma" : "Language"}>
              <button type="button" aria-pressed={!es} onClick={() => changeLocale("en")}>EN</button><span aria-hidden="true">/</span><button type="button" aria-pressed={es} onClick={() => changeLocale("es")}>ES</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className={styles.footerUtility}>
      <p>© {new Date().getFullYear()} MTK Media <span>{es ? "Todos los derechos reservados." : "All rights reserved."}</span></p>
      <a href={siteConfig.credit.href} target="_blank" rel="noreferrer">{siteConfig.credit.role[locale]} {siteConfig.credit.name}</a>
    </div>
  </footer>
}
