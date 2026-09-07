"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Search } from "lucide-react"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProjectPanel from "@/components/project-panel"

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
    title: "Our Work",
    subtitle: "A selection of recent projects that show our approach to design, strategy, and content.",
    viewCaseStudy: "View Case Study",
    searchPlaceholder: "Search by client or project...",
    filters: {
      all: "All",
      brandIdentity: "Brand Identity & Design",
      socialMedia: "Social Media",
      contentCreation: "Content Creation",
      webDigital: "Web & Digital",
    },
    industryLabel: "Industry",
    allIndustries: "All Industries",
    noResults: "No projects found matching your criteria.",
  },
  es: {
    title: "Nuestro Trabajo",
    subtitle: "Una selección de proyectos recientes que muestran nuestro enfoque de diseño, estrategia y contenido.",
    viewCaseStudy: "Ver Caso de Estudio",
    searchPlaceholder: "Buscar por cliente o proyecto...",
    filters: {
      all: "Todos",
      brandIdentity: "Identidad y Diseño",
      socialMedia: "Redes Sociales",
      contentCreation: "Contenido",
      webDigital: "Web & Digital",
    },
    industryLabel: "Industria",
    allIndustries: "Todas las Industrias",
    noResults: "No se encontraron proyectos que coincidan con tus criterios.",
  },
}

const serviceFilterMap: Record<string, string[]> = {
  all: [],
  brandIdentity: ["Brand Identity & Design", "Brand Identity", "Logo design", "Visual guidelines"],
  socialMedia: ["Social Media", "Social Media Management", "Community management"],
  contentCreation: ["Content Creation", "Photo editing", "Video editing", "Photography"],
  webDigital: ["Web & Digital", "Web Development", "Website creation", "SEO", "Digital Infrastructure"],
}

