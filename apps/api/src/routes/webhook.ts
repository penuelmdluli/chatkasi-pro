import { Router, Request, Response } from "express"
import { handleIncomingMessage } from "../services/watiService"
import { supabase } from "../lib/supabase"

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
  try {
    const { type, payload } = req.body

    if (type === "payment.succeeded") {
      const metadata = payload?.metadata
      console.log("Payment succeeded:", metadata)

      if (metadata?.business_id) {
        const planName = metadata.plan || "business"
        const now = new Date()
        const periodEnd = new Date(now)
        periodEnd.setMonth(periodEnd.getMonth() + 1)

        const { error } = await supabase
          .from("businesses")
          .update({
            plan_status: "active",
            plan_name: planName,
            plan_activated_at: now.toISOString(),
            plan_period_end: periodEnd.toISOString(),
            yoco_payment_id: payload?.id || null,
          })
          .eq("id", metadata.business_id)

        if (error) {
          console.error("Failed to activate subscription:", error)
          return res.status(500).json({ error: "Failed to activate subscription" })
        }

        console.log(`Subscription activated for business ${metadata.business_id}, plan: ${planName}`)
      } else {
        console.warn("Payment succeeded but no business_id in metadata")
      }
    }

    if (type === "payment.failed") {
      const metadata = payload?.metadata
      console.log("Payment failed:", metadata)

      if (metadata?.business_id) {
        await supabase
          .from("businesses")
          .update({ plan_status: "payment_failed" })
          .eq("id", metadata.business_id)
      }
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error("Yoco webhook error:", error)
    res.status(500).json({ error: "Webhook processing failed" })
  }
})
