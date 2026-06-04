"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Menu, X, Sparkles } from "lucide-react"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Matchmaking", href: "/matchmaking" },
  { name: "Cases", href: "/cases" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Confessions", href: "/confessions" },
  { name: "Props", href: "/props" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="glass border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 rounded-lg bg-neon-pink/20 flex items-center justify-center neon-border-pink">
                <Sparkles className="w-5 h-5 text-neon-pink group-hover:animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span
                  className="text-lg font-bold text-foreground tracking-wider"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  MNF
                </span>
                <span className="block text-[10px] text-neon-pink uppercase tracking-widest">
                  Sparks Detective
                </span>
              </div>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all duration-200"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA + Mobile menu button */}
            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium glass neon-border-pink text-neon-pink rounded-lg hover:bg-neon-pink/10 transition-all duration-200"
              >
                Hire Us
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-foreground hover:bg-white/10 rounded-lg transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden border-t border-border/50"
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all duration-200"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-neon-pink hover:bg-neon-pink/10 rounded-lg transition-all duration-200"
            >
              Hire Us
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
