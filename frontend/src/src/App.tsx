import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Certificates from './pages/Certificates';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <Router>
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
                  <Admin />
                </ProtectedRoute>
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
      <Toaster richColors />
    </ThemeProvider>
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