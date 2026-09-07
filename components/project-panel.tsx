"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Locale = "en" | "es"

interface Project {
  clientName: string
  projectTitle?: string
  industry: string
  services: string[]
  shortDescription: string
  projectDescription?: string
  slug: string
  heroMedia: string | null
  finalVisuals: string[]
  year?: string
}

const copy = {
  en: {
    client: "Client",
    industry: "Industry",
    services: "Services",
    year: "Year",
    projectOverview: "Project Overview",
    scopeDeliverables: "Scope & Deliverables",
    finalVisuals: "Final Visuals",
    ctaTitle: "Have a project in mind?",
    ctaButton: "Work With Us",
  },
  es: {
    client: "Cliente",
    industry: "Industria",
    services: "Servicios",
    year: "Año",
    projectOverview: "Resumen del Proyecto",
    scopeDeliverables: "Alcance y Entregables",
    finalVisuals: "Visuales Finales",
    ctaTitle: "¿Tienes un proyecto en mente?",
    ctaButton: "Trabajemos juntos",
  },
}

interface ProjectPanelProps {
  project: Project
  locale: Locale
  onClose: () => void
}

export default function ProjectPanel({ project, locale, onClose }: ProjectPanelProps) {
  const content = copy[locale]
  const panelRef = useRef<HTMLDivElement>(null)

  // Scroll to panel when it opens
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    // Prevent body scroll when panel is open
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div
        ref={panelRef}
        className="relative w-full min-h-screen bg-white animate-in fade-in slide-in-from-bottom-8 duration-500"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-50 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
        >
          <X className="h-6 w-6 text-[#0e1c4f]" />
        </button>

        {/* Hero Image */}
        <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
          <Image
            src={project.heroMedia || "/placeholder.svg?height=800&width=1200&query=project"}
            alt={project.clientName}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
            <div className="max-w-6xl mx-auto">
              <span className="text-sm uppercase tracking-widest text-white/70 font-antonio">{project.industry}</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-bebas tracking-wide mt-2">
                {project.projectTitle || project.clientName}
              </h1>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-12">
          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 pb-12 border-b border-gray-200">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#898989] font-antonio block mb-2">
                {content.client}
              </span>
              <span className="text-lg font-semibold text-[#0e1c4f] font-inter">{project.clientName}</span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#898989] font-antonio block mb-2">
                {content.industry}
              </span>
              <span className="text-lg font-semibold text-[#0e1c4f] font-inter">{project.industry}</span>
            </div>
            {project.year && (
              <div>
                <span className="text-xs uppercase tracking-widest text-[#898989] font-antonio block mb-2">
                  {content.year}
                </span>
                <span className="text-lg font-semibold text-[#0e1c4f] font-inter">{project.year}</span>
              </div>
            )}
            <div className="col-span-2 md:col-span-1">
              <span className="text-xs uppercase tracking-widest text-[#898989] font-antonio block mb-2">
                {content.services}
              </span>
              <div className="flex flex-wrap gap-2">
                {project.services.map((service, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full bg-[#0e1c4f]/10 text-[#0e1c4f] font-inter">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e1c4f] font-bebas tracking-wide mb-6">
              {content.projectOverview}
            </h2>
            <div className="w-20 h-[3px] bg-[#0e1c4f] mb-8" />
            <p className="text-lg text-[#424242] font-inter leading-relaxed max-w-4xl">
              {project.projectDescription || project.shortDescription}
            </p>
          </div>

          {/* Scope & Deliverables */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e1c4f] font-bebas tracking-wide mb-6">
              {content.scopeDeliverables}
            </h2>
            <div className="w-20 h-[3px] bg-[#0e1c4f] mb-8" />
            <div className="flex flex-wrap gap-3">
              {project.services.map((service, i) => (
                <span
                  key={i}
                  className="text-base px-5 py-2 rounded-full border-2 border-[#0e1c4f] text-[#0e1c4f] font-inter font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Final Visuals */}
          {project.finalVisuals && project.finalVisuals.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0e1c4f] font-bebas tracking-wide mb-6">
                {content.finalVisuals}
              </h2>
              <div className="w-20 h-[3px] bg-[#0e1c4f] mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.finalVisuals.map((visual, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <Image
                      src={visual || "/placeholder.svg"}
                      alt={`${project.clientName} visual ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-[#0e1c4f] py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white font-bebas tracking-wide mb-8">
              {content.ctaTitle}
            </h3>
            <Link href="/#contact">
              <Button
                size="lg"
                onClick={onClose}
                className="bg-white text-[#0e1c4f] hover:bg-gray-100 rounded-full px-10 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] group"
              >
                {content.ctaButton}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
