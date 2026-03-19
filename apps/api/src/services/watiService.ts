import axios from "axios"
import { generateAIReply } from "./claudeService"
import { supabase } from "../lib/supabase"

const WATI_API = process.env.WATI_API_URL || ""
const WATI_TOKEN = process.env.WATI_API_TOKEN || ""

interface WATIMessage {
  waId: string
  text?: { body: string }
  type: string
  senderName?: string
}

function detectLanguage(text: string): string {
  const lower = text.toLowerCase()
  if (["sawubona","yebo","ngiyabonga","unjani"].some(w => lower.includes(w))) return "zulu"
  if (["dumela","ke ya","bona"].some(w => lower.includes(w))) return "sesotho"
  if (["hallo","dankie","asseblief"].some(w => lower.includes(w))) return "afrikaans"
  return "english"
}

export async function handleIncomingMessage(data: WATIMessage) {
  const { waId, text, senderName } = data
  if (!text?.body) return
  const userMessage = text.body
  console.log(`📱 from ${waId} (${senderName}): ${userMessage}`)

  const { data: business } = await supabase
    .from("businesses").select("*, wati_numbers!inner(*)").single()

  const { data: history } = await supabase
    .from("messages").select("*")
    .eq("contact_phone", waId)
    .order("created_at", { ascending: false }).limit(10)

  const aiReply = await generateAIReply({
    userMessage,
    businessName: business?.name || "This Business",
    businessContext: business?.ai_context || "",
    conversationHistory: (history || []).reverse(),
    language: detectLanguage(userMessage)
  })

  await supabase.from("messages").insert([
    { business_id: business?.id, contact_phone: waId, direction: "inbound", content: userMessage },
    { business_id: business?.id, contact_phone: waId, direction: "outbound", content: aiReply }
  ])

  await sendWATIMessage(waId, aiReply)
}

export async function sendWATIMessage(phone: string, message: string) {
  await axios.post(
    `${WATI_API}/api/v1/sendSessionMessage/${phone}`,
    { messageText: message },
    { headers: { Authorization: `Bearer ${WATI_TOKEN}` } }
  )
  console.log(`✅ Sent to ${phone}`)
}
