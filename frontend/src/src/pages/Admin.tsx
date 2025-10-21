import Layout from "../components/Layout";
import { RoleManager } from "../components/admin/RoleManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import AnalyticsDashboard from "../components/admin/AnalyticsDashboard";
import { UserManagementTable } from "../components/admin/UserManagementTable";
import { CertificateReviewTable } from "../components/admin/CertificateReviewTable";
import { AuditLogDashboard } from "../components/admin/AuditLogDashboard";

const Admin = () => {
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Admin Panel</h1>
      </div>
      <div className="mt-4">
        <Tabs defaultValue="analytics">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="certificates">Certificate Review</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>
          <TabsContent value="analytics" className="mt-4">
            <AnalyticsDashboard />
          </TabsContent>
          <TabsContent value="roles" className="mt-4">
            <RoleManager />
          </TabsContent>
          <TabsContent value="users" className="mt-4">
            <UserManagementTable />
          </TabsContent>
          <TabsContent value="certificates" className="mt-4">
            <CertificateReviewTable />
          </TabsContent>
          <TabsContent value="audit" className="mt-4">
            <AuditLogDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;