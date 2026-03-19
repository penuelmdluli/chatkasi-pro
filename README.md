# ChatKasi Pro 🚀

> South Africa's #1 AI-Powered WhatsApp Business Automation Platform

## What It Does
- 🤖 AI auto-replies to WhatsApp messages in all 11 SA languages
- 📅 Books appointments automatically
- 🎯 Captures and qualifies leads
- 💳 Integrated payments via Yoco
- 📊 Real-time analytics dashboard

## Monorepo Structure
```
chatkasi-pro/
├── apps/
│   ├── web/          # Next.js 14 frontend (landing + dashboard)
│   └── api/          # Node.js API (webhooks, Claude AI, WATI)
├── packages/
│   └── config/       # Supabase schema + shared config
```

## Stack
- **Frontend**: Next.js 14 + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude API (Anthropic claude-sonnet-4-20250514)
- **WhatsApp**: WATI API
- **Payments**: Yoco
- **Hosting**: Vercel (web) + Railway (api)

## Setup

### 1. Clone & Install
```bash
git clone https://github.com/penuelmdluli/chatkasi-pro.git
cd chatkasi-pro
npm install
```

### 2. Environment Variables
```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
# Fill in your keys
```

### 3. Supabase
- Create a project at supabase.com
- Run `packages/config/supabase-schema.sql` in the SQL editor

### 4. Dev
```bash
npm run dev
# Web: http://localhost:3000
# API: http://localhost:4000
```

## Environment Variables Needed
| Variable | Where | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | web | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | web | Supabase anon key |
| `SUPABASE_SERVICE_KEY` | api | Supabase service role key |
| `ANTHROPIC_API_KEY` | api | Claude API key |
| `WATI_API_URL` | api | WATI server URL |
| `WATI_API_TOKEN` | api | WATI Bearer token |
| `YOCO_SECRET_KEY` | api | Yoco secret key |

## Pricing
- **Solo**: R299/month — 1 number, 500 msgs
- **Business**: R699/month — 3 numbers, 5,000 msgs
- **Agency**: R1,499/month — Unlimited

---
Built with ❤️ in 🇿🇦 South Africa
