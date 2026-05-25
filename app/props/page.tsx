"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Package, ShoppingCart, Search, Filter, Star, Clock, Zap, Eye, Camera, Radio, Briefcase, Glasses } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const categories = [
  { id: "all", label: "All Props", icon: Package },
  { id: "gadgets", label: "Spy Gadgets", icon: Eye },
  { id: "surveillance", label: "Surveillance", icon: Camera },
  { id: "communication", label: "Communication", icon: Radio },
  { id: "kits", label: "Roleplay Kits", icon: Briefcase },
  { id: "accessories", label: "Accessories", icon: Glasses },
]

const props = [
  {
    id: 1,
    name: "Night Vision Monocular",
    category: "gadgets",
    price: 25,
    period: "per day",
    rating: 4.9,
    reviews: 47,
    image: "/images/nova-agent.jpg",
    description: "Military-grade night vision for surveillance operations. Perfect for noir roleplay scenarios.",
    availability: "Available",
    featured: true,
  },
  {
    id: 2,
    name: "Encrypted Radio Set",
    category: "communication",
    price: 15,
    period: "per day",
    rating: 4.8,
    reviews: 32,
    image: "/images/cipher-agent.jpg",
    description: "Pair of encrypted walkie-talkies for secure team communication during operations.",
    availability: "Available",
    featured: true,
  },
  {
    id: 3,
    name: "Detective Starter Kit",
    category: "kits",
    price: 40,
    period: "per weekend",
    rating: 5.0,
    reviews: 89,
    image: "/images/phoenix-agent.jpg",
    description: "Complete kit with magnifying glass, evidence bags, notepad, and classic fedora.",
    availability: "Limited",
    featured: true,
  },
  {
    id: 4,
    name: "Hidden Camera Pen",
    category: "surveillance",
    price: 10,
    period: "per day",
    rating: 4.7,
    reviews: 28,
    image: "/images/sparky-hero.png",
    description: "Discreet pen with built-in camera for undercover documentation.",
    availability: "Available",
    featured: false,
  },
  {
    id: 5,
    name: "Cyber Noir Glasses",
    category: "accessories",
    price: 12,
    period: "per day",
    rating: 4.6,
    reviews: 54,
    image: "/images/nova-agent.jpg",
    description: "Stylish glasses with LED accents for the perfect cyber-noir aesthetic.",
    availability: "Available",
    featured: false,
  },
  {
    id: 6,
    name: "Voice Modulator",
    category: "gadgets",
    price: 20,
    period: "per day",
    rating: 4.8,
    reviews: 36,
    image: "/images/cipher-agent.jpg",
    description: "Change your voice in real-time for anonymous calls and roleplay scenarios.",
    availability: "Available",
    featured: false,
  },
  {
    id: 7,
    name: "Femme Fatale Kit",
    category: "kits",
    price: 55,
    period: "per weekend",
    rating: 4.9,
    reviews: 67,
    image: "/images/phoenix-agent.jpg",
    description: "Elegant accessories, prop jewelry, and spy gadgets for the mysterious operative.",
    availability: "Available",
    featured: true,
  },
  {
    id: 8,
    name: "Tracking Device Prop",
    category: "surveillance",
    price: 8,
    period: "per day",
    rating: 4.5,
    reviews: 19,
    image: "/images/sparky-hero.png",
    description: "Realistic-looking GPS tracker props for mystery scenarios (non-functional).",
    availability: "Available",
    featured: false,
  },
]

export default function PropsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<number[]>([])

  const filteredProps = props.filter((prop) => {
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
              <button className="relative flex items-center gap-2 px-4 py-2 glass neon-border-pink rounded-lg text-neon-pink">
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

      {/* Featured Props */}
      {selectedCategory === "all" && searchQuery === "" && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-orbitron)" }}>
              <Zap className="w-6 h-6 inline mr-2 text-neon-pink" />
              Featured Props
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {props.filter(p => p.featured).map((prop, index) => (
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
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
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
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold neon-text-pink">${prop.price}</span>
                        <span className="text-xs text-muted-foreground ml-1">{prop.period}</span>
                      </div>
                      <button
                        onClick={() => addToCart(prop.id)}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
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
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div>
                        <span className="text-xl font-bold neon-text-pink">${prop.price}</span>
                        <span className="text-xs text-muted-foreground ml-1">{prop.period}</span>
                      </div>
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
