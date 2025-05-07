
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import VerifyEmailSuccess from './pages/VerifyEmailSuccess';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/auth';
import { SystemMessageProvider } from './context/SystemMessageContext';
import './App.css';

// Uncommented previously disabled routes
import Profile from './pages/Profile';

// Import layout components
import { AdminLayout } from './components/admin/AdminLayout';
import { CompanyLayout } from './components/company/CompanyLayout';
import { TechLayout } from './components/tech/TechLayout';

// Import admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminCompanies from './pages/admin/Companies';
import AdminWorkflows from './pages/admin/Workflows';
import AdminSubscriptionPlans from './pages/admin/SubscriptionPlans';
import AdminLicenses from './pages/admin/Licenses';
import AdminSupport from './pages/admin/Support';
import AdminFeatureRequests from './pages/admin/FeatureRequests';
import AdminCommunity from './pages/admin/Community';
import AdminKnowledgeBase from './pages/admin/KnowledgeBase';
import AdminSystemMessages from './pages/admin/SystemMessages';
import AdminApiIntegrations from './pages/admin/APIIntegrations';
import AdminApiKeys from './pages/admin/ApiKeys';
import AdminProfile from './pages/admin/Profile';
import AdminCommunityPostDetail from './pages/admin/CommunityPostDetail';
import AdminUserDetail from './pages/admin/UserDetail';

// Import company pages
import CompanyDashboard from './pages/company/Dashboard';

function App() {
  console.log("App mounted, current path:", window.location.pathname);

  return (
    <AuthProvider>
      <SystemMessageProvider>
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verify-email-success" element={<VerifyEmailSuccess />} />

            {/* Profile page */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:userId" element={<AdminUserDetail />} />
              <Route path="companies" element={<AdminCompanies />} />
              <Route path="workflows" element={<AdminWorkflows />} />
              <Route path="subscription-plans" element={<AdminSubscriptionPlans />} />
              <Route path="licenses" element={<AdminLicenses />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="feature-requests" element={<AdminFeatureRequests />} />
              <Route path="community" element={<AdminCommunity />} />
              <Route path="community/:postId" element={<AdminCommunityPostDetail />} />
              <Route path="knowledge-base" element={<AdminKnowledgeBase />} />
              <Route path="system-messages" element={<AdminSystemMessages />} />
              <Route path="api-integrations" element={<AdminApiIntegrations />} />
              <Route path="api-keys" element={<AdminApiKeys />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* Company routes */}
            <Route path="/company" element={<ProtectedRoute><CompanyLayout /></ProtectedRoute>}>
              <Route index element={<CompanyDashboard />} />
            </Route>

            {/* Tech routes */}
            <Route path="/tech" element={<ProtectedRoute><TechLayout /></ProtectedRoute>}>
              <Route index element={<div>Tech Dashboard</div>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </SystemMessageProvider>
    </AuthProvider>
  );
}

export default App;
