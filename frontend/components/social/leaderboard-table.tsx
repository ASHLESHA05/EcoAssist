import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Badge } from '@/components/ui/badge';
import { log } from 'console';

const LeaderboardTable = () => {
  const { user, error, isLoading } = useUser();
  const [leaderboardData, setLeaderboardData] = useState<
    { name: string; score: number|null; badges: string[]|[null] }[]
  >([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (user?.email) {
        try {
          const response = await fetch(`http://localhost:8080/leaderboard?email=${user.email}`);
          console.log(response)
          if (!response.ok) {
            throw new Error('Failed to fetch leaderboard data');
          }
          const data = await response.json()
          console.log(data)
          setLeaderboardData(data); // Use the API response directly
        } catch (error) {
          console.error('Failed to fetch leaderboard data:', error);
        }
      }
    };

    fetchLeaderboard();
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show an error state
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 gap-2 border-b p-3 text-sm font-medium">
        <div className="col-span-4">User</div>
        <div className="col-span-2">Score</div>
        <div className="col-span-6">Badges</div>
      </div>
      {leaderboardData.length > 0 ? (
        leaderboardData.map((user, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 border-b p-3 text-sm last:border-0">
            <div className="col-span-4">{user.name}</div>
            <div className="col-span-2">{user.score}</div>
            <div className="col-span-6 flex flex-wrap gap-1">
              {user.badges.map((badge, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-muted-foreground">No data available</div>
      )}
    </div>
  );
};

export default LeaderboardTable;