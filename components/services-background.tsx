"use client"

import { motion } from "framer-motion"

function CardPaths({ position, gridPosition }: { position: number; gridPosition: "tl" | "tr" | "bl" | "br" }) {
  // Adjust origin point based on grid position
  const origins = {
    tl: { x: -100, y: -50 }, // Top left
    tr: { x: 100, y: -50 }, // Top right
    bl: { x: -100, y: 50 }, // Bottom left
    br: { x: 100, y: 50 }, // Bottom right
  }

  const origin = origins[gridPosition]

  const paths = Array.from({ length: 18 }, (_, i) => ({
    id: `${gridPosition}-${i}`,
    d: `M${origin.x - i * 5 * position} ${origin.y - i * 6}C${origin.x - i * 5 * position} ${origin.y - i * 6} ${origin.x + 68 - i * 5 * position} ${origin.y + 405 - i * 6} ${origin.x + 532 - i * 5 * position} ${origin.y + 532 - i * 6}C${origin.x + 996 - i * 5 * position} ${origin.y + 659 - i * 6} ${origin.x + 1064 - i * 5 * position} ${origin.y + 1064 - i * 6} ${origin.x + 1064 - i * 5 * position} ${origin.y + 1064 - i * 6}`,
    opacity: 0.08 + i * 0.02,
    width: 0.4 + i * 0.02,
  }))

  return (
    <>
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          strokeOpacity={path.opacity}
          initial={{ pathLength: 0.2, opacity: 0.4 }}
          animate={{
            pathLength: [0.2, 1, 0.2],
            opacity: [0.2, path.opacity * 1.5, 0.2],
          }}
          transition={{
            duration: 25 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: path.id.split("-")[1] ? Number.parseInt(path.id.split("-")[1]) * 0.3 : 0,
          }}
        />
      ))}
    </>
  )
}

function ServicesPaths() {
  return (
    <svg
      className="w-full h-full text-slate-950"
      viewBox="0 0 696 316"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <title>Services Background</title>
      {/* Top left card paths */}
      <CardPaths position={1} gridPosition="tl" />
      <CardPaths position={-1} gridPosition="tl" />

      {/* Top right card paths */}
      <CardPaths position={1} gridPosition="tr" />
      <CardPaths position={-1} gridPosition="tr" />

      {/* Bottom left card paths */}
      <CardPaths position={1} gridPosition="bl" />
      <CardPaths position={-1} gridPosition="bl" />

      {/* Bottom right card paths */}
      <CardPaths position={1} gridPosition="br" />
      <CardPaths position={-1} gridPosition="br" />
    </svg>
  )
}

export default function ServicesBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-50">
      <ServicesPaths />
    </div>
  )
}
