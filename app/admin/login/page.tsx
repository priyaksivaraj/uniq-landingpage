import { Suspense } from "react"
import AdminLoginForm from "@/components/admin/AdminLoginForm"

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center" aria-busy="true">
          <span className="sr-only">Loading</span>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}
