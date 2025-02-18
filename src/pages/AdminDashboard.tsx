
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { LoadingScreen } from '@/components/LoadingScreen';
import Workflows from '@/pages/Workflows';
import WorkflowEditor from '@/pages/WorkflowEditor';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Workflows />} />
          <Route path="workflow-editor" element={<WorkflowEditor />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
}
