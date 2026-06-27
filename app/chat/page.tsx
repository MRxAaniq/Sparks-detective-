"use client"

import Navbar from "@/components/navbar"
import ChatPanel from "@/components/chat/chat-panel"

export default function ChatPage() {
  return (
    <main className="relative flex h-dvh flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-neon-pink/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-neon-blue/10 blur-3xl" />
      </div>

      <Navbar />

      <section className="relative z-10 flex min-h-0 flex-1 flex-col px-2 pb-2 pt-[4.25rem] sm:px-4 sm:pb-3 sm:pt-[4.5rem]">
        <div className="mx-auto flex h-[calc(100dvh-4.75rem)] min-h-0 w-full max-w-[96%] flex-col sm:max-w-[90%] lg:max-w-[80%]">
          <div className="glass-card flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-neon-pink/20 shadow-[0_0_80px_rgba(236,72,153,0.12)] sm:rounded-3xl">
            <ChatPanel />
          </div>
        </div>
      </section>
    </main>
  )
}
