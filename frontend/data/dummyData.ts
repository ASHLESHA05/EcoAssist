import { DashboardMetricsData } from "@/types/types";

export const data: DashboardMetricsData = {
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
  
  export const weeklyData = [
    { name: "Mon", carbon: 120 },
    { name: "Tue", carbon: 150 },
    { name: "Wed", carbon: 200 },
    { name: "Thu", carbon: 180 },
    { name: "Fri", carbon: 220 },
    { name: "Sat", carbon: 250 },
    { name: "Sun", carbon: 300 },
  ];
  
  export const monthlyData = [
    { name: "Week 1", carbon: 800 },
    { name: "Week 2", carbon: 1200 },
    { name: "Week 3", carbon: 900 },
    { name: "Week 4", carbon: 1100 },
  ];
  
  export const yearlyData = [
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
  
  export const maxData = [
    { name: "Jan 2024", carbon: 6500 },
    { name: "Feb 2024", carbon: 6000 },
    { name: "Mar 2024", carbon: 5500 },
  ];
  
  export const ecoscoredata = {
    score: 50,
    localTopPercentage: 2,
  };
  
  export const Badges = [
    {
      name: "Early Bird",
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
  ];
  
  export const Level: number = 90;
  