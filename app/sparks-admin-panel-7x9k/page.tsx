"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Shield, Lock, Eye, EyeOff, Users, FileText, Heart, MessageSquare, 
  Package, Mail, TrendingUp, Clock, CheckCircle, AlertTriangle,
  Search, Filter, MoreHorizontal, Trash2, Edit, ArrowUpRight, Star,
  Gamepad2
} from "lucide-react"
import { supabase } from "@/lib/supabase"

// Hidden admin panel route: /sparks-admin-panel-7x9k

interface BaseSubmission {
  id: string
  created_at: string
  name?: string
  mnf_ign?: string
  status?: string
}

interface CaseSubmission extends BaseSubmission {
  case_type: string
  priority: string
  subject: string
  description: string
  is_confidential: boolean
}

interface MatchSubmission extends BaseSubmission {
  age: number
  gender: string
  seeking_gender: string
  traits: string[]
  looking_for: string
  about_you: string
}

interface RentalSubmission extends BaseSubmission {
  prop_ids: number[]
  duration: string
  additional_notes?: string
}

interface ContactSubmission extends BaseSubmission {
  inquiry_type: string
  subject: string
  message: string
  is_urgent: boolean
}

interface ConfessionSubmission extends BaseSubmission {
  content: string
  mood: string
  is_anonymous: boolean
  alias?: string
  hearts: number
  is_pinned: boolean
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [activeTab, setActiveTab] = useState<"cases" | "matches" | "rentals" | "confessions" | "contact">("cases")
  const [cases, setCases] = useState<CaseSubmission[]>([])
  const [matches, setMatches] = useState<MatchSubmission[]>([])
  const [rentals, setRentals] = useState<RentalSubmission[]>([])
  const [confessions, setConfessions] = useState<ConfessionSubmission[]>([])
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dataError, setDataError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    fetchAllData()
    const refreshInterval = window.setInterval(() => {
      fetchAllData()
    }, 15000)

