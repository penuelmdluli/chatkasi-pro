import { Router } from "express"
import { generateAIReply } from "../services/claudeService"

export const aiRouter = Router()

aiRouter.post("/test-reply", async (req, res) => {
  try {
    const { message, businessContext, businessName } = req.body
    const reply = await generateAIReply({
      userMessage: message,
      businessName: businessName || "Test Business",
      businessContext: businessContext || "",
      conversationHistory: [],
      language: "english"
    })
    res.json({ reply })
  } catch (err) {
    res.status(500).json({ error: "AI generation failed" })
  }
})
