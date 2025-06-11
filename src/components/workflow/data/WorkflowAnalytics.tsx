
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Calendar,
  Target
} from 'lucide-react';
import { SavedWorkflow } from '@/utils/flow/types';

interface AnalyticsData {
  totalWorkflows: number;
  totalExecutions: number;
  averageCompletionTime: number;
  successRate: number;
  mostUsedWorkflows: Array<{ name: string; count: number }>;
  workflowsByCategory: Array<{ category: string; count: number }>;
  executionTrends: Array<{ date: string; executions: number }>;
  nodeTypeDistribution: Array<{ type: string; count: number; color: string }>;
}

interface WorkflowAnalyticsProps {
  workflows: SavedWorkflow[];
  executionHistory?: any[];
}

export function WorkflowAnalytics({ 
  workflows, 
  executionHistory = [] 
}: WorkflowAnalyticsProps) {
  
  const analyticsData: AnalyticsData = useMemo(() => {
    // Calculate workflow categories
    const categoryMap = new Map<string, number>();
    workflows.forEach(workflow => {
      const category = workflow.metadata.folder || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    // Calculate node type distribution
    const nodeTypeMap = new Map<string, number>();
    workflows.forEach(workflow => {
      workflow.nodes.forEach(node => {
        const type = node.data?.type || 'question';
        nodeTypeMap.set(type, (nodeTypeMap.get(type) || 0) + 1);
      });
    });

    const nodeTypeColors = {
      'question': '#3b82f6',
      'equipment-test': '#10b981',
      'photo-capture': '#f59e0b',
      'procedure-step': '#8b5cf6',
      'decision-tree': '#ef4444',
      'data-form': '#06b6d4',
      'safety-warning': '#f97316'
    };

    // Mock execution data for demo
    const mockExecutions = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      executions: Math.floor(Math.random() * 20) + 5
    }));

    return {
      totalWorkflows: workflows.length,
      totalExecutions: executionHistory.length || 127, // Mock data
      averageCompletionTime: 8.5, // Mock data in minutes
      successRate: 94.2, // Mock data
      mostUsedWorkflows: workflows.slice(0, 5).map((w, i) => ({
        name: w.metadata.name,
        count: Math.floor(Math.random() * 50) + 10
      })),
      workflowsByCategory: Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count
      })),
      executionTrends: mockExecutions,
      nodeTypeDistribution: Array.from(nodeTypeMap.entries()).map(([type, count]) => ({
        type,
        count,
        color: nodeTypeColors[type as keyof typeof nodeTypeColors] || '#6b7280'
      }))
    };
  }, [workflows, executionHistory]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Workflows</p>
                <p className="text-2xl font-bold">{analyticsData.totalWorkflows}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold">{analyticsData.totalExecutions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Completion</p>
                <p className="text-2xl font-bold">{formatDuration(analyticsData.averageCompletionTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{analyticsData.successRate}%</p>
                <Progress value={analyticsData.successRate} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Execution Trends (30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.executionTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="executions" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Workflows by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Workflows by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.workflowsByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Node Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Node Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.nodeTypeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ type, count }) => `${type}: ${count}`}
                >
                  {analyticsData.nodeTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Used Workflows */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Most Used Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.mostUsedWorkflows.map((workflow, index) => (
                <div key={workflow.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <span className="font-medium truncate">{workflow.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{workflow.count} runs</span>
                    <div className="w-16">
                      <Progress 
                        value={(workflow.count / Math.max(...analyticsData.mostUsedWorkflows.map(w => w.count))) * 100} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Math.round(analyticsData.successRate)}%
              </div>
              <div className="text-sm text-green-700">Success Rate</div>
              <div className="text-xs text-green-600 mt-1">Above industry average</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {formatDuration(analyticsData.averageCompletionTime)}
              </div>
              <div className="text-sm text-blue-700">Avg. Completion Time</div>
              <div className="text-xs text-blue-600 mt-1">15% faster than last month</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {Math.round(analyticsData.totalExecutions / 30)}
              </div>
              <div className="text-sm text-purple-700">Daily Average</div>
              <div className="text-xs text-purple-600 mt-1">Executions per day</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
