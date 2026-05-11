import Link from "next/link"

export default function AdminMisconfiguredPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="max-w-lg glass-card rounded-2xl border border-white/10 p-8 sm:p-10 text-center">
        <h1 className="text-xl font-black mb-3">Admin</h1>
        <p className="text-white/55 text-sm leading-relaxed mb-6">
          Admin sign-in could not be completed. Please try again later or contact the site owner.
        </p>
        <Link
          href="/admin/login"
          className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
        >
          Go to login
        </Link>
      </div>
    </div>
  )
}
