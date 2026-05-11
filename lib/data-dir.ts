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

function candidateDirectories(): string[] {
  const candidates: string[] = []
  const raw = process.env.LEADS_DATA_DIR?.trim()
  if (raw) {
    candidates.push(path.isAbsolute(raw) ? raw : path.join(process.cwd(), raw))
  }
  candidates.push(path.join(process.cwd(), "data"))
  candidates.push(path.join(process.cwd(), "..", "data"))
  const home = process.env.HOME || process.env.USERPROFILE
  if (home) {
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
 * Picks the first path that passes a real write probe (Hostinger-safe).
 */
export function getDataDirectory(): string {
  if (resolvedWritableDir) return resolvedWritableDir

  const candidates = candidateDirectories()
  for (const dir of candidates) {
    if (canWriteToDir(dir)) {
      resolvedWritableDir = dir
      const firstChoice = candidates[0]
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
