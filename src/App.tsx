
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SystemMessageProvider } from './context/SystemMessageContext';
import { ThemeProvider } from './components/theme-provider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleBasedRoute } from './components/auth/RoleBasedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { CompanyLayout } from './components/company/CompanyLayout';
import { TechLayout } from './components/tech/TechLayout';

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
import Login from './pages/auth/Login';
import NotFound from './pages/errors/NotFound';
import Unauthorized from './pages/errors/Unauthorized';

// Create simple placeholder components for missing components
const AdminSettings = () => <div>Admin Settings Page</div>;
const Register = () => <div>Register Page</div>;
const ForgotPassword = () => <div>Forgot Password Page</div>;
const ResetPassword = () => <div>Reset Password Page</div>;
const VerifyEmail = () => <div>Verify Email Page</div>;
const CompanySettings = () => <div>Company Settings Page</div>;
const CompanyBilling = () => <div>Company Billing Page</div>;
const TechSettings = () => <div>Tech Settings Page</div>;

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
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/users/:id" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                      <AdminUserDetail />
                    </AdminLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/users/new" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                      <AdminUserNew />
                    </AdminLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/companies" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                      <AdminCompanies />
                    </AdminLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/companies/:id" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                      <AdminCompanyDetail />
                    </AdminLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/companies/new" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                      <AdminCompanyNew />
                    </AdminLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/profile" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                      <AdminProfile />
                    </AdminLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                      <AdminSettings />
                    </AdminLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/support" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                      <AdminSupport />
                    </AdminLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/system-messages" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                      <AdminSystemMessages />
                    </AdminLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              {/* Company Routes */}
              <Route path="/company" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['company']}>
                    <CompanyLayout>
                      <CompanyDashboard />
                    </CompanyLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/company/technicians" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['company']}>
                    <CompanyLayout>
                      <ManageTechnicians />
                    </CompanyLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/company/appointments" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['company']}>
                    <CompanyLayout>
                      <AppointmentManagement />
                    </CompanyLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/company/knowledge" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['company']}>
                    <CompanyLayout>
                      <CompanyKnowledgePage />
                    </CompanyLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/company/community" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['company']}>
                    <CompanyLayout>
                      <CompanyCommunity />
                    </CompanyLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/company/community/:postId" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['company']}>
                    <CompanyLayout>
                      <CompanyCommunityPostDetail />
                    </CompanyLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/company/feature-requests" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['company']}>
                    <CompanyLayout>
                      <CompanyFeatureRequests />
                    </CompanyLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/company/feature-requests/:id" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['company']}>
                    <CompanyLayout>
                      <CompanyFeatureRequestDetail />
                    </CompanyLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/company/profile" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['company']}>
                    <CompanyLayout>
                      <CompanyProfile />
                    </CompanyLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/company/settings" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['company']}>
                    <CompanyLayout>
                      <CompanySettings />
                    </CompanyLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/company/billing" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['company']}>
                    <CompanyLayout>
                      <CompanyBilling />
                    </CompanyLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              {/* Technician Routes */}
              <Route path="/tech" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['tech']}>
                    <TechLayout>
                      <TechDashboard />
                    </TechLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/tech/profile" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['tech']}>
                    <TechLayout>
                      <TechProfile />
                    </TechLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/tech/settings" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['tech']}>
                    <TechLayout>
                      <TechSettings />
                    </TechLayout>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />

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
