import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProgressTree({level} : {level :number}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sustainability Tree</CardTitle>
        <CardDescription>Watch your impact grow</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="relative h-[200px] w-[200px]">
          {/* This would be a more complex SVG tree in a real app */}
          <svg viewBox="0 0 200 200" className="h-full w-full">
            {/* Tree trunk */}
            <path d="M95 200 L95 120 Q95 100 100 90 Q105 80 105 60 L105 200 Z" fill="#8B4513" />

            {/* Tree branches */}
            <path
              d="M100 90 Q80 80 60 85 Q70 70 85 75 Q75 60 60 55 Q80 50 90 60 Q100 40 110 60 Q120 50 140 55 Q125 60 115 75 Q130 70 140 85 Q120 80 100 90"
              fill="#2F4F2F"
            />

            {/* Tree leaves - these would be dynamic based on user progress */}
            <circle cx="70" cy="60" r="10" fill="#4CAF50" />
            <circle cx="90" cy="50" r="12" fill="#4CAF50" />
            <circle cx="110" cy="50" r="12" fill="#4CAF50" />
            <circle cx="130" cy="60" r="10" fill="#4CAF50" />
            <circle cx="65" cy="80" r="8" fill="#4CAF50" />
            <circle cx="135" cy="80" r="8" fill="#4CAF50" />
            <circle cx="100" cy="40" r="10" fill="#4CAF50" />
          </svg>

          {/* Progress indicators */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
            <div className="text-xs text-muted-foreground">Level {level}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

