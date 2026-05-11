import fs from "fs"
import os from "os"
import path from "path"

let resolvedWritableDir: string | null = null

/** Real write/delete probe — more reliable than fs.access(W_OK) on some hosts. */
function canWriteToDir(dir: string): boolean {
  try {
    fs.mkdirSync(dir, { recursive: true })
    const test = path.join(dir, `.uniq-write-test-${process.pid}-${Date.now()}`)
    fs.writeFileSync(test, "ok", "utf-8")
    fs.unlinkSync(test)
    return true
  } catch {
    return false
  }
}

/** If this folder already has lead/settings files, return how “strong” that dataset is (for picking the same store after deploy). */
function preferenceMetrics(dir: string): { leads: number; mtime: number } | null {
  const lf = path.join(dir, "leads.json")
  const sf = path.join(dir, "app-settings.json")
  let leads = 0
  let hasAny = false
  let mtime = 0
  if (fs.existsSync(lf)) {
    hasAny = true
    try {
      mtime = Math.max(mtime, fs.statSync(lf).mtimeMs)
      const raw = fs.readFileSync(lf, "utf-8")
      const arr = JSON.parse(raw) as unknown
      leads = Array.isArray(arr) ? arr.length : 0
    } catch {
      leads = 0
    }
  }
  if (fs.existsSync(sf)) {
    hasAny = true
    mtime = Math.max(mtime, fs.statSync(sf).mtimeMs)
  }
  if (!hasAny) return null
  return { leads, mtime }
}

function isBetterPreference(
  next: { leads: number; mtime: number; idx: number },
  prev: { leads: number; mtime: number; idx: number } | null,
): boolean {
  if (!prev) return true
  if (next.leads !== prev.leads) return next.leads > prev.leads
  if (next.mtime !== prev.mtime) return next.mtime > prev.mtime
  return next.idx < prev.idx
}

function candidateDirectories(): string[] {
  const candidates: string[] = []
  const raw = process.env.LEADS_DATA_DIR?.trim()
  if (raw) {
    candidates.push(path.isAbsolute(raw) ? raw : path.join(process.cwd(), raw))
  }

  const home = process.env.HOME || process.env.USERPROFILE
  const prod = process.env.NODE_ENV === "production"
  // Prefer a user-level folder in production so leads survive redeploys of the app directory.
  if (prod && home) {
    candidates.push(path.join(home, ".uniq-landingpage", "data"))
  }

  candidates.push(path.join(process.cwd(), "data"))
  candidates.push(path.join(process.cwd(), "..", "data"))

  if (!prod && home) {
    candidates.push(path.join(home, ".uniq-landingpage", "data"))
  }

  const tmpDir = process.env.TMPDIR?.trim()
  if (tmpDir) {
    candidates.push(path.join(tmpDir, "uniq-landingpage-data"))
  }
  candidates.push(path.join(os.tmpdir(), "uniq-landingpage-data"))
  candidates.push("/tmp/uniq-landingpage-data")
  candidates.push(path.join("/var/tmp", "uniq-landingpage-data"))
  return candidates
}

/**
 * Writable directory for leads.json and app-settings.json.
 * - If `LEADS_DATA_DIR` is set and writable, it always wins.
 * - Otherwise prefers a writable path that **already contains** data (most leads, then newest mtime),
 *   so pre-production `./data` is not skipped in favour of an empty `~/.uniq-landingpage/data`.
 * - Else first writable candidate (Hostinger-safe).
 */
export function getDataDirectory(): string {
  if (resolvedWritableDir) return resolvedWritableDir

  const candidates = candidateDirectories()
  const explicit = !!process.env.LEADS_DATA_DIR?.trim()

  if (explicit && candidates.length > 0) {
    const dir = candidates[0]
    if (canWriteToDir(dir)) {
      resolvedWritableDir = dir
      return dir
    }
  }

  type Pick = { dir: string; leads: number; mtime: number; idx: number }
  let bestExisting: Pick | null = null
  for (let i = 0; i < candidates.length; i++) {
    const dir = candidates[i]
    if (!canWriteToDir(dir)) continue
    const pref = preferenceMetrics(dir)
    if (!pref) continue
    const cand = { dir, leads: pref.leads, mtime: pref.mtime, idx: i }
    if (isBetterPreference(cand, bestExisting)) bestExisting = cand
  }
  if (bestExisting) {
    resolvedWritableDir = bestExisting.dir
    if (bestExisting.idx > 0 && explicit === false) {
      console.warn(
        `[data-dir] Using existing data at "${bestExisting.dir}" (${bestExisting.leads} lead(s)). Set LEADS_DATA_DIR to lock this path across environments.`,
      )
    }
    return bestExisting.dir
  }

  const firstChoice = candidates[0]
  for (const dir of candidates) {
    if (canWriteToDir(dir)) {
      resolvedWritableDir = dir
      if (dir !== firstChoice) {
        console.warn(
          `[data-dir] "${firstChoice}" was not writable; using "${dir}". Set LEADS_DATA_DIR to a stable path if you want a fixed location.`,
        )
      }
      return dir
    }
  }

  const list = candidates.join(", ")
  throw new Error(
    `[data-dir] No writable directory found. Tried: ${list}. Create a folder the Node process owns and set LEADS_DATA_DIR to its absolute path (e.g. /home/username/lead-data).`,
  )
}

export function resetDataDirectoryCache() {
  resolvedWritableDir = null
}
