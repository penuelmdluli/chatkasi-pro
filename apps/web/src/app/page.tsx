"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

const PLANS = [
  { name: "Solo", price: 299, color: "#00E5FF", features: ["1 WhatsApp number", "AI auto-replies", "500 messages/month", "Appointment booking", "Basic analytics"] },
  { name: "Business", price: 699, color: "#FFD700", popular: true, features: ["3 WhatsApp numbers", "AI in all 11 SA languages", "5,000 messages/month", "Lead capture + CRM", "Advanced analytics", "Yoco payment links"] },
  { name: "Agency", price: 1499, color: "#FF00AA", features: ["Unlimited numbers", "White-label option", "Unlimited messages", "Full API access", "Priority support", "Custom AI training", "Reseller dashboard"] }
]

const STATS = [
  { value: "11", label: "SA Languages" },
  { value: "24/7", label: "Always On" },
  { value: "< 3s", label: "Response Time" },
  { value: "80%", label: "Leads Captured" }
]

const USE_CASES = [
  { icon: "💆", name: "Spas & Salons", desc: "Auto-book appointments, send reminders, upsell treatments" },
  { icon: "🏠", name: "Estate Agents", desc: "Qualify buyers, book viewings, send property info instantly" },
  { icon: "🦷", name: "Dental Practices", desc: "Appointment reminders, FAQ answers, patient intake forms" },
  { icon: "🍽️", name: "Restaurants", desc: "Take reservations, share menus, handle catering enquiries" },
  { icon: "🔧", name: "Contractors", desc: "Quote requests, job scheduling, follow-ups automated" },
  { icon: "📦", name: "E-commerce", desc: "Order tracking, returns, product questions — all automated" }
]

export default function LandingPage() {
  const [billingAnnual, setBillingAnnual] = useState(false)
  const [activeUseCase, setActiveUseCase] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveUseCase(p => (p + 1) % USE_CASES.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#080808] relative overflow-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,#FFD70010_0%,transparent_70%)] pointer-events-none" />

      {/* NAV */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <span className="font-black text-xl tracking-tight">Chat<span className="text-[#FFD700]">Kasi</span> Pro</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#use-cases" className="hover:text-white transition-colors">Who It's For</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Login</Link>
          <Link href="/signup" className="bg-[#FFD700] text-black text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#ffc800] transition-colors">
            Start Free →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 text-center px-6 pt-16 pb-24 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#FFD70011] border border-[#FFD70033] text-[#FFD700] text-xs px-4 py-2 rounded-full mb-8 tracking-widest">
          🇿🇦 BUILT FOR SOUTH AFRICA
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-none mb-6 tracking-tight">
          Your Business{" "}
          <span className="text-[#FFD700] glow-gold">Responds</span>
          <br />
          While You Sleep
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          ChatKasi Pro connects AI to your WhatsApp Business. Capture every lead, book every appointment, answer every question — automatically, in <strong className="text-white">all 11 South African languages</strong>.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/signup" className="w-full sm:w-auto bg-[#FFD700] text-black font-black px-8 py-4 rounded-xl text-lg hover:bg-[#ffc800] transition-all hover:scale-105 border-glow">
            Start Free — No Credit Card
          </Link>
          <a href="#demo" className="w-full sm:w-auto border border-gray-700 text-gray-300 px-8 py-4 rounded-xl text-lg hover:border-gray-500 transition-colors">
            Watch 2-min Demo →
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {STATS.map((s, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5">
              <div className="text-3xl font-black text-[#FFD700] mb-1">{s.value}</div>
              <div className="text-xs text-gray-500 tracking-widest uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* USE CASES */}
      <section id="use-cases" className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs text-[#FFD700] tracking-widest mb-3">WHO IT'S FOR</div>
          <h2 className="text-4xl font-black">Works For Any SA Business</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {USE_CASES.map((u, i) => (
            <div
              key={i}
              className={`bg-[#0d0d0d] border rounded-xl p-6 transition-all cursor-pointer ${
                activeUseCase === i
                  ? "border-[#FFD70055] bg-[#FFD70008]"
                  : "border-[#1a1a1a] hover:border-[#333]"
              }`}
              onClick={() => setActiveUseCase(i)}
            >
              <div className="text-3xl mb-3">{u.icon}</div>
              <div className="font-bold mb-2">{u.name}</div>
              <div className="text-sm text-gray-400 leading-relaxed">{u.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs text-[#FFD700] tracking-widest mb-3">PRICING</div>
          <h2 className="text-4xl font-black mb-4">Simple, Transparent Pricing</h2>
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm ${!billingAnnual ? "text-white" : "text-gray-500"}`}>Monthly</span>
            <button
              onClick={() => setBillingAnnual(!billingAnnual)}
              className={`w-12 h-6 rounded-full transition-colors ${billingAnnual ? "bg-[#FFD700]" : "bg-gray-700"}`}
            >
              <div className={`w-5 h-5 bg-black rounded-full transition-transform mx-0.5 ${billingAnnual ? "translate-x-6" : ""}`} />
            </button>
            <span className={`text-sm ${billingAnnual ? "text-white" : "text-gray-500"}`}>
              Annual <span className="text-[#00FF88] text-xs">Save 20%</span>
            </span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className={`relative bg-[#0d0d0d] rounded-2xl p-8 border transition-all ${
                plan.popular ? "border-[#FFD70066] scale-105" : "border-[#1a1a1a]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FFD700] text-black text-xs font-black px-4 py-1.5 rounded-full tracking-widest">
                  MOST POPULAR
                </div>
              )}
              <div className="text-xs tracking-widest mb-2" style={{ color: plan.color }}>{plan.name.toUpperCase()}</div>
              <div className="text-5xl font-black mb-1">
                R{billingAnnual ? Math.round(plan.price * 0.8) : plan.price}
              </div>
              <div className="text-sm text-gray-500 mb-6">per month</div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                    <span style={{ color: plan.color }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/signup?plan=${plan.name.toLowerCase()}`}
                className="block w-full text-center py-3 rounded-xl font-bold transition-all hover:scale-105"
                style={{
                  background: plan.popular ? "#FFD700" : "transparent",
                  color: plan.popular ? "#000" : plan.color,
                  border: plan.popular ? "none" : `1px solid ${plan.color}55`
                }}
              >
                Get Started →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4">
            Ready to Never Miss a Lead Again?
          </h2>
          <p className="text-gray-400 mb-8">Join SA businesses already automating their WhatsApp with AI.</p>
          <Link href="/signup" className="inline-block bg-[#FFD700] text-black font-black px-10 py-4 rounded-xl text-lg hover:bg-[#ffc800] transition-all hover:scale-105">
            Start Free Today — No Credit Card Needed
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#1a1a1a] px-6 py-8 text-center text-sm text-gray-600">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span>💬</span>
          <span className="font-black">ChatKasi Pro</span>
        </div>
        <p>© 2026 ChatKasi Pro. Built in 🇿🇦 South Africa.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-gray-400 transition-colors">Terms</a>
          <a href="mailto:support@chatkasipro.co.za" className="hover:text-gray-400 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  )
}
