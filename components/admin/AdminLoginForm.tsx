"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, ShieldCheck } from "lucide-react"

function safeNextPath(raw: string | null): string {
  if (!raw) return "/admin"
  if (!raw.startsWith("/admin")) return "/admin"
  if (raw.startsWith("//") || raw.includes("..")) return "/admin"
  return raw
}

export default function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Login failed")
        return
      }
      const next = safeNextPath(searchParams.get("next"))
      router.replace(next)
      router.refresh()
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-card rounded-2xl border border-white/10 p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="w-10 h-10 text-red-600 shrink-0" />
          <div>
            <h1 className="text-2xl font-black">Lead admin</h1>
            <p className="text-white/45 text-sm">
              Default password is <code className="text-red-400/90">admin123</code> unless{" "}
              <code className="text-white/60">ADMIN_PASSWORD</code> is set on the server.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-white/40 mb-1.5 block">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-red-600 transition-colors"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}
