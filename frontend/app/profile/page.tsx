"use client";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import axios from "axios";
import NotificationSettings from "@/components/notificaton";
import { useRouter } from "next/navigation";
import { UserDetails } from "@/types/types";
import { AppSidebar } from "@/components/app-sidebar"; // Import the sidebar component
import { Textarea } from "@/components/ui/textarea";
import Getlocation from "../api/getLocationapi";

const User = dynamic(() => import("lucide-react").then((mod) => mod.User), { ssr: false });
const Settings = dynamic(() => import("lucide-react").then((mod) => mod.Settings), { ssr: false });
const Bell = dynamic(() => import("lucide-react").then((mod) => mod.Bell), { ssr: false });
const Shield = dynamic(() => import("lucide-react").then((mod) => mod.Shield), { ssr: false });
const Palette = dynamic(() => import("lucide-react").then((mod) => mod.Palette), { ssr: false });

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserDetails | null>(null);
  const [profileVisibility, setVisibility] = useState(false);
  const { user, error, isLoading } = useUser();
  const [isEdit, setEdit] = useState(false);
  const router = useRouter();
  const [planTitle, setPlanTitle] = useState("Basic Carbon Footprint Reduction Plan")
  const [planDescription, setPlanDescription] = useState(
    "This plan focuses on reducing your carbon footprint by optimizing transportation, energy usage, and consumption habits. Start by reducing car usage, switching to renewable energy, and minimizing food waste."
  )
  const userLocation  = Getlocation()


  // Fetch user data when user is available
  useEffect(() => {
    if (user) {
      userPlan()
      userLogin()
      fetchData();
    }
  }, [user]);

  const userPlan = async ():Promise<void>=>{
    try{
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/getMyPlan`,{
          params:{
            email: user?.email
          }
        }
      )
      if(res.status === 200){
        setPlanTitle(res.data.title)
        setPlanDescription(res.data.description)
      }
      
    }catch(error){
      console.error("Error in getting userrplan")
    }
  }

  const userLogin = async ():Promise<void>=>{
    try{
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/userLogin`,{
          name: user?.name,
          email: user?.email,
          Location: userLocation
        }
      )
      console.log("userLongin: ",res.status)
    }catch(error){
      console.error("Error in Updating...",error)
    }
  }
  const fetchData = async (): Promise<void> => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/get-userDetails`,
        {
          params: {
            name: user?.name,
            email: user?.email,
          },
          timeout: 5000,
        }
      );

      if (res.status === 200) {
        console.log("User Details fetched");
        setUserData(res.data);
        setVisibility(res.data.profileVisibility);
      } else {
        console.log("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error while fetching user details:", error);
    }
  };

  const UpdateDetails = async (): Promise<void> => {
    if (!user || !userData) {
      console.error("User or userData is missing");
      return;
    }

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/update-user`,
        {
          email: user.email,
          userData: {
            name: userData.name,
            email: userData.email,
            joinedDate: userData.joinedDate,
            Location: userData.Location,
            Level: userData.Level,
            levelProgress: userData.levelProgress,
            profileVisibility: userData.profileVisibility,
          },
        },
        { timeout: 5000 }
      );

      if (res.status === 200) {
        console.log("User details updated successfully");
        setEdit(false); // Disable edit mode after saving changes
      } else {
        console.log("Failed to update user details");
      }
    } catch (error) {
      console.error("Error while updating user details:", error);
    }
  };

  const HandleEditClick = () => {
    setEdit(true);
  };

  const HandleToggle = async () => {
    if (!user || !userData) {
      console.error("User or userData is missing");
      return;
    }

    const newVisibility = !profileVisibility;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/update-profile-visibility`,
        {
          email: user.email,
          profileVisibility: newVisibility,
        },
        { timeout: 5000 }
      );

      if (res.status === 200) {
        console.log("Profile visibility updated successfully");
        setVisibility(newVisibility); // Update local state
        setUserData((prevUserData) => {
          if (prevUserData) {
            return {
              ...prevUserData,
              profileVisibility: newVisibility,
            };
          }
          return prevUserData;
        });
      } else {
        console.log("Failed to update profile visibility");
      }
    } catch (error) {
      console.error("Error while updating profile visibility:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080";
      const res = await axios.delete(`${backendUrl}/delete-user`, {
        params: {
          email: userData?.email,
        },
      });

      if (res.status === 200) {
        console.log("Delete successful");
        router.push("/");
        window.location.href = "/api/auth/logout";
      } else {
        console.error("Failed to delete user:", res?.data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error during user deletion:", error);
    }
  };

  // If user is not available, show a loading state
  if (!user) {
    return <div>Loading...</div>;
  }
  const savePlan =async () => {
    // Save the plan (you can replace this with an API call or state update)
    console.log("Plan saved:", { planTitle, planDescription })
    try{
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/savePlan`,{
          email: user.email,
          title: planTitle,
          description: planDescription
        }
      )
    }catch(error){
      console.error("Error in saving")
    }
    alert("Plan saved successfully!")
  }
  
  const clearPlan =async () => {
    // Clear the plan
    setPlanTitle("")
    setPlanDescription("")
    console.log("Plan cleared")
    try{
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/clearPlan`,{
          params:{
            email : user?.email
          }
        }
     )
    }catch(error){
      console.error("Unable to clear data")
    }
  }






  return (
    <div className="grid grid-cols-[auto,1fr] min-h-screen">
      {/* Sidebar */}
      <div className="col-span-1">
        <AppSidebar />
      </div>

      {/* Profile Content */}
      <div className="col-span-1 flex justify-center items-start p-6">
        <div className="w-full max-w-4xl">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <User className="h-12 w-12" />
                </Avatar>
                <div className="text-center">
                  <h3 className="font-medium text-lg">{userData?.name || "kulumbe"}</h3>
                  <p className="text-sm text-muted-foreground">Eco Enthusiast</p>
                </div>
                <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">Level {userData?.Level || '#'}</div>
                <div className="w-full pt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="whitespace-pre-line">
                      Progress to Level {userData?.Level || '_'} {"\n"}
                      {userData?.levelProgress || '0'}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${userData?.levelProgress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={HandleEditClick} variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>

            <div className="md:col-span-3">
              <Tabs defaultValue="account">
                <TabsList className="grid grid-cols-5 mb-6">
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
                  <TabsTrigger value="plan">
                    <Shield className="h-4 w-4 mr-2" />
                    Plan
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
                          <Input
                            id="name"
                            value={userData?.name || "Kulumbe"}
                            disabled={!isEdit}
                            onChange={(e) =>
                              setUserData((prevUserData) => {
                                if (prevUserData) {
                                  return {
                                    ...prevUserData,
                                    name: e.target.value,
                                  };
                                }
                                return prevUserData;
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            value={userData?.email || "Kulumbe@kulumbe.com"}
                            disabled={!isEdit}
                            onChange={(e) =>
                              setUserData((prevUserData) => {
                                if (prevUserData) {
                                  return {
                                    ...prevUserData,
                                    email: e.target.value,
                                  };
                                }
                                return prevUserData;
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={userData?.Location || "Kulumbe Lands"}
                            disabled={!isEdit}
                            onChange={(e) =>
                              setUserData((prevUserData) => {
                                if (prevUserData) {
                                  return {
                                    ...prevUserData,
                                    Location: e.target.value,
                                  };
                                }
                                return prevUserData;
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="joined">Joined</Label>
                          <Input
                            id="joined"
                            value={
                              userData?.joinedDate
                                ? new Date(userData.joinedDate).toLocaleDateString()
                                : new Date().toLocaleDateString()
                            }
                            disabled
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={UpdateDetails} disabled={!isEdit}>Save Changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="plan" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Plan</CardTitle>
                      <CardDescription>Your personalized carbon footprint reduction plan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Plan Title and Description */}
                      <div className="space-y-2">
                        <Label htmlFor="plan-title">Plan Title</Label>
                        <Input
                          id="plan-title"
                          value={planTitle}
                          onChange={(e) => setPlanTitle(e.target.value)}
                          placeholder="Enter plan title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plan-description">Plan Description</Label>
                        <Textarea
                          id="plan-description"
                          value={planDescription}
                          onChange={(e) => setPlanDescription(e.target.value)}
                          placeholder="Enter plan description"
                          rows={4}
                        />
                      </div>

                      {/* Display Current Plan */}
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold">Your Current Plan</h3>
                        <div className="mt-2 p-4 bg-muted rounded-lg">
                          <p className="font-medium">{planTitle}</p>
                          <p className="text-sm text-muted-foreground">{planDescription}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button onClick={savePlan}>Save Plan</Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to clear the plan?")) {
                            clearPlan()
                          }
                        }}
                      >
                        Clear Plan
                      </Button>
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
                  <NotificationSettings />
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
                        <Switch
                          id="friend-visibility"
                          checked={userData?.profileVisibility || false}
                          onCheckedChange={HandleToggle}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Download My Data</Button>
                      <Button onClick={handleDelete} variant="destructive">Delete Account</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}