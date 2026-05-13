/** India Standard Time (no DST). */
const IST = "Asia/Kolkata" as const

function part(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  const raw = parts.find((p) => p.type === type)?.value ?? "0"
  if (type === "year") return raw
  return raw.padStart(2, "0")
}

/**
 * Current instant formatted as ISO-like local time in IST with fixed `+05:30` offset
 * (e.g. `2026-05-12T18:30:45+05:30`). Safe for `new Date(...)` parsing and sorting.
 */
export function nowISTOffsetString(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date)
  const y = part(parts, "year")
  const mo = part(parts, "month")
  const da = part(parts, "day")
  const h = part(parts, "hour")
  const mi = part(parts, "minute")
  const se = part(parts, "second")
  return `${y}-${mo}-${da}T${h}:${mi}:${se}+05:30`
}
