"use client"
import { Suspense, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

function SignupForm() {
  const [businessName, setBusinessName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "solo"
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { business_name: businessName, phone },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (authData.user) {
      const { error: bizError } = await supabase.from("businesses").insert({
        id: authData.user.id,
        name: businessName,
        phone,
        owner_email: email,
        plan_name: plan,
        plan_status: "trial",
        ai_context: "",
        ai_language: "english",
        ai_tone: "friendly",
      })

      if (bizError) {
        console.error("Business creation error:", bizError)
      }
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <>
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <span className="text-2xl">💬</span>
          <span className="font-black text-xl tracking-tight">
            Chat<span className="text-[#FFD700]">Kasi</span> Pro
          </span>
        </Link>
        <h1 className="text-3xl font-black mb-2">Create Your Account</h1>
        <p className="text-gray-500 text-sm">
          Start automating your WhatsApp — plan:{" "}
          <span className="text-[#FFD700] font-bold capitalize">{plan}</span>
        </p>
      </div>

      <form onSubmit={handleSignup} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-8 space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs text-gray-500 tracking-widest mb-2">BUSINESS NAME</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD70055] transition-colors"
            placeholder="e.g. Kasi Cuts Barbershop"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 tracking-widest mb-2">EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD70055] transition-colors"
            placeholder="you@business.co.za"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 tracking-widest mb-2">WHATSAPP NUMBER</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD70055] transition-colors"
            placeholder="+27 81 234 5678"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 tracking-widest mb-2">PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD70055] transition-colors"
            placeholder="Min 6 characters"
            minLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FFD700] text-black font-black py-3 rounded-xl hover:bg-[#ffc800] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Start Free Trial"}
        </button>

        <p className="text-center text-xs text-gray-600">
          No credit card required. 14-day free trial.
        </p>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[#FFD700] hover:underline font-bold">
          Sign In
        </Link>
      </p>
    </>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,#FFD70010_0%,transparent_70%)] pointer-events-none" />
      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  )
}
