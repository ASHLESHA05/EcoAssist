"use client"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog" // Import shadcn/ui Dialog
import { Suggestions } from "@/types/types"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useEffect, useState } from "react"
import axios from "axios"

const ArrowRight = dynamic(() => import("lucide-react").then((mod) => mod.ArrowRight), { ssr: false })
const Car = dynamic(() => import("lucide-react").then((mod) => mod.Car), { ssr: false })
const Lightbulb = dynamic(() => import("lucide-react").then((mod) => mod.Lightbulb), { ssr: false })
const ShoppingBag = dynamic(() => import("lucide-react").then((mod) => mod.ShoppingBag), { ssr: false })
const Utensils = dynamic(() => import("lucide-react").then((mod) => mod.Utensils), { ssr: false })
const X = dynamic(() => import("lucide-react").then((mod) => mod.X), { ssr: false }))

const suggestions_ : Suggestions[] = [
  {
    title: "Reduce Commute Impact",
    description: "Try carpooling or public transit twice a week to reduce emissions by 20%",
    icon: Car,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Energy Saving Tips",
    description: "Switch to LED bulbs and save up to 75% on lighting energy costs",
    icon: Lightbulb,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    title: "Sustainable Diet",
    description: "Try plant-based meals twice a week to reduce your food carbon footprint",
    icon: Utensils,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Eco-Friendly Shopping",
    description: "Choose products with minimal packaging to reduce waste",
    icon: ShoppingBag,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
]

export default function SuggestionCards() {
  const { user, error, isLoading } = useUser();
  const [learnMoreDesc, setLearnMoreDesc] = useState<string>("");
  const [learnMoreLink, setLearnMoreLink] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Suggestions[]>(suggestions_);

  useEffect(() => {
    if (user) {
      const getSuggestions = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/get-Suggestions`,
            {
              params: {
                name: user.name,
                email: user.email,
              },
              timeout: 5000,
            }
          );
          if (res.status === 200) {
            setSuggestions(res.data);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions(suggestions_);
        }
      };
      getSuggestions();
    }
  }, [user]);

  const handleLearnMore = async (data: Suggestions) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/get-Suggestion-desc`,
        {
          params: {
            title: data.title,
            description: data.description,
          },
        }
      );
      if (res.status === 200) {
        setLearnMoreDesc(res.data.details);
        setLearnMoreLink(res.data.link);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching detailed description:", error);
      setLearnMoreDesc("Default description due to an error.");
      setLearnMoreLink("#");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {suggestions.map((suggestion, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className={`p-2 rounded-full ${suggestion.bgColor}`}>
              <suggestion.icon className={`h-5 w-5 ${suggestion.color}`} />
            </div>
            <CardTitle className="text-base">{suggestion.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{suggestion.description}</CardDescription>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleLearnMore(suggestion)} variant="ghost" size="sm" className="ml-auto">
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}

      {/* Modal using shadcn/ui Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gradient-to-br from-black to-dark-green text-white border-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Detailed Description</DialogTitle>
          </DialogHeader>
          <p className="mb-4">{learnMoreDesc}</p>
          <a
            href={learnMoreLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Learn more
          </a>
        </DialogContent>
      </Dialog>
    </div>
  );
}