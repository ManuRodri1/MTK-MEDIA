import type { ReactNode } from "react"

import { PublicFooter } from "@/components/public/PublicFooter"
import { PublicHeader } from "@/components/public/PublicHeader"

import styles from "./work.module.css"

export default function WorkLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.site}>
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  )
}
