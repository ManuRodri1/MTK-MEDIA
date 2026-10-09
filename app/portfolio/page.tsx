import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { ViewportVideo } from "@/components/public/ViewportVideo"
import { localizedHref, resolveLocale } from "@/lib/locale"
import homeStyles from "@/app/home.module.css"
import styles from "./portfolio.module.css"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Films and content for hotels, real estate and doctors, by MTK Media.",
  alternates: {
    canonical: "https://www.mtkmediagroup.com/portfolio",
    languages: {
      "en-US": "https://www.mtkmediagroup.com/portfolio",
      "es-ES": "https://www.mtkmediagroup.com/portfolio?lang=es",
    },
  },
  openGraph: {
    title: "Portfolio | MTK Media",
    description: "Films and content for hotels, real estate and doctors, by MTK Media.",
    url: "https://www.mtkmediagroup.com/portfolio",
    type: "website",
  },
}

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ lang?: string | string[] }> }) {
  const locale = resolveLocale((await searchParams).lang)
  const es = locale === "es"
  const categories = [
    { href: "/portfolio/hospitality-resorts", name: es ? "Hoteles" : "Hotels", poster: "/hospitality-resorts/posters/resort_1.jpg" },
    { href: "/portfolio/real-estate", name: es ? "Bienes raíces" : "Real estate", poster: "/real-estate/posters/video1.jpg" },
    { href: "/portfolio/doctors", name: es ? "Doctores" : "Doctors", poster: "/doctors/posters/doctor_1.jpg" },
  ]
  return <div className={homeStyles.site} lang={locale}>
    <PublicHeader />
    <main>
      <section aria-labelledby="portfolio-title">
        <div className={styles.intro}>
          <h1 id="portfolio-title">{es ? "Portafolio" : "Portfolio"}</h1>
          <p>{es ? "Historias, marcas y experiencias a través del lente de MTK." : "Stories, brands and experiences through the MTK lens."}</p>
        </div>
        <ViewportVideo src="/portfolio-media/mtk-brand-v1.mp4" poster="/portfolio-media/mtk-brand-v1.jpg" label={es ? "MTK Media — película de marca" : "MTK Media — brand film"} locale={locale} eager sound className={styles.film} />
      </section>
      <section className={styles.categories} aria-labelledby="portfolio-categories">
        <h2 id="portfolio-categories">{es ? "Explora el trabajo" : "Explore the work"}</h2>
        <div className={styles.grid}>
          {categories.map((category) => <Link className={styles.category} href={localizedHref(category.href, locale)} key={category.href}>
            <div className={styles.image}><Image src={category.poster} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" /></div>
            <div className={styles.label}><h3>{category.name}</h3><span aria-hidden="true">↗</span></div>
          </Link>)}
        </div>
      </section>
    </main>
    <PublicFooter />
  </div>
}
