
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SystemMessageProvider } from "./context/SystemMessageContext";
import { RouteGuard } from "./components/RouteGuard";
import { GlobalErrorBoundary } from "./components/error/GlobalErrorBoundary";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import SalesPage from "./pages/SalesPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DevLogin from "./pages/DevLogin";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/admin/Dashboard";
import CompanyDashboard from "./pages/company/Dashboard";
import TechDashboard from "./pages/tech/Dashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <SystemMessageProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/sales" element={<SalesPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/dev-login" element={<DevLogin />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  <Route 
                    path="/admin" 
                    element={
                      <RouteGuard allowedRoles={['admin']}>
                        <AdminDashboard />
                      </RouteGuard>
                    } 
                  />
                  <Route 
                    path="/company" 
                    element={
                      <RouteGuard allowedRoles={['company']}>
                        <CompanyDashboard />
                      </RouteGuard>
                    } 
                  />
                  <Route 
                    path="/tech" 
                    element={
                      <RouteGuard allowedRoles={['tech']}>
                        <TechDashboard />
                      </RouteGuard>
                    } 
                  />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SystemMessageProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
