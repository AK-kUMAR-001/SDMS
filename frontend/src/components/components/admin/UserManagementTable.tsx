import { useData } from "../../context/DataContext";
import { DataTable } from "../DataTable";
import { columns } from "../users/columns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CreateUserDialog } from "../users/CreateUserDialog";
import { useState } from "react";
import { ExportButton } from "../ExportButton";

export const UserManagementTable = () => {
  const { users } = useData();
  const [isCreateUserDialogOpen, setCreateUserDialogOpen] = useState(false);

  const userExportColumns = [
    "id",
    "name",
    "email",
    "role",
    "department",
    "phoneNumber",
    "dateOfBirth",
    "address",
    "status",
    "lastLogin",
  ];
  const userExportTitles = [
    "ID",
    "Name",
    "Email",
    "Role",
    "Department",
    "Phone Number",
    "Date of Birth",
    "Address",
    "Status",
    "Last Login",
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Users</CardTitle>
          <CardDescription>View, edit, and deactivate all system users.</CardDescription>
        </div>
        <div className="flex space-x-2">
          <ExportButton
            data={users}
            columns={userExportColumns}
            columnTitles={userExportTitles}
            filename="users_export.csv"
          />
          <Button onClick={() => setCreateUserDialogOpen(true)}>Add New User</Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={users} />
      </CardContent>
      <CreateUserDialog
        open={isCreateUserDialogOpen}
        onOpenChange={setCreateUserDialogOpen}
      />
    </Card>
  );
};