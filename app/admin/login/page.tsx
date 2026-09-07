import { LoginForm } from "@/components/admin/LoginForm"

type LoginPageProps = {
  searchParams: Promise<{ unauthorized?: string }>
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-950">
      <section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl sm:p-9">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">MTK Media</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Admin sign in</h1>
        <p className="mb-7 mt-2 text-sm text-slate-600">
          Use your existing Supabase staff account to access the internal CMS.
        </p>
        <LoginForm unauthorized={params.unauthorized === "1"} />
      </section>
    </main>
  )
}
