import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.WEB_URL || "http://localhost:3000", credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/health", (_, res) => res.json({ status: "ok", service: "ChatKasi Pro API", version: "1.0.0" }))

import { webhookRouter } from "./routes/webhook"
import { aiRouter } from "./routes/ai"
import { businessRouter } from "./routes/business"
import { analyticsRouter } from "./routes/analytics"

app.use("/webhook", webhookRouter)
app.use("/api/ai", aiRouter)
app.use("/api/business", businessRouter)
app.use("/api/analytics", analyticsRouter)

app.listen(PORT, () => console.log(`🚀 ChatKasi Pro API on port ${PORT}`))
export default app
