"use client";
import dynamic from "next/dynamic";
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from "next/link";

const Sparkles = dynamic(() => import("lucide-react").then((mod) => mod.Sparkles), { ssr: false });

import DashboardMetrics from "@/components/dashboard/dashboard-metrics";
import CarbonChart from "@/components/dashboard/carbon-chart";
import SuggestionCards from "@/components/dashboard/suggestion-cards";
import EcoScore from "@/components/dashboard/eco-score";
import QuickActions from "@/components/dashboard/quick-actions";
import AchievementBadges from "@/components/dashboard/achievement-badges";
import ProgressTree from "@/components/dashboard/progress-tree";
import { useRouter } from "next/navigation";
import { DashboardMetricsData } from "@/types/types";

// -----------------------------------DUMMY DATA________________________________

const data: DashboardMetricsData = {
    carbonFootPrintQty: 120,
    PrevMonthCmp: 10,
    isIcreaseCarbon: false,
    RemainingMonthlyGoal: 65,

    waterSaved: 500,
    waterPrevMonthCmp: 15,
    isIcreaseWater: true,
    waterRemainingMonthlyGoal: 75,

    powerSaved: 300,
    powerPrevMonthCmp: 5,
    isIcreasePower: true,
    powerRemainingMonthlyGoal: 60,

    wasteReduced: 200,
    wastePrevMonthCmp: 8,
    isIcreaseWaste: false,
    waseRemainingMonthlyGoal: 45,
  };

  const weeklyData = [
    { name: "Mon", carbon: 120 },
    { name: "Tue", carbon: 150 },
    { name: "Wed", carbon: 200 },
    { name: "Thu", carbon: 180 },
    { name: "Fri", carbon: 220 },
    { name: "Sat", carbon: 250 },
    { name: "Sun", carbon: 300 },
  ];
  
  const monthlyData = [
    { name: "Week 1", carbon: 800 },
    { name: "Week 2", carbon: 1200 },
    { name: "Week 3", carbon: 900 },
    { name: "Week 4", carbon: 1100 },
  ];
  
  const yearlyData = [
    { name: "Jan", carbon: 4000 },
    { name: "Feb", carbon: 3000 },
    { name: "Mar", carbon: 3500 },
    { name: "Apr", carbon: 4200 },
    { name: "May", carbon: 5000 },
    { name: "Jun", carbon: 4500 },
    { name: "Jul", carbon: 4700 },
    { name: "Aug", carbon: 4900 },
    { name: "Sep", carbon: 5200 },
    { name: "Oct", carbon: 5500 },
    { name: "Nov", carbon: 6000 },
    { name: "Dec", carbon: 6500 },
  ];
  
  const maxData = [
    { name: "Jan 2024", carbon: 6500 },
    { name: "Feb 2024", carbon: 6000 },
    { name: "Mar 2024", carbon: 5500 },
    { name: "Jan 2024", carbon: 6500 },
    { name: "Feb 2024", carbon: 6000 },
    { name: "Mar 2024", carbon: 5500 },
    { name: "Jan 2024", carbon: 6500 },
    { name: "Feb 2024", carbon: 6000 },
    { name: "Mar 2024", carbon: 5500 },
    { name: "Jan 2024", carbon: 6500 },
    { name: "Feb 2024", carbon: 6000 },
    { name: "Mar 2024", carbon: 5500 },
    { name: "Jan 2024", carbon: 6500 },
    { name: "Feb 2024", carbon: 6000 },
    { name: "Mar 2024", carbon: 5500 },
  ];
const ecoscoredata ={
  score :50,
  localTopPercentage : 2
  
}
const Badges = [
  {
    name: "Early Birddsbuybdsu",
    description: "Joined during beta",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    name: "Power Saver",
    description: "Reduced electricity by 20%",
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    name: "Tree Hugger",
    description: "Planted 5 trees",
    color: "bg-green-500/10 text-green-500",
  },
]

const Level:number =90


//-------------------------------------------------------------------------------

export default function Dashboard() {
  const router = useRouter()
    const { user, error, isLoading } = useUser();
  if (!user && !isLoading){
    router.push('/')
  }

  //---------------------BACKEND Fetch all details an interface is provided------------------------------



  //-------------------------------------------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Track your sustainability journey and reduce your carbon footprint</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <DashboardMetrics
            data = {data}
          />
          <CarbonChart
            weeklyData={weeklyData}
            monthlyData={monthlyData}
            yearlyData={yearlyData}
            maxData={maxData}
          />
          <SuggestionCards />
        </div>
        <div className="space-y-6">
          <EcoScore 
            data ={ecoscoredata}
          />
          <QuickActions />
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">AI Assistant</h3>
              {Sparkles && <Sparkles className="h-4 w-4 text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground mb-4">Ask me anything about reducing your carbon footprint</p>
            <Link href="/chat">
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-4 py-2 text-sm font-medium transition-colors">
                Start a conversation
              </button>
            </Link>
          </div>
          <AchievementBadges
            badges={Badges}
          />
          <ProgressTree
            level ={Level}
          />
        </div>
      </div>
    </div>
  );
}
