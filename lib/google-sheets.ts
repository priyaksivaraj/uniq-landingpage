import { google } from "googleapis"
import type { StoredLead } from "@/lib/leads"
import { getResolvedGoogleSheetsConfig } from "@/lib/app-settings"

/** When config is incomplete, Sheets sync is skipped (no throw). */
export function isGoogleSheetsConfigured(): boolean {
  return getResolvedGoogleSheetsConfig() !== null
}

/**
 * Appends one row to the spreadsheet (same columns as admin / CSV).
 * Share the spreadsheet with the service account email as Editor.
 */
export async function appendLeadToGoogleSheet(lead: StoredLead): Promise<void> {
  const cfg = getResolvedGoogleSheetsConfig()
  if (!cfg) return

  const range = `${cfg.tab}!A:E`

  const auth = new google.auth.JWT({
    email: cfg.clientEmail,
    key: cfg.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const sheets = google.sheets({ version: "v4", auth })

  await sheets.spreadsheets.values.append({
    spreadsheetId: cfg.spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[lead.createdAt, lead.name, lead.phone, lead.degree, lead.looking]],
    },
  })
}

export function googleSheetEditUrl(): string | null {
  const cfg = getResolvedGoogleSheetsConfig()
  if (!cfg) return null
  return `https://docs.google.com/spreadsheets/d/${cfg.spreadsheetId}/edit`
}
