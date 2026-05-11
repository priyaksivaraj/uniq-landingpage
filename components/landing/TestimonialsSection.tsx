"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Gopinath S",
    college: "Dhanish Ahmed College",
    initials: "GS",
    color: "bg-red-600",
    quote:
      "The Java Basic module was exceptionally well-structured. The trainer made complex concepts like OOP, Collections, and Exception Handling very easy to understand. Real-time projects gave me hands-on confidence. I got placed within 60 days!",
    rating: 5,
  },
  {
    name: "Shanmuga Sundaram",
    college: "Mahendra Institute",
    initials: "SS",
    color: "bg-rose-700",
    quote:
      "Highly recommended for anyone starting their coding journey. The mock interviews were exactly like the real ones. The trainers are patient and knowledgeable. UniqJobs literally changed my career trajectory.",
    rating: 5,
  },
  {
    name: "V Lakshmipriya",
    college: "Sathyabama Institute of Science & Technology",
    initials: "VL",
    color: "bg-red-800",
    quote:
      "Gained massive confidence in programming skills here. The curriculum is very practical – not just theory. The placement team was always available to help with company prep. Got placed in a great MNC!",
    rating: 5,
  },
  {
    name: "Thirupathi Kannan",
    college: "PSRR College",
    initials: "TK",
    color: "bg-red-600",
    quote:
      "Curriculum is perfectly designed for freshers. The DevOps course with AWS was very comprehensive. The mentors guided me step by step from zero knowledge to job-ready. Highly recommend UniqJobs!",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  const t = testimonials[current]

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-red-600/5 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-red-600/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 text-balance">
            What Our <span className="text-gradient-red">Students Say</span>
          </h2>
        </div>

        {/* Main testimonial card */}
        <div className="glass-card rounded-2xl border border-white/10 p-8 md:p-10 relative">
          <Quote className="absolute top-6 right-8 w-10 h-10 text-red-600/20" />

          {/* Stars */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-red-500 text-red-500" />
            ))}
          </div>

          {/* Quote */}
          <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 italic">
            &ldquo;{t.quote}&rdquo;
          </p>

          {/* Author */}
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}
            >
              {t.initials}
            </div>
            <div>
              <div className="text-white font-bold">{t.name}</div>
              <div className="text-white/50 text-sm">{t.college}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 glass-card border border-white/10 rounded-full flex items-center justify-center text-white hover:border-red-600/50 hover:text-red-500 transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${
                  i === current ? "w-6 h-2 bg-red-600" : "w-2 h-2 bg-white/20"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 glass-card border border-white/10 rounded-full flex items-center justify-center text-white hover:border-red-600/50 hover:text-red-500 transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
