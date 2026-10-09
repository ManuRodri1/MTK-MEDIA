/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/portfolio/real-estate",
        destination: "/real-estate/index.html",
      },
      {
        source: "/portfolio/hospitality-resorts",
        destination: "/hospitality-resorts/index.html",
      },
    ]
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
