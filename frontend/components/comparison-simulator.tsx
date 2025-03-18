import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ComparisonSimulatorProps {
  category: "transport" | "home" | "food" | "shopping"
}

export default function ComparisonSimulator({ category }: ComparisonSimulatorProps) {
  const comparisons = {
    transport: [
      {
        title: "Car vs. Public Transit",
        current: { name: "Car", value: 120, unit: "kg CO2e/month" },
        alternative: { name: "Public Transit", value: 40, unit: "kg CO2e/month" },
        savings: "67% reduction",
      },
      {
        title: "Regular Car vs. Electric Vehicle",
        current: { name: "Regular Car", value: 120, unit: "kg CO2e/month" },
        alternative: { name: "Electric Vehicle", value: 30, unit: "kg CO2e/month" },
        savings: "75% reduction",
      },
    ],
    home: [
      {
        title: "Standard vs. Energy Efficient Appliances",
        current: { name: "Standard", value: 80, unit: "kg CO2e/month" },
        alternative: { name: "Energy Efficient", value: 45, unit: "kg CO2e/month" },
        savings: "44% reduction",
      },
      {
        title: "Grid Power vs. Solar Panels",
        current: { name: "Grid Power", value: 80, unit: "kg CO2e/month" },
        alternative: { name: "Solar Panels", value: 10, unit: "kg CO2e/month" },
        savings: "88% reduction",
      },
    ],
    food: [
      {
        title: "Meat-Heavy vs. Plant-Based Diet",
        current: { name: "Meat-Heavy", value: 150, unit: "kg CO2e/month" },
        alternative: { name: "Plant-Based", value: 30, unit: "kg CO2e/month" },
        savings: "80% reduction",
      },
      {
        title: "Imported vs. Local Food",
        current: { name: "Imported", value: 100, unit: "kg CO2e/month" },
        alternative: { name: "Local", value: 40, unit: "kg CO2e/month" },
        savings: "60% reduction",
      },
    ],
    shopping: [
      {
        title: "Fast Fashion vs. Sustainable Clothing",
        current: { name: "Fast Fashion", value: 60, unit: "kg CO2e/month" },
        alternative: { name: "Sustainable", value: 15, unit: "kg CO2e/month" },
        savings: "75% reduction",
      },
      {
        title: "Single-Use vs. Reusable Products",
        current: { name: "Single-Use", value: 40, unit: "kg CO2e/month" },
        alternative: { name: "Reusable", value: 5, unit: "kg CO2e/month" },
        savings: "88% reduction",
      },
    ],
  }

  const currentComparisons = comparisons[category]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Comparison</CardTitle>
        <CardDescription>See how different choices affect your carbon footprint</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="comparison1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="comparison1">Comparison 1</TabsTrigger>
            <TabsTrigger value="comparison2">Comparison 2</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison1" className="pt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{currentComparisons[0].title}</h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{currentComparisons[0].current.name}</span>
                    <span>
                      {currentComparisons[0].current.value} {currentComparisons[0].current.unit}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-red-500" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{currentComparisons[0].alternative.name}</span>
                    <span>
                      {currentComparisons[0].alternative.value} {currentComparisons[0].alternative.unit}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${(currentComparisons[0].alternative.value / currentComparisons[0].current.value) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-muted p-3 text-center">
                <span className="text-sm font-medium text-green-500">
                  {currentComparisons[0].savings} in carbon emissions
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison2" className="pt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{currentComparisons[1].title}</h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{currentComparisons[1].current.name}</span>
                    <span>
                      {currentComparisons[1].current.value} {currentComparisons[1].current.unit}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-red-500" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{currentComparisons[1].alternative.name}</span>
                    <span>
                      {currentComparisons[1].alternative.value} {currentComparisons[1].alternative.unit}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${(currentComparisons[1].alternative.value / currentComparisons[1].current.value) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-muted p-3 text-center">
                <span className="text-sm font-medium text-green-500">
                  {currentComparisons[1].savings} in carbon emissions
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

