import Navbar from "@/components/landing/Navbar"
import HeroSection from "@/components/landing/HeroSection"
import LeadFormSection from "@/components/landing/LeadFormSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import CoursesSection from "@/components/landing/CoursesSection"
import StatsSection from "@/components/landing/StatsSection"
import AboutSection from "@/components/landing/AboutSection"
import PlacementsSection from "@/components/landing/PlacementsSection"
import TestimonialsSection from "@/components/landing/TestimonialsSection"
import LocationsSection from "@/components/landing/LocationsSection"
import FinalCTASection from "@/components/landing/FinalCTASection"
import Footer from "@/components/landing/Footer"
import WhatsAppButton from "@/components/landing/WhatsAppButton"

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <HeroSection />
      <LeadFormSection />
      <FeaturesSection />
      <CoursesSection />
      <StatsSection />
      <AboutSection />
      <PlacementsSection />
      <TestimonialsSection />
      <LocationsSection />
      <FinalCTASection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
