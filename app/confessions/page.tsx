"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquareWarning, Send, Heart, Eye, EyeOff, Clock, Flame, Quote } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const sampleConfessions = [
  {
    id: 1,
    content: "I have been pretending to like my best friend's partner for 3 years. The truth is, I think they are completely wrong for each other.",
    timeAgo: "2 hours ago",
    hearts: 42,
    mood: "conflicted",
  },
  {
    id: 2,
    content: "Every night at 3 AM, I sneak out to feed the stray cats in my neighborhood. My family thinks I have insomnia.",
    timeAgo: "5 hours ago",
    hearts: 128,
    mood: "wholesome",
  },
  {
    id: 3,
    content: "I once solved a mystery that was supposed to remain unsolved. The truth was too dangerous to reveal, so I buried it forever.",
    timeAgo: "8 hours ago",
    hearts: 89,
    mood: "mysterious",
  },
  {
    id: 4,
    content: "I have been learning to play guitar for 6 months in secret. Planning to surprise my partner on our anniversary with their favorite song.",
    timeAgo: "12 hours ago",
    hearts: 256,
    mood: "romantic",
  },
  {
    id: 5,
    content: "Sometimes I sit in my car for an extra 30 minutes before going home, just to have some quiet time to myself. No one knows.",
    timeAgo: "1 day ago",
    hearts: 312,
    mood: "relatable",
  },
]

const moodTags = [
  { id: "all", label: "All" },
  { id: "romantic", label: "Romantic" },
  { id: "mysterious", label: "Mysterious" },
  { id: "wholesome", label: "Wholesome" },
  { id: "conflicted", label: "Conflicted" },
  { id: "relatable", label: "Relatable" },
]

export default function ConfessionsPage() {
  const [confessions, setConfessions] = useState(sampleConfessions)
  const [newConfession, setNewConfession] = useState("")
  const [selectedMood, setSelectedMood] = useState("all")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [alias, setAlias] = useState("")
  const [confessionMood, setConfessionMood] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const filteredConfessions = selectedMood === "all" 
    ? confessions 
    : confessions.filter(c => c.mood === selectedMood)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newConfession.trim()) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newEntry = {
      id: Date.now(),
      content: newConfession,
      timeAgo: "Just now",
      hearts: 0,
      mood: confessionMood || "mysterious",
    }

    setConfessions([newEntry, ...confessions])
    setNewConfession("")
    setConfessionMood("")
    setIsSubmitting(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleHeart = (id: number) => {
    setConfessions(confessions.map(c => 
      c.id === id ? { ...c, hearts: c.hearts + 1 } : c
    ))
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm text-purple-400 mb-6">
              <MessageSquareWarning className="w-4 h-4" />
              Anonymous Confession Wall
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              <span className="text-foreground">The </span>
              <span className="text-purple-400" style={{ textShadow: "0 0 20px rgba(168, 85, 247, 0.5)" }}>
                Confessions
              </span>
            </h1>
            <p className="text-lg text-muted-foreground" style={{ fontFamily: "var(--font-rajdhani)" }}>
              Share your secrets anonymously. Express yourself without judgment. This is your safe space in the cyber shadows.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 bg-deep-purple/50 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-12">
            {[
              { icon: Quote, value: confessions.length, label: "Confessions" },
              { icon: Heart, value: confessions.reduce((acc, c) => acc + c.hearts, 0), label: "Hearts Given" },
              { icon: Eye, value: "100%", label: "Anonymous" },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="text-center">
                  <Icon className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-xl font-bold text-purple-400" style={{ fontFamily: "var(--font-orbitron)" }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Confession Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <form onSubmit={handleSubmit} className="glass-card border-purple-500/30 rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <MessageSquareWarning className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
                    Share Your Secret
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <textarea
                      rows={5}
                      value={newConfession}
                      onChange={(e) => setNewConfession(e.target.value)}
                      className="w-full px-4 py-3 glass rounded-lg border border-border focus:border-purple-500 focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground resize-none"
                      placeholder="What secret have you been keeping? Share anonymously..."
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right mt-1">
                      {newConfession.length}/500
                    </p>
                  </div>

                  {/* Mood Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confession mood (optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {moodTags.slice(1).map((mood) => (
                        <button
                          key={mood.id}
                          type="button"
                          onClick={() => setConfessionMood(mood.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            confessionMood === mood.id
                              ? "bg-purple-500 text-white"
                              : "glass border border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {mood.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Anonymous Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isAnonymous ? (
                        <EyeOff className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-sm text-foreground">Post anonymously</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`w-10 h-5 rounded-full transition-all ${
                        isAnonymous ? "bg-purple-500" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          isAnonymous ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {!isAnonymous && (
                    <input
                      type="text"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg border border-border focus:border-purple-500 focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground text-sm"
                      placeholder="Enter an alias..."
                    />
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !newConfession.trim()}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Confess
                      </>
                    )}
                  </button>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-center"
                    >
                      <p className="text-sm text-green-400">Your confession has been shared!</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  All confessions are anonymous and for entertainment only.
                </p>
              </form>
            </motion.div>

            {/* Confessions Wall */}
            <div className="lg:col-span-2">
              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {moodTags.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedMood === mood.id
                        ? "bg-purple-500 text-white"
                        : "glass border border-border text-muted-foreground hover:text-foreground hover:border-purple-500/50"
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>

              {/* Confessions List */}
              <motion.div layout className="space-y-4">
                <AnimatePresence>
                  {filteredConfessions.map((confession, index) => (
                    <motion.div
                      key={confession.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <MessageSquareWarning className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {confession.timeAgo}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-400 capitalize">
                              {confession.mood}
                            </span>
                          </div>
                          <p className="text-foreground leading-relaxed">{confession.content}</p>
                          <div className="flex items-center gap-4 mt-4">
                            <button
                              onClick={() => handleHeart(confession.id)}
                              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-neon-pink transition-colors group"
                            >
                              <Heart className="w-4 h-4 group-hover:fill-neon-pink transition-all" />
                              <span>{confession.hearts}</span>
                            </button>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Flame className="w-3 h-3" />
                              Anonymous
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredConfessions.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquareWarning className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No confessions in this category yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
