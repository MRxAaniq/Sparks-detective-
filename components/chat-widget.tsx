"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function ChatWidget() {
  const pathname = usePathname()

  if (pathname === "/chat" || pathname.startsWith("/sparks-admin-panel")) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
    >
      <Link
        href="/chat"
        className="group hidden sm:flex items-center gap-2 px-4 py-2.5 glass rounded-full neon-border-pink text-sm font-medium text-foreground shadow-[0_0_20px_rgba(236,72,153,0.25)] hover:bg-neon-pink/10 transition-all duration-200"
        style={{ fontFamily: "var(--font-rajdhani)" }}
      >
        <span className="text-neon-pink">Chat with Team</span>
      </Link>

      <Link
        href="/chat"
        aria-label="Chat with the team"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-neon-pink text-background shadow-[0_0_28px_rgba(236,72,153,0.45)] hover:scale-105 active:scale-95 transition-transform duration-200"
      >
        <span className="absolute inset-0 rounded-full bg-neon-pink animate-ping opacity-20" />
        <span className="absolute inset-0 rounded-full bg-neon-pink/30 blur-md" />
        <MessageCircle className="relative w-6 h-6" />
      </Link>
    </motion.div>
  )
}
