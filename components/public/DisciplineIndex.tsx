"use client"

import { useState } from "react"
import styles from "@/app/home.module.css"

export function DisciplineIndex({ descriptions }: { descriptions: string[] }) {
  const [active, setActive] = useState<number | null>(0)
  return <div className={styles.disciplineList}>
    {["Marketing", "Technology", "Kreativity"].map((name, index) => <article key={name} className={styles.discipline} data-open={active === index || undefined}>
      <h3><button type="button" id={`discipline-${index}`} aria-expanded={active === index} aria-controls={`discipline-panel-${index}`} onClick={() => setActive(active === index ? null : index)}>
        <span className={styles.disciplineIndex}>0{index + 1}</span><span className={styles.disciplineName}>{name}</span><span className={styles.disciplineToggle} aria-hidden="true">{active === index ? "−" : "+"}</span>
      </button></h3>
      <div id={`discipline-panel-${index}`} role="region" aria-labelledby={`discipline-${index}`} hidden={active !== index} className={styles.disciplinePanel}>
        <p>{descriptions[index]}</p>
      </div>
    </article>)}
  </div>
}
