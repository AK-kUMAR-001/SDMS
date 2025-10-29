import Layout from "../components/Layout";
import { StatCard } from "../components/dashboard/StatCard";
import { RecentSubmissions } from "../components/dashboard/RecentSubmissions";
import { Users, FileText, Clock, Trophy } from "lucide-react";
import { useData } from "../context/DataContext";
import { SubmissionChart } from "../components/dashboard/SubmissionChart";
import { Skeleton } from "../components/ui/skeleton";
import UserProfileCard from "../components/dashboard/UserProfileCard";
import { useAuth } from "../context/AuthContext"; // Import useAuth

const Dashboard = () => {
  const { users, certificates, leaderboardData, loading } = useData();
  const { user } = useAuth(); // Get user from AuthContext

  const totalUsers = users.length;
  const pendingCertificates = certificates.filter(c => c.status === 'pending').length;
  const topStudent = leaderboardData.length > 0 ? leaderboardData[0].studentName : "N/A";

  // Check if the user has the 'admin' role
  const isAdmin = user && user.roles && user.roles.includes('admin');

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
      ) : (
        <>
          {isAdmin && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Users" value={totalUsers.toString()} icon={Users} />
              <StatCard title="Pending Certificates" value={pendingCertificates.toString()} icon={Clock} />
              <StatCard title="Total Certificates" value={certificates.length.toString()} icon={FileText} />
              <StatCard title="Top Student" value={topStudent} icon={Trophy} />
            </div>
          )}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7 mt-4">
            {isAdmin && <SubmissionChart />}
            {isAdmin && (
                <div className="lg:col-span-3">
                    <RecentSubmissions />
                </div>
            )}
            <div className="lg:col-span-3">
                <UserProfileCard />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;