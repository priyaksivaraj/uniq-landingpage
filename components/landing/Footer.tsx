import { Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"

const courses = [
  "Java Full Stack",
  "Python Full Stack",
  "Dotnet Full Stack",
  "Data Engineering",
  "IT Production Support",
  "DevOps / AWS",
]

const cities = ["Chennai", "Bangalore", "Coimbatore", "Madurai", "Trichy", "Salem"]

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Image
              src="/images/logo.webp"
              alt="UniqJobs Logo"
              width={130}
              height={40}
              className="object-contain mb-4"
            />
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              Leading software training & placement institute in Chennai. ISO certified, NASSCOM member. Est. 2007.
            </p>
            <a
              href="https://wa.me/919600114466"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#25D366]/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-white font-bold mb-4">Our Courses</h4>
            <ul className="space-y-2">
              {courses.map((c) => (
                <li key={c}>
                  <a href="#courses" className="text-white/40 hover:text-red-500 text-sm transition-colors">
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-white font-bold mb-4">Our Branches</h4>
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city}>
                  <a href="#locations" className="text-white/40 hover:text-red-500 text-sm transition-colors">
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:info@uniqtechnologies.co.in" className="flex items-start gap-3 text-white/40 hover:text-white transition-colors group">
                  <Mail className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                  <span className="text-sm">info@uniqtechnologies.co.in</span>
                </a>
              </li>
              <li>
                <a href="tel:+919600114466" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="text-sm">+91 9600114466</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/40">
                  <MapPin className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                  <span className="text-sm">#1 Shifa Arcade, 3rd Floor, T Nagar, Chennai – 600017</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 text-white/30 text-xs text-center">
          <p>© 2025 UniqJobs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
