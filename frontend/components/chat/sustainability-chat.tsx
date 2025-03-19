"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Leaf, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import SuggestionChips from "./suggestion-chips";
import axios from "axios";
import { dummyChatData } from "@/data/dummy_chat";
import { useUser } from "@auth0/nextjs-auth0/client";

export function SustainabilityChat() {
  const [points, setPoints] = useState(0);
  const [memoryEnabled, setMemoryEnabled] = useState(false); // State for memory switch
  const { user, error, isLoading_ } = useUser();
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        `👋 Hi there! Welcome ${user?.name} I'm your EcoAssist, ready to help you adopt more sustainable practices. What would you like to know about reducing your carbon footprint today?`,
    },
  ]); // State for chat messages
  const [input, setInput] = useState(""); // State for input field
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scroll

  const suggestedQueries = [
    "How can I reduce my electricity bill this month?",
    "Suggest eco-friendly brands for cleaning products.",
    "What's my carbon footprint for a 10-mile car trip?",
    "How can I make my diet more sustainable?",
    "What are some ways to save water at home?",
    "How can I reduce plastic waste?",
    "What are the benefits of composting?",
    "How can I reduce my carbon footprint?",
    "What are some eco-friendly transportation options?",
    "How can I make my home more energy-efficient?",
  ];

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle memory state change
  const handleMemoryStateChange = (value: boolean) => {
    setMemoryEnabled(value);
    console.log("Memory state changed:", value);
  };

  const fetchData = async (): Promise<void> => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/get-Ecopoints`,
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
        setPoints(res.data.points || 0);
      } else {
        console.log("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error while fetching user details:", error);
    }
  };
  useEffect(()=>{
    fetchData()
  },[user])

  // Handle suggestion click
  const handleSuggestedQuery = (suggestion: string) => {
    setInput(suggestion); // Set the input field to the suggestion
    handleSubmit({ preventDefault: () => {} } as React.FormEvent); // Auto-send the suggestion
  };

  // Save chat memory to backend
  const saveChatMemory = async (req: string, res: string, userEmail?: string) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/update-chat-memory`, {
        req,
        res,
        userEmail, // Include the user's email in the request body
      });
      console.log("Chat memory saved successfully");
    } catch (error) {
      console.error("Error saving chat memory:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: `user-${messages.length + 1}`,
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send user input to the backend API
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
        message: input,
      });

      let assistantMessage;
      if (response.status === 200) {
        // Add assistant message from backend
        assistantMessage = {
          id: `assistant-${messages.length + 1}`,
          role: "assistant",
          content: response.data.response,
        };
      } else {
        throw new Error("Backend response not OK");
      }

      setMessages((prev) => [...prev, assistantMessage]);

      // Save chat memory if memory is enabled
      if (memoryEnabled) {
        await saveChatMemory(input, assistantMessage.content);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);

      // Fallback to dummy data if backend is unavailable
      const mostSimilarQuestion = findMostSimilarQuestion(input);
      const fallbackResponse = mostSimilarQuestion
        ? dummyChatData[mostSimilarQuestion]
        : "Sorry, I couldn't find a relevant answer. Please try asking something else";

      const assistantMessage = {
        id: `assistant-${messages.length + 1}`,
        role: "assistant",
        content: fallbackResponse,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Save chat memory if memory is enabled
      if (memoryEnabled) {
        await saveChatMemory(input, assistantMessage.content);
      }
    } finally {
      setIsLoading(false);
    }
  };
  messages.map((message: any) => (
  console.log(message.content)
  ))

  return (
    <div className="flex flex-col h-full bg-black text-white">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold">EcoAssist</h1>
        <p className="text-gray-400">Your personal guide to sustainable living</p>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-transparent">
            <Leaf className="h-5 w-5 text-green-500" />
          </Avatar>
          <h2 className="font-semibold text-white">EcoAssist</h2>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-transparent border-green-500">
            <span className="text-green-500">{points} EcoPoints</span>
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Memory</span>
            <Switch
              checked={memoryEnabled}
              onCheckedChange={handleMemoryStateChange}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
        {messages.map((message: any) => {
  // Skip rendering if message.content is undefined
  console.log("Message Content",message.content)
  if (message.content === undefined) return null;

  return (
    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.role === "user" ? "bg-green-900 text-white" : "bg-gray-800 text-white"
        }`}
      >
        {message.role === "assistant" ? (
          <TypingEffect text={message.content} />
        ) : (
          <FormattedText text={message.content} />
        )}
      </div>
    </div>
  );
})}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-800">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Auto-scroll anchor */}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-800">
        {/* Show suggestions only for the first prompt */}
        {messages.length === 1 && (
          <SuggestionChips suggestions={suggestedQueries} onSelect={handleSuggestedQuery} />
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 mt-4 justify-center">
          <Button
            type="button"
            className="bg-gray-800 hover:bg-gray-700 h-12 px-4"
            onClick={() => console.log("Voice input placeholder")}
          >
            <Mic className="h-5 w-5 text-green-400" />{/* Microphone button */}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about sustainable practices..."
            className="w-[70%] h-12 bg-gray-800 border-gray-700 text-white" // Adjusted width
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-green-600 hover:bg-green-700 h-12 px-4"
          >
            <Send className="h-5 w-5" /> {/* Send button */}
          </Button>
        </form>
      </div>
    </div>
  );
}

// Typing effect component
const TypingEffect = ({ text = "" }: { text?: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20); // Adjust typing speed here

    return () => clearInterval(interval);
  }, [text]);

  return <FormattedText text={displayedText} />;
};

const FormattedText = ({ text = "" }: { text?: string }) => {
  return (
    <div className="whitespace-pre-wrap">
      {text.split("\n").map((line, index) => (
        <p key={index}>
          {line.startsWith("- ") ? "• " + line.slice(2) : line} {/* Render bullet points */}
        </p>
      ))}
    </div>
  );
};

// Dummy data fallback


// Find the most similar question from dummy data
const findMostSimilarQuestion = (input: string): string | null => {
  const inputTokens = input.toLowerCase().split(/\s+/);
  let maxSimilarity = 0;
  let mostSimilarQuestion = null;

  for (const [question] of Object.entries(dummyChatData)) {
    const questionTokens = question.toLowerCase().split(/\s+/);
    const similarity = calculateSimilarity(inputTokens, questionTokens);

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      mostSimilarQuestion = question;
    }
  }

  // Only return a match if similarity is above a threshold
  return maxSimilarity > 0.5 ? mostSimilarQuestion : null;
};

// Calculate similarity between two token sets (simple Jaccard similarity)
const calculateSimilarity = (tokens1: string[], tokens2: string[]): number => {
  const intersection = tokens1.filter((token) => tokens2.includes(token)).length;
  const union = new Set([...tokens1, ...tokens2]).size;
  return intersection / union;
};