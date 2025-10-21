import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface MonthlySubmissionChartProps {
  data: { month: string; count: number }[];
}

// Helper to format the month key (e.g., "2024-7" to "Jul 24")
const formatMonth = (monthKey: string) => {
    const [year, monthIndex] = monthKey.split('-').map(Number);
    const date = new Date(year, monthIndex - 1, 1);
    return date.toLocaleString('default', { month: 'short', year: '2-digit' });
};

export const MonthlySubmissionChart = ({ data }: MonthlySubmissionChartProps) => {
  // Map data to use formatted month names for display
  const chartData = data.map(item => ({
    name: formatMonth(item.month),
    Submissions: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Submission Trend</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: 'var(--radius)' 
                }}
            />
            <Bar 
                dataKey="Submissions" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};