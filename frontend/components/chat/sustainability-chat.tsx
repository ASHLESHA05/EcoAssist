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
import { useToast } from "@/hooks/use-toast";

export function SustainabilityChat() {
  const [points, setPoints] = useState(0);
  const [memoryEnabled, setMemoryEnabled] = useState(false);
  const { user, error, isLoading: isUserLoading } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      role: "assistant",
      content: `👋 Hi there! Welcome ${
        user?.name || "User"
      }, I'm your EcoAssist, ready to help you adopt more sustainable practices. What would you like to know about reducing your carbon footprint today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const email = user?.email
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

  // Check subscription status
  const checkSubscription = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/check-subscription`,
        {
          params: { email: user?.email },
        }
      );
      if (res.status === 200) {
        setIsSubscribed(res.data.isSubscribed || false);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  // Fetch user eco points
  const fetchData = async () => {
    if (!user) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080"}/get-Ecopoints`,
        {
          params: { name: user?.name, email: user?.email },
          timeout: 5000,
        }
      );
      if (res.status === 200) {
        setPoints(res.data.points || 0);
      }
    } catch (error) {
      console.error("Error while fetching user details:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
      checkSubscription();
    }
  }, [user]);

  // Handle memory state change
  const handleMemoryStateChange = (value) => {
    checkSubscription();
    if (isSubscribed) {
      setMemoryEnabled(value);
      console.log("Memory state changed:", value);
    } else {
      toast({
        title: "No access",
        description: "Subscribe to get Ultra",
      });
      setMemoryEnabled(value);
    }
  };

  // Handle suggestion click
  const handleSuggestedQuery = (suggestion) => {
    setInput(suggestion);
    handleSubmit(); // Direct call without event
  };

  // Save chat memory to backend
  const saveChatMemory = async (req, res, userEmail) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}/update-chat-memory`, {
        req,
        res,
        userEmail,
      });
      console.log("Chat memory saved successfully");
    } catch (error) {
      console.error("Error saving chat memory:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent default form submission if event exists
    console.log("submitted chat - start");
    if (!input.trim()) {
      console.log("submitted chat - empty input, aborting");
      return;
    }

    const userMessage = {
      id: `user-${messages.length + 1}`,
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Req send - before axios");
      const apiEndpoint = memoryEnabled
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}/chatPremium`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}/chat`;

      console.log(apiEndpoint)
      const response = await axios.get(`${apiEndpoint}`,{
        params:{
          email: user?.email,
          messages: messages
        }
      })


      
      console.log("Req send - after axios", response.data);

      const assistantMessage = {
        id: `assistant-${messages.length + 1}`,
        role: "assistant",
        content: response.data.response || "No response from server",
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (memoryEnabled) {
        await saveChatMemory(input, assistantMessage.content, user?.email);
        console.log("Chat memory saved");
      }
    } catch (error) {
      console.error("Error in chat handling:", error);
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

      if (memoryEnabled) {
        await saveChatMemory(input, assistantMessage.content, user?.email);
      }
    } finally {
      setIsLoading(false);
      console.log("submitted chat - end");
    }
  };

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
            <span className="text-sm text-gray-400">Ultra mode</span>
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
          {messages.map((message) => {
            if (!message.content) return null; // Skip undefined content
            return (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
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
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-800">
        {messages.length === 1 && (
          <SuggestionChips suggestions={suggestedQueries} onSelect={handleSuggestedQuery} />
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 mt-4 justify-center">
          <Button
            type="button"
            className="bg-gray-800 hover:bg-gray-700 h-12 px-4"
            onClick={() => console.log("Voice input placeholder")}
          >
            <Mic className="h-5 w-5 text-green-400" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about sustainable practices..."
            className="w-[70%] h-12 bg-gray-800 border-gray-700 text-white"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-green-600 hover:bg-green-700 h-12 px-4"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

// Typing effect component
const TypingEffect = ({ text = "" }) => {
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
    }, 20);

    return () => clearInterval(interval);
  }, [text]);

  return <FormattedText text={displayedText} />;
};

// Formatted text component
const FormattedText = ({ text = "" }) => {
  return (
    <div className="whitespace-pre-wrap">
      {text.split("\n").map((line, index) => (
        <p key={index}>{line.startsWith("- ") ? "• " + line.slice(2) : line}</p>
      ))}
    </div>
  );
};

// Find the most similar question from dummy data
const findMostSimilarQuestion = (input) => {
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

  return maxSimilarity > 0.5 ? mostSimilarQuestion : null;
};

// Calculate similarity between two token sets (Jaccard similarity)
const calculateSimilarity = (tokens1, tokens2) => {
  const intersection = tokens1.filter((token) => tokens2.includes(token)).length;
  const union = new Set([...tokens1, ...tokens2]).size;
  return intersection / union;
};