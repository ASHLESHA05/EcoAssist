"use client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
// import { Users } from "lucide-react"

const Users = dynamic(() => import("lucide-react").then((mod) => mod.Users), { ssr: false })
interface ChallengeCardsProps {
  upcoming?: boolean
}

export default function ChallengeCards({ upcoming = false }: ChallengeCardsProps) {
  const activeChallenges = [
    {
      title: "Zero Waste Week",
      description: "Reduce your waste to zero for one week",
      participants: 128,
      daysLeft: 3,
      points: 500,
    },
    {
      title: "Plant-Based Diet",
      description: "Eat only plant-based meals for 5 days",
      participants: 87,
      daysLeft: 5,
      points: 300,
    },
  ]

  const upcomingChallenges = [
    {
      title: "Bike to Work",
      description: "Commute by bike at least 3 days next week",
      participants: 56,
      startsIn: 2,
      points: 400,
    },
    {
      title: "Energy Saving",
      description: "Reduce your electricity usage by 20%",
      participants: 112,
      startsIn: 5,
      points: 350,
    },
  ]

  const challenges = upcoming ? upcomingChallenges : activeChallenges

  return (
    <div className="space-y-4">
      {challenges.map((challenge, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="mb-2 flex justify-between">
              <h3 className="font-medium">{challenge.title}</h3>
              <Badge variant="outline">{challenge.points} pts</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <Users className="mr-1 h-3 w-3" />
              <span>{challenge.participants} participants</span>
              <span className="mx-2">•</span>
              {upcoming ? (
                <span>Starts in {challenge.startsIn} days</span>
              ) : (
                <span>{challenge.daysLeft} days left</span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm" className="w-full">
              {upcoming ? "Join Challenge" : "View Progress"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

