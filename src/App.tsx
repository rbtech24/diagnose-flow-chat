
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
import CompanyLayout from "./components/company/CompanyLayout";
import TechLayout from "./components/tech/TechLayout";
import AdminLayout from "./components/admin/AdminLayout";
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
    element: <CompanyLayout><Dashboard /></CompanyLayout>,
  },
  {
    path: "/company/dashboard",
    element: <CompanyLayout><Dashboard /></CompanyLayout>,
  },
  {
    path: "/company/support",
    element: <CompanyLayout><Support /></CompanyLayout>,
  },
  {
    path: "/company/support/:ticketId",
    element: <CompanyLayout><Support /></CompanyLayout>,
  },
  {
    path: "/company/profile",
    element: <CompanyLayout><CompanyProfile /></CompanyLayout>,
  },
  {
    path: "/company/community",
    element: <CompanyLayout><Community /></CompanyLayout>,
  },
  {
    path: "/company/community/:postId",
    element: <CompanyLayout><CommunityPostDetail /></CompanyLayout>,
  },
  {
    path: "/tech/dashboard",
    element: <TechLayout><TechDashboard /></TechLayout>,
  },
  {
    path: "/tech/support",
    element: <TechLayout><TechSupport /></TechLayout>,
  },
  {
    path: "/tech/support/:ticketId",
    element: <TechLayout><TechSupport /></TechLayout>,
  },
  {
    path: "/tech/profile",
    element: <TechLayout><TechProfile /></TechLayout>,
  },
  {
    path: "/tech/community",
    element: <TechLayout><TechCommunity /></TechLayout>,
  },
  {
    path: "/tech/community/:postId",
    element: <TechLayout><TechCommunityPostDetail /></TechLayout>,
  },
  {
    path: "/admin/dashboard",
    element: <AdminLayout><AdminDashboard /></AdminLayout>,
  },
  {
    path: "/admin/support",
    element: <AdminLayout><AdminSupport /></AdminLayout>,
  },
  {
    path: "/admin/profile",
    element: <AdminLayout><AdminProfile /></AdminLayout>,
  },
  {
    path: "/admin/feature-requests",
    element: <AdminLayout><AdminFeatureRequests /></AdminLayout>,
  },
  {
    path: "/admin/feature-requests/:id",
    element: <AdminLayout><AdminFeatureRequestDetailPage /></AdminLayout>,
  },
  {
    path: "/company/feature-requests",
    element: <CompanyLayout><CompanyFeatureRequests /></CompanyLayout>,
  },
  {
    path: "/company/feature-requests/:id",
    element: <CompanyLayout><CompanyFeatureRequestDetailPage /></CompanyLayout>,
  },
  {
    path: "/tech/feature-requests",
    element: <TechLayout><TechFeatureRequests /></TechLayout>,
  },
  {
    path: "/tech/feature-requests/:id",
    element: <TechLayout><TechFeatureRequestDetailPage /></TechLayout>,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
