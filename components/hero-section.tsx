"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

type Locale = "en" | "es"

const copy = {
  en: {
    headline: "MARKETING – TECHNOLOGY – KREATIVITY – EVOLVED",
    subheadline:
      "Helping businesses build a powerful digital presence through strategy, clean design, and consistent branded content.",
    primaryCta: "Work With Us",
    secondaryCta: "View Portfolio",
  },
  es: {
    headline: "MARKETING – TECNOLOGÍA – KREATIVIDAD – EVOLUCIONADA",
    subheadline:
      "Ayudamos a las empresas a construir una presencia digital poderosa mediante estrategia, diseño limpio y contenido de marca constante.",
    primaryCta: "Trabaja con Nosotros",
    secondaryCta: "Ver Portafolio",
  },
}

interface HeroSectionProps {
  locale: Locale
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const content = copy[locale]
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(48)
  const [animationStarted, setAnimationStarted] = useState(false)
  const [underlineVisible, setUnderlineVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const calculateFontSize = () => {
      if (!headlineRef.current || !containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth - 16
      const headline = headlineRef.current

      let testSize = 64
      headline.style.fontSize = `${testSize}px`

      while (headline.scrollWidth > containerWidth && testSize > 8) {
        testSize -= 1
        headline.style.fontSize = `${testSize}px`
      }

      setFontSize(testSize)
    }

    calculateFontSize()
    window.addEventListener("resize", calculateFontSize)
    return () => window.removeEventListener("resize", calculateFontSize)
  }, [locale])

  useEffect(() => {
    // Start letter animation immediately
    setAnimationStarted(true)

    // Calculate delay for underline: letters * 0.03s + some buffer
    const letterCount = content.headline.length
    const letterAnimationDuration = letterCount * 30 + 400 // ms

    const underlineTimer = setTimeout(() => {
      setUnderlineVisible(true)
    }, letterAnimationDuration)

    return () => clearTimeout(underlineTimer)
  }, [content.headline.length])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      // Calculate offset from center (-1 to 1)
      const x = (clientX / innerWidth - 0.5) * 2
      const y = (clientY / innerHeight - 0.5) * 2

      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const renderAnimatedHeadline = () => {
    return content.headline.split("").map((letter, index) => (
      <span
        key={index}
        className="inline-block"
        style={{
          opacity: animationStarted ? 1 : 0,
          transform: animationStarted ? "translateY(0)" : "translateY(15px)",
          transition: `opacity 0.4s ease-out, transform 0.4s ease-out`,
          transitionDelay: `${index * 0.03}s`,
        }}
      >
        {letter === " " ? "\u00A0" : letter}
      </span>
    ))
  }

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/30" />
      </div>

      {/* Hero Content */}
      <div ref={containerRef} className="relative z-10 w-full px-2 text-center">
        <div className="mx-auto space-y-10 w-full">
          <div className="w-full">
            <h1
              ref={headlineRef}
              style={{ fontSize: `${fontSize}px` }}
              className="font-bold leading-none tracking-wide text-[#0e1c4f] font-bebas whitespace-nowrap text-center"
            >
              {renderAnimatedHeadline()}
            </h1>
          </div>

          <div className="h-[3px] w-32 bg-[#0e1c4f] mt-4 mb-6 mx-auto overflow-hidden">
            <div
              className="h-full bg-[#0e1c4f]"
              style={{
                width: underlineVisible ? "100%" : "0%",
                transition: "width 0.6s ease-out",
              }}
            />
          </div>

          <p
            className="text-[1.05rem] sm:text-lg md:text-xl text-[#424242] max-w-2xl mx-auto leading-relaxed font-antonio text-black"
            style={{
              opacity: underlineVisible ? 1 : 0,
              transform: underlineVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.5s ease-out 0.1s, transform 0.5s ease-out 0.1s",
            }}
          >
            {content.subheadline}
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            style={{
              opacity: underlineVisible ? 1 : 0,
              transform: underlineVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.5s ease-out 0.3s, transform 0.5s ease-out 0.3s",
            }}
          >
            <Link href="/#contact">
              <Button
                size="lg"
                className="bg-white text-[#0e1c4f] hover:bg-white border border-[#0e1c4f]/20 shadow-lg hover:shadow-2xl transition-all duration-180 rounded-full px-8 py-6 text-base font-semibold group hover:scale-[1.03]"
              >
                {content.primaryCta}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/portfolio">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-[#0e1c4f] border-2 border-[#0e1c4f] hover:bg-[#0e1c4f] hover:text-white hover:border-[#0c153c] hover:scale-[1.03] transition-all duration-180 rounded-full px-8 py-6 text-base font-semibold"
              >
                {content.secondaryCta}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