    return () => window.clearInterval(refreshInterval)
  }, [isAuthenticated])

  const fetchAllData = async () => {
    setLoading(true)
    setDataError("")
    try {
      const [cRes, mRes, rRes, cfRes, ctRes] = await Promise.all([
        supabase.from('cases').select('*').order('created_at', { ascending: false }),
        supabase.from('matchmaking').select('*').order('created_at', { ascending: false }),
        supabase.from('prop_rentals').select('*').order('created_at', { ascending: false }),
        supabase.from('confessions').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      ])

      const errors = [cRes.error, mRes.error, rRes.error, cfRes.error, ctRes.error].filter(
        (error): error is NonNullable<typeof error> => Boolean(error)
      )
      if (errors.length > 0) {
        const message = errors.map((err) => err.message).join(" | ")
        throw new Error(message)
      }

      setCases(cRes.data || [])
      setMatches(mRes.data || [])
      setRentals(rRes.data || [])
      setConfessions(cfRes.data || [])
      setContacts(ctRes.data || [])
    } catch (err) {
      console.error("Error fetching admin data:", err)
      setDataError(err instanceof Error ? err.message : "Failed to load admin data.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setError("")
    
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'admin_password')
        .single()

      if (error) throw error

      if (password === data.value) {
        setIsAuthenticated(true)
      } else {
        setError("Invalid credentials. Access denied.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("System authentication failure.")
    } finally {
      setLoginLoading(false)
    }
  }

  const updateStatus = async (table: string, id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      fetchAllData() // Refresh
    } catch (err) {
      console.error(`Error updating status in ${table}:`, err)
    }
  }

  const togglePin = async (id: string, currentlyPinned: boolean) => {
    try {
      if (!currentlyPinned) {
        // Unpin all first
        await supabase.from('confessions').update({ is_pinned: false }).neq('id', 'placeholder')
      }
      
      const { error } = await supabase
        .from('confessions')
        .update({ is_pinned: !currentlyPinned })
        .eq('id', id)

      if (error) throw error
      fetchAllData()
    } catch (err) {
      console.error("Error toggling pin:", err)
    }
  }

  const deleteRecord = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return
    try {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      fetchAllData()
    } catch (err) {
      console.error(`Error deleting from ${table}:`, err)
    }
  }

  const getFilteredData = () => {
    let data: any[] = []
    if (activeTab === "cases") data = cases
    else if (activeTab === "matches") data = matches
    else if (activeTab === "rentals") data = rentals
    else if (activeTab === "confessions") data = confessions
    else if (activeTab === "contact") data = contacts

    return data.filter(item => {
      const matchesSearch = 
        (item.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.mnf_ign?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.content?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.subject?.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }

  const stats = [
    { label: "Total Cases", value: cases.length, icon: FileText, color: "pink" },
    { label: "Matches", value: matches.length, icon: Heart, color: "blue" },
    { label: "Confessions", value: confessions.length, icon: MessageSquare, color: "purple" },
    { label: "Pending", value: [...cases, ...matches, ...rentals, ...contacts].filter(i => i.status === "pending").length, icon: Clock, color: "yellow" },
  ]

  // Login Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card neon-border-pink rounded-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-xl bg-neon-pink/20 flex items-center justify-center mb-4 neon-border-pink">
              <Shield className="w-8 h-8 text-neon-pink" />
            </div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
              Admin Access
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sparks Detective Team - Control Panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none transition-all bg-transparent text-foreground"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center"
              >
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neon-pink text-background font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <Lock className="w-5 h-5" />
              Access Panel
            </button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-6">
            Unauthorized access attempts are logged.
          </p>
        </motion.div>
      </main>
    )
  }

  // Admin Dashboard
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neon-pink/20 flex items-center justify-center neon-border-pink">
                <Shield className="w-5 h-5 text-neon-pink" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
                  Admin Panel
                </h1>
                <p className="text-xs text-muted-foreground">MNF Sparks Detective Team</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchAllData()}
                className="px-4 py-2 glass rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 glass rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {dataError && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <strong className="block mb-1">Admin data could not load.</strong>
            <span>{dataError}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            const colorClass = stat.color === "pink" ? "text-neon-pink" : stat.color === "blue" ? "text-neon-blue" : stat.color === "purple" ? "text-purple-400" : "text-yellow-400"
            const bgClass = stat.color === "pink" ? "bg-neon-pink/20" : stat.color === "blue" ? "bg-neon-blue/20" : stat.color === "purple" ? "bg-purple-500/20" : "bg-yellow-500/20"
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-3xl font-bold ${colorClass} mt-1`} style={{ fontFamily: "var(--font-orbitron)" }}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${bgClass} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "cases", label: "Cases", icon: FileText },
            { id: "matches", label: "Matches", icon: Heart },
            { id: "rentals", label: "Prop Rentals", icon: Package },
            { id: "contact", label: "Contact", icon: Mail },
            { id: "confessions", label: "Confessions", icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-neon-pink text-background shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Submissions Content */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground uppercase tracking-widest" style={{ fontFamily: "var(--font-orbitron)" }}>
              {activeTab} Management
            </h2>
            
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 lg:flex-none lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none text-sm bg-transparent text-foreground placeholder:text-muted-foreground"
                  placeholder="Search records..."
                />
              </div>
              
              {/* Filter */}
              {activeTab !== "confessions" && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none text-sm bg-transparent text-foreground"
                >
                  <option value="all" className="bg-background">All Status</option>
                  <option value="pending" className="bg-background">Pending</option>
                  <option value="reviewed" className="bg-background">Reviewed</option>
                  <option value="resolved" className="bg-background">Resolved</option>
                </select>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-12 h-12 border-4 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Accessing secure database...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                    {activeTab !== "confessions" && (
                      <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Client Info</th>
                    )}
                    <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {activeTab === "cases" ? "Case Details" : 
                       activeTab === "matches" ? "Profile" : 
                       activeTab === "rentals" ? "Rental Details" : 
                       activeTab === "contact" ? "Message Info" : "Confession"}
                    </th>
                    {activeTab !== "confessions" ? (
                      <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                    ) : (
                      <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Pinned</th>
                    )}
                    <th className="text-right py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {getFilteredData().map((record) => (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-border/30 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">
                            {new Date(record.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {new Date(record.created_at).toLocaleTimeString()}
                          </div>
                        </td>
                        
                        {activeTab !== "confessions" && (
                          <td className="py-4 px-4">
                            <div className="text-sm font-bold text-foreground">{record.name}</div>
                            <div className="text-xs text-neon-pink font-mono mt-1">IGN: {record.mnf_ign}</div>
                          </td>
                        )}

                        <td className="py-4 px-4">
                          {activeTab === "cases" && (
                            <div>
                              <div className="text-sm font-bold text-foreground">{record.subject}</div>
                              <div className="text-xs text-muted-foreground whitespace-normal break-words max-w-none">{record.description}</div>
                              <div className="flex gap-2 mt-1">
                                <span className="px-1.5 py-0.5 bg-neon-pink/10 text-neon-pink text-[10px] rounded uppercase">{record.case_type}</span>
                                <span className={`px-1.5 py-0.5 text-[10px] rounded uppercase ${record.priority === 'urgent' ? 'bg-red-500/20 text-red-400' : 'bg-neon-blue/20 text-neon-blue'}`}>{record.priority}</span>
                              </div>
                            </div>
                          )}
                          {activeTab === "matches" && (
                            <div>
                              <div className="text-sm font-bold text-foreground">{record.age}y • {record.gender} seeking {record.seeking_gender}</div>
                              <div className="text-xs text-muted-foreground whitespace-normal break-words max-w-none">{record.about_you}</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {record.traits?.slice(0, 3).map((t: string) => (
                                  <span key={t} className="px-1.5 py-0.5 bg-neon-blue/10 text-neon-blue text-[10px] rounded">{t}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {activeTab === "rentals" && (
                            <div>
                              <div className="text-sm font-bold text-foreground">{record.duration} Duration</div>
                              <div className="text-xs text-muted-foreground whitespace-normal break-words max-w-none">Notes: {record.additional_notes || "None"}</div>
                              <div className="text-xs text-muted-foreground mt-1">Props: {record.prop_ids?.length || 0} items</div>
                            </div>
                          )}
                          {activeTab === "contact" && (
                            <div>
                              <div className="text-sm font-bold text-foreground">{record.subject}</div>
                              <div className="text-xs text-muted-foreground whitespace-normal break-words max-w-none">{record.message}</div>
                              <div className="flex gap-2 mt-1">
                                <span className="px-1.5 py-0.5 bg-neon-blue/10 text-neon-blue text-[10px] rounded uppercase">{record.inquiry_type}</span>
                                {record.is_urgent && <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] rounded uppercase font-bold">URGENT</span>}
                              </div>
                            </div>
                          )}
                          {activeTab === "confessions" && (
                            <div className="max-w-none">
                              <div className="text-sm text-foreground whitespace-normal break-words">{record.content}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-purple-400 font-mono uppercase">{record.mood}</span>
                                <span className="text-[10px] text-muted-foreground">• {record.hearts} Hearts</span>
                                {record.mnf_ign && <span className="text-[10px] text-neon-pink font-mono">• IGN: {record.mnf_ign}</span>}
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          {activeTab !== "confessions" ? (
                            <select
                              value={record.status}
                              onChange={(e) => updateStatus(
                                activeTab === 'cases' ? 'cases' : 
                                activeTab === 'matches' ? 'matchmaking' : 
                                activeTab === 'rentals' ? 'prop_rentals' : 'contact_messages', 
                                record.id, e.target.value
                              )}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-0 outline-none cursor-pointer transition-all ${
                                record.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                                record.status === "reviewed" ? "bg-blue-500/20 text-blue-400" :
                                "bg-green-500/20 text-green-400"
                              }`}
                            >
                              <option value="pending" className="bg-background">PENDING</option>
                              <option value="reviewed" className="bg-background">REVIEWED</option>
                              <option value="resolved" className="bg-background">RESOLVED</option>
                            </select>
                          ) : (
                            <button
                              onClick={() => togglePin(record.id, record.is_pinned)}
                              className={`p-2 rounded-lg transition-all ${
                                record.is_pinned 
                                  ? "bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
                                  : "glass text-muted-foreground hover:text-yellow-400"
                              }`}
                            >
                              <Star className={`w-4 h-4 ${record.is_pinned ? "fill-current" : ""}`} />
                            </button>
                          )}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => deleteRecord(
                                activeTab === 'cases' ? 'cases' : 
                                activeTab === 'matches' ? 'matchmaking' : 
                                activeTab === 'rentals' ? 'prop_rentals' : 
                                activeTab === 'contact' ? 'contact_messages' : 'confessions', 
                                record.id
                              )}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-muted-foreground hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>

          {!loading && getFilteredData().length === 0 && (
            <div className="text-center py-20">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">No encrypted records found matching your query.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
