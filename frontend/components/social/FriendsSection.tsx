"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, Search } from "lucide-react"; // Import the Check icon for the tick mark

const FriendsSection = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { name: string; email: string; isFriend: boolean }[]
  >([]);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return; // Don't search if the query is empty

    try {
      const response = await fetch(`http://localhost:8080/search-friends?email=${user?.email}&query=${searchQuery}`);
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      setSearchResults(data); // Set the search results
    } catch (error) {
      console.error("Failed to search friends:", error);
    }
  };

  // Handle adding a friend
  const handleAddFriend = async (friendEmail: string) => {
    try {
      const response = await fetch("http://localhost:8080/add-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: user?.email, friendEmail: friendEmail }),
      });

      if (!response.ok) {
        throw new Error("Failed to add friend");
      }

      // Update the search results to reflect the new friend status
      setSearchResults((prevResults) =>
        prevResults.map((result) =>
          result.email === friendEmail ? { ...result, isFriend: true } : result
        )
      );
    } catch (error) {
      console.error("Failed to add friend:", error);
    }
  };

  return (
    <div>
      <div className="relative">
        <Input
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSearch(); // Allow pressing Enter to search
          }}
        />
        <Button
          className="absolute right-1 top-1 h-6 w-6 p-0"
          variant="ghost"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 mt-4">
        {searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {result.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{result.name}</p>
                  <p className="text-sm text-muted-foreground">{result.email}</p>
                </div>
              </div>
              {result.isFriend ? (
                <Check className="h-4 w-4 text-green-500" /> // Tick mark for friends
              ) : (
                <Button size="sm" onClick={() => handleAddFriend(result.email)}>
                  Add
                </Button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No results found</p>
        )}
      </div>
    </div>
  );
};

export default FriendsSection;