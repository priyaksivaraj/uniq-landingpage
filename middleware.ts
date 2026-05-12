import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ADMIN_BASE_PATH, LEAD_ADMIN_COOKIE } from "@/lib/admin-constants"

const ADMIN_LOGIN = `${ADMIN_BASE_PATH}/login`
const MIS = `${ADMIN_BASE_PATH}/misconfigured`

/** Old typo path → canonical admin URL. */
const LEGACY_ADMIN_PREFIX = "/infozunb-admin"

/**
 * Edge middleware only checks cookie shape; JWT verification runs on the Node server.
 * JWT verification runs on the Node server in admin UI and API routes instead.
 */
function hasSessionCookie(token: string | undefined): boolean {
  if (!token || token.length < 30) return false
  return token.split(".").length === 3
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const u = req.nextUrl.clone()
    u.pathname = pathname.replace(/^\/admin/, ADMIN_BASE_PATH)
    return NextResponse.redirect(u)
  }

  if (pathname === LEGACY_ADMIN_PREFIX || pathname.startsWith(`${LEGACY_ADMIN_PREFIX}/`)) {
    const u = req.nextUrl.clone()
    u.pathname = pathname.replace(/^\/infozunb-admin/, ADMIN_BASE_PATH)
    return NextResponse.redirect(u)
  }

  if (!pathname.startsWith(ADMIN_BASE_PATH)) {
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
  matcher: [
    "/admin",
    "/admin/:path*",
    "/infozunb-admin",
    "/infozunb-admin/:path*",
    "/infozub-admin",
    "/infozub-admin/:path*",
  ],
}
