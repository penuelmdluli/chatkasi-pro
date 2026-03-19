import { Router } from "express"
import { supabase } from "../lib/supabase"

export const analyticsRouter = Router()

analyticsRouter.get("/:businessId", async (req, res) => {
  const { data: messages } = await supabase
    .from("messages").select("*")
    .eq("business_id", req.params.businessId)
    .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  const total = messages?.length || 0
  const inbound = messages?.filter(m => m.direction === "inbound").length || 0
  const outbound = messages?.filter(m => m.direction === "outbound").length || 0
  res.json({ total, inbound, outbound, autoReplyRate: inbound > 0 ? Math.round((outbound / inbound) * 100) : 0 })
})
