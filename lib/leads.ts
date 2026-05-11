import fs from "fs"
import path from "path"
import crypto from "crypto"
import { getDataDirectory } from "@/lib/data-dir"

export type StoredLead = {
  id: string
  createdAt: string
  name: string
  phone: string
  degree: string
  looking: string
}

function leadsFilePath(): string {
  return path.join(getDataDirectory(), "leads.json")
}

function ensureDataDir() {
  const dir = getDataDirectory()
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function readLeadsFile(): StoredLead[] {
  const LEADS_FILE = leadsFilePath()
  try {
    if (!fs.existsSync(LEADS_FILE)) return []
    const raw = fs.readFileSync(LEADS_FILE, "utf-8")
    const arr = JSON.parse(raw) as unknown
    if (!Array.isArray(arr)) return []
    return arr.filter(
      (row): row is StoredLead =>
        typeof row === "object" &&
        row !== null &&
        typeof (row as StoredLead).id === "string" &&
        typeof (row as StoredLead).name === "string",
    )
  } catch {
    return []
  }
}

export function getLeads(): StoredLead[] {
  return readLeadsFile().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function appendLead(input: {
  name: string
  phone: string
  degree: string
  looking: string
}): StoredLead {
  const dir = getDataDirectory()
  const LEADS_FILE = leadsFilePath()
  try {
    ensureDataDir()
    const leads = readLeadsFile()
    const row: StoredLead = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: input.name.trim(),
      phone: input.phone.trim(),
      degree: input.degree,
      looking: input.looking,
    }
    leads.push(row)
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8")
    return row
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("[leads] write failed:", { dir: dir, file: LEADS_FILE, error: msg })
    throw new Error(
      `Could not write lead storage under "${dir}". Set env LEADS_DATA_DIR to a writable absolute path (e.g. on Hostinger: /home/youruser/app-data). Original error: ${msg}`,
    )
  }
}
