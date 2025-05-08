
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, UserRound, Package, Wrench, AlertTriangle, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { handleApiError } from "@/utils/errorHandler";
import { toast } from "sonner";
import { ActivityItem, ActivityMetadata } from "@/types/activity";

// Define proper interface for company address to avoid deep instantiation
interface CompanyAddress {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
}

// Define type for company and activity data
interface CompanyData {
  id: string;
  name: string;
  subscription_tier: string;
  created_at: string;
  updated_at?: string;
  trial_status?: string;
  trial_period?: number;
  trial_end_date?: string;
  company_address?: CompanyAddress | null;
}

// Simplified user activity data interface
interface UserActivityData {
  id: string;
  description?: string;
  activity_type: string; 
  created_at: string;
  metadata: Record<string, any>; // Using a simple record type
  ip_address?: string;
  user_agent?: string;
  user_id?: string;
}

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<UserActivityData[]>([]);
  const [activeTechnicians, setActiveTechnicians] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      
      try {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', id)
          .single();

        if (companyError) throw companyError;
        
        setCompany(companyData);
        
        // Fetch active technicians count
        const { count, error: techError } = await supabase
          .from('technicians')
          .select('id', { count: 'exact', head: true })
          .eq('company_id', id)
          .eq('status', 'active');
          
        if (techError) throw techError;
        setActiveTechnicians(count || 0);
        
        // Fetch recent activities
        const { data: activityData, error: activityError } = await supabase
          .from('user_activity_logs')
          .select()
          .eq('company_id', id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (activityError) throw activityError;
        
        if (activityData) {
          setActivities(activityData);
        }
        
      } catch (err) {
        const apiError = handleApiError(err, "fetching company details", false);
        setError(`Failed to load company: ${apiError.message}`);
        
        toast.error("Error loading company", {
          description: "Could not fetch company data. Please try again."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  // Completely rewritten formatActivity function to avoid type recursion issues
  const formatActivity = (activity: UserActivityData): ActivityItem => {
    // Create a safe metadata object
    const safeMetadata: ActivityMetadata = {};
    
    // Process metadata safely based on its type
    if (activity.metadata) {
      // Handle string metadata (needs parsing)
      if (typeof activity.metadata === 'string') {
        try {
          const parsed = JSON.parse(activity.metadata);
          // Safely copy properties we know about
          if (parsed.repair_id) safeMetadata.repair_id = String(parsed.repair_id);
          if (parsed.technician_name) safeMetadata.technician_name = String(parsed.technician_name);
          if (parsed.status) safeMetadata.status = String(parsed.status);
          
          // Copy other primitive values
          Object.entries(parsed).forEach(([key, value]) => {
            if (!['repair_id', 'technician_name', 'status'].includes(key)) {
              // Only add primitive values to avoid recursion
              if (value === null || 
                  typeof value === 'string' || 
                  typeof value === 'number' || 
                  typeof value === 'boolean') {
                safeMetadata[key] = value as string | number | boolean | null;
              }
            }
          });
        } catch (e) {
          // If parsing fails, use empty metadata
          console.error('Failed to parse activity metadata:', e);
        }
      } 
      // Handle object metadata directly
      else if (typeof activity.metadata === 'object' && activity.metadata !== null) {
        // Safely copy properties
        const metadata = activity.metadata;
        
        if ('repair_id' in metadata && metadata.repair_id) 
          safeMetadata.repair_id = String(metadata.repair_id);
        
        if ('technician_name' in metadata && metadata.technician_name) 
          safeMetadata.technician_name = String(metadata.technician_name);
        
        if ('status' in metadata && metadata.status) 
          safeMetadata.status = String(metadata.status);
        
        // Copy other primitive values
        Object.entries(metadata).forEach(([key, value]) => {
          if (!['repair_id', 'technician_name', 'status'].includes(key)) {
            // Only add primitive values to avoid recursion
            if (value === null || 
                typeof value === 'string' || 
                typeof value === 'number' || 
                typeof value === 'boolean') {
              safeMetadata[key] = value as string | number | boolean | null;
            }
          }
        });
      }
    }
    
    // Format and return the activity item
    return {
      id: activity.id,
      title: activity.description || `${activity.activity_type} activity`,
      timestamp: new Date(activity.created_at).toLocaleString(),
      activity_type: activity.activity_type,
      description: activity.description || '',
      metadata: safeMetadata
    };
  };

  // Get company address information safely
  const getFormattedAddress = (company: CompanyData): string => {
    if (!company.company_address) return 'No address provided';
    
    const address = company.company_address.address || '';
    const city = company.company_address.city || '';
    const state = company.company_address.state || '';
    const zip = company.company_address.zip || '';
    
    return address && city && state && zip
      ? `${address}, ${city}, ${state} ${zip}`
      : 'No address provided';
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/admin/companies")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Button>
          <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
        </div>
        <div className="grid gap-6">
          <div className="h-40 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-60 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !company) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/admin/companies")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Button>
          <h1 className="text-2xl font-bold">Company Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Company</h2>
              <p className="text-muted-foreground mb-6">{error || "The company could not be found or you don't have access."}</p>
              <Button onClick={() => navigate("/admin/companies")}>Return to Companies</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render company details
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/companies")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Companies
        </Button>
        <h1 className="text-3xl font-bold">Company Details</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{company?.name}</CardTitle>
            <CardDescription>
              {company && getFormattedAddress(company)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{company && getFormattedAddress(company)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined {company && new Date(company.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>Subscription: <Badge variant="secondary">{company?.subscription_tier}</Badge></span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span><Badge variant="secondary">{activeTechnicians} Active Technicians</Badge></span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions performed by this company</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="repairs">Repairs</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-2">
                {activities.length > 0 ? (
                  activities.map((activity) => {
                    const formatted = formatActivity(activity);
                    return (
                      <div key={formatted.id} className="border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {formatted.activity_type === "repair" && <Wrench className="h-4 w-4" />}
                            {formatted.activity_type === "account" && <UserRound className="h-4 w-4" />}
                            <span className="font-medium">{formatted.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{formatted.timestamp}</span>
                        </div>
                        {formatted.activity_type === "repair" && formatted.metadata && (
                          <div className="mt-2 text-sm">
                            <p>Repair ID: {formatted.metadata.repair_id}</p>
                            <p>Technician: {formatted.metadata.technician_name}</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-muted-foreground py-4">No recent activity</div>
                )}
              </TabsContent>
              <TabsContent value="repairs" className="space-y-2">
                {activities
                  .filter((activity) => activity.activity_type === "repair")
                  .map((activity) => {
                    const formatted = formatActivity(activity);
                    return (
                      <div key={formatted.id} className="border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Wrench className="h-4 w-4" />
                            <span className="font-medium">{formatted.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{formatted.timestamp}</span>
                        </div>
                        <div className="mt-2 text-sm">
                          <p>Repair ID: {formatted.metadata?.repair_id}</p>
                          <p>Technician: {formatted.metadata?.technician_name}</p>
                        </div>
                      </div>
                    );
                  })}
              </TabsContent>
              <TabsContent value="account" className="space-y-2">
                {activities
                  .filter((activity) => activity.activity_type === "account")
                  .map((activity) => {
                    const formatted = formatActivity(activity);
                    return (
                      <div key={formatted.id} className="border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <UserRound className="h-4 w-4" />
                            <span className="font-medium">{formatted.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{formatted.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
