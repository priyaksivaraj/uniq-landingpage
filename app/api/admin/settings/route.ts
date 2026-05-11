import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { LEAD_ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-session"
import { getAppSettingsForAdmin, saveGoogleSheetsFromAdmin } from "@/lib/app-settings"

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET() {
  const c = await cookies()
  if (!(await verifyAdminSession(c.get(LEAD_ADMIN_COOKIE)?.value))) {
    return unauthorized()
  }
  return NextResponse.json(getAppSettingsForAdmin())
}

export async function POST(req: Request) {
  const c = await cookies()
  if (!(await verifyAdminSession(c.get(LEAD_ADMIN_COOKIE)?.value))) {
    return unauthorized()
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const patch: Parameters<typeof saveGoogleSheetsFromAdmin>[0] = {}

  if (typeof body.googleSheetsSpreadsheetId === "string") {
    patch.googleSheetsSpreadsheetId = body.googleSheetsSpreadsheetId
  }
  if (typeof body.googleSheetsTab === "string") {
    patch.googleSheetsTab = body.googleSheetsTab
  }
  if (typeof body.googleServiceAccountEmail === "string") {
    patch.googleServiceAccountEmail = body.googleServiceAccountEmail
  }
  if ("googleServiceAccountPrivateKey" in body && typeof body.googleServiceAccountPrivateKey === "string") {
    patch.googleServiceAccountPrivateKey = body.googleServiceAccountPrivateKey
  }

  saveGoogleSheetsFromAdmin(patch)
  return NextResponse.json({ ok: true, settings: getAppSettingsForAdmin() })
}
