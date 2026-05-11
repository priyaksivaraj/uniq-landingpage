"use client"

import { useState } from "react"
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react"

export default function LeadFormSection() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    degree: "",
    looking: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = "Full name is required."
    if (!form.phone.trim()) {
      newErrors.phone = "Contact number is required."
    } else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number."
    }
    if (!form.degree) newErrors.degree = "Please select your degree."
    if (!form.looking) newErrors.looking = "Please select what you are looking for."
    return newErrors
  }

  const [submitError, setSubmitError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    setSubmitError("")
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          degree: form.degree,
          looking: form.looking,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again.")
      } else {
        // Clear old flag so conversion fires fresh for this new submission
        sessionStorage.removeItem("conversion_tracked")
        window.location.href = "/thank-you"
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-black relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-red-600/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative">
        {/* Section header */}
        <div className="text-center mb-10">
          <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">Get Started</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-3 text-balance">
            Book Your <span className="text-gradient-red">Free Demo</span> Today
          </h2>
          <p className="text-white/50 max-w-lg mx-auto leading-relaxed">
            Take the first step toward your IT career. Fill in your details and our counselors will reach out within 24 hours.
          </p>
        </div>

        {/* Form card */}
        <div className="glass-card rounded-2xl p-8 sm:p-10 border border-white/10">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-14 text-center gap-5">
              <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2">Thank you, {form.name}!</h3>
                <p className="text-white/60 leading-relaxed">
                  Our team will contact you at{" "}
                  <span className="text-red-400 font-semibold">{form.phone}</span> shortly.
                </p>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setForm({ name: "", phone: "", degree: "", looking: "" })
                }}
                className="mt-2 text-sm text-red-500 underline underline-offset-4 hover:text-red-400 transition-colors"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full bg-white/5 border text-white placeholder-white/30 px-4 py-3 rounded-lg outline-none transition-colors text-sm ${
                    errors.name ? "border-red-500" : "border-white/10 focus:border-red-500"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your 10-digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className={`w-full bg-white/5 border text-white placeholder-white/30 px-4 py-3 rounded-lg outline-none transition-colors text-sm ${
                    errors.phone ? "border-red-500" : "border-white/10 focus:border-red-500"
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Degree */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">
                  Degree <span className="text-red-500">*</span>
                </label>
                <select
                  name="degree"
                  value={form.degree}
                  onChange={handleChange}
                  className={`w-full bg-[#111] border text-white px-4 py-3 rounded-lg outline-none transition-colors text-sm appearance-none cursor-pointer ${
                    errors.degree ? "border-red-500" : "border-white/10 focus:border-red-500"
                  }`}
                >
                  <option value="" disabled className="text-white/30">Select your degree</option>
                  <option value="BE/B.Tech">BE / B.Tech</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="BCA">BCA</option>
                  <option value="B.Com">B.Com</option>
                  <option value="BBA">BBA</option>
                  <option value="MCA/M.Sc">MCA / M.Sc</option>
                  <option value="MBA">MBA</option>
                  <option value="Diploma">Diploma</option>
                  <option value="ME/M.Tech">ME / M.Tech</option>
                  <option value="Others">Others</option>
                </select>
                {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree}</p>}
              </div>

              {/* What Are You Looking For */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">
                  What Are You Looking For? <span className="text-red-500">*</span>
                </label>
                <select
                  name="looking"
                  value={form.looking}
                  onChange={handleChange}
                  className={`w-full bg-[#111] border text-white px-4 py-3 rounded-lg outline-none transition-colors text-sm appearance-none cursor-pointer ${
                    errors.looking ? "border-red-500" : "border-white/10 focus:border-red-500"
                  }`}
                >
                  <option value="" disabled className="text-white/30">Select an option</option>
                  <option value="Only Course">Only Course</option>
                  <option value="Course with Assured Job">Course with Assured Job</option>
                  <option value="Fast Track Course with Job">Fast Track Course with Job</option>
                  <option value="Only Placement">Only Placement</option>
                </select>
                {errors.looking && <p className="text-red-500 text-xs mt-1">{errors.looking}</p>}
              </div>

              {/* Server error message */}
              {submitError && (
                <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-4">
                  {submitError}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-80 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all red-glow hover:scale-[1.02] active:scale-[0.98] text-base mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Book Free Demo
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
