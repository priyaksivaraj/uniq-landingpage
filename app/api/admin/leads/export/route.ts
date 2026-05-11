import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getLeads } from "@/lib/leads"
import { LEAD_ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-session"
import { leadsToCsv } from "@/lib/csv"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(LEAD_ADMIN_COOKIE)?.value
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const leads = getLeads()
  const csv = leadsToCsv(leads)
  const day = new Date().toISOString().slice(0, 10)
  const filename = `uniqjobs-leads-${day}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  })
}
