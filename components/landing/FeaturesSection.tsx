import { CheckCircle, Users, Briefcase } from "lucide-react"

const features = [
  {
    icon: Briefcase,
    title: "100% Placement Within 100 Days",
    description: "Guaranteed job placement for eligible candidates within 100 days of course completion.",
  },
  {
    icon: Users,
    title: "Learn From Industry Experts",
    description: "Trainers with 10+ years experience from top companies including TCS, Infosys, and Wipro.",
  },
  {
    icon: CheckCircle,
    title: "25,000+ Careers Launched",
    description: "Join a growing community of IT professionals who kickstarted their careers with UniqJobs.",
  },
]

const bullets = [
  "Real-time projects with live deployment",
  "Mock interviews & aptitude training",
  "Professional resume building",
  "180+ hiring partners network",
  "Interview scheduling & follow-up",
  "Lifetime placement assistance",
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      {/* Top red line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 text-balance">
            Why UniqJobs is <span className="text-gradient-red">Different</span>
          </h2>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-red-600/40 transition-all group hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600/30 transition-colors">
                  <Icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2 leading-tight">{feat.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feat.description}</p>
              </div>
            )
          })}
        </div>

        {/* Bullet points grid */}
        <div className="glass-card rounded-2xl border border-white/10 p-8">
          <h3 className="text-white font-bold text-xl mb-6 text-center">
            Everything Included in Your Program
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bullets.map((bullet) => (
              <div key={bullet} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-red-600/20 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-red-500" />
                </div>
                <span className="text-white/80 text-sm">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom red line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />
    </section>
  )
}
