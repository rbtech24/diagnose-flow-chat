import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import Workflows from '@/pages/Workflows';
import WorkflowEditor from '@/pages/WorkflowEditor';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="workflows" element={<Workflows />} />
        <Route path="workflow-editor" element={<WorkflowEditor />} />
      </Routes>
    </AdminLayout>
  );
}
