import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import instance from '../lib/axios'; // Import the axios instance
import { AxiosError } from 'axios'; // Import AxiosError

const API_BASE_URL = import.meta.env.VITE_API_URL;
const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock users for development
const mockUsers = [
  {
    id: '1',
    email: 'admin@sdms.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    permissions: ['manage:all']
  },
  {
    id: '2',
    email: 'user@sdms.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user',
    permissions: ['read:dashboard', 'read:certificates', 'read:leaderboard']
  },
  {
    id: '3',
    email: 'faculty@sdms.com',
    password: 'faculty123',
    name: 'Faculty Member',
    role: 'faculty',
    permissions: ['read:users', 'read:certificates', 'manage:certificates']
  }
];

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

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateAuthUser: (updatedUser: User) => void; // Renamed to avoid conflict with DataContext's updateUser
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, navigate }: { children: ReactNode, navigate: (path: string) => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check localStorage for persisted user
      const storedUser = localStorage.getItem('sdms_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAuthUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('sdms_user', JSON.stringify(updatedUser));
  };

  const login = async (email: string, password: string) => {
    try {
      if (USE_MOCK_AUTH) {
        // Mock authentication
        console.log('Using mock authentication');

        const mockUser = mockUsers.find(
          u => u.email === email && u.password === password
        );

        if (!mockUser) {
          throw new Error('Invalid email or password');
        }

        // Remove password from user object
        const { password: _, ...userWithoutPassword } = mockUser;

        setUser(userWithoutPassword as User);
        localStorage.setItem('sdms_user', JSON.stringify(userWithoutPassword));
        toast.success('Login successful!');
        navigate('/');
        return;
      }

      // Real API authentication
      const response = await instance.post(`/login`, { email, password });

      const data = response.data;

      if (!data.user) {
        throw new Error('Invalid response from server');
      }

      setUser(data.user);
      localStorage.setItem('sdms_user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);

      // User-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('Network Error')) {
          toast.error('Cannot connect to server. Please check if the backend is running.');
        } else {
          toast.error(error.message);
        }
      } else if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message || 'An unexpected error occurred');
      } else {
        toast.error('An unexpected error occurred');
      }

      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!USE_MOCK_AUTH) {
        // Call backend logout endpoint
        await instance.post(`/logout`).catch(err => console.error('Logout API error:', err));
      }

      setUser(null);
      localStorage.removeItem('sdms_user');
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setUser(null);
      localStorage.removeItem('sdms_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to check permissions
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  if (user.permissions.includes('manage:all')) return true;
  return user.permissions.includes(permission);
}