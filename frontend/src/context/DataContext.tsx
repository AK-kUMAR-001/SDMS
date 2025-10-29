import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, Certificate, AuditLog } from '../types';
import { roles as initialRoles, permissions as initialPermissions, Role, Permission } from '../data/roles';
import { toast } from 'sonner';
import axios from '../lib/axios';
import { useAuth } from './AuthContext';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  department?: string;
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
}

interface DataContextType {
  users: User[];
  certificates: Certificate[];
  roles: Role[];
  permissions: Permission[];
  loading: boolean;
  addUser: (user: Omit<User, 'id' | 'status' | 'profilePicture'>, password: string) => Promise<boolean>;
  updateUser: (userId: string, updates: Partial<Omit<User, 'id' | 'profilePicture'>>) => Promise<void>;
  deactivateUser: (userId: string) => Promise<void>;
  addCertificate: (certificate: Pick<Certificate, 'title' | 'type' | 'studentId' | 'fileUrl' | 'issuedBy' | 'issuedDate'>) => Promise<void>;
  getCertificatesByStudentId: (studentId: string) => Certificate[];
  updateCertificateStatus: (certificateId: string, status: 'approved' | 'rejected', options: { points?: number, reason?: string }) => Promise<void>;
  updateRolePermissions: (roleId: string, permissionId: string, enabled: boolean) => void;
  leaderboardData: { rank: number; studentName: string; department: string; points: number }[];
  logAdminAction: (action: string, targetType: AuditLog['targetType'], targetId: string, details?: Record<string, unknown>) => Promise<void>;
  getAuditLogs: (page: number, pageSize: number) => Promise<{ logs: AuditLog[], totalCount: number }>;
  getCertificateAnalytics: () => Promise<{ statusCounts: { pending: number; approved: number; rejected: number }; monthlySubmissions: { month: string; count: number }[] } | null>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function to calculate leaderboard
const calculateLeaderboard = (users: User[], certificates: Certificate[]) => {
    const studentPoints: { [studentId: string]: number } = {};

    certificates.forEach(cert => {
        if (cert.status === 'approved') {
            studentPoints[cert.studentId] = (studentPoints[cert.studentId] || 0) + cert.points;
        }
    });

    const leaderboard = users
        .filter(u => u.role === 'student')
        .map(student => ({
            studentName: student.name,
            department: student.department,
            points: studentPoints[student.id] || 0,
        }))
        .sort((a, b) => b.points - a.points)
        .map((entry, index) => ({
            ...entry,
            rank: index + 1,
        }));
    
    return leaderboard;
};


export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [loading, setLoading] = useState(true);
  const permissions = initialPermissions; // Permissions are static

  const fetchUsers = useCallback(async () => {
    try {
        const response = await axios.get('/users');
        setUsers(response.data);
    } catch (error) {
        console.error("Error fetching users from backend:", error);
        toast.error("Failed to load user data from backend.");
    }
  }, []);

