import { Router } from "express"
import { supabase } from "../lib/supabase"

export const businessRouter = Router()

businessRouter.get("/:id", async (req, res) => {
  const { data, error } = await supabase.from("businesses").select("*").eq("id", req.params.id).single()
  if (error) return res.status(404).json({ error: "Not found" })
  res.json(data)
})

businessRouter.put("/:id", async (req, res) => {
  const { data, error } = await supabase.from("businesses").update(req.body).eq("id", req.params.id).select().single()
  if (error) return res.status(400).json({ error })
  res.json(data)
})

// Get messages for a business
businessRouter.get("/:id/messages", async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 50
  const offset = parseInt(req.query.offset as string) || 0

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("business_id", req.params.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return res.status(400).json({ error: error.message })
  res.json(data || [])
})

// Get contacts for a business (aggregated from messages)
businessRouter.get("/:id/contacts", async (req, res) => {
  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("business_id", req.params.id)
    .order("created_at", { ascending: false })

  if (error) return res.status(400).json({ error: error.message })

  // Aggregate contacts from messages
  const contactMap = new Map<string, {
    contact_phone: string
    contact_name: string | null
    last_message: string
    last_message_at: string
    message_count: number
  }>()

  for (const msg of messages || []) {
    const phone = msg.contact_phone
    if (!contactMap.has(phone)) {
      contactMap.set(phone, {
        contact_phone: phone,
        contact_name: msg.contact_name || null,
        last_message: msg.content,
        last_message_at: msg.created_at,
        message_count: 1,
      })
    } else {
      contactMap.get(phone)!.message_count++
      // Update name if we find one
      if (msg.contact_name && !contactMap.get(phone)!.contact_name) {
        contactMap.get(phone)!.contact_name = msg.contact_name
      }
    }
  }

  const contacts = Array.from(contactMap.values()).sort(
    (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
  )

  res.json(contacts)
})
