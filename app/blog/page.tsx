import type { Metadata } from "next"
import BlogClient from "./blog-client"

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "MTK Media Blog",
  description: "Articles on marketing, branding, design and digital strategy from MTK Media.",
  url: "https://www.mtkmediagroup.com/blog",
  publisher: {
    "@type": "Organization",
    name: "MTK Media",
    logo: {
      "@type": "ImageObject",
      url: "https://www.mtkmediagroup.com/apple-touch-icon.png",
    },
  },
}

export const metadata: Metadata = {
  title: "MTK Media Blog — Strategy, Design & Digital Creativity",
  description:
    "Articles on marketing, branding, design and digital strategy from MTK Media. Strategies, design insights, and digital branding tips.",
  alternates: {
    canonical: "https://www.mtkmediagroup.com/blog",
    languages: {
      "en-US": "https://www.mtkmediagroup.com/blog",
      "es-ES": "https://www.mtkmediagroup.com/blog?lang=es",
    },
  },
  openGraph: {
    title: "MTK Media Blog — Strategy, Design & Digital Creativity",
    description: "Articles on marketing, branding, design and digital strategy from MTK Media.",
    url: "https://www.mtkmediagroup.com/blog",
    type: "website",
  },
}

export default function BlogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <BlogClient />
    </>
  )
}
