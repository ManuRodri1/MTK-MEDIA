import type { Metadata } from "next"
import Link from "next/link"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { PortfolioGallery } from "@/components/public/PortfolioGallery"
import { localizedHref, resolveLocale } from "@/lib/locale"
import items from "@/lib/portfolio/photography.json"
import homeStyles from "@/app/home.module.css"
import styles from "../gallery-page.module.css"

export const metadata: Metadata = {
  title: "Photography | MTK Media",
  description: "A collection of places, people and details, through the MTK lens.",
  alternates: { canonical: "https://www.mtkmediagroup.com/portfolio/photography", languages: { "en-US": "https://www.mtkmediagroup.com/portfolio/photography", "es-ES": "https://www.mtkmediagroup.com/portfolio/photography?lang=es" } },
}
export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string | string[] }> }) {
 const locale = resolveLocale((await searchParams).lang)
 const es = locale === "es"
 return <div className={`${homeStyles.site} ${styles.page}`} lang={locale}>
   <PublicHeader />
   <main>
     <section className={styles.hero}>
       <div className={styles.eyebrow}><Link href={localizedHref("/portfolio",locale)}>MTK MEDIA · {es ? "PORTAFOLIO" : "SELECTED WORK"}</Link></div>
       <h1>{es ? "Fotografía" : "Photography"}</h1>
       <p>{es ? "Una colección de lugares, personas y detalles, a través del lente de MTK." : "A collection of places, people and details, through the MTK lens."}</p>
     </section>
     <div className={styles.workhead}><h2>{es ? "El trabajo" : "Selected work"}</h2><span>{es ? "35 FOTOGRAFÍAS" : "35 PHOTOGRAPHS"}</span></div>
     <PortfolioGallery items={items} kind="photography" locale={locale} />
     <section className={styles.closing}><h2>{es ? "Hagamos algo que valga la pena recordar." : "Let’s make something worth remembering."}</h2><Link href={localizedHref("/contact",locale)}>{es ? "Hablemos de tu proyecto" : "Tell us about your project"} ↗</Link></section>
   </main>
   <PublicFooter />
 </div>
}
