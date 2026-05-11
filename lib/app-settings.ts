import fs from "fs"
import path from "path"
import { getDataDirectory } from "@/lib/data-dir"

function settingsPath(): string {
  return path.join(getDataDirectory(), "app-settings.json")
}

export type GoogleSheetsStored = {
  spreadsheetId?: string
  tab?: string
  serviceAccountEmail?: string
  serviceAccountPrivateKey?: string
}

export type AppSettingsFile = {
  googleSheets?: GoogleSheetsStored
}

function ensureDataDir() {
  const dir = getDataDirectory()
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function getAppSettings(): AppSettingsFile {
  try {
    ensureDataDir()
    const sp = settingsPath()
    if (!fs.existsSync(sp)) return {}
    const raw = fs.readFileSync(sp, "utf-8")
    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== "object" || parsed === null) return {}
    return parsed as AppSettingsFile
  } catch {
    return {}
  }
}

function fileStr(v: string | undefined): string | undefined {
  const t = v?.trim()
  return t || undefined
}

function envJsonCreds(): { clientEmail: string; privateKey: string } | null {
  const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!rawJson) return null
  try {
    const p = JSON.parse(rawJson) as { client_email?: string; private_key?: string }
    if (p.client_email && p.private_key) {
      return {
        clientEmail: p.client_email,
        privateKey: p.private_key.replace(/\\n/g, "\n"),
      }
    }
  } catch {
    return null
  }
  return null
}

/** Effective Google Sheets config: non-empty file field wins, else env (Option A or JSON). */
export function getResolvedGoogleSheetsConfig(): {
  spreadsheetId: string
  tab: string
  clientEmail: string
  privateKey: string
} | null {
  const file = getAppSettings().googleSheets || {}

  const spreadsheetId =
    fileStr(file.spreadsheetId) ?? process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim()
  const tab = fileStr(file.tab) ?? process.env.GOOGLE_SHEETS_TAB?.trim() ?? "Sheet1"

  let clientEmail = fileStr(file.serviceAccountEmail)
  let privateKey = fileStr(file.serviceAccountPrivateKey)?.replace(/\\n/g, "\n")

  if (!clientEmail || !privateKey) {
    const j = envJsonCreds()
    if (j) {
      clientEmail = clientEmail ?? j.clientEmail
      privateKey = privateKey ?? j.privateKey
    }
  }
  if (!clientEmail || !privateKey) {
    const e = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim()
    const k = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n")
    if (e && k) {
      clientEmail = clientEmail ?? e
      privateKey = privateKey ?? k
    }
  }

  if (!spreadsheetId || !clientEmail || !privateKey) return null

  return { spreadsheetId, tab, clientEmail, privateKey }
}

export type GoogleSheetsAdminView = {
  googleSheetsSpreadsheetId: string
  googleSheetsTab: string
  googleServiceAccountEmail: string
  /** True if a private key is in effect (file or env). */
  privateKeyConfigured: boolean
  /** True if the effective key is stored in app-settings (not only env). */
  privateKeyStoredInFile: boolean
}

export function getAppSettingsForAdmin(): GoogleSheetsAdminView {
  const resolved = getResolvedGoogleSheetsConfig()
  const file = getAppSettings().googleSheets || {}
  const fileKey = Boolean(fileStr(file.serviceAccountPrivateKey))

  return {
    googleSheetsSpreadsheetId: resolved?.spreadsheetId ?? fileStr(file.spreadsheetId) ?? "",
    googleSheetsTab: resolved?.tab ?? fileStr(file.tab) ?? "Sheet1",
    googleServiceAccountEmail: resolved?.clientEmail ?? fileStr(file.serviceAccountEmail) ?? "",
    privateKeyConfigured: Boolean(resolved?.privateKey),
    privateKeyStoredInFile: fileKey,
  }
}

export function saveGoogleSheetsFromAdmin(input: {
  googleSheetsSpreadsheetId?: string
  googleSheetsTab?: string
  googleServiceAccountEmail?: string
  /** Omit = leave unchanged. Empty string = remove from file (fall back to env). Non-empty = save. */
  googleServiceAccountPrivateKey?: string
}) {
  ensureDataDir()
  const current = getAppSettings()
  const gs: GoogleSheetsStored = { ...(current.googleSheets || {}) }

  if (input.googleSheetsSpreadsheetId !== undefined) {
    gs.spreadsheetId = input.googleSheetsSpreadsheetId.trim()
  }
  if (input.googleSheetsTab !== undefined) {
    const t = input.googleSheetsTab.trim()
    gs.tab = t || "Sheet1"
  }
  if (input.googleServiceAccountEmail !== undefined) {
    gs.serviceAccountEmail = input.googleServiceAccountEmail.trim()
  }
  if (input.googleServiceAccountPrivateKey !== undefined) {
    const v = input.googleServiceAccountPrivateKey
    if (v === "") {
      delete gs.serviceAccountPrivateKey
    } else {
      const trimmed = v.replace(/\r\n/g, "\n").trim()
      if (trimmed) gs.serviceAccountPrivateKey = trimmed
    }
  }

  const next: AppSettingsFile = {
    ...current,
    googleSheets: gs,
  }
  fs.writeFileSync(settingsPath(), JSON.stringify(next, null, 2), "utf-8")
}
