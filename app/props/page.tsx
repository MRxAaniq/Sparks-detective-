"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Package, ShoppingCart, Search, Filter, Star, Clock, Zap, Eye, Camera, Radio, Briefcase, Glasses, User, Mail, Gamepad2, X, Send, CheckCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase"

const categories = [
  { id: "gadgets", label: "Spy Gadgets", icon: Eye },
  { id: "surveillance", label: "Surveillance", icon: Camera },
  { id: "communication", label: "Communication", icon: Radio },
  { id: "kits", label: "Roleplay Kits", icon: Briefcase },
  { id: "accessories", label: "Accessories", icon: Glasses },
]

const propsList = [
  {
    id: 1,
    name: "Farm House",
    category: "kits",
    rating: 4.8,
    reviews: 12,
    image: "/images/farm.webp",
    description: "A secluded farm location perfect for undercover operations or quiet retreats.",
    availability: "Available",
    featured: true,
  },
  {
    id: 2,
    name: "Private Jet",
    category: "gadgets",
    rating: 5.0,
    reviews: 5,
    image: "/images/jet.webp",
    description: "High-speed transport for elite agents. Equipped with radar-jamming technology.",
    availability: "Available",
    featured: true,
  },
  {
    id: 3,
    name: "The Gloryhole",
    category: "kits",
    rating: 4.2,
    reviews: 24,
    image: "/images/gh.webp",
    description: "A mysterious underground location for high-stakes meetings and secret handoffs.",
    availability: "Available",
    featured: true,
  },
  {
    id: 4,
    name: "2 Bedroom Cyber House",
    category: "kits",
    rating: 4.9,
    reviews: 31,
    image: "/images/2bh.webp",
    description: "Fully furnished 2-bedroom safehouse with advanced security systems.",
    availability: "Available",
    featured: true,
  },
]

