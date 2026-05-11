import { NextResponse } from "next/server"
import { LEAD_ADMIN_COOKIE } from "@/lib/admin-session"
import { shouldUseSecureAdminCookie } from "@/lib/admin-cookie"

export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(LEAD_ADMIN_COOKIE, "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: shouldUseSecureAdminCookie(req),
    maxAge: 0,
  })
  return res
}
