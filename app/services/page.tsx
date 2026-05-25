"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Search, Heart, MessageSquareWarning, Package, Users, Shield, 
  Eye, Lock, Zap, Clock, Target, Award, ArrowRight
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const mainServices = [
  {
    icon: Search,
    title: "Detective Cases",
    description: "Submit fictional roleplay investigation requests. We decode mysteries, uncover hidden truths, and solve emotional puzzles with cinematic flair.",
    features: ["Background checks", "Relationship investigations", "Mystery solving", "Evidence analysis"],
    href: "/cases",
    color: "pink",
  },
  {
    icon: Heart,
    title: "Matchmaking",
    description: "Find your ideal partner through our advanced compatibility analysis. Our team curates connections based on personality, interests, and chemistry.",
    features: ["Personality matching", "Interest alignment", "Chemistry assessment", "Curated introductions"],
    href: "/matchmaking",
    color: "blue",
  },
  {
    icon: MessageSquareWarning,
    title: "Confessions",
    description: "Share your deepest secrets anonymously on our confession wall. Express yourself without judgment in a safe, cyber-noir environment.",
    features: ["Anonymous posting", "Community support", "Safe space", "No judgment"],
    href: "/confessions",
    color: "purple",
  },
  {
    icon: Package,
    title: "Props Rental",
    description: "Rent spy gadgets, roleplay kits, and accessories for your next adventure, event, or creative project.",
    features: ["Spy gadgets", "Roleplay kits", "Event accessories", "Custom orders"],
    href: "/props",
    color: "pink",
  },
]

const whyChooseUs = [
  {
    icon: Shield,
    title: "Complete Discretion",
    description: "Your secrets are safe with us. All cases and requests are handled with utmost confidentiality.",
  },
  {
    icon: Eye,
    title: "Expert Investigators",
    description: "Our team of skilled operatives brings years of experience in roleplay and creative storytelling.",
  },
  {
    icon: Lock,
    title: "Secure Platform",
    description: "State-of-the-art encryption ensures your data and communications remain private.",
  },
  {
    icon: Zap,
    title: "Fast Response",
    description: "We understand urgency. Most requests receive initial response within 24 hours.",
  },
  {
    icon: Clock,
    title: "24/7 Available",
    description: "Our team operates around the clock to serve clients across all time zones.",
  },
  {
    icon: Target,
    title: "High Success Rate",
    description: "98% of our cases reach satisfactory resolution for our clients.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 glass-card rounded-full text-sm text-neon-pink mb-6">
              Full Service Catalog
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              <span className="text-foreground">Our </span>
              <span className="neon-text-pink">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "var(--font-rajdhani)" }}>
              From mystery solving to matchmaking, we offer a comprehensive range of cyber-noir experiences tailored to your unique needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-deep-purple">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {mainServices.map((service, index) => {
              const Icon = service.icon
              const isEven = index % 2 === 0
              const borderClass = service.color === "pink" ? "neon-border-pink" : service.color === "blue" ? "neon-border-blue" : "border-purple-500"
              const iconBgClass = service.color === "pink" ? "bg-neon-pink/20" : service.color === "blue" ? "bg-neon-blue/20" : "bg-purple-500/20"
              const iconColorClass = service.color === "pink" ? "text-neon-pink" : service.color === "blue" ? "text-neon-blue" : "text-purple-500"

              return (
                <motion.div
                  key={service.title}
                  variants={itemVariants}
                  className={`glass-card rounded-2xl p-8 lg:p-12 ${borderClass}`}
                >
                  <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-12 items-center`}>
                    {/* Icon side */}
                    <div className="flex-shrink-0">
                      <div className={`w-32 h-32 rounded-2xl ${iconBgClass} flex items-center justify-center ${borderClass}`}>
                        <Icon className={`w-16 h-16 ${iconColorClass}`} />
                      </div>
                    </div>

                    {/* Content side */}
                    <div className="flex-1 text-center lg:text-left">
                      <h2
                        className="text-2xl lg:text-3xl font-bold text-foreground mb-4"
                        style={{ fontFamily: "var(--font-orbitron)" }}
                      >
                        {service.title}
                      </h2>
                      <p className="text-muted-foreground mb-6 max-w-2xl" style={{ fontFamily: "var(--font-rajdhani)" }}>
                        {service.description}
                      </p>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-3 mb-6 justify-center lg:justify-start">
                        {service.features.map((feature) => (
                          <span
                            key={feature}
                            className="px-3 py-1 text-sm glass rounded-full text-muted-foreground"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={service.href}
                        className={`inline-flex items-center gap-2 px-6 py-3 ${service.color === "pink" ? "bg-neon-pink text-background" : service.color === "blue" ? "bg-neon-blue text-background" : "bg-purple-500 text-white"} font-semibold rounded-lg transition-all duration-300 hover:scale-105`}
                      >
                        <span>Explore {service.title}</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              <span className="text-foreground">Why Choose </span>
              <span className="neon-text-blue">Us</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The Sparks Detective Team combines expertise, discretion, and creativity to deliver unforgettable experiences.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {whyChooseUs.map((item) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="glass-card rounded-xl p-6 text-center hover:neon-border-pink transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto rounded-xl bg-neon-pink/20 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-neon-pink" />
                  </div>
                  <h3
                    className="text-lg font-bold text-foreground mb-2"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-deep-purple">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card neon-border-pink rounded-2xl p-12 text-center max-w-4xl mx-auto"
          >
            <Award className="w-16 h-16 text-neon-pink mx-auto mb-6" />
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Ready to Begin?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Whether you need a mystery solved, a match made, or just want to explore our services, the Sparks team is here for you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-neon-pink text-background font-semibold rounded-lg transition-all duration-300 hover:scale-105 animate-glow"
              >
                <Users className="w-5 h-5" />
                Contact Us
              </Link>
              <Link
                href="/cases"
                className="inline-flex items-center gap-2 px-8 py-4 glass neon-border-blue text-neon-blue font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:bg-neon-blue/10"
              >
                <Search className="w-5 h-5" />
                Open a Case
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
