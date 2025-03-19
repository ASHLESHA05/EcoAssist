// hooks/useChat.ts
import { useState } from "react";
import axios from "axios";
import { dummyChatData } from "@/data/dummy_chat";


// Tokenize input (simple whitespace-based tokenization)
const tokenize = (input: string): string[] => {
  return input.toLowerCase().split(/\s+/);
};

// Calculate similarity between two token sets (simple Jaccard similarity)
const calculateSimilarity = (tokens1: string[], tokens2: string[]): number => {
  const intersection = tokens1.filter((token) => tokens2.includes(token)).length;
  const union = new Set([...tokens1, ...tokens2]).size;
  return intersection / union;
};

// Find the most similar question from dummy data
const findMostSimilarQuestion = (input: string): string | null => {
  const inputTokens = tokenize(input);
  let maxSimilarity = 0;
  let mostSimilarQuestion = null;

  for (const [question] of Object.entries(dummyChatData)) {
    const questionTokens = tokenize(question);
    const similarity = calculateSimilarity(inputTokens, questionTokens);

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      mostSimilarQuestion = question;
    }
  }

  // Only return a match if similarity is above a threshold
  return maxSimilarity > 0.5 ? mostSimilarQuestion : null;
};

export const useChat = (options: any) => {
  const [messages, setMessages] = useState(options.initialMessages || []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageId, setMessageId] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: `user-${messageId}`,
      role: "user",
      content: input,
    };
    setMessages((prev: any) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setMessageId((prev) => prev + 1);

    try {
      // Try to fetch response from backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
        message: input,
      });

      // Add assistant message from backend
      const assistantMessage = {
        id: `assistant-${messageId}`,
        role: "assistant",
        content: response.data.response,
      };
      setMessages((prev: any) => [...prev, assistantMessage]);
      setMessageId((prev) => prev + 1);

      if (options.onFinish) {
        options.onFinish(assistantMessage);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);

      // Fallback to dummy data if backend is unavailable
      const mostSimilarQuestion = findMostSimilarQuestion(input);
      const fallbackResponse = mostSimilarQuestion
        ? dummyChatData[mostSimilarQuestion]
        : "Sorry, I couldn't find a relevant answer. Please try asking something else.";

      const assistantMessage = {
        id: `assistant-${messageId}`,
        role: "assistant",
        content: fallbackResponse,
      };
      setMessages((prev: any) => [...prev, assistantMessage]);
      setMessageId((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  };
};