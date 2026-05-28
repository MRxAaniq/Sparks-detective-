"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquareWarning, Send, Heart, Eye, EyeOff, Clock, Flame, Quote, Gamepad2, Star } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase"

interface Confession {
  id: string
  content: string
  mood: string
  is_anonymous: boolean
  alias?: string
  mnf_ign?: string
  hearts: number
  is_pinned: boolean
  created_at: string
}

const moodTags = [
  { id: "all", label: "All" },
  { id: "romantic", label: "Romantic" },
  { id: "mysterious", label: "Mysterious" },
  { id: "wholesome", label: "Wholesome" },
  { id: "conflicted", label: "Conflicted" },
  { id: "relatable", label: "Relatable" },
]

export default function ConfessionsPage() {
  const [confessions, setConfessions] = useState<Confession[]>([])
  const [loading, setLoading] = useState(true)
  const [newConfession, setNewConfession] = useState("")
  const [selectedMood, setSelectedMood] = useState("all")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [alias, setAlias] = useState("")
  const [mnfIgn, setMnfIgn] = useState("")
  const [confessionMood, setConfessionMood] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    fetchConfessions()
  }, [])

  const fetchConfessions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('confessions')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setConfessions(data || [])
    } catch (err) {
      console.error("Error fetching confessions:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredConfessions = selectedMood === "all" 
    ? confessions 
    : confessions.filter(c => c.mood === selectedMood)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newConfession.trim()) return

    setIsSubmitting(true)
    setSubmitError("")
    
    try {
      const { data, error } = await supabase
        .from('confessions')
        .insert([{
          content: newConfession,
          mood: confessionMood || "mysterious",
          is_anonymous: isAnonymous,
          alias: isAnonymous ? null : alias,
          mnf_ign: mnfIgn,
          is_pinned: false
        }])
        .select()

      if (error) throw error

      if (data) {
        setConfessions([data[0], ...confessions])
      }
      
      setNewConfession("")
      setConfessionMood("")
      setAlias("")
      setMnfIgn("")
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err: any) {
      console.error("Error posting confession:", err)
      setSubmitError(err.message || "Failed to post confession.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHeart = async (id: string) => {
    // Optimistic update
    setConfessions(confessions.map(c => 
      c.id === id ? { ...c, hearts: c.hearts + 1 } : c
    ))

    try {
      const { error } = await supabase.rpc('increment_hearts', { confession_id: id })
      if (error) {
        // Fallback: manual increment if RPC fails
        const currentConfession = confessions.find(c => c.id === id)
        await supabase
          .from('confessions')
          .update({ hearts: (currentConfession?.hearts || 0) + 1 })
          .eq('id', id)
      }
    } catch (err) {
      console.error("Error incrementing hearts:", err)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInMs = now.getTime() - past.getTime()
    const diffInMins = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMins / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInMins > 0) return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`
    return "Just now"
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

                  {/* MNF Club IGN */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Gamepad2 className="w-4 h-4 inline mr-2 text-purple-400" />
                      MNF Club In-Game Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={mnfIgn}
                      onChange={(e) => setMnfIgn(e.target.value)}
                      className="w-full px-4 py-3 glass rounded-lg border border-border focus:border-purple-500 focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground text-sm"
                      placeholder="Enter your mnf club in-game name"
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
                      <p className="text-sm text-red-400">{submitError}</p>
                    </div>
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
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Decrypting confessions...</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredConfessions.map((confession, index) => (
                      <motion.div
                        key={confession.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className={`glass-card rounded-xl p-6 transition-all duration-300 ${
                          confession.is_pinned 
                            ? "border-yellow-500/50 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.2)]" 
                            : "hover:border-purple-500/30"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            confession.is_pinned ? "bg-yellow-500/20" : "bg-purple-500/20"
                          }`}>
                            {confession.is_pinned ? (
                              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            ) : (
                              <MessageSquareWarning className="w-5 h-5 text-purple-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {getTimeAgo(confession.created_at)}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                                  confession.is_pinned 
                                    ? "bg-yellow-500/20 text-yellow-400" 
                                    : "bg-purple-500/20 text-purple-400"
                                }`}>
                                  {confession.mood}
                                </span>
                                {confession.is_pinned && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-500 text-black uppercase tracking-wider">
                                    Confession of the Month
                                  </span>
                                )}
                              </div>
                              {confession.mnf_ign && (
                                <span className="text-[10px] text-purple-400/50 font-mono">
                                  IGN: {confession.mnf_ign}
                                </span>
                              )}
                            </div>
                            <p className={`leading-relaxed ${confession.is_pinned ? "text-foreground text-lg font-medium" : "text-foreground"}`}>
                              {confession.content}
                            </p>
                            <div className="flex items-center gap-4 mt-4">
                              <button
                                onClick={() => handleHeart(confession.id)}
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-neon-pink transition-colors group"
                              >
                                <Heart className={`w-4 h-4 group-hover:fill-neon-pink transition-all ${confession.hearts > 0 ? "fill-neon-pink text-neon-pink" : ""}`} />
                                <span>{confession.hearts}</span>
                              </button>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Flame className="w-3 h-3" />
                                {confession.is_anonymous ? "Anonymous" : confession.alias || "Secret Agent"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
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
