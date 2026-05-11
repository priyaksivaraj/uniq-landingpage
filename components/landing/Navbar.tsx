"use client"

import { useState, useEffect } from "react"
import { Menu, X, Phone } from "lucide-react"
import Image from "next/image"

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Courses", href: "#courses" },
  { label: "Placements", href: "#placements" },
  { label: "About", href: "#about" },
  { label: "Locations", href: "#locations" },
  { label: "Contact", href: "#contact" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 border-b border-white/10 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#hero" className="flex items-center">
            <Image
              src="/images/logo.webp"
              alt="UniqJobs Logo"
              width={130}
              height={40}
              className="object-contain"
              priority
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/80 hover:text-white transition-colors hover:text-red-500"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+919600114466"
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white"
            >
              <Phone className="w-4 h-4 text-red-500" />
              +91 9600114466
            </a>
            <a
              href="#contact"
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all animate-pulse-red"
            >
              Book Free Demo
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-black border-t border-white/10 pb-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 px-4 text-white/80 hover:text-red-500 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="px-4 pt-3">
              <a
                href="#contact"
                className="block bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg text-center transition-all"
                onClick={() => setMenuOpen(false)}
              >
                Book Free Demo
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
