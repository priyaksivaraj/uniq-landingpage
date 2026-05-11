"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut, RefreshCw, Loader2, Download } from "lucide-react"

export default function AdminLeadToolbar() {
  const router = useRouter()
  const [busy, setBusy] = useState<"logout" | "refresh" | null>(null)

  async function logout() {
    setBusy("logout")
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.refresh()
    } finally {
      setBusy(null)
    }
  }

  function refresh() {
    setBusy("refresh")
    router.refresh()
    setTimeout(() => setBusy(null), 500)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      <a
        href="/api/admin/leads/export"
        className="bg-emerald-600/25 hover:bg-emerald-600/35 border border-emerald-500/40 text-emerald-200 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </a>
      <button
        type="button"
        onClick={refresh}
        disabled={busy !== null}
        className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
      >
        {busy === "refresh" ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        Refresh
      </button>
      <button
        type="button"
        onClick={logout}
        disabled={busy !== null}
        className="bg-red-600/20 hover:bg-red-600/30 border border-red-600/40 text-red-300 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
      >
        {busy === "logout" ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
        Log out
      </button>
    </div>
  )
}
