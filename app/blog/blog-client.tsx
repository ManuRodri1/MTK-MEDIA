"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ChevronDown } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import type { BlogPost } from "@/lib/airtable"

type Locale = "en" | "es"

const copy = {
  en: {
    title: "MTK Media Blog",
    subtitle: "Strategies, design insights, and digital branding tips.",
    searchPlaceholder: "Search articles…",
    allCategories: "All Categories",
    allTags: "All",
    readMore: "Read more →",
    noResults: "No articles found matching your criteria.",
    loading: "Loading articles...",
  },
  es: {
    title: "Blog de MTK Media",
    subtitle: "Estrategia, diseño y consejos de branding digital.",
    searchPlaceholder: "Buscar artículos…",
    allCategories: "Todas las Categorías",
    allTags: "Todos",
    readMore: "Leer más →",
    noResults: "No se encontraron artículos con esos criterios.",
    loading: "Cargando artículos...",
  },
}

export default function BlogClient() {
  const [locale, setLocale] = useState<Locale>("en")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTag, setSelectedTag] = useState("")

  const [headerVisible, setHeaderVisible] = useState(false)
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [cardsVisible, setCardsVisible] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLElement>(null)

  const t = copy[locale]
  const airtableLanguage = locale === "en" ? "EN" : "ES"

  useEffect(() => {
    async function loadPosts() {
      setLoading(true)
      try {
        const res = await fetch(`/api/blog?language=${airtableLanguage}`)
        const data = await res.json()
        setPosts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error loading posts:", error)
        setPosts([])
      }
      setLoading(false)
    }
    loadPosts()
  }, [airtableLanguage])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true)
      },
      { threshold: 0.1 },
    )
    if (headerRef.current) observer.observe(headerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setFiltersVisible(true)
      },
      { threshold: 0.1 },
    )
    if (filtersRef.current) observer.observe(filtersRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCardsVisible(true)
      },
      { threshold: 0.1 },
    )
    if (cardsRef.current) observer.observe(cardsRef.current)
    return () => observer.disconnect()
  }, [])

  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category).filter(Boolean))
    return Array.from(cats)
  }, [posts])

  const tags = useMemo(() => {
    const allTags = new Set(posts.flatMap((p) => p.tags))
    return Array.from(allTags)
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "" || post.category === selectedCategory
      const matchesTag = selectedTag === "" || post.tags.includes(selectedTag)

      return matchesSearch && matchesCategory && matchesTag
    })
  }, [posts, searchQuery, selectedCategory, selectedTag])

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === "en" ? "en-US" : "es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <main className="min-h-screen">
      <Header locale={locale} onLocaleChange={setLocale} />

      <section
        className="pt-32 pb-16 px-6"
        style={{
          background: "linear-gradient(180deg, #0A295F 0%, #0B0F17 50%, #E6E9EF 100%)",
        }}
      >
        <div
          ref={headerRef}
          className="max-w-6xl mx-auto text-center"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease-out",
          }}
        >
          <h1 className="font-bebas text-5xl md:text-6xl lg:text-7xl text-white tracking-wide">{t.title}</h1>

          <div
            className="w-32 h-[3px] bg-white mx-auto mt-4 origin-left"
            style={{
              transform: headerVisible ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 0.8s ease-out 0.3s",
            }}
          />

          <p
            className="font-inter text-lg text-gray-200 mt-6 max-w-2xl mx-auto"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s ease-out 0.2s",
            }}
          >
            {t.subtitle}
          </p>
        </div>
      </section>

      <section
        ref={filtersRef}
        className="pb-12 px-6 pt-8"
        style={{
          background: "linear-gradient(180deg, #E6E9EF 0%, #0B0F17 50%, #0A295F 100%)",
        }}
      >
        <div
          className="max-w-6xl mx-auto"
          style={{
            opacity: filtersVisible ? 1 : 0,
            transform: filtersVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease-out",
          }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-white/20 rounded-lg font-inter text-sm bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="relative w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-48 px-4 py-3 border border-white/20 rounded-lg font-inter text-sm appearance-none bg-white/10 backdrop-blur-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
              >
                <option value="" className="bg-[#0e1c4f] text-white">
                  {t.allCategories}
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0e1c4f] text-white">
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              <button
                onClick={() => setSelectedTag("")}
                className={`px-4 py-2 rounded-full font-inter text-sm transition-all ${
                  selectedTag === ""
                    ? "bg-white text-[#0e1c4f]"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                }`}
              >
                {t.allTags}
              </button>
              {tags.map((tag, index) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full font-inter text-sm transition-all ${
                    selectedTag === tag
                      ? "bg-white text-[#0e1c4f]"
                      : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                  style={{
                    opacity: filtersVisible ? 1 : 0,
                    transform: filtersVisible ? "translateY(0)" : "translateY(10px)",
                    transition: `all 0.5s ease-out ${0.2 + index * 0.05}s`,
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        ref={cardsRef}
        className="pb-24 px-6 pt-12"
        style={{
          background: "linear-gradient(180deg, #0A295F 0%, #0B0F17 50%, #E6E9EF 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <p className="font-inter text-gray-200">{t.loading}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-inter text-gray-200">{t.noResults}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="group"
                  style={{
                    opacity: cardsVisible ? 1 : 0,
                    transform: cardsVisible ? "translateY(0)" : "translateY(40px)",
                    transition: `all 0.6s ease-out ${index * 0.08}s`,
                  }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.coverImage || "/placeholder.svg?height=400&width=600&query=blog article"}
                          alt={post.altText || post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-inter rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h2 className="font-antonio text-xl text-white mb-2 line-clamp-2 group-hover:text-gray-200 transition-colors">
                          {post.title}
                        </h2>

                        <p className="font-inter text-sm text-gray-300 mb-3">{formatDate(post.publishedAt)}</p>

                        <p className="font-inter text-sm text-gray-200 line-clamp-3 mb-4">{post.excerpt}</p>

                        <span className="font-inter text-sm font-medium text-white group-hover:underline">
                          {t.readMore}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  )
}
