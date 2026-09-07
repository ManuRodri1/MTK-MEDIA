import Airtable from "airtable"

export interface Project {
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
  featured?: boolean
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  altText: string
  seoTitle: string
  seoDescription: string
  canonicalUrl: string | null
  tags: string[]
  category: string
  language: "EN" | "ES"
  published: boolean
  publishedAt: string
  updatedAt: string
}

const MOCK_PROJECTS: Project[] = [
  {
    clientName: "TechFlow Solutions",
    projectTitle: "Digital Transformation",
    industry: "Technology",
    services: ["Brand Identity & Design", "Web & Digital"],
    shortDescription:
      "Complete digital transformation for a growing tech startup, including brand redesign and web platform.",
    projectDescription:
      "TechFlow Solutions needed a complete brand overhaul to match their innovative approach to business analytics. We created a modern, dynamic visual identity that communicates trust and innovation. The project included logo design, color system, typography guidelines, and a fully responsive website with custom animations.",
    slug: "techflow-solutions",
    heroMedia: "/modern-tech-startup-office.jpg",
    finalVisuals: ["/modern-tech-startup-office.jpg"],
    year: "2024",
    featured: true,
  },
  {
    clientName: "Wellness Haven",
    projectTitle: "Social Media Campaign",
    industry: "Health & Wellness",
    services: ["Social Media", "Content Creation"],
    shortDescription: "Strategic social media campaign that increased engagement by 300% and built a loyal community.",
    projectDescription:
      "Wellness Haven approached us to revitalize their social media presence and connect with their audience on a deeper level. We developed a comprehensive content strategy, created engaging visual content, and managed their community growth. The result was a 300% increase in engagement and a thriving online community.",
    slug: "wellness-haven",
    heroMedia: "/wellness-spa-nature.jpg",
    finalVisuals: ["/wellness-spa-nature.jpg"],
    year: "2024",
    featured: true,
  },
  {
    clientName: "Gourmet Delights",
    projectTitle: "Brand Identity",
    industry: "Food & Beverage",
    services: ["Brand Identity & Design", "Content Creation", "Social Media"],
    shortDescription: "Full rebrand with stunning food photography and consistent social media presence.",
    projectDescription:
      "Gourmet Delights needed a fresh identity that would appeal to modern food enthusiasts while honoring their culinary traditions. We delivered a complete brand package including logo, packaging design, professional food photography, and an ongoing social media management strategy.",
    slug: "gourmet-delights",
    heroMedia: "/gourmet-restaurant-food.jpg",
    finalVisuals: ["/gourmet-restaurant-food.jpg"],
    year: "2023",
    featured: true,
  },
  {
    clientName: "FinanceHub Pro",
    projectTitle: "Website Redesign",
    industry: "Finance",
    services: ["Web & Digital", "Content Creation"],
    shortDescription: "Modern financial platform with SEO-optimized content and user-friendly interface.",
    projectDescription:
      "FinanceHub Pro required a professional digital presence that would establish credibility and trust with their clients. We designed and developed a modern website with intuitive navigation, SEO-optimized content, and secure client portals. The new platform significantly improved user engagement and lead generation.",
    slug: "financehub-pro",
    heroMedia: "/modern-finance-office-building.jpg",
    finalVisuals: ["/modern-finance-office-building.jpg"],
    year: "2023",
    featured: false,
  },
]

