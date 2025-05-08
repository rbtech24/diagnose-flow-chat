import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthLayout } from './components/auth/AuthLayout';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import { Pricing } from './pages/Pricing';
import { CompanyDashboard } from './pages/company/Dashboard';
import { CompanyRepairs } from './pages/company/Repairs';
import { CompanyTechnicians } from './pages/company/Technicians';
import { CompanyAccount } from './pages/company/Account';
import { TechnicianDashboard } from './pages/tech/Dashboard';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminCompanies } from './pages/admin/Companies';
import { AdminCompanyDetail } from './pages/admin/CompanyDetail';
import { AdminWorkflows } from './pages/admin/Workflows';
import { AdminSupport } from './pages/admin/Support';
import { AdminCommunity } from './pages/admin/Community';
import { AdminAccounts } from './pages/admin/AdminAccounts';
import { AdminNewCompany } from './pages/admin/NewCompany';
import { CommunityPostDetail } from './components/community/CommunityPostDetail';
import { SupportTicketDetail } from './components/support/SupportTicketDetail';
import { RequireAuth } from './components/auth/RequireAuth';
import { AuthProvider } from './components/auth/AuthProvider';
import { ScrollToTop } from './utils/ScrollToTop';

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route index element={<Navigate to="sign-in" />} />
        </Route>
        <Route path="/pricing" element={<Pricing />} />

        {/* Company Routes */}
        <Route path="/company" element={<RequireAuth><Layout /></RequireAuth>}>
          <Route index element={<CompanyDashboard />} />
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="repairs" element={<CompanyRepairs />} />
          <Route path="technicians" element={<CompanyTechnicians />} />
          <Route path="account" element={<CompanyAccount />} />
        </Route>

        {/* Technician Routes */}
        <Route path="/tech" element={<RequireAuth><Layout /></RequireAuth>}>
          <Route index element={<TechnicianDashboard />} />
          <Route path="dashboard" element={<TechnicianDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<RequireAuth requireAdmin><Layout /></RequireAuth>}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="companies" element={<AdminCompanies />} />
            <Route path="companies/new" element={<AdminNewCompany />} />
          <Route path="companies/:id" element={<AdminCompanyDetail />} />
          <Route path="workflows" element={<AdminWorkflows />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="support/:id" element={<SupportTicketDetail />} />
          <Route path="community" element={<AdminCommunity />} />
          <Route path="community/:id" element={<CommunityPostDetail />} />
          <Route path="accounts" element={<AdminAccounts />} />
        </Route>

        {/* Catch-all route for redirecting to sign-in */}
        <Route path="*" element={<Navigate to="/auth/sign-in" />} />
      </Routes>
    </AuthProvider>
  );
}
