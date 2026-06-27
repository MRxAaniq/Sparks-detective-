const STORAGE_KEY = "sparks_chat_session_key"
const CHAT_CODE_KEY = "sparks_chat_code"
const BANNER_DISMISSED_KEY = "sparks_chat_id_banner_dismissed"

export interface ChatSession {
  id: string
  session_key: string
  chat_code: string
  display_name: string
  mnf_ign: string
  status: "open" | "closed"
  last_message_at: string
  last_message_preview: string | null
  unread_by_admin: boolean
  created_at: string
}

export function getStoredSessionKey(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_KEY)
}

export function setStoredSessionKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key)
}

export function setStoredChatCode(code: string): void {
  localStorage.setItem(CHAT_CODE_KEY, code)
}

export function getStoredChatCode(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(CHAT_CODE_KEY)
}

export function clearStoredSessionKey(): void {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(CHAT_CODE_KEY)
}

export function isChatIdBannerDismissed(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(BANNER_DISMISSED_KEY) === "1"
}

export function dismissChatIdBanner(): void {
  localStorage.setItem(BANNER_DISMISSED_KEY, "1")
}

export function formatChatCode(sessionKey: string): string {
  const hex = sessionKey.replace(/-/g, "").slice(0, 8).toUpperCase()
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}`
}

export function normalizeChatCodeInput(input: string): string {
  const cleaned = input.replace(/[^a-fA-F0-9]/g, "").toUpperCase()
  if (cleaned.length !== 8) return input.trim().toUpperCase()
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`
}

export function generateChatCode(): string {
  const uuid = crypto.randomUUID()
  return formatChatCode(uuid)
}
