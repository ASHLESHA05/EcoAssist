"use client";

import { useEffect, useState } from "react";
import { Car, Home, ShoppingBag, Utensils, Plane } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CarbonImpactChart from "@/components/calculator/carbon-impact-chart";
import ComparisonSimulator from "@/components/calculator/comparison-simulator";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { calculator } from "@/types/types";
import ReductionPlanModal from "@/components/ReductionPlanModel";
import { Input } from "@/components/ui/input";

// Define the interfaces
export interface Transportation {
  transportationMode: string;
  commuteDistance: number;
  flightsCount: number;
}

export interface HomeEnergy {
  energySource: string;
  electricityUsage: number;
  homeSize: "small" | "medium" | "large" | "xlarge";
  heatingType: "gas" | "electric" | "oil" | "heatpump" | "wood";
}

export interface FoodConsumption {
  dietType: string;
  localFoodPercentage: number;
  foodWaste: "low" | "medium" | "high";
  OrganicFood: "none" | "some" | "half" | "most" | "all";
}

export interface Shopping {
  shoppingType: string;
  sustainableProducts: number;
  RecyclingHabbits: "none" | "some" | "most" | "all";
  fashionVsustainable:
    | "fast"
    | "mixed"
    | "sustainable"
    | "secondhand"
    | "minimal";
}

export interface Calculator {
  transport: Transportation;
  home: HomeEnergy;
  food: FoodConsumption;
  shopping: Shopping;
}

