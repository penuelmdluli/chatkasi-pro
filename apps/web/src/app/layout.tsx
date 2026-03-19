import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ChatKasi Pro — AI WhatsApp Automation for SA Businesses",
  description: "Automate your WhatsApp Business with AI. Respond in all 11 South African languages. Book appointments, capture leads, and grow your business 24/7.",
  keywords: ["WhatsApp automation", "South Africa", "AI chatbot", "business automation", "WATI"],
  openGraph: {
    title: "ChatKasi Pro",
    description: "South Africa's #1 AI WhatsApp Business Automation",
    type: "website"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-dark-400 text-white antialiased">{children}</body>
    </html>
  )
}
