import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import Index from "./pages/Index";
import ErrorBoundary from "./components/ErrorBoundary";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Lazy load pages for better performance
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WorkflowEditor = lazy(() => import("./pages/WorkflowEditor"));
const Profile = lazy(() => import("./pages/Profile"));

// Direct imports for layout components
import { AdminLayout } from "./components/admin/AdminLayout";
import { CompanyLayout } from "./components/company/CompanyLayout";
import { TechLayout } from "./components/tech/TechLayout";

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminUserNew = lazy(() => import("./pages/admin/UserNew"));
const AdminCompanies = lazy(() => import("./pages/admin/Companies"));
const AdminCompanyDetail = lazy(() => import("./pages/admin/CompanyDetail"));
const AdminLicenses = lazy(() => import("./pages/admin/Licenses"));
const AdminWorkflows = lazy(() => import("./pages/admin/Workflows"));
const AdminSupport = lazy(() => import("./pages/admin/Support"));
const AdminFeatureRequests = lazy(() => import("./pages/admin/FeatureRequests"));
const AdminFeatureRequestDetail = lazy(() => import("./pages/admin/FeatureRequestDetail"));
const AdminCommunity = lazy(() => import("./pages/admin/Community"));
const AdminCommunityPostDetail = lazy(() => import("./pages/admin/CommunityPostDetail"));
const AdminKnowledgeBase = lazy(() => import("./pages/admin/KnowledgeBase"));
const AdminSystemMessages = lazy(() => import("./pages/admin/SystemMessages"));
const AdminAPIIntegrations = lazy(() => import("./pages/admin/APIIntegrations"));
const AdminAPIKeys = lazy(() => import("./pages/admin/ApiKeys"));
const AdminProfile = lazy(() => import("./pages/admin/Profile"));
const AdminAccounts = lazy(() => import("./pages/admin/AdminAccounts"));
const AdminSubscriptionPlans = lazy(() => import("./pages/admin/SubscriptionPlans"));

// Company pages
const CompanyDashboard = lazy(() => import("./pages/company/Dashboard"));
const ManageTechnicians = lazy(() => import("./pages/company/ManageTechnicians"));
const CompanySupport = lazy(() => import("./pages/company/Support"));
const CompanyFeatureRequests = lazy(() => import("./pages/company/FeatureRequests"));
const CompanyFeatureRequestDetail = lazy(() => import("./pages/company/FeatureRequestDetail"));
const CompanyCommunity = lazy(() => import("./pages/company/Community"));
const CompanyDiagnostics = lazy(() => import("./pages/diagnostics/DiagnosticsPage"));

// Tech pages
const TechDashboard = lazy(() => import("./pages/tech/Dashboard"));
const TechProfile = lazy(() => import("./pages/tech/Profile"));
const TechTools = lazy(() => import("./pages/tech/TechTools"));
const TechSupport = lazy(() => import("./pages/tech/Support"));
const TechKnowledgePage = lazy(() => import("./pages/tech/KnowledgePage"));
const TechSupportTicketDetail = lazy(() => import("./pages/tech/SupportTicketDetail"));
const TechCommunity = lazy(() => import("./pages/tech/Community"));
const TechCommunityPostDetail = lazy(() => import("./pages/tech/CommunityPostDetail"));
const TechFeatureRequests = lazy(() => import("./pages/tech/FeatureRequests"));
const TechFeatureRequestDetail = lazy(() => import("./pages/tech/FeatureRequestDetail"));
const TechDiagnostics = lazy(() => import("./pages/tech/Diagnostics"));

function LoadingFallback() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

function RouteChangeTracker() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Route changed to:", location.pathname, "state:", location.state);
    
    const handlePopState = () => {
      console.log("Browser navigation (back/forward) detected", {
        path: window.location.pathname,
        state: window.history.state
      });
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location, navigate]);

  return null;
}

// Add new imports for the new pages
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Community from "./pages/Community";
import Partners from "./pages/Partners";
import Security from "./pages/Security";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import HelpCenter from "./pages/HelpCenter";

function App() {
  useEffect(() => {
    console.log("App mounted, current path:", window.location.pathname);
  }, []);

  return (
    <ErrorBoundary>
      <RouteChangeTracker />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={
            <ErrorBoundary>
              <Login />
            </ErrorBoundary>
          } />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Fix for protected profile route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={
                <ErrorBoundary>
                  <AdminDashboard />
                </ErrorBoundary>
              } />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/new" element={<AdminUserNew />} />
              <Route path="companies" element={<AdminCompanies />} />
              <Route path="companies/:id" element={<AdminCompanyDetail />} />
              <Route path="admin-accounts" element={<AdminAccounts />} />
              <Route path="licenses" element={<AdminLicenses />} />
              <Route path="workflows" element={<AdminWorkflows />} />
              <Route path="workflow-editor" element={<WorkflowEditor />} />
              <Route path="subscription-plans" element={<AdminSubscriptionPlans />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="feature-requests" element={<AdminFeatureRequests />} />
              <Route path="feature-requests/:id" element={<AdminFeatureRequestDetail />} />
              <Route path="community" element={<AdminCommunity />} />
              <Route path="community/:postId" element={<AdminCommunityPostDetail />} />
              <Route path="knowledge-base" element={<AdminKnowledgeBase />} />
              <Route path="system-messages" element={<AdminSystemMessages />} />
              <Route path="api-integrations" element={<AdminAPIIntegrations />} />
              <Route path="api-keys" element={<AdminAPIKeys />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['company']} />}>
            <Route path="/company" element={<CompanyLayout />}>
              <Route index element={
                <ErrorBoundary>
                  <CompanyDashboard />
                </ErrorBoundary>
              } />
              <Route path="technicians" element={
                <ErrorBoundary>
                  <ManageTechnicians />
                </ErrorBoundary>
              } />
              <Route path="diagnostics" element={<CompanyDiagnostics />} />
              <Route path="support" element={<CompanySupport />} />
              <Route path="feature-requests" element={<CompanyFeatureRequests />} />
              <Route path="feature-requests/:id" element={<CompanyFeatureRequestDetail />} />
              <Route path="community" element={<CompanyCommunity />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['tech']} />}>
            <Route path="/tech" element={<TechLayout />}>
              <Route index element={
                <ErrorBoundary>
                  <TechDashboard />
                </ErrorBoundary>
              } />
              <Route path="profile" element={<TechProfile />} />
              <Route path="tools" element={<TechTools />} />
              <Route path="support" element={<TechSupport />} />
              <Route path="support/:ticketId" element={<TechSupportTicketDetail />} />
              <Route path="knowledge" element={<TechKnowledgePage />} />
              <Route path="community" element={<TechCommunity />} />
              <Route path="community/:postId" element={<TechCommunityPostDetail />} />
              <Route path="feature-requests" element={<TechFeatureRequests />} />
              <Route path="feature-requests/:id" element={<TechFeatureRequestDetail />} />
              <Route path="diagnostics" element={<TechDiagnostics />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin', 'company']} />}>
            <Route path="/workflow-editor" element={<WorkflowEditor />} />
          </Route>

          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/community" element={<Community />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/security" element={<Security />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/help" element={<HelpCenter />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
