import { useState } from "react";
import { columns } from "../components/users/columns";
import { DataTable } from "../components/DataTable";
import { useData } from "../context/DataContext";
import { Button } from "../components/ui/button";
import { CreateUserDialog } from "../components/users/CreateUserDialog";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "../components/ui/skeleton";

const UsersPage = () => {
  const { users, loading } = useData();
  const { user } = useAuth();
  const [isCreateUserDialogOpen, setCreateUserDialogOpen] = useState(false);

  const canManageUsers = user?.role === 'admin' || user?.role === 'dean' || user?.role === 'hod';

  // Error state could be handled via a separate error variable in DataContext, but for now, we rely on toast for errors.

  return (
    <div className="container mx-auto py-6 px-2 sm:px-4 md:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        {canManageUsers && (
          <Button onClick={() => setCreateUserDialogOpen(true)} className="w-full sm:w-auto">Add User</Button>
        )}
      </div>
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-muted dark:bg-muted" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <p className="text-lg">No users found.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={users} />
      )}
      {canManageUsers && (
        <CreateUserDialog
          open={isCreateUserDialogOpen}
          onOpenChange={setCreateUserDialogOpen}
        />
      )}
    </div>
  );
};

export default UsersPage;