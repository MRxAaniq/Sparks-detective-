"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Search, Heart, MessageSquareWarning, Package, FileText, Phone } from "lucide-react"

const services = [
  {
    icon: Search,
    title: "Detective Cases",
    description: "Submit fictional roleplay investigation requests. We decode mysteries and solve emotional puzzles.",
    href: "/cases",
    color: "pink",
  },
  {
    icon: Heart,
    title: "Matchmaking",
    description: "Find your ideal partner through our advanced compatibility analysis and AI matching system.",
    href: "/matchmaking",
    color: "blue",
  },
  {
    icon: MessageSquareWarning,
    title: "Confessions",
    description: "Share your secrets anonymously on our confession wall. Express yourself without judgment.",
    href: "/confessions",
    color: "purple",
  },
  {
    icon: Package,
    title: "Props Rental",
    description: "Rent spy gadgets, roleplay kits, and accessories for your next adventure or event.",
    href: "/props",
    color: "pink",
  },
  {
    icon: FileText,
    title: "Full Services",
    description: "Explore our complete range of detective and matchmaking services tailored for you.",
    href: "/services",
    color: "blue",
  },
  {
    icon: Phone,
    title: "Contact Us",
    description: "Reach out to the Sparks team for custom requests, questions, or collaboration.",
    href: "/contact",
    color: "purple",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export default function ServicesPreview() {
  return (
    <section className="relative py-24 bg-deep-purple overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(236, 72, 153, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(236, 72, 153, 0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-neon-pink/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-neon-blue/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            <span className="text-foreground">Our </span>
            <span className="neon-text-blue">Services</span>
          </h2>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            From mystery solving to matchmaking, we offer a range of cinematic experiences tailored to your needs.
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon
            const borderClass = service.color === "pink" ? "hover:neon-border-pink" : service.color === "blue" ? "hover:neon-border-blue" : "hover:border-purple-500"
            const iconColorClass = service.color === "pink" ? "text-neon-pink" : service.color === "blue" ? "text-neon-blue" : "text-purple-500"
            const glowClass = service.color === "pink" ? "group-hover:bg-neon-pink/20" : service.color === "blue" ? "group-hover:bg-neon-blue/20" : "group-hover:bg-purple-500/20"

            return (
              <motion.div key={service.title} variants={cardVariants}>
                <Link
                  href={service.href}
                  className={`group block glass-card rounded-xl p-6 h-full transition-all duration-300 hover:scale-105 ${borderClass}`}
                >
                  {/* Icon */}
                  <div className={`relative w-14 h-14 rounded-xl glass flex items-center justify-center mb-4 transition-all duration-300 ${glowClass}`}>
                    <Icon className={`w-7 h-7 ${iconColorClass} transition-transform duration-300 group-hover:scale-110`} />
                  </div>

                  {/* Content */}
                  <h3
                    className="text-xl font-bold text-foreground mb-2 group-hover:text-neon-pink transition-colors duration-300"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center text-sm font-medium text-muted-foreground group-hover:text-neon-pink transition-colors duration-300">
                    <span>Explore</span>
                    <svg
                      className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
