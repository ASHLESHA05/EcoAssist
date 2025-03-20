"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useUser } from "@auth0/nextjs-auth0/client"

interface Notification {
  title: string
  description: string
  quote: string
  imageUrl?: string
}

export default function NotificationPopup() {
  const [notification, setNotification] = useState<Notification | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [lastDisplayed, setLastDisplayed] = useState<number>(0)
  const { user } = useUser()

  // Fallback notification
  const fallbackNotification = {
    title: "World Water Day",
    description: "Today is World Water Day. Save water, save life. Use water wisely.",
    quote: "Water is life. Don't waste it.",
  }

  // Fetch notification from the API
  const fetchNotification = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/getTips`, {
          params: {
            email: user?.email,
          },
      })
      const data = response.data

      // Fetch image based on the title
      const imageUrl = await fetchImage(data.title)
      setNotification({ ...data, imageUrl })
      setIsVisible(true)
      setLastDisplayed(Date.now())
    } catch (error) {
      console.error("Failed to fetch notification:", error)
      // Fallback to predefined notification
      const imageUrl = await fetchImage(fallbackNotification.title) || "https://img.icons8.com/?size=100&id=11642&format=png&color=000000"
      setNotification({ ...fallbackNotification, imageUrl })
      setIsVisible(true)
      setLastDisplayed(Date.now())
    }
  }

  // Fetch image from the web based on the title
  const fetchImage = async (title: string) => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${title}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
      )
      return response.data.results[0]?.urls?.small || ""
    } catch (error) {
      console.error("Failed to fetch image:", error)
      return ""
    }
  }

  // Handle random pop-up display
  useEffect(() => {
    if (!user) return // Do not show notifications if the user is not logged in

    const randomTime = Math.floor(Math.random() * 30000) + 1000 // Random time between 1s and 30s
    const timer = setTimeout(() => {
      const now = Date.now()
      if (now - lastDisplayed >= 100000) {
        // 2 minutes cooldown
        fetchNotification()
      }
    }, randomTime)

    return () => clearTimeout(timer)
  }, [lastDisplayed, user])

  // Handle closing the pop-up
  const handleClose = () => {
    setIsVisible(false)
  }

  // Conditional rendering after all hooks are called
  if (!isVisible || !notification || !user) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-gradient-to-br from-green-900 to-black border-green-800 w-96">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold text-green-400">{notification.title}</CardTitle>
              <CardDescription className="text-green-200">{notification.description}</CardDescription>
            </div>
            <button onClick={handleClose} className="text-green-400 hover:text-green-300">
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {notification.imageUrl && (
            <img
              src={notification.imageUrl}
              alt={notification.title}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
          )}
          <Label className="text-green-300">{notification.quote}</Label>
        </CardContent>
      </Card>
    </div>
  )
}