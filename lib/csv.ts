/** Escape a field for CSV (RFC 4180-style). */
export function csvEscape(value: string): string {
  const s = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function leadsToCsv(rows: { createdAt: string; name: string; phone: string; degree: string; looking: string }[]) {
  const header = ["Submitted", "Name", "Phone", "Degree", "Looking for"]
  const lines = [
    header.map(csvEscape).join(","),
    ...rows.map((r) =>
      [r.createdAt, r.name, r.phone, r.degree, r.looking].map(csvEscape).join(","),
    ),
  ]
  // BOM helps Excel on Windows recognize UTF-8
  return "\uFEFF" + lines.join("\r\n")
}
