/**
 * `Secure` cookies are ignored on plain HTTP. Production behind HTTPS should send
 * `x-forwarded-proto: https` from the reverse proxy; otherwise we do not set Secure.
 */
export function shouldUseSecureAdminCookie(req: Request): boolean {
  if (process.env.NODE_ENV !== "production") return false
  if (process.env.ADMIN_COOKIE_INSECURE === "true") return false

  const forwarded = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase()
  if (forwarded === "https") return true

  try {
    const u = new URL(req.url)
    return u.protocol === "https:"
  } catch {
    return false
  }
}
