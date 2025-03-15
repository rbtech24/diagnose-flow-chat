
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
import CommunityPostDetail from "./pages/company/CommunityPostDetail";
import TechCommunityPostDetail from "./pages/tech/CommunityPostDetail";
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
    ]
  },
  {
    path: "/tech",
    element: <TechLayout />,
    children: [
      { index: true, element: <TechDashboard /> },
      { path: "dashboard", element: <TechDashboard /> },
      { path: "support", element: <TechSupport /> },
      { path: "support/:ticketId", element: <TechSupport /> },
      { path: "profile", element: <TechProfile /> },
      { path: "community", element: <TechCommunity /> },
      { path: "community/:postId", element: <TechCommunityPostDetail /> },
      { path: "feature-requests", element: <TechFeatureRequests /> },
      { path: "feature-requests/:id", element: <TechFeatureRequestDetailPage /> },
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
      { path: "feature-requests", element: <AdminFeatureRequests /> },
      { path: "feature-requests/:id", element: <AdminFeatureRequestDetailPage /> },
      { path: "subscription-plans", element: <AdminSubscriptionPlans /> },
      { path: "licenses", element: <AdminLicenses /> },
      { path: "api-integrations", element: <APIIntegrations /> },
      { path: "users", element: <AdminUsers /> },
      { path: "users/:id", element: <UserDetail /> },
      { path: "companies", element: <AdminCompanies /> },
      { path: "companies/:id", element: <CompanyDetail /> },
      { path: "workflows", element: <AdminWorkflows /> },
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
    <RouterProvider router={router} />
  );
}

export default App;
