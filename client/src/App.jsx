import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/authContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './components/NotificationToast';
import NotFound from './components/NotFound';
import { useContext } from 'react';
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Home from './pages/Home';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-amber-500">Loading...</div>;
  return user ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <NotificationProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <NotificationToast />
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            <Route element={<NotFound />} path="*" />
            </Routes>
          </Router>
        </AuthProvider>
      </GoogleOAuthProvider>
    </NotificationProvider>
  );
}