"use client"
import dynamic from "next/dynamic"
// import { Users, Trophy, Calendar, Award, Search } from "lucide-react"

const Users = dynamic(() => import("lucide-react").then((mod) => mod.Users), { ssr: false })
const Trophy = dynamic(() => import("lucide-react").then((mod) => mod.Trophy), { ssr: false })
const Calendar = dynamic(() => import("lucide-react").then((mod) => mod.Calendar), { ssr: false })
const Award = dynamic(() => import("lucide-react").then((mod) => mod.Award), { ssr: false })
const Search = dynamic(() => import("lucide-react").then((mod) => mod.Search), { ssr: false })

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import LeaderboardTable from "@/components/social/leaderboard-table"
import ChallengeCards from "@/components/social/challenge-cards"
import ActivityFeed from "@/components/social/activity-feed"
import { Input } from "@/components/ui/input"
import { AvatarFallback } from "@radix-ui/react-avatar"

export default function SocialPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Community</h1>
        <p className="text-muted-foreground">Connect with friends and join sustainability challenges</p>
      </div>

      <Tabs defaultValue="leaderboard">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leaderboard">
            <Trophy className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <Calendar className="h-4 w-4 mr-2" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="friends">
            <Users className="h-4 w-4 mr-2" />
            Friends
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Leaderboard</CardTitle>
              <CardDescription>See how you rank against other eco-warriors worldwide</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Challenges</CardTitle>
                <CardDescription>Challenges you're currently participating in</CardDescription>
              </CardHeader>
              <CardContent>
                <ChallengeCards />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Challenges</CardTitle>
                <CardDescription>Join these challenges to earn more points</CardDescription>
              </CardHeader>
              <CardContent>
                <ChallengeCards upcoming={true} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Friend Activity</CardTitle>
                <CardDescription>See what your friends are doing to save the planet</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityFeed />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Find Friends</CardTitle>
                <CardDescription>Connect with people who share your sustainability goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input placeholder="Search by name or email" />
                  <Button className="absolute right-1 top-1 h-6 w-6 p-0" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Jane Doe</p>
                        <p className="text-sm text-muted-foreground">Level 5 • 3 mutual friends</p>
                      </div>
                    </div>
                    <Button size="sm">Add</Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>MS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Mike Smith</p>
                        <p className="text-sm text-muted-foreground">Level 8 • 1 mutual friend</p>
                      </div>
                    </div>
                    <Button size="sm">Add</Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>LW</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Lisa Wong</p>
                        <p className="text-sm text-muted-foreground">Level 6 • 5 mutual friends</p>
                      </div>
                    </div>
                    <Button size="sm">Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>Badges and milestones you've earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: "Early Bird", description: "Joined during beta", icon: Award },
                    { name: "Power Saver", description: "Reduced electricity by 20%", icon: Award },
                    { name: "Tree Hugger", description: "Planted 5 trees", icon: Award },
                    { name: "Waste Warrior", description: "Zero waste for 7 days", icon: Award },
                    { name: "Water Guardian", description: "Saved 1000 gallons", icon: Award },
                    { name: "Eco Shopper", description: "10 sustainable purchases", icon: Award },
                  ].map((badge, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-2 bg-card border rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <badge.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-medium text-sm">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Locked Achievements</CardTitle>
                <CardDescription>Complete these actions to earn more badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Carbon Crusher", description: "Reduce carbon footprint by 50%", progress: 65 },
                    { name: "Sustainable Chef", description: "Cook 20 plant-based meals", progress: 40 },
                    { name: "Green Commuter", description: "30 days of eco-friendly travel", progress: 20 },
                    { name: "Energy Master", description: "Use 100% renewable energy", progress: 10 },
                  ].map((achievement, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        <Badge variant="outline">{achievement.progress}%</Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

