"use client"

import dynamic from "next/dynamic"

// Use dynamic import with ssr: false to prevent hydration errors
const SustainabilityChat = dynamic(
  () => import("@/components/chat/sustainability-chat").then((mod) => ({ default: mod.SustainabilityChat })),
  { ssr: false },
)

export default function ChatPage() {
  return (
    <div className="h-screen bg-black">
      <SustainabilityChat />
    </div>
  )
}

