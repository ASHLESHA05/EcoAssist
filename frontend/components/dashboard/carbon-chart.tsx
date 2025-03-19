"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { CarbonChartProps, CarbonData } from "@/types/types";


export default function CarbonChart({
  weeklyData = [],
  monthlyData = [],
  yearlyData = [],
  maxData = [],
}: CarbonChartProps)  {
  const [timePeriod, setTimePeriod] = useState<string>("month");

  // console.log("Weekly Data:", weeklyData);
  // console.log("Monthly Data:", monthlyData);
  // console.log("Yearly Data:", yearlyData);
  // console.log("Max Data:", maxData);
  // Calculate max carbon value for the selected dataset
  const calculateMaxCarbon = (data: CarbonData[]) =>
    Math.max(...data?.map((entry) => entry.carbon));

  // Select data based on the timePeriod
  const data =
    timePeriod === "week"
      ? weeklyData
      : timePeriod === "month"
      ? monthlyData
      : timePeriod === "year"
      ? yearlyData
      : maxData;

  const maxCarbon = calculateMaxCarbon(data);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Carbon Footprint Trends</CardTitle>
            <CardDescription>Track your progress over time</CardDescription>
          </div>
          <Tabs defaultValue="month" onValueChange={(value) => setTimePeriod(value)}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
              <TabsTrigger value="max">Max</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}kg`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff", border: "none", borderRadius: "8px" }}
                labelStyle={{ color: "#000000" }}
              />
              <Bar dataKey="carbon" fill="#10b981" radius={[4, 4, 0, 0]} />
              {/* Reference line for max carbon */}
              <ReferenceLine
                y={maxCarbon}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{
                  value: `Max: ${maxCarbon}kg`,
                  position: "top",
                  fill: "#ef4444",
                  fontSize: 12,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}