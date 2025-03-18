"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
}

export default function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
  const [selectedChip, setSelectedChip] = useState<string | null>(null)

  const handleSelect = (suggestion: string) => {
    setSelectedChip(suggestion)
    onSelect(suggestion)
  }

  return (
    <div className="border-t p-2">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-1">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                selectedChip === suggestion
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              }`}
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

