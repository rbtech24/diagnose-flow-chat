
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SystemMessageProvider } from './context/SystemMessageContext';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminUserDetail from './pages/admin/UserDetail';
import AdminUserNew from './pages/admin/UserNew';
import AdminCompanies from './pages/admin/Companies';
import AdminCompanyDetail from './pages/admin/CompanyDetail';
import AdminCompanyNew from './pages/admin/CompanyNew';
import AdminProfile from './pages/admin/Profile';
import AdminSupport from './pages/admin/Support';
import AdminSystemMessages from './pages/admin/SystemMessages';

// Company Pages
import CompanyDashboard from './pages/company/Dashboard';
import CompanyProfile from './pages/company/CompanyProfile';

// Knowledge Base
import CompanyKnowledgePage from './pages/company/KnowledgePage';

// Community Pages
import CompanyCommunity from './pages/company/Community';
import CompanyCommunityPostDetail from './pages/company/CommunityPostDetail';

// Feature Requests
import CompanyFeatureRequests from './pages/company/FeatureRequests';
import CompanyFeatureRequestDetail from './pages/company/FeatureRequestDetail';

// Technician Management
import ManageTechnicians from './pages/company/ManageTechnicians';
import AppointmentManagement from './pages/company/AppointmentManagement';

// Technician Pages
import TechDashboard from './pages/tech/Dashboard';
import TechProfile from './pages/tech/Profile';

// Auth Pages
import TechnicianSignUp from './pages/auth/TechnicianSignUp';
import SignUp from './pages/auth/SignUp';

// Create simple placeholder components for missing components
const ThemeProvider = ({ children, defaultTheme, storageKey }) => <>{children}</>;
const ProtectedRoute = ({ children }) => <>{children}</>;
const RoleBasedRoute = ({ children, allowedRoles }) => <>{children}</>;
const AdminLayout = ({ children }) => <div className="admin-layout">{children}</div>;
const CompanyLayout = ({ children }) => <div className="company-layout">{children}</div>;
const TechLayout = ({ children }) => <div className="tech-layout">{children}</div>;
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const ForgotPassword = () => <div>Forgot Password Page</div>;
const ResetPassword = () => <div>Reset Password Page</div>;
const VerifyEmail = () => <div>Verify Email Page</div>;
const AdminSettings = () => <div>Admin Settings Page</div>;
const CompanySettings = () => <div>Company Settings Page</div>;
const CompanyBilling = () => <div>Company Billing Page</div>;
const TechSettings = () => <div>Tech Settings Page</div>;
const NotFound = () => <div>404 Not Found</div>;
const Unauthorized = () => <div>401 Unauthorized</div>;

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
                <Route path="technicians" element={<ManageTechnicians />} />
                <Route path="appointments" element={<AppointmentManagement />} />
                <Route path="knowledge" element={<CompanyKnowledgePage />} />
                <Route path="community" element={<CompanyCommunity />} />
                <Route path="community/:postId" element={<CompanyCommunityPostDetail />} />
                <Route path="feature-requests" element={<CompanyFeatureRequests />} />
                <Route path="feature-requests/:id" element={<CompanyFeatureRequestDetail />} />
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

              {/* Auth Routes */}
              <Route path="/auth/technician-signup" element={<TechnicianSignUp />} />
              <Route path="/auth/signup" element={<SignUp />} />
              
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