const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "The Power of Consistent Branding",
    slug: "power-of-consistent-branding",
    excerpt:
      "Discover why brand consistency is crucial for building trust and recognition in today's competitive market.",
    content: `## Why Brand Consistency Matters

In today's crowded marketplace, consistent branding is more important than ever. It's not just about having a nice logo—it's about creating a cohesive experience that builds trust and recognition.

### Building Trust Through Repetition

When customers see the same visual elements, messaging, and tone across all touchpoints, they begin to recognize and trust your brand. This consistency signals professionalism and reliability.

### Key Elements of Brand Consistency

- **Visual Identity**: Logo, colors, typography
- **Voice and Tone**: How you communicate
- **Messaging**: What you say and how you say it
- **Customer Experience**: Every interaction matters

### Implementing Consistency

Start by documenting your brand guidelines. Create a comprehensive style guide that covers:

1. Logo usage rules
2. Color palette specifications
3. Typography guidelines
4. Photography style
5. Voice and tone examples

> "Your brand is what other people say about you when you're not in the room." — Jeff Bezos

Consistency doesn't mean being boring—it means being recognizable. The most successful brands in the world are instantly identifiable because they've maintained consistent visual and verbal identities over time.`,
    coverImage: "/branding-design-modern.jpg",
    altText: "Modern branding design elements",
    seoTitle: "The Power of Consistent Branding | MTK Media",
    seoDescription:
      "Discover why brand consistency is crucial for building trust and recognition in today's competitive market.",
    canonicalUrl: null,
    tags: ["Branding", "Design", "Strategy"],
    category: "Branding",
    language: "EN",
    published: true,
    publishedAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
  {
    id: "2",
    title: "El Poder del Branding Consistente",
    slug: "poder-del-branding-consistente",
    excerpt:
      "Descubre por qué la consistencia de marca es crucial para construir confianza y reconocimiento en el mercado competitivo actual.",
    content: `## Por Qué Importa la Consistencia de Marca

En el mercado saturado de hoy, el branding consistente es más importante que nunca. No se trata solo de tener un logo bonito—se trata de crear una experiencia cohesiva que construya confianza y reconocimiento.

### Construyendo Confianza a Través de la Repetición

Cuando los clientes ven los mismos elementos visuales, mensajes y tono en todos los puntos de contacto, comienzan a reconocer y confiar en tu marca.

### Elementos Clave de la Consistencia de Marca

- **Identidad Visual**: Logo, colores, tipografía
- **Voz y Tono**: Cómo te comunicas
- **Mensajes**: Qué dices y cómo lo dices
- **Experiencia del Cliente**: Cada interacción importa`,
    coverImage: "/dise-o-branding-moderno.jpg",
    altText: "Elementos de diseño de marca modernos",
    seoTitle: "El Poder del Branding Consistente | MTK Media",
    seoDescription: "Descubre por qué la consistencia de marca es crucial para construir confianza y reconocimiento.",
    canonicalUrl: null,
    tags: ["Branding", "Diseño", "Estrategia"],
    category: "Branding",
    language: "ES",
    published: true,
    publishedAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
  {
    id: "3",
    title: "Social Media Strategies for 2025",
    slug: "social-media-strategies-2025",
    excerpt: "Stay ahead of the curve with these proven social media strategies that will dominate in 2025.",
    content: `## Social Media Trends to Watch

The social media landscape is constantly evolving. Here's what you need to know for 2025.

### Video Content Continues to Dominate

Short-form video isn't going anywhere. Platforms like TikTok, Instagram Reels, and YouTube Shorts continue to see explosive growth.

### Authenticity Over Perfection

Users are craving real, authentic content. Polished, overly-produced content is being replaced by genuine, relatable posts.

### Key Strategies

1. **Embrace AI tools** for content creation and scheduling
2. **Focus on community building** over follower counts
3. **Leverage user-generated content**
4. **Invest in video production** capabilities`,
    coverImage: "/social-media-marketing-digital.jpg",
    altText: "Social media marketing concept",
    seoTitle: "Social Media Strategies for 2025 | MTK Media",
    seoDescription: "Stay ahead of the curve with these proven social media strategies that will dominate in 2025.",
    canonicalUrl: null,
    tags: ["Social Media", "Marketing", "Digital Strategy"],
    category: "Social Media",
    language: "EN",
    published: true,
    publishedAt: "2024-11-15T10:00:00Z",
    updatedAt: "2024-11-20T14:00:00Z",
  },
  {
    id: "4",
    title: "Estrategias de Redes Sociales para 2025",
    slug: "estrategias-redes-sociales-2025",
    excerpt: "Mantente a la vanguardia con estas estrategias de redes sociales probadas que dominarán en 2025.",
    content: `## Tendencias de Redes Sociales

El panorama de las redes sociales está en constante evolución. Esto es lo que necesitas saber para 2025.

### El Video Sigue Dominando

El video de formato corto no va a ninguna parte. Plataformas como TikTok, Instagram Reels y YouTube Shorts continúan viendo un crecimiento explosivo.

### Autenticidad Sobre Perfección

Los usuarios están buscando contenido real y auténtico.`,
    coverImage: "/redes-sociales-marketing-digital.jpg",
    altText: "Concepto de marketing en redes sociales",
    seoTitle: "Estrategias de Redes Sociales para 2025 | MTK Media",
    seoDescription: "Mantente a la vanguardia con estas estrategias de redes sociales probadas.",
    canonicalUrl: null,
    tags: ["Redes Sociales", "Marketing", "Estrategia Digital"],
    category: "Redes Sociales",
    language: "ES",
    published: true,
    publishedAt: "2024-11-15T10:00:00Z",
    updatedAt: "2024-11-20T14:00:00Z",
  },
  {
    id: "5",
    title: "Web Design Principles That Convert",
    slug: "web-design-principles-convert",
    excerpt: "Learn the essential web design principles that turn visitors into customers.",
    content: `## Designing for Conversion

Great web design isn't just about aesthetics—it's about creating an experience that guides users toward action.

### The Psychology of Design

Understanding how users interact with your website is crucial for creating effective designs.

### Essential Principles

1. **Clear Visual Hierarchy**: Guide the eye
2. **Strategic White Space**: Let content breathe
3. **Compelling CTAs**: Make actions obvious
4. **Fast Load Times**: Speed matters
5. **Mobile-First Approach**: Design for all devices`,
    coverImage: "/web-design-modern-ui-ux.jpg",
    altText: "Modern web design interface",
    seoTitle: "Web Design Principles That Convert | MTK Media",
    seoDescription: "Learn the essential web design principles that turn visitors into customers.",
    canonicalUrl: null,
    tags: ["Web Design", "UX", "Conversion"],
    category: "Web Design",
    language: "EN",
    published: true,
    publishedAt: "2024-10-20T10:00:00Z",
    updatedAt: "2024-10-20T10:00:00Z",
  },
  {
    id: "6",
    title: "Principios de Diseño Web Que Convierten",
    slug: "principios-diseno-web-convierten",
    excerpt: "Aprende los principios esenciales de diseño web que convierten visitantes en clientes.",
    content: `## Diseñando para la Conversión

El gran diseño web no se trata solo de estética—se trata de crear una experiencia que guíe a los usuarios hacia la acción.

### La Psicología del Diseño

Entender cómo los usuarios interactúan con tu sitio web es crucial para crear diseños efectivos.`,
    coverImage: "/dise-o-web-moderno-ui-ux.jpg",
    altText: "Interfaz de diseño web moderno",
    seoTitle: "Principios de Diseño Web Que Convierten | MTK Media",
    seoDescription: "Aprende los principios esenciales de diseño web que convierten visitantes en clientes.",
    canonicalUrl: null,
    tags: ["Diseño Web", "UX", "Conversión"],
    category: "Diseño Web",
    language: "ES",
    published: true,
    publishedAt: "2024-10-20T10:00:00Z",
    updatedAt: "2024-10-20T10:00:00Z",
  },
]

