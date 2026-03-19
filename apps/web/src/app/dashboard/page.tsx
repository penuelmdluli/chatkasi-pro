"use client"
import { useState } from "react"
import Link from "next/link"

const STATS = [
  { label: "Messages This Month", value: "1,247", change: "+23%", icon: "💬", color: "#FFD700" },
  { label: "AI Auto-Replied", value: "1,189", change: "95.3%", icon: "🤖", color: "#00FF88" },
  { label: "Leads Captured", value: "89", change: "+12", icon: "🎯", color: "#00E5FF" },
  { label: "Appointments Booked", value: "34", change: "+8", icon: "📅", color: "#FF00AA" }
]

const MESSAGES = [
  { name: "Nomsa Dlamini", preview: "Hi, I want to book a massage for Saturday", time: "2 min ago", unread: true },
  { name: "Johan Pretorius", preview: "Dankie vir die inligting!", time: "15 min ago", unread: true },
  { name: "Thabo Nkosi", preview: "What time do you close today?", time: "1 hr ago", unread: false },
  { name: "Fatima Patel", preview: "Can I get a quote for the full package?", time: "2 hr ago", unread: false },
  { name: "Lerato Mokoena", preview: "Dumela, ke batlile thuso", time: "3 hr ago", unread: false }
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", icon: "⚡", label: "Overview" },
    { id: "conversations", icon: "💬", label: "Conversations" },
    { id: "contacts", icon: "👥", label: "Contacts" },
    { id: "appointments", icon: "📅", label: "Appointments" },
    { id: "analytics", icon: "📊", label: "Analytics" },
    { id: "ai-config", icon: "🤖", label: "AI Config" },
    { id: "settings", icon: "⚙️", label: "Settings" }
  ]

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <aside className="w-64 border-r border-[#1a1a1a] p-6 flex flex-col gap-1 fixed h-full">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xl">💬</span>
          <span className="font-black text-lg">Chat<span className="text-[#FFD700]">Kasi</span></span>
        </div>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-left w-full ${
              activeTab === tab.id ? "bg-[#FFD70011] text-[#FFD700] border border-[#FFD70033]" : "text-gray-500 hover:text-gray-300 hover:bg-[#111]"
            }`}>
            <span>{tab.icon}</span><span>{tab.label}</span>
          </button>
        ))}
        <div className="mt-auto">
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">PLAN</div>
            <div className="text-[#FFD700] font-black">Business</div>
            <div className="text-xs text-gray-600 mt-1">4,128 / 5,000 msgs</div>
            <div className="mt-2 bg-[#1a1a1a] rounded-full h-1.5">
              <div className="bg-[#FFD700] h-1.5 rounded-full w-4/5" />
            </div>
          </div>
        </div>
      </aside>
      <main className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs text-gray-500 tracking-widest mb-1">DASHBOARD</div>
            <h1 className="text-2xl font-black">Welcome back, Sabelo 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#00FF88] rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">AI is live</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {STATS.map((s, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: s.color + "22", color: s.color }}>{s.change}</span>
              </div>
              <div className="text-2xl font-black mb-1">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl">
            <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a]">
              <h2 className="font-bold">Recent Conversations</h2>
              <span className="text-xs text-[#FFD700]">View all →</span>
            </div>
            {MESSAGES.map((msg, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-[#111] cursor-pointer border-b border-[#0a0a0a] last:border-0">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center font-bold text-sm">{msg.name.charAt(0)}</div>
                  {msg.unread && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFD700] rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{msg.name}</span>
                    <span className="text-xs text-gray-600">{msg.time}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-0.5">{msg.preview}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="bg-[#0d0d0d] border border-[#00FF8833] rounded-xl p-5">
              <div className="text-xs text-[#00FF88] tracking-widest mb-3">AI STATUS</div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-[#00FF88] rounded-full animate-pulse" />
                <span className="font-bold">Fully Automated</span>
              </div>
              {["Zulu ✓", "English ✓", "Afrikaans ✓", "Sesotho ✓"].map((l, i) => (
                <div key={i} className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-400">{l}</span>
                  <span className="text-[#00FF88]">Active</span>
                </div>
              ))}
            </div>
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5">
              <div className="text-xs text-gray-500 tracking-widest mb-3">QUICK TEST</div>
              <input className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD70055] mb-2" placeholder="Type a test message..." />
              <button className="w-full bg-[#FFD700] text-black text-xs font-bold py-2 rounded-lg hover:bg-[#ffc800] transition-colors">Test AI Reply</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
