import Image from "next/image"
import { siteConfig } from "@/lib/site-config"
import styles from "./PublicChrome.module.css"

export function BrandLogo({ large = false }: { large?: boolean }) {
  return <span className={`${styles.logoCrop} ${large ? styles.logoLarge : ""}`}>
    <Image src={siteConfig.logo.src} width={500} height={500} alt="MTK Media" loading={large ? "lazy" : "eager"} className={styles.logoImage} />
  </span>
}
