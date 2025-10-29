import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Switch } from "../ui/switch";
import { permissions, Role } from "../../data/roles";

interface PermissionsTableProps {
  selectedRole: Role;
  onPermissionChange: (permissionId: string, enabled: boolean) => void;
}

export const PermissionsTable = ({ selectedRole, onPermissionChange }: PermissionsTableProps) => {
  const isSuperAdmin = selectedRole.permissions.includes('p01');

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Permission</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Enabled</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell className="font-medium capitalize">{`${permission.action} ${permission.subject}`}</TableCell>
              <TableCell>{permission.description}</TableCell>
              <TableCell className="text-right">
                <Switch
                  id={`${selectedRole.id}-${permission.id}`}
                  checked={isSuperAdmin || selectedRole.permissions.includes(permission.id)}
                  onCheckedChange={(checked) => onPermissionChange(permission.id, checked)}
                  disabled={isSuperAdmin && permission.id !== 'p01'}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};