import { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { UploadCertificateDialog } from "../components/certificates/UploadCertificateDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { DataTable } from "../components/DataTable";
import { columns as allSubmissionsColumns } from "../components/certificates/columns";
import { columns as mySubmissionsColumns } from "../components/certificates/my-submissions-columns";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";

const CertificatesPage = () => {
  const { certificates, getCertificatesByStudentId, loading } = useData();
  const { user } = useAuth();
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);

  const isStudent = user?.role === 'student';
  const canViewAll = user?.role === 'admin' || user?.role === 'dean' || user?.role === 'hod' || user?.role === 'faculty';

  const mySubmissions = user ? getCertificatesByStudentId(user.id) : [];

  return (
    <div className="container mx-auto py-6 px-2 sm:px-4 md:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-foreground">Certificates</h1>
        {isStudent && (
          <Button onClick={() => setUploadDialogOpen(true)} className="w-full sm:w-auto">Upload Certificate</Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full bg-muted dark:bg-muted" />
          ))}
        </div>
      ) : (certificates.length === 0 && (!isStudent || mySubmissions.length === 0)) ? (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <p className="text-lg">No certificate submissions found.</p>
        </div>
      ) : (
        <Card className="bg-background text-foreground">
          <CardHeader>
            <CardTitle>Certificate Submissions</CardTitle>
            <CardDescription>
              {isStudent
                ? "View your submitted certificates and their status."
                : "Review and manage all student certificate submissions."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={canViewAll ? "all" : "my-submissions"}>
              <TabsList className="w-full sm:w-auto">
                {canViewAll && <TabsTrigger value="all">All Submissions</TabsTrigger>}
                {isStudent && <TabsTrigger value="my-submissions">My Submissions</TabsTrigger>}
              </TabsList>
              {canViewAll && (
                <TabsContent value="all">
                  <DataTable columns={allSubmissionsColumns} data={certificates} />
                </TabsContent>
              )}
              {isStudent && (
                <TabsContent value="my-submissions">
                  <DataTable columns={mySubmissionsColumns} data={mySubmissions} />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {isStudent && (
        <UploadCertificateDialog
          open={isUploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
        />
      )}
    </div>
  );
};

export default CertificatesPage;