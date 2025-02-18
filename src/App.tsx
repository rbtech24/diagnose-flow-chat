
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Workflows from '@/pages/Workflows';
import WorkflowEditor from '@/pages/WorkflowEditor';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/workflow-editor" element={<WorkflowEditor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
