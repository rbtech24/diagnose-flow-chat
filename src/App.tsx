import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SystemMessageProvider } from './context/SystemMessageContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import AdminLayout from './components/admin/AdminLayout';
import CompanyLayout from './components/company/CompanyLayout';
import TechLayout from './components/tech/TechLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminUserDetail from './pages/admin/UserDetail';
import AdminUserNew from './pages/admin/UserNew';
import AdminCompanies from './pages/admin/Companies';
import AdminCompanyDetail from './pages/admin/CompanyDetail';
import AdminCompanyNew from './pages/admin/CompanyNew';
import AdminProfile from './pages/admin/Profile';
import AdminSettings from './pages/admin/Settings';
import AdminSupport from './pages/admin/Support';
import AdminSystemMessages from './pages/admin/SystemMessages';

// Company Pages
import CompanyDashboard from './pages/company/Dashboard';
import CompanyTechnicians from './pages/company/Technicians';
import CompanyTechnicianDetail from './pages/company/TechnicianDetail';
import CompanyTechnicianNew from './pages/company/TechnicianNew';
import CompanyProfile from './pages/company/Profile';
import CompanySettings from './pages/company/Settings';
import CompanyBilling from './pages/company/Billing';

// Technician Pages
import TechDashboard from './pages/tech/Dashboard';
import TechProfile from './pages/tech/Profile';
import TechSettings from './pages/tech/Settings';

// Error Pages
import NotFound from './pages/errors/NotFound';
import Unauthorized from './pages/errors/Unauthorized';

function App() {
  return (
    <SystemMessageProvider>
      <ThemeProvider defaultTheme="light" storageKey="repair-autopilot-theme">
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:id" element={<AdminUserDetail />} />
                <Route path="users/new" element={<AdminUserNew />} />
                <Route path="companies" element={<AdminCompanies />} />
                <Route path="companies/:id" element={<AdminCompanyDetail />} />
                <Route path="companies/new" element={<AdminCompanyNew />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="support" element={<AdminSupport />} />
                <Route path="system-messages" element={<AdminSystemMessages />} />
              </Route>
              
              {/* Company Routes */}
              <Route path="/company" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['company']}>
                    <CompanyLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }>
                <Route index element={<CompanyDashboard />} />
                <Route path="technicians" element={<CompanyTechnicians />} />
                <Route path="technicians/:id" element={<CompanyTechnicianDetail />} />
                <Route path="technicians/new" element={<CompanyTechnicianNew />} />
                <Route path="profile" element={<CompanyProfile />} />
                <Route path="settings" element={<CompanySettings />} />
                <Route path="billing" element={<CompanyBilling />} />
              </Route>
              
              {/* Technician Routes */}
              <Route path="/tech" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['tech']}>
                    <TechLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }>
                <Route index element={<TechDashboard />} />
                <Route path="profile" element={<TechProfile />} />
                <Route path="settings" element={<TechSettings />} />
              </Route>
              
              {/* Error Routes */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/404" element={<NotFound />} />
              
              {/* Redirect root to appropriate dashboard based on role */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Catch all for 404 */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </SystemMessageProvider>
  );
}

export default App;
