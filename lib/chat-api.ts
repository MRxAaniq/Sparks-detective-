import { supabase } from "@/lib/supabase"
import {
  formatChatCode,
  generateChatCode,
  normalizeChatCodeInput,
  type ChatSession,
} from "@/lib/chat-session"

export interface ChatMessage {
  id: string
  session_id: string
  sender: "user" | "admin"
  body: string | null
  attachment_url: string | null
  attachment_type: string | null
  created_at: string
}

const MESSAGE_PAGE_SIZE = 50
const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const MAX_IMAGE_WIDTH = 1200
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

export async function createChatSession(
  displayName: string,
  mnfIgn: string,
): Promise<ChatSession> {
  const sessionKey = crypto.randomUUID()
  const chatCode = formatChatCode(sessionKey)

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert([
      {
        session_key: sessionKey,
        chat_code: chatCode,
        display_name: displayName.trim(),
        mnf_ign: mnfIgn.trim(),
        status: "open",
        last_message_preview: null,
        unread_by_admin: false,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data as ChatSession
}

export async function resumeChatSession(
  displayName: string,
  mnfIgn: string,
  chatCodeInput: string,
): Promise<ChatSession> {
  const chatCode = normalizeChatCodeInput(chatCodeInput)

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("chat_code", chatCode)
    .eq("display_name", displayName.trim())
    .eq("mnf_ign", mnfIgn.trim())
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error("No chat found. Check your name, IGN, and Chat ID.")
  return data as ChatSession
}

export async function fetchSessionByKey(sessionKey: string): Promise<ChatSession | null> {
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("session_key", sessionKey)
    .maybeSingle()

  if (error) throw error
  return (data as ChatSession) ?? null
}

export async function fetchAllChatSessions(): Promise<ChatSession[]> {
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .order("last_message_at", { ascending: false })

  if (error) throw error
  return (data as ChatSession[]) ?? []
}

export async function fetchMessages(
  sessionId: string,
  options?: { before?: string; limit?: number },
): Promise<ChatMessage[]> {
  const limit = options?.limit ?? MESSAGE_PAGE_SIZE

  let query = supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (options?.before) {
    query = query.lt("created_at", options.before)
  }

  const { data, error } = await query
  if (error) throw error
  return ((data as ChatMessage[]) ?? []).reverse()
}

export async function sendChatMessage(
  sessionId: string,
  sender: "user" | "admin",
  body: string | null,
  attachmentUrl?: string | null,
  attachmentType?: string | null,
): Promise<ChatMessage> {
  const preview =
    body?.trim() ||
    (attachmentUrl ? "[Image]" : "")

  const { data, error } = await supabase
    .from("chat_messages")
    .insert([
      {
        session_id: sessionId,
        sender,
        body: body?.trim() || null,
        attachment_url: attachmentUrl ?? null,
        attachment_type: attachmentType ?? null,
      },
    ])
    .select()
    .single()

  if (error) throw error

  const sessionUpdate: Record<string, unknown> = {
    last_message_at: new Date().toISOString(),
    last_message_preview: preview.slice(0, 120),
  }

  if (sender === "user") {
    sessionUpdate.unread_by_admin = true
  }

  await supabase.from("chat_sessions").update(sessionUpdate).eq("id", sessionId)

  return data as ChatMessage
}

export async function markSessionReadByAdmin(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from("chat_sessions")
    .update({ unread_by_admin: false })
    .eq("id", sessionId)

  if (error) throw error
}

export async function updateSessionStatus(
  sessionId: string,
  status: "open" | "closed",
): Promise<void> {
  const { error } = await supabase
    .from("chat_sessions")
    .update({ status })
    .eq("id", sessionId)

  if (error) throw error
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  const { error } = await supabase.from("chat_sessions").delete().eq("id", sessionId)
  if (error) throw error
}

async function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      const needsResize = width > MAX_IMAGE_WIDTH || file.size > MAX_IMAGE_BYTES

      if (!needsResize) {
        resolve(file)
        return
      }

      if (width > MAX_IMAGE_WIDTH) {
        height = Math.round((height * MAX_IMAGE_WIDTH) / width)
        width = MAX_IMAGE_WIDTH
      }

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not process image"))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not compress image"))
            return
          }
          if (blob.size > MAX_IMAGE_BYTES) {
            reject(new Error("Image is too large. Please use a smaller image (max 2 MB)."))
            return
          }
          resolve(blob)
        },
        "image/jpeg",
        0.85,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not load image"))
    }

    img.src = url
  })
}

export async function uploadChatImage(sessionId: string, file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Only JPEG, PNG, and WebP images are allowed.")
  }

  if (file.size > MAX_IMAGE_BYTES * 2) {
    throw new Error("Image is too large. Maximum size is 2 MB.")
  }

  const blob = await resizeImage(file)
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg"
  const path = `${sessionId}/${Date.now()}-${generateChatCode().replace("-", "")}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("chat-attachments")
    .upload(path, blob, {
      contentType: blob.type || file.type,
      upsert: false,
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from("chat-attachments").getPublicUrl(path)
  return data.publicUrl
}

export { MESSAGE_PAGE_SIZE }
