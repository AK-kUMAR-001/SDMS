import { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { MonthlySubmissionChart } from './MonthlySubmissionChart';

interface AnalyticsData {
  statusCounts: { pending: number; approved: number; rejected: number };
  monthlySubmissions: { month: string; count: number }[];
}

const AnalyticsDashboard = () => {
  const { getCertificateAnalytics } = useData();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const data = await getCertificateAnalytics();
      if (data) {
        setAnalytics(data as AnalyticsData);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, [getCertificateAnalytics]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return <p className="text-center text-muted-foreground">Could not load analytics data.</p>;
  }

  const totalSubmissions = analytics.statusCounts.pending + analytics.statusCounts.approved + analytics.statusCounts.rejected;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Overview</h2>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{analytics.statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">Requires action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.statusCounts.approved}</div>
            <p className="text-xs text-muted-foreground">Certificates awarded points</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{analytics.statusCounts.rejected}</div>
            <p className="text-xs text-muted-foreground">Certificates denied</p>
          </CardContent>
        </Card>
      </div>

      {/* Submission Trend Chart */}
      <MonthlySubmissionChart data={analytics.monthlySubmissions} />
    </div>
  );
};

export default AnalyticsDashboard;