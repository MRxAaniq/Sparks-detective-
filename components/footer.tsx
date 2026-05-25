"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, MessageCircle, Twitter, Instagram, Github } from "lucide-react"

const footerLinks = {
  services: [
    { name: "Detective Cases", href: "/cases" },
    { name: "Matchmaking", href: "/matchmaking" },
    { name: "Confessions", href: "/confessions" },
    { name: "Props Rental", href: "/props" },
  ],
  company: [
    { name: "About Us", href: "/services" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Disclaimer", href: "#" },
  ],
}

const socialLinks = [
  { icon: MessageCircle, href: "#", label: "Discord" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Github, href: "#", label: "GitHub" },
]

export default function Footer() {
  return (
    <footer className="relative bg-deep-purple border-t border-border/50 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-neon-pink/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neon-pink/20 flex items-center justify-center neon-border-pink">
                <Sparkles className="w-6 h-6 text-neon-pink" />
              </div>
              <div>
                <span
                  className="text-xl font-bold text-foreground tracking-wider"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  MNF — Sparks
                </span>
                <span className="block text-xs text-neon-pink uppercase tracking-widest">
                  Detective Teams
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Finding the hottest partner. Solving emotional mysteries. Creating controlled chaos. 
              Your premier cyber-noir detective agency for all matters of the heart and beyond.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-neon-pink hover:neon-border-pink transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3
              className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-neon-pink transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3
              className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-neon-pink transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-neon-pink transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} MNF — Sparks Detective Teams. All rights reserved.
            </p>
            <p className="text-xs">
              <span className="text-neon-pink">*</span> This is a fictional entertainment platform. Not for illegal activities.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