export async function fetchProjects(): Promise<Project[]> {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_TABLE_NAME) {
    console.log("[v0] Airtable not configured, using mock data")
    return MOCK_PROJECTS
  }

  try {
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(process.env.AIRTABLE_BASE_ID)

    const tableName = process.env.AIRTABLE_TABLE_NAME

    console.log("[v0] Fetching from Airtable table:", tableName)

    const records = await base(tableName)
      .select({
        filterByFormula: "{Published} = TRUE()",
        maxRecords: 50,
      })
      .all()

    console.log("[v0] Successfully fetched", records.length, "projects from Airtable")

    return records.map((record) => {
      const heroMediaAttachment = record.get("Hero Media") as { url: string }[] | undefined
      const finalVisualsAttachment = record.get("Final Visuals") as { url: string }[] | undefined

      return {
        clientName: (record.get("Client Name") as string) || "",
        projectTitle: (record.get("Project Title") as string) || undefined,
        industry: (record.get("Industry") as string) || "",
        services: (record.get("Services Provided") as string[]) || [],
        shortDescription: (record.get("Short Description") as string) || "",
        projectDescription: (record.get("Project Description") as string) || undefined,
        slug: (record.get("Slug") as string) || "",
        heroMedia: heroMediaAttachment && heroMediaAttachment.length > 0 ? heroMediaAttachment[0].url : null,
        finalVisuals: finalVisualsAttachment ? finalVisualsAttachment.map((att) => att.url) : [],
        year: (record.get("Year") as string) || undefined,
        featured: (record.get("Featured") as boolean) || false,
      }
    })
  } catch (error) {
    console.error("[v0] Airtable error, falling back to mock data:", error)
    return MOCK_PROJECTS
  }
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_TABLE_NAME) {
    console.log("[v0] Airtable not configured, using mock data for slug:", slug)
    return MOCK_PROJECTS.find((p) => p.slug === slug) || null
  }

  try {
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(process.env.AIRTABLE_BASE_ID)

    const tableName = process.env.AIRTABLE_TABLE_NAME

    const records = await base(tableName)
      .select({
        filterByFormula: `AND({Slug} = "${slug}", {Published} = TRUE())`,
        maxRecords: 1,
      })
      .all()

    if (records.length === 0) {
      return MOCK_PROJECTS.find((p) => p.slug === slug) || null
    }

    const record = records[0]
    const heroMediaAttachment = record.get("Hero Media") as { url: string }[] | undefined
    const finalVisualsAttachment = record.get("Final Visuals") as { url: string }[] | undefined

    return {
      clientName: (record.get("Client Name") as string) || "",
      projectTitle: (record.get("Project Title") as string) || undefined,
      industry: (record.get("Industry") as string) || "",
      services: (record.get("Services Provided") as string[]) || [],
      shortDescription: (record.get("Short Description") as string) || "",
      projectDescription: (record.get("Project Description") as string) || undefined,
      slug: (record.get("Slug") as string) || "",
      heroMedia: heroMediaAttachment && heroMediaAttachment.length > 0 ? heroMediaAttachment[0].url : null,
      finalVisuals: finalVisualsAttachment ? finalVisualsAttachment.map((att) => att.url) : [],
      year: (record.get("Year") as string) || undefined,
      featured: (record.get("Featured") as boolean) || false,
    }
  } catch (error) {
    console.error("[v0] Airtable error fetching project by slug:", error)
    return MOCK_PROJECTS.find((p) => p.slug === slug) || null
  }
}

