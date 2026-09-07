import Link from "next/link"

import styles from "./work.module.css"

export default function NotFound() {
  return (
    <section className={`${styles.page} ${styles.emptyState}`}>
      <p className={styles.kicker}>404</p>
      <h1>That project is not on view.</h1>
      <p>It may be unpublished, archived or no longer available.</p>
      <Link className={styles.primaryLink} href="/work">Return to Work <span aria-hidden="true">→</span></Link>
    </section>
  )
}
