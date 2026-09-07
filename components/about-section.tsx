"use client"

import { useEffect, useRef, useState } from "react"

type Locale = "en" | "es"

const copy = {
  en: {
    title: "About Us",
    headlineLine1: "We are not like the other agencies;",
    headlineLine2: "we are a cool agency.",
    scenes: [
      {
        label: "PRINCIPLE 01 — Adapt",
        text: "The market is constantly evolving, and we choose to evolve with it. We pay attention, we adapt, and we build strategies that actually make sense for where your business is going.",
      },
      {
        label: "PRINCIPLE 02 — Collaborate",
        text: "Even if we're an external partner, we don't work from the outside. We work as part of your team, collaborating, supporting, and creating with you every step of the way.",
      },
      {
        label: "PRINCIPLE 03 — Communicate",
        text: "We keep things human, simple, and clear, helping your brand communicate effectively and grow with confidence.",
      },
    ],
  },
  es: {
    title: "About Us",
    headlineLine1: "No somos como las otras agencias;",
    headlineLine2: "somos una agencia cool.",
    scenes: [
      {
        label: "PRINCIPLE 01 — Adapt",
        text: "El mercado está en constante evolución, y elegimos evolucionar con él. Prestamos atención, nos adaptamos y construimos estrategias que realmente tienen sentido para el futuro de tu negocio.",
      },
      {
        label: "PRINCIPLE 02 — Collaborate",
        text: "Aun cuando somos un socio externo, no trabajamos desde afuera. Trabajamos como parte de tu equipo, colaborando, apoyando y creando contigo en cada paso del camino.",
      },
      {
        label: "PRINCIPLE 03 — Communicate",
        text: "Mantenemos las cosas humanas, simples y claras, ayudando a tu marca a comunicarse eficazmente y crecer con confianza.",
      },
    ],
  },
}

interface AboutSectionProps {
  locale: Locale
}

export default function AboutSection({ locale }: AboutSectionProps) {
  const content = copy[locale]
  const sectionRef = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full py-16 md:py-20 lg:py-24"
      style={{
        background: "linear-gradient(180deg, #0A295F 0%, #0B0F17 50%, #E6E9EF 100%)",
      }}
    >
      {/* Content Container */}
      <div
        className="container mx-auto px-6 md:px-8 lg:px-12 max-w-6xl"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
      >
        {/* Section Title - Text now white for contrast */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-white font-bebas text-4xl sm:text-5xl md:text-6xl tracking-wide mb-3">{content.title}</h2>
          <div className="flex justify-center">
            <div
              className="h-[3px] bg-white transition-all duration-700 ease-out"
              style={{
                width: isInView ? "120px" : "0px",
                transformOrigin: "left",
              }}
            />
          </div>
        </div>

        {/* Cinematic Headline - Text now white/gray for contrast */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-gray-200 font-bebas text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wider leading-tight">
            {content.headlineLine1}
          </p>
          <p className="text-white font-bebas text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider leading-tight mt-2 font-bold">
            {content.headlineLine2}
          </p>
          <div className="flex justify-center mt-4">
            <div
              className="h-[3px] bg-white transition-all duration-700 ease-out delay-200"
              style={{
                width: isInView ? "180px" : "0px",
                transformOrigin: "left",
              }}
            />
          </div>
        </div>

        {/* Scene Cards - Glass effect cards with white text */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {content.scenes.map((scene, index) => (
            <div
              key={index}
              className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8 text-center transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 hover:bg-white/15"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0px)" : "translateY(40px)",
                transition: `opacity 0.6s ease-out ${index * 0.15}s, transform 0.6s ease-out ${index * 0.15}s`,
              }}
            >
              {/* Scene Label */}
              <span className="inline-block text-white font-antonio text-sm md:text-base tracking-widest uppercase mb-4">
                {scene.label}
              </span>

              {/* Paragraph */}
              <p className="font-inter text-sm md:text-base leading-relaxed mb-6 text-white">{scene.text}</p>

              {/* Accent Line */}
              <div className="w-16 h-[2px] bg-white mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
