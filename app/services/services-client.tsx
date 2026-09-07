"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Palette, Users, Video, Globe } from "lucide-react"

type Locale = "en" | "es"

const copy = {
  en: {
    intro: {
      title: "Complete digital support for businesses that want consistency, clarity, and results.",
      subtitle: "Our services combine strategy, design, and creative execution.",
    },
    services: [
      {
        title: "Brand Identity & Design",
        copy: "We build identities that communicate trust, clarity, and personality.",
        items: [
          "Logo design",
          "Color palette & typographic system",
          "Visual guidelines",
          "Branded materials",
          "Merch design",
          "Flyers & brochures",
        ],
      },
      {
        title: "Social Media Management",
        copy: "Your social media should work for you, not overwhelm you.",
        items: [
          "Strategy",
          "Monthly content calendar",
          "Copywriting",
          "Posting & scheduling",
          "Community management",
          "Performance reports",
        ],
      },
      {
        title: "Content Creation",
        copy: "Quality content is non-negotiable.",
        items: ["Photo editing", "Video editing", "Reels/TikTok", "Visual creatives"],
      },
      {
        title: "Websites & Digital Infrastructure",
        copy: "Your digital foundation needs to be reliable and simple.",
        items: ["Website creation", "Website monitoring", "SEO-ready blog content", "Mailchimp setup"],
      },
    ],
    cta: {
      title: "Ready to build something exceptional?",
      button: "Work With Us",
    },
  },
  es: {
    intro: {
      title: "Soporte digital completo para negocios que buscan consistencia, claridad y resultados.",
      subtitle: "Nuestros servicios combinan estrategia, diseño y ejecución creativa.",
    },
    services: [
      {
        title: "Identidad de Marca y Diseño",
        copy: "Construimos identidades que comunican confianza, claridad y personalidad.",
        items: [
          "Diseño de logo",
          "Paleta de colores y sistema tipográfico",
          "Guías visuales",
          "Material corporativo",
          "Diseño de merch",
          "Flyers y brochures",
        ],
      },
      {
        title: "Gestión de Redes Sociales",
        copy: "Las redes deben trabajar para ti, no abrumarte.",
        items: [
          "Estrategia",
          "Calendario mensual",
          "Redacción de contenido",
          "Publicación",
          "Gestión de comunidad",
          "Reportes de desempeño",
        ],
      },
      {
        title: "Creación de Contenido",
        copy: "El contenido de calidad no es negociable.",
        items: ["Edición de fotos", "Edición de video", "Reels/TikTok", "Creatividades visuales"],
      },
      {
        title: "Sitios Web e Infraestructura Digital",
        copy: "Tu base digital debe ser simple y confiable.",
        items: [
          "Creación de sitios web",
          "Monitoreo y mantenimiento",
          "Contenido SEO para blogs",
          "Integración con Mailchimp",
        ],
      },
    ],
    cta: {
      title: "¿Listo para construir algo excepcional?",
      button: "Trabajemos juntos",
    },
  },
}

const icons = [Palette, Users, Video, Globe]

const serviceImages = [
  "/images/brand-20image.png",
  "/images/social-20media.jpg",
  "/images/context-20creation.jpg",
  "/images/websites.jpg",
]

function AnimatedUnderline({
  width = "w-24",
  color = "bg-[#0e1c4f]",
  className = "",
}: { width?: string; color?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`h-[3px] ${width} ${color} ${className}`}>
      <motion.div
        className={`h-full ${color}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isInView ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ originX: 0 }}
      />
    </div>
  )
}

function ServiceBlock({
  service,
  index,
  icon: Icon,
}: {
  service: { title: string; copy: string; items: string[] }
  index: number
  icon: typeof Palette
}) {
  const isReversed = index % 2 === 1
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.15 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-20 items-center py-16 lg:py-24 px-6 lg:px-12 rounded-3xl`}
      style={{
        background: "linear-gradient(180deg, #0A295F 0%, #0B0F17 50%, #E6E9EF 100%)",
      }}
    >
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h3 className="font-heading text-3xl md:text-4xl text-white uppercase tracking-wide">{service.title}</h3>
        </div>

        <AnimatedUnderline width="w-20" color="bg-white" className="ml-0" />

        <p className="text-lg text-gray-100 font-body leading-relaxed max-w-xl">{service.copy}</p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          {service.items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
              transition={{ duration: 0.4, delay: 0.1 * i, ease: "easeOut" }}
              className="flex items-center gap-3 text-gray-200"
            >
              <span className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
              {item}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="flex-1 w-full">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8] shadow-lg">
          <Image
            src={serviceImages[index] || "/placeholder.svg"}
            alt={service.title}
            fill
            className="object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#0e1c4f]/5" />
        </div>
      </div>
    </motion.div>
  )
}

export default function ServicesClient() {
  const [locale, setLocale] = useState<Locale>("en")
  const content = copy[locale]
  const introRef = useRef<HTMLDivElement>(null)
  const [introInView, setIntroInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntroInView(true)
        }
      },
      { threshold: 0.1 },
    )

    if (introRef.current) {
      observer.observe(introRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Header locale={locale} onLocaleChange={setLocale} />

      <section ref={introRef} className="py-20 lg:py-32 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: introInView ? 1 : 0, y: introInView ? 0 : 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl text-[#0e1c4f] leading-tight mb-6"
          >
            {content.intro.title}
          </motion.h1>

          <div className="flex justify-center mb-8">
            <AnimatedUnderline width="w-32" />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: introInView ? 1 : 0, y: introInView ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="font-subheading text-xl md:text-2xl text-[#898989] text-black"
          >
            {content.intro.subtitle}
          </motion.p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          {content.services.map((service, index) => (
            <div key={index}>
              <ServiceBlock service={service} index={index} icon={icons[index]} />
              {index < content.services.length - 1 && (
                <div className="flex justify-center py-8">
                  <div className="w-px h-16 bg-[#0e1c4f]/20" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 lg:py-28 px-4 bg-[#fafafa]">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl text-[#0e1c4f] mb-10"
          >
            {content.cta.title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#0e1c4f] text-white font-subheading text-lg rounded-full hover:bg-[#1a2d6b] transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              {content.cta.button}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  )
}
