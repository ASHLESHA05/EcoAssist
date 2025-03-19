// components/dashboard/eco-score.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useScoreStore } from "@/stores/useScoreStore";

export default function EcoScore({ data }: { data: { localTopPercentage: number } }) {
  const { score } = useScoreStore(); // Subscribe to the score state
  const circumference = 2 * Math.PI * 40;
  const [offset, setOffset] = useState(circumference - (score / 100) * circumference);

  useEffect(() => {
    setOffset(circumference - (score / 100) * circumference);
  }, [score]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Eco Score</CardTitle>
        <CardDescription>How sustainable is your lifestyle?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center eco-score-place">
        <div className="relative flex items-center justify-center">
          <svg width="120" height="120" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute text-3xl font-bold">{score}</div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm font-medium">Great progress!</p>
          <p className="text-xs text-muted-foreground">Top {data.localTopPercentage}% in your area</p>
        </div>
        <div className="mt-6 w-full grid grid-cols-3 text-center">
          <div>
            <div className="text-sm font-medium">0-40</div>
            <div className="text-xs text-muted-foreground">Beginner</div>
          </div>
          <div>
            <div className="text-sm font-medium">41-70</div>
            <div className="text-xs text-muted-foreground">Intermediate</div>
          </div>
          <div>
            <div className="text-sm font-medium">71-100</div>
            <div className="text-xs text-muted-foreground">Advanced</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}