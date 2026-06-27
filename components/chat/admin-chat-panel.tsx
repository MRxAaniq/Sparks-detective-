"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  ImagePlus,
  Loader2,
  Send,
  Trash2,
  MessageCircle,
  Search,
} from "lucide-react"
import {
  deleteChatSession,
  fetchAllChatSessions,
  fetchMessages,
  markSessionReadByAdmin,
  sendChatMessage,
  updateSessionStatus,
  uploadChatImage,
  type ChatMessage,
} from "@/lib/chat-api"
import type { ChatSession } from "@/lib/chat-session"

const POLL_INTERVAL_MS = 4000
const SCROLL_NEAR_BOTTOM_PX = 80

export default function AdminChatPanel() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pollRef = useRef<number | null>(null)
  const lastMessageIdRef = useRef<string | null>(null)
  const initialScrollDoneRef = useRef(false)

  const selectedSession = sessions.find((s) => s.id === selectedId) ?? null

  const isNearBottom = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return true
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <
      SCROLL_NEAR_BOTTOM_PX
    )
  }, [])

  const scrollToBottom = useCallback((force = false) => {
    const container = messagesContainerRef.current
    if (!container) return
    if (!force && !isNearBottom()) return
    container.scrollTop = container.scrollHeight
  }, [isNearBottom])

  const loadSessions = useCallback(async () => {
    const data = await fetchAllChatSessions()
    setSessions(data)
    return data
  }, [])

  const loadMessages = useCallback(async (sessionId: string) => {
    const msgs = await fetchMessages(sessionId)
    setMessages(msgs)
  }, [])

  const refresh = useCallback(async () => {
    try {
      const data = await loadSessions()
      if (selectedId) {
        await loadMessages(selectedId)
        const session = data.find((s) => s.id === selectedId)
        if (session?.unread_by_admin) {
          await markSessionReadByAdmin(selectedId)
          setSessions((prev) =>
            prev.map((s) => (s.id === selectedId ? { ...s, unread_by_admin: false } : s)),
          )
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat data.")
    }
  }, [loadSessions, loadMessages, selectedId])

  useEffect(() => {
    setLoading(true)
    loadSessions()
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load sessions."))
      .finally(() => setLoading(false))
  }, [loadSessions])

  useEffect(() => {
    if (!selectedId) return
    initialScrollDoneRef.current = false
    lastMessageIdRef.current = null
    loadMessages(selectedId).catch(() => {})
    markSessionReadByAdmin(selectedId)
      .then(() => {
        setSessions((prev) =>
          prev.map((s) => (s.id === selectedId ? { ...s, unread_by_admin: false } : s)),
        )
      })
      .catch(() => {})
  }, [selectedId, loadMessages])

  useEffect(() => {
    if (!selectedId) return

    const latestId = messages[messages.length - 1]?.id ?? null
    const unchanged =
      latestId === lastMessageIdRef.current &&
      (messages.length > 0 || lastMessageIdRef.current === null)

    if (!initialScrollDoneRef.current) {
      requestAnimationFrame(() => scrollToBottom(true))
      initialScrollDoneRef.current = true
      lastMessageIdRef.current = latestId
      return
    }

    if (unchanged) return

    lastMessageIdRef.current = latestId
    requestAnimationFrame(() => scrollToBottom(false))
  }, [selectedId, messages, scrollToBottom])

  useEffect(() => {
    pollRef.current = window.setInterval(() => {
      if (!document.hidden) refresh().catch(() => {})
    }, POLL_INTERVAL_MS)

    const onVisibility = () => {
      if (!document.hidden) refresh().catch(() => {})
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [refresh])

  const handleSelect = (session: ChatSession) => {
    setSelectedId(session.id)
    setError("")
  }

  const handleSend = async () => {
    if (!selectedSession || !input.trim() || isSending) return
    const text = input.trim()
    setIsSending(true)
    setInput("")
    setError("")
    try {
      await sendChatMessage(selectedSession.id, "admin", text)
      await loadMessages(selectedSession.id)
      await loadSessions()
      requestAnimationFrame(() => scrollToBottom(true))
    } catch (err) {
      setInput(text)
      setError(err instanceof Error ? err.message : "Failed to send message.")
    } finally {
      setIsSending(false)
    }
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedSession) return
    e.target.value = ""
    setIsSending(true)
    setError("")
    try {
      const url = await uploadChatImage(selectedSession.id, file)
      await sendChatMessage(selectedSession.id, "admin", null, url, "image")
      await loadMessages(selectedSession.id)
      await loadSessions()
      requestAnimationFrame(() => scrollToBottom(true))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image.")
    } finally {
      setIsSending(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!selectedSession) return
    const newStatus = selectedSession.status === "open" ? "closed" : "open"
    try {
      await updateSessionStatus(selectedSession.id, newStatus)
      await loadSessions()
      setSessions((prev) =>
        prev.map((s) => (s.id === selectedSession.id ? { ...s, status: newStatus } : s)),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.")
    }
  }

  const handleDelete = async () => {
    if (!selectedSession) return
    if (!confirm("Delete this chat and all messages?")) return
    try {
      await deleteChatSession(selectedSession.id)
      setSelectedId(null)
      setMessages([])
      await loadSessions()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete chat.")
    }
  }

  const filteredSessions = sessions.filter((s) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      s.display_name.toLowerCase().includes(q) ||
      s.mnf_ign.toLowerCase().includes(q) ||
      s.chat_code.toLowerCase().includes(q) ||
      (s.last_message_preview?.toLowerCase().includes(q) ?? false)
    )
  })

  const unreadCount = sessions.filter((s) => s.unread_by_admin).length

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-neon-pink" />
          <h2
            className="text-xl font-bold text-foreground uppercase tracking-widest"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Live Chat
          </h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold bg-neon-pink text-background rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[280px_1fr] min-h-[520px]">
        {/* Session list */}
        <div className="border-b lg:border-b-0 lg:border-r border-border/50 flex flex-col">
          <div className="p-3 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-9 pr-3 py-2 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none text-sm bg-transparent text-foreground"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[480px] lg:max-h-none">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-6 h-6 text-neon-pink animate-spin mx-auto" />
              </div>
            ) : filteredSessions.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground text-center">No chat sessions yet.</p>
            ) : (
              filteredSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleSelect(session)}
                  className={`w-full text-left p-3 border-b border-border/30 hover:bg-white/5 transition-colors ${
                    selectedId === session.id ? "bg-neon-pink/10 border-l-2 border-l-neon-pink" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {session.display_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{session.mnf_ign}</p>
                    </div>
                    {session.unread_by_admin && (
                      <span className="w-2 h-2 rounded-full bg-neon-pink shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {session.last_message_preview || "No messages"}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-neon-pink">{session.chat_code}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {session.status === "closed" ? "Closed" : "Open"}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Thread */}
        <div className="flex flex-col min-h-[400px]">
          {!selectedSession ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm p-8">
              Select a chat to view the conversation
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 p-4 border-b border-border/50">
                <div>
                  <p className="font-bold text-foreground">{selectedSession.display_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedSession.mnf_ign} · {selectedSession.chat_code}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleStatus}
                    className="px-3 py-1.5 text-xs glass rounded-lg hover:text-foreground text-muted-foreground transition-colors"
                  >
                    {selectedSession.status === "open" ? "Close Chat" : "Reopen Chat"}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                        msg.sender === "admin"
                          ? "bg-neon-blue/20 text-foreground"
                          : "glass text-foreground"
                      }`}
                    >
                      {msg.sender === "user" && (
                        <p className="text-[10px] text-neon-pink font-bold uppercase tracking-wider mb-1">
                          {selectedSession.display_name}
                        </p>
                      )}
                      {msg.attachment_url && msg.attachment_type === "image" && (
                        <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={msg.attachment_url}
                            alt="Attachment"
                            className="rounded-lg max-w-full max-h-48 object-cover mb-1"
                          />
                        </a>
                      )}
                      {msg.body && <p className="whitespace-pre-wrap break-words">{msg.body}</p>}
                      <p className="text-[10px] text-muted-foreground mt-1 text-right">
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedSession.status === "closed" ? (
                <p className="text-center text-sm text-muted-foreground p-4 border-t border-border/50">
                  Chat is closed. Reopen to send messages.
                </p>
              ) : (
                <div className="flex items-end gap-2 p-4 border-t border-border/50">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSending}
                    className="p-2.5 glass rounded-lg text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    <ImagePlus className="w-5 h-5" />
                  </button>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    rows={1}
                    placeholder="Reply as Sparks Team..."
                    disabled={isSending}
                    className="flex-1 px-3 py-2 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none text-sm bg-transparent text-foreground resize-none min-h-[40px] max-h-24"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isSending || !input.trim()}
                    className="p-2.5 bg-neon-pink text-background rounded-lg hover:bg-neon-pink/90 transition-colors disabled:opacity-50"
                  >
                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
