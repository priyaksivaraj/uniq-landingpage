import fs from "fs"
import os from "os"
import path from "path"

let resolvedWritableDir: string | null = null

function canWriteToDir(dir: string): boolean {
  try {
    fs.mkdirSync(dir, { recursive: true })
    fs.accessSync(dir, fs.constants.W_OK)
    return true
  } catch {
    return false
  }
}

/**
 * Writable directory for leads.json and app-settings.json.
 * Tries LEADS_DATA_DIR, then ./data, then ~/.uniq-landingpage/data, then os.tmpdir (Hostinger-friendly).
 */
export function getDataDirectory(): string {
  if (resolvedWritableDir) return resolvedWritableDir

  const candidates: string[] = []
  const raw = process.env.LEADS_DATA_DIR?.trim()
  if (raw) {
    candidates.push(path.isAbsolute(raw) ? raw : path.join(process.cwd(), raw))
  }
  candidates.push(path.join(process.cwd(), "data"))
  const home = process.env.HOME || process.env.USERPROFILE
  if (home) {
    candidates.push(path.join(home, ".uniq-landingpage", "data"))
  }
  candidates.push(path.join(os.tmpdir(), "uniq-landingpage-data"))

  for (const dir of candidates) {
    if (canWriteToDir(dir)) {
      resolvedWritableDir = dir
      const firstChoice = candidates[0]
      if (dir !== firstChoice) {
        console.warn(
          `[data-dir] "${firstChoice}" was not writable; using "${dir}". Set LEADS_DATA_DIR to control location.`,
        )
      }
      return dir
    }
  }

  resolvedWritableDir = path.join(process.cwd(), "data")
  return resolvedWritableDir
}

/** For tests or if disk layout changes at runtime (rare). */
export function resetDataDirectoryCache() {
  resolvedWritableDir = null
}
