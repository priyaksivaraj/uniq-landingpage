import { ArrowRight, Rocket } from "lucide-react"

export default function FinalCTASection() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-6 animate-float">
          <Rocket className="w-8 h-8 text-red-500" />
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-5 text-balance leading-tight">
          Start Your IT Career{" "}
          <span className="text-gradient-red">Today</span> with UniqJobs
        </h2>

        <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Join 125,000+ trained professionals. Get 100% placement support, real-time project experience, and a job-ready certification.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="group flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all red-glow hover:scale-105 animate-pulse-red"
          >
            Book Free Demo Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="tel:+919600114466"
            className="glass-card flex items-center gap-2 text-white font-semibold px-10 py-4 rounded-xl text-lg border border-white/10 hover:border-red-600/50 transition-all"
          >
            Call +91 9600114466
          </a>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 text-white/40 text-sm">
          <span>✓ ISO Certified</span>
          <span>✓ NASSCOM Member</span>
          <span>✓ Est. 2007</span>
          <span>✓ 180+ Hiring Partners</span>
        </div>
      </div>
    </section>
  )
}
