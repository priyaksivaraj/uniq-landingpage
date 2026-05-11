"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

export default function ThankYouPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Fire conversion ONCE per session using sessionStorage guard
    if (!sessionStorage.getItem("conversion_tracked")) {
      // --- Google Ads conversion (replace with your actual send_to value) ---
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "conversion", {
          send_to: "AW-XXXXXXXXX/XXXXXXX", // <-- replace with your Google Ads conversion ID
        })
      }

      // --- Meta Pixel Lead event ---
      if (typeof window !== "undefined" && (window as any).fbq) {
        ;(window as any).fbq("track", "Lead")
      }

      // Lock: prevent any further fires this session
      sessionStorage.setItem("conversion_tracked", "true")
    }

    // Auto-redirect countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/8 blur-[160px] rounded-full pointer-events-none" />

      {/* Logo */}
      <div className="mb-10">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2-CMuMY0UAVEtOq7lKbelNNF6abuu4AU.webp"
          alt="UniqJobs logo"
          width={140}
          height={40}
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Card */}
      <div className="relative z-10 glass-card border border-white/10 rounded-2xl p-10 sm:p-14 max-w-lg w-full text-center flex flex-col items-center gap-6">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-red-600/20 flex items-center justify-center ring-4 ring-red-600/10">
          <CheckCircle className="w-12 h-12 text-red-500" />
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 text-balance">
            Thank You!
          </h1>
          <p className="text-white/60 leading-relaxed text-base">
            Your enquiry has been submitted successfully. Our HR team will contact you soon to guide you on the best course for your career goals.
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-red-600/40" />

        {/* Redirect info */}
        <p className="text-white/30 text-sm">
          Redirecting to homepage in{" "}
          <span className="text-red-400 font-bold">{countdown}</span> second{countdown !== 1 ? "s" : ""}...
        </p>

        {/* Manual redirect button */}
        <button
          onClick={() => router.push("/")}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all red-glow hover:scale-[1.02] active:scale-[0.98] text-sm"
        >
          Go to Homepage Now
        </button>

        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/919600114466"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-semibold py-3.5 rounded-xl transition-all text-sm"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat with us on WhatsApp
        </a>
      </div>
    </main>
  )
}
