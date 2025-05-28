import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouteGuard } from "@/components/RouteGuard";
import { GlobalErrorBoundary } from "@/components/error/GlobalErrorBoundary";
import { LayoutProvider } from "@/components/layout/LayoutProvider";
import { DataProvider } from "@/components/data/DataProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { SignUp } from "@/pages/SignUp";
import { Pricing } from "@/pages/Pricing";
import { Contact } from "@/pages/Contact";
import { TermsOfService } from "@/pages/TermsOfService";
import { PrivacyPolicy } from "@/pages/PrivacyPolicy";
import { TechLayout } from "@/components/tech/TechLayout";
import { TechDashboard } from "@/pages/tech/TechDashboard";
import { TechCalendar } from "@/pages/tech/TechCalendar";
import { TechTraining } from "@/pages/tech/TechTraining";
import { TechProfile } from "@/pages/tech/TechProfile";
import { TechCustomers } from "@/pages/tech/TechCustomers";
import { TechEquipment } from "@/pages/tech/TechEquipment";
import { TechSettings } from "@/pages/tech/TechSettings";
import { RouteErrorBoundary } from "@/components/error/RouteErrorBoundary";
import { NotFound } from "@/pages/NotFound";
import { UserManagement } from "@/pages/admin/UserManagement";
import { SystemMessages } from "@/pages/admin/SystemMessages";
import { ActivityLogs } from "@/pages/admin/ActivityLogs";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Billing } from "@/pages/admin/Billing";
import { Workflows } from "@/pages/admin/Workflows";
import { CompanySettings } from "@/pages/admin/CompanySettings";
import { useUserManagementStore } from "@/store/userManagementStore";
import { useEffect } from "react";

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
              <LayoutProvider>
                <DataProvider>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />

                    <Route path="/tech" element={<RouteGuard><TechLayout /></RouteGuard>}>
                      <Route index element={<TechDashboard />} />
                      <Route path="dashboard" element={<TechDashboard />} />
                      <Route path="calendar" element={<TechCalendar />} />
                      <Route path="training" element={<TechTraining />} />
                      <Route path="profile" element={<TechProfile />} />
                      <Route path="customers" element={<TechCustomers />} />
                      <Route path="equipment" element={<TechEquipment />} />
                      <Route path="settings" element={<TechSettings />} />
                    </Route>

                    <Route path="/admin" element={<RouteGuard requireAdmin={true}><AdminLayout /></RouteGuard>}>
                      <Route index element={<UserManagement />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="messages" element={<SystemMessages />} />
                      <Route path="activity" element={<ActivityLogs />} />
                      <Route path="billing" element={<Billing />} />
                      <Route path="workflows" element={<Workflows />} />
                      <Route path="company" element={<CompanySettings />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                    <Route path="/error" element={<RouteErrorBoundary />} />
                  </Routes>
                </DataProvider>
              </LayoutProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