export default function CalculatorPage() {
  const { user, error, isLoading } = useUser();
  // State for emissions
  const [transportEmissions, setTransportEmissions] = useState(120);
  const [homeEmissions, setHomeEmissions] = useState(80);
  const [foodEmissions, setFoodEmissions] = useState(60);
  const [shoppingEmissions, setShoppingEmissions] = useState(40);

  // State for form inputs
  const [transport, setTransport] = useState<Transportation>({
    transportationMode: "car",
    commuteDistance: 12,
    flightsCount: 1, // Default value as a number
  });

  const [home, setHome] = useState<HomeEnergy>({
    energySource: "grid",
    electricityUsage: 80,
    homeSize: "medium",
    heatingType: "electric",
  });

  const [food, setFood] = useState<FoodConsumption>({
    dietType: "mixed",
    localFoodPercentage: 50,
    foodWaste: "medium",
    OrganicFood: "some",
  });

  const [shopping, setShopping] = useState<Shopping>({
    shoppingType: "moderate",
    sustainableProducts: 50,
    RecyclingHabbits: "most",
    fashionVsustainable: "mixed",
  });

  // Total emissions
  const [TotalCarbon, setCarbontotal] = useState(
    transportEmissions + homeEmissions + foodEmissions + shoppingEmissions
  );
  const [paramsData, setParams] = useState<Calculator | any>({
    transport: transport,
    home: home,
    food: food,
    shopping: shopping,
  });
  const [showReductionPlanModal, setShowReductionPlanModal] =
    useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const checkSubscription = async () => {
    try {
      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"
        }/check-subscription`,
        {
          params: {
            email: user?.email,
          },
        }
      );
      if (res.status === 200) {
        setIsSubscribed(res.data.isSubscribed || false); // Update subscription status
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  // Fetch subscription status when the component mounts or user changes

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"
          }/get-calcData`,
          {
            params: {
              email: user?.email,
            },
          }
        );
        console.log("Data received:", res.data);
        if (res.status === 200) {
          console.log("Good result");
          setTransport(res.data.transportData || transport);
          setHome(res.data.homeData || home);
          setFood(res.data.foodData || food);
          setShopping(res.data.shoppingData || shopping);
          setTransportEmissions(
            res.data.emissionData?.transport || transportEmissions
          );
          setFoodEmissions(res.data.emissionData?.food || foodEmissions);
          setHomeEmissions(res.data.emissionData?.home || homeEmissions);
          setShoppingEmissions(
            res.data.emissionData?.shopping || shoppingEmissions
          );
          setCarbontotal(
            (res.data.emissionData?.transport || transportEmissions) +
              (res.data.emissionData?.home || homeEmissions) +
              (res.data.emissionData?.food || foodEmissions) +
              (res.data.emissionData?.shopping || shoppingEmissions)
          );
          setParams({
            transport: res.data.transportData || transport,
            home: res.data.homeData || home,
            food: res.data.foodData || food,
            shopping: res.data.shoppingData || shopping,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user?.email) {
      getData();
      checkSubscription();
    }
  }, [user?.email]);

  // Save changes function
  const handleSaveChanges = (category: keyof Calculator) => {
    console.log("Handle Changes clicked");
    const calculator: Calculator = {
      transport,
      home,
      food,
      shopping,
    };

    // Call the SaveChanges function with the calculator object
    SaveChanges(calculator[category], category);
  };

  const SaveChanges = async (
    data: Transportation | HomeEnergy | FoodConsumption | Shopping,
    category: string
  ) => {
    console.log("Saving changes:", data);
    try {
      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"
        }/calculate-carbon-update`,
        {
          params: {
            email: user?.email,
            transportdata: JSON.stringify(category === "transport" ? data : transport),
            homedata: JSON.stringify(category === "home" ? data : home),
            fooddata: JSON.stringify(category === "food" ? data : food),
            shoppingdata: JSON.stringify(category === "shopping" ? data : shopping),
          },
        }
      );
  
      if (res.status === 200) {
        console.log("Calculated Data");
        setTransportEmissions(res.data.emissionData.transport);
        setFoodEmissions(res.data.emissionData.food);
        setHomeEmissions(res.data.emissionData.home);
        setShoppingEmissions(res.data.emissionData.shopping);
        setParams({
          transport: category === "transport" ? data : transport,
          home: category === "home" ? data : home,
          food: category === "food" ? data : food,
          shopping: category === "shopping" ? data : shopping,
        });
      }
    } catch (error) {
      console.error("An error occurred in saveChanges ", error);
    }
  };

  const handleCalculate = async (type: string) => {
    console.log("Calculating");
    try {
      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"
        }/calculate-carbon`,
        {
          params: {
            email: user?.email,
            transportdata: JSON.stringify(transport),
            homedata: JSON.stringify(home),
            fooddata: JSON.stringify(food),
            shoppingdata: JSON.stringify(shopping),
          },
        }
      );
      if (res.status === 200) {
        // Round emissions to 2 decimal places
        const transportEmissionsRounded = parseFloat(res.data.emissionData.transport.toFixed(2));
        const foodEmissionsRounded = parseFloat(res.data.emissionData.food.toFixed(2));
        const homeEmissionsRounded = parseFloat(res.data.emissionData.home.toFixed(2));
        const shoppingEmissionsRounded = parseFloat(res.data.emissionData.shopping.toFixed(2));
      
        // Set the rounded values to state
        setTransportEmissions(transportEmissionsRounded);
        setFoodEmissions(foodEmissionsRounded);
        setHomeEmissions(homeEmissionsRounded);
        setShoppingEmissions(shoppingEmissionsRounded);
      
        // Calculate and round the total emissions
        const totalCarbonRounded = parseFloat(
          (
            transportEmissionsRounded +
            homeEmissionsRounded +
            foodEmissionsRounded +
            shoppingEmissionsRounded
          ).toFixed(2)
        );
      
        // Set the rounded total to state
        setCarbontotal(totalCarbonRounded);
      } else {
        console.log("Something went wrong in calculating");
      }
    } catch (error) {
      console.error("Error in Calculating ", error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Carbon Calculator</h1>
        <p className="text-muted-foreground">
          Estimate and track your carbon footprint
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="transport">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="transport">
                <Car className="h-4 w-4 mr-2" />
                Transport
              </TabsTrigger>
              <TabsTrigger value="home">
                <Home className="h-4 w-4 mr-2" />
                Home
              </TabsTrigger>
              <TabsTrigger value="food">
                <Utensils className="h-4 w-4 mr-2" />
                Food
              </TabsTrigger>
              <TabsTrigger value="shopping">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shopping
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transport" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transportation</CardTitle>
                  <CardDescription>
                    Calculate emissions from your daily commute and travel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Primary mode of transportation</Label>
                    <RadioGroup
                      defaultValue="car"
                      className="grid grid-cols-2 gap-4"
                      onValueChange={(value) =>
                        setTransport({
                          ...transport,
                          transportationMode: value,
                        })
                      }
                    >
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="car" id="car" />
                        <Label htmlFor="car" className="flex items-center">
                          <Car className="h-4 w-4 mr-2" />
                          Car
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public" className="flex items-center">
                          <Plane className="h-4 w-4 mr-2" />
                          Public Transit
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="bike" id="bike" />
                        <Label htmlFor="bike" className="flex items-center">
                          <Car className="h-4 w-4 mr-2" />
                          Bicycle
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="walk" id="walk" />
                        <Label htmlFor="walk" className="flex items-center">
                          <Car className="h-4 w-4 mr-2" />
                          Walking
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Daily commute distance (miles)</Label>
                      <span className="text-sm font-medium">
                        {transport.commuteDistance} miles
                      </span>
                    </div>
                    <Slider
                      defaultValue={[transport.commuteDistance]}
                      max={50}
                      step={1}
                      onValueChange={(value) => {
                        setTransport({
                          ...transport,
                          commuteDistance: value[0],
                        });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Flights per year</Label>
                    <Input
                      type="number"
                      value={transport.flightsCount}
                      onChange={(e) =>
                        setTransport({
                          ...transport,
                          flightsCount: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      min={0}
                      placeholder="Enter number of flights"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button onClick={() => handleSaveChanges("transport")}>
                    Save Transportation Data
                  </Button>
                  <Button
                    onClick={() => handleCalculate("transport")}
                    className="bg-black text-white"
                  >
                    Calculate
                  </Button>
                </CardFooter>
              </Card>
              <ComparisonSimulator category="transport" />
            </TabsContent>

            <TabsContent value="home" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Home Energy</CardTitle>
                  <CardDescription>
                    Calculate emissions from your home energy usage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Home energy source</Label>
                    <RadioGroup
                      defaultValue="grid"
                      className="grid grid-cols-2 gap-4"
                      onValueChange={(value) =>
                        setHome({ ...home, energySource: value })
                      }
                    >
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="grid" id="grid" />
                        <Label htmlFor="grid" className="flex items-center">
                          <Home className="h-4 w-4 mr-2" />
                          Standard Grid
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="green" id="green" />
                        <Label htmlFor="green" className="flex items-center">
                          <Home className="h-4 w-4 mr-2" />
                          Green Energy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="solar" id="solar" />
                        <Label htmlFor="solar" className="flex items-center">
                          <Home className="h-4 w-4 mr-2" />
                          Solar Panels
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="mixed" id="mixed" />
                        <Label htmlFor="mixed" className="flex items-center">
                          <Home className="h-4 w-4 mr-2" />
                          Mixed Sources
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Monthly electricity usage (kWh)</Label>
                      <span className="text-sm font-medium">
                        {home.electricityUsage} kWh
                      </span>
                    </div>
                    <Slider
                      defaultValue={[home.electricityUsage]}
                      max={200}
                      step={1}
                      onValueChange={(value) => {
                        setHome({ ...home, electricityUsage: value[0] });
                        // setHomeEmissions(value[0])
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Home size</Label>
                    <Select
                      defaultValue="medium"
                      onValueChange={(value) =>
                        setHome({
                          ...home,
                          homeSize: value as
                            | "small"
                            | "medium"
                            | "large"
                            | "xlarge",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select home size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">
                          Small apartment (&lt; 800 sq ft)
                        </SelectItem>
                        <SelectItem value="medium">
                          Medium home (800-1500 sq ft)
                        </SelectItem>
                        <SelectItem value="large">
                          Large home (1500-3000 sq ft)
                        </SelectItem>
                        <SelectItem value="xlarge">
                          Very large home (&gt; 3000 sq ft)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Heating type</Label>
                    <Select
                      defaultValue="gas"
                      onValueChange={(value) =>
                        setHome({
                          ...home,
                          heatingType: value as
                            | "gas"
                            | "electric"
                            | "oil"
                            | "heatpump"
                            | "wood",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select heating type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gas">Natural Gas</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="oil">Oil</SelectItem>
                        <SelectItem value="heatpump">Heat Pump</SelectItem>
                        <SelectItem value="wood">Wood/Pellet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveChanges("home")}>
                    Save Home Energy Data
                  </Button>
                  <Button
                    onClick={() => handleCalculate("home")}
                    className="bg-black text-white"
                  >
                    Calculate
                  </Button>
                </CardFooter>
              </Card>

              <ComparisonSimulator category="home" />
            </TabsContent>

            <TabsContent value="food" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Food Consumption</CardTitle>
                  <CardDescription>
                    Calculate emissions from your diet and food choices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Diet type</Label>
                    <RadioGroup
                      defaultValue="mixed"
                      className="grid grid-cols-2 gap-4"
                      onValueChange={(value) =>
                        setFood({ ...food, dietType: value })
                      }
                    >
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="meat" id="meat" />
                        <Label htmlFor="meat" className="flex items-center">
                          <Utensils className="h-4 w-4 mr-2" />
                          Meat Heavy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="mixed" id="mixed" />
                        <Label htmlFor="mixed" className="flex items-center">
                          <Utensils className="h-4 w-4 mr-2" />
                          Mixed Diet
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="vegetarian" id="vegetarian" />
                        <Label
                          htmlFor="vegetarian"
                          className="flex items-center"
                        >
                          <Utensils className="h-4 w-4 mr-2" />
                          Vegetarian
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="vegan" id="vegan" />
                        <Label htmlFor="vegan" className="flex items-center">
                          <Utensils className="h-4 w-4 mr-2" />
                          Vegan
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Local food percentage</Label>
                      <span className="text-sm font-medium">
                        {food.localFoodPercentage}%
                      </span>
                    </div>
                    <Slider
                      defaultValue={[food.localFoodPercentage]}
                      max={100}
                      step={5}
                      onValueChange={(value) => {
                        setFood({ ...food, localFoodPercentage: value[0] });
                        // setFoodEmissions(value[0])
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Food waste</Label>
                    <Select
                      defaultValue="medium"
                      onValueChange={(value) =>
                        setFood({
                          ...food,
                          foodWaste: value as "low" | "medium" | "high",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select waste level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          Low (&lt; 10% wasted)
                        </SelectItem>
                        <SelectItem value="medium">
                          Medium (10-25% wasted)
                        </SelectItem>
                        <SelectItem value="high">
                          High (&gt; 25% wasted)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Organic food consumption</Label>
                    <Select
                      defaultValue="some"
                      onValueChange={(value) =>
                        setFood({
                          ...food,
                          OrganicFood: value as
                            | "none"
                            | "some"
                            | "half"
                            | "most"
                            | "all",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select organic consumption" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (0%)</SelectItem>
                        <SelectItem value="some">Some (25%)</SelectItem>
                        <SelectItem value="half">Half (50%)</SelectItem>
                        <SelectItem value="most">Most (75%)</SelectItem>
                        <SelectItem value="all">All (100%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveChanges("food")}>
                    Save Food Data
                  </Button>
                  <Button
                    onClick={() => handleCalculate("food")}
                    className="bg-black text-white"
                  >
                    Calculate
                  </Button>
                </CardFooter>
              </Card>

              <ComparisonSimulator category="food" />
            </TabsContent>

            <TabsContent value="shopping" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shopping & Consumption</CardTitle>
                  <CardDescription>
                    Calculate emissions from your purchases and consumption
                    habits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Shopping frequency</Label>
                    <RadioGroup
                      defaultValue="moderate"
                      className="grid grid-cols-2 gap-4"
                      onValueChange={(value) =>
                        setShopping({ ...shopping, shoppingType: value })
                      }
                    >
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="minimal" id="minimal" />
                        <Label htmlFor="minimal" className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Minimal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <Label htmlFor="moderate" className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Moderate
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="frequent" id="frequent" />
                        <Label htmlFor="frequent" className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Frequent
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="heavy" id="heavy" />
                        <Label htmlFor="heavy" className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Heavy
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Sustainable products percentage</Label>
                      <span className="text-sm font-medium">
                        {shopping.sustainableProducts}%
                      </span>
                    </div>
                    <Slider
                      defaultValue={[shopping.sustainableProducts]}
                      max={100}
                      step={5}
                      onValueChange={(value) => {
                        setShopping({
                          ...shopping,
                          sustainableProducts: value[0],
                        });
                        // setShoppingEmissions(value[0])
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Recycling habits</Label>
                    <Select
                      defaultValue="most"
                      onValueChange={(value) =>
                        setShopping({
                          ...shopping,
                          RecyclingHabbits: value as
                            | "none"
                            | "some"
                            | "most"
                            | "all",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recycling level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          None (Don't recycle)
                        </SelectItem>
                        <SelectItem value="some">
                          Some (Basic recycling)
                        </SelectItem>
                        <SelectItem value="most">
                          Most (Regular recycling)
                        </SelectItem>
                        <SelectItem value="all">
                          All (Zero waste lifestyle)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Fast fashion vs. sustainable clothing</Label>
                    <Select
                      defaultValue="mixed"
                      onValueChange={(value) =>
                        setShopping({
                          ...shopping,
                          fashionVsustainable: value as
                            | "fast"
                            | "mixed"
                            | "sustainable"
                            | "secondhand"
                            | "minimal",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select clothing habits" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fast">
                          Mostly fast fashion
                        </SelectItem>
                        <SelectItem value="mixed">Mix of both</SelectItem>
                        <SelectItem value="sustainable">
                          Mostly sustainable
                        </SelectItem>
                        <SelectItem value="secondhand">
                          Mostly secondhand
                        </SelectItem>
                        <SelectItem value="minimal">
                          Minimal new purchases
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveChanges("shopping")}>
                    Save Shopping Data
                  </Button>
                  <Button
                    onClick={() => handleCalculate("shopping")}
                    className="bg-black text-white"
                  >
                    Calculate
                  </Button>
                </CardFooter>
              </Card>

              <ComparisonSimulator category="shopping" />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Carbon Footprint</CardTitle>
              <CardDescription>
                Based on your current lifestyle choices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold">{TotalCarbon}</div>
                <div className="text-sm text-muted-foreground">
                  kg CO2e per month
                </div>
              </div>
              <CarbonImpactChart
                data={[
                  { name: "Transport", value: transportEmissions },
                  { name: "Home", value: homeEmissions },
                  { name: "Food", value: foodEmissions },
                  { name: "Shopping", value: shoppingEmissions },
                ]}
              />
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                    <span>Transport</span>
                  </div>
                  <span className="font-medium">{transportEmissions} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Home</span>
                  </div>
                  <span className="font-medium">{homeEmissions} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Food</span>
                  </div>
                  <span className="font-medium">{foodEmissions} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span>Shopping</span>
                  </div>
                  <span className="font-medium">{shoppingEmissions} kg</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reduction Potential</CardTitle>
              <CardDescription>
                How much you could reduce with small changes
              </CardDescription>
            </CardHeader>

            {/* [HERE MAKE SOME CHANGES ..USE GEN AI TO PREDICT THE AMOUT THE THINGS CAN BE CHANGED..ABOUT HOW MUCH % THE CARBON EMISSION CAN BE REDUCED] */}
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current footprint</span>
                    <span>{TotalCarbon} kg/month</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-full"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>With easy changes</span>
                    <span>{Math.round(TotalCarbon * 0.8)} kg/month</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-[80%]"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>With moderate changes</span>
                    <span>{Math.round(TotalCarbon * 0.6)} kg/month</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-[60%]"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>With significant changes</span>
                    <span>{Math.round(TotalCarbon * 0.4)} kg/month</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full w-[40%]"></div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                onClick={() => setShowReductionPlanModal(true)}
              >
                Get Personalized Reduction Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      {showReductionPlanModal && (
        <ReductionPlanModal
          email={user?.email || ""}
          onClose={() => setShowReductionPlanModal(false)}
          isSubscribed={isSubscribed}
        />
      )}
    </div>
  );
}
