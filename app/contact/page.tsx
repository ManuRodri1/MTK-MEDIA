import type { Metadata } from "next"

import { ContactForm } from "@/components/public/ContactForm"
import { PublicFooter } from "@/components/public/PublicFooter"
import { PublicHeader } from "@/components/public/PublicHeader"
import { resolveLocale, type PublicLocale } from "@/lib/locale"

import styles from "./contact.module.css"

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with MTK Media in Santo Domingo.",
  alternates: {
    canonical: "/contact",
    languages: {
      "en-US": "/contact",
      "es-ES": "/contact?lang=es",
    },
  },
}

const copy = {
  en: {
    title: "Let’s make the next frame matter.",
    lede: "A launch, a rebrand, a film, a digital build—tell us what needs to move.",
    location: "Santo Domingo · Dominican Republic",
    social: "Follow the work",
    instagram: "Instagram",
    linkedin: "LinkedIn",
  },
  es: {
    title: "Hagamos que el próximo cuadro importe.",
    lede: "Un lanzamiento, un rebranding, una película o una construcción digital—cuéntanos qué necesita moverse.",
    location: "Santo Domingo · República Dominicana",
    social: "Sigue el trabajo",
    instagram: "Instagram",
    linkedin: "LinkedIn",
  },
} satisfies Record<PublicLocale, Record<string, string>>

type ContactProps = { searchParams: Promise<{ lang?: string | string[] }> }

export default async function ContactPage({ searchParams }: ContactProps) {
  const locale = resolveLocale((await searchParams).lang)
  const t = copy[locale]

  return (
    <div className={styles.site}>
      <PublicHeader />
      <main className={styles.page}>
        <header className={styles.opening}>
          <h1>{t.title}</h1>
          <div className={styles.openingDetail}>
            <p>{t.lede}</p>
            <span>{t.location}</span>
          </div>
        </header>

        <section className={styles.contactBody} aria-label={locale === "es" ? "Formulario de contacto" : "Contact form"}>
          <ContactForm locale={locale} />
          <aside className={styles.social}>
            <p>{t.social}</p>
            <a href="https://www.instagram.com/gustavoreynosomtk/" target="_blank" rel="noreferrer">{t.instagram} <span aria-hidden="true">↗</span></a>
            <a href="https://www.linkedin.com/in/gustavo-reynoso-b33799102/" target="_blank" rel="noreferrer">{t.linkedin} <span aria-hidden="true">↗</span></a>
          </aside>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
