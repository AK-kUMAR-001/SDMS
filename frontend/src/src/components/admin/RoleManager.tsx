import { useData } from "../../context/DataContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

export const RoleManager = () => {
  const { roles, permissions, updateRolePermissions } = useData();

  const handlePermissionChange = (roleId: string, permissionId: string, enabled: boolean) => {
    updateRolePermissions(roleId, permissionId, enabled);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role & Permission Management</CardTitle>
        <CardDescription>
          Enable or disable permissions for each role across the application. Changes take effect immediately.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {roles.map((role) => (
            <AccordionItem key={role.id} value={`item-${role.id}`}>
              <AccordionTrigger>{role.name}</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                <div className="space-y-4">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-2 rounded-md border">
                      <div>
                        <Label htmlFor={`switch-${role.id}-${permission.id}`} className="font-medium">
                          {permission.action.charAt(0).toUpperCase() + permission.action.slice(1)} {permission.subject}
                        </Label>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                      <Switch
                        id={`switch-${role.id}-${permission.id}`}
                        checked={role.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionChange(role.id, permission.id, checked)}
                        disabled={role.name === 'Admin'} // Prevent admin from losing all permissions
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};