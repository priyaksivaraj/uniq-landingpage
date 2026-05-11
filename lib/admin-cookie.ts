/**
 * `Secure` cookies are ignored on plain HTTP. Production behind HTTPS should send
 * `x-forwarded-proto: https` from the reverse proxy; otherwise we do not set Secure.
 */
export function shouldUseSecureAdminCookie(req: Request): boolean {
  if (process.env.NODE_ENV !== "production") return false
  if (process.env.ADMIN_COOKIE_INSECURE === "true") return false

  const forwarded = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase()
  if (forwarded === "https") return true

  const ssl = req.headers.get("x-forwarded-ssl")?.trim().toLowerCase()
  if (ssl === "on") return true

  try {
    const cf = req.headers.get("cf-visitor")
    if (cf) {
      const j = JSON.parse(cf) as { scheme?: string }
      if (j?.scheme === "https") return true
    }
  } catch {
    /* ignore */
  }

  try {
    const u = new URL(req.url)
    return u.protocol === "https:"
  } catch {
    return false
  }
}
