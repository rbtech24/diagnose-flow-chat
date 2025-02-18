
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { LoadingScreen } from '@/components/LoadingScreen';
import Workflows from '@/pages/Workflows';
import WorkflowEditor from '@/pages/WorkflowEditor';

// Lazy load components
const SecuritySettings = React.lazy(() => import('../components/SecuritySettings'));
const ApiSettings = React.lazy(() => import('../components/ApiSettings'));
const SubscriptionPlanBuilder = React.lazy(() => import('../components/SubscriptionPlanBuilder'));
const CompanyList = React.lazy(() => import('../components/CompanyList')); 
const UserList = React.lazy(() => import('../components/UserList')); 
const SupportPage = React.lazy(() => import('./SupportPage')); 
const FeatureRequests = React.lazy(() => import('./FeatureRequests')); 
const RepairHistory = React.lazy(() => import('./RepairHistory')); 
const Community = React.lazy(() => import('./Community')); 
const UserProfile = React.lazy(() => import('./UserProfile')); 
const SystemHealth = React.lazy(() => import('../components/SystemHealth')); 
const AuditLogs = React.lazy(() => import('../components/AuditLogs')); 
const SystemBackup = React.lazy(() => import('../components/SystemBackup')); 
const SystemAnnouncements = React.lazy(() => import('../components/SystemAnnouncements')); 
const AdminActivityLogs = React.lazy(() => import('../components/AdminActivityLogs')); 
const SystemAnalytics = React.lazy(() => import('../components/SystemAnalytics')); 
const DashboardHome = React.lazy(() => import('./DashboardHome'));

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="workflow-editor" element={<WorkflowEditor />} />
          <Route path="repairs" element={<RepairHistory />} />
          <Route path="community" element={<Community />} />
          <Route path="features" element={<FeatureRequests />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="companies" element={<CompanyList />} />
          <Route path="users" element={<UserList />} />
          <Route path="plans" element={<SubscriptionPlanBuilder />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="api-settings" element={<ApiSettings />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="health" element={<SystemHealth />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="backup" element={<SystemBackup />} />
          <Route path="announcements" element={<SystemAnnouncements />} />
          <Route path="activity" element={<AdminActivityLogs />} />
          <Route path="analytics" element={<SystemAnalytics />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
}
