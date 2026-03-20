"use client"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase-browser"
import { api, type AnalyticsData, type BusinessData, type MessageData, type ContactData } from "@/lib/api"
import { useRouter } from "next/navigation"


// ─── Overview Tab ───────────────────────────────────────────────
function OverviewTab({ analytics, messages, business, onTestReply }: {
  analytics: AnalyticsData | null
  messages: MessageData[]
  business: BusinessData | null
  onTestReply: (msg: string) => Promise<string>
}) {
  const [testMsg, setTestMsg] = useState("")
  const [testReply, setTestReply] = useState("")
  const [testLoading, setTestLoading] = useState(false)

  const stats = [
    { label: "Messages This Month", value: analytics?.total?.toLocaleString() || "0", change: `${analytics?.autoReplyRate || 0}% auto`, icon: "💬", color: "#FFD700" },
    { label: "Inbound Messages", value: analytics?.inbound?.toLocaleString() || "0", change: "received", icon: "📥", color: "#00E5FF" },
    { label: "AI Auto-Replied", value: analytics?.outbound?.toLocaleString() || "0", change: `${analytics?.autoReplyRate || 0}%`, icon: "🤖", color: "#00FF88" },
    { label: "Unique Contacts", value: new Set(messages.map(m => m.contact_phone)).size.toString(), change: "total", icon: "👥", color: "#FF00AA" },
  ]

  async function handleTest() {
    if (!testMsg.trim()) return
    setTestLoading(true)
    try {
      const reply = await onTestReply(testMsg)
      setTestReply(reply)
    } catch {
      setTestReply("Failed to generate reply. Check API connection.")
    }
    setTestLoading(false)
  }

  const recentMessages = messages.slice(0, 8)

  // Aggregate recent conversations by phone
  const conversationMap = new Map<string, { phone: string; lastMsg: string; time: string; count: number }>()
  for (const msg of messages) {
    if (!conversationMap.has(msg.contact_phone)) {
      conversationMap.set(msg.contact_phone, {
        phone: msg.contact_phone,
        lastMsg: msg.content,
        time: msg.created_at,
        count: 1,
      })
    } else {
      conversationMap.get(msg.contact_phone)!.count++
    }
  }
  const recentConversations = Array.from(conversationMap.values()).slice(0, 5)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl">
          <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a]">
            <h2 className="font-bold">Recent Conversations</h2>
            <span className="text-xs text-gray-500">{recentConversations.length} contacts</span>
          </div>
          {recentConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-600 text-sm">No conversations yet. Messages will appear here once your WhatsApp is connected.</div>
          ) : (
            recentConversations.map((conv, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-[#111] cursor-pointer border-b border-[#0a0a0a] last:border-0">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center font-bold text-sm text-[#FFD700]">
                  {conv.phone.slice(-2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{conv.phone}</span>
                    <span className="text-xs text-gray-600">{formatTimeAgo(conv.time)}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMsg}</div>
                </div>
                <span className="text-xs bg-[#1a1a1a] px-2 py-1 rounded-full text-gray-400">{conv.count}</span>
              </div>
            ))
          )}
        </div>
        <div className="space-y-4">
          <div className="bg-[#0d0d0d] border border-[#00FF8833] rounded-xl p-5">
            <div className="text-xs text-[#00FF88] tracking-widest mb-3">AI STATUS</div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-[#00FF88] rounded-full animate-pulse" />
              <span className="font-bold">{business?.plan_status === "active" ? "Fully Automated" : "Trial Mode"}</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-gray-400">Language</span><span className="text-[#00FF88] capitalize">{business?.ai_language || "English"}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Tone</span><span className="text-[#00FF88] capitalize">{business?.ai_tone || "Friendly"}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Plan</span><span className="text-[#FFD700] capitalize">{business?.plan_name || "Trial"}</span></div>
            </div>
          </div>
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5">
            <div className="text-xs text-gray-500 tracking-widest mb-3">QUICK TEST</div>
            <input
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD70055] mb-2"
              placeholder="Type a test message..."
              value={testMsg}
              onChange={e => setTestMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleTest()}
            />
            <button
              onClick={handleTest}
              disabled={testLoading}
              className="w-full bg-[#FFD700] text-black text-xs font-bold py-2 rounded-lg hover:bg-[#ffc800] transition-colors disabled:opacity-50"
            >
              {testLoading ? "Generating..." : "Test AI Reply"}
            </button>
            {testReply && (
              <div className="mt-3 bg-[#141414] border border-[#2a2a2a] rounded-lg p-3 text-xs text-gray-300">
                <div className="text-[10px] text-[#FFD700] mb-1">AI REPLY:</div>
                {testReply}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Conversations Tab ──────────────────────────────────────────
function ConversationsTab({ messages }: { messages: MessageData[] }) {
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null)

  // Build conversation list
  const conversations = new Map<string, { phone: string; messages: MessageData[]; lastTime: string }>()
  for (const msg of messages) {
    if (!conversations.has(msg.contact_phone)) {
      conversations.set(msg.contact_phone, { phone: msg.contact_phone, messages: [], lastTime: msg.created_at })
    }
    conversations.get(msg.contact_phone)!.messages.push(msg)
  }
  const convList = Array.from(conversations.values()).sort(
    (a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
  )

  const selected = selectedPhone ? conversations.get(selectedPhone) : convList[0]
  const threadMessages = selected?.messages.slice().sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  ) || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
      {/* Contact list */}
      <div className="border-r border-[#1a1a1a] overflow-y-auto">
        <div className="p-4 border-b border-[#1a1a1a]">
          <h2 className="font-bold text-sm">Conversations</h2>
          <p className="text-xs text-gray-600 mt-1">{convList.length} contacts</p>
        </div>
        {convList.length === 0 ? (
          <div className="p-6 text-center text-gray-600 text-sm">No conversations yet.</div>
        ) : (
          convList.map(conv => (
            <div
              key={conv.phone}
              onClick={() => setSelectedPhone(conv.phone)}
              className={`flex items-center gap-3 p-4 cursor-pointer border-b border-[#0a0a0a] transition-colors ${
                (selectedPhone || convList[0]?.phone) === conv.phone ? "bg-[#FFD70008] border-l-2 border-l-[#FFD700]" : "hover:bg-[#111]"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center font-bold text-xs text-[#FFD700]">
                {conv.phone.slice(-2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs">{conv.phone}</span>
                  <span className="text-[10px] text-gray-600">{formatTimeAgo(conv.lastTime)}</span>
                </div>
                <div className="text-xs text-gray-500 truncate">{conv.messages[0]?.content}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message thread */}
      <div className="lg:col-span-2 flex flex-col">
        {selected ? (
          <>
            <div className="p-4 border-b border-[#1a1a1a] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center font-bold text-xs text-[#FFD700]">
                {selected.phone.slice(-2)}
              </div>
              <div>
                <div className="font-bold text-sm">{selected.phone}</div>
                <div className="text-[10px] text-gray-500">{selected.messages.length} messages</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {threadMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.direction === "outbound"
                      ? "bg-[#FFD700] text-black rounded-br-sm"
                      : "bg-[#1a1a1a] text-white rounded-bl-sm"
                  }`}>
                    <div>{msg.content}</div>
                    <div className={`text-[10px] mt-1 ${msg.direction === "outbound" ? "text-black/50" : "text-gray-600"}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {msg.direction === "outbound" && " - AI"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
            Select a conversation to view messages
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Contacts Tab ───────────────────────────────────────────────
function ContactsTab({ contacts }: { contacts: ContactData[] }) {
  const [search, setSearch] = useState("")
  const filtered = contacts.filter(c =>
    c.contact_phone.includes(search) || (c.contact_name || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl">
      <div className="p-5 border-b border-[#1a1a1a] flex items-center justify-between">
        <div>
          <h2 className="font-bold">Contacts</h2>
          <p className="text-xs text-gray-500 mt-1">{contacts.length} total contacts</p>
        </div>
        <input
          className="bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD70055] w-64"
          placeholder="Search by phone or name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {filtered.length === 0 ? (
        <div className="p-8 text-center text-gray-600 text-sm">
          {contacts.length === 0 ? "No contacts yet. They will appear as messages come in." : "No contacts match your search."}
        </div>
      ) : (
        <div className="divide-y divide-[#0a0a0a]">
          {/* Header row */}
          <div className="grid grid-cols-5 gap-4 px-5 py-3 text-[10px] text-gray-600 tracking-widest">
            <span>PHONE</span><span>NAME</span><span>LAST MESSAGE</span><span>LAST ACTIVE</span><span className="text-right">MESSAGES</span>
          </div>
          {filtered.map((contact, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 px-5 py-4 hover:bg-[#111] transition-colors items-center">
              <span className="text-sm font-mono">{contact.contact_phone}</span>
              <span className="text-sm text-gray-400">{contact.contact_name || "-"}</span>
              <span className="text-xs text-gray-500 truncate">{contact.last_message}</span>
              <span className="text-xs text-gray-600">{formatTimeAgo(contact.last_message_at)}</span>
              <span className="text-right">
                <span className="inline-block bg-[#FFD70022] text-[#FFD700] text-xs px-2 py-1 rounded-full font-bold">
                  {contact.message_count}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── AI Config Tab ──────────────────────────────────────────────
function AIConfigTab({ business, onSave }: {
  business: BusinessData | null
  onSave: (data: Partial<BusinessData>) => Promise<void>
}) {
  const [context, setContext] = useState(business?.ai_context || "")
  const [language, setLanguage] = useState(business?.ai_language || "english")
  const [tone, setTone] = useState(business?.ai_tone || "friendly")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (business) {
      setContext(business.ai_context || "")
      setLanguage(business.ai_language || "english")
      setTone(business.ai_tone || "friendly")
    }
  }, [business])

  async function handleSave() {
    setSaving(true)
    await onSave({ ai_context: context, ai_language: language, ai_tone: tone })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-6">
        <h2 className="font-bold mb-1">AI Persona Configuration</h2>
        <p className="text-xs text-gray-500 mb-6">Configure how the AI assistant represents your business on WhatsApp.</p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs text-gray-500 tracking-widest mb-2">BUSINESS CONTEXT / DESCRIPTION</label>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              rows={6}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD70055] transition-colors resize-none"
              placeholder="Describe your business, services, pricing, hours, location, FAQ answers, and anything the AI should know when responding to customers..."
            />
            <p className="text-[10px] text-gray-600 mt-1">This context is sent to the AI with every conversation. Be specific — include prices, hours, services, and common customer questions.</p>
          </div>

          <div>
            <label className="block text-xs text-gray-500 tracking-widest mb-2">PREFERRED RESPONSE LANGUAGE</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD70055] transition-colors appearance-none"
            >
              <option value="english">English</option>
              <option value="zulu">isiZulu</option>
              <option value="xhosa">isiXhosa</option>
              <option value="afrikaans">Afrikaans</option>
              <option value="sesotho">Sesotho</option>
              <option value="setswana">Setswana</option>
              <option value="sepedi">Sepedi</option>
              <option value="tshivenda">Tshivenda</option>
              <option value="xitsonga">Xitsonga</option>
              <option value="siswati">SiSwati</option>
              <option value="ndebele">isiNdebele</option>
              <option value="auto">Auto-detect (match customer language)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 tracking-widest mb-2">RESPONSE TONE</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "formal", label: "Formal", desc: "Professional, corporate" },
                { value: "friendly", label: "Friendly", desc: "Warm, approachable" },
                { value: "casual", label: "Casual", desc: "Relaxed, conversational" },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTone(opt.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    tone === opt.value
                      ? "border-[#FFD70066] bg-[#FFD70008]"
                      : "border-[#1a1a1a] hover:border-[#333]"
                  }`}
                >
                  <div className={`font-bold text-sm mb-1 ${tone === opt.value ? "text-[#FFD700]" : "text-white"}`}>{opt.label}</div>
                  <div className="text-[10px] text-gray-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#FFD700] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#ffc800] transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Configuration"}
          </button>
          {saved && <span className="text-[#00FF88] text-sm font-bold">Saved successfully!</span>}
        </div>
      </div>

      <div className="bg-[#0d0d0d] border border-[#FFD70033] rounded-xl p-6">
        <h3 className="font-bold text-sm mb-2 text-[#FFD700]">Tips for Better AI Responses</h3>
        <ul className="space-y-2 text-xs text-gray-400">
          <li>- Include your business hours, e.g. "Open Mon-Fri 8am-5pm, Sat 9am-1pm"</li>
          <li>- List your services with prices for accurate quotes</li>
          <li>- Add your location and parking info</li>
          <li>- Include answers to your top 5 frequently asked questions</li>
          <li>- Mention any booking or payment policies</li>
        </ul>
      </div>
    </div>
  )
}

// ─── Settings Tab ───────────────────────────────────────────────
function SettingsTab({ business, onSave, onLogout }: {
  business: BusinessData | null
  onSave: (data: Partial<BusinessData>) => Promise<void>
  onLogout: () => void
}) {
  const [name, setName] = useState(business?.name || "")
  const [phone, setPhone] = useState(business?.phone || "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (business) {
      setName(business.name || "")
      setPhone(business.phone || "")
    }
  }, [business])

  async function handleSave() {
    setSaving(true)
    await onSave({ name, phone })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-6">
        <h2 className="font-bold mb-1">Account Settings</h2>
        <p className="text-xs text-gray-500 mb-6">Manage your business profile and account details.</p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs text-gray-500 tracking-widest mb-2">BUSINESS NAME</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD70055] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 tracking-widest mb-2">WHATSAPP NUMBER</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD70055] transition-colors"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#FFD700] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#ffc800] transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saved && <span className="text-[#00FF88] text-sm font-bold">Saved!</span>}
        </div>
      </div>

      {/* Plan Info */}
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-6">
        <h2 className="font-bold mb-4">Subscription Plan</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-gray-500 tracking-widest">CURRENT PLAN</span>
            <div className="text-[#FFD700] font-black text-lg capitalize mt-1">{business?.plan_name || "Trial"}</div>
          </div>
          <div>
            <span className="text-xs text-gray-500 tracking-widest">STATUS</span>
            <div className="mt-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                business?.plan_status === "active"
                  ? "bg-[#00FF8822] text-[#00FF88]"
                  : business?.plan_status === "trial"
                    ? "bg-[#FFD70022] text-[#FFD700]"
                    : "bg-red-500/20 text-red-400"
              }`}>
                {(business?.plan_status || "inactive").toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#0d0d0d] border border-red-500/20 rounded-xl p-6">
        <h2 className="font-bold mb-4 text-red-400">Account</h2>
        <button
          onClick={onLogout}
          className="border border-red-500/30 text-red-400 font-bold px-6 py-3 rounded-xl hover:bg-red-500/10 transition-all text-sm"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

// ─── Time Formatter ─────────────────────────────────────────────
function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

// ─── Main Dashboard ─────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [business, setBusiness] = useState<BusinessData | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [messages, setMessages] = useState<MessageData[]>([])
  const [contacts, setContacts] = useState<ContactData[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const loadData = useCallback(async (businessId: string) => {
    try {
      const [analyticsData, businessData, messagesData, contactsData] = await Promise.allSettled([
        api.getAnalytics(businessId),
        api.getBusiness(businessId),
        api.getMessages(businessId),
        api.getContacts(businessId),
      ])

      if (analyticsData.status === "fulfilled") setAnalytics(analyticsData.value)
      if (businessData.status === "fulfilled") setBusiness(businessData.value)
      if (messagesData.status === "fulfilled") setMessages(messagesData.value)
      if (contactsData.status === "fulfilled") setContacts(contactsData.value)
    } catch (err) {
      console.error("Failed to load dashboard data:", err)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUserId(user.id)
      await loadData(user.id)
    }
    init()
  }, [router, supabase, loadData])

  async function handleSaveBusiness(data: Partial<BusinessData>) {
    if (!userId) return
    try {
      const updated = await api.updateBusiness(userId, data)
      setBusiness(updated)
    } catch (err) {
      console.error("Failed to save:", err)
    }
  }

  async function handleTestReply(message: string): Promise<string> {
    const result = await api.testAIReply(message, business?.ai_context || "", business?.name || "My Business")
    return result.reply
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const tabs = [
    { id: "overview", icon: "⚡", label: "Overview" },
    { id: "conversations", icon: "💬", label: "Conversations" },
    { id: "contacts", icon: "👥", label: "Contacts" },
    { id: "ai-config", icon: "🤖", label: "AI Config" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ]

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#080808] items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">💬</div>
          <div className="text-gray-500 text-sm">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <aside className="w-64 border-r border-[#1a1a1a] p-6 flex flex-col gap-1 fixed h-full">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xl">💬</span>
          <span className="font-black text-lg">Chat<span className="text-[#FFD700]">Kasi</span></span>
        </div>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-left w-full ${
              activeTab === tab.id
                ? "bg-[#FFD70011] text-[#FFD700] border border-[#FFD70033]"
                : "text-gray-500 hover:text-gray-300 hover:bg-[#111]"
            }`}
          >
            <span>{tab.icon}</span><span>{tab.label}</span>
          </button>
        ))}
        <div className="mt-auto">
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">PLAN</div>
            <div className="text-[#FFD700] font-black capitalize">{business?.plan_name || "Trial"}</div>
            <div className="text-xs text-gray-600 mt-1 capitalize">{business?.plan_status || "inactive"}</div>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs text-gray-500 tracking-widest mb-1">DASHBOARD</div>
            <h1 className="text-2xl font-black">
              {business?.name || "Your Business"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#00FF88] rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">AI is live</span>
          </div>
        </div>

        {activeTab === "overview" && (
          <OverviewTab
            analytics={analytics}
            messages={messages}
            business={business}
            onTestReply={handleTestReply}
          />
        )}
        {activeTab === "conversations" && <ConversationsTab messages={messages} />}
        {activeTab === "contacts" && <ContactsTab contacts={contacts} />}
        {activeTab === "ai-config" && <AIConfigTab business={business} onSave={handleSaveBusiness} />}
        {activeTab === "settings" && <SettingsTab business={business} onSave={handleSaveBusiness} onLogout={handleLogout} />}
      </main>
    </div>
  )
}
