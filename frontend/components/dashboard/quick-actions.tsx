"use client"
import dynamic from "next/dynamic"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useEffect, useState } from "react"
import axios from "axios"
import { Actions } from "@/types/types"
// import { Car, Lightbulb, Recycle, ShoppingBag } from "lucide-react"

const Car = dynamic(() => import("lucide-react").then((mod) => mod.Car), { ssr: false })
const Lightbulb = dynamic(() => import("lucide-react").then((mod) => mod.Lightbulb), { ssr: false })
const Recycle = dynamic(() => import("lucide-react").then((mod) => mod.Recycle), { ssr: false })
const ShoppingBag = dynamic(() => import("lucide-react").then((mod) => mod.ShoppingBag), { ssr: false })


const actions_ :Actions[] = [
  {
    title: "Log a car-free day",
    icon: Car,
    points: 5,
  },
  {
    title: "Record energy savings",
    icon: Lightbulb,
    points: 3,
  },
  {
    title: "Log recycling activity",
    icon: Recycle,
    points: 2,
  },
  {
    title: "Add sustainable purchase",
    icon: ShoppingBag,
    points: 2,
  },
]

export default function QuickActions() {
  const [actions, setActions] = useState<Actions[]>(actions_);
  const {user,error,isLoading} = useUser()

  // This is a behavioural model the things are given by GEN AI model on user behaviour
  //When the points are clicked it has to update points in the other page also ...so update to db 
  useEffect(()=>{
    async function getActions(){
    try{
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/get-Actions`,
      {
        params:{
          email : user?.email
        },
        timeout: 5000
      }
      )
      if (res.status === 200){
          setActions(res.data)
      }

    }catch(error){

    }
  }
  getActions()
  },[user])

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

