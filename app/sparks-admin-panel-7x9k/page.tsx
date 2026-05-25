"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Shield, Lock, Eye, EyeOff, Users, FileText, Heart, MessageSquare, 
  Package, Mail, TrendingUp, Clock, CheckCircle, AlertTriangle,
  Search, Filter, MoreHorizontal, Trash2, Edit, ArrowUpRight
} from "lucide-react"

// This is a hidden admin panel accessible only via direct route
// The route is: /sparks-admin-panel-7x9k
// This route is not linked anywhere in the navigation

const ADMIN_PASSWORD = "sparks2024admin" // In production, use proper auth

interface Submission {
  id: string
  type: "case" | "match" | "confession" | "contact"
  name: string
  email: string
  subject: string
  status: "pending" | "reviewed" | "resolved"
  date: string
  priority?: "standard" | "priority" | "urgent"
}

const mockSubmissions: Submission[] = [
  { id: "MNF-2847", type: "case", name: "Agent X", email: "agentx@mail.com", subject: "Background Investigation", status: "pending", date: "2024-01-15", priority: "urgent" },
  { id: "MNF-2846", type: "match", name: "Sarah K.", email: "sarah@mail.com", subject: "Matchmaking Request", status: "reviewed", date: "2024-01-14", priority: "standard" },
  { id: "MNF-2845", type: "case", name: "John D.", email: "john@mail.com", subject: "Relationship Analysis", status: "resolved", date: "2024-01-13", priority: "priority" },
  { id: "CNF-1234", type: "confession", name: "Anonymous", email: "-", subject: "Confession Post", status: "pending", date: "2024-01-15" },
  { id: "MSG-5678", type: "contact", name: "Emily R.", email: "emily@company.com", subject: "Collaboration Request", status: "pending", date: "2024-01-15" },
  { id: "MNF-2844", type: "case", name: "Mike T.", email: "mike@mail.com", subject: "Mystery Solving", status: "reviewed", date: "2024-01-12", priority: "standard" },
  { id: "MNF-2843", type: "match", name: "Lisa P.", email: "lisa@mail.com", subject: "Long-term Match", status: "resolved", date: "2024-01-11", priority: "priority" },
]

const stats = [
  { label: "Total Cases", value: "127", change: "+12%", icon: FileText, color: "pink" },
  { label: "Active Matches", value: "89", change: "+8%", icon: Heart, color: "blue" },
  { label: "Confessions", value: "342", change: "+24%", icon: MessageSquare, color: "purple" },
  { label: "Pending", value: "23", change: "-5%", icon: Clock, color: "yellow" },
]

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [submissions, setSubmissions] = useState(mockSubmissions)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Invalid credentials. Access denied.")
    }
  }

  const updateStatus = (id: string, newStatus: "pending" | "reviewed" | "resolved") => {
    setSubmissions(submissions.map(s => 
      s.id === id ? { ...s, status: newStatus } : s
    ))
  }

  const deleteSubmission = (id: string) => {
    setSubmissions(submissions.filter(s => s.id !== id))
  }

  const filteredSubmissions = submissions.filter(s => {
    const matchesFilter = filter === "all" || s.type === filter || s.status === filter
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

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
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 glass rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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
                <div className="flex items-center gap-1 mt-3">
                  <TrendingUp className={`w-4 h-4 ${stat.change.startsWith("+") ? "text-green-400" : "text-red-400"}`} />
                  <span className={`text-sm ${stat.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Submissions Table */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
              Submissions
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
                  placeholder="Search..."
                />
              </div>
              
              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none text-sm bg-transparent text-foreground"
              >
                <option value="all" className="bg-background">All Types</option>
                <option value="case" className="bg-background">Cases</option>
                <option value="match" className="bg-background">Matches</option>
                <option value="confession" className="bg-background">Confessions</option>
                <option value="contact" className="bg-background">Contact</option>
                <option value="pending" className="bg-background">Pending</option>
                <option value="reviewed" className="bg-background">Reviewed</option>
                <option value="resolved" className="bg-background">Resolved</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredSubmissions.map((submission) => (
                    <motion.tr
                      key={submission.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-border/30 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-neon-pink">{submission.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                          submission.type === "case" ? "bg-neon-pink/20 text-neon-pink" :
                          submission.type === "match" ? "bg-neon-blue/20 text-neon-blue" :
                          submission.type === "confession" ? "bg-purple-500/20 text-purple-400" :
                          "bg-green-500/20 text-green-400"
                        }`}>
                          {submission.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">{submission.name}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{submission.email}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell truncate max-w-[200px]">{submission.subject}</td>
                      <td className="py-3 px-4">
                        <select
                          value={submission.status}
                          onChange={(e) => updateStatus(submission.id, e.target.value as typeof submission.status)}
                          className={`px-2 py-1 rounded text-xs font-medium border-0 outline-none cursor-pointer ${
                            submission.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                            submission.status === "reviewed" ? "bg-blue-500/20 text-blue-400" :
                            "bg-green-500/20 text-green-400"
                          }`}
                        >
                          <option value="pending" className="bg-background">Pending</option>
                          <option value="reviewed" className="bg-background">Reviewed</option>
                          <option value="resolved" className="bg-background">Resolved</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">{submission.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 hover:bg-white/10 rounded transition-colors text-muted-foreground hover:text-foreground">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-white/10 rounded transition-colors text-muted-foreground hover:text-foreground">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteSubmission(submission.id)}
                            className="p-1.5 hover:bg-red-500/20 rounded transition-colors text-muted-foreground hover:text-red-400"
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
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No submissions found.</p>
            </div>
          )}

          {/* Pagination placeholder */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 glass rounded text-sm text-muted-foreground hover:text-foreground transition-colors">
                Previous
              </button>
              <button className="px-3 py-1.5 bg-neon-pink text-background rounded text-sm font-medium">
                1
              </button>
              <button className="px-3 py-1.5 glass rounded text-sm text-muted-foreground hover:text-foreground transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
