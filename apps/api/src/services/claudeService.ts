import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface ReplyParams {
  userMessage: string
  businessName: string
  businessContext: string
  conversationHistory: Array<{ direction: string; content: string }>
  language: string
}

export async function generateAIReply(params: ReplyParams): Promise<string> {
  const { userMessage, businessName, businessContext, conversationHistory, language } = params

  const systemPrompt = `You are a friendly WhatsApp business assistant for ${businessName}.

BUSINESS INFO: ${businessContext}

LANGUAGE: Respond in ${language}. Match the customer's language.

RULES:
- Keep replies SHORT (under 100 words) — this is WhatsApp
- Collect name, date, service for bookings
- Use 1-2 emojis max
- End with a clear next step`

  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory.map(m => ({
      role: m.direction === "inbound" ? "user" as const : "assistant" as const,
      content: m.content
    })),
    { role: "user", content: userMessage }
  ]

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    system: systemPrompt,
    messages
  })

  return response.content[0].type === "text"
    ? response.content[0].text
    : "Thanks for your message! We'll get back to you shortly. 😊"
}
