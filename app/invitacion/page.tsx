import type { Metadata } from "next"
import Invitation from "./Invitation"
import "./invitation.css"

type Props = { searchParams: Promise<{ lang?: string | string[] }> }
const base = "https://www.mtkmediagroup.com/invitacion"

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const english = (await searchParams).lang === "en"
  const description = english
    ? "Music, DJs and a very MTK celebration. November 6, 2026 · 7:00 PM · Plaza Turisol, unit 7 · San Felipe de Puerto Plata."
    : "Música, DJs y una noche muy MTK. 6 de noviembre de 2026 · 7:00 PM · Plaza Turisol, local 7 · San Felipe de Puerto Plata."
  const url = `${base}?lang=${english ? "en" : "es"}`
  const image = { url: "https://www.mtkmediagroup.com/invitacion/og-invitation.png", width: 1200, height: 630, alt: "#SubioLaLibra · MTK Media" }
  return {
    title: { absolute: "#SubioLaLibra · MTK Media" }, description,
    alternates: { canonical: url, languages: { es: `${base}?lang=es`, en: `${base}?lang=en` } },
    robots: { index: false, follow: false },
    openGraph: { title: "#SubioLaLibra · MTK Media", description, url, type: "website", siteName: "MTK Media", locale: english ? "en_US" : "es_DO", alternateLocale: english ? "es_DO" : "en_US", images: [image] },
    twitter: { card: "summary_large_image", title: "#SubioLaLibra · MTK Media", description, images: [image.url] },
  }
}

export default async function Page({ searchParams }: Props) {
  return <Invitation initialLanguage={(await searchParams).lang === "en" ? "en" : "es"} />
}
