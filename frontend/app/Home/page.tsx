"use client";
import dynamic from "next/dynamic";
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useScoreStore } from "@/stores/useScoreStore";

const Sparkles = dynamic(() => import("lucide-react").then((mod) => mod.Sparkles), { ssr: false });

import DashboardMetrics from "@/components/dashboard/dashboard-metrics";
import CarbonChart from "@/components/dashboard/carbon-chart";
import SuggestionCards from "@/components/dashboard/suggestion-cards";
import EcoScore from "@/components/dashboard/eco-score";
import QuickActions from "@/components/dashboard/quick-actions";
import AchievementBadges from "@/components/dashboard/achievement-badges";
import ProgressTree from "@/components/dashboard/progress-tree";
import { AllDetails, DashboardMetricsData } from "@/types/types";
import axios from "axios";
import { Badges, data, ecoscoredata, Level, maxData, monthlyData, weeklyData, yearlyData } from "@/data/dummyData";

// -----------------------------------DUMMY DATA________________________________

const dymmy_details:AllDetails = {
    dashBoardMetrics : data,
    chartData : {
      weeklyData: weeklyData,
      monthlyData: monthlyData,
      yearlyData : yearlyData,
      maxData : maxData
    },
    ecoscore : ecoscoredata,
    badges: Badges,
    Level : Level
}
//-------------------------------------------------------------------------------



export default function Dashboard() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const { score } = useScoreStore();
  const [allData , setData] = useState<AllDetails>(dymmy_details)


  if (!user && !isLoading) {
    router.push('/');
  }





  //------------------------------------BACKEND CODE----(fetch-all-details)---------------
  async function fetchAllDetails() {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/get-all-details`, {
        params: { email: user?.email }
      });
  
      if (res.status === 200){
        console.log("Mining Successful")
        setData(res.data)
      }
      else{
        console.log("Unable to fetch")
        setData(dymmy_details)
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  }
  useEffect(()=>{
    fetchAllDetails();

  },[user])
  
  console.log(dymmy_details)
  console.log(allData)
  
  const Score = {
    score: score || allData?.ecoscore?.score, // Use score directly from Zustand
    localTopPercentage: ecoscoredata.localTopPercentage,
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Track your sustainability journey and reduce your carbon footprint</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <DashboardMetrics data={allData?.dashBoardMetrics} />
          <CarbonChart
            weeklyData={allData?.chartData?.weeklyData || dymmy_details.chartData.weeklyData}
            monthlyData={allData?.chartData?.monthlyData || []}
            yearlyData={allData?.chartData?.yearlyData || []}
            maxData={allData?.chartData?.maxData || []}
          />
          <SuggestionCards />
        </div>
        <div className="space-y-6">
          <EcoScore data={Score} />
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
          <AchievementBadges badges={allData?.badges} />
          <ProgressTree level={allData?.Level} />
        </div>
      </div>
    </div>
  );
}