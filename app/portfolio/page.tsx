import type { Metadata } from "next"
import PortfolioClient from "./portfolio-client"

export const metadata: Metadata = {
  title: "Portfolio — Our Work",
  description:
    "A selection of recent projects that show our approach to design, strategy, and content. View our brand identity, social media, content creation, and web development work.",
  alternates: {
    canonical: "https://www.mtkmediagroup.com/portfolio",
    languages: {
      "en-US": "https://www.mtkmediagroup.com/portfolio",
      "es-ES": "https://www.mtkmediagroup.com/portfolio?lang=es",
    },
  },
  openGraph: {
    title: "Portfolio — Our Work | MTK Media",
    description: "A selection of recent projects that show our approach to design, strategy, and content.",
    url: "https://www.mtkmediagroup.com/portfolio",
    type: "website",
  },
}

const portfolioJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "MTK Media Portfolio",
  description:
    "A selection of recent projects showcasing brand identity, social media, content creation, and web development work.",
  url: "https://www.mtkmediagroup.com/portfolio",
  isPartOf: {
    "@type": "WebSite",
    name: "MTK Media",
    url: "https://www.mtkmediagroup.com/",
  },
}

export default function PortfolioPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioJsonLd) }} />
      <PortfolioClient />
    </>
  )
}
