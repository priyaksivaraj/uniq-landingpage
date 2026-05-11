"use client"

import { useEffect, useState } from "react"
import { Globe, Loader2, Save, CheckCircle2 } from "lucide-react"

type Settings = {
  googleSheetsSpreadsheetId: string
  googleSheetsTab: string
  googleServiceAccountEmail: string
  privateKeyConfigured: boolean
  privateKeyStoredInFile: boolean
}

export default function AdminGoogleSheetsForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)
  const [meta, setMeta] = useState<Pick<Settings, "privateKeyConfigured" | "privateKeyStoredInFile"> | null>(null)

  const [spreadsheetId, setSpreadsheetId] = useState("")
  const [tab, setTab] = useState("Sheet1")
  const [email, setEmail] = useState("")
  const [privateKey, setPrivateKey] = useState("")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/admin/settings")
        if (!res.ok) return
        const s: Settings = await res.json()
        if (cancelled) return
        setSpreadsheetId(s.googleSheetsSpreadsheetId)
        setTab(s.googleSheetsTab || "Sheet1")
        setEmail(s.googleServiceAccountEmail)
        setMeta({
          privateKeyConfigured: s.privateKeyConfigured,
          privateKeyStoredInFile: s.privateKeyStoredInFile,
        })
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const body: Record<string, string> = {
        googleSheetsSpreadsheetId: spreadsheetId,
        googleSheetsTab: tab,
        googleServiceAccountEmail: email,
      }
      const trimmedPk = privateKey.trim()
      if (trimmedPk.length > 0) {
        body.googleServiceAccountPrivateKey = privateKey.replace(/\r\n/g, "\n")
      } else if (!meta?.privateKeyStoredInFile) {
        body.googleServiceAccountPrivateKey = ""
      }

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({ type: "err", text: typeof data.error === "string" ? data.error : "Save failed" })
        return
      }
      setMessage({ type: "ok", text: "Saved." })
      if (data.settings) {
        const s = data.settings as Settings
        setMeta({
          privateKeyConfigured: s.privateKeyConfigured,
          privateKeyStoredInFile: s.privateKeyStoredInFile,
        })
      }
      setPrivateKey("")
    } catch {
      setMessage({ type: "err", text: "Network error" })
    } finally {
      setSaving(false)
    }
  }

  async function clearSavedPrivateKey() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleSheetsSpreadsheetId: spreadsheetId,
          googleSheetsTab: tab,
          googleServiceAccountEmail: email,
          googleServiceAccountPrivateKey: "",
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({ type: "err", text: typeof data.error === "string" ? data.error : "Save failed" })
        return
      }
      setMessage({ type: "ok", text: "Saved private key removed from admin storage." })
      if (data.settings) {
        const s = data.settings as Settings
        setMeta({
          privateKeyConfigured: s.privateKeyConfigured,
          privateKeyStoredInFile: s.privateKeyStoredInFile,
        })
      }
    } catch {
      setMessage({ type: "err", text: "Network error" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="glass-card rounded-2xl border border-white/10 p-8 mb-8 flex items-center gap-3 text-white/50">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading Google Sheets settings…
      </div>
    )
  }

  return (
    <div className="glass-card rounded-2xl border border-white/10 p-6 sm:p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-red-500 shrink-0" />
        <div>
          <h2 className="text-xl font-bold">Google Sheets</h2>
          <p className="text-white/45 text-sm mt-0.5">
            Option A credentials stored on this server in <code className="text-red-400/90">data/app-settings.json</code>
            . Share the spreadsheet with the service account email as Editor.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
            message.type === "ok"
              ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
              : "bg-red-500/10 border border-red-500/25 text-red-300"
          }`}
        >
          {message.type === "ok" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
          {message.text}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs uppercase tracking-widest text-white/40 mb-1.5 block">Spreadsheet ID</label>
          <input
            value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
            placeholder="from docs.google.com/spreadsheets/d/…/edit"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-red-600 text-sm font-mono"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-white/40 mb-1.5 block">Tab name</label>
          <input
            value={tab}
            onChange={(e) => setTab(e.target.value)}
            placeholder="Sheet1"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-red-600 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-white/40 mb-1.5 block">Service account email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="…@….iam.gserviceaccount.com"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-red-600 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs uppercase tracking-widest text-white/40 mb-1.5 block">Private key</label>
          <textarea
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            rows={6}
            placeholder={
              meta?.privateKeyStoredInFile
                ? "Leave blank to keep the current saved key. Paste a new key to replace it."
                : meta?.privateKeyConfigured && !meta?.privateKeyStoredInFile
                  ? "Key is coming from environment variables. Paste here to store a copy in admin settings."
                  : "Paste the full private_key from the JSON (include BEGIN/END lines)."
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-red-600 text-xs font-mono"
          />
          <p className="text-white/35 text-xs mt-1.5">
            Stored only on the server file above. Never committed if <code className="text-white/50">data/app-settings.json</code> is
            gitignored.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-60 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Google Sheets settings
        </button>
        {meta?.privateKeyStoredInFile && (
          <button
            type="button"
            onClick={clearSavedPrivateKey}
            disabled={saving}
            className="text-sm text-white/50 hover:text-white underline underline-offset-4 disabled:opacity-50"
          >
            Remove saved private key
          </button>
        )}
      </div>
    </div>
  )
}
