
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  PenLine,
  MessageSquare,
  HelpCircle,
  Clock,
  Activity,
  CheckSquare,
  Users,
  Calendar,
  Stethoscope,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { WorkflowView } from '@/components/workflow/WorkflowView';
import { useWorkflows } from '@/hooks/useWorkflows';

export default function TechDashboard() {
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  const { workflows, folders } = useWorkflows();
  
  // Filter workflows based on active status
  const activeWorkflows = workflows.filter(w => w.metadata?.isActive !== false);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tech Dashboard</h1>

      {/* Diagnostic Banner - New Section */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between p-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Stethoscope className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-blue-800">Diagnostic Procedures</h2>
                <p className="text-blue-600">Step-by-step troubleshooting guides for appliance repair</p>
              </div>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/diagnostics')}
            >
              Access Diagnostics
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            className="flex items-center justify-between py-6" 
            variant="outline"
            onClick={() => navigate('/diagnostics')}
          >
            <span>Start Diagnostics</span>
            <Stethoscope className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            className="flex items-center justify-between py-6" 
            variant="outline"
            onClick={() => navigate('/tech/support/new')}
          >
            <span>Create Support Ticket</span>
            <MessageSquare className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            className="flex items-center justify-between py-6" 
            variant="outline"
            onClick={() => navigate('/tech/feature-requests/new')}
          >
            <span>Submit Feature Request</span>
            <PenLine className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            className="flex items-center justify-between py-6" 
            variant="outline"
            onClick={() => navigate('/tech/community/new')}
          >
            <span>Ask Community</span>
            <HelpCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Workflows Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Diagnostic Workflows</h2>
          <Button 
            variant="outline" 
            onClick={() => navigate('/workflows')}
            className="flex items-center"
          >
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <WorkflowView 
          filteredAppliances={[]} 
          workflows={activeWorkflows}
          isReordering={false}
          selectedFolder=""
          onOpenWorkflowEditor={(folder, name) => {
            const path = name 
              ? `/workflow-editor?folder=${encodeURIComponent(folder)}&name=${encodeURIComponent(name)}`
              : `/workflow-editor?folder=${encodeURIComponent(folder)}`;
            navigate(path);
          }}
          isReadOnly={true}
        />
      </div>
    </div>
  );
}
