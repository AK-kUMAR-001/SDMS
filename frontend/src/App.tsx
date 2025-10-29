import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Certificates from './pages/Certificates';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel'; // Import the new AdminPanel
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  return (
    <Router>
      <InnerAppContent />
    </Router>
  );
}

function InnerAppContent() {
  const navigate = useNavigate();

  return (
    <DataProvider>
      <AuthProvider navigate={navigate}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <ProtectedRoute requiredPermission={{ action: 'read', subject: 'dashboard' }}>
                  <Dashboard />
                </ProtectedRoute>
              </RequireAuth>
            }
          />
          <Route
            path="/users"
            element={
              <RequireAuth>
                <ProtectedRoute requiredPermission={{ action: 'read', subject: 'users' }}>
                  <Users />
                </ProtectedRoute>
              </RequireAuth>
            }
          />
          <Route
            path="/certificates"
            element={
              <RequireAuth>
                <ProtectedRoute requiredPermission={{ action: 'read', subject: 'certificates' }}>
                  <Certificates />
                </ProtectedRoute>
              </RequireAuth>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <RequireAuth>
                <ProtectedRoute requiredPermission={{ action: 'read', subject: 'leaderboard' }}>
                  <Leaderboard />
                </ProtectedRoute>
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <ProtectedRoute requiredPermission={{ action: 'manage', subject: 'all' }}>
                  <AdminPanel /> {/* Use the new AdminPanel component */}
                </ProtectedRoute>
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <ProtectedRoute requiredPermission={{ action: 'read', subject: 'settings' }}>
                  <Settings />
                </ProtectedRoute>
              </RequireAuth>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster richColors />
      </AuthProvider>
    </DataProvider>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default App;