export default function PropsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<number[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    mnf_ign: "",
    duration: "1 day",
    additional_notes: "",
  })

  const filteredProps = propsList.filter((prop) => {
    const matchesCategory = selectedCategory === "all" || prop.category === selectedCategory
    const matchesSearch = prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prop.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (id: number) => {
    if (!cart.includes(id)) {
      setCart([...cart, id])
    }
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter(i => i !== id))
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const { error } = await supabase
        .from('prop_rentals')
        .insert([{
          name: formData.name,
          mnf_ign: formData.mnf_ign,
          prop_ids: cart,
          duration: formData.duration,
          additional_notes: formData.additional_notes,
          status: 'pending'
        }])

      if (error) throw error

      setIsSubmitted(true)
      setCart([])
      setTimeout(() => {
        setIsSubmitted(false)
        setShowCheckout(false)
        setFormData({ name: "", mnf_ign: "", duration: "1 day", additional_notes: "" })
      }, 3000)
    } catch (err: any) {
      console.error("Rental error:", err)
      setSubmitError(err.message || "Failed to submit rental request.")
    } finally {
      setIsSubmitting(false)
    }
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
              <Package className="w-4 h-4" />
              Props & Gadgets Rental
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              <span className="text-foreground">Spy </span>
              <span className="neon-text-pink">Props</span>
            </h1>
            <p className="text-lg text-muted-foreground" style={{ fontFamily: "var(--font-rajdhani)" }}>
              Rent spy gadgets, roleplay kits, and accessories for your next investigation, event, or creative project.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Note */}
      <section className="pb-6">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-2xl border border-neon-pink/30 px-5 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-neon-pink">Hourly pricing</p>
              <p className="text-sm text-muted-foreground">
                2 Bedroom Cyber House: $10k per hour. All other props: $15k per hour.
              </p>
            </div>
            <div className="text-xs text-muted-foreground sm:text-right">
              Prices are shown in USD and billed per hour.
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="py-6 bg-deep-purple/50 border-y border-border/50 sticky top-16 lg:top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground placeholder:text-muted-foreground"
                placeholder="Search props..."
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? "bg-neon-pink text-background"
                        : "glass border border-border text-muted-foreground hover:text-foreground hover:border-neon-pink/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                )
              })}
            </div>

            {/* Cart indicator */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => cart.length > 0 && setShowCheckout(true)}
                className={`relative flex items-center gap-2 px-4 py-2 glass rounded-lg transition-all ${
                  cart.length > 0 ? "neon-border-pink text-neon-pink cursor-pointer" : "text-muted-foreground cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">{cart.length}</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-pink text-background text-xs rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setShowCheckout(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-card neon-border-pink rounded-2xl overflow-hidden shadow-2xl"
            >
              {isSubmitted ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>
                    Rental Request Sent!
                  </h2>
                  <p className="text-muted-foreground">
                    Our team will contact you soon in game using the MNF Club in-game name you provided. Please make sure it is correct.
                  </p>
                </div>
              ) : (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neon-pink/20 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-neon-pink" />
                      </div>
                      <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
                        Rental Checkout
                      </h2>
                    </div>
                    <button 
                      onClick={() => setShowCheckout(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-medium text-foreground mb-3">Selected Props:</p>
                    <div className="flex flex-wrap gap-2">
                      {cart.map(id => {
                        const prop = propsList.find(p => p.id === id)
                        return (
                          <span key={id} className="px-3 py-1 bg-neon-pink/10 border border-neon-pink/30 rounded-full text-xs text-neon-pink">
                            {prop?.name}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none text-sm bg-transparent text-foreground"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">MNF Club In-Game Name</label>
                        <div className="relative">
                          <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            required
                            value={formData.mnf_ign}
                            onChange={(e) => setFormData({ ...formData, mnf_ign: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none text-sm bg-transparent text-foreground"
                            placeholder="Your MNF IGN"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Rental Duration</label>
                      <select
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-4 py-2 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none text-sm bg-transparent text-foreground"
                      >
                        <option value="1 day" className="bg-background">1 Day</option>
                        <option value="3 days" className="bg-background">3 Days</option>
                        <option value="1 week" className="bg-background">1 Week</option>
                        <option value="custom" className="bg-background">Custom (Contact Team)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Additional Notes</label>
                      <textarea
                        rows={3}
                        value={formData.additional_notes}
                        onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                        className="w-full px-4 py-2 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none text-sm bg-transparent text-foreground resize-none"
                        placeholder="Any special requests or instructions..."
                      />
                    </div>

                    {submitError && (
                      <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
                        <p className="text-sm text-red-400">{submitError}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neon-pink text-background font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Rental Request
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Featured Props */}
      {selectedCategory === "all" && searchQuery === "" && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-orbitron)" }}>
              <Zap className="w-6 h-6 inline mr-2 text-neon-pink" />
              Featured Props
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {propsList.filter(p => p.featured).map((prop, index) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card neon-border-pink rounded-xl overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={prop.image}
                      alt={prop.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2 py-1 bg-neon-pink text-background text-xs font-bold rounded">
                      FEATURED
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1">{prop.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-foreground">{prop.rating}</span>
                      <span className="text-xs text-muted-foreground">({prop.reviews})</span>
                    </div>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => cart.includes(prop.id) ? removeFromCart(prop.id) : addToCart(prop.id)}
                        className={`p-2 rounded-lg transition-all ${
                          cart.includes(prop.id)
                            ? "bg-green-500 text-white"
                            : "bg-neon-pink/20 text-neon-pink hover:bg-neon-pink hover:text-background"
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Props Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
              {selectedCategory === "all" ? "All Props" : categories.find(c => c.id === selectedCategory)?.label}
            </h2>
            <span className="text-sm text-muted-foreground">{filteredProps.length} items</span>
          </div>

          {filteredProps.length > 0 ? (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProps.map((prop, index) => (
                <motion.div
                  key={prop.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-xl overflow-hidden group hover:neon-border-pink transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={prop.image}
                      alt={prop.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
                    <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded ${
                      prop.availability === "Available" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {prop.availability}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-neon-pink uppercase tracking-wider">
                      {categories.find(c => c.id === prop.category)?.label}
                    </span>
                    <h3 className="font-bold text-foreground mt-1 mb-2">{prop.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{prop.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-foreground">{prop.rating}</span>
                      <span className="text-xs text-muted-foreground">({prop.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center justify-end pt-3 border-t border-border/50">
                      <button
                        onClick={() => cart.includes(prop.id) ? removeFromCart(prop.id) : addToCart(prop.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          cart.includes(prop.id)
                            ? "bg-green-500 text-white"
                            : "bg-neon-pink/20 text-neon-pink hover:bg-neon-pink hover:text-background"
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {cart.includes(prop.id) ? "Added" : "Add"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No props found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Rental Info */}
      <section className="py-16 bg-deep-purple">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Flexible Rentals", desc: "Daily, weekend, or weekly rental options available." },
              { icon: Package, title: "Free Delivery", desc: "Free delivery for orders over $50 within city limits." },
              { icon: Filter, title: "Quality Props", desc: "All props are professionally maintained and sanitized." },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-xl bg-neon-pink/20 flex items-center justify-center mb-4 neon-border-pink">
                    <Icon className="w-8 h-8 text-neon-pink" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-orbitron)" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
