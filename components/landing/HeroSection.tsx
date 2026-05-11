"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, CheckCircle, Zap } from "lucide-react"

const badges = [
  "100% Placement Support",
  "Real-Time Projects",
  "ISO Certified",
  "NASSCOM Member",
]

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    let animId: number
    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(229, 0, 0, ${p.opacity})`
        ctx.fill()
      })
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(229, 0, 0, ${0.05 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden pt-16"
    >
      {/* Animated particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
      />

      {/* Red glow accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/30 rounded-full px-4 py-2 mb-6">
          <Zap className="w-4 h-4 text-red-500" />
          <span className="text-red-400 text-sm font-medium">
            #1 Software Training Institute in Chennai
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6 text-balance">
          Become{" "}
          <span className="text-gradient-red">Job-Ready</span>{" "}
          in IT with{" "}
          <br className="hidden md:block" />
          <span className="text-red-500">100% Placement</span> Support
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
          Learn industry-ready software skills with real-time projects. Join{" "}
          <span className="text-white font-semibold">25,000+ successful</span> IT professionals
          trained by TCS experts since 2007.
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {badges.map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white/70"
            >
              <CheckCircle className="w-3.5 h-3.5 text-red-500" />
              {badge}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="group flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all red-glow hover:scale-105 animate-pulse-red"
          >
            Book Free Demo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#courses"
            className="flex items-center gap-2 glass-card text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:border-red-600/50"
          >
            Explore Courses
          </a>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-16 max-w-lg mx-auto">
          {[
            { num: "25K+", label: "Placed" },
            { num: "125K+", label: "Trained" },
            { num: "9+", label: "Branches" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-red-500">{stat.num}</div>
              <div className="text-xs text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
