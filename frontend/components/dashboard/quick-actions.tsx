"use client"
import dynamic from "next/dynamic"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { Car, Lightbulb, Recycle, ShoppingBag } from "lucide-react"

const Car = dynamic(() => import("lucide-react").then((mod) => mod.Car), { ssr: false })
const Lightbulb = dynamic(() => import("lucide-react").then((mod) => mod.Lightbulb), { ssr: false })
const Recycle = dynamic(() => import("lucide-react").then((mod) => mod.Recycle), { ssr: false })
const ShoppingBag = dynamic(() => import("lucide-react").then((mod) => mod.ShoppingBag), { ssr: false })

export default function QuickActions() {
  const actions = [
    {
      title: "Log a car-free day",
      icon: Car,
      points: 50,
    },
    {
      title: "Record energy savings",
      icon: Lightbulb,
      points: 30,
    },
    {
      title: "Log recycling activity",
      icon: Recycle,
      points: 20,
    },
    {
      title: "Add sustainable purchase",
      icon: ShoppingBag,
      points: 25,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Earn points with these activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <div key={index} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <action.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{action.title}</span>
            </div>
            <Button size="sm" variant="outline">
              +{action.points} pts
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

