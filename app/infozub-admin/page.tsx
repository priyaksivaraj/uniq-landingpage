import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getLeads, type StoredLead } from "@/lib/leads"
import { ADMIN_BASE_PATH } from "@/lib/admin-constants"
import { LEAD_ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-session"
import { googleSheetEditUrl } from "@/lib/google-sheets"
import AdminGoogleSheetsForm from "@/components/admin/AdminGoogleSheetsForm"
import AdminLeadToolbar from "@/components/admin/AdminLeadToolbar"

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    })
  } catch {
    return iso
  }
}

function LeadsTable({ leads }: { leads: StoredLead[] }) {
  if (leads.length === 0) {
    return (
      <p className="text-white/50 text-center py-16 border border-white/10 rounded-xl bg-white/[0.02]">
        No submissions yet.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm text-left min-w-[720px]">
        <thead>
          <tr className="bg-white/5 border-b border-white/10 text-white/50 uppercase tracking-wider text-xs">
            <th className="px-4 py-3 font-semibold">Submitted</th>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Phone</th>
            <th className="px-4 py-3 font-semibold">Degree</th>
            <th className="px-4 py-3 font-semibold">Looking for</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((row) => (
            <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.03]">
              <td className="px-4 py-3 text-white/60 whitespace-nowrap">{formatWhen(row.createdAt)}</td>
              <td className="px-4 py-3 text-white font-medium">{row.name}</td>
              <td className="px-4 py-3 text-red-400/90">{row.phone}</td>
              <td className="px-4 py-3 text-white/80">{row.degree}</td>
              <td className="px-4 py-3 text-white/80">{row.looking}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const authed = await verifyAdminSession(cookieStore.get(LEAD_ADMIN_COOKIE)?.value)

  if (!authed) {
    redirect(`${ADMIN_BASE_PATH}/login`)
  }

  const leads = getLeads()
  const sheetUrl = googleSheetEditUrl()

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <h1 className="text-3xl font-black tracking-tight">Form submissions</h1>
          {sheetUrl && (
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
            >
              Open Google Sheet
            </a>
          )}
        </header>

        <AdminGoogleSheetsForm />
        <AdminLeadToolbar />
        <LeadsTable leads={leads} />
      </div>
    </div>
  )
}
