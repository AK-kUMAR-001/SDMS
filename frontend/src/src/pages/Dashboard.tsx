import Layout from "../components/Layout";
import { StatCard } from "../components/dashboard/StatCard";
import { RecentSubmissions } from "../components/dashboard/RecentSubmissions";
import { Users, FileText, Clock, Trophy } from "lucide-react";
import { useData } from "../context/DataContext";
import { SubmissionChart } from "../components/dashboard/SubmissionChart";
import { Skeleton } from "../components/ui/skeleton";

const Dashboard = () => {
  const { users, certificates, leaderboardData, loading } = useData();
  const totalUsers = users.length;
  const pendingCertificates = certificates.filter(c => c.status === 'pending').length;
  const topStudent = leaderboardData.length > 0 ? leaderboardData[0].studentName : "N/A";

  return (
    <Layout>
      <div className="flex items-center mb-4 md:mb-6">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Dashboard</h1>
      </div>
      {loading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full bg-muted dark:bg-muted" />
          ))}
        </div>
      ) : users.length === 0 && certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <p className="text-lg">No data available for dashboard.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Users" value={totalUsers.toString()} icon={Users} />
            <StatCard title="Pending Certificates" value={pendingCertificates.toString()} icon={Clock} />
            <StatCard title="Total Certificates" value={certificates.length.toString()} icon={FileText} />
            <StatCard title="Top Student" value={topStudent} icon={Trophy} />
          </div>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7 mt-4">
            <SubmissionChart />
            <div className="lg:col-span-3">
                <RecentSubmissions />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;