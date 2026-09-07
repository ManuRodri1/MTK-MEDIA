"use client"

import { useState, type FormEvent } from "react"

import type { PublicLocale } from "@/lib/locale"

import styles from "@/app/contact/contact.module.css"

const copy = {
  en: {
    name: "Your name",
    email: "Email address",
    message: "Tell us about the project",
    send: "Send inquiry",
    sending: "Sending…",
    success: "Your inquiry was sent. MTK will get back to you soon.",
    error: "The inquiry was not sent. Check your connection and try again.",
    retry: "Try again",
  },
  es: {
    name: "Tu nombre",
    email: "Correo electrónico",
    message: "Cuéntanos sobre el proyecto",
    send: "Enviar consulta",
    sending: "Enviando…",
    success: "Tu consulta fue enviada. MTK se comunicará contigo pronto.",
    error: "La consulta no fue enviada. Revisa tu conexión e inténtalo de nuevo.",
    retry: "Intentar de nuevo",
  },
} satisfies Record<PublicLocale, Record<string, string>>

type Status = "idle" | "submitting" | "success" | "error"

export function ContactForm({ locale }: { locale: PublicLocale }) {
  const [status, setStatus] = useState<Status>("idle")
  const t = copy[locale]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("submitting")
    const form = event.currentTarget

    try {
      const response = await fetch("https://formspree.io/f/xyzrpdqz", {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })

      if (!response.ok) {
        setStatus("error")
        return
      }

      form.reset()
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate={false}>
      <div className={styles.field}>
        <label htmlFor="contact-name">{t.name}</label>
        <input id="contact-name" name="name" autoComplete="name" required />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email">{t.email}</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">{t.message}</label>
        <textarea id="contact-message" name="message" rows={6} required />
      </div>

      <div className={styles.formAction}>
        <button type="submit" disabled={status === "submitting" || status === "success"} data-state={status}>
          {status === "submitting" ? t.sending : status === "error" ? t.retry : t.send}
          <span aria-hidden="true">↗</span>
        </button>
        <p className={status === "error" ? styles.error : styles.status} role="status" aria-live="polite">
          {status === "success" ? t.success : status === "error" ? t.error : ""}
        </p>
      </div>
    </form>
  )
}
