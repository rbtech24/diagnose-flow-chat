
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InstallPWAPrompt } from "@/components/pwa/InstallPWAPrompt";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Workflows from "./pages/Workflows";
import WorkflowEditor from "./pages/WorkflowEditor";
import NotFound from "./pages/NotFound";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Admin
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProfile from "./pages/admin/Profile";
import AdminSupport from "./pages/admin/Support";
import AdminSupportTicketDetail from "./pages/admin/SupportTicketDetail";

// Company
import { CompanyLayout } from "./components/company/CompanyLayout";
import CompanyDashboard from "./pages/company/Dashboard";
import CompanyProfile from "./pages/company/CompanyProfile";
import CompanySupport from "./pages/company/Support";
import CompanySupportTicketDetail from "./pages/company/SupportTicketDetail";

// Technician
import { TechLayout } from "./components/tech/TechLayout";
import TechnicianDashboard from "./pages/tech/Dashboard";
import TechProfile from "./pages/tech/Profile";
import TechSupport from "./pages/tech/Support";
import TechSupportTicketDetail from "./pages/tech/SupportTicketDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <InstallPWAPrompt />
      <BrowserRouter>
        <Routes>
          {/* Index route */}
          <Route path="/" element={<Index />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Legal pages */}
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          
          {/* Workflow routes */}
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/workflow-editor" element={<WorkflowEditor />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="support/:ticketId" element={<AdminSupportTicketDetail />} />
            {/* Add more admin routes as needed */}
          </Route>
          
          {/* Company routes */}
          <Route path="/company" element={<CompanyLayout />}>
            <Route index element={<CompanyDashboard />} />
            <Route path="profile" element={<TechProfile />} />
            <Route path="company-profile" element={<CompanyProfile />} />
            <Route path="support" element={<CompanySupport />} />
            <Route path="support/:ticketId" element={<CompanySupportTicketDetail />} />
            {/* Add more company routes as needed */}
          </Route>
          
          {/* Technician routes */}
          <Route path="/tech" element={<TechLayout />}>
            <Route index element={<TechnicianDashboard />} />
            <Route path="profile" element={<TechProfile />} />
            <Route path="support" element={<TechSupport />} />
            <Route path="support/:ticketId" element={<TechSupportTicketDetail />} />
            {/* Add more technician routes as needed */}
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
