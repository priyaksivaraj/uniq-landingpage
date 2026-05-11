import { NextResponse } from "next/server"
import { LEAD_ADMIN_COOKIE, createAdminJwt, effectiveAdminPassword } from "@/lib/admin-session"

export async function POST(req: Request) {
  let body: { password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (body.password !== effectiveAdminPassword()) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const jwt = await createAdminJwt()

  const maxSec = Math.min(
    Math.max(parseInt(process.env.ADMIN_SESSION_MAX_SECONDS || `${8 * 3600}`, 10), 300),
    86400 * 7,
  )

  const res = NextResponse.json({ ok: true })
  res.cookies.set(LEAD_ADMIN_COOKIE, jwt, {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: maxSec,
  })
  return res
}
