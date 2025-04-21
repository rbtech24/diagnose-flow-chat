
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, Book, MessageCircle, Wrench, Clock, 
  ThumbsUp, Activity, AlertCircle, CheckCircle, 
  Database
} from "lucide-react";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import { useTechMetrics } from "@/hooks/useTechMetrics";
import { useAuth } from "@/context/AuthContext";

// Extract metric card component for reuse and better organization
const MetricCard = React.memo(({ title, value, icon, color }: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  color: string;
}) => (
  <Card className={`border-${color}-200 bg-${color}-50`}>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center">
        {icon}
        <span className="text-2xl font-bold">{value}</span>
      </div>
    </CardContent>
  </Card>
));

// Extract feature card component for reuse
const FeatureCard = React.memo(({ 
  title, 
  description, 
  icon, 
  color, 
  linkText, 
  linkPath, 
  buttonVariant = "outline" 
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  linkText: string;
  linkPath: string;
  buttonVariant?: "default" | "outline";
}) => (
  <Card className={`border-${color}-200 bg-${color}-50`}>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm mb-4">{description}</p>
      <Button className="w-full" variant={buttonVariant} asChild>
        <Link to={linkPath}>{linkText}</Link>
      </Button>
    </CardContent>
  </Card>
));

// Welcome banner component
const WelcomeBanner = React.memo(({ name, date, onStartDiagnosis }: {
  name: string;
  date: string;
  onStartDiagnosis: () => void;
}) => (
  <Card className="mb-6 border-blue-200 bg-blue-50">
    <CardContent className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Welcome Back, {name}</h2>
          <p className="text-gray-500">{date}</p>
        </div>
        <Button size="lg" onClick={onStartDiagnosis}>
          Start Diagnosis
        </Button>
      </div>
    </CardContent>
  </Card>
));

// Key metrics component
const KeyMetrics = React.memo(({ responseTime, firstTimeFixRate }: {
  responseTime: string;
  firstTimeFixRate: number;
}) => (
  <Card className="mb-6 border-slate-200">
    <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
            <p className="text-2xl font-bold">{responseTime}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">First-Time Fix Rate</p>
            <p className="text-2xl font-bold">{firstTimeFixRate}%</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
));

// Small metric card component
const SmallMetricCard = React.memo(({ title, value, icon, iconColor }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex flex-col items-center text-center">
        <div className={`p-3 rounded-full bg-${iconColor}-100 mb-4`}>
          {icon}
        </div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
));

// CRM Integration banner component
const CrmIntegrationBanner = React.memo(() => (
  <Card className="border-2 border-dashed border-blue-200 bg-blue-50 mb-6">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Database className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium mb-1">CRM Integration</h3>
              <p className="text-sm text-gray-600 mb-2">Connect with services like HouseCallPro</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              COMING SOON
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Seamlessly integrate with your favorite CRM platforms. We're working hard to bring this feature to you.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
));

// Main dashboard component with React.memo for performance
const TechDashboard = React.memo(() => {
  const { role, isLoading: roleLoading } = useUserRole();
  const { workflows, isLoading: workflowsLoading } = useWorkflows();
  const { user } = useAuth();
  const { 
    assignedJobs, 
    completedJobs, 
    avgCompletionTime, 
    responseTime,
    satisfaction, 
    firstTimeFixRate,
    openIssues,
    isLoading: metricsLoading 
  } = useTechMetrics();
  
  // Get current date
  const today = new Date();
  const dateOptions = { 
    weekday: 'long' as const, 
    year: 'numeric' as const, 
    month: 'long' as const, 
    day: 'numeric' as const 
  };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);
  
  // Check if user is authorized to access this page
  if (!roleLoading && role !== 'tech' && role !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  const isLoading = metricsLoading || workflowsLoading;
  const userName = user?.name || 'Technician';
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Technician Dashboard</h1>
        <p className="text-gray-500">{formattedDate}</p>
      </div>
      
      <WelcomeBanner 
        name={userName} 
        date={formattedDate} 
        onStartDiagnosis={() => window.location.href = '/tech/diagnostics'} 
      />
      
      <KeyMetrics 
        responseTime={responseTime} 
        firstTimeFixRate={firstTimeFixRate} 
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SmallMetricCard 
          title="Active Jobs" 
          value={assignedJobs} 
          icon={<Wrench className="h-5 w-5 text-blue-600" />} 
          iconColor="blue" 
        />
        
        <SmallMetricCard 
          title="Completed Jobs" 
          value={completedJobs} 
          icon={<CheckCircle className="h-5 w-5 text-green-600" />} 
          iconColor="green" 
        />
        
        <SmallMetricCard 
          title="Response Time" 
          value={responseTime} 
          icon={<Clock className="h-5 w-5 text-purple-600" />} 
          iconColor="purple" 
        />
        
        <SmallMetricCard 
          title="Open Issues" 
          value={openIssues} 
          icon={<AlertCircle className="h-5 w-5 text-amber-600" />} 
          iconColor="amber" 
        />
      </div>
      
      <CrmIntegrationBanner />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          title="Diagnostics"
          description={`Run diagnostic procedures. Available workflows: ${workflows.length}`}
          icon={<Stethoscope className="h-5 w-5 text-blue-600" />}
          color="blue"
          linkText="Start Diagnosis"
          linkPath="/tech/diagnostics"
          buttonVariant="default"
        />
        
        <FeatureCard
          title="Knowledge Base"
          description="Access repair guides and technical documentation"
          icon={<Book className="h-5 w-5 text-green-600" />}
          color="green"
          linkText="View Knowledge Base"
          linkPath="/tech/knowledge"
        />
        
        <FeatureCard
          title="Community"
          description="Connect with other technicians, ask questions, share knowledge"
          icon={<MessageCircle className="h-5 w-5 text-purple-600" />}
          color="purple"
          linkText="Join Discussion"
          linkPath="/tech/community"
        />
      </div>
    </div>
  );
});

export default TechDashboard;
