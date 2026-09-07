import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchBlogPostBySlug, fetchRelatedPosts } from "@/lib/airtable"
import BlogPostClient from "./blog-post-client"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found | MTK Media",
    }
  }

  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt
  const canonical = post.canonicalUrl || `https://www.mtkmediagroup.com/blog/${post.slug}`

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: post.coverImage ? [post.coverImage] : [],
      authors: ["MTK Media"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await fetchRelatedPosts(slug, post.tags, post.language, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    author: {
      "@type": "Organization",
      name: "MTK Media",
      url: "https://www.mtkmediagroup.com/",
    },
    publisher: {
      "@type": "Organization",
      name: "MTK Media",
      logo: {
        "@type": "ImageObject",
        url: "https://www.mtkmediagroup.com/apple-touch-icon.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.mtkmediagroup.com/blog/${post.slug}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostClient post={post} relatedPosts={relatedPosts} />
    </>
  )
}
