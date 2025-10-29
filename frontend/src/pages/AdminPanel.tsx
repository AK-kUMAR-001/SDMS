import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoleManagement from '@/components/admin/RoleManagement';
import PermissionManagement from '@/components/admin/PermissionManagement';
import UserRoleManagement from '@/components/admin/UserRoleManagement';

const AdminPanel: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="user-roles">User Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="roles">
          <RoleManagement />
        </TabsContent>
        <TabsContent value="permissions">
          <PermissionManagement />
        </TabsContent>
        <TabsContent value="user-roles">
          <UserRoleManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;