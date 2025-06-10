
import {
  createBrowserRouter,
  RouterProvider,
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
import CompanyNew from "./pages/admin/CompanyNew";
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
import SystemMessagesPage from "./pages/admin/SystemMessages";
import { SystemMessageProvider } from "./context/SystemMessageContext";
import AdminAccounts from "./pages/admin/AdminAccounts";
import ApiKeys from "./pages/admin/ApiKeys";
import { AuthProvider } from "./context/AuthContext";
import UserEdit from "./pages/admin/UserEdit";
import UserNew from "./pages/admin/UserNew";
import ActivityPage from "./pages/admin/Activity";
import TechCalendar from "./pages/tech/Calendar";
import TechNotifications from "./pages/tech/Notifications";
import TechTraining from "./pages/tech/Training";
import TechNewCommunityPost from "./pages/tech/NewCommunityPost";
import TechNewFeatureRequest from "./pages/tech/NewFeatureRequest";
import TechSupportTicketDetail from "./pages/tech/SupportTicketDetail";
import { RouteGuard } from "./components/RouteGuard";
import DevLogin from "./pages/DevLogin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/dev-login",
    element: <DevLogin />
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
    path: "/workflow-editor",
    element: (
      <RouteGuard allowedRoles={['admin', 'company']}>
        <WorkflowEditor />
      </RouteGuard>
    )
  },
  {
    path: "/workflows",
    element: (
      <RouteGuard allowedRoles={['admin', 'company']}>
        <Workflows />
      </RouteGuard>
    )
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
      { path: "diagnostics", element: <DiagnosticsPage /> }
    ]
  },
  {
    path: "/tech",
    element: (
      <RouteGuard allowedRoles={['tech']}>
        <TechLayout />
      </RouteGuard>
    ),
    children: [
      { index: true, element: <TechDashboard /> },
      { path: "calendar", element: <TechCalendar /> },
      { path: "notifications", element: <TechNotifications /> },
      { path: "training", element: <TechTraining /> },
      { path: "profile", element: <TechProfile /> },
      { path: "support", element: <TechSupport /> },
      { path: "support/:id", element: <TechSupportTicketDetail /> },
      { path: "community", element: <TechCommunity /> },
      { path: "community/:id", element: <TechCommunityPostDetail /> },
      { path: "community/new", element: <TechNewCommunityPost /> },
      { path: "feature-requests", element: <TechFeatureRequests /> },
      { path: "feature-requests/:id", element: <TechFeatureRequestDetailPage /> },
      { path: "feature-requests/new", element: <TechNewFeatureRequest /> },
      { path: "diagnostics", element: <DiagnosticsPage /> }
    ]
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
      { path: "system-messages", element: <SystemMessagesPage /> },
      { path: "users", element: <AdminUsers /> },
      { path: "users/:id", element: <UserDetail /> },
      { path: "users/:id/edit", element: <UserEdit /> },
      { path: "users/new", element: <UserNew /> },
      { path: "companies", element: <AdminCompanies /> },
      { path: "companies/new", element: <CompanyNew /> },
      { path: "companies/:id", element: <CompanyDetail /> },
      { path: "workflows", element: <AdminWorkflows /> },
      { path: "workflow-editor", element: <WorkflowEditor /> },
      { path: "/admin/admin-accounts", element: <AdminAccounts /> },
      { path: "/admin/api-keys", element: <ApiKeys /> },
      { path: "activity", element: <ActivityPage /> },
    ]
  },
  {
    path: "/diagnostics",
    element: <DiagnosticsPage />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

function App() {
  return (
    <AuthProvider>
      <SystemMessageProvider>
        <RouterProvider router={router} />
      </SystemMessageProvider>
    </AuthProvider>
  );
}

export default App;
