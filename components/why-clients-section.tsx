"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCircle, Palette, CalendarCheck, Layers } from "lucide-react"

interface WhyClientsSectionProps {
  locale: "en" | "es"
}

const copy = {
  en: {
    title: "Why Clients Choose MTK",
    values: [
      {
        title: "Personal Communication & Dedicated Support",
        description: "Direct access to your team with responsive, transparent communication at every stage.",
      },
      {
        title: "Clean, Modern Aesthetic",
        description: "Design that stands out with clarity, elegance, and timeless visual appeal.",
      },
      {
        title: "Consistent Workflow & Predictable Delivery",
        description: "Structured processes that ensure your projects are delivered on time, every time.",
      },
      {
        title: "Flexible Packages for Any Business Stage",
        description: "Scalable solutions tailored to startups, growing brands, and established enterprises.",
      },
    ],
  },
  es: {
    title: "Por Qué los Clientes Eligen MTK",
    values: [
      {
        title: "Comunicación Personal y Soporte Dedicado",
        description: "Acceso directo a tu equipo con comunicación receptiva y transparente en cada etapa.",
      },
      {
        title: "Estética Limpia y Moderna",
        description: "Diseño que destaca con claridad, elegancia y atractivo visual atemporal.",
      },
      {
        title: "Flujo de Trabajo Consistente y Entrega Predecible",
        description: "Procesos estructurados que aseguran que tus proyectos se entreguen a tiempo, siempre.",
      },
      {
        title: "Paquetes Flexibles para Cualquier Etapa del Negocio",
        description: "Soluciones escalables adaptadas a startups, marcas en crecimiento y empresas establecidas.",
      },
    ],
  },
}

const icons = [MessageCircle, Palette, CalendarCheck, Layers]

export default function WhyClientsSection({ locale }: WhyClientsSectionProps) {
  const t = copy[locale]
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false, false])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Stagger card animations
          t.values.forEach((_, index) => {
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
  }, [t.values])

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 md:py-28 lg:py-32"
      style={{
        background: "linear-gradient(180deg, #0A295F 0%, #0B0F17 50%, #E6E9EF 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Title with fade-in animation */}
        <div
          className="mb-16 text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <h2 className="font-bebas text-4xl md:text-5xl lg:text-6xl text-white tracking-wide">{t.title}</h2>
          {/* Animated underline - Now white */}
          <div className="mt-4 flex justify-center">
            <div
              className="h-[3px] bg-white transition-all duration-700 ease-out"
              style={{
                width: isVisible ? "120px" : "0px",
              }}
            />
          </div>
        </div>

        {/* 2x2 Grid - Glass effect cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {t.values.map((value, index) => {
            const Icon = icons[index]
            return (
              <div
                key={index}
                className={`
                  group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-10
                  border border-white/20
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:bg-white/15
                  ${visibleCards[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                `}
                style={{
                  transition:
                    "opacity 0.6s ease-out, transform 0.6s ease-out, background 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {/* Icon - White icon */}
                <div className="mb-6">
                  <div
                    className="
                      inline-flex items-center justify-center
                      w-14 h-14 rounded-xl
                      bg-white/10
                      transition-all duration-300
                      group-hover:bg-white/20
                    "
                  >
                    <Icon
                      className="
                        w-7 h-7 text-white
                        stroke-[1.5]
                        transition-all duration-300
                        group-hover:stroke-[2]
                      "
                    />
                  </div>
                </div>

                {/* Title - White text */}
                <h3 className="font-antonio text-xl lg:text-2xl text-white mb-3 leading-tight">{value.title}</h3>

                {/* Description - Light gray text */}
                <p className="text-base leading-relaxed text-white">{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
