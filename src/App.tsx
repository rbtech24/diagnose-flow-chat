
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import ErrorBoundary from "./components/ErrorBoundary";
import { Loader2 } from "lucide-react";

// Lazy load pages for better performance
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Direct imports for layout components
import { AdminLayout } from "./components/admin/AdminLayout";
import { CompanyLayout } from "./components/company/CompanyLayout";
import { TechLayout } from "./components/tech/TechLayout";

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminWorkflows = lazy(() => import("./pages/admin/Workflows"));
const AdminSupport = lazy(() => import("./pages/admin/Support"));
const AdminFeatureRequests = lazy(() => import("./pages/admin/FeatureRequests"));
const AdminCommunity = lazy(() => import("./pages/admin/Community"));

// Company pages
const CompanyDashboard = lazy(() => import("./pages/company/Dashboard"));
const ManageTechnicians = lazy(() => import("./pages/company/ManageTechnicians"));
const CompanySupport = lazy(() => import("./pages/company/Support"));
const CompanyFeatureRequests = lazy(() => import("./pages/company/FeatureRequests"));
const CompanyCommunity = lazy(() => import("./pages/company/Community"));

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

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={
              <ErrorBoundary>
                <Login />
              </ErrorBoundary>
            } />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={
                <ErrorBoundary>
                  <AdminDashboard />
                </ErrorBoundary>
              } />
              <Route path="users" element={<AdminUsers />} />
              <Route path="workflows" element={<AdminWorkflows />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="feature-requests" element={<AdminFeatureRequests />} />
              <Route path="community" element={<AdminCommunity />} />
            </Route>

            {/* Company routes */}
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
              <Route path="support" element={<CompanySupport />} />
              <Route path="feature-requests" element={<CompanyFeatureRequests />} />
              <Route path="community" element={<CompanyCommunity />} />
            </Route>

            {/* Tech routes */}
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
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
