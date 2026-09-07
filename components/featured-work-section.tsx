"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
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
  finalVisuals?: string[]
  year?: string
}

const copy = {
  en: {
    title: "Featured Work",
    viewCaseStudy: "View Case Study",
    viewFullPortfolio: "View Full Portfolio",
    showMore: "Show More Projects",
  },
  es: {
    title: "Trabajos Destacados",
    viewCaseStudy: "Ver Caso de Estudio",
    viewFullPortfolio: "Ver Portafolio Completo",
    showMore: "Mostrar más proyectos",
  },
}

// Placeholder projects for when Airtable is not connected
const placeholderProjects: Project[] = [
  {
    clientName: "TechVision Labs",
    industry: "Technology",
    services: ["Brand Identity", "Web Design", "Social Media"],
    shortDescription:
      "Complete brand transformation for an AI-powered analytics startup, including visual identity and digital presence.",
    slug: "techvision-labs",
    heroMedia: "/modern-tech-startup-office.jpg",
  },
  {
    clientName: "Evergreen Wellness",
    industry: "Health & Wellness",
    services: ["Content Creation", "Social Media Management"],
    shortDescription:
      "Lifestyle content strategy and social media management for a holistic wellness brand focused on mindful living.",
    slug: "evergreen-wellness",
    heroMedia: "/wellness-spa-nature.jpg",
  },
  {
    clientName: "Urban Eats Co.",
    industry: "Food & Beverage",
    services: ["Brand Identity", "Photography", "Web Design"],
    shortDescription:
      "Fresh visual identity and mouth-watering content for a farm-to-table restaurant chain expanding across the region.",
    slug: "urban-eats",
    heroMedia: "/gourmet-restaurant-food.jpg",
  },
  {
    clientName: "Finova Capital",
    industry: "Finance",
    services: ["Web Design", "Digital Infrastructure", "SEO"],
    shortDescription:
      "Professional digital presence for a boutique investment firm, emphasizing trust, sophistication, and clarity.",
    slug: "finova-capital",
    heroMedia: "/modern-finance-office-building.jpg",
  },
  {
    clientName: "Bloom Studio",
    industry: "Creative Agency",
    services: ["Brand Identity", "Content Creation"],
    shortDescription:
      "Creative direction and brand development for a boutique photography studio specializing in lifestyle content.",
    slug: "bloom-studio",
    heroMedia: "/creative-studio-photography.jpg",
  },
  {
    clientName: "Peak Performance",
    industry: "Sports & Fitness",
    services: ["Social Media", "Video Production"],
    shortDescription: "Dynamic social media strategy and video content for a premium fitness coaching platform.",
    slug: "peak-performance",
    heroMedia: "/fitness-gym-training.jpg",
  },
]

interface FeaturedWorkSectionProps {
  locale: Locale
}

