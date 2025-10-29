import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editRoleName, setEditRoleName] = useState<string>('');
  const [editSelectedPermissions, setEditSelectedPermissions] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

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

  const fetchPermissions = async () => {
    try {
      const response = await axios.get('/api/v1/permissions');
      setPermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch permissions.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateRole = async () => {
    try {
      await axios.post('/api/v1/roles', { name: newRoleName, permissions: selectedPermissions });
      setNewRoleName('');
      setSelectedPermissions([]);
      fetchRoles();
      toast({
        title: 'Success',
        description: 'Role created successfully.',
      });
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to create role.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
    try {
      await axios.put(`/api/v1/roles/${editingRole.id}`, { name: editRoleName, permissions: editSelectedPermissions });
      setEditingRole(null);
      setEditRoleName('');
      setEditSelectedPermissions([]);
      fetchRoles();
      toast({
        title: 'Success',
        description: 'Role updated successfully.',
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update role.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await axios.delete(`/api/v1/roles/${roleId}`);
      fetchRoles();
      toast({
        title: 'Success',
        description: 'Role deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete role.',
        variant: 'destructive',
      });
    }
  };

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    );
  };

  const handleEditPermissionChange = (permissionId: string) => {
    setEditSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    );
  };

  const startEditing = (role: Role) => {
    setEditingRole(role);
    setEditRoleName(role.name);
    setEditSelectedPermissions(role.permissions.map((p) => p.id));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Role</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Input
            placeholder="Role Name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`permission-${permission.id}`}
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={() => handlePermissionChange(permission.id)}
                />
                <Label htmlFor={`permission-${permission.id}`}>{permission.name}</Label>
              </div>
            ))}
          </div>
          <Button onClick={handleCreateRole}>Create Role</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-2 border rounded">
                <span>{role.name}</span>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => startEditing(role)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Input
                          value={editRoleName}
                          onChange={(e) => setEditRoleName(e.target.value)}
                          placeholder="Role Name"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`edit-permission-${permission.id}`}
                                checked={editSelectedPermissions.includes(permission.id)}
                                onCheckedChange={() => handleEditPermissionChange(permission.id)}
                              />
                              <Label htmlFor={`edit-permission-${permission.id}`}>{permission.name}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleUpdateRole}>Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleDeleteRole(role.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;