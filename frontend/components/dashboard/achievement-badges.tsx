"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgesType } from "@/types/types"
import dynamic from "next/dynamic"

const Award = dynamic(() => import("lucide-react").then((mod) => mod.Award), { ssr: false })

const badges_ = [
  {
    name: "Early Bird",
    description: "Joined during beta",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    name: "Power Saver",
    description: "Reduced electricity by 20%",
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    name: "Tree Hugger",
    description: "Planted 5 trees",
    color: "bg-green-500/10 text-green-500",
  },
]

export default function AchievementBadges({ badges = badges_ }: { badges?: BadgesType[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Achievements</CardTitle>
        <CardDescription>Badges you've earned</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-3">
        {badges.map((badge, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className={`rounded-full p-3 ${badge.color}`}>
              <Award className="h-6 w-6" />
            </div>
            <div className="mt-2">
              <p className="text-xs font-medium">{badge.name}</p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
