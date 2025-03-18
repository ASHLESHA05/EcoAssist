"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CarbonChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Carbon Footprint Trends</CardTitle>
            <CardDescription>Track your progress over time</CardDescription>
          </div>
          <Tabs defaultValue="month">
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          {/* This would be a real chart in a production app */}
          <div className="relative h-full w-full">
            <div className="absolute bottom-0 left-0 right-0 top-0 flex items-end justify-between gap-2 pb-2">
              {Array.from({ length: 12 }).map((_, i) => {
                // Generate a random height between 30% and 100%
                const height = 30 + Math.random() * 70
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t-sm bg-primary" style={{ height: `${height}%` }}></div>
                    <span className="text-xs text-muted-foreground">{i + 1}</span>
                  </div>
                )
              })}
            </div>
            <div className="absolute left-0 top-0 h-full border-r border-dashed border-muted-foreground/20 pl-2 text-xs text-muted-foreground">
              <div className="absolute top-0">400kg</div>
              <div className="absolute top-1/4">300kg</div>
              <div className="absolute top-1/2">200kg</div>
              <div className="absolute top-3/4">100kg</div>
              <div className="absolute bottom-0">0kg</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

