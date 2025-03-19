"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Switch } from "./ui/switch";
import { Separator } from "@/components/ui/separator"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificationType } from "@/types/types";


function NotificationSettings() {
  const { user, error, isLoading } = useUser();
  const [notifications, setNotifications] = useState<NotificationType>({
    dailyTips: false,
    AchievementAlert: false,
    FriendActivity: false,
  });

  // Fetch notification settings on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const res = await axios.get<NotificationType>(
          `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/get-notificationSettings?email=${user?.email}`
        );
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleToggle = async (key: keyof NotificationType) => {
    if (!user) return;

    const newState = { ...notifications, [key]: !notifications[key] };
    setNotifications(newState);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/update-notifications`,
        {
          key,
          value: newState[key],
          name: user?.name,
          email: user?.email,
        },
        { timeout: 5000 }
      );
      console.log(`Updated ${key} to:`, newState[key]);
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to manage your notifications.</p>;

  return (

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Control when and how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Tips</p>
              <p className="text-sm text-muted-foreground">Receive daily sustainable living tips</p>
            </div>
            <Switch id="daily-tips" checked={notifications.dailyTips} onCheckedChange={() => handleToggle("dailyTips")} />
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Achievement Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified when you earn new badges</p>
            </div>
            <Switch id="achievement-alert" checked={notifications.AchievementAlert} onCheckedChange={() => handleToggle("AchievementAlert")} />
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Friend Activity</p>
              <p className="text-sm text-muted-foreground">Updates about your friends' sustainability actions</p>
            </div>
            <Switch id="friend-activity" checked={notifications.FriendActivity} onCheckedChange={() => handleToggle("FriendActivity")} />
          </div>
        </CardContent>
      </Card>
    
  );
}

export default NotificationSettings;
