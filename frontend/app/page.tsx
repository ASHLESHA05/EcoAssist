import { Sparkles } from "lucide-react"
import DashboardMetrics from "@/components/dashboard/dashboard-metrics"
import CarbonChart from "@/components/dashboard/carbon-chart"
import SuggestionCards from "@/components/dashboard/suggestion-cards"
import EcoScore from "@/components/dashboard/eco-score"
import QuickActions from "@/components/dashboard/quick-actions"
import AchievementBadges from "@/components/dashboard/achievement-badges"
import ProgressTree from "@/components/dashboard/progress-tree"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Track your sustainability journey and reduce your carbon footprint</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <DashboardMetrics />
          <CarbonChart />
          <SuggestionCards />
        </div>
        <div className="space-y-6">
          <EcoScore />
          <QuickActions />
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">AI Assistant</h3>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">Ask me anything about reducing your carbon footprint</p>
            <a href="/chat" className="w-full">
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-4 py-2 text-sm font-medium transition-colors">
                Start a conversation
              </button>
            </a>
          </div>
          <AchievementBadges />
          <ProgressTree />
        </div>
      </div>
    </div>
  )
}

