"use client"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"
// import { User, Settings, Bell, Shield, Palette } from "lucide-react"

const User = dynamic(() => import("lucide-react").then((mod) => mod.User), { ssr: false })
const Settings = dynamic(() => import("lucide-react").then((mod) => mod.Settings), { ssr: false })
const Bell = dynamic(() => import("lucide-react").then((mod) => mod.Bell), { ssr: false })
const Shield = dynamic(() => import("lucide-react").then((mod) => mod.Shield), { ssr: false })
const Palette = dynamic(() => import("lucide-react").then((mod) => mod.Palette), { ssr: false })

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/ui/avatar"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <User className="h-12 w-12" />
            </Avatar>
            <div className="text-center">
              <h3 className="font-medium text-lg">Alex Johnson</h3>
              <p className="text-sm text-muted-foreground">Eco Enthusiast</p>
            </div>
            <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">Level 7</div>
            <div className="w-full pt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress to Level 8</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-[65%]"></div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-3">
          <Tabs defaultValue="account">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="account">
                <User className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="h-4 w-4 mr-2" />
                Privacy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Manage your personal details and account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Alex Johnson" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue="alex@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue="San Francisco, CA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joined">Joined</Label>
                      <Input id="joined" defaultValue="January 15, 2023" disabled />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how the app looks and feels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4" />
                      <Label htmlFor="theme">Dark Mode</Label>
                    </div>
                    <Switch id="theme" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4" />
                      <Label htmlFor="animations">Enable Animations</Label>
                    </div>
                    <Switch id="animations" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
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
                    <Switch id="daily-tips" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Achievement Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified when you earn new badges</p>
                    </div>
                    <Switch id="achievements" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Friend Activity</p>
                      <p className="text-sm text-muted-foreground">
                        Updates about your friends' sustainability actions
                      </p>
                    </div>
                    <Switch id="friend-activity" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Manage your data and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Collection</p>
                      <p className="text-sm text-muted-foreground">
                        Allow us to collect usage data to improve recommendations
                      </p>
                    </div>
                    <Switch id="data-collection" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                    </div>
                    <Switch id="profile-visibility" defaultChecked />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Download My Data</Button>
                  <Button variant="destructive">Delete Account</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

