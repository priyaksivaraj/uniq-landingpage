import { NextResponse } from "next/server"
import { LEAD_ADMIN_COOKIE } from "@/lib/admin-session"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(LEAD_ADMIN_COOKIE, "", {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  })
  return res
}
