"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import ReactMarkdown from "react-markdown"

export default function ListTodayDetails() {
  const [activities, setActivities] = useState<string>("")
  const [savedActivities, setSavedActivities] = useState<string>("")
  const { user } = useUser()

  // Fetch saved activities from the backend
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/getDailyActivity`,
          {
            params: {
              email: user.email,
            },
          }
        )

        if (response.status === 200) {
          setSavedActivities(response.data.activities)
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error)
      }
    }

    fetchActivities()
  }, [user])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("Please log in to save your activities.")
      return
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/updateDailyActivities`,
        {
          email: user.email,
          activities: activities,
        }
      )

      if (response.status === 200) {
        alert("Activities saved successfully!")
        setActivities("") // Clear the text area
        setSavedActivities((prev) => (prev ? `${prev}\n\n${activities}` : activities)) // Append new activities
      }
    } catch (error) {
      console.error("Failed to save activities:", error)
      alert("Failed to save activities. Please try again.")
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="bg-gradient-to-br from-green-900 to-black border-green-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-400">Today's Activities</CardTitle>
          <CardDescription className="text-green-200">
            Write down everything you did today. You can use Markdown for formatting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display saved activities in Markdown format */}
            {savedActivities && (
              <div className="bg-green-900 border-green-800 p-4 rounded-lg text-green-200">
                <ReactMarkdown>{savedActivities}</ReactMarkdown>
              </div>
            )}

            {/* Text area for new activities */}
            <div className="space-y-2">
              <Label htmlFor="activities" className="text-green-300">
                Add New Activities
              </Label>
              <Textarea
                id="activities"
                value={activities}
                onChange={(e) => setActivities(e.target.value)}
                placeholder="Example: Today on March 21, I planted a tree."
                className="bg-green-900 border-green-800 text-green-200 placeholder-green-400"
                rows={10}
              />
            </div>

            {/* Submit button */}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              Save Activities
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-green-200">
          <p>Tip: Use Markdown for formatting (e.g., **bold**, *italic*, `code`).</p>
        </CardFooter>
      </Card>
    </div>
  )
}