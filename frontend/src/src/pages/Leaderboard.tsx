
import { useData } from "../context/DataContext";
import { LeaderboardTable } from "../components/leaderboard/LeaderboardTable";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

export default function Leaderboard() {
  const { leaderboardData, loading } = useData();

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Student Leaderboard</h1>
      <p className="text-muted-foreground">
        Track the top-performing students based on approved certificate points.
      </p>
      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full bg-muted dark:bg-muted" />
          ))}
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <p className="text-lg">No leaderboard data available.</p>
        </div>
      ) : (
        <Card className="bg-background text-foreground">
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <LeaderboardTable data={leaderboardData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}