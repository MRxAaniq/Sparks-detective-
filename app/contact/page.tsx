"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare, Building, CheckCircle, Twitter, Instagram, MessageCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    value: "sparks@mnfdetective.com",
    description: "For general inquiries and case submissions",
  },
  {
    icon: Phone,
    title: "Hotline",
    value: "+1 (555) SPARKS",
    description: "Available 24/7 for urgent matters",
  },
  {
    icon: MapPin,
    title: "Headquarters",
    value: "Neo Tokyo, Sector 7",
    description: "Visit by appointment only",
  },
  {
    icon: Clock,
    title: "Response Time",
    value: "< 24 Hours",
    description: "We respond to all inquiries quickly",
  },
]

const inquiryTypes = [
  { id: "general", label: "General Inquiry" },
  { id: "case", label: "New Case Request" },
  { id: "matchmaking", label: "Matchmaking Services" },
  { id: "props", label: "Props Rental" },
  { id: "collaboration", label: "Collaboration" },
  { id: "press", label: "Press & Media" },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    inquiryType: "",
    subject: "",
    message: "",
    urgent: false,
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
            className="glass-card neon-border-blue rounded-2xl p-12 text-center max-w-lg mx-4"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-neon-blue/20 flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-neon-blue" />
            </div>
            <h2
              className="text-2xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Message Received!
            </h2>
            <p className="text-muted-foreground mb-6">
              Thank you for reaching out to the Sparks Detective Team. We will review your message and respond within 24 hours.
            </p>
            <div className="glass rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Your Reference Number</p>
              <p className="text-lg font-bold neon-text-blue" style={{ fontFamily: "var(--font-orbitron)" }}>
                MSG-{Date.now().toString(36).toUpperCase()}
              </p>
            </div>
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
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm text-neon-blue mb-6">
              <MessageSquare className="w-4 h-4" />
              Get In Touch
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              <span className="text-foreground">Contact </span>
              <span className="neon-text-blue">Sparks</span>
            </h1>
            <p className="text-lg text-muted-foreground" style={{ fontFamily: "var(--font-rajdhani)" }}>
              Have questions or need our services? Reach out to the team. We are here to help with all your detective and matchmaking needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-8 bg-deep-purple/50 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, i) => {
              const Icon = method.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-6 h-6 text-neon-blue mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-foreground">{method.title}</h3>
                  <p className="text-lg font-bold neon-text-blue" style={{ fontFamily: "var(--font-orbitron)" }}>
                    {method.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Office Hours */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>
                  Office Hours
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="text-foreground">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="text-foreground">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="text-foreground">Emergency Only</span>
                  </div>
                  <div className="pt-3 border-t border-border/50">
                    <span className="text-neon-pink">24/7 Hotline available for urgent cases</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>
                  Connect With Us
                </h3>
                <div className="flex gap-3">
                  {[
                    { icon: Twitter, label: "Twitter", color: "hover:text-blue-400" },
                    { icon: Instagram, label: "Instagram", color: "hover:text-pink-400" },
                    { icon: MessageCircle, label: "Discord", color: "hover:text-indigo-400" },
                  ].map((social) => {
                    const Icon = social.icon
                    return (
                      <button
                        key={social.label}
                        className={`w-12 h-12 glass rounded-lg flex items-center justify-center text-muted-foreground ${social.color} transition-colors`}
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* FAQ Teaser */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>
                  Common Questions
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="text-muted-foreground hover:text-neon-pink cursor-pointer transition-colors">
                    How long does an investigation take?
                  </li>
                  <li className="text-muted-foreground hover:text-neon-pink cursor-pointer transition-colors">
                    What are your matchmaking rates?
                  </li>
                  <li className="text-muted-foreground hover:text-neon-pink cursor-pointer transition-colors">
                    Is my information kept confidential?
                  </li>
                  <li className="text-muted-foreground hover:text-neon-pink cursor-pointer transition-colors">
                    Can I rent props for events?
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="lg:col-span-2 glass-card neon-border-blue rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-neon-blue" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
                    Send Us a Message
                  </h2>
                  <p className="text-sm text-muted-foreground">Fill out the form and we will get back to you</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Name & Email */}
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
                      className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-blue focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-blue focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Company & Inquiry Type */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Building className="w-4 h-4 inline mr-2" />
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-blue focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Inquiry Type
                    </label>
                    <select
                      required
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-blue focus:outline-none transition-all bg-transparent text-foreground"
                    >
                      <option value="" className="bg-background">Select type...</option>
                      {inquiryTypes.map((type) => (
                        <option key={type.id} value={type.id} className="bg-background">
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-blue focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground"
                    placeholder="Brief subject line"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Your Message
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-lg border border-border focus:neon-border-blue focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Urgent Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, urgent: !formData.urgent })}
                    className={`w-12 h-6 rounded-full transition-all ${
                      formData.urgent ? "bg-neon-pink" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        formData.urgent ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-foreground">Mark as urgent request</span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-neon-blue text-background font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you agree to our terms of service. This is a fictional entertainment service.
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
