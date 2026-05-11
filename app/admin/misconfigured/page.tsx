import Link from "next/link"

export default function AdminMisconfiguredPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="max-w-lg glass-card rounded-2xl border border-white/10 p-8 sm:p-10 text-center">
        <h1 className="text-xl font-black mb-3">Admin</h1>
        <p className="text-white/55 text-sm leading-relaxed mb-6">
          Sign in from the login page. The default password is <code className="text-red-400/90">admin123</code> unless
          your host defines <code className="text-white/70">ADMIN_PASSWORD</code>.
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
