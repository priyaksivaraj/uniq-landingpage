import path from "path"

/**
 * Writable directory for leads.json and app-settings.json.
 * On Hostinger / Docker, set LEADS_DATA_DIR to an absolute path the Node process can write (e.g. under home).
 */
export function getDataDirectory(): string {
  const raw = process.env.LEADS_DATA_DIR?.trim()
  if (raw) {
    return path.isAbsolute(raw) ? raw : path.join(process.cwd(), raw)
  }
  return path.join(process.cwd(), "data")
}
