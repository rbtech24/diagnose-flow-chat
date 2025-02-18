
import React, { Suspense } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { Layout } from './components/Layout';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Lazy load pages
const Landing = React.lazy(() => import('./pages/Landing'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const CompanyLogin = React.lazy(() => import('./pages/CompanyLogin'));
const TechLogin = React.lazy(() => import('./pages/TechLogin'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const SystemSetup = React.lazy(() => import('./pages/SystemSetup'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const CompanyDashboard = React.lazy(() => import('./pages/CompanyDashboard'));
const TechnicianDashboard = React.lazy(() => import('./pages/TechnicianDashboard'));

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <Suspense fallback={<LoadingScreen />}>
              <Layout>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/company/login" element={<CompanyLogin />} />
                  <Route path="/tech/login" element={<TechLogin />} />
                  <Route path="/setup" element={<SystemSetup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                  <Route path="/company/*" element={<CompanyDashboard />} />
                  <Route path="/tech/*" element={<TechnicianDashboard />} />
                </Routes>
              </Layout>
            </Suspense>
          </ErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
