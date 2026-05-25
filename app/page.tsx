import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import TeamSection from "@/components/team-section"
import ServicesPreview from "@/components/services-preview"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TeamSection />
        <ServicesPreview />
      </main>
      <Footer />
    </>
  )
}
