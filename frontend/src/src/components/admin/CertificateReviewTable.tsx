import { useData } from "../../context/DataContext";
import { DataTable } from "../DataTable";
import { columns } from "../certificates/columns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState, useMemo } from "react";
import { ExportButton } from "../ExportButton";

export const CertificateReviewTable = () => {
  const { certificates, users } = useData();
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Extract unique departments for the filter dropdown
  const departments = useMemo(() => {
    const deptSet = new Set(users.map(u => u.department).filter(Boolean));
    return ["all", ...Array.from(deptSet).sort()];
  }, [users]);

  // Filter for pending certificates
  const pendingCertificates = useMemo(() => {
    const pending = certificates.filter(c => c.status === 'pending');

    if (selectedDepartment === "all") {
      return pending;
    }

    // Filter by department (requires looking up the student's department)
    return pending.filter(cert => {
      const student = users.find(u => u.id === cert.studentId);
      return student?.department === selectedDepartment;
    });
  }, [certificates, selectedDepartment, users]);

  const certExportColumns = ["id", "title", "type", "studentName", "submittedAt", "status", "points", "issuedBy", "issuedDate"];
  const certExportTitles = ["ID", "Title", "Type", "Student Name", "Submitted Date", "Status", "Points", "Issued By", "Issued Date"];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Certificate Review Queue</CardTitle>
            <CardDescription>
              Review and process pending certificate submissions. ({pendingCertificates.length} pending)
            </CardDescription>
          </div>
          <ExportButton
            data={pendingCertificates}
            columns={certExportColumns}
            columnTitles={certExportTitles}
            filename="pending_certificates_export.csv"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center space-x-2">
          <span className="text-sm font-medium">Filter by Department:</span>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept} className="capitalize">
                  {dept === "all" ? "All Departments" : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DataTable columns={columns} data={pendingCertificates} />
      </CardContent>
    </Card>
  );
};