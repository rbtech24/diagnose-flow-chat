import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/company/Dashboard";
import TechDashboard from "./pages/tech/Dashboard";
import Support from "./pages/company/Support";
import TechSupport from "./pages/tech/Support";
import CompanyProfile from "./pages/company/CompanyProfile";
import TechProfile from "./pages/tech/Profile";
import { CompanyLayout } from "./components/company/CompanyLayout";
import { TechLayout } from "./components/tech/TechLayout";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSupport from "./pages/admin/Support";
import AdminProfile from "./pages/admin/Profile";
import Community from "./pages/company/Community";
import TechCommunity from "./pages/tech/Community";
import AdminCommunity from "./pages/admin/Community";
import CommunityPostDetail from "./pages/company/CommunityPostDetail";
import TechCommunityPostDetail from "./pages/tech/CommunityPostDetail";
import AdminCommunityPostDetail from "./pages/admin/CommunityPostDetail";
import AdminFeatureRequests from "./pages/admin/FeatureRequests";
import AdminFeatureRequestDetailPage from "./pages/admin/FeatureRequestDetail";
import CompanyFeatureRequests from "./pages/company/FeatureRequests";
import CompanyFeatureRequestDetailPage from "./pages/company/FeatureRequestDetail";
import TechFeatureRequests from "./pages/tech/FeatureRequests";
import TechFeatureRequestDetailPage from "./pages/tech/FeatureRequestDetail";
import AdminSubscriptionPlans from "./pages/admin/SubscriptionPlans";
import AdminLicenses from "./pages/admin/Licenses";
import APIIntegrations from "./pages/admin/APIIntegrations";
import CompanySubscription from "./pages/company/Subscription";
import ManageTechnicians from "./pages/company/ManageTechnicians";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Index from "./pages/Index";
import AdminUsers from "./pages/admin/Users";
import UserDetail from "./pages/admin/UserDetail";
import AdminCompanies from "./pages/admin/Companies";
import AdminWorkflows from "./pages/admin/Workflows";
import CompanyDetail from "./pages/admin/CompanyDetail";
import NotFound from "./pages/NotFound";
import WorkflowEditor from "./pages/WorkflowEditor";
import Workflows from "./pages/Workflows";
import AdminSupportTicketDetail from "./pages/admin/SupportTicketDetail";
import ForgotPassword from "./pages/ForgotPassword";
import DiagnosticsPage from "./pages/diagnostics/DiagnosticsPage";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Partners from "./pages/Partners";
import HelpCenter from "./pages/HelpCenter";
import CommunityForum from "./pages/CommunityForum";
import Status from "./pages/Status";
import GetStarted from "./pages/GetStarted";
import CaseStudies from "./pages/CaseStudies";
import Updates from "./pages/Updates";
import CRMIntegration from "./pages/admin/CRMIntegration";
import SystemMessagesPage from "./pages/admin/SystemMessages";
import { SystemMessageProvider } from "./context/SystemMessageContext";
import AdminAccounts from "./pages/admin/AdminAccounts";
import ApiKeys from "./pages/admin/ApiKeys";
import TechTools from "./pages/tech/TechTools";
import TechSupportTicketDetail from "./pages/tech/SupportTicketDetail";
import TechKnowledgePage from "./pages/tech/KnowledgePage";
import AdminKnowledgeBase from "./pages/admin/KnowledgeBase";
import { OfflineIndicator } from "./components/system/OfflineIndicator";
import { MobileOfflineIndicator } from "./components/system/MobileOfflineIndicator";
import AppointmentManagement from "./pages/company/AppointmentManagement";
import CompanyKnowledgePage from "./pages/company/KnowledgePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/terms-of-use",
    element: <TermsOfUse />
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/careers",
    element: <Careers />
  },
  {
    path: "/contact",
    element: <Contact />
  },
  {
    path: "/partners",
    element: <Partners />
  },
  {
    path: "/help-center",
    element: <HelpCenter />
  },
  {
    path: "/community-forum",
    element: <CommunityForum />
  },
  {
    path: "/status",
    element: <Status />
  },
  {
    path: "/get-started",
    element: <GetStarted />
  },
  {
    path: "/case-studies",
    element: <CaseStudies />
  },
  {
    path: "/updates",
    element: <Updates />
  },
  {
    path: "/company",
    element: <CompanyLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "support", element: <Support /> },
      { path: "support/:ticketId", element: <Support /> },
      { path: "profile", element: <CompanyProfile /> },
      { path: "community", element: <Community /> },
      { path: "community/:postId", element: <CommunityPostDetail /> },
      { path: "feature-requests", element: <CompanyFeatureRequests /> },
      { path: "feature-requests/:id", element: <CompanyFeatureRequestDetailPage /> },
      { path: "subscription", element: <CompanySubscription /> },
      { path: "technicians", element: <ManageTechnicians /> },
      { path: "techs", element: <ManageTechnicians /> },
      { path: "diagnostics", element: <DiagnosticsPage /> },
      { path: "appointments", element: <AppointmentManagement /> },
      { path: "knowledge", element: <CompanyKnowledgePage /> }
    ]
  },
  {
    path: "/tech",
    element: <TechLayout />,
    children: [
      { path: "", element: <Navigate to="/tech/dashboard" replace /> },
      { path: "dashboard", element: <TechDashboard /> },
      { path: "profile", element: <TechProfile /> },
      { path: "diagnostics", element: <DiagnosticsPage /> },
      { path: "community", element: <TechCommunity /> },
      { path: "community/:postId", element: <TechCommunityPostDetail /> },
      { path: "feature-requests", element: <TechFeatureRequests /> },
      { path: "feature-requests/:requestId", element: <TechFeatureRequestDetailPage /> },
      { path: "support", element: <TechSupport /> },
      { path: "support/:ticketId", element: <TechSupportTicketDetail /> },
      { path: "tools", element: <TechTools /> },
      { path: "knowledge", element: <TechKnowledgePage /> }
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "support", element: <AdminSupport /> },
      { path: "support/:ticketId", element: <AdminSupportTicketDetail /> },
      { path: "profile", element: <AdminProfile /> },
      { path: "community", element: <AdminCommunity /> },
      { path: "community/:postId", element: <AdminCommunityPostDetail /> },
      { path: "feature-requests", element: <AdminFeatureRequests /> },
      { path: "feature-requests/:id", element: <AdminFeatureRequestDetailPage /> },
      { path: "subscription-plans", element: <AdminSubscriptionPlans /> },
      { path: "licenses", element: <AdminLicenses /> },
      { path: "api-integrations", element: <APIIntegrations /> },
      { path: "crm-integration", element: <CRMIntegration /> },
      { path: "system-messages", element: <SystemMessagesPage /> },
      { path: "knowledge-base", element: <AdminKnowledgeBase /> },
      { path: "users", element: <AdminUsers /> },
      { path: "users/:id", element: <UserDetail /> },
      { path: "companies", element: <AdminCompanies /> },
      { path: "companies/:id", element: <CompanyDetail /> },
      { path: "workflows", element: <AdminWorkflows /> },
      { path: "workflow-editor", element: <WorkflowEditor /> },
      { path: "/admin/admin-accounts", element: <AdminAccounts /> },
      { path: "/admin/api-keys", element: <ApiKeys /> },
    ]
  },
  {
    path: "/workflow-editor",
    element: <WorkflowEditor />
  },
  {
    path: "/workflows",
    element: <Workflows />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

function App() {
  return (
    <SystemMessageProvider>
      <OfflineIndicator />
      <MobileOfflineIndicator />
      <RouterProvider router={router} />
    </SystemMessageProvider>
  );
}

export default App;
