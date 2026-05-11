import { Play } from "lucide-react"

const videos = [
  {
    id: "s0hun1-ZmBQ",
    title: "Student Placement Story – Software Engineer",
  },
  {
    id: "RhFwoq-_SCk",
    title: "From Fresher to IT Professional",
  },
  {
    id: "Rdxvlg3UYFE",
    title: "Career Switch Success with UniqJobs",
  },
  {
    id: "ssaKNGlbHt4",
    title: "100 Days Placement Journey",
  },
]

export default function PlacementsSection() {
  return (
    <section id="placements" className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">Proof of Success</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-3 text-balance">
            Real Student <span className="text-gradient-red">Placement Success</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm">
            Watch real stories from our students who transformed their careers with UniqJobs training and placement support.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {videos.map((video) => (
            <div
              key={video.id}
              className="glass-card rounded-2xl border border-white/10 overflow-hidden hover:border-red-600/40 transition-all group"
            >
              {/* YouTube Embed */}
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-white/80 text-sm font-medium">{video.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
