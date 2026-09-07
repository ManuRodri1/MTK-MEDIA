import Link from "next/link"
import { LogOut } from "lucide-react"

import { AdminNav } from "@/components/admin/AdminNav"
import { requireStaff } from "@/lib/admin/auth"

import { logoutAction } from "./actions"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { email, profile } = await requireStaff()

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto min-h-screen max-w-[1600px] lg:grid lg:grid-cols-[220px_1fr]">
        <aside className="bg-slate-950 px-4 py-4 text-white lg:min-h-screen lg:px-5 lg:py-7">
          <Link href="/admin" className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">MTK Media</span>
            <span className="mt-1 block text-xl font-bold">Work Library</span>
          </Link>

          <div className="my-4 border-t border-slate-800 lg:my-7" />
          <AdminNav />

          <div className="mt-5 border-t border-slate-800 pt-4 lg:mt-10">
            <p className="text-xs uppercase tracking-wide text-slate-500">Signed in as</p>
            <p className="mt-1 truncate text-sm font-medium" title={email}>{email}</p>
            <p className="text-xs capitalize text-slate-400">{profile.role}</p>
            <form action={logoutAction} className="mt-4">
              <button className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm text-slate-200 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" type="submit">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  )
}
