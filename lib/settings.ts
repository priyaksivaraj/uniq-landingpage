import fs from "fs"
import path from "path"

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json")

export type Settings = {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPass: string
  smtpTo: string
  webhookUrl: string
}

const defaultSettings: Settings = {
  smtpHost: "smtp.gmail.com",
  smtpPort: 465,
  smtpUser: process.env.EMAIL_USER || "",
  smtpPass: process.env.EMAIL_PASS || "",
  smtpTo: "shaninfozub@gmail.com",
  webhookUrl: "https://n8n-0zzt.srv1353277.hstgr.cloud/webhook/bd0476d5-48cb-4ee1-83dc-e040c2122ce8",
}

export function getSettings(): Settings {
  try {
    if (!fs.existsSync(path.join(process.cwd(), "data"))) {
      fs.mkdirSync(path.join(process.cwd(), "data"))
    }
    if (!fs.existsSync(SETTINGS_FILE)) {
      return defaultSettings
    }
    const data = fs.readFileSync(SETTINGS_FILE, "utf-8")
    return { ...defaultSettings, ...JSON.parse(data) }
  } catch (e) {
    return defaultSettings
  }
}

export function saveSettings(settings: Partial<Settings>) {
  const current = getSettings()
  const updated = { ...current, ...settings }
  if (!fs.existsSync(path.join(process.cwd(), "data"))) {
    fs.mkdirSync(path.join(process.cwd(), "data"))
  }
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2))
  return updated
}
