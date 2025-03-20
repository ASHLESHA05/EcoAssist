import { NextResponse } from "next/server"

export async function GET() {
  const tips = [
    {
      title: "World Water Day",
      description: "Today is World Water Day. Save water, save life. Use water wisely.",
      quote: "Water is life. Don't waste it.",
    },
    {
      title: "Reduce Carbon Footprint",
      description: "Switch to renewable energy sources to reduce your carbon footprint.",
      quote: "Go green for a cleaner tomorrow.",
    },
    {
      title: "Air Quality Alert",
      description: "The air quality is poor today. Avoid outdoor activities and use air purifiers.",
      quote: "Breathe clean, stay healthy.",
    },
  ]

  const randomTip = tips[Math.floor(Math.random() * tips.length)]
  return NextResponse.json(randomTip)
}