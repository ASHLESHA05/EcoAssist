"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { Actions } from "@/types/types";
import CoinAnimation from "./coin-animation";
import { useScoreStore } from "@/stores/useScoreStore";
import dynamic from "next/dynamic";
import { toast } from "sonner"; // Import Sonner toast
import { PremiumModal } from "../app-sidebar"; // Ensure this import is correct

const Car = dynamic(() => import("lucide-react").then((mod) => mod.Car), {
  ssr: false,
});
const Lightbulb = dynamic(
  () => import("lucide-react").then((mod) => mod.Lightbulb),
  { ssr: false }
);
const Recycle = dynamic(
  () => import("lucide-react").then((mod) => mod.Recycle),
  { ssr: false }
);
const ShoppingBag = dynamic(
  () => import("lucide-react").then((mod) => mod.ShoppingBag),
  { ssr: false }
);
const Lock = dynamic(() => import("lucide-react").then((mod) => mod.Lock), {
  ssr: false,
});
const Tree = dynamic(() => import("lucide-react").then((mod) => mod.Trees), {
  ssr: false,
}); // Corrected Tree icon import
const Bus = dynamic(() => import("lucide-react").then((mod) => mod.Bus), {
  ssr: false,
}); // Add Bus icon

const actions_: Actions[] = [
  {
    title: "Log a car-free day",
    icon: "Car",
    points: 5,
    locked: false,
  },
  {
    title: "Record energy savings",
    icon: "Lightbulb",
    points: 3,
    locked: false,
  },
  {
    title: "Log recycling activity",
    icon: "Recycle",
    points: 2,
    locked: false,
  },
  {
    title: "Add sustainable purchase",
    icon: "ShoppingBag",
    points: 2,
    locked: false,
  },
  {
    title: "Plant a tree",
    icon: "Tree",
    points: 10,
    locked: true, // Locked by default
  },
  {
    title: "Use public transport",
    icon: "Bus",
    points: 7,
    locked: true, // Locked by default
  },
];

export default function QuickActions() {
  const [actions, setActions] = useState<Actions[]>(actions_);
  const [showCoin, setShowCoin] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const { user } = useUser();
  const { updateScore } = useScoreStore();
  const [disabledActions, setDisabledActions] = useState<
    Record<string, boolean>
  >({});
  const [isSubscribed, setIsSubscribed] = useState(false); // State to track subscription status
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);

  // Load disabled actions from localStorage on component mount
  useEffect(() => {
    const storedDisabledActions = localStorage.getItem("disabledActions");
    if (storedDisabledActions) {
      setDisabledActions(JSON.parse(storedDisabledActions));
    }
  }, []);

  // Fetch actions and subscription status from the backend
  useEffect(() => {
    async function getActions() {
      try {
        const res = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"
          }/get-Actions`,
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
        toast.error("Failed to fetch actions. Please try again later.");
      }
    }

    async function checkSubscription() {
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
          setIsSubscribed(res.data.isSubscribed);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        toast.error("Failed to check subscription status.");
      }
    }

    if (user) {
      getActions();
      checkSubscription();
    }
  }, [user]);

  const handleAddPoints = async (points: number, title: string) => {
    setPointsToAdd(points);
    setShowCoin(true);

    // Disable the button for this action
    const updatedDisabledActions = { ...disabledActions, [title]: true };
    setDisabledActions(updatedDisabledActions);
    localStorage.setItem(
      "disabledActions",
      JSON.stringify(updatedDisabledActions)
    );

    // Update the score in Zustand
    updateScore(points);

    // Optionally, send the update to the backend
    try {
      const res = await axios.post(
        `${
          process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"
        }/update-score`,
        { email: user?.email, points }
      );
      if (res.status === 200) {
        toast.success(`+${points} points added successfully!`);
      }
    } catch (error) {
      console.error("Error updating score:", error);
      toast.error("Failed to update score. Please try again later.");
    }
  };

  const handleSubscribe = async () => {
    try {
      const res = await axios.post(
        `${
          process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"
        }/subscribe`,
        {
          email: user?.email,
        }
      );
      if (res.status === 200) {
        setIsSubscribed(true);
        toast.success("You are now a Premium member!");
      } else {
        toast.error("Failed to subscribe. Please try again later.");
      }
    } catch (error) {
      console.error("Error while subscribing:", error);
      toast.error("Failed to subscribe. Please try again later.");
    }
  };
  const handleUnsubscribe = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/unsubscribe`,
        {
          email: user?.email,
        }
      );
      if (res.status === 200) {
        setIsSubscribed(false); // Update subscription status
        toast.success("You have successfully unsubscribed.");
      } else {
        toast.error("Failed to unsubscribe. Please try again later.");
      }
    } catch (error) {
      console.error("Error while unsubscribing:", error);
      toast.error("Failed to unsubscribe. Please try again later.");
    }
  };

  const handleLockedActionClick = (title: string) => {
    if (!isSubscribed) {
      toast.warning(
        "This action is locked. Subscribe to Premium to unlock it.",
        {
          action: {
            label: "Subscribe",
            onClick: () => {
              setShowPremiumModal(true); // Open the premium modal
            },
          },
        }
      );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Earn points with these activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {actions.map((action, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  {action.icon === "Car" && (
                    <Car className="h-4 w-4 text-primary" />
                  )}
                  {action.icon === "Lightbulb" && (
                    <Lightbulb className="h-4 w-4 text-primary" />
                  )}
                  {action.icon === "Recycle" && (
                    <Recycle className="h-4 w-4 text-primary" />
                  )}
                  {action.icon === "ShoppingBag" && (
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  )}
                  {action.icon === "Tree" && (
                    <Tree className="h-4 w-4 text-primary" />
                  )}{" "}
                  {/* Add Tree icon */}
                  {action.icon === "Bus" && (
                    <Bus className="h-4 w-4 text-primary" />
                  )}{" "}
                  {/* Add Bus icon */}
                </div>
                <span className="text-sm font-medium">{action.title}</span>
              </div>
              {action.locked && !isSubscribed ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleLockedActionClick(action.title)}
                >
                  <Lock className="h-4 w-4" /> {/* Lock icon */}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddPoints(action.points, action.title)}
                  disabled={disabledActions[action.title]}
                >
                  +{action.points} pts
                </Button>
              )}
            </div>
          ))}
        </CardContent>
        {showCoin && (
          <CoinAnimation
            onComplete={() => setShowCoin(false)}
            points={pointsToAdd}
          />
        )}
      </Card>

      {/* Render the Premium Modal */}
      {showPremiumModal && (
        <PremiumModal
          onClose={() => setShowPremiumModal(false)}
          onSubscribe={handleSubscribe}
          onUnsubscribe={handleUnsubscribe}
          isSubscribed={isSubscribed} // Pass isSubscribed status
        />
      )}
    </>
  );
}