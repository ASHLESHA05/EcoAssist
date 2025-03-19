"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { Actions } from "@/types/types";
import CoinAnimation from "./coin-animation";
import { useScoreStore } from "@/stores/useScoreStore";
import dynamic from "next/dynamic";

const Car = dynamic(() => import("lucide-react").then((mod) => mod.Car), { ssr: false });
const Lightbulb = dynamic(() => import("lucide-react").then((mod) => mod.Lightbulb), { ssr: false });
const Recycle = dynamic(() => import("lucide-react").then((mod) => mod.Recycle), { ssr: false });
const ShoppingBag = dynamic(() => import("lucide-react").then((mod) => mod.ShoppingBag), { ssr: false });

const actions_: Actions[] = [
  {
    title: "Log a car-free day",
    icon: "Car",
    points: 5,
  },
  {
    title: "Record energy savings",
    icon: "Lightbulb",
    points: 3,
  },
  {
    title: "Log recycling activity",
    icon: "Recycle",
    points: 2,
  },
  {
    title: "Add sustainable purchase",
    icon: "ShoppingBag",
    points: 2,
  },
];

export default function QuickActions() {
  const [actions, setActions] = useState<Actions[]>(actions_);
  const [showCoin, setShowCoin] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const { user } = useUser();
  const { updateScore } = useScoreStore();
  const [disabledActions, setDisabledActions] = useState<Record<string, boolean>>({});

  // Load disabled actions from localStorage on component mount
  useEffect(() => {
    const storedDisabledActions = localStorage.getItem("disabledActions");
    if (storedDisabledActions) {
      setDisabledActions(JSON.parse(storedDisabledActions));
    }
  }, []);

  // Fetch actions from the backend
  useEffect(() => {
    async function getActions() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/get-Actions`,
          {
            params: {
              email: user?.email,
            },
            timeout: 5000,
          }
        );
        if (res.status === 200) {
          setActions(res.data);
        }
      } catch (error) {
        console.error("Error fetching actions:", error);
      }
    }
    getActions();
  }, [user]);

  const handleAddPoints = async (points: number, title: string) => {
    setPointsToAdd(points);
    setShowCoin(true);

    // Disable the button for this action
    const updatedDisabledActions = { ...disabledActions, [title]: true };
    setDisabledActions(updatedDisabledActions);
    localStorage.setItem("disabledActions", JSON.stringify(updatedDisabledActions));

    // Update the score in Zustand
    updateScore(points);

    // Optionally, send the update to the backend
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/update-score`,
        { email: user?.email, points }
      );
      if (res.status === 200) {
        console.log("Score updated successfully");
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Earn points with these activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <div key={index} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                {action.icon === "Car" && <Car className="h-4 w-4 text-primary" />}
                {action.icon === "Lightbulb" && <Lightbulb className="h-4 w-4 text-primary" />}
                {action.icon === "Recycle" && <Recycle className="h-4 w-4 text-primary" />}
                {action.icon === "ShoppingBag" && <ShoppingBag className="h-4 w-4 text-primary" />}
              </div>
              <span className="text-sm font-medium">{action.title}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddPoints(action.points, action.title)}
              disabled={disabledActions[action.title]}
            >
              +{action.points} pts
            </Button>
          </div>
        ))}
      </CardContent>
      {showCoin && <CoinAnimation onComplete={() => setShowCoin(false)} points={pointsToAdd} />}
    </Card>
  );
}