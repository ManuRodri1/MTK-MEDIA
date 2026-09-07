import Image from "next/image"
import type { PublicLocale } from "@/lib/locale"
import { filmPoster, homeFilms } from "@/lib/site-config"
import { ViewportVideo } from "./ViewportVideo"
import styles from "@/app/home.module.css"

export function ShowreelHero({ locale }: { locale: PublicLocale }) {
  const poster = filmPoster(homeFilms.hero)
  return (
    <section className={styles.hero} id="showreel" aria-label={locale === "es" ? "Showreel del estudio MTK" : "MTK studio showreel"}>
      <div className={styles.heroAtmosphere} aria-hidden="true">
        <Image src={poster} alt="" fill sizes="100vw" loading="eager" fetchPriority="high" />
      </div>
      <ViewportVideo src={homeFilms.hero} poster={poster} label={locale === "es" ? "Showreel MTK" : "MTK showreel"} locale={locale} className={styles.heroStage} eager sound />
      <div className={styles.heroMeta}><span>MTK / 001</span><span>Santo Domingo · DR</span></div>
      <h1 className={styles.heroTitle}>
        <span>Marketing.</span><span>Technology.</span><span>Kreativity.</span><span className={styles.heroEvolved}>Evolved.</span>
      </h1>
    </section>
  )
}
