import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function LeaderboardTable() {
  const users = [
    {
      rank: 1,
      name: "Sarah Chen",
      score: 1250,
      change: "up",
      avatar: "SC",
      badges: ["Zero Waste Hero", "Energy Master"],
    },
    {
      rank: 2,
      name: "Alex Johnson",
      score: 1120,
      change: "same",
      avatar: "AJ",
      badges: ["Tree Planter", "Power Saver"],
    },
    {
      rank: 3,
      name: "Miguel Rodriguez",
      score: 980,
      change: "up",
      avatar: "MR",
      badges: ["Bike Commuter"],
    },
    {
      rank: 4,
      name: "Emma Wilson",
      score: 920,
      change: "down",
      avatar: "EW",
      badges: ["Sustainable Shopper"],
    },
    {
      rank: 5,
      name: "David Kim",
      score: 850,
      change: "up",
      avatar: "DK",
      badges: ["Water Saver"],
    },
  ]

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 gap-2 border-b p-3 text-sm font-medium">
        <div className="col-span-1">#</div>
        <div className="col-span-4">User</div>
        <div className="col-span-2">Score</div>
        <div className="col-span-5">Badges</div>
      </div>
      {users.map((user) => (
        <div key={user.rank} className="grid grid-cols-12 gap-2 border-b p-3 text-sm last:border-0">
          <div className="col-span-1 font-medium">{user.rank}</div>
          <div className="col-span-4 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-full text-sm font-medium">
                {user.avatar}
              </div>
            </Avatar>
            <span>{user.name}</span>
          </div>
          <div className="col-span-2 flex items-center">
            <span className="font-medium">{user.score}</span>
            <span className="ml-1 text-xs">
              {user.change === "up" && "↑"}
              {user.change === "down" && "↓"}
              {user.change === "same" && "–"}
            </span>
          </div>
          <div className="col-span-5 flex flex-wrap gap-1">
            {user.badges.map((badge, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

