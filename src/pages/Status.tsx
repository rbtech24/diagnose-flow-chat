import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { StatusSubscriptionModal } from "@/components/status/StatusSubscriptionModal";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

type ServiceStatus = "operational" | "degraded" | "outage";

interface ServiceStatusItem {
  name: string;
  status: ServiceStatus;
  icon: JSX.Element;
  badge: JSX.Element;
}

interface IncidentUpdate {
  time: string;
  message: string;
}

interface Incident {
  title: string;
  date: string;
  status: "resolved" | "investigating" | "identified" | "monitoring";
  updates: IncidentUpdate[];
}

export default function Status() {
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [currentUptimePercentage, setCurrentUptimePercentage] = useState(99.98);
  
  const [services, setServices] = useState<ServiceStatusItem[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    title: "Loading...",
    description: "Fetching system status",
    className: "bg-gray-50 border-gray-200",
    icon: <Clock className="h-6 w-6 text-gray-500 flex-shrink-0" />
  });

  useEffect(() => {
    async function fetchStatusData() {
      try {
        const { data: serviceData, error: serviceError } = await supabase
          .from('service_statuses')
          .select('*')
          .order('name');
        
        if (serviceError) throw serviceError;
        
        const formattedServices = serviceData?.map(service => ({
          name: service.name,
          status: service.status as ServiceStatus,
          icon: getStatusIcon(service.status),
          badge: getStatusBadge(service.status)
        })) || [];
        
        setServices(formattedServices);
        
        const { data: incidentData, error: incidentError } = await supabase
          .from('incidents')
          .select('*, incident_updates(*)')
          .eq('status', 'resolved')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (incidentError) throw incidentError;
        
        const formattedIncidents = incidentData?.map(incident => ({
          title: incident.title,
          date: new Date(incident.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          }),
          status: incident.status,
          updates: incident.incident_updates.map((update: any) => ({
            time: new Date(update.created_at).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            message: update.message
          })).sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        })) || [];
        
        setIncidents(formattedIncidents);
        
        const { data: uptimeData, error: uptimeError } = await supabase
          .from('system_metrics')
          .select('value')
          .eq('name', 'uptime_percentage')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (uptimeError) throw uptimeError;
        
        if (uptimeData && uptimeData.length > 0) {
          setCurrentUptimePercentage(Number(uptimeData[0].value));
        }
        
        updateSystemStatus(formattedServices);
      } catch (error) {
        console.error("Error fetching status data:", error);
        toast({
          title: "Failed to load status data",
          description: "Please try again later",
          variant: "destructive"
        });
        
        const defaultServices = [
          {
            name: "Web Application",
            status: "operational" as ServiceStatus,
            icon: <CheckCircle className="h-5 w-5 text-green-500" />,
            badge: <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Operational</Badge>
          },
          {
            name: "API Services",
            status: "operational" as ServiceStatus,
            icon: <CheckCircle className="h-5 w-5 text-green-500" />,
            badge: <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Operational</Badge>
          }
        ];
        
        setServices(defaultServices);
        updateSystemStatus(defaultServices);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStatusData();
  }, []);

  function updateSystemStatus(services: ServiceStatusItem[]) {
    const hasOutage = services.some(service => service.status === "outage");
    const hasDegradation = services.some(service => service.status === "degraded");
    
    if (hasOutage) {
      setSystemStatus({
        title: "System Outage",
        description: "Some services are currently experiencing outages.",
        className: "bg-red-50 border-red-200",
        icon: <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
      });
    } else if (hasDegradation) {
      setSystemStatus({
        title: "Degraded Performance",
        description: "Some services are experiencing performance issues.",
        className: "bg-yellow-50 border-yellow-200",
        icon: <Clock className="h-6 w-6 text-yellow-500 flex-shrink-0" />
      });
    } else {
      setSystemStatus({
        title: "All Systems Operational",
        description: "All services are running normally.",
        className: "bg-green-50 border-green-200",
        icon: <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
      });
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'outage':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'degraded':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  }
  
  function getStatusBadge(status: string) {
    switch (status) {
      case 'outage':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Outage</Badge>;
      case 'degraded':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Degraded Performance</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Operational</Badge>;
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <div className="container mx-auto flex-1 px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 md:h-24 items-center justify-between px-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/a942106a-6512-4888-a5c2-dcf6c5d18b64.png" 
              alt="Repair Auto Pilot" 
              className="h-10 md:h-16"
            />
          </div>
          <Button asChild variant="outline" size="sm" className="md:size-default">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden xs:inline">Back to Home</span>
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">System Status</h1>
        <p className="text-gray-600 mb-6 md:mb-8 max-w-3xl text-sm md:text-base">
          Check the current status of all Repair Auto Pilot services and systems.
        </p>
        
        <div className={`${systemStatus.className} rounded-lg p-4 md:p-6 mb-6 md:mb-8 flex items-center gap-3 md:gap-4`}>
          {systemStatus.icon}
          <div>
            <h2 className="text-base md:text-lg font-semibold">{systemStatus.title}</h2>
            <p className="text-gray-600 text-sm md:text-base">{systemStatus.description}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-0">Current Uptime</h3>
          <span className="text-xs md:text-sm text-gray-500">Last 30 days</span>
        </div>
        
        <div className="mb-6 md:mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs md:text-sm font-medium">{currentUptimePercentage}% uptime</span>
            <span className="text-xs text-gray-500">Target: 99.9%</span>
          </div>
          <Progress value={currentUptimePercentage} className="h-2" />
        </div>
        
        <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
              <div className="flex items-center gap-2 md:gap-3">
                {service.icon}
                <span className="font-medium text-sm md:text-base">{service.name}</span>
              </div>
              {service.badge}
            </div>
          ))}
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold mb-4">Past Incidents</h2>
        
        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          {incidents.length > 0 ? (
            incidents.map((incident, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 md:p-4 border-b">
                  <div className="flex flex-wrap items-center gap-2">
                    <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                    <h3 className="font-medium text-sm md:text-base">{incident.title}</h3>
                    <Badge variant="outline">Resolved</Badge>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">{incident.date}</p>
                </div>
                <div className="p-3 md:p-4 space-y-3 md:space-y-4">
                  {incident.updates.map((update, updateIndex) => (
                    <div key={updateIndex}>
                      <p className="text-xs md:text-sm text-gray-500">{update.time}</p>
                      <p className="text-sm md:text-base">{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-gray-500">No recent incidents to report</p>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-semibold mb-2">Subscribe to Updates</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">Receive real-time notifications about system status and scheduled maintenance.</p>
          <Button 
            className="bg-blue-600 w-full md:w-auto"
            onClick={() => setSubscriptionModalOpen(true)}
          >
            Subscribe to Status Updates
          </Button>
        </div>
      </main>
      
      <footer className="border-t bg-white py-4 md:py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs md:text-sm text-gray-500">© 2023 Repair Auto Pilot. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-3 md:mt-4">
            <Link to="/terms-of-use" onClick={() => window.scrollTo(0, 0)} className="text-xs md:text-sm text-gray-500 hover:text-blue-600">Terms of Use</Link>
            <span className="text-gray-400">|</span>
            <Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="text-xs md:text-sm text-gray-500 hover:text-blue-600">Privacy Policy</Link>
          </div>
        </div>
      </footer>

      <StatusSubscriptionModal 
        open={subscriptionModalOpen} 
        onOpenChange={setSubscriptionModalOpen} 
      />
    </div>
  );
}
