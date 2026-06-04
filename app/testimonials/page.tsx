"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Crown,
  Eye,
  MessageSquareQuote,
  Quote,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase"

type Testimonial = {
  id: string
  created_at: string
  name: string | null
  content: string
  rating: number
  is_anonymous: boolean
  is_hidden: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState(5)
  const [isAnonymous, setIsAnonymous] = useState(false)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_hidden", false)
        .order("created_at", { ascending: false })

      if (error) throw error
      setTestimonials(data || [])
    } catch (error) {
      console.error("Error fetching testimonials:", error)
    } finally {
      setLoading(false)
    }
  }

  const averageRating =
    testimonials.length > 0
      ? testimonials.reduce((total, testimonial) => total + testimonial.rating, 0) / testimonials.length
      : 0

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const trimmedContent = content.trim()
    const trimmedName = name.trim()

    if (!trimmedContent) {
      setSubmitError("Please share your testimonial first.")
      return
    }

    if (!isAnonymous && !trimmedName) {
      setSubmitError("Please add your name or switch to anonymous.")
      return
    }

    setSubmitting(true)
    setSubmitError("")
    setSuccessMessage("")

    try {
      const payload = {
        name: isAnonymous ? null : trimmedName,
        content: trimmedContent,
        rating,
        is_anonymous: isAnonymous,
        is_hidden: false,
      }

      const { data, error } = await supabase.from("testimonials").insert([payload]).select()

      if (error) throw error

      if (data?.[0]) {
        setTestimonials((current) => [data[0] as Testimonial, ...current])
      }

      setName("")
      setContent("")
      setRating(5)
      setIsAnonymous(false)
      setSuccessMessage("Your testimonial is now live.")
      window.setTimeout(() => setSuccessMessage(""), 3500)
    } catch (error) {
      console.error("Error posting testimonial:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to post testimonial.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-24 -left-16 h-72 w-72 rounded-full bg-neon-pink/15 blur-3xl" />
          <div className="absolute top-48 -right-16 h-80 w-80 rounded-full bg-neon-blue/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-neon-pink/30 bg-white/5 px-4 py-2 text-sm text-neon-pink backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Witness Reports, Rated Live
            </span>
            <h1
              className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              <span className="text-foreground">Client </span>
              <span className="text-neon-pink" style={{ textShadow: "0 0 20px rgba(236,72,153,0.35)" }}>
                Testimonials
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground" style={{ fontFamily: "var(--font-rajdhani)" }}>
              Leave a rating, share your experience, and let the public see what the Sparks Detective Agency delivered.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Quote, label: "Live testimonials", value: testimonials.length },
              { icon: Star, label: "Average rating", value: averageRating ? averageRating.toFixed(1) : "0.0" },
              { icon: ShieldCheck, label: "Publicly visible", value: "Yes" },
            ].map((item, index) => {
              const Icon = item.icon

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="glass-card rounded-2xl border border-border/50 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-pink/15 text-neon-pink">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{item.label}</div>
                      <div className="mt-1 text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="glass-card sticky top-24 h-fit rounded-3xl border border-neon-pink/20 p-6 shadow-[0_0_40px_rgba(236,72,153,0.08)]"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon-pink/15 text-neon-pink">
                  <MessageSquareQuote className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
                    Leave a Testimonial
                  </h2>
                  <p className="text-sm text-muted-foreground">Public rating, public review, immediate posting.</p>
                </div>
              </div>

              <div className="space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">Your name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={isAnonymous}
                    className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-neon-pink/70 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={isAnonymous ? "Anonymous enabled" : "Enter your name"}
                    maxLength={80}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">Your rating</span>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }, (_, index) => index + 1).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className="rounded-full p-1 transition-transform duration-200 hover:scale-110"
                        aria-label={`Rate ${value} star${value === 1 ? "" : "s"}`}
                      >
                        <Star
                          className={`h-7 w-7 ${value <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/50"}`}
                        />
                      </button>
                    ))}
                  </div>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">Your testimonial</span>
                  <textarea
                    rows={6}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    className="w-full resize-none rounded-2xl border border-border bg-transparent px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-neon-pink/70"
                    placeholder="Tell us what stood out, what felt memorable, and why you’d recommend us."
                    maxLength={600}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{content.length}/600</span>
                    <span>{rating}/5 stars selected</span>
                  </div>
                </label>

                <label className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-white/5 px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">Post anonymously</div>
                    <div className="text-xs text-muted-foreground">Hide your name from the public wall.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous((current) => !current)}
                    className={`relative h-8 w-14 rounded-full transition-colors duration-300 ${isAnonymous ? "bg-neon-pink" : "bg-white/15"}`}
                    aria-pressed={isAnonymous}
                  >
                    <span
                      className={`absolute top-1 h-6 w-6 rounded-full bg-background transition-transform duration-300 ${isAnonymous ? "translate-x-7" : "translate-x-1"}`}
                    />
                  </button>
                </label>

                <AnimatePresence>
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                    >
                      {submitError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                    >
                      {successMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-neon-pink px-5 py-3.5 font-semibold text-background transition-transform duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  {submitting ? "Publishing..." : "Publish Testimonial"}
                </button>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  By posting, you agree that your testimonial may be shown publicly on the site. The admin team can hide or delete submissions later if needed.
                </p>
              </div>
            </motion.form>

            <div>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
                    Public Review Wall
                  </h2>
                  <p className="text-sm text-muted-foreground">Newest stories show first, exactly as submitted.</p>
                </div>
                <Link
                  href="/contact"
                  className="hidden items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
                >
                  <Users className="h-4 w-4" />
                  Need a custom quote?
                </Link>
              </div>

              {loading ? (
                <div className="glass-card rounded-3xl border border-border/50 p-10 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neon-pink/20 border-t-neon-pink" />
                  <p className="text-muted-foreground">Loading the latest testimonials...</p>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-5 md:grid-cols-2"
                >
                  {testimonials.map((testimonial) => {
                    const displayName = testimonial.is_anonymous || !testimonial.name ? "Anonymous Witness" : testimonial.name

                    return (
                      <motion.article
                        key={testimonial.id}
                        variants={cardVariants}
                        whileHover={{ y: -6 }}
                        className="group relative overflow-hidden rounded-3xl border border-border/60 bg-white/5 p-6 backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]"
                      >
                        <div className="absolute inset-0 bg-linear-to-br from-neon-pink/5 via-transparent to-neon-blue/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        <div className="relative flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-neon-pink">
                              {Array.from({ length: 5 }, (_, index) => index + 1).map((value) => (
                                <Star
                                  key={value}
                                  className={`h-4 w-4 ${value <= testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                                />
                              ))}
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-foreground">{displayName}</h3>
                              {testimonial.is_anonymous && (
                                <span className="rounded-full border border-border/60 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                  Anonymous
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="rounded-full border border-border/60 p-2 text-neon-blue">
                            <Quote className="h-4 w-4" />
                          </div>
                        </div>

                        <p className="relative mt-5 text-sm leading-7 text-muted-foreground">
                          {testimonial.content}
                        </p>

                        <div className="relative mt-6 flex items-center justify-between border-t border-border/50 pt-4 text-xs text-muted-foreground">
                          <span>{new Date(testimonial.created_at).toLocaleDateString()}</span>
                          <span className="inline-flex items-center gap-1">
                            <Crown className="h-3.5 w-3.5 text-yellow-400" />
                            Rated {testimonial.rating}/5
                          </span>
                        </div>
                      </motion.article>
                    )
                  })}
                </motion.div>
              )}

              {!loading && testimonials.length === 0 && (
                <div className="glass-card rounded-3xl border border-border/50 p-10 text-center">
                  <Eye className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                  <p className="text-lg font-medium text-foreground">No testimonials yet.</p>
                  <p className="mt-2 text-sm text-muted-foreground">Be the first person to leave a public review.</p>
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