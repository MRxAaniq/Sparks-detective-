"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Sparkles, Send, User, Mail, MessageSquare, Star, Flame, Users, Gamepad2 } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase"

const compatibilityTraits = [
  "Adventurous",
  "Intellectual",
  "Creative",
  "Romantic",
  "Humorous",
  "Ambitious",
  "Empathetic",
  "Mysterious",
  "Loyal",
  "Spontaneous",
]

const lookingFor = [
  "Long-term relationship",
  "Casual dating",
  "Friendship first",
  "Adventure partner",
  "Creative collaborator",
  "Someone mysterious",
]

export default function MatchmakingPage() {
  const [formData, setFormData] = useState({
    name: "",
    mnf_ign: "",
    age: "",
    gender: "",
    seekingGender: "",
    traits: [] as string[],
    looking_for: "",
    ideal_date: "",
    dealbreakers: "",
    about_you: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleTraitToggle = (trait: string) => {
    setFormData((prev) => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter((t) => t !== trait)
        : prev.traits.length < 5
        ? [...prev.traits, trait]
        : prev.traits,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")
    
    try {
      const { error } = await supabase
        .from('matchmaking')
        .insert([{
          name: formData.name,
          mnf_ign: formData.mnf_ign,
          age: parseInt(formData.age),
          gender: formData.gender,
          seeking_gender: formData.seekingGender,
          traits: formData.traits,
          looking_for: formData.looking_for,
          ideal_date: formData.ideal_date,
          dealbreakers: formData.dealbreakers,
          about_you: formData.about_you,
          status: 'pending'
        }])

      if (error) throw error
      
      setIsSubmitted(true)
    } catch (err: any) {
      console.error("Matchmaking error:", err)
      setSubmitError(err.message || "Failed to submit request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="min-h-screen flex items-center justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card neon-border-pink rounded-2xl p-12 text-center max-w-lg mx-4"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-neon-pink/20 flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-neon-pink" />
            </div>
            <h2
              className="text-2xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Match Request Received!
            </h2>
            <p className="text-muted-foreground mb-6">
              Our matchmaking algorithms are now analyzing your profile. The Sparks team will contact you within 48 hours with potential matches.
            </p>
            <p className="text-sm text-neon-pink">
              Reference ID: MNF-{Date.now().toString(36).toUpperCase()}
            </p>
          </motion.div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm text-neon-pink mb-6">
              <Heart className="w-4 h-4" />
              Find Your Perfect Match
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              <span className="text-foreground">Sparks </span>
              <span className="neon-text-pink">Matchmaking</span>
            </h1>
            <p className="text-lg text-muted-foreground" style={{ fontFamily: "var(--font-rajdhani)" }}>
              Let our expert team find your ideal partner through advanced compatibility analysis and curated introductions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-deep-purple/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { icon: Users, value: "500+", label: "Matches Made" },
              { icon: Star, value: "4.9", label: "Satisfaction" },
              { icon: Flame, value: "89%", label: "Success Rate" },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-6 h-6 text-neon-pink mx-auto mb-2" />
                  <div className="text-2xl font-bold neon-text-pink" style={{ fontFamily: "var(--font-orbitron)" }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass-card neon-border-pink rounded-2xl p-8 lg:p-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-neon-pink/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-neon-pink" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
                  Match Request Form
                </h2>
                <p className="text-sm text-muted-foreground">Tell us about yourself and your ideal match</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Basic Info */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Gamepad2 className="w-4 h-4 inline mr-2 text-neon-pink" />
                    MNF Club In-Game Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mnf_ign}
                    onChange={(e) => setFormData({ ...formData, mnf_ign: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground"
                    placeholder="Enter your mnf club in-game name"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Age</label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="99"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Your Gender</label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground"
                  >
                    <option value="" className="bg-background">Select...</option>
                    <option value="male" className="bg-background">Male</option>
                    <option value="female" className="bg-background">Female</option>
                    <option value="non-binary" className="bg-background">Non-binary</option>
                    <option value="other" className="bg-background">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Seeking</label>
                  <select
                    required
                    value={formData.seekingGender}
                    onChange={(e) => setFormData({ ...formData, seekingGender: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground"
                  >
                    <option value="" className="bg-background">Select...</option>
                    <option value="male" className="bg-background">Men</option>
                    <option value="female" className="bg-background">Women</option>
                    <option value="non-binary" className="bg-background">Non-binary</option>
                    <option value="any" className="bg-background">Any</option>
                  </select>
                </div>
              </div>

              {/* Personality Traits */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Select up to 5 traits that describe you
                </label>
                <div className="flex flex-wrap gap-2">
                  {compatibilityTraits.map((trait) => (
                    <button
                      key={trait}
                      type="button"
                      onClick={() => handleTraitToggle(trait)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        formData.traits.includes(trait)
                          ? "bg-neon-pink text-background"
                          : "glass border border-border text-muted-foreground hover:text-foreground hover:border-neon-pink/50"
                      }`}
                    >
                      {trait}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: {formData.traits.length}/5
                </p>
              </div>

              {/* Looking For */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  What are you looking for?
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {lookingFor.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, looking_for: option })}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                        formData.looking_for === option
                          ? "glass-card neon-border-pink text-neon-pink"
                          : "glass border border-border text-muted-foreground hover:text-foreground hover:border-neon-pink/50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Areas */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Describe your ideal date
                </label>
                <textarea
                  rows={3}
                  value={formData.ideal_date}
                  onChange={(e) => setFormData({ ...formData, ideal_date: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground resize-none"
                  placeholder="A midnight rooftop dinner with city lights below..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Any dealbreakers?
                </label>
                <textarea
                  rows={2}
                  value={formData.dealbreakers}
                  onChange={(e) => setFormData({ ...formData, dealbreakers: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground resize-none"
                  placeholder="Optional - What would be a definite no for you?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tell us more about yourself
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.about_you}
                  onChange={(e) => setFormData({ ...formData, about_you: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground resize-none"
                  placeholder="Share your story, interests, what makes you unique..."
                />
              </div>

              {/* Submit */}
              {submitError && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
                  <p className="text-sm text-red-400">{submitError}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-neon-pink text-background font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed animate-glow"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Match Request
                  </>
                )}
              </button>

              <p className="text-xs text-center text-muted-foreground">
                By submitting, you agree to our matchmaking terms. This is a fictional entertainment service.
              </p>
            </div>
          </motion.form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