export default function PortfolioClient() {
  const searchParams = useSearchParams()
  const [locale, setLocale] = useState<Locale>("en")
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedIndustry, setSelectedIndustry] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [titleLineVisible, setTitleLineVisible] = useState(false)
  const [industries, setIndustries] = useState<string[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false) // Declare headerVisible
  const [filtersVisible, setFiltersVisible] = useState(false) // Declare filtersVisible

  const content = copy[locale]

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects")
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
          setFilteredProjects(data)
          const uniqueIndustries = [...new Set(data.map((p: Project) => p.industry).filter(Boolean))]
          setIndustries(uniqueIndustries as string[])
        }
      } catch {
        console.log("Error loading projects")
      }
    }
    loadProjects()
  }, [])

  useEffect(() => {
    const projectSlug = searchParams.get("project")
    if (projectSlug && projects.length > 0) {
      const project = projects.find((p) => p.slug === projectSlug)
      if (project) {
        setSelectedProject(project)
      }
    }
  }, [searchParams, projects])

  useEffect(() => {
    let result = [...projects]

    if (activeFilter !== "all") {
      const serviceKeywords = serviceFilterMap[activeFilter] || []
      result = result.filter((project) =>
        project.services.some((service) =>
          serviceKeywords.some((keyword) => service.toLowerCase().includes(keyword.toLowerCase())),
        ),
      )
    }

    if (selectedIndustry) {
      result = result.filter((project) => project.industry === selectedIndustry)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (project) =>
          project.clientName.toLowerCase().includes(query) ||
          (project.projectTitle && project.projectTitle.toLowerCase().includes(query)) ||
          project.shortDescription.toLowerCase().includes(query),
      )
    }

    setFilteredProjects(result)
  }, [activeFilter, selectedIndustry, searchQuery, projects])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTitleLineVisible(true)
      },
      { threshold: 0.5 },
    )
    if (titleRef.current) observer.observe(titleRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true) // Use headerVisible
      },
      { threshold: 0.1 },
    )
    if (headerRef.current) observer.observe(headerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setFiltersVisible(true) // Use filtersVisible
      },
      { threshold: 0.1 },
    )
    if (filtersRef.current) observer.observe(filtersRef.current)
    return () => observer.disconnect()
  }, [])

  const handleOpenProject = useCallback((project: Project) => {
    setSelectedProject(project)
    window.history.pushState({}, "", `/portfolio?project=${project.slug}`)
  }, [])

  const handleCloseProject = useCallback(() => {
    setSelectedProject(null)
    window.history.pushState({}, "", "/portfolio")
  }, [])

  const filterButtons = [
    { key: "all", label: content.filters.all },
    { key: "brandIdentity", label: content.filters.brandIdentity },
    { key: "socialMedia", label: content.filters.socialMedia },
    { key: "contentCreation", label: content.filters.contentCreation },
    { key: "webDigital", label: content.filters.webDigital },
  ]

  return (
    <>
      <Header locale={locale} onLocaleChange={setLocale} />

      <main className="min-h-screen">
        <section
          className="py-16 md:py-24"
          style={{
            background: "linear-gradient(180deg, #0A295F 0%, #0B0F17 50%, #E6E9EF 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={headerRef}
              className="text-center"
              style={{
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.7s ease-out",
              }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white font-bebas tracking-wide">
                {content.title}
              </h1>
              <div className="flex justify-center mt-4">
                <div
                  className="h-[3px] bg-white transition-all ease-out"
                  style={{
                    width: titleLineVisible ? "150px" : "0px",
                    transitionDuration: "0.8s",
                  }}
                />
              </div>
              <p className="mt-6 text-lg md:text-xl text-gray-200 font-inter max-w-3xl mx-auto">{content.subtitle}</p>
            </div>
          </div>
        </section>

        <section
          ref={filtersRef}
          className="py-8 border-b border-white/10"
          style={{
            background: "linear-gradient(180deg, #E6E9EF 0%, #0B0F17 50%, #0A295F 100%)",
            opacity: filtersVisible ? 1 : 0,
            transform: filtersVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease-out 0.2s",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {filterButtons.map((filter, index) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-5 py-2 rounded-full text-sm font-inter font-medium transition-all duration-300 ${
                    activeFilter === filter.key
                      ? "bg-white text-[#0e1c4f] shadow-md"
                      : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                  style={{
                    opacity: filtersVisible ? 1 : 0,
                    transform: filtersVisible ? "translateY(0)" : "translateY(15px)",
                    transition: `all 0.5s ease-out ${0.3 + index * 0.05}s`,
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="relative">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 pr-10 text-sm font-inter text-white focus:outline-none focus:border-white cursor-pointer"
                >
                  <option value="" className="bg-[#0e1c4f] text-white">
                    {content.allIndustries}
                  </option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry} className="bg-[#0e1c4f] text-white">
                      {industry}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                <Input
                  type="text"
                  placeholder={content.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-80 rounded-full border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 focus:border-white font-inter text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          ref={sectionRef}
          className="py-16 md:py-20"
          style={{
            background: "linear-gradient(180deg, #0A295F 0%, #0B0F17 50%, #E6E9EF 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredProjects.length === 0 ? (
              <p className="text-center text-gray-200 font-inter text-lg py-16">{content.noResults}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.slug}
                    className="group relative rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/10 backdrop-blur-sm cursor-pointer"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "translateY(0)" : "translateY(40px)",
                      transition: `all 0.6s ease-out ${index * 0.08}s`,
                    }}
                    onClick={() => handleOpenProject(project)}
                  >
                    <div className="relative h-56 sm:h-64 overflow-hidden">
                      <Image
                        src={project.heroMedia || "/placeholder.svg?height=500&width=700&query=project"}
                        alt={project.clientName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <span className="text-xs uppercase tracking-widest text-white/70 font-antonio">
                        {project.industry}
                      </span>

                      <h3 className="text-xl md:text-2xl font-bold font-bebas tracking-wide mt-1 mb-2">
                        {project.projectTitle || project.clientName}
                      </h3>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.services.slice(0, 3).map((service, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white/90 font-inter"
                          >
                            {service}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm text-white/80 font-inter leading-relaxed mb-3 line-clamp-2">
                        {project.shortDescription}
                      </p>

                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-white/50 text-white hover:bg-white hover:text-[#0e1c4f] transition-all duration-300 rounded-full text-xs group/btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenProject(project)
                        }}
                      >
                        {content.viewCaseStudy}
                        <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer locale={locale} />

      {selectedProject && <ProjectPanel project={selectedProject} locale={locale} onClose={handleCloseProject} />}
    </>
  )
}
