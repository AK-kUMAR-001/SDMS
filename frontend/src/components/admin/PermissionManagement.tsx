import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';

interface Permission {
  id: string;
  name: string;
  description: string;
}

const PermissionManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [newPermissionName, setNewPermissionName] = useState<string>('');
  const [newPermissionDescription, setNewPermissionDescription] = useState<string>('');
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [editPermissionName, setEditPermissionName] = useState<string>('');
  const [editPermissionDescription, setEditPermissionDescription] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPermissions();
  }, []);

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

  const handleCreatePermission = async () => {
    try {
      await axios.post('/api/v1/permissions', { name: newPermissionName, description: newPermissionDescription });
      setNewPermissionName('');
      setNewPermissionDescription('');
      fetchPermissions();
      toast({
        title: 'Success',
        description: 'Permission created successfully.',
      });
    } catch (error) {
      console.error('Error creating permission:', error);
      toast({
        title: 'Error',
        description: 'Failed to create permission.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePermission = async () => {
    if (!editingPermission) return;
    try {
      await axios.put(`/api/v1/permissions/${editingPermission.id}`, { name: editPermissionName, description: editPermissionDescription });
      setEditingPermission(null);
      setEditPermissionName('');
      setEditPermissionDescription('');
      fetchPermissions();
      toast({
        title: 'Success',
        description: 'Permission updated successfully.',
      });
    } catch (error) {
      console.error('Error updating permission:', error);
      toast({
        title: 'Error',
        description: 'Failed to update permission.',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePermission = async (permissionId: string) => {
    try {
      await axios.delete(`/api/v1/permissions/${permissionId}`);
      fetchPermissions();
      toast({
        title: 'Success',
        description: 'Permission deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting permission:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete permission.',
        variant: 'destructive',
      });
    }
  };

  const startEditing = (permission: Permission) => {
    setEditingPermission(permission);
    setEditPermissionName(permission.name);
    setEditPermissionDescription(permission.description);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Permission</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Input
            placeholder="Permission Name"
            value={newPermissionName}
            onChange={(e) => setNewPermissionName(e.target.value)}
          />
          <Input
            placeholder="Permission Description"
            value={newPermissionDescription}
            onChange={(e) => setNewPermissionDescription(e.target.value)}
          />
          <Button onClick={handleCreatePermission}>Create Permission</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center justify-between p-2 border rounded">
                <span>{permission.name} - {permission.description}</span>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => startEditing(permission)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Permission</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Input
                          value={editPermissionName}
                          onChange={(e) => setEditPermissionName(e.target.value)}
                          placeholder="Permission Name"
                        />
                        <Input
                          value={editPermissionDescription}
                          onChange={(e) => setEditPermissionDescription(e.target.value)}
                          placeholder="Permission Description"
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={handleUpdatePermission}>Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleDeletePermission(permission.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionManagement;