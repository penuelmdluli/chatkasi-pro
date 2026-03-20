const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || "API request failed")
  }
  return res.json()
}

export interface AnalyticsData {
  total: number
  inbound: number
  outbound: number
  autoReplyRate: number
}

export interface BusinessData {
  id: string
  name: string
  phone: string
  plan_name: string
  plan_status: string
  ai_context: string
  ai_language: string
  ai_tone: string
  created_at: string
}

export interface MessageData {
  id: string
  business_id: string
  contact_phone: string
  direction: "inbound" | "outbound"
  content: string
  created_at: string
}

export interface ContactData {
  contact_phone: string
  contact_name: string | null
  last_message: string
  last_message_at: string
  message_count: number
}

export const api = {
  getAnalytics: (businessId: string) =>
    apiFetch<AnalyticsData>(`/api/analytics/${businessId}`),

  getBusiness: (businessId: string) =>
    apiFetch<BusinessData>(`/api/business/${businessId}`),

  updateBusiness: (businessId: string, data: Partial<BusinessData>) =>
    apiFetch<BusinessData>(`/api/business/${businessId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getMessages: (businessId: string) =>
    apiFetch<MessageData[]>(`/api/business/${businessId}/messages`),

  getContacts: (businessId: string) =>
    apiFetch<ContactData[]>(`/api/business/${businessId}/contacts`),

  testAIReply: (message: string, businessContext: string, businessName: string) =>
    apiFetch<{ reply: string }>("/api/ai/test-reply", {
      method: "POST",
      body: JSON.stringify({ message, businessContext, businessName }),
    }),
}
