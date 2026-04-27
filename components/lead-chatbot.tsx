"use client"

import { MessageCircle } from "lucide-react"

// Update this with your WhatsApp Business number (include country code, no + or spaces)
const WHATSAPP_NUMBER = "61400000000" // e.g., "61412345678" for Australian number

export function LeadChatbot() {
  const handleClick = () => {
    const message = "Hi, I'd like to speak with a loan specialist."
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      aria-label="Chat with a loan specialist"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-medium">Chat with a loan specialist</span>
    </button>
  )
}
