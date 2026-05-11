type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

const WINDOW_MS = 60_000

function maxPerWindow(): number {
  const raw = process.env.LEAD_RATE_LIMIT_PER_MINUTE
  const n = raw ? parseInt(raw, 10) : 8
  if (Number.isNaN(n) || n < 1) return 8
  return Math.min(n, 120)
}

/** Sliding window per key (e.g. IP). In-memory — resets on cold start; use an edge Redis for multi-node. */
export function checkLeadRateLimit(key: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const max = maxPerWindow()
  const now = Date.now()
  let b = buckets.get(key)
  if (!b || now >= b.resetAt) {
    b = { count: 0, resetAt: now + WINDOW_MS }
    buckets.set(key, b)
  }
  if (b.count >= max) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) }
  }
  b.count += 1
  return { ok: true }
}
