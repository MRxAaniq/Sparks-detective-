"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  Copy,
  Check,
  ImagePlus,
  Loader2,
  MessageCircle,
  Send,
  ArrowLeft,
  X,
  Info,
} from "lucide-react"
import {
  createChatSession,
  fetchMessages,
  fetchSessionByKey,
  MESSAGE_PAGE_SIZE,
  resumeChatSession,
  sendChatMessage,
  uploadChatImage,
  type ChatMessage,
} from "@/lib/chat-api"
import {
  clearStoredSessionKey,
  dismissChatIdBanner,
  getStoredSessionKey,
  isChatIdBannerDismissed,
  setStoredChatCode,
  setStoredSessionKey,
  type ChatSession,
} from "@/lib/chat-session"

const POLL_INTERVAL_MS = 4000
const SCROLL_NEAR_BOTTOM_PX = 80

type ChatView = "loading" | "start" | "resume" | "chat"

interface ChatPanelProps {
  compact?: boolean
  onBack?: () => void
}

export default function ChatPanel({ compact = false, onBack }: ChatPanelProps) {
  const [view, setView] = useState<ChatView>("loading")
  const [session, setSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [error, setError] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)
  const [hasOlder, setHasOlder] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showChatIdBanner, setShowChatIdBanner] = useState(false)

  const [startForm, setStartForm] = useState({ name: "", mnf_ign: "" })
  const [resumeForm, setResumeForm] = useState({ name: "", mnf_ign: "", chatCode: "" })
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pollRef = useRef<number | null>(null)
  const isActiveRef = useRef(true)
  const lastMessageIdRef = useRef<string | null>(null)
  const initialScrollDoneRef = useRef(false)

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

  const applySession = useCallback((found: ChatSession, msgs: ChatMessage[]) => {
    setSession(found)
    setMessages(msgs)
    setHasOlder(msgs.length >= MESSAGE_PAGE_SIZE)
    setStoredSessionKey(found.session_key)
    setStoredChatCode(found.chat_code)
    setShowChatIdBanner(!isChatIdBannerDismissed())
    initialScrollDoneRef.current = false
    lastMessageIdRef.current = null
    setView("chat")
  }, [])

  const loadSession = useCallback(async (sessionKey: string) => {
    const found = await fetchSessionByKey(sessionKey)
    if (!found) {
      clearStoredSessionKey()
      setView("start")
      return
    }
    const msgs = await fetchMessages(found.id)
    applySession(found, msgs)
  }, [applySession])

  useEffect(() => {
    const key = getStoredSessionKey()
    if (key) {
      loadSession(key).catch(() => {
        clearStoredSessionKey()
        setView("start")
      })
    } else {
      setView("start")
    }
  }, [loadSession])

  useEffect(() => {
    if (view !== "chat") return

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
  }, [view, messages, scrollToBottom])

  const refreshMessages = useCallback(async () => {
    if (!session) return
    const msgs = await fetchMessages(session.id)
    setMessages(msgs)
    setHasOlder(msgs.length >= MESSAGE_PAGE_SIZE)
  }, [session])

  useEffect(() => {
    if (view !== "chat" || !session) return

    isActiveRef.current = true

    const poll = () => {
      if (!isActiveRef.current || document.hidden) return
      refreshMessages().catch(() => {})
    }

    pollRef.current = window.setInterval(poll, POLL_INTERVAL_MS)

    const onVisibility = () => {
      if (!document.hidden) poll()
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      isActiveRef.current = false
      if (pollRef.current) window.clearInterval(pollRef.current)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [view, session, refreshMessages])

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingForm(true)
    setError("")
    try {
      const newSession = await createChatSession(startForm.name, startForm.mnf_ign)
      applySession(newSession, [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start chat.")
    } finally {
      setIsSubmittingForm(false)
    }
  }

  const handleResumeChat = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingForm(true)
    setError("")
    try {
      const resumed = await resumeChatSession(
        resumeForm.name,
        resumeForm.mnf_ign,
        resumeForm.chatCode,
      )
      const msgs = await fetchMessages(resumed.id)
      applySession(resumed, msgs)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resume chat.")
    } finally {
      setIsSubmittingForm(false)
    }
  }

  const handleSend = async () => {
    if (!session || session.status === "closed") return
    const text = input.trim()
    if (!text || isSending) return

    setIsSending(true)
    setError("")
    setInput("")
    try {
      await sendChatMessage(session.id, "user", text)
      await refreshMessages()
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
    if (!file || !session || session.status === "closed") return
    e.target.value = ""

    setIsSending(true)
    setError("")
    try {
      const url = await uploadChatImage(session.id, file)
      await sendChatMessage(session.id, "user", null, url, "image")
      await refreshMessages()
      requestAnimationFrame(() => scrollToBottom(true))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image.")
    } finally {
      setIsSending(false)
    }
  }

  const handleLoadOlder = async () => {
    if (!session || isLoadingOlder || messages.length === 0) return
    setIsLoadingOlder(true)
    try {
      const older = await fetchMessages(session.id, {
        before: messages[0].created_at,
        limit: MESSAGE_PAGE_SIZE,
      })
      if (older.length < MESSAGE_PAGE_SIZE) setHasOlder(false)
      if (older.length > 0) {
        setMessages((prev) => [...older, ...prev])
      } else {
        setHasOlder(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load older messages.")
    } finally {
      setIsLoadingOlder(false)
    }
  }

  const copyChatId = async () => {
    if (!session) return
    await navigator.clipboard.writeText(session.chat_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDismissBanner = () => {
    dismissChatIdBanner()
    setShowChatIdBanner(false)
  }

  if (view === "loading") {
    return (
      <div className={`flex items-center justify-center ${compact ? "h-full min-h-[320px]" : "min-h-[400px]"}`}>
        <Loader2 className="w-8 h-8 text-neon-pink animate-spin" />
      </div>
    )
  }

  if (view === "start" || view === "resume") {
    return (
      <div className={`flex flex-col ${compact ? "h-full" : ""}`}>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-neon-pink/20 flex items-center justify-center mx-auto mb-3 neon-border-pink">
            <MessageCircle className="w-6 h-6 text-neon-pink" />
          </div>
          <h2
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            {view === "start" ? "Chat with the Team" : "Resume Your Chat"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {view === "start"
              ? "Start a live conversation with the Sparks team."
              : "Enter your details and Chat ID from another device."}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {view === "start" ? (
          <form onSubmit={handleStartChat} className="space-y-4 flex-1">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                Your Name
              </label>
              <input
                required
                value={startForm.name}
                onChange={(e) => setStartForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none text-sm bg-transparent text-foreground"
                placeholder="Display name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                MNF IGN
              </label>
              <input
                required
                value={startForm.mnf_ign}
                onChange={(e) => setStartForm((f) => ({ ...f, mnf_ign: e.target.value }))}
                className="w-full px-4 py-2.5 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none text-sm bg-transparent text-foreground"
                placeholder="In-game name"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              If you clear browser data, you&apos;ll need your Chat ID to come back to this conversation.
            </p>
            <button
              type="submit"
              disabled={isSubmittingForm}
              className="w-full py-3 bg-neon-pink text-background font-bold rounded-lg hover:bg-neon-pink/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {isSubmittingForm ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
              Start Chat
            </button>
            <button
              type="button"
              onClick={() => { setView("resume"); setError("") }}
              className="w-full py-2 text-sm text-neon-pink hover:underline"
            >
              Have a Chat ID? Resume here
            </button>
          </form>
        ) : (
          <form onSubmit={handleResumeChat} className="space-y-4 flex-1">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                Your Name
              </label>
              <input
                required
                value={resumeForm.name}
                onChange={(e) => setResumeForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none text-sm bg-transparent text-foreground"
                placeholder="Same name used before"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                MNF IGN
              </label>
              <input
                required
                value={resumeForm.mnf_ign}
                onChange={(e) => setResumeForm((f) => ({ ...f, mnf_ign: e.target.value }))}
                className="w-full px-4 py-2.5 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none text-sm bg-transparent text-foreground"
                placeholder="Same IGN used before"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                Chat ID
              </label>
              <input
                required
                value={resumeForm.chatCode}
                onChange={(e) => setResumeForm((f) => ({ ...f, chatCode: e.target.value }))}
                className="w-full px-4 py-2.5 glass rounded-lg border border-border focus:neon-border-pink focus:outline-none text-sm bg-transparent text-foreground uppercase tracking-widest"
                placeholder="XXXX-XXXX"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Use the same name, IGN, and Chat ID from your previous session.
            </p>
            <button
              type="submit"
              disabled={isSubmittingForm}
              className="w-full py-3 bg-neon-pink text-background font-bold rounded-lg hover:bg-neon-pink/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {isSubmittingForm ? <Loader2 className="w-4 h-4 animate-spin" /> : "Resume Chat"}
            </button>
            <button
              type="button"
              onClick={() => { setView("start"); setError("") }}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Start a new chat instead
            </button>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className={`flex min-h-0 flex-1 flex-col overflow-hidden ${compact ? "h-full" : "p-2 sm:p-4"}`}>
      <div
        className={`shrink-0 ${
          compact
            ? "mb-2 flex flex-col gap-2 border-b border-border/50 pb-2 sm:flex-row sm:items-center sm:justify-between"
            : "mb-2 flex items-center justify-between gap-2 rounded-xl border border-border/40 bg-white/[0.03] px-3 py-2 sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-2.5"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {!compact && (
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neon-pink/30 to-neon-blue/30 text-sm font-bold text-foreground neon-border-pink sm:h-10 sm:w-10"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {(session?.display_name?.[0] ?? "?").toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p
              className={`truncate font-bold text-foreground ${compact ? "text-base" : "text-base sm:text-lg"}`}
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {session?.display_name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {session?.mnf_ign}
              {!compact && session?.status === "open" && (
                <span className="ml-2 inline-flex items-center gap-1 text-neon-pink">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-pink" />
                  Online
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
          {session?.status === "closed" && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Closed</span>
          )}
          <button
            onClick={copyChatId}
            title="Copy Chat ID to resume on another device"
            className={`flex items-center gap-1.5 rounded-lg text-xs text-neon-pink transition-colors hover:bg-neon-pink/10 neon-border-pink ${
              compact ? "px-2 py-1" : "px-2.5 py-1.5 sm:px-3 sm:py-2"
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5 shrink-0" /> : <Copy className="h-3.5 w-3.5 shrink-0" />}
            <span className="shrink-0 font-medium">{copied ? "Copied!" : "Save ID"}</span>
            <span className="truncate font-mono tracking-widest">{session?.chat_code}</span>
          </button>
        </div>
      </div>

      {showChatIdBanner && session && (
        <div className="mb-2 shrink-0 rounded-lg border border-neon-blue/30 bg-neon-blue/10 px-2.5 py-2 text-[11px] text-foreground sm:text-xs">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-neon-blue shrink-0 mt-0.5" />
            <p className="flex-1">
              Save your Chat ID <strong className="text-neon-pink font-mono">{session.chat_code}</strong> to
              resume this conversation if you clear browser data or switch devices.
            </p>
            <button
              onClick={handleDismissBanner}
              className="text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300 shrink-0">
          {error}
        </div>
      )}

      <div
        ref={messagesContainerRef}
        className={`min-h-0 flex-1 basis-0 overflow-y-auto overscroll-contain space-y-3 sm:space-y-4 ${
          compact
            ? "min-h-[180px] pr-1"
            : "rounded-xl border border-border/30 bg-black/25 px-3 py-3 sm:rounded-2xl sm:px-4 sm:py-4"
        }`}
      >
        {hasOlder && (
          <button
            onClick={handleLoadOlder}
            disabled={isLoadingOlder}
            className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLoadingOlder ? "Loading..." : "Load older messages"}
          </button>
        )}

        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No messages yet. Say hello to the team!
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-2xl text-sm ${
                compact ? "max-w-[80%] px-3 py-2" : "max-w-[75%] sm:max-w-[65%] px-4 py-3"
              } ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-neon-pink/25 to-neon-pink/10 text-foreground neon-border-pink shadow-[0_4px_20px_rgba(236,72,153,0.15)]"
                  : "glass text-foreground border border-neon-blue/20 shadow-[0_4px_20px_rgba(59,130,246,0.08)]"
              }`}
            >
              {msg.sender === "admin" && (
                <p className="text-[10px] text-neon-blue font-bold uppercase tracking-wider mb-1.5 sm:text-xs">
                  Sparks Team
                </p>
              )}
              {msg.attachment_url && msg.attachment_type === "image" && (
                <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={msg.attachment_url}
                    alt="Shared image"
                    className={`mb-1.5 rounded-xl object-contain ${
                      compact ? "max-h-28 max-w-full" : "max-h-36 max-w-full sm:max-h-40"
                    }`}
                  />
                </a>
              )}
              {msg.body && <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.body}</p>}
              <p className="text-[10px] text-muted-foreground mt-2 text-right opacity-80">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {session?.status === "closed" ? (
        <p className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50 shrink-0">
          This chat has been closed by the team.
        </p>
      ) : (
        <div
          className={`flex shrink-0 items-end gap-2 ${
            compact
              ? "border-t border-border/50 bg-background pt-2"
              : "mt-2 rounded-xl border border-border/40 bg-white/[0.03] p-2 sm:mt-2 sm:rounded-2xl sm:p-2.5"
          }`}
        >
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl glass text-muted-foreground transition-colors hover:text-neon-pink disabled:opacity-50"
            title="Send image"
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
            placeholder="Type a message..."
            disabled={isSending}
            className="min-h-[44px] max-h-28 flex-1 resize-none rounded-xl border border-border/50 bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:neon-border-pink focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neon-pink text-background shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all hover:bg-neon-pink/90 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      )}
    </div>
  )
}
