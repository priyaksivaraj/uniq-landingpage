import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { LEAD_ADMIN_COOKIE } from "@/lib/admin-session"

const ADMIN_LOGIN = "/admin/login"
const MIS = "/admin/misconfigured"

/**
 * Edge middleware cannot rely on runtime-only env (e.g. ADMIN_PASSWORD set only on the host).
 * JWT verification runs on the Node server in /admin and API routes instead.
 */
function hasSessionCookie(token: string | undefined): boolean {
  if (!token || token.length < 30) return false
  return token.split(".").length === 3
}

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
  if (!hasSessionCookie(token)) {
    const u = new URL(ADMIN_LOGIN, req.url)
    u.searchParams.set("next", pathname)
    return NextResponse.redirect(u)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
