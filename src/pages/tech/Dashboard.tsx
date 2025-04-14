
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import { Stethoscope, Book, MessageCircle, Wrench, Clock, ThumbsUp, UsersRound } from "lucide-react";
import { useTechMetrics } from "@/hooks/useTechMetrics";
import { useWorkflows } from "@/hooks/useWorkflows";

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

// Main dashboard component with React.memo for performance
const TechDashboard = React.memo(() => {
  const { role, isLoading: roleLoading } = useUserRole();
  const { workflows, isLoading: workflowsLoading } = useWorkflows();
  const { assignedJobs, completedJobs, avgCompletionTime, satisfaction, isLoading: metricsLoading } = useTechMetrics();
  
  // Check if user is authorized to access this page
  if (!roleLoading && role !== 'tech' && role !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  const isLoading = roleLoading || metricsLoading || workflowsLoading;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tech Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="Assigned Jobs" 
          value={assignedJobs} 
          icon={<Wrench className="h-4 w-4 text-blue-600 mr-2" />} 
          color="blue" 
        />
        
        <MetricCard 
          title="Completed Jobs" 
          value={completedJobs} 
          icon={<ThumbsUp className="h-4 w-4 text-green-600 mr-2" />} 
          color="green" 
        />
        
        <MetricCard 
          title="Avg. Completion Time" 
          value={avgCompletionTime} 
          icon={<Clock className="h-4 w-4 text-amber-600 mr-2" />} 
          color="amber" 
        />
        
        <MetricCard 
          title="Customer Satisfaction" 
          value={`${satisfaction}%`} 
          icon={<UsersRound className="h-4 w-4 text-purple-600 mr-2" />} 
          color="purple" 
        />
      </div>
      
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
