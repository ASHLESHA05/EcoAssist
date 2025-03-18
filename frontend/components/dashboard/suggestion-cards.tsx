"use client"
import dynamic from "next/dynamic"
// import { ArrowRight, Car, Lightbulb, ShoppingBag, Utensils } from "lucide-react"

const ArrowRight = dynamic(() => import("lucide-react").then((mod) => mod.ArrowRight), { ssr: false })
const Car = dynamic(() => import("lucide-react").then((mod) => mod.Car), { ssr: false })
const Lightbulb = dynamic(() => import("lucide-react").then((mod) => mod.Lightbulb), { ssr: false })
const ShoppingBag = dynamic(() => import("lucide-react").then((mod) => mod.ShoppingBag), { ssr: false })
const Utensils = dynamic(() => import("lucide-react").then((mod) => mod.Utensils), { ssr: false })

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SuggestionCards() {
  const suggestions = [
    {
      title: "Reduce Commute Impact",
      description: "Try carpooling or public transit twice a week to reduce emissions by 20%",
      icon: Car,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Energy Saving Tips",
      description: "Switch to LED bulbs and save up to 75% on lighting energy costs",
      icon: Lightbulb,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Sustainable Diet",
      description: "Try plant-based meals twice a week to reduce your food carbon footprint",
      icon: Utensils,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Eco-Friendly Shopping",
      description: "Choose products with minimal packaging to reduce waste",
      icon: ShoppingBag,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {suggestions.map((suggestion, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className={`p-2 rounded-full ${suggestion.bgColor}`}>
              <suggestion.icon className={`h-5 w-5 ${suggestion.color}`} />
            </div>
            <CardTitle className="text-base">{suggestion.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{suggestion.description}</CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="ml-auto">
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

