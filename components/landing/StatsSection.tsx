"use client"

import { useEffect, useRef, useState } from "react"

const stats = [
  { value: 125000, label: "Candidates Trained", suffix: "+" },
  { value: 25000, label: "Candidates Placed", suffix: "+" },
  { value: 3000, label: "Active Students", suffix: "+" },
  { value: 200, label: "Expert Trainers", suffix: "+" },
  { value: 9, label: "Branches", suffix: "+" },
]

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    function step(timestamp: number) {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function StatItem({ value, label, suffix, inView }: { value: number; label: string; suffix: string; inView: boolean }) {
  const count = useCountUp(value, 2000, inView)
  return (
    <div className="text-center p-6 glass-card rounded-2xl border border-white/10 hover:border-red-600/40 transition-all">
      <div className="text-4xl sm:text-5xl font-black text-red-500 mb-1">
        {count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K` : count}
        {suffix}
      </div>
      <div className="text-white/60 text-sm font-medium">{label}</div>
    </div>
  )
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="text-center mb-12">
          <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">Our Impact</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 text-balance">
            Numbers That <span className="text-gradient-red">Speak</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