export default function FeaturedWorkSection({ locale }: FeaturedWorkSectionProps) {
  const content = copy[locale]
  const [projects, setProjects] = useState<Project[]>(placeholderProjects)
  const [isVisible, setIsVisible] = useState(false)
  const [titleLineVisible, setTitleLineVisible] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const PROJECTS_PER_PAGE = 4
  const AUTOPLAY_INTERVAL = 7000 // 7 seconds
  const PAUSE_DURATION = 10000 // 10 seconds after interaction

  // Calculate visible projects
  const visibleProjects = showAll
    ? projects
    : projects.slice(currentPage * PROJECTS_PER_PAGE, (currentPage + 1) * PROJECTS_PER_PAGE)

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE)

  // Fetch projects from Airtable
  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects")
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            setProjects(data)
          }
        }
      } catch {
        console.log("Using placeholder projects")
      }
    }
    loadProjects()
  }, [])

  // Autoplay logic
  const nextPage = useCallback(() => {
    if (!showAll && !isPaused) {
      setCurrentPage((prev) => (prev + 1) % totalPages)
    }
  }, [showAll, isPaused, totalPages])

  // Start/restart autoplay
  useEffect(() => {
    if (!showAll && !isPaused && projects.length > PROJECTS_PER_PAGE) {
      autoplayRef.current = setInterval(nextPage, AUTOPLAY_INTERVAL)
    }
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [nextPage, showAll, isPaused, projects.length])

  // Pause autoplay on interaction
  const handleInteraction = useCallback(() => {
    setIsPaused(true)
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current)
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, PAUSE_DURATION)
  }, [])

  // Add interaction listeners
  useEffect(() => {
    const section = sectionRef.current
    if (section) {
      section.addEventListener("mousemove", handleInteraction)
      section.addEventListener("scroll", handleInteraction)
      section.addEventListener("click", handleInteraction)
    }
    return () => {
      if (section) {
        section.removeEventListener("mousemove", handleInteraction)
        section.removeEventListener("scroll", handleInteraction)
        section.removeEventListener("click", handleInteraction)
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
      }
    }
  }, [handleInteraction])

  // Intersection observer for cards animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Intersection observer for title underline
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleLineVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    if (titleRef.current) {
      observer.observe(titleRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0e1c4f] font-bebas tracking-wide">
            {content.title}
          </h2>
          {/* Animated underline */}
          <div className="flex justify-center mt-4">
            <div
              className="h-[3px] bg-[#0e1c4f] transition-all duration-800 ease-out"
              style={{
                width: titleLineVisible ? "120px" : "0px",
                transitionDuration: "0.8s",
              }}
            />
          </div>
        </div>

        {/* Page indicators (only when not showing all) */}
        {!showAll && projects.length > PROJECTS_PER_PAGE && (
          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i)
                  handleInteraction()
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentPage ? "bg-[#0e1c4f] w-6" : "bg-[#0e1c4f]/30"
                }`}
              />
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {visibleProjects.map((project, index) => (
            <div
              key={`${project.slug}-${currentPage}-${index}`}
              className="group relative rounded-2xl overflow-hidden border border-[#0e1c4f]/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(40px)",
                transition: `all 0.6s ease-out ${index * 0.1}s`,
              }}
            >
              {/* Image Container */}
              <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
                <Image
                  src={project.heroMedia || "/placeholder.svg?height=600&width=800&query=project"}
                  alt={project.clientName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                {/* Industry */}
                <span className="text-xs uppercase tracking-widest text-white/70 font-antonio">{project.industry}</span>

                {/* Client Name */}
                <h3 className="text-2xl md:text-3xl font-bold font-bebas tracking-wide mt-1 mb-2">
                  {project.clientName}
                </h3>

                {/* Services */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.services.map((service, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white/90 font-inter"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-white/80 font-inter leading-relaxed mb-4 line-clamp-2">
                  {project.shortDescription}
                </p>

                <Link href={`/portfolio?project=${project.slug}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-white/50 text-white hover:bg-white hover:text-[#0e1c4f] transition-all duration-300 rounded-full group/btn"
                  >
                    {content.viewCaseStudy}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {!showAll && projects.length > PROJECTS_PER_PAGE && (
          <div className="text-center mt-12">
            <Button
              onClick={() => {
                setShowAll(true)
                handleInteraction()
              }}
              variant="outline"
              size="lg"
              className="border-[#0e1c4f] text-[#0e1c4f] hover:bg-[#0e1c4f] hover:text-white rounded-full px-8 py-5 text-base font-semibold transition-all duration-300 group"
            >
              {content.showMore}
              <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </Button>
          </div>
        )}

        {/* View Full Portfolio Button */}
        <div className="text-center mt-12">
          <Link href="/portfolio">
            <Button
              size="lg"
              className="bg-[#0e1c4f] text-white hover:bg-[#0e1c4f]/90 rounded-full px-10 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] group"
            >
              {content.viewFullPortfolio}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
