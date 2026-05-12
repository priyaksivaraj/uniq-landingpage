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

function envStr(...keys: string[]): string | undefined {
  for (const k of keys) {
    const t = process.env[k]?.trim()
    if (t) return t
  }
  return undefined
}

function envPrivateKey(...keys: string[]): string | undefined {
  for (const k of keys) {
    const t = process.env[k]?.trim()
    if (t) return t.replace(/\\n/g, "\n")
  }
  return undefined
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

/**
 * Google Sheets config: **environment variables win** over `app-settings.json` so
 * production redeploys keep the same credentials without relying on a writable JSON file.
 * Supports alternate names: `GOOGLE_SHEET_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`.
 */
export function getResolvedGoogleSheetsConfig(): {
  spreadsheetId: string
  tab: string
  clientEmail: string
  privateKey: string
} | null {
  const file = getAppSettings().googleSheets || {}

  const spreadsheetId =
    envStr("GOOGLE_SHEETS_SPREADSHEET_ID", "GOOGLE_SHEET_ID") ?? fileStr(file.spreadsheetId)

  const tab = envStr("GOOGLE_SHEETS_TAB") ?? fileStr(file.tab) ?? "Sheet1"

  let clientEmail =
    envStr("GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_CLIENT_EMAIL") ?? fileStr(file.serviceAccountEmail)

  let privateKey =
    envPrivateKey("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY", "GOOGLE_PRIVATE_KEY") ??
    fileStr(file.serviceAccountPrivateKey)?.replace(/\\n/g, "\n")

  if (!clientEmail || !privateKey) {
    const j = envJsonCreds()
    if (j) {
      clientEmail = clientEmail ?? j.clientEmail
      privateKey = privateKey ?? j.privateKey
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
