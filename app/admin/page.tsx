"use client"

import { useState, useEffect } from "react"
import { Settings, Save, Send, ShieldCheck, Mail, Globe, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  const [config, setConfig] = useState({
    smtpHost: "",
    smtpPort: 465,
    smtpUser: "",
    smtpPass: "",
    smtpTo: "",
    webhookUrl: "",
  })

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
      })
  }, [])

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      if (res.ok) setMessage({ type: "success", text: "Settings saved successfully!" })
      else setMessage({ type: "error", text: "Failed to save settings." })
    } catch (e) {
      setMessage({ type: "error", text: "Network error." })
    } finally {
      setSaving(false)
    }
  }

  async function handleTestWebhook() {
    setTesting(true)
    setMessage(null)
    
    // 1. Try Server-Side Test first
    try {
      const res = await fetch("/api/admin/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: config.webhookUrl }),
      })
      if (res.ok) {
        setMessage({ type: "success", text: "Server test successful! Check your n8n." })
        setTesting(false)
        return
      }
    } catch (e) {}

    // 2. Fallback: Try Client-Side Test (from your browser)
    try {
      const res = await fetch(config.webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true, source: "Admin Browser" }),
      })
      setMessage({ type: "success", text: "Server was blocked, but Browser test sent successfully! Check n8n." })
    } catch (e) {
      setMessage({ type: "error", text: "Both Server and Browser failed to reach the webhook. Check your n8n URL." })
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <ShieldCheck className="text-red-600 w-8 h-8" />
              Admin Console
            </h1>
            <p className="text-white/40 text-sm mt-1">Configure your landing page integration</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </header>

        {message && (
          <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 border ${
            message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SMTP Settings */}
          <div className="glass-card p-8 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
              <Mail className="text-red-500 w-5 h-5" />
              SMTP Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-white/40 mb-1.5 block">SMTP Host</label>
                <input
                  value={config.smtpHost}
                  onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-white/40 mb-1.5 block">Port</label>
                  <input
                    type="number"
                    value={config.smtpPort}
                    onChange={(e) => setConfig({ ...config, smtpPort: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-white/40 mb-1.5 block">Recipient (To)</label>
                  <input
                    value={config.smtpTo}
                    onChange={(e) => setConfig({ ...config, smtpTo: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-white/40 mb-1.5 block">User / Email</label>
                <input
                  value={config.smtpUser}
                  onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-white/40 mb-1.5 block">Password / App Key</label>
                <input
                  type="password"
                  value={config.smtpPass}
                  onChange={(e) => setConfig({ ...config, smtpPass: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Webhook Settings */}
          <div className="glass-card p-8 rounded-2xl border border-white/10 flex flex-col">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
              <Globe className="text-red-500 w-5 h-5" />
              Webhook Settings
            </h2>
            <div className="space-y-6 flex-grow">
              <div>
                <label className="text-xs uppercase tracking-widest text-white/40 mb-1.5 block">n8n Webhook URL</label>
                <textarea
                  rows={4}
                  value={config.webhookUrl}
                  onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-red-600 transition-colors text-sm font-mono"
                  placeholder="https://n8n.yourserver.com/webhook/..."
                />
              </div>
              <div className="bg-red-600/5 border border-red-600/20 p-4 rounded-xl">
                <p className="text-xs text-white/50 leading-relaxed">
                  The webhook receives a JSON payload with <code className="text-red-400">name</code>, <code className="text-red-400">phone</code>, <code className="text-red-400">degree</code>, and <code className="text-red-400">looking</code>.
                </p>
              </div>
            </div>
            <button
              onClick={handleTestWebhook}
              disabled={testing}
              className="mt-8 w-full bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Test Webhook Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
