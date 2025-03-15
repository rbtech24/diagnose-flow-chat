
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <CompanyLayout children={<Dashboard />} />,
  },
  {
    path: "/company/dashboard",
    element: <CompanyLayout children={<Dashboard />} />,
  },
  {
    path: "/company/support",
    element: <CompanyLayout children={<Support />} />,
  },
  {
    path: "/company/support/:ticketId",
    element: <CompanyLayout children={<Support />} />,
  },
  {
    path: "/company/profile",
    element: <CompanyLayout children={<CompanyProfile />} />,
  },
  {
    path: "/company/community",
    element: <CompanyLayout children={<Community />} />,
  },
  {
    path: "/company/community/:postId",
    element: <CompanyLayout children={<CommunityPostDetail />} />,
  },
  {
    path: "/tech/dashboard",
    element: <TechLayout children={<TechDashboard />} />,
  },
  {
    path: "/tech/support",
    element: <TechLayout children={<TechSupport />} />,
  },
  {
    path: "/tech/support/:ticketId",
    element: <TechLayout children={<TechSupport />} />,
  },
  {
    path: "/tech/profile",
    element: <TechLayout children={<TechProfile />} />,
  },
  {
    path: "/tech/community",
    element: <TechLayout children={<TechCommunity />} />,
  },
  {
    path: "/tech/community/:postId",
    element: <TechLayout children={<TechCommunityPostDetail />} />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminLayout children={<AdminDashboard />} />,
  },
  {
    path: "/admin/support",
    element: <AdminLayout children={<AdminSupport />} />,
  },
  {
    path: "/admin/profile",
    element: <AdminLayout children={<AdminProfile />} />,
  },
  {
    path: "/admin/feature-requests",
    element: <AdminLayout children={<AdminFeatureRequests />} />,
  },
  {
    path: "/admin/feature-requests/:id",
    element: <AdminLayout children={<AdminFeatureRequestDetailPage />} />,
  },
  {
    path: "/company/feature-requests",
    element: <CompanyLayout children={<CompanyFeatureRequests />} />,
  },
  {
    path: "/company/feature-requests/:id",
    element: <CompanyLayout children={<CompanyFeatureRequestDetailPage />} />,
  },
  {
    path: "/tech/feature-requests",
    element: <TechLayout children={<TechFeatureRequests />} />,
  },
  {
    path: "/tech/feature-requests/:id",
    element: <TechLayout children={<TechFeatureRequestDetailPage />} />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
