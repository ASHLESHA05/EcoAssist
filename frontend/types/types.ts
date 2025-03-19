
export interface NotificationType {
  dailyTips: boolean;
  AchievementAlert: boolean;
  FriendActivity: boolean;
}
export interface UserDetails {
    name: string;
    email: string;
    joinedDate: Date;
    Location: string;
    Level: number;
    levelProgress: number;
    profileVisibility: boolean;
  }

export interface DashboardMetricsData{
    carbonFootPrintQty : number;
    PrevMonthCmp : number;
    isIcreaseCarbon : boolean
    RemainingMonthlyGoal: number;

    waterSaved: number;
    waterPrevMonthCmp: number;
    isIcreaseWater: boolean
    waterRemainingMonthlyGoal : number;

    powerSaved : number
    powerPrevMonthCmp : number;
    isIcreasePower : boolean;
    powerRemainingMonthlyGoal: number;

    wasteReduced: number;
    wastePrevMonthCmp: number;
    isIcreaseWaste : boolean
    waseRemainingMonthlyGoal: number

}

export interface CarbonData {
    name: string; // Day, Week, or Month
    carbon: number; // Carbon emission value
  }


export interface CarbonChartProps {
    weeklyData: CarbonData[];
    monthlyData: CarbonData[];
    yearlyData: CarbonData[];
    maxData: CarbonData[];
  }
  


export interface EcoScoreData{
    score: number;
    localTopPercentage  : number
}

export interface Suggestions{
    title : string;
    description: string;
    icon : string;
    color : string;
    bgColor : string;
}

export interface BadgesType{
  name: string;
  description : string;
  color: string
}

export interface Actions{
  title: string;
  icon : string;
  points : number;
}