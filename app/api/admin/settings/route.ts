import { NextResponse } from "next/server"
import { getSettings, saveSettings } from "@/lib/settings"

export async function GET() {
  const settings = getSettings()
  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const updated = saveSettings(data)
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
