import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mtkmediagroup.com"
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MTK Media — Marketing, Technology & Kreativity",
    template: "%s | MTK Media",
  },
  description:
    "Digital branding, creative strategy, content production, web development and social media management for modern businesses.",
  generator: "Next.js",
  applicationName: "MTK Media",
  referrer: "origin-when-cross-origin",
  keywords: [
    "digital branding",
    "creative agency",
    "social media management",
    "content creation",
    "web development",
    "brand identity",
    "marketing strategy",
    "MTK Media",
  ],
  authors: [{ name: "MTK Media", url: "https://www.mtkmediagroup.com/" }],
  creator: "MTK Media",
  publisher: "MTK Media",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "es_ES",
    url: "https://www.mtkmediagroup.com/",
    siteName: "MTK Media",
    title: "MTK Media — Marketing, Technology & Kreativity",
    description: "Creative digital agency specializing in branding, design, content and web solutions.",
    images: [
      {
        url: "/apple-touch-icon.png",
        width: 180,
        height: 180,
        alt: "MTK Media Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MTK Media — Marketing, Technology & Kreativity",
    description: "Creative digital solutions for modern brands.",
    images: ["/apple-touch-icon.png"],
    creator: "@mtkmedia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.mtkmediagroup.com/",
  },
  verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
}

export const viewport: Viewport = {
  themeColor: "#0e1c4f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MTK Media",
  url: "https://www.mtkmediagroup.com/",
  logo: "https://www.mtkmediagroup.com/apple-touch-icon.png",
  description: "Creative digital agency specializing in branding, design, content and web solutions.",
  sameAs: ["https://www.instagram.com/gustavoreynosomtk/", "https://www.linkedin.com/in/gustavo-reynoso-b33799102/"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Spanish"],
  },
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MTK Media",
  url: "https://www.mtkmediagroup.com/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.mtkmediagroup.com/blog?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#0e1c4f" />
        <meta name="msapplication-TileColor" content="#0e1c4f" />

        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="prefetch" href="/services" />
        <link rel="prefetch" href="/work" />
        <link rel="prefetch" href="/contact" />

        <link rel="preload" href="/mtk-logo-dark.png" as="image" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
