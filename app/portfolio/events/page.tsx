import type { Metadata } from "next"
import Link from "next/link"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { PortfolioGallery } from "@/components/public/PortfolioGallery"
import { localizedHref, resolveLocale } from "@/lib/locale"
import items from "@/lib/portfolio/events.json"
import homeStyles from "@/app/home.module.css"
import styles from "../gallery-page.module.css"

export const metadata: Metadata = {
  title: "Events Coverage | MTK Media",
  description: "Films that capture the energy, the people and the moments worth remembering.",
  alternates: { canonical: "https://www.mtkmediagroup.com/portfolio/events", languages: { "en-US": "https://www.mtkmediagroup.com/portfolio/events", "es-ES": "https://www.mtkmediagroup.com/portfolio/events?lang=es" } },
}
export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string | string[] }> }) {
 const locale = resolveLocale((await searchParams).lang)
 const es = locale === "es"
 return <div className={`${homeStyles.site} ${styles.page}`} lang={locale}>
   <PublicHeader />
   <main>
     <section className={styles.hero}>
       <div className={styles.eyebrow}><Link href={localizedHref("/portfolio",locale)}>MTK MEDIA · {es ? "PORTAFOLIO" : "SELECTED WORK"}</Link></div>
       <h1>{es ? "Cobertura de eventos" : "Events Coverage"}</h1>
       <p>{es ? "Películas que capturan la energía, las personas y los momentos que vale la pena recordar." : "Films that capture the energy, the people and the moments worth remembering."}</p>
     </section>
     <div className={styles.workhead}><h2>{es ? "El trabajo" : "Selected work"}</h2><span>{es ? "08 VIDEOS" : "08 FILMS"}</span></div>
     <PortfolioGallery items={items} kind="events" locale={locale} />
     <section className={styles.closing}><h2>{es ? "Hagamos algo que valga la pena recordar." : "Let’s make something worth remembering."}</h2><Link href={localizedHref("/contact",locale)}>{es ? "Hablemos de tu proyecto" : "Tell us about your project"} ↗</Link></section>
   </main>
   <PublicFooter />
 </div>
}
