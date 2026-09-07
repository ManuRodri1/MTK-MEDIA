"use client"

import { useState } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import ServicesSection from "@/components/services-section"
import FeaturedWorkSection from "@/components/featured-work-section"
import WhyClientsSection from "@/components/why-clients-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"

type Locale = "en" | "es"

export default function HomeClient() {
  const [locale, setLocale] = useState<Locale>("en")

  return (
    <main className="min-h-screen bg-white">
      <Header locale={locale} onLocaleChange={setLocale} />
      <HeroSection locale={locale} />
      <AboutSection locale={locale} />
      <ServicesSection locale={locale} />
      <FeaturedWorkSection locale={locale} />
      <WhyClientsSection locale={locale} />
      <ContactSection locale={locale} />
      <Footer locale={locale} />
    </main>
  )
}
