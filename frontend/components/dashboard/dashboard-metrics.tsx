"use client"
import dynamic from "next/dynamic"

// import { ArrowDown, ArrowUp, Leaf, Droplet, Zap, Recycle } from "lucide-react"

const ArrowDown = dynamic(() => import("lucide-react").then((mod) => mod.ArrowDown), { ssr: false })
const ArrowUp = dynamic(() => import("lucide-react").then((mod) => mod.ArrowUp), { ssr: false })
const Leaf = dynamic(() => import("lucide-react").then((mod) => mod.Leaf), { ssr: false })
const Droplet = dynamic(() => import("lucide-react").then((mod) => mod.Droplet), { ssr: false })
const Zap = dynamic(() => import("lucide-react").then((mod) => mod.Zap), { ssr: false })
const Recycle = dynamic(() => import("lucide-react").then((mod) => mod.Recycle), { ssr: false })

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
          <Leaf className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">302 kg</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              <ArrowDown className="mr-1 h-4 w-4" />
              12% from last month
            </span>
          </p>
          <div className="mt-4 h-1 w-full bg-muted">
            <div className="h-1 w-[65%] bg-primary"></div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">65% of your monthly goal</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Water Saved</CardTitle>
          <Droplet className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">487 gal</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              <ArrowUp className="mr-1 h-4 w-4" />
              8% from last month
            </span>
          </p>
          <div className="mt-4 h-1 w-full bg-muted">
            <div className="h-1 w-[75%] bg-blue-500"></div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">75% of your monthly goal</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Energy Saved</CardTitle>
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">124 kWh</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              <ArrowUp className="mr-1 h-4 w-4" />
              15% from last month
            </span>
          </p>
          <div className="mt-4 h-1 w-full bg-muted">
            <div className="h-1 w-[60%] bg-yellow-500"></div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">60% of your monthly goal</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Waste Reduced</CardTitle>
          <Recycle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18 lbs</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500 flex items-center">
              <ArrowDown className="mr-1 h-4 w-4" />
              3% from last month
            </span>
          </p>
          <div className="mt-4 h-1 w-full bg-muted">
            <div className="h-1 w-[45%] bg-green-500"></div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">45% of your monthly goal</p>
        </CardContent>
      </Card>
    </div>
  )
}

