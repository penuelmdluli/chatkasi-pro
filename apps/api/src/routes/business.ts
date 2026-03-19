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
