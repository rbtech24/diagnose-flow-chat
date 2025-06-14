import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { AuthProvider } from './context/AuthContext';
import { SystemMessageProvider } from './context/SystemMessageContext';

// Import layouts
import { TechLayout } from './components/tech/TechLayout';
import { CompanyLayout } from './components/company/CompanyLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { RouteGuard } from './components/RouteGuard';
import { RouteErrorBoundary } from './components/error/RouteErrorBoundary';

// Import pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import { DevAuthBypass } from './components/dev/DevAuthBypass';

// Tech pages
import TechDashboard from './pages/tech/Dashboard';
import TechCalendar from './pages/tech/Calendar';
import TechProfile from './pages/tech/Profile';
import TechNotifications from './pages/tech/Notifications';
import TechFileLibrary from './pages/tech/FileLibrary';
import TechCommunity from './pages/tech/Community';
import TechCommunityPostDetail from './pages/tech/CommunityPostDetail';
import TechFeatureRequests from './pages/tech/FeatureRequests';
import TechFeatureRequestDetail from './pages/tech/FeatureRequestDetail';
import TechNewFeatureRequest from './pages/tech/TechNewFeatureRequest';
import TechSupport from './pages/tech/Support';
import TechSupportTicketDetail from './pages/tech/SupportTicketDetail';
import TechTraining from './pages/tech/Training';

// Company pages
import CompanyDashboard from './pages/company/Dashboard';
import CompanyFileLibrary from './pages/company/FileLibrary';
import CompanyTechnicians from './pages/company/ManageTechnicians';
import CompanySubscription from './pages/company/Subscription';
import CompanyCommunity from './pages/company/Community';
import CompanyCommunityPostDetail from './pages/company/CommunityPostDetail';
import CompanyFeatureRequests from './pages/company/FeatureRequests';
import CompanyFeatureRequestDetail from './pages/company/FeatureRequestDetail';
import CompanySupport from './pages/company/Support';
import CompanySupportTicketDetail from './pages/company/SupportTicketDetail';
import CompanyProfile from './pages/company/CompanyProfile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminUserDetail from './pages/admin/UserDetail';
import AdminUserEdit from './pages/admin/UserEdit';
import AdminUserNew from './pages/admin/UserNew';
import AdminCompanies from './pages/admin/Companies';
import AdminCompanyDetail from './pages/admin/CompanyDetail';
import AdminCompanyNew from './pages/admin/CompanyNew';
import AdminSupport from './pages/admin/Support';
import AdminSupportTicketDetail from './pages/admin/SupportTicketDetail';
import AdminCommunity from './pages/admin/Community';
import AdminCommunityPostDetail from './pages/admin/CommunityPostDetail';
import AdminFeatureRequests from './pages/admin/FeatureRequests';
import AdminFeatureRequestDetail from './pages/admin/FeatureRequestDetail';
import AdminSystemMessages from './pages/admin/SystemMessages';
import AdminSubscriptionPlans from './pages/admin/SubscriptionPlans';
import AdminLicenses from './pages/admin/Licenses';
import AdminActivity from './pages/admin/Activity';
import AdminSecurity from './pages/admin/Security';
import AdminDataManagement from './pages/admin/DataManagement';
import AdminAPIIntegrations from './pages/admin/APIIntegrations';
import AdminApiKeys from './pages/admin/ApiKeys';
import AdminProfile from './pages/admin/Profile';
import AdminWorkflows from './pages/admin/Workflows';
import AdminAccounts from './pages/admin/AdminAccounts';

// Shared pages
import DiagnosticsPage from './pages/diagnostics/DiagnosticsPage';
import Workflows from './pages/Workflows';
import WorkflowEditor from './pages/WorkflowEditor';

// Import the sales/marketing Index page:
import Index from './pages/Index';

