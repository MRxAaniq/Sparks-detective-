"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"
import Image from "next/image"
import { Eye, Brain, Shield, Zap } from "lucide-react"

const agents = [
  {
    name: "Dumb Detective",
    role: "Co-Lead Investigator",
    specialty: "Smartest Player in the Game",
    image: "/images/dumb.jpg",
    stats: {
      stealth: 95,
      tech: 88,
      combat: 75,
    },
    quote: "Only the Name is Dumb.",
  },
  {
    name: "John_Wick",
    role: "Encounter Specialist",
    specialty: "Fucks Good",
    image: "/images/John1.jpeg",
    stats: {
      stealth: 60,
      tech: 98,
      combat: 45,
    },
    quote: "Every system has a backdoor (Asshole). I Fuck it.",
  },
  {
    name: "Mayalla",
    role: "Dumb Slut Detective",
    specialty: "Does as she's asked (Good Girl)",
    image: "/images/maya1.jpg",
    stats: {
      stealth: 85,
      tech: 70,
      combat: 80,
    },
    quote: "People tell me their secrets willingly in bed.",
  },
  {
    name: "Corinne",
    role: "God Tier Slut",
    specialty: "Will Make you Forget bout ur lover",
    image: "/images/corr.webp",
    stats: {
      stealth: 85,
      tech: 70,
      combat: 80,
    },
    quote: "Will surely put a deep enchanting mark on you.",
  },
   {
    name: "Onee-Chan",
    role: "Vanquisher",
    specialty: "Cold asf Stare",
    image: "/images/onee1.png",
    stats: {
      stealth: 85,
      tech: 70,
      combat: 80,
    },
    quote: "Only Talk About non-sexual Topics .",
  },
  {
    name: "Markon",
    role: "Support Specialist",
    specialty: "Undercover Agents",
    image: "/images/mar.webp",
    stats: {
      stealth: 85,
      tech: 70,
      combat: 80,
    },
    quote: "Trust no one, suspect everyone.",
  }
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
}

export default function TeamSection() {
  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl" />
      </div>

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
            <span className="text-foreground">Meet The </span>
            <span className="neon-text-pink">Team</span>
          </h2>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Elite operatives trained in the art of digital investigation, emotional analysis, and discreet operations.
          </p>
        </motion.div>

        {/* Team cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {agents.map((agent) => (
            <motion.div
              key={agent.name}
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:neon-border-pink">
                {/* Image container */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={agent.image}
                    alt={agent.name}
                    fill
                    className="transition-transform duration-500 group-hover:scale-110 object-contain object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  
                  {/* Role badge */}
                  <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-neon-pink uppercase tracking-wider">
                      {agent.role}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3
                      className="text-2xl font-bold text-foreground mb-1"
                      style={{ fontFamily: "var(--font-orbitron)" }}
                    >
                      {agent.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Eye className="w-4 h-4 text-neon-blue" />
                      {agent.specialty}
                    </p>
                  </div>

                  {/* Stats bars */}
                  <div className="space-y-3">
                    <StatBar label="Stealth" value={agent.stats.stealth} icon={<Shield className="w-3 h-3" />} />
                    <StatBar label="Tech" value={agent.stats.tech} icon={<Zap className="w-3 h-3" />} />
                    <StatBar label="Combat" value={agent.stats.combat} icon={<Brain className="w-3 h-3" />} />
                  </div>

                  {/* Quote */}
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm italic text-muted-foreground">
                      &ldquo;{agent.quote}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function StatBar({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          {icon}
          {label}
        </span>
        <span className="text-neon-pink font-mono">{value}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, #ec4899 0%, #3b82f6 100%)`,
          }}
        />
      </div>
    </div>
  )
}
