"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Instagram, Linkedin } from "lucide-react"

interface ContactSectionProps {
  locale: "en" | "es"
}

const copy = {
  en: {
    titleLine1: "READY TO ELEVATE YOUR BRAND?",
    titleLine2: "Let's talk about your goals…",
    fullName: "Full Name",
    email: "Email",
    message: "Message",
    send: "Send",
    success: "We will contact you soon.",
    followUs: "Follow Us",
  },
  es: {
    titleLine1: "¿LISTO PARA ELEVAR TU MARCA?",
    titleLine2: "Hablemos de tus objetivos…",
    fullName: "Nombre Completo",
    email: "Correo Electrónico",
    message: "Mensaje",
    send: "Enviar",
    success: "Lo estaremos contactando.",
    followUs: "Síguenos",
  },
}

export default function ContactSection({ locale }: ContactSectionProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [underlineInView, setUnderlineInView] = useState(false)
  const underlineRef = useRef<HTMLDivElement>(null)
  const t = copy[locale]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setUnderlineInView(true)
        }
      },
      { threshold: 0.3 },
    )
    if (underlineRef.current) {
      observer.observe(underlineRef.current)
    }
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch("https://formspree.io/f/xyzrpdqz", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setIsSubmitted(true)
        form.reset()
      }
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="bg-[#0e1c4f] py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="font-bebas text-4xl md:text-5xl lg:text-6xl text-white tracking-wide leading-tight">
            {t.titleLine1}
          </h2>
          <p className="font-antonio text-xl md:text-2xl lg:text-3xl text-white/90 mt-2 tracking-wide">
            {t.titleLine2}
          </p>
          {/* White animated underline */}
          <div ref={underlineRef} className="flex justify-center mt-6">
            <div className="h-[2px] w-40 overflow-hidden">
              <div
                className="h-full bg-white transition-transform duration-700 ease-out origin-left"
                style={{ transform: underlineInView ? "scaleX(1)" : "scaleX(0)" }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Logo & Social */}
          <div className="flex flex-col items-center lg:items-start justify-center space-y-8 order-2 lg:order-1">
            {/* White Logo using invert filter */}
            <div className="relative w-48 h-48 md:w-56 md:h-56">
              <Image src="/mtk-logo-dark.png" alt="MTK Media" fill className="object-contain brightness-0 invert" />
            </div>

            {/* Social Links */}
            <div className="text-center lg:text-left">
              <p className="text-white font-antonio text-lg mb-4 tracking-wide">{t.followUs}</p>
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <a
                  href="https://www.instagram.com/gustavoreynosomtk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://www.linkedin.com/in/gustavo-reynoso-b33799102/?skipRedirect=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="space-y-6 order-1 lg:order-2">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white font-antonio text-sm mb-2 tracking-wide">
                    {t.fullName}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white font-antonio text-sm mb-2 tracking-wide">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white font-antonio text-sm mb-2 tracking-wide">
                    {t.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-3 bg-white text-[#0e1c4f] font-antonio font-semibold rounded-full hover:bg-white/90 transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? "..." : t.send}
                </button>
              </form>
            ) : (
              <div className="py-8 text-center lg:text-left">
                <p className="text-white text-xl font-antonio">{t.success}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
