import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Role {
  id: string;
  name: string;
}

interface UserRole {
  userId: string;
  roleId: string;
}

const UserRoleManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchUserRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/v1/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users.',
        variant: 'destructive',
      });
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/v1/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch roles.',
        variant: 'destructive',
      });
    }
  };

  const fetchUserRoles = async () => {
    try {
      // Assuming an endpoint to get all user-role associations
      // This might need to be implemented in the backend if not already present
      const response = await axios.get('/api/v1/user-roles'); // Placeholder endpoint
      setUserRoles(response.data);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user roles.',
        variant: 'destructive',
      });
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRoleId) {
      toast({
        title: 'Warning',
        description: 'Please select both a user and a role.',
        variant: 'destructive',
      });
      return;
    }
    try {
      // Assuming an endpoint to assign a role to a user
      await axios.post('/api/v1/user-roles', { userId: selectedUserId, roleId: selectedRoleId }); // Placeholder endpoint
      setSelectedUserId('');
      setSelectedRoleId('');
      fetchUserRoles();
      toast({
        title: 'Success',
        description: 'Role assigned successfully.',
      });
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign role.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    try {
      // Assuming an endpoint to remove a role from a user
      await axios.delete(`/api/v1/user-roles/${userId}/${roleId}`); // Placeholder endpoint
      fetchUserRoles();
      toast({
        title: 'Success',
        description: 'Role removed successfully.',
      });
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove role.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Assign Role to User</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Select onValueChange={setSelectedUserId} value={selectedUserId}>
            <SelectTrigger>
              <SelectValue placeholder="Select User" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedRoleId} value={selectedRoleId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAssignRole}>Assign Role</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current User Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {userRoles.map((ur, index) => {
              const user = users.find(u => u.id === ur.userId);
              const role = roles.find(r => r.id === ur.roleId);
              return (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span>{user?.name} - {role?.name}</span>
                  <Button variant="destructive" onClick={() => handleRemoveRole(ur.userId, ur.roleId)}>Remove</Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRoleManagement;