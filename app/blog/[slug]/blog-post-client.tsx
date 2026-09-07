"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, RefreshCw } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import type { BlogPost } from "@/lib/airtable"
import type { JSX } from "react"

type Locale = "en" | "es"

const copy = {
  en: {
    backToBlog: "Back to Blog",
    lastUpdated: "Last updated",
    relatedArticles: "Related Articles",
    readMore: "Read more →",
    ctaTitle: "Have a project in mind?",
    ctaButton: "Work With Us →",
  },
  es: {
    backToBlog: "Volver al Blog",
    lastUpdated: "Última actualización",
    relatedArticles: "Artículos Relacionados",
    readMore: "Leer más →",
    ctaTitle: "¿Tienes un proyecto en mente?",
    ctaButton: "Trabajemos juntos →",
  },
}

interface Props {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export default function BlogPostClient({ post, relatedPosts }: Props) {
  const [locale, setLocale] = useState<Locale>(post.language === "ES" ? "es" : "en")
  const t = copy[locale]

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === "en" ? "en-US" : "es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const showUpdated = post.updatedAt && post.updatedAt !== post.publishedAt

  // Simple markdown renderer
  const renderMarkdown = (content: string) => {
    const lines = content.split("\n")
    const elements: JSX.Element[] = []
    let inList = false
    let listItems: string[] = []

    const processLine = (line: string, index: number) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="font-antonio text-xl text-[#0e1c4f] mt-8 mb-4">
            {line.slice(4)}
          </h3>
        )
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="font-antonio text-2xl text-[#0e1c4f] mt-10 mb-4">
            {line.slice(3)}
          </h2>
        )
      }

      // Blockquotes
      if (line.startsWith("> ")) {
        return (
          <blockquote key={index} className="border-l-4 border-[#0e1c4f] pl-6 my-6 italic text-[#666]">
            {line.slice(2)}
          </blockquote>
        )
      }

      // Lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return null // Handled separately
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        return null // Handled separately
      }

      // Empty lines
      if (line.trim() === "") {
        return null
      }

      // Bold text processing
      let processedLine = line
      processedLine = processedLine.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-[#0e1c4f]">$1</strong>',
      )

      // Regular paragraphs
      return (
        <p
          key={index}
          className="font-inter text-[#444] leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      )
    }

    lines.forEach((line, index) => {
      // Handle list items
      if (line.startsWith("- ") || line.startsWith("* ")) {
        if (!inList) {
          inList = true
          listItems = []
        }
        listItems.push(line.slice(2))
      } else if (/^\d+\.\s/.test(line)) {
        if (!inList) {
          inList = true
          listItems = []
        }
        listItems.push(line.replace(/^\d+\.\s/, ""))
      } else {
        if (inList && listItems.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-2 my-4 ml-4">
              {listItems.map((item, i) => {
                const processedItem = item.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="font-semibold text-[#0e1c4f]">$1</strong>',
                )
                return (
                  <li key={i} className="font-inter text-[#444]" dangerouslySetInnerHTML={{ __html: processedItem }} />
                )
              })}
            </ul>,
          )
          inList = false
          listItems = []
        }
        const el = processLine(line, index)
        if (el) elements.push(el)
      }
    })

    // Handle any remaining list items
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key="list-final" className="list-disc list-inside space-y-2 my-4 ml-4">
          {listItems.map((item, i) => (
            <li key={i} className="font-inter text-[#444]">
              {item}
            </li>
          ))}
        </ul>,
      )
    }

    return elements
  }

  return (
    <main className="min-h-screen bg-white">
      <Header locale={locale} onLocaleChange={setLocale} />

      {/* Back to Blog */}
      <section className="pt-28 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-inter text-sm text-[#898989] hover:text-[#0e1c4f] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToBlog}
          </Link>
        </div>
      </section>

      {/* Hero */}
      <section className="pt-8 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Cover Image */}
          {post.coverImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8"
            >
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.altText || post.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          )}

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-[#0e1c4f11] text-[#0e1c4f] text-sm font-inter rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-bebas text-4xl md:text-5xl lg:text-6xl text-[#0e1c4f] tracking-wide mb-4">
              {post.title}
            </h1>

            {/* Date Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm font-inter text-[#898989]">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </span>
              {showUpdated && (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  {t.lastUpdated}: {formatDate(post.updatedAt)}
                </span>
              )}
              {post.category && (
                <span className="px-2 py-1 bg-[#0e1c4f] text-white text-xs rounded">{post.category}</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto prose-custom"
        >
          {renderMarkdown(post.content)}
        </motion.div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-6 bg-[#f9f9f9]">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-bebas text-3xl text-[#0e1c4f] text-center mb-8">{t.relatedArticles}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related, index) => (
                <motion.article
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/blog/${related.slug}`}>
                    <div className="bg-white rounded-xl border border-[#0e1c4f22] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={related.coverImage || "/placeholder.svg?height=300&width=500&query=blog article"}
                          alt={related.altText || related.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-antonio text-lg text-[#0e1c4f] mb-2 line-clamp-2">{related.title}</h3>
                        <span className="font-inter text-sm text-[#0e1c4f] group-hover:underline">{t.readMore}</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-6 bg-[#0e1c4f]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-bebas text-4xl md:text-5xl text-white mb-8"
          >
            {t.ctaTitle}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0e1c4f] font-inter font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {t.ctaButton}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  )
}
