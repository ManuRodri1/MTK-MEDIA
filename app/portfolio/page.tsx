import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import photos from "@/lib/portfolio/photography.json"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { ViewportVideo } from "@/components/public/ViewportVideo"
import { localizedHref, resolveLocale } from "@/lib/locale"
import homeStyles from "@/app/home.module.css"
import styles from "./portfolio.module.css"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Films, event coverage and photography for hotels, real estate and brands, by MTK Media.",
  alternates: {
    canonical: "https://www.mtkmediagroup.com/portfolio",
    languages: {
      "en-US": "https://www.mtkmediagroup.com/portfolio",
      "es-ES": "https://www.mtkmediagroup.com/portfolio?lang=es",
    },
  },
  openGraph: {
    title: "Portfolio | MTK Media",
    description: "Films, event coverage and photography for hotels, real estate and brands, by MTK Media.",
    url: "https://www.mtkmediagroup.com/portfolio",
    type: "website",
  },
}

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ lang?: string | string[] }> }) {
  const locale = resolveLocale((await searchParams).lang)
  const es = locale === "es"
  const categories = [
    { href: "/portfolio/hospitality-resorts", name: es ? "Hoteles" : "Hotels", media: [1, 6].map(n => ({ src: `/hospitality-resorts/videos/resort_${n}.mp4`, poster: `/hospitality-resorts/posters/resort_${n}.jpg` })) },
    { href: "/portfolio/real-estate", name: es ? "Bienes raíces" : "Real estate", media: [1, 6].map(n => ({ src: `/real-estate/videos/video${n}.mp4`, poster: `/real-estate/posters/video${n}.jpg` })) },
    { href: "/portfolio/doctors", name: es ? "Doctores" : "Doctors", media: [1, 6].map(n => ({ src: `/doctors/videos/doctor_${n}.mp4`, poster: `/doctors/posters/doctor_${n}.jpg` })) },
    { href: "/portfolio/events", name: es ? "Cobertura de eventos" : "Events Coverage", media: ["lifestyle-event-2026", "lifestyle-beach-day"].map(name => ({ src: `/events/media/${name}-preview.mp4`, poster: `/events/media/${name}-poster.jpg` })) },
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
          {categories.map((category) => <article className={styles.category} key={category.href}>
            <div className={styles.previewPair}>
              {category.media.map((media, index) => <ViewportVideo key={media.src} src={media.src} poster={media.poster} label={`${category.name} — ${es ? "muestra" : "preview"} ${index + 1}`} locale={locale} className={styles.preview} />)}
            </div>
            <div className={styles.label}><h3>{category.name}</h3><span aria-hidden="true">↗</span></div>
            <p className={styles.viewLabel}>{es ? "Ver portafolio completo" : "View full portfolio"}</p>
            <Link className={styles.categoryLink} href={localizedHref(category.href, locale)} aria-label={`${es ? "Ver portafolio completo" : "View full portfolio"}: ${category.name}`} />
          </article>)}
          <article className={styles.category}>
            <div className={styles.photoPreview}>
              {photos.slice(0,4).map(photo => <Image key={photo.id} src={photo.thumbnail || photo.src} alt={es ? photo.alt_es : photo.alt_en} width={photo.width} height={photo.height} sizes="(max-width: 768px) 50vw, 17vw" />)}
            </div>
            <div className={styles.label}><h3>{es ? "Fotografía" : "Photography"}</h3><span aria-hidden="true">↗</span></div>
            <p className={styles.viewLabel}>{es ? "Ver galería completa" : "View full gallery"}</p>
            <Link className={styles.categoryLink} href={localizedHref("/portfolio/photography", locale)} aria-label={es ? "Ver portafolio de fotografía" : "View photography portfolio"} />
          </article>
        </div>
      </section>
    </main>
    <PublicFooter />
  </div>
}
