"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

type Locale = "en" | "es"

const navItems = {
  en: [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/#contact" },
  ],
  es: [
    { label: "Inicio", path: "/" },
    { label: "Servicios", path: "/services" },
    { label: "Portafolio", path: "/portfolio" },
    { label: "Blog", path: "/blog" },
    { label: "Contacto", path: "/#contact" },
  ],
}

interface HeaderProps {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
}

export default function Header({ locale, onLocaleChange }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#0e1c4f] shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-24 pb-4">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-Q2XgCS3jFAf3q1TbhCUELvC6KgeLMl.png"
              alt="MTK Media"
              width={320}
              height={110}
              className="h-28 w-auto invert brightness-0 filter"
              style={{ filter: "brightness(0) invert(1)" }}
              priority
            />
          </Link>

          {/* Desktop Navigation - All text now white */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems[locale].map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-white hover:text-white/80 transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Desktop Language Switcher - White text */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onLocaleChange("en")}
              className={`px-3 py-1 text-sm font-medium transition-all ${
                locale === "en" ? "text-white font-bold border-b-2 border-white" : "text-white/70 hover:text-white"
              }`}
            >
              EN
            </button>
            <span className="text-white/50">|</span>
            <button
              onClick={() => onLocaleChange("es")}
              className={`px-3 py-1 text-sm font-medium transition-all ${
                locale === "es" ? "text-white font-bold border-b-2 border-white" : "text-white/70 hover:text-white"
              }`}
            >
              ES
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className="w-full h-[2px] bg-black mt-2" />

      {/* Mobile Menu - Blue background with white text */}
      {isOpen && (
        <div className="md:hidden bg-[#0e1c4f] border-b border-black py-4">
          <nav className="container mx-auto px-4 flex flex-col space-y-4">
            {navItems[locale].map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-white/80 transition-colors py-2 text-lg"
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Language Switcher - White text */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/20">
              <button
                onClick={() => {
                  onLocaleChange("en")
                  setIsOpen(false)
                }}
                className={`px-3 py-1 text-sm font-medium transition-all ${
                  locale === "en" ? "text-white font-bold border-b-2 border-white" : "text-white/70 hover:text-white"
                }`}
              >
                EN
              </button>
              <span className="text-white/50">|</span>
              <button
                onClick={() => {
                  onLocaleChange("es")
                  setIsOpen(false)
                }}
                className={`px-3 py-1 text-sm font-medium transition-all ${
                  locale === "es" ? "text-white font-bold border-b-2 border-white" : "text-white/70 hover:text-white"
                }`}
              >
                ES
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
