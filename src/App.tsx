
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CompanyLayout } from './components/company/CompanyLayout';
import { TechLayout } from './components/tech/TechLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import Index from './pages/Index';
import { Pricing } from './pages/Pricing';
import CompanyDashboard from './pages/company/Dashboard';
import { CompanyFeatureRequests } from './pages/company/FeatureRequests';
import { CompanyCommunity } from './pages/company/Community';
import { CompanySupport } from './pages/company/Support';
import TechnicianDashboard from './pages/tech/Dashboard';
import { TechCommunity } from './pages/tech/Community';
import { TechSupport } from './pages/tech/Support';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCompanies from './pages/admin/Companies';
import AdminCompanyDetail from './pages/admin/CompanyDetail';
import AdminWorkflows from './pages/admin/Workflows';
import AdminSupport from './pages/admin/Support';
import AdminCommunity from './pages/admin/Community';
import AdminAccounts from './pages/admin/AdminAccounts';
import { DiagnosticsPage } from './pages/diagnostics/DiagnosticsPage';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Company Routes */}
      <Route path="/company" element={<CompanyLayout />}>
        <Route index element={<CompanyDashboard />} />
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="diagnostics" element={<DiagnosticsPage />} />
        <Route path="feature-requests" element={<CompanyFeatureRequests />} />
        <Route path="community" element={<CompanyCommunity />} />
        <Route path="support" element={<CompanySupport />} />
      </Route>

      {/* Technician Routes */}
      <Route path="/tech" element={<TechLayout />}>
        <Route index element={<TechnicianDashboard />} />
        <Route path="dashboard" element={<TechnicianDashboard />} />
        <Route path="community" element={<TechCommunity />} />
        <Route path="support" element={<TechSupport />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="companies/:id" element={<AdminCompanyDetail />} />
        <Route path="workflows" element={<AdminWorkflows />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="community" element={<AdminCommunity />} />
        <Route path="accounts" element={<AdminAccounts />} />
      </Route>

      {/* Catch-all route for redirecting to dashboard based on role */}
      <Route path="*" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
  );
}
