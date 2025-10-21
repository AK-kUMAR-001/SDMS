import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useData } from "../../context/DataContext";
import { useMemo } from "react";

export const SubmissionChart = () => {
  const { certificates } = useData();

  const data = useMemo(() => {
    const monthCounts: { [key: string]: number } = {};
    const monthOrder: string[] = [];

    certificates.forEach(cert => {
      const date = new Date(cert.submittedAt);
      const month = date.toLocaleString('default', { month: 'short' });
      
      if (!monthCounts[month]) {
        monthCounts[month] = 0;
        monthOrder.push(month); // Keep track of the order of appearance
      }
      monthCounts[month]++;
    });

    // For this example, we'll just show the last 6 months of data for simplicity
    // In a real app, you might want more sophisticated date filtering
    const lastSixMonthsOrder = monthOrder.slice(-6);

    return lastSixMonthsOrder.map(month => ({
      name: month,
      total: monthCounts[month] || 0,
    }));
  }, [certificates]);

  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Submissions Overview</CardTitle>
        <CardDescription>
          A summary of certificate submissions over the last few months.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
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
            <Bar dataKey="total" fill="#1f77b4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};