function App() {
  return (
    <Router>
      <SystemMessageProvider>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} errorElement={<RouteErrorBoundary />} />
              <Route path="/signup" element={<SignUp />} errorElement={<RouteErrorBoundary />} />
              <Route path="/forgot-password" element={<ForgotPassword />} errorElement={<RouteErrorBoundary />} />
              <Route path="/reset-password" element={<ResetPassword />} errorElement={<RouteErrorBoundary />} />
              <Route path="/dev-auth" element={<DevAuthBypass />} errorElement={<RouteErrorBoundary />} />

              {/* Tech routes */}
              <Route path="/tech" element={
                <RouteGuard allowedRoles={['tech', 'admin', 'company']}>
                  <TechLayout />
                </RouteGuard>
              } errorElement={<RouteErrorBoundary />}>
                <Route index element={<TechDashboard />} />
                <Route path="dashboard" element={<TechDashboard />} />
                <Route path="calendar" element={<TechCalendar />} />
                <Route path="profile" element={<TechProfile />} />
                <Route path="notifications" element={<TechNotifications />} />
                <Route path="file-library" element={<TechFileLibrary />} />
                <Route path="community" element={<TechCommunity />} />
                <Route path="community/:id" element={<TechCommunityPostDetail />} />
                <Route path="feature-requests" element={<TechFeatureRequests />} />
                <Route path="feature-requests/:id" element={<TechFeatureRequestDetail />} />
                <Route path="new-feature-request" element={<TechNewFeatureRequest />} />
                <Route path="support" element={<TechSupport />} />
                <Route path="support/:id" element={<TechSupportTicketDetail />} />
                <Route path="training" element={<TechTraining />} />
              </Route>

              {/* Company routes */}
              <Route path="/company" element={
                <RouteGuard allowedRoles={['company', 'admin']}>
                  <CompanyLayout />
                </RouteGuard>
              } errorElement={<RouteErrorBoundary />}>
                <Route index element={<CompanyDashboard />} />
                <Route path="dashboard" element={<CompanyDashboard />} />
                <Route path="file-library" element={<CompanyFileLibrary />} />
                <Route path="technicians" element={<CompanyTechnicians />} />
                <Route path="subscription" element={<CompanySubscription />} />
                <Route path="community" element={<CompanyCommunity />} />
                <Route path="community/:id" element={<CompanyCommunityPostDetail />} />
                <Route path="feature-requests" element={<CompanyFeatureRequests />} />
                <Route path="feature-requests/:id" element={<CompanyFeatureRequestDetail />} />
                <Route path="support" element={<CompanySupport />} />
                <Route path="support/:id" element={<CompanySupportTicketDetail />} />
                <Route path="profile" element={<CompanyProfile />} />
                <Route path="settings" element={<CompanyProfile />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin" element={
                <RouteGuard allowedRoles={['admin']}>
                  <AdminLayout />
                </RouteGuard>
              } errorElement={<RouteErrorBoundary />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:id" element={<AdminUserDetail />} />
                <Route path="users/:id/edit" element={<AdminUserEdit />} />
                <Route path="users/new" element={<AdminUserNew />} />
                <Route path="companies" element={<AdminCompanies />} />
                <Route path="companies/:id" element={<AdminCompanyDetail />} />
                <Route path="companies/new" element={<AdminCompanyNew />} />
                <Route path="support" element={<AdminSupport />} />
                <Route path="support/:id" element={<AdminSupportTicketDetail />} />
                <Route path="community" element={<AdminCommunity />} />
                <Route path="community/:id" element={<AdminCommunityPostDetail />} />
                <Route path="feature-requests" element={<AdminFeatureRequests />} />
                <Route path="feature-requests/:id" element={<AdminFeatureRequestDetail />} />
                <Route path="system-messages" element={<AdminSystemMessages />} />
                <Route path="subscription-plans" element={<AdminSubscriptionPlans />} />
                <Route path="licenses" element={<AdminLicenses />} />
                <Route path="activity" element={<AdminActivity />} />
                <Route path="security" element={<AdminSecurity />} />
                <Route path="data-management" element={<AdminDataManagement />} />
                <Route path="api-integrations" element={<AdminAPIIntegrations />} />
                <Route path="api-keys" element={<AdminApiKeys />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="workflows" element={<AdminWorkflows />} />
                <Route path="admin-accounts" element={<AdminAccounts />} />
              </Route>

              {/* Shared routes */}
              <Route path="/diagnostics" element={
                <RouteGuard allowedRoles={['tech', 'admin', 'company']}>
                  <DiagnosticsPage />
                </RouteGuard>
              } errorElement={<RouteErrorBoundary />} />
              
              <Route path="/workflows" element={
                <RouteGuard allowedRoles={['tech', 'admin', 'company']}>
                  <Workflows />
                </RouteGuard>
              } errorElement={<RouteErrorBoundary />} />
              
              <Route path="/workflow-editor" element={
                <RouteGuard allowedRoles={['tech', 'admin', 'company']}>
                  <WorkflowEditor />
                </RouteGuard>
              } errorElement={<RouteErrorBoundary />} />

              {/* Default redirect */}
              

              {/* 404 catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
          <SonnerToaster />
        </AuthProvider>
      </SystemMessageProvider>
    </Router>
  );
}

export default App;
