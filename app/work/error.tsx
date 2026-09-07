"use client"

import Link from "next/link"

import styles from "./work.module.css"

export default function WorkError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className={`${styles.page} ${styles.emptyState}`}>
      <p className={styles.kicker}>Work unavailable</p>
      <h1>The project index could not be loaded.</h1>
      <p>Try the request again, or return to the studio.</p>
      <div className={styles.errorActions}>
        <button className={styles.primaryLink} type="button" onClick={reset}>Try again</button>
        <Link href="/">Return home</Link>
      </div>
    </section>
  )
}
