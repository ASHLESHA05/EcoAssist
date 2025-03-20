"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { SurveyQuestion } from "@/types/types"
import { useUser } from "@auth0/nextjs-auth0/client"



export default function SurveyPopup() {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [lastDisplayed, setLastDisplayed] = useState<number>(0)
  const [isNewUser, setIsNewUser] = useState<boolean>(true)
  const {user,error,isLoading} = useUser()
  // Check if the user is new
  const checkIfNewUser = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/isNewUser`,{
        params:{
            email : user?.email
        }
        })
        if(response.status === 200){
            setIsNewUser(response.data.value)
        }
     } catch (error) {
       console.error("Failed to check if user is new:", error)
       setIsNewUser(true)
     }
  }

  // Fetch survey questions from the API
  const fetchSurveyQuestions = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/getSurveyQuestions`,
        {
            params:{
                email:user?.email
            }
        }
      )   
      setQuestions(response.data.questions)
      setIsVisible(true)
      setLastDisplayed(Date.now())
    } catch (error) {
      console.error("Failed to fetch survey questions:", error)
      // Use dummy data if API fails

      try{
        const response = await axios.get("/api/getSurveyQuestions")
        setQuestions(response.data.questions)
        setIsVisible(true)
        setLastDisplayed(Date.now())
      }catch(error){
      setQuestions([
        {
          id: "1",
          question: "Do you smoke cigarettes?",
          type: "yes-no",
        },
        {
          id: "2",
          question: "Do you drive a diesel vehicle?",
          type: "yes-no",
        },
        {
          id: "3",
          question: "How often do you eat meat?",
          type: "multiple-choice",
          options: ["Daily", "Weekly", "Rarely", "Never"],
        },
        {
          id: "4",
          question: "What is your primary mode of transportation?",
          type: "text",
        },
        {
          id: "5",
          question: "How many flights have you taken in the past year?",
          type: "number",
        },
      ])
      setIsVisible(true)
      setLastDisplayed(Date.now())
    }
    }
  }

  // Handle random pop-up display
  useEffect(() => {
    const randomTime = Math.floor(Math.random() * 60000) + 1000 // Random time between 1s and 1min
    const timer = setTimeout(() => {
      const now = Date.now()
      if (now - lastDisplayed >= 120000 && isNewUser) {
        // 2 minutes cooldown and only for new users
        fetchSurveyQuestions()
      }
    }, randomTime)

    return () => clearTimeout(timer)
  }, [lastDisplayed, isNewUser])

  // Handle closing the pop-up
  const handleClose = () => {
    setIsVisible(false)
  }

  // Handle form submission
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const answers: { [key: string]: string } = {}

    questions.forEach((q) => {
      const answer = formData.get(q.id) as string
      if( answer != null && answer != ""){
        answers[q.question] = answer
      }
    })

    // Print the answers in the desired format
    console.log(answers)
    setIsVisible(false)
    try{
        const res = await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/sueveyAnswer`,{
                answers
            }
        )
    }catch(error){
        console.error("Errror in saving answers")
    }
  }

  // Check if the user is new on component mount
  useEffect(() => {
    checkIfNewUser()
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <Card className="bg-gradient-to-br from-green-900 to-black border-green-800 w-full max-w-2xl">
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            <CardTitle className="text-2xl font-bold text-green-400">Quick Survey</CardTitle>
            <CardDescription className="text-green-200">
              Help us understand your lifestyle to provide better recommendations.
            </CardDescription>
          </div>
          <button onClick={handleClose} className="absolute top-4 right-4 text-green-400 hover:text-green-300">
            <X className="h-6 w-6" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="space-y-3">
                <Label className="text-green-300 block">{q.question}</Label>
                {q.type === "yes-no" && (
                  <RadioGroup name={q.id} className="flex justify-center gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`${q.id}-yes`} className="text-green-400" />
                      <Label htmlFor={`${q.id}-yes`} className="text-green-200">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`${q.id}-no`} className="text-green-400" />
                      <Label htmlFor={`${q.id}-no`} className="text-green-200">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                )}
                {q.type === "multiple-choice" && (
                  <Select name={q.id}>
                    <SelectTrigger className="bg-green-900 border-green-800 text-green-200">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="bg-green-900 border-green-800">
                      {q.options?.map((option) => (
                        <SelectItem key={option} value={option} className="text-green-200 hover:bg-green-800">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {q.type === "text" && (
                  <Input
                    type="text"
                    name={q.id}
                    className="bg-green-900 border-green-800 text-green-200 placeholder-green-400"
                    placeholder="Your answer"
                  />
                )}
                {q.type === "number" && (
                    <div className="flex justify-center">
                    <Input
                        type="number"
                        name={q.id}
                        className="w-40 bg-green-900 border-green-800 text-green-200 placeholder-green-400"
                        placeholder="Enter a number"
                        min="0"
                    />
                    </div>


                )}
              </div>
            ))}
            <Button type="submit" className="w-60 bg-green-600 hover:bg-green-700 text-white">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}