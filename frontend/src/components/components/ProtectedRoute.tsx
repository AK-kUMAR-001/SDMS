import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Navigate } from "react-router-dom";
import Unauthorized from "../pages/Unauthorized";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: {
    action: string;
    subject: string;
  };
}

const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const { roles, permissions } = useData();

  console.log('ProtectedRoute - User:', user);
  console.log('ProtectedRoute - User Role:', user?.role);
  console.log('ProtectedRoute - All Roles:', roles);
  console.log('ProtectedRoute - All Permissions:', permissions);
  console.log('ProtectedRoute - Required Permission:', requiredPermission);

  if (!user || !user.role) {
    console.log('ProtectedRoute - No user or user role, redirecting to unauthorized');
    return <Navigate to="/unauthorized" />;
  }

  const userRole = roles.find(r => user.role && r.name.toLowerCase() === user.role.toLowerCase());
  const userPermissions = userRole?.permissions.map(pId => permissions.find(p => p.id === pId)).filter(Boolean) ?? [];

  const hasPermission = (action: string, subject: string) => {
    // Super admin can do anything
    if (userPermissions.some(p => p?.action === 'manage' && p?.subject === 'all')) {
      return true;
    }
    return userPermissions.some(p => p?.action === action && p?.subject === subject);
  };

  if (!hasPermission(requiredPermission.action, requiredPermission.subject)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;