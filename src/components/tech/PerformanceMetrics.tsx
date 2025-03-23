import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Activity, Star, Clock, Users, Award, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface MetricsData {
  completedRepairs: number;
  averageTime: string;
  customerRating: number;
  efficiencyScore: number;
  customersServed: number;
}

interface PerformanceMetricsProps extends Partial<MetricsData> {}

export function PerformanceMetrics(props: PerformanceMetricsProps = {}) {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetricsData = async () => {
      setLoading(true);
      try {
        // If props were passed, use them instead of fetching
        if (Object.keys(props).length > 0) {
          const providedMetrics: MetricsData = {
            completedRepairs: props.completedRepairs || 0,
            averageTime: props.averageTime || "0 hrs",
            customerRating: props.customerRating || 0,
            efficiencyScore: props.efficiencyScore || 0,
            customersServed: props.customersServed || 0
          };
          setMetrics(providedMetrics);
          setLoading(false);
          return;
        }

        // In a real application, we would fetch from the database here
        // For example:
        // const { data, error } = await supabase
        //   .from('technician_metrics')
        //   .select('*')
        //   .eq('technician_id', currentUserId)
        //   .single();
        
        // if (error) throw error;
        // setMetrics(data);
        
        // For now, just set loading to false
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching performance metrics:", error);
        toast({
          title: "Failed to load metrics",
          description: "Please try again later",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    fetchMetricsData();
  }, [props]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <CardTitle>Performance Metrics</CardTitle>
          </div>
          <CardDescription>
            Loading your repair performance and efficiency statistics...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <CardTitle>Performance Metrics</CardTitle>
          </div>
          <CardDescription>
            Your repair performance and efficiency statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 border rounded-lg">
            <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">No Performance Data</h3>
            <p className="text-gray-500 mb-4">You don't have any performance metrics yet.</p>
            <p className="text-sm text-gray-500">Complete some service calls to see your metrics here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-500" />
          <CardTitle>Performance Metrics</CardTitle>
        </div>
        <CardDescription>
          Your repair performance and efficiency statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-blue-600">{metrics?.completedRepairs || 0}</div>
            <p className="text-sm text-muted-foreground">Completed Repairs</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-blue-600">{metrics?.customerRating || 0}</div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 fill-opacity-80" />
            </div>
            <p className="text-sm text-muted-foreground">Customer Rating</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Average Repair Time</span>
              </div>
              <span className="text-sm font-semibold">{metrics?.averageTime || "0 hrs"}</span>
            </div>
            <Progress value={70} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Efficiency Score</span>
              </div>
              <span className="text-sm font-semibold">{metrics?.efficiencyScore || 0}%</span>
            </div>
            <Progress value={metrics?.efficiencyScore || 0} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Customers Served</span>
              </div>
              <span className="text-sm font-semibold">{metrics?.customersServed || 0}</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