  const fetchCertificates = useCallback(async () => {
    try {
        const response = await axios.get('/certificates');
        setCertificates(response.data);
    } catch (error) {
        console.error("Error fetching certificates from backend:", error);
        toast.error("Failed to load certificate data from backend.");
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
        setLoading(true);
        const loadData = async () => {
            try {
                const [usersResponse, certificatesResponse] = await Promise.all([
                    axios.get('/users'),
                    axios.get('/certificates')
                ]);
                setUsers(usersResponse.data);
                setCertificates(certificatesResponse.data);
            } catch (error) {
                console.error('Error loading data from backend:', error);
                toast.error('Failed to load data from backend');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    } else {
        setUsers([]);
        setCertificates([]);
        setLoading(false);
    }
  }, [currentUser]);

  const leaderboardData = calculateLeaderboard(users, certificates);

  const logAdminAction = useCallback(async (
    action: string, 
    targetType: AuditLog['targetType'], 
    targetId: string, 
    details: Record<string, unknown> = {}
  ) => {
    if (!currentUser) return;

    // In a real implementation, we would log this to our backend
    // For now, we'll just log to console
    console.log("Admin action logged:", { action, targetType, targetId, details });
  }, [currentUser]);

  const getAuditLogs = useCallback(async (page: number, pageSize: number) => {
    try {
        const response = await axios.get(`/audit-logs?page=${page}&pageSize=${pageSize}`);
        
        return {
            logs: response.data.logs,
            totalCount: response.data.totalCount || 0,
        };
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        toast.error("Failed to load audit logs.");
        return { logs: [], totalCount: 0 };
    }
  }, []);

  const getCertificateAnalytics = useCallback(async () => {
    // 1. Status Counts
    const statusCounts = certificates.reduce((acc, cert) => {
      acc[cert.status] = (acc[cert.status] || 0) + 1;
      return acc;
    }, { pending: 0, approved: 0, rejected: 0 });

    // 2. Monthly Submissions (Mocking based on current data)
    const monthlySubmissionsMap: { [key: string]: number } = {};
    
    certificates.forEach(cert => {
      const date = new Date(cert.submittedAt);
      // Format: YYYY-M (e.g., 2024-7)
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthlySubmissionsMap[monthKey] = (monthlySubmissionsMap[monthKey] || 0) + 1;
    });

    // Convert map to array and sort by date
    const monthlySubmissions = Object.keys(monthlySubmissionsMap)
      .sort((a, b) => {
        const [y1, m1] = a.split('-').map(Number);
        const [y2, m2] = b.split('-').map(Number);
        if (y1 !== y2) return y1 - y2;
        return m1 - m2;
      })
      .map(month => ({
        month,
        count: monthlySubmissionsMap[month],
      }));

    return {
      statusCounts,
      monthlySubmissions,
    };
  }, [certificates]);


  const addUser = async (user: Omit<User, 'id' | 'status'>, password: string): Promise<boolean> => {
    try {
        // In a real app, we would create a user with authentication
        // For now, we'll just add to our local database
        const result = await localDB.createUser({
            email: user.email,
            student_name: user.name,
            department: user.department,
            role: user.role,
        });

        toast.success(`User ${user.name} created successfully.`);
        fetchUsers();
        logAdminAction('USER_CREATED', 'user', result.id, { email: user.email, role: user.role });
        return true;
    } catch (error) {
        toast.error(`Failed to create user: ${error}`);
        return false;
    }
  };

  const updateUser = async (userId: string, updates: Partial<Omit<User, 'id' | 'profilePicture'>>) => {
    try {
        const response = await axios.put(`/users/${userId}`, updates);
        setUsers(prevUsers => prevUsers.map(user => (user.id === userId ? response.data : user)));
        if (currentUser && currentUser.id === userId) {
            updateAuthUser(response.data);
        }
        toast.success(`User updated successfully.`);
        logAdminAction('USER_UPDATED', 'user', userId, updates);
    } catch (error) {
        console.error("Error updating user:", error);
        toast.error(`Failed to update user: ${error}`);
    }
  };

  const deactivateUser = async (userId: string) => {
    try {
        await localDB.deactivateUser(userId);
        toast.success(`User deactivated successfully.`);
        fetchUsers();
        logAdminAction('USER_DEACTIVATED', 'user', userId, { status: 'inactive' });
    } catch (error) {
        toast.error(`Failed to deactivate user: ${error}`);
    }
  };

  const addCertificate = async (certificate: Pick<Certificate, 'title' | 'type' | 'studentId' | 'fileUrl' | 'issuedBy' | 'issuedDate'>) => {
    try {
        await localDB.createCertificate({
            title: certificate.title,
            type: certificate.type,
            student_id: certificate.studentId,
            student_name: currentUser?.name || 'Unknown', // Use current user's name
            file_url: certificate.fileUrl,
            issued_by: certificate.issuedBy,
            issued_date: certificate.issuedDate,
        });

        toast.success("Certificate uploaded successfully for review.");
        fetchCertificates();
    } catch (error) {
        toast.error(`Failed to upload certificate: ${error}`);
    }
  };

  const getCertificatesByStudentId = (studentId: string) => {
    return certificates.filter(cert => cert.studentId === studentId);
  };

  const updateCertificateStatus = async (
    certificateId: string, 
    status: 'approved' | 'rejected', 
    options: { points?: number, reason?: string }
  ) => {
    try {
        await localDB.updateCertificateStatus(certificateId, {
            status,
            points: status === 'approved' ? (options.points || 0) : 0,
            rejection_reason: status === 'rejected' ? options.reason : null,
            reviewed_by: currentUser?.name || 'Admin',
            actor_id: currentUser?.id,
            actor_name: currentUser?.name,
        });

        toast.success(`Certificate ${status} successfully.`);
        fetchCertificates();
        logAdminAction(`CERTIFICATE_${status.toUpperCase()}`, 'certificate', certificateId, options);
    } catch (error) {
        toast.error(`Failed to update certificate status: ${error}`);
    }
  };

  const updateRolePermissions = (roleId: string, permissionId: string, enabled: boolean) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const currentPermissions = new Set(role.permissions);
        if (enabled) {
          currentPermissions.add(permissionId);
        } else {
          currentPermissions.delete(permissionId);
        }
        logAdminAction('ROLE_PERMISSION_UPDATED', 'role', roleId, { permissionId, enabled });
        return { ...role, permissions: Array.from(currentPermissions) };
      }
      return role;
    }));
    // NOTE: Role permissions are managed locally in the app state (src/data/roles.ts) 
    // and enforced via the ProtectedRoute component. If you wanted to persist these 
    // changes, you would need a dedicated 'roles' table in the database.
    toast.info("Role permissions updated locally. This change is not persisted to the database.");
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg text-muted-foreground">Loading application data...</p>
        </div>
    );
  }

  return (
    <DataContext.Provider value={{ 
        users, 
        certificates, 
        roles, 
        permissions,
        loading,
        addUser, 
        updateUser,
        deactivateUser,
        addCertificate, 
        getCertificatesByStudentId,
        updateCertificateStatus,
        updateRolePermissions,
        leaderboardData,
        logAdminAction,
        getAuditLogs,
        getCertificateAnalytics,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};