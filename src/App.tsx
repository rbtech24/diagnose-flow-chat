
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Workflows from "./pages/Workflows";
import WorkflowEditor from "./pages/WorkflowEditor";
import NotFound from "./pages/NotFound";

// Admin
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";

// Company
import { CompanyLayout } from "./components/company/CompanyLayout";
import CompanyDashboard from "./pages/company/Dashboard";

// Technician
import { TechLayout } from "./components/tech/TechLayout";
import TechnicianDashboard from "./pages/tech/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Index route */}
          <Route path="/" element={<Index />} />
          
          {/* Login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Workflow routes */}
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/workflow-editor" element={<WorkflowEditor />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            {/* Add more admin routes as needed */}
          </Route>
          
          {/* Company routes */}
          <Route path="/company" element={<CompanyLayout />}>
            <Route index element={<CompanyDashboard />} />
            {/* Add more company routes as needed */}
          </Route>
          
          {/* Technician routes */}
          <Route path="/tech" element={<TechLayout />}>
            <Route index element={<TechnicianDashboard />} />
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
