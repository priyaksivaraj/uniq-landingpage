import { Award, Building2, Users, Star } from "lucide-react"

const highlights = [
  { icon: Award, label: "ISO Certified" },
  { icon: Building2, label: "NASSCOM Member" },
  { icon: Users, label: "TCS Industry Experts" },
  { icon: Star, label: "Est. 2007" },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">About Us</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4 text-balance">
              Who We <span className="text-gradient-red">Are</span>
            </h2>
            <p className="text-white/60 leading-relaxed mb-5">
              <strong className="text-white">UniqJobs</strong> is a leading software training institute in Chennai, established in 2007 by industry experts from TCS. We are ISO certified and a proud NASSCOM member with a network of 180+ hiring partners across India.
            </p>
            <p className="text-white/60 leading-relaxed mb-8">
              We specialize in <strong className="text-white">job-oriented IT training programs</strong> with end-to-end placement support for freshers, career switchers, and working professionals. Our curriculum is constantly updated based on current industry demands and hiring trends.
            </p>

            {/* What we do */}
            <div className="glass-card rounded-xl border border-white/10 p-5">
              <h4 className="text-white font-bold mb-3">What We Do</h4>
              <ul className="space-y-2">
                {[
                  "Deliver industry-relevant IT training programs",
                  "Connect students with 180+ hiring partners",
                  "Provide real-time project experience",
                  "Offer mock interviews and resume support",
                  "Ensure 100% placement within 100 days",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/60">
                    <span className="text-red-500 mt-0.5">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Highlight boxes */}
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {highlights.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="glass-card border border-white/10 rounded-xl p-6 flex flex-col items-center gap-3 hover:border-red-600/40 transition-all group"
                >
                  <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center group-hover:bg-red-600/30 transition-colors">
                    <Icon className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="text-white font-semibold text-sm text-center">{label}</span>
                </div>
              ))}
            </div>

            {/* Quote card */}
            <div className="glass-card border border-red-600/30 rounded-xl p-6">
              <p className="text-white/70 italic text-sm leading-relaxed mb-3">
                &ldquo;Our mission is to bridge the gap between education and employment by providing world-class IT training with guaranteed placement support.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  UJ
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">UniqJobs Team</div>
                  <div className="text-white/40 text-xs">Founded 2007, Chennai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
