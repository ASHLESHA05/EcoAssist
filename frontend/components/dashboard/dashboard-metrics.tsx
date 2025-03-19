"use client"
import dynamic from "next/dynamic"

// Dynamically import icons
const ArrowDown = dynamic(() => import("lucide-react").then((mod) => mod.ArrowDown), { ssr: false })
const ArrowUp = dynamic(() => import("lucide-react").then((mod) => mod.ArrowUp), { ssr: false })
const Leaf = dynamic(() => import("lucide-react").then((mod) => mod.Leaf), { ssr: false })
const Droplet = dynamic(() => import("lucide-react").then((mod) => mod.Droplet), { ssr: false })
const Zap = dynamic(() => import("lucide-react").then((mod) => mod.Zap), { ssr: false })
const Recycle = dynamic(() => import("lucide-react").then((mod) => mod.Recycle), { ssr: false })

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardMetricsData } from "@/types/types"
export default function DashboardMetrics({ data }: { data: DashboardMetricsData }) {

  // Dummy data (replace with actual data fetching logic)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Carbon Footprint Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
          <Leaf className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.carbonFootPrintQty} kg</div>
          <p className="text-xs text-muted-foreground">
            <span className={`flex items-center ${data?.isIcreaseCarbon ? "text-red-500" : "text-green-500"}`}>
              {!data?.isIcreaseCarbon ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
              {data?.PrevMonthCmp}% from last month
            </span>
          </p>
          <div className="mt-4 h-1 w-full bg-muted">
            <div className="h-1 w-[65%] bg-primary"></div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{data?.RemainingMonthlyGoal}% of your monthly goal</p>
        </CardContent>
      </Card>

      {/* Water Saved Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Water Saved</CardTitle>
          <Droplet className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.waterSaved} gal</div>
          <p className="text-xs text-muted-foreground">
            <span className={`flex items-center ${data?.isIcreaseWater ? "text-green-500" : "text-red-500"}`}>
              {data?.isIcreaseWater ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
              {data?.waterPrevMonthCmp}% from last month
            </span>
          </p>
          <div className="mt-4 h-1 w-full bg-muted">
            <div className="h-1 w-[75%] bg-blue-500"></div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{data?.waterRemainingMonthlyGoal}% of your monthly goal</p>
        </CardContent>
      </Card>

      {/* Energy Saved Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Energy Saved</CardTitle>
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.powerSaved} kWh</div>
          <p className="text-xs text-muted-foreground">
            <span className={`flex items-center ${data?.isIcreasePower ? "text-green-500" : "text-red-500"}`}>
              {data?.isIcreasePower ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
              {data?.powerPrevMonthCmp}% from last month
            </span>
          </p>
          <div className="mt-4 h-1 w-full bg-muted">
            <div className="h-1 w-[60%] bg-yellow-500"></div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{data?.powerRemainingMonthlyGoal}% of your monthly goal</p>
        </CardContent>
      </Card>

      {/* Waste Reduced Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Waste Reduced</CardTitle>
          <Recycle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.wasteReduced} lbs</div>
          <p className="text-xs text-muted-foreground">
            <span className={`flex items-center ${data?.isIcreaseWaste ? "text-green-500" : "text-red-500"}`}>
              {data?.isIcreaseWaste ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
              {data?.wastePrevMonthCmp}% from last month
            </span>
          </p>
          <div className="mt-4 h-1 w-full bg-muted">
            <div className="h-1 w-[45%] bg-green-500"></div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{data?.waseRemainingMonthlyGoal}% of your monthly goal</p>
        </CardContent>
      </Card>
    </div>
  );
}