export async function fetchBlogPosts(language?: "EN" | "ES"): Promise<BlogPost[]> {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.log("[v0] Airtable not configured, using mock blog data")
    const posts = language ? MOCK_BLOG_POSTS.filter((p) => p.language === language) : MOCK_BLOG_POSTS
    return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }

  try {
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(process.env.AIRTABLE_BASE_ID)

    let filterFormula = "{Published} = TRUE()"
    if (language) {
      filterFormula = `AND({Published} = TRUE(), {Language} = "${language}")`
    }

    const records = await base("BlogPosts")
      .select({
        filterByFormula: filterFormula,
        sort: [{ field: "Published At", direction: "desc" }],
        maxRecords: 100,
      })
      .all()

    return records.map((record) => {
      const coverImageAttachment = record.get("Cover Image") as { url: string }[] | undefined

      return {
        id: record.id,
        title: (record.get("Title") as string) || "",
        slug: (record.get("Slug") as string) || "",
        excerpt: (record.get("Excerpt") as string) || "",
        content: (record.get("Content (Markdown)") as string) || "",
        coverImage: coverImageAttachment && coverImageAttachment.length > 0 ? coverImageAttachment[0].url : null,
        altText: (record.get("Alt Text") as string) || "",
        seoTitle: (record.get("SEO Title") as string) || "",
        seoDescription: (record.get("SEO Description") as string) || "",
        canonicalUrl: (record.get("Canonical URL") as string) || null,
        tags: (record.get("Tags") as string[]) || [],
        category: (record.get("Category") as string) || "",
        language: (record.get("Language") as "EN" | "ES") || "EN",
        published: (record.get("Published") as boolean) || false,
        publishedAt: (record.get("Published At") as string) || "",
        updatedAt: (record.get("Updated At") as string) || "",
      }
    })
  } catch (error) {
    console.error("[v0] Airtable error fetching blog posts:", error)
    const posts = language ? MOCK_BLOG_POSTS.filter((p) => p.language === language) : MOCK_BLOG_POSTS
    return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.log("[v0] Airtable not configured, using mock data for blog slug:", slug)
    return MOCK_BLOG_POSTS.find((p) => p.slug === slug) || null
  }

  try {
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(process.env.AIRTABLE_BASE_ID)

    const records = await base("BlogPosts")
      .select({
        filterByFormula: `AND({Slug} = "${slug}", {Published} = TRUE())`,
        maxRecords: 1,
      })
      .all()

    if (records.length === 0) {
      return MOCK_BLOG_POSTS.find((p) => p.slug === slug) || null
    }

    const record = records[0]
    const coverImageAttachment = record.get("Cover Image") as { url: string }[] | undefined

    return {
      id: record.id,
      title: (record.get("Title") as string) || "",
      slug: (record.get("Slug") as string) || "",
      excerpt: (record.get("Excerpt") as string) || "",
      content: (record.get("Content (Markdown)") as string) || "",
      coverImage: coverImageAttachment && coverImageAttachment.length > 0 ? coverImageAttachment[0].url : null,
      altText: (record.get("Alt Text") as string) || "",
      seoTitle: (record.get("SEO Title") as string) || "",
      seoDescription: (record.get("SEO Description") as string) || "",
      canonicalUrl: (record.get("Canonical URL") as string) || null,
      tags: (record.get("Tags") as string[]) || [],
      category: (record.get("Category") as string) || "",
      language: (record.get("Language") as "EN" | "ES") || "EN",
      published: (record.get("Published") as boolean) || false,
      publishedAt: (record.get("Published At") as string) || "",
      updatedAt: (record.get("Updated At") as string) || "",
    }
  } catch (error) {
    console.error("[v0] Airtable error fetching blog post by slug:", error)
    return MOCK_BLOG_POSTS.find((p) => p.slug === slug) || null
  }
}

export async function fetchRelatedPosts(
  currentSlug: string,
  tags: string[],
  language: "EN" | "ES",
  limit = 3,
): Promise<BlogPost[]> {
  const allPosts = await fetchBlogPosts(language)

  return allPosts
    .filter((post) => post.slug !== currentSlug)
    .filter((post) => post.tags.some((tag) => tags.includes(tag)))
    .slice(0, limit)
}
