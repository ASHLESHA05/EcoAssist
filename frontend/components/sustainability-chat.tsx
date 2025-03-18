"use client"

import type React from "react"

import { useState } from "react"
import { Send, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// This is a mock implementation since we don't have the actual AI integration
// In a real app, you would use the useChat hook from ai/react
const useChat = (options: any) => {
  const [messages, setMessages] = useState(options.initialMessages || [])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)

      if (options.onFinish) {
        options.onFinish(assistantMessage)
      }
    }, 1000)
  }

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  }
}

const getAIResponse = (query: string): string => {
  // Simple response logic - would be replaced with actual AI integration
  if (query.toLowerCase().includes("electricity")) {
    return "To reduce your electricity bill this month, try: 1) Unplug devices when not in use, 2) Switch to LED bulbs, 3) Use natural light during the day, 4) Run large appliances during off-peak hours."
  } else if (query.toLowerCase().includes("cleaning")) {
    return "Some eco-friendly cleaning brands include: Method, Seventh Generation, Ecover, and Biokleen. You can also make your own cleaning solutions using vinegar, baking soda, and essential oils."
  } else if (query.toLowerCase().includes("carbon footprint") || query.toLowerCase().includes("car trip")) {
    return "A 10-mile car trip in an average gasoline vehicle produces about 8.9 pounds of CO2. You can reduce this by: 1) Carpooling, 2) Using public transportation, 3) Combining errands into one trip, 4) Maintaining proper tire pressure for better fuel efficiency."
  } else if (query.toLowerCase().includes("diet")) {
    return "To make your diet more sustainable: 1) Reduce meat consumption, especially beef, 2) Choose locally grown, seasonal produce, 3) Minimize food waste by planning meals, 4) Try plant-based alternatives, 5) Buy in bulk to reduce packaging waste."
  } else {
    return "Here are some general tips for sustainable living: 1) Reduce single-use plastics, 2) Eat more plant-based meals, 3) Use public transportation or carpool when possible, 4) Support local and sustainable businesses."
  }
}

export function SustainabilityChat() {
  const [points, setPoints] = useState(0)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "👋 Hi there! I'm your EcoAssist, ready to help you adopt more sustainable practices. What would you like to know about reducing your carbon footprint today?",
      },
    ],
    onFinish: (message: any) => {
      // Award points for engaging with the assistant
      if (message.content.includes("eco-friendly") || message.content.includes("sustainable")) {
        setPoints((prev) => prev + 5)
      }
    },
  })

  const suggestedQueries = [
    "How can I reduce my electricity bill this month?",
    "Suggest eco-friendly brands for cleaning products.",
    "What's my carbon footprint for a 10-mile car trip?",
    "How can I make my diet more sustainable?",
  ]

  const handleSuggestedQuery = (query: string) => {
    handleInputChange({ target: { value: query } } as any)
  }

  return (
    <div className="flex flex-col h-full bg-black text-white">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold">EcoAssist</h1>
        <p className="text-gray-400">Your personal guide to sustainable living</p>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-transparent">
            <Leaf className="h-5 w-5 text-green-500" />
          </Avatar>
          <h2 className="font-semibold text-white">EcoAssist</h2>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-transparent border-green-500">
            <span className="text-green-500">{points} EcoPoints</span>
          </Badge>
          <Button variant="ghost" size="sm" className="text-white hover:text-green-500">
            My Profile
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message: any) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" ? "bg-green-900 text-white" : "bg-gray-800 text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-800">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-800">
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedQueries.map((query, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedQuery(query)}
              className="text-xs bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              {query}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about sustainable practices..."
            className="flex-1 bg-gray-800 border-gray-700 text-white"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className="bg-green-600 hover:bg-green-700">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

