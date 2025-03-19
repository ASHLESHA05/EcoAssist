"use client"

import { useEffect, useState } from "react"

interface CarbonImpactChartProps {
  data: {
    name: string
    value: number
  }[]
}

export default function CarbonImpactChart({ data }: CarbonImpactChartProps) {
  // Use state to ensure the chart only renders on the client
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-[200px] w-[200px] mx-auto bg-muted/20 rounded-full"></div>
  }

  const total = data.reduce((acc, item) => acc + item.value, 0)
  let startAngle = 0

  return (
    <div className="relative h-[200px] w-[200px] mx-auto">
      <svg viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100
          const angle = (percentage / 100) * 360
          const endAngle = startAngle + angle

          // Calculate the SVG arc path
          const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180)
          const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180)
          const x2 = 50 + 40 * Math.cos((Math.PI * endAngle) / 180)
          const y2 = 50 + 40 * Math.sin((Math.PI * endAngle) / 180)

          // Determine if the arc should be drawn as a large arc
          const largeArcFlag = angle > 180 ? 1 : 0

          // Create the path for the arc
          const path = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

          // Determine the color based on the index
          const colors = ["hsl(var(--primary))", "#3B82F6", "#10B981", "#F59E0B"]
          const color = colors[index % colors.length]

          // Update the start angle for the next segment
          startAngle = endAngle

          return <path key={index} d={path} fill={color} />
        })}
      </svg>
    </div>
  )
}

