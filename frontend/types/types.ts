
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
    weeklyData?: CarbonData[];
    monthlyData?: CarbonData[];
    yearlyData?: CarbonData[];
    maxData?: CarbonData[];
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

export interface AllDetails{
  dashBoardMetrics : DashboardMetricsData;
  chartData : CarbonChartProps;
  ecoscore : EcoScoreData;
  badges: BadgesType[]
  Level : number
}

export interface Transportation{
  transportationMode : string;
  commuteDistance : number;
  flightsCount : "0" | "1-2" | "3-5" | "6+";
}
export interface HomeEnergy{
  energySource : string;
  electricityUsage : number;
  homeSize : "small" | "medium" | "large" | "xlarge";
  heatingType: "gas" | "electric" | "oil" | "heatpump"| "wood"; 

}
export interface FoodConsumption{
  dietType: string;
  localFoodPercentage: number;
  foodWaste : "low" | "medium" | "high"
  OrganicFood : "none" | "some" | "half" | "most" | "all"
}

export interface Shopping{
  shoppingType : string;
  sustainableProducts : number;
  RecyclingHabbits: "none" | "some" | "most" | "all";
  fashionVsustainable: "fast" | "mixed" | "sustainable" | "secondhand" | "minimal"
}

export interface calculator{
  tansport : Transportation
  home : HomeEnergy;
  food : FoodConsumption;
  shopping: Shopping
}

export interface SurveyQuestion {
  id: string
  question: string
  type: "multiple-choice" | "yes-no" | "text" | "number"
  options?: string[]
}