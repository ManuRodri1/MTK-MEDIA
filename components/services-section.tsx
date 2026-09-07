"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Palette, Share2, Video, Globe } from "lucide-react"
import Link from "next/link"

type ServicesSectionProps = {
  locale: "en" | "es"
}

const content = {
  en: {
    title: "Our Services",
    services: [
      {
        title: "Brand Identity & Design",
        subtitle: "Logos, colors, typography, brand systems",
        icon: Palette,
      },
      {
        title: "Social Media Management",
        subtitle: "Strategy, calendar, posting, engagement",
        icon: Share2,
      },
      {
        title: "Content Creation",
        subtitle: "Photo & video editing, Reels, creatives",
        icon: Video,
      },
      {
        title: "Websites & Digital Infrastructure",
        subtitle: "Websites, updates, SEO-ready blogs",
        icon: Globe,
      },
    ],
    cta: "View All Services",
  },
  es: {
    title: "Nuestros Servicios",
    services: [
      {
        title: "Identidad de Marca y Diseño",
        subtitle: "Logos, colores, tipografías, sistemas de marca",
        icon: Palette,
      },
      {
        title: "Gestión de Redes Sociales",
        subtitle: "Estrategia, calendario, publicaciones, engagement",
        icon: Share2,
      },
      {
        title: "Creación de Contenido",
        subtitle: "Edición de foto y video, Reels, creatividades",
        icon: Video,
      },
      {
        title: "Sitios Web e Infraestructura Digital",
        subtitle: "Sitios web, mantenimiento, blogs optimizados para SEO",
        icon: Globe,
      },
    ],
    cta: "Ver Todos los Servicios",
  },
}

export default function ServicesSection({ locale }: ServicesSectionProps) {
  const copy = content[locale]
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false, false])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Stagger card animations
          copy.services.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards((prev) => {
                const newState = [...prev]
                newState[index] = true
                return newState
              })
            }, index * 100)
          })
        }
      },
      { threshold: 0.15 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [copy.services])

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 lg:py-24 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0A295F 0%, #0B0F17 50%, #E6E9EF 100%)",
      }}
    >
      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-24">
        <div
          className="text-center mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-white mb-6">{copy.title}</h2>
          <div
            className="h-1 bg-white mx-auto transition-all duration-700 ease-out"
            style={{ width: isVisible ? "96px" : "0px" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto mb-12">
          {copy.services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className={`
                  group relative bg-white/10 backdrop-blur-sm rounded-xl p-8
                  border border-white/20
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:bg-white/15
                  ${visibleCards[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                `}
                style={{
                  transition:
                    "opacity 0.6s ease-out, transform 0.6s ease-out, background 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                  <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>

                <h3 className="font-subheading text-2xl md:text-3xl text-white mb-3">{service.title}</h3>
                <p className="leading-relaxed text-white">{service.subtitle}</p>

                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            )
          })}
        </div>

        <div
          className="flex justify-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out 0.4s, transform 0.7s ease-out 0.4s",
          }}
        >
          <Link
            href="/services"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-white text-[#0e1c4f] rounded-full font-medium hover:bg-transparent hover:text-white transition-all duration-300 shadow-md hover:shadow-xl"
          >
            {copy.cta}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  )
}
