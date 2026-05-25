"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Search, Heart, MessageSquare, Sparkles } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Cyberpunk cityscape"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      </div>

      {/* Animated scan line effect */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent animate-scan-line" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-neon-pink/60"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0,
            }}
            animate={{
              y: [null, "-20%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-20 container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-6rem)]">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full"
            >
              <Sparkles className="w-4 h-4 text-neon-pink" />
              <span className="text-sm font-medium tracking-wider text-neon-pink uppercase">
                Cyber Detective Agency
              </span>
            </motion.div>

            {/* Main heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                <span className="text-foreground">Sparks Detective</span>
                <br />
                <span className="neon-text-pink animate-neon-pulse">Teams</span>
                <br />
                <span className="text-muted-foreground text-3xl sm:text-4xl lg:text-5xl">
                  At Your Service.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                Finding the hottest partner. Solving emotional mysteries. Creating controlled chaos.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/cases"
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-neon-pink text-background font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 animate-glow"
              >
                <Search className="w-5 h-5" />
                <span>Open a Case</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>

              <Link
                href="/matchmaking"
                className="group relative inline-flex items-center gap-2 px-6 py-3 glass-card neon-border-pink text-neon-pink font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-neon-pink/10"
              >
                <Heart className="w-5 h-5" />
                <span>Submit Match Request</span>
              </Link>

              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 px-6 py-3 glass-card neon-border-blue text-neon-blue font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-neon-blue/10"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Contact Sparks Team</span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50"
            >
              {[
                { value: "127+", label: "Cases Solved" },
                { value: "98%", label: "Success Rate" },
                { value: "24/7", label: "Available" },
              ].map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div
                    className="text-2xl sm:text-3xl font-bold neon-text-pink"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column - Sparky Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative animate-float">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/30 via-neon-purple/20 to-neon-blue/30 blur-3xl rounded-full scale-110" />
              
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden neon-border-pink">
                <Image
                  src="/images/sparky-hero.png"
                  alt="Sparky - Private Investigator"
                  width={500}
                  height={700}
                  className="object-contain max-h-[80vh]"
                  priority
                />
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -left-4 glass-card neon-border-pink rounded-xl px-4 py-3"
              >
                <div className="text-xs text-neon-pink uppercase tracking-wider">Lead Investigator</div>
                <div className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
                  SPARKY
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
