import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { LEAD_ADMIN_COOKIE, getJwtSecretKey } from "@/lib/admin-session"

const ADMIN_LOGIN = "/admin/login"
const MIS = "/admin/misconfigured"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  if (pathname === MIS || pathname.startsWith(`${MIS}/`)) {
    return NextResponse.next()
  }

  if (pathname === ADMIN_LOGIN || pathname.startsWith(`${ADMIN_LOGIN}/`)) {
    return NextResponse.next()
  }

  const token = req.cookies.get(LEAD_ADMIN_COOKIE)?.value
  if (!token) {
    const u = new URL(ADMIN_LOGIN, req.url)
    u.searchParams.set("next", pathname)
    return NextResponse.redirect(u)
  }

  try {
    const key = await getJwtSecretKey()
    await jwtVerify(token, key, { algorithms: ["HS256"] })
    return NextResponse.next()
  } catch {
    const u = new URL(ADMIN_LOGIN, req.url)
    u.searchParams.set("next", pathname)
    return NextResponse.redirect(u)
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
