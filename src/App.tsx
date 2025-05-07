
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import VerifyEmailSuccess from './pages/VerifyEmailSuccess';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ServiceStatusBanner } from './components/auth/ServiceStatusBanner';
import './App.css';

// Commenting out unused imports for now to avoid build errors
/*
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
*/

function App() {
  console.log("App mounted, current path:", window.location.pathname);

  return (
    <AuthProvider>
      <Router>
        <ServiceStatusBanner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-email-success" element={<VerifyEmailSuccess />} />

          {/* Protected routes will be added here when needed */}
          {/*
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
