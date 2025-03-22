"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from "sonner" // Import toast from sonner

// Define types for the reduction plan data
interface ReductionPlan {
  title: string
  description: string
  Link: string
}

interface ReductionPlans {
  [key: string]: ReductionPlan
}

interface ReductionPlanModalProps {
  email: string
  onClose: () => void
  isSubscribed: boolean // Add isSubscribed prop
}

export default function ReductionPlanModal({ email, onClose, isSubscribed }: ReductionPlanModalProps) {
  const [plans, setPlans] = useState<ReductionPlans>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [followedPlan, setFollowedPlan] = useState<string | null>(null)

  // Fetch reduction plans from the backend
  useEffect(() => {
    const fetchReductionPlan = async () => {
      try {
        // Determine the endpoint based on subscription status
        const endpoint = isSubscribed
          ? `http://localhost:8080/getReductionPlan-premium?email=${email}`
          : `http://localhost:8080/getReductionPlan?email=${email}`

        const response = await fetch(endpoint)
        if (!response.ok) throw new Error("Failed to fetch reduction plan")
        const data: ReductionPlans = await response.json()
        setPlans(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchReductionPlan()
  }, [email, isSubscribed]) // Add isSubscribed to dependency array

  // Handle following a plan
  const handleFollowPlan = async (planTitle: string, planDescription: string) => {
    try {
      // Check if the user is already following the plan
      const checkResponse = await fetch(`http://localhost:8080/getMyPlan?email=${email}`)
      if (checkResponse.status === 200) {
        const data = await checkResponse.json() // Parse response JSON
        if (data.title === planTitle) {
          toast.info("You are already following this plan.", {
            description: "No changes were made.",
          })
          return
        }
      }

      // If the user is following a different plan, prompt to replace it
      if (followedPlan) {
        toast.warning(`You are already following "${followedPlan}".`, {
          description: `Do you want to replace it with "${planTitle}"?`,
          action: {
            label: "Replace",
            onClick: async () => {
              // Save the new plan
              const saveResponse = await fetch("http://localhost:8080/savePlan", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, title: planTitle, description: planDescription }),
              })
              if (!saveResponse.ok) throw new Error("Failed to save plan")

              setFollowedPlan(planTitle)
              toast.success(`You are now following the plan: ${planTitle}`)
            },
          },
          cancel: {
            label: "Cancel",
            onClick: () => {
              toast("Plan replacement canceled.")
            },
          },
        })
      } else {
        // Save the new plan
        const saveResponse = await fetch("http://localhost:8080/savePlan", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, title: planTitle, description: planDescription }),
        })
        if (!saveResponse.ok) throw new Error("Failed to save plan")

        setFollowedPlan(planTitle)
        toast.success(`You are now following the plan: ${planTitle}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast.error("An error occurred. Please try again.")
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-gradient-to-br from-green-900 to-black p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="float-right">
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Your Personalized Reduction Plans</h2>
        <div className="space-y-4">
          {Object.entries(plans).map(([key, plan]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-yellow-500">{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button onClick={() => handleFollowPlan(plan.title, plan.description)}>Follow Plan</Button>
                <Button variant="link" onClick={() => window.open(plan.Link, "_blank")}>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}


// "use client"

// import { useState, useEffect } from "react"
// import { X } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
// import { toast } from "sonner" // Import toast from sonner

// // Define types for the reduction plan data
// interface ReductionPlan {
//   title: string
//   description: string
//   Link: string
// }

// interface ReductionPlans {
//   [key: string]: ReductionPlan
// }

// interface ReductionPlanModalProps {
//   email: string
//   onClose: () => void
// }

// // Dummy data for testing
// const dummyPlans = {
//   plan_1: {
//     title: "Switch to Public Transport",
//     description: "Reduce your carbon footprint by using public transport instead of driving.",
//     Link: "https://example.com/public-transport",
//   },
//   plan_2: {
//     title: "Adopt a Plant-Based Diet",
//     description: "Eating more plant-based meals can significantly reduce your carbon emissions.",
//     Link: "https://example.com/plant-based-diet",
//   },
//   plan_3: {
//     title: "Reduce Energy Consumption",
//     description: "Turn off lights and appliances when not in use to save energy.",
//     Link: "https://example.com/reduce-energy",
//   },
//   plan_4: {
//     title: "Shop Sustainably",
//     description: "Choose eco-friendly products and reduce waste.",
//     Link: "https://example.com/shop-sustainably",
//   },
//   plan_5: {
//     title: "Use Renewable Energy",
//     description: "Switch to solar or wind energy to power your home.",
//     Link: "https://example.com/renewable-energy",
//   },
// }

// export default function ReductionPlanModal({ email, onClose }: ReductionPlanModalProps) {
//   const [plans, setPlans] = useState<ReductionPlans>({})
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)
//   const [followedPlan, setFollowedPlan] = useState<string | null>(null)

//   // Dummy state to simulate the currently followed plan
//   const [currentPlan, setCurrentPlan] = useState<string | null>("Switch to Public Transport")

//   useEffect(() => {
//     // Simulate fetching data with a delay
//     const fetchReductionPlan = async () => {
//       try {
//         // Simulate a delay to mimic network latency
//         await new Promise((resolve) => setTimeout(resolve, 1000))

//         // Use dummy data instead of making an API call
//         setPlans(dummyPlans)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An unknown error occurred")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchReductionPlan()
//   }, [email])

//   const handleFollowPlan = async (planTitle: string) => {
//     try {
//       // Simulate checking if the user is already following a plan
//       if (currentPlan === planTitle) {
//         toast.info("You are already following this plan.", {
//           description: "No changes were made.",
//         })
//         return
//       }

//       // If the user is following a different plan, prompt to replace it
//       if (currentPlan) {
//         toast.warning(`You are already following "${currentPlan}".`, {
//           description: `Do you want to replace it with "${planTitle}"?`,
//           action: {
//             label: "Replace",
//             onClick: () => {
//               // Simulate saving the new plan
//               setCurrentPlan(planTitle)
//               setFollowedPlan(planTitle)
//               toast.success(`You are now following the plan: ${planTitle}`)
//             },
//           },
//           cancel: {
//             label: "Cancel",
//             onClick: () => {
//               toast("Plan replacement canceled.")
//             },
//           },
//         })
//       } else {
//         // Simulate saving the new plan
//         setCurrentPlan(planTitle)
//         setFollowedPlan(planTitle)
//         toast.success(`You are now following the plan: ${planTitle}`)
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An unknown error occurred")
//     }
//   }

//   if (loading) return <div>Loading...</div>
//   if (error) return <div>Error: {error}</div>

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
//       <div className="bg-gradient-to-br from-green-900 to-black p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <button onClick={onClose} className="float-right">
//           <X className="h-6 w-6" />
//         </button>
//         <h2 className="text-xl font-bold mb-4">Your Personalized Reduction Plans</h2>
//         <div className="space-y-4">
//           {Object.entries(plans).map(([key, plan]) => (
//             <Card key={key}>
//               <CardHeader>
//                 <CardTitle className="text-yellow-500">{plan.title}</CardTitle>
//                 <CardDescription>{plan.description}</CardDescription>
//               </CardHeader>
//               <CardContent className="flex gap-4">
//                 <Button onClick={() => handleFollowPlan(plan.title)}>Follow Plan</Button>
//                 <Button variant="link" onClick={() => window.open(plan.Link, "_blank")}>
//                   Learn More
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }