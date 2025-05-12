
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  FileText,
  PenLine,
  MessageSquare,
  MessageSquareQuestion,
  Clock,
  Activity,
  CheckSquare,
  Users,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { WorkflowView } from '@/components/workflow/WorkflowView';
import { useWorkflows } from '@/hooks/useWorkflows';

// Added this interface to resolve type issues
interface TechnicianMetrics {
  averageResponseTime: string;
  performanceScore: number;
  activeJobs: number;
  completedJobs: number;
  averageServiceTime: string;
  efficiencyScore: number;
}

// Define CompanyMetrics interface to match the actual property names
interface CompanyMetrics {
  averageResponseTime: string;
  performanceScore: number;
  activeJobs: number;
  completedJobs: number;
  averageServiceTime: string;
  efficiencyScore: number;
}

export default function TechDashboard() {
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const { workflows, folders } = useWorkflows();

  // Mock metrics for demonstration
  const metrics: CompanyMetrics = {
    averageResponseTime: '1.5h',
    performanceScore: 92,
    activeJobs: 8,
    completedJobs: 156,
    averageServiceTime: '45m',
    efficiencyScore: 88
  };

  // Filter workflows based on the selected folder (if any)
  const filteredWorkflows = selectedFolder 
    ? workflows.filter(w => w.metadata?.folder === selectedFolder)
    : workflows;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tech Dashboard</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Response Time</p>
              <p className="text-2xl font-semibold">{metrics.averageResponseTime}</p>
            </div>
            <Clock className="h-8 w-8 text-indigo-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Performance Score</p>
              <p className="text-2xl font-semibold">{metrics.performanceScore}%</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Jobs</p>
              <p className="text-2xl font-semibold">{metrics.activeJobs}</p>
            </div>
            <PenLine className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Jobs</p>
              <p className="text-2xl font-semibold">{metrics.completedJobs}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Service Time</p>
              <p className="text-2xl font-semibold">{metrics.averageServiceTime}</p>
            </div>
            <Users className="h-8 w-8 text-amber-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Efficiency Score</p>
              <p className="text-2xl font-semibold">{metrics.efficiencyScore}%</p>
            </div>
            <Calendar className="h-8 w-8 text-rose-500" />
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
            <FileText className="ml-2 h-4 w-4" />
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
            <MessageSquareQuestion className="ml-2 h-4 w-4" />
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
        
        {/* Folder selection */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={selectedFolder === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFolder("")}
          >
            All
          </Button>
          
          {folders.map((folder) => (
            <Button
              key={folder}
              variant={selectedFolder === folder ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFolder(folder)}
            >
              {folder}
            </Button>
          ))}
        </div>
        
        <WorkflowView 
          filteredAppliances={[]} 
          workflows={filteredWorkflows}
          isReordering={false}
          selectedFolder={selectedFolder}
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
