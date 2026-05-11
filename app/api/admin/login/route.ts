import { NextResponse } from "next/server"
import { LEAD_ADMIN_COOKIE, createAdminJwt, effectiveAdminPassword } from "@/lib/admin-session"
import { shouldUseSecureAdminCookie } from "@/lib/admin-cookie"

export async function POST(req: Request) {
  const expected = effectiveAdminPassword()

  let body: { password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (body.password !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  let jwt: string
  try {
    jwt = await createAdminJwt()
  } catch {
    return NextResponse.json(
      { error: "Could not create a session. Set ADMIN_SESSION_SECRET (32+ characters) on the server." },
      { status: 503 },
    )
  }

  const maxSec = Math.min(
    Math.max(parseInt(process.env.ADMIN_SESSION_MAX_SECONDS || `${8 * 3600}`, 10), 300),
    86400 * 7,
  )

  const res = NextResponse.json({ ok: true })
  res.cookies.set(LEAD_ADMIN_COOKIE, jwt, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: shouldUseSecureAdminCookie(req),
    maxAge: maxSec,
  })
  return res
}
