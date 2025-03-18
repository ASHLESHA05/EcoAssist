"use client"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
// import { ThumbsUp } from "lucide-react"
const ThumbsUp = dynamic(() => import("lucide-react").then((mod) => mod.ThumbsUp), { ssr: false })


export default function ActivityFeed() {
  const activities = [
    {
      user: { name: "Emma Wilson", avatar: "EW" },
      action: "completed the Zero Waste Challenge",
      time: "2 hours ago",
      points: 500,
      likes: 12,
    },
    {
      user: { name: "David Kim", avatar: "DK" },
      action: "reduced their electricity usage by 30%",
      time: "5 hours ago",
      points: 200,
      likes: 8,
    },
    {
      user: { name: "Sarah Chen", avatar: "SC" },
      action: "planted 3 trees in their community",
      time: "Yesterday",
      points: 300,
      likes: 24,
    },
    {
      user: { name: "Miguel Rodriguez", avatar: "MR" },
      action: "switched to a plant-based diet for a week",
      time: "2 days ago",
      points: 350,
      likes: 16,
    },
  ]

  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-full text-sm font-medium">
                {activity.user.avatar}
              </div>
            </Avatar>
            <div className="space-y-1">
              <div>
                <span className="font-medium">{activity.user.name}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{activity.time}</span>
                <Badge variant="outline" className="text-xs">
                  +{activity.points} pts
                </Badge>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{activity.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  Comment
                </Button>
              </div>
            </div>
          </div>
          {index < activities.length - 1 && <div className="ml-5 h-6 w-0.5 bg-border"></div>}
        </div>
      ))}
    </div>
  )
}

