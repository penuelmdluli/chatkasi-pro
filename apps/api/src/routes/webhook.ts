import { Router, Request, Response } from "express"
import { handleIncomingMessage } from "../services/watiService"

export const webhookRouter = Router()

webhookRouter.post("/wati", async (req: Request, res: Response) => {
  try {
    if (req.body.type === "message" && req.body.data?.message) {
      await handleIncomingMessage(req.body.data)
    }
    res.status(200).json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    res.status(500).json({ error: "Webhook processing failed" })
  }
})

webhookRouter.post("/yoco", async (req: Request, res: Response) => {
  const { type } = req.body
  if (type === "payment.succeeded") {
    console.log("💳 Payment succeeded:", req.body.payload?.metadata)
    // TODO: activate subscription via supabase
  }
  res.status(200).json({ received: true })
})
