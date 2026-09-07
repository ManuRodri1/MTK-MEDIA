import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { PublicFooter } from "@/components/public/PublicFooter"
import { PublicHeader } from "@/components/public/PublicHeader"
import { localizedHref, resolveLocale, type PublicLocale } from "@/lib/locale"
import { getActiveServices } from "@/lib/public-work"

import styles from "./services.module.css"

export const metadata: Metadata = {
  title: "Services — Brand Identity, Social Media, Content, Web",
  description:
    "Complete digital support for businesses. Brand identity design, social media management, content creation, and website development services.",
  alternates: {
    canonical: "https://www.mtkmediagroup.com/services",
    languages: {
      "en-US": "https://www.mtkmediagroup.com/services",
      "es-ES": "https://www.mtkmediagroup.com/services?lang=es",
    },
  },
  openGraph: {
    title: "Services — Brand Identity, Social Media, Content, Web | MTK Media",
    description:
      "Complete digital support for businesses. Brand identity design, social media management, content creation, and website development services.",
    url: "https://www.mtkmediagroup.com/services",
    type: "website",
  },
}

export const dynamic = "force-dynamic"

const copy = {
  en: {
    title: "The idea is only the first cut.",
    lede: "MTK combines the thinking, systems and production a brand needs to move from intention to output.",
    disciplines: [
      { name: "Marketing", statement: "We decide what the story needs to do.", body: "Brand strategy, campaign thinking, social direction, community management and the editorial planning that keeps every release connected." },
      { name: "Technology", statement: "We build where the story needs to live.", body: "Websites, digital infrastructure, content systems and practical technical support—designed to be useful after launch day." },
      { name: "Kreativity", statement: "We make the story worth watching.", body: "Identity, art direction, photography, video, editing and visual content shaped for the places your audience actually sees it." },
    ],
    roster: "Current studio services",
    rosterBody: "This list comes directly from the MTK project system. The mix changes with the assignment; the craft does not.",
    close: "Bring us the brief. We will find the cut.",
    contact: "Start a project",
  },
  es: {
    title: "La idea es solo el primer corte.",
    lede: "MTK combina el pensamiento, los sistemas y la producción que una marca necesita para pasar de la intención al resultado.",
    disciplines: [
      { name: "Marketing", statement: "Decidimos lo que la historia debe lograr.", body: "Estrategia de marca, campañas, dirección social, gestión de comunidad y la planificación editorial que mantiene cada entrega conectada." },
      { name: "Technology", statement: "Construimos donde la historia necesita vivir.", body: "Sitios web, infraestructura digital, sistemas de contenido y soporte técnico práctico—diseñados para seguir funcionando después del lanzamiento." },
      { name: "Kreativity", statement: "Hacemos que la historia valga la pena verla.", body: "Identidad, dirección de arte, fotografía, video, edición y contenido visual para los lugares donde tu audiencia realmente lo ve." },
    ],
    roster: "Servicios actuales del estudio",
    rosterBody: "Esta lista viene directamente del sistema de proyectos de MTK. La mezcla cambia con la asignación; el oficio no.",
    close: "Tráenos el brief. Encontraremos el corte.",
    contact: "Iniciar un proyecto",
  },
} satisfies Record<PublicLocale, { title: string; lede: string; disciplines: Array<{ name: string; statement: string; body: string }>; roster: string; rosterBody: string; close: string; contact: string }>

const serviceImages = [
  { src: "/images/social-20media.jpg", alt: "Creative team planning social media work" },
  { src: "/images/websites.jpg", alt: "Website interface work in progress" },
  { src: "/images/context-20creation.jpg", alt: "Cameras and lighting inside a production studio" },
]

type ServicesProps = { searchParams: Promise<{ lang?: string | string[] }> }

export default async function ServicesPage({ searchParams }: ServicesProps) {
  const locale = resolveLocale((await searchParams).lang)
  const t = copy[locale]
  const services = await getActiveServices()

  return (
    <div className={styles.site}>
      <PublicHeader />
      <main>
        <header className={styles.opening}>
          <h1>{t.title}</h1>
          <p>{t.lede}</p>
        </header>

        <section className={styles.disciplines} aria-label={locale === "es" ? "Disciplinas" : "Disciplines"}>
          {t.disciplines.map((discipline, index) => (
            <article className={styles.discipline} key={discipline.name}>
              <div className={styles.disciplineMedia}>
                <Image src={serviceImages[index].src} alt={serviceImages[index].alt} fill sizes="(min-width: 768px) 58vw, 100vw" />
              </div>
              <div className={styles.disciplineCopy}>
                <span aria-hidden="true">0{index + 1}</span>
                <h2>{discipline.name}</h2>
                <p className={styles.statement}>{discipline.statement}</p>
                <p>{discipline.body}</p>
              </div>
            </article>
          ))}
        </section>

        {services.length ? (
          <section className={styles.roster} aria-labelledby="service-roster-title">
            <div className={styles.rosterIntro}>
              <h2 id="service-roster-title">{t.roster}</h2>
              <p>{t.rosterBody}</p>
            </div>
            <ol className={styles.rosterList}>
              {services.map((service, index) => (
                <li key={service.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{service.name}</strong>
                  {service.description ? <p>{service.description}</p> : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className={styles.close} aria-labelledby="services-close-title">
          <h2 id="services-close-title">{t.close}</h2>
          <Link className={styles.primaryLink} href={localizedHref("/contact", locale)}>{t.contact} <span aria-hidden="true">↗</span></Link>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
