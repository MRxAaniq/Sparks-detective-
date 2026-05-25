"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, FileText, Send, User, Mail, AlertTriangle, Eye, Clock, Shield, CheckCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const caseTypes = [
  { id: "background", label: "Background Investigation", icon: Eye },
  { id: "relationship", label: "Relationship Analysis", icon: Search },
  { id: "mystery", label: "Mystery Solving", icon: FileText },
  { id: "surveillance", label: "Surveillance Request", icon: Eye },
  { id: "missing", label: "Missing Person (Roleplay)", icon: AlertTriangle },
  { id: "custom", label: "Custom Investigation", icon: Shield },
]

const priorityLevels = [
  { id: "standard", label: "Standard", time: "5-7 days", color: "blue" },
  { id: "priority", label: "Priority", time: "2-3 days", color: "pink" },
  { id: "urgent", label: "Urgent", time: "24-48 hours", color: "red" },
]

const recentCases = [
  { id: "MNF-2847", type: "Mystery Solving", status: "Solved", date: "2024-01-15" },
  { id: "MNF-2846", type: "Background Investigation", status: "In Progress", date: "2024-01-14" },
  { id: "MNF-2845", type: "Relationship Analysis", status: "Solved", date: "2024-01-13" },
]

export default function CasesPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    caseType: "",
    priority: "standard",
    subject: "",
    description: "",
    evidence: "",
    confidential: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSubmitted(true)
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
              <CheckCircle className="w-10 h-10 text-neon-pink" />
            </div>
            <h2
              className="text-2xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Case Submitted!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your case file has been securely received. Our lead investigator will review and contact you within 24 hours.
            </p>
            <div className="glass rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground">Your Case Reference</p>
              <p className="text-xl font-bold neon-text-pink" style={{ fontFamily: "var(--font-orbitron)" }}>
                MNF-{Date.now().toString(36).toUpperCase()}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Keep this reference number safe for tracking your case.
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
              <Search className="w-4 h-4" />
              Open a New Case
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              <span className="text-foreground">Detective </span>
              <span className="neon-text-pink">Cases</span>
            </h1>
            <p className="text-lg text-muted-foreground" style={{ fontFamily: "var(--font-rajdhani)" }}>
              Submit your investigation request. Our team of skilled investigators will decode mysteries and uncover hidden truths.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Recent Cases Ticker */}
      <section className="py-6 bg-deep-purple/50 border-y border-border/50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Recent Cases:</span>
            <div className="flex gap-6 overflow-hidden">
              {recentCases.map((caseItem) => (
                <div key={caseItem.id} className="flex items-center gap-3 whitespace-nowrap">
                  <span className="text-sm font-mono text-neon-pink">{caseItem.id}</span>
                  <span className="text-sm text-muted-foreground">{caseItem.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${caseItem.status === "Solved" ? "bg-green-500/20 text-green-400" : "bg-neon-blue/20 text-neon-blue"}`}>
                    {caseItem.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>
                  Case Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cases Solved</span>
                    <span className="text-lg font-bold neon-text-pink">127+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="text-lg font-bold neon-text-pink">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Cases</span>
                    <span className="text-lg font-bold neon-text-blue">12</span>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>
                  Confidentiality
                </h3>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-neon-pink flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    All case information is encrypted and handled with absolute discretion. Your secrets are safe with us.
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>
                  Response Time
                </h3>
                <div className="space-y-3">
                  {priorityLevels.map((level) => (
                    <div key={level.id} className="flex items-center gap-3">
                      <Clock className={`w-4 h-4 ${level.color === "pink" ? "text-neon-pink" : level.color === "blue" ? "text-neon-blue" : "text-red-500"}`} />
                      <span className="text-sm text-foreground">{level.label}:</span>
                      <span className="text-sm text-muted-foreground">{level.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="lg:col-span-2 glass-card neon-border-pink rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-neon-pink/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-neon-pink" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
                    Case Submission Form
                  </h2>
                  <p className="text-sm text-muted-foreground">Provide details about your investigation</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Your Name / Alias
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground"
                      placeholder="Agent X or your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground"
                      placeholder="secure@email.com"
                    />
                  </div>
                </div>

                {/* Case Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Select Case Type
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {caseTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, caseType: type.id })}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                            formData.caseType === type.id
                              ? "glass-card neon-border-pink text-neon-pink"
                              : "glass border border-border text-muted-foreground hover:text-foreground hover:border-neon-pink/50"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {type.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {priorityLevels.map((level) => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: level.id })}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          formData.priority === level.id
                            ? level.color === "pink"
                              ? "bg-neon-pink text-background"
                              : level.color === "blue"
                              ? "bg-neon-blue text-background"
                              : "bg-red-500 text-white"
                            : "glass border border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div>{level.label}</div>
                        <div className="text-xs opacity-75">{level.time}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Case Details */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Case Subject / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground"
                    placeholder="Brief title for your case"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Case Description
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground resize-none"
                    placeholder="Describe your case in detail. Include all relevant information, suspects, timeline, and what you hope to discover..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Evidence / Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.evidence}
                    onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground resize-none"
                    placeholder="Any evidence, clues, or additional information that might help..."
                  />
                </div>

                {/* Confidential Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, confidential: !formData.confidential })}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      formData.confidential ? "bg-neon-pink" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                        formData.confidential ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-foreground">Mark as highly confidential</span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.caseType}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-neon-pink text-background font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed animate-glow"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      Encrypting & Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Case
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-muted-foreground">
                  This is a fictional roleplay service for entertainment purposes only.
                </p>
              </div>
            </motion.form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
