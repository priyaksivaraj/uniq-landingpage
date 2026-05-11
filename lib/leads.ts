import fs from "fs"
import path from "path"
import crypto from "crypto"

export type StoredLead = {
  id: string
  createdAt: string
  name: string
  phone: string
  degree: string
  looking: string
}

const DATA_DIR = path.join(process.cwd(), "data")
const LEADS_FILE = path.join(DATA_DIR, "leads.json")

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readLeadsFile(): StoredLead[] {
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
}
