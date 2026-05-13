import { SignJWT, jwtVerify } from "jose"
import { LEAD_ADMIN_COOKIE } from "./admin-constants"

export { LEAD_ADMIN_COOKIE }

const JWT_ALG = "HS256" as const

/** Server-only fallback when `ADMIN_PASSWORD` is unset; never shown in the UI. */
const DEFAULT_ADMIN_PASSWORD = "Infozub@6154"

/**
 * Password: `ADMIN_PASSWORD` env if set, otherwise a built-in default (server only, not exposed in UI).
 */
export function effectiveAdminPassword(): string {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim()
  if (fromEnv) return fromEnv
  return DEFAULT_ADMIN_PASSWORD
}

async function deriveKeyFromPassword(pw: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`lead-admin-jwt-v1:${pw}`),
  )
  return new Uint8Array(digest)
}

export async function getJwtSecretKey(): Promise<Uint8Array> {
  const explicit = process.env.ADMIN_SESSION_SECRET
  if (explicit && explicit.length >= 32) {
    return new TextEncoder().encode(explicit)
  }
  const pw = effectiveAdminPassword()
  if (!pw) {
    throw new Error("Admin password is not configured")
  }
  return deriveKeyFromPassword(pw)
}

export async function createAdminJwt(): Promise<string> {
  const key = await getJwtSecretKey()
  const maxSec = Math.min(
    Math.max(parseInt(process.env.ADMIN_SESSION_MAX_SECONDS || `${8 * 3600}`, 10), 300),
    86400 * 7,
  )
  const now = Math.floor(Date.now() / 1000)
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt(now)
    .setExpirationTime(now + maxSec)
    .setSubject("lead-admin")
    .sign(key)
}

export async function verifyAdminSession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false
  try {
    const key = await getJwtSecretKey()
    await jwtVerify(cookieValue, key, { algorithms: [JWT_ALG] })
    return true
  } catch {
    return false
  }
}
