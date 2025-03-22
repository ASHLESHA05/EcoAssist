  "use client";
  import dynamic from "next/dynamic";
  import { useRouter } from "next/navigation";
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
  } from "@/components/ui/sidebar";
  import { Avatar } from "@/components/ui/avatar";
  import { useUser } from "@auth0/nextjs-auth0/client";
  import { useEffect, useState } from "react";
  import Spinner from "./sninner"; // Ensure this file exists and is correctly named
  import axios from "axios";
  import { UserDetails } from "@/types/types";
  import { File } from "lucide-react";

  // Dynamically import icons from lucide-react
  const Home = dynamic(() => import("lucide-react").then((mod) => mod.Home), { ssr: false });
  const MessageSquare = dynamic(() => import("lucide-react").then((mod) => mod.MessageSquare), { ssr: false });
  const BarChart3 = dynamic(() => import("lucide-react").then((mod) => mod.BarChart3), { ssr: false });
  const Users = dynamic(() => import("lucide-react").then((mod) => mod.Users), { ssr: false });
  const Settings = dynamic(() => import("lucide-react").then((mod) => mod.Settings), { ssr: false });
  const Leaf = dynamic(() => import("lucide-react").then((mod) => mod.Leaf), { ssr: false });
  const LogOut = dynamic(() => import("lucide-react").then((mod) => mod.LogOut), { ssr: false });
  const Star = dynamic(() => import("lucide-react").then((mod) => mod.Star), { ssr: false });
  const CheckCircle = dynamic(() => import("lucide-react").then((mod) => mod.CheckCircle), { ssr: false });

  // Define the PremiumModal component with TypeScript
  interface PremiumModalProps {
    onClose: () => void;
    onSubscribe: () => void;
    onUnsubscribe: () => void;
    isSubscribed: boolean; // Add isSubscribed as a prop
  }

  export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onSubscribe, isSubscribed, onUnsubscribe, }) => {
    const [isSubscribedLocal, setIsSubscribedLocal] = useState<boolean>(isSubscribed);

    const handleSubscribe = () => {
      onSubscribe();
      setIsSubscribedLocal(true);
      setTimeout(() => {
        onClose();
      }, 2000); // Close the modal after 2 seconds
    };
    const handleUnsubscribe = () => {
      onUnsubscribe();
      setIsSubscribedLocal(false);
      setTimeout(() => {
        onClose();
      }, 2000); // Close the modal after 2 seconds
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gradient-to-r from-green-900 to-black p-6 rounded-lg border-2 border-gold-500 relative">
          {/* Close (X) Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {isSubscribedLocal ? (
            <div className="flex flex-col items-center justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold text-white mt-4">Congratulations!</h2>
              <p className="text-white">You are now a Premium member.</p>
              <button
                onClick={handleUnsubscribe}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Unsubscribe
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white">Go Premium</h2>
              <p className="text-white mt-2">No ads, get more quick actions and activities, and more!</p>
              <button
                onClick={handleSubscribe}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Subscribe
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  export function AppSidebar() {
    const [userData, setUserData] = useState<UserDetails | null>(null);
    const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);
    const { isMobile } = useSidebar();
    const router = useRouter();
    const { user, error, isLoading } = useUser(); // ✅ Always call hooks at the top
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false); 
    // Function to fetch user details from the backend
    const fetchData = async (): Promise<void> => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/get-userDetails`,
          {
            params: {
              name: user?.name, // Pass user name
              email: user?.email, // Pass user email
            },
            timeout: 5000,
          }
        );
        if (res.status === 200) {
          console.log("User Details fetched");
          setUserData(res.data);
          setIsSubscribed(res.data.isSubscribed || false); // Update subscription status
        } else {
          console.log("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error while fetching user details (sidebar):", error);
      }
    };
    const checkSubscription = async (): Promise<void> => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/check-subscription`,
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

    useEffect(() => {
      if (user) {
        fetchData();
        checkSubscription();
      }
    }, [user]);
    console.log("user", userData?.Level);

    // Handle user logout
    const handleLogout = () => {
      router.push("/");
      window.location.href = "/api/auth/logout";
    };

    // Handle navigation
    const handleClick = (val: string) => {
      const routes: Record<string, string> = {
        AI: "/chat",
        CALC: "/calculator",
        SOCIAL: "/social",
        PROFILE: "/profile",
        HOME: "/Home",
        NOTES: "/list-today-details",
      };
      if (routes[val]) {
        router.push(routes[val]);
      }
    };

    // Handle logo click
    const handleLogoClick = () => {
      router.push("/");
    };

    // Handle subscription
    const handleSubscribe = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/subscribe`,
          {
            email: user?.email,
          }
        );
        if (res.status === 200) {
          setIsSubscribed(true); // Update subscription status
          console.log("User subscribed successfully");
        } else {
          console.log("Failed to subscribe");
        }
      } catch (error) {
        console.error("Error while subscribing:", error);
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
          console.log("User unsubscribed successfully");
        } else {
          console.log("Failed to unsubscribe");
        }
      } catch (error) {
        console.error("Error while unsubscribing:", error);
      }
    };
    // ✅ Ensure hooks are always called before conditionally returning JSX
    if (isLoading) return <Spinner />;
    if (!user) return <></>;

    return (
      <Sidebar>
        {/* Sidebar Header */}
        <SidebarHeader className="flex items-center justify-between p-4">
          <div onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="font-bold text-xl text-green-600">EcoAI</span>
          </div>
          {isMobile && <SidebarTrigger />}
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <a onClick={() => handleClick("HOME")} className="flex items-center gap-2 cursor-pointer">
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Chat">
                <a onClick={() => handleClick("AI")} className="flex items-center gap-2 cursor-pointer">
                  <MessageSquare className="h-5 w-5" />
                  <span>AI Assistant</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Calculator">
                <a onClick={() => handleClick("CALC")} className="flex items-center gap-2 cursor-pointer">
                  <BarChart3 className="h-5 w-5" />
                  <span>Carbon Calculator</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Community">
                <a onClick={() => handleClick("SOCIAL")} className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-5 w-5" />
                  <span>Community</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile">
                <a onClick={() => handleClick("PROFILE")} className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-5 w-5" />
                  <span>Profile & Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Notes">
                <a onClick={() => handleClick("NOTES")} className="flex items-center gap-2 cursor-pointer">
                  <File className="h-5 w-5" />
                  <span>Notes</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Premium">
                <a onClick={() => setShowPremiumModal(true)} className="flex items-center gap-2 cursor-pointer">
                  <Star className="h-5 w-5" />
                  <span>Premium</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        {/* Sidebar Footer */}
        {user && (
          <SidebarFooter className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/profile" className="flex items-center gap-3 cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-full text-sm font-medium">
                        {userData?.name?.charAt(0).toUpperCase()}
                      </div>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{userData?.name}</span>
                      <span className="text-xs text-muted-foreground">Level {userData?.Level || 7}</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Logout">
                  <button onClick={handleLogout} className="w-full flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        )}

        {/* Render the Premium Modal */}
        {showPremiumModal && (
          <PremiumModal
            onClose={() => setShowPremiumModal(false)}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleUnsubscribe}
            isSubscribed={isSubscribed} // Pass isSubscribed status
          />
        )}
      </Sidebar>
    );
  }