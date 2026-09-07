"use client"

import Image from "next/image"
import { Linkedin } from "lucide-react"

interface FooterProps {
  locale: "en" | "es"
}

const copy = {
  en: {
    rights: "MTK Media® — All rights reserved.",
    designedBy: "Designed by ING. JMDR",
  },
  es: {
    rights: "MTK Media® — Todos los derechos reservados.",
    designedBy: "Diseñada por ING. JMDR",
  },
}

export default function Footer({ locale }: FooterProps) {
  const t = copy[locale]

  return (
    <footer className="bg-[#0e1c4f] py-10 md:py-12">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left - Logo (white) */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-20 h-20 md:w-24 md:h-24">
              <Image src="/mtk-logo-dark.png" alt="MTK Media" fill className="object-contain brightness-0 invert" />
            </div>
          </div>

          {/* Center - Copyright */}
          <div className="text-center">
            <p className="text-white/80 font-inter text-sm">{t.rights}</p>
          </div>

          {/* Right - Designed By + LinkedIn */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-white/80 font-inter text-sm">{t.designedBy}</p>
            <a
              href="https://www.linkedin.com/in/jose-manuel-de-jesus-rodriguez-5a0981177"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
