import type { Metadata } from "next"
import Link from "next/link"

import { EditorialWorkGrid } from "@/components/public/EditorialWorkGrid"
import { localizedHref, resolveLocale } from "@/lib/locale"
import { getPublishedProjects } from "@/lib/public-work"
import { toWorkItems } from "@/lib/work-items"

import styles from "./work.module.css"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Work",
  description: "Selected video and creative work by MTK Media.",
  alternates: { canonical: "/work" },
}

const copy = {
  en: { kicker: "Selected work", title: ["Made to", "be seen."], intro: "Films and portrait-format work, published directly from the MTK edit.", location: "Santo Domingo · Dominican Republic", emptyTitle: "The next cut is in progress.", emptyBody: "New work will appear here when it is ready.", contact: "Start a conversation" },
  es: { kicker: "Trabajo seleccionado", title: ["Hecho para", "ser visto."], intro: "Películas y trabajo en formato vertical, publicados directamente desde la edición de MTK.", location: "Santo Domingo · República Dominicana", emptyTitle: "El próximo corte está en proceso.", emptyBody: "El nuevo trabajo aparecerá aquí cuando esté listo.", contact: "Hablemos" },
}

type WorkProps = { searchParams: Promise<{ lang?: string | string[] }> }

export default async function WorkPage({ searchParams }: WorkProps) {
  const locale = resolveLocale((await searchParams).lang)
  const t = copy[locale]
  const items = toWorkItems(await getPublishedProjects())
  const range = items.length ? `01 — ${String(items.length).padStart(2, "0")}` : "00 — 00"

  return (
    <div className={styles.page}>
      <header className={styles.workIntro}>
        <div className={styles.workStatement}>
          <p className={styles.kicker}>{t.kicker}</p>
          <h1>{t.title.map((line) => <span key={line}>{line}</span>)}</h1>
        </div>
        <div className={styles.workContext}>
          <p>{t.intro}</p>
          <dl>
            <div><dt>{locale === "es" ? "Índice" : "Index"}</dt><dd>{range}</dd></div>
            <div><dt>{locale === "es" ? "Estudio" : "Studio"}</dt><dd>{t.location}</dd></div>
            <div><dt>{locale === "es" ? "Año" : "Year"}</dt><dd>{new Date().getFullYear()}</dd></div>
          </dl>
        </div>
      </header>

      {items.length === 0 ? (
        <section className={styles.emptyState} aria-labelledby="empty-work">
          <h2 id="empty-work">{t.emptyTitle}</h2>
          <p>{t.emptyBody}</p>
          <Link className={styles.primaryLink} href={localizedHref("/contact", locale)}>{t.contact} <span aria-hidden="true">↗</span></Link>
        </section>
      ) : (
        <section className={styles.videoLibrary} aria-label={locale === "es" ? "Videos publicados" : "Published videos"}>
          <EditorialWorkGrid items={items} locale={locale} headingLevel={2} />
        </section>
      )}
    </div>
  )
}
