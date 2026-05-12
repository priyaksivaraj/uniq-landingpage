"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react"
import { ADMIN_BASE_PATH } from "@/lib/admin-constants"

function safeNextPath(raw: string | null): string {
  if (!raw) return ADMIN_BASE_PATH
  if (!raw.startsWith(ADMIN_BASE_PATH)) return ADMIN_BASE_PATH
  if (raw.startsWith("//") || raw.includes("..")) return ADMIN_BASE_PATH
  return raw
}

export default function AdminLoginForm() {
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
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Login failed")
        return
      }
      const next = safeNextPath(searchParams.get("next"))
      // Full navigation so the Set-Cookie from the API is always applied before admin UI loads (Hostinger / HTTPS).
      window.location.assign(next)
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xs">
        <h1 className="text-3xl sm:text-4xl font-black tracking-[0.35em] text-center mb-10 text-white">
          LOGIN
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            aria-label="Password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full bg-white/5 border rounded-lg px-4 py-3.5 outline-none transition-colors text-white placeholder:text-white/25 focus:border-red-600 ${
              error ? "border-red-500 ring-1 ring-red-500/50" : "border-white/10"
            }`}
          />
          {error ? (
            <div className="flex justify-center" role="alert">
              <span className="sr-only">{error}</span>
              <AlertCircle className="w-5 h-5 text-red-500" strokeWidth={2} aria-hidden />
            </div>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            aria-label="Submit"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden /> : <ArrowRight className="w-5 h-5" aria-hidden />}
          </button>
        </form>
      </div>
    </div>
  )
}
