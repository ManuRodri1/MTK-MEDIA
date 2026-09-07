"use client"

import { motion } from "framer-motion"

export default function SectionDivider() {
  return (
    <div className="w-full mt-12 mb-12">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-[2px] bg-[#0e1c4f] w-full origin-left"
      />
    </div>
  )
}
