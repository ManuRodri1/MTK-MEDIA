import type { Metadata } from "next"
import Link from "next/link"

import { PublicFooter } from "@/components/public/PublicFooter"
import { PublicHeader } from "@/components/public/PublicHeader"
import { ShowreelHero } from "@/components/public/ShowreelHero"
import { localizedHref, resolveLocale, type PublicLocale } from "@/lib/locale"
import { getPublishedProjects } from "@/lib/public-work"
import { selectHomepageWork, toWorkItems } from "@/lib/work-items"
import { filmPoster, homeFilms, siteConfig } from "@/lib/site-config"
import { EditorialWorkGrid } from "@/components/public/EditorialWorkGrid"
import { DisciplineIndex } from "@/components/public/DisciplineIndex"
import { ViewportVideo } from "@/components/public/ViewportVideo"

import styles from "./home.module.css"

export const metadata: Metadata = {
  title: "MTK Media — Digital branding & creative strategy",
  description: "We help businesses grow through branding, design, content and digital strategy.",
  alternates: {
    canonical: "https://www.mtkmediagroup.com/",
    languages: {
      "en-US": "https://www.mtkmediagroup.com/",
      "es-ES": "https://www.mtkmediagroup.com/?lang=es",
    },
  },
  openGraph: {
    title: "MTK Media — Digital branding & creative strategy",
    description: "We help businesses grow through branding, design, content and digital strategy.",
    url: "https://www.mtkmediagroup.com/",
    type: "website",
  },
}

export const dynamic = "force-dynamic"

const copy = {
  en: {
    manifestoSetup: "We are not like the other agencies.",
    manifestoPayoff: "We are a cool agency.",
    manifestoBody: "A creative studio where strategy, production and digital craft share the same edit. We make brands look alive—and build the systems that keep them moving.",
    selected: "Selected work",
    selectedBody: "Campaigns, films, identities and digital experiences. The work changes shape; the point of view stays MTK.",
    viewProject: "View project",
    viewWork: "View all work",
    disciplines: "Three disciplines. One cut.",
    disciplineCopy: [
      "Positioning, campaigns and the decisions that move a brand forward.",
      "Websites, digital systems and reliable infrastructure behind the idea.",
      "Identity, content and production with a human point of view.",
    ],
    studioTitle: "Built around the making.",
    studioBody: "From the first treatment to the final export, MTK works close to the people, cameras, screens and details that turn an idea into something real.",
    services: "See our services",
    finalTitle: "Have a story worth cutting together?",
    finalBody: "Tell us what you are making, changing or launching.",
    contact: "Start a project",
    instagram: "Instagram",
    empty: "The next cut is in progress.",
  },
  es: {
    manifestoSetup: "No somos como las otras agencias.",
    manifestoPayoff: "Somos una agencia cool.",
    manifestoBody: "Un estudio creativo donde estrategia, producción y oficio digital comparten la misma edición. Hacemos que las marcas se sientan vivas y construimos los sistemas que las mantienen en movimiento.",
    selected: "Trabajo seleccionado",
    selectedBody: "Campañas, películas, identidades y experiencias digitales. El trabajo cambia de forma; el punto de vista sigue siendo MTK.",
    viewProject: "Ver proyecto",
    viewWork: "Ver todo el trabajo",
    disciplines: "Tres disciplinas. Un solo corte.",
    disciplineCopy: [
      "Posicionamiento, campañas y decisiones que impulsan una marca.",
      "Sitios web, sistemas digitales e infraestructura confiable detrás de la idea.",
      "Identidad, contenido y producción con un punto de vista humano.",
    ],
    studioTitle: "Construido alrededor del hacer.",
    studioBody: "Desde el primer tratamiento hasta la exportación final, MTK trabaja cerca de las personas, cámaras, pantallas y detalles que convierten una idea en algo real.",
    services: "Ver nuestros servicios",
    finalTitle: "¿Tienes una historia que vale la pena editar?",
    finalBody: "Cuéntanos qué estás creando, cambiando o lanzando.",
    contact: "Iniciar un proyecto",
    instagram: "Instagram",
    empty: "El próximo corte está en proceso.",
  },
} satisfies Record<PublicLocale, Record<string, string | string[]>>

type HomeProps = { searchParams: Promise<{ lang?: string | string[] }> }

export default async function Home({ searchParams }: HomeProps) {
  const locale = resolveLocale((await searchParams).lang)
  const t = copy[locale]
  const projects = await getPublishedProjects()
  const selectedProjects = selectHomepageWork(toWorkItems(projects), 4)

  return (
    <div className={styles.site} lang={locale}>
      <PublicHeader overlay />
      <main>
        <ShowreelHero locale={locale} />

        <section className={styles.manifesto} aria-labelledby="manifesto-title">
          <h2 id="manifesto-title">
            <span className={styles.manifestoSetup}>{t.manifestoSetup}</span>
            <span className={styles.manifestoPayoff}>{t.manifestoPayoff}</span>
          </h2>
          <div className={styles.manifestoNote}><p>{t.manifestoBody}</p><span aria-hidden="true">↓</span></div>
        </section>

        <section className={styles.work} aria-labelledby="selected-work-title">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionHeading} id="selected-work-title">{t.selected}</h2>
            <p>{t.selectedBody}</p>
          </div>

          <div className={styles.workGridFrame}><EditorialWorkGrid items={selectedProjects} locale={locale} variant="featured" /></div>

          <Link className={styles.workLink} href={localizedHref("/work", locale)}>{t.viewWork} <span aria-hidden="true">↗</span></Link>
        </section>

        <section className={styles.disciplines} aria-labelledby="disciplines-title">
          <h2 className={styles.sectionHeading} id="disciplines-title">{t.disciplines}</h2>
          <DisciplineIndex descriptions={t.disciplineCopy as string[]} />
        </section>

        <section className={styles.studio} aria-labelledby="studio-title">
          <ViewportVideo src={homeFilms.production} poster={filmPoster(homeFilms.production)} label={locale === "es" ? "MTK — producción en Las Terrenas" : "MTK — production in Las Terrenas"} locale={locale} className={styles.studioMedia} />
          <div className={styles.studioCopy}>
            <h2 id="studio-title">{t.studioTitle}</h2>
            <p>{t.studioBody}</p>
            <div className={styles.studioActions}>
              <Link className={styles.studioPrimary} href={localizedHref("/contact", locale)}>{t.contact} <span aria-hidden="true">→</span></Link>
              <Link className={styles.textLink} href={localizedHref("/services", locale)}>{t.services} <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>

        <section className={styles.finalFrame} aria-labelledby="final-title">
          <div>
            <h2 id="final-title">{t.finalTitle}</h2>
            <p>{t.finalBody}</p>
          </div>
          <div className={styles.finalActions}>
            <Link className={styles.primaryLink} href={localizedHref("/contact", locale)}>{t.contact} <span aria-hidden="true">↗</span></Link>
            <a className={styles.textLink} href={siteConfig.social[0].href} target="_blank" rel="noreferrer">{t.instagram} <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
