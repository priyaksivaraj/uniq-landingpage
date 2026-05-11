import { MapPin } from "lucide-react"

const locations = [
  { city: "Chennai", main: true },
  { city: "Bangalore", main: false },
  { city: "Coimbatore", main: false },
  { city: "Madurai", main: false },
  { city: "Trichy", main: false },
  { city: "Salem", main: false },
  { city: "Puducherry", main: false },
  { city: "Tirunelveli", main: false },
]

export default function LocationsSection() {
  return (
    <section id="locations" className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">Our Presence</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-3 text-balance">
            9+ Branches Across <span className="text-gradient-red">Tamil Nadu</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm">
            With branches across major cities, quality IT training is never far from you.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {locations.map((loc) => (
            <div
              key={loc.city}
              className={`relative glass-card rounded-xl border p-5 flex flex-col items-center gap-3 hover:-translate-y-1 transition-all group ${
                loc.main
                  ? "border-red-600/60 red-glow"
                  : "border-white/10 hover:border-red-600/30"
              }`}
            >
              {loc.main && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  HQ
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${loc.main ? "bg-red-600/30" : "bg-red-600/10 group-hover:bg-red-600/20"} transition-colors`}>
                <MapPin className="w-5 h-5 text-red-500" />
              </div>
              <span className={`font-bold text-sm ${loc.main ? "text-white" : "text-white/80"}`}>
                {loc.city}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
    </section>
  )
}
