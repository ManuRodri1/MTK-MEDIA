"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film } from "lucide-react"

const links = [
  { href: "/admin/projects", label: "Work", icon: Film },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2" aria-label="Admin navigation">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
