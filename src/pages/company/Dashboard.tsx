
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckSquare,
  AlertCircle,
  UserPlus,
  Settings,
  BarChart3,
  MessageSquare,
  Bell,
  FileText,
  Wrench
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCompanyTechnicians } from '@/hooks/useCompanyTechnicians';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  
  // For demo purposes, using a hardcoded company ID
  const companyId = 'company-2';
  const { technicians, isLoading } = useCompanyTechnicians(companyId);

  // Calculate basic stats from technicians data
  const activeTechnicians = technicians.filter(tech => tech.status === 'active').length;
  const totalTechnicians = technicians.length;
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your repair service operations</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/company/technicians')} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Technician
          </Button>
          <Button variant="outline" onClick={() => navigate('/company/settings')}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTechnicians}</div>
            <p className="text-xs text-muted-foreground">
              {totalTechnicians} total technicians
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,470</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your technicians</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <CheckSquare className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium">Repair completed</p>
                  <p className="text-sm text-gray-600">Washing machine repair by John Doe</p>
                </div>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">Job started</p>
                  <p className="text-sm text-gray-600">Dishwasher repair by Jane Smith</p>
                </div>
                <span className="text-xs text-gray-500">4 hours ago</span>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <div className="flex-1">
                  <p className="font-medium">Parts needed</p>
                  <p className="text-sm text-gray-600">Refrigerator repair on hold</p>
                </div>
                <span className="text-xs text-gray-500">6 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Technicians */}
        <Card>
          <CardHeader>
            <CardTitle>Active Technicians</CardTitle>
            <CardDescription>Currently working technicians</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading technicians...</div>
            ) : (
              <div className="space-y-3">
                {technicians.slice(0, 5).map((tech) => (
                  <div key={tech.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {tech.full_name?.charAt(0) || tech.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tech.full_name || tech.email.split('@')[0]}</p>
                        <p className="text-xs text-gray-500">{tech.role}</p>
                      </div>
                    </div>
                    <Badge variant={tech.status === 'active' ? 'default' : 'secondary'}>
                      {tech.status}
                    </Badge>
                  </div>
                ))}
                {technicians.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No technicians found
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Button 
          variant="outline" 
          className="h-20 flex flex-col items-center gap-2"
          onClick={() => navigate('/company/technicians')}
        >
          <Users className="h-6 w-6" />
          <span>Manage Technicians</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex flex-col items-center gap-2"
          onClick={() => navigate('/workflows')}
        >
          <FileText className="h-6 w-6" />
          <span>Workflows</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex flex-col items-center gap-2"
          onClick={() => navigate('/company/support')}
        >
          <MessageSquare className="h-6 w-6" />
          <span>Support</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex flex-col items-center gap-2"
          onClick={() => navigate('/company/subscription')}
        >
          <BarChart3 className="h-6 w-6" />
          <span>Subscription</span>
        </Button>
      </div>
    </div>
  );
}
