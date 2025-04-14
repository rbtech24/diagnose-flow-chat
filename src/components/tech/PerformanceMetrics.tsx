
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PerformanceMetricsProps {
  completedRepairs?: number;
  customerRating?: number;
  averageTime?: string;
  efficiencyScore?: number;
  customersServed?: number;
}

export function PerformanceMetrics({
  completedRepairs = 0,
  customerRating = 0,
  averageTime = "0h 0m",
  efficiencyScore = 0,
  customersServed = 0
}: PerformanceMetricsProps) {
  const [metrics, setMetrics] = useState({
    completedRepairs,
    customerRating,
    averageTime,
    efficiencyScore,
    customersServed
  });

  const [loading, setLoading] = useState(completedRepairs === 0);
  const { toast } = useToast();

  useEffect(() => {
    if (completedRepairs > 0) {
      setMetrics({
        completedRepairs,
        customerRating,
        averageTime,
        efficiencyScore,
        customersServed
      });
      return;
    }

    const fetchPerformanceData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMetrics({
          completedRepairs: 248,
          customerRating: 4.8,
          averageTime: "1h 42m",
          efficiencyScore: 92,
          customersServed: 185
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching performance data:', error);
        setLoading(false);
        toast({
          description: "Failed to load performance data",
          type: "error",
          variant: "destructive"
        });
      }
    };

    fetchPerformanceData();
  }, [completedRepairs, customerRating, averageTime, efficiencyScore, customersServed, toast]);

  if (loading) {
    return <div className="animate-pulse p-4">Loading performance metrics...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Technician Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Customer Rating</span>
                <span className="text-sm font-medium text-gray-500">{metrics.customerRating}/5</span>
              </div>
              <Progress value={metrics.customerRating * 20} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Efficiency Score</span>
                <span className="text-sm font-medium text-gray-500">{metrics.efficiencyScore}%</span>
              </div>
              <Progress value={metrics.efficiencyScore} className="h-2" />
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">Completed Repairs</p>
                  <p className="text-2xl font-bold">{metrics.completedRepairs}</p>
                </div>
                <div>
                  <p className="font-medium">Average Service Time</p>
                  <p className="text-2xl font-bold">{metrics.averageTime}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-6">
              <p className="text-sm font-medium">Customers Served</p>
              <p className="text-5xl font-bold mt-2">{metrics.customersServed}</p>
              <div className="mt-4 text-sm text-gray-500">
                <div className="inline-flex items-center">
                  <span className="text-green-500">↑</span>
                  <span>12% from last month</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="text-center">
                <p className="text-sm font-medium">First-Time Fix Rate</p>
                <p className="text-xl font-bold mt-1">87%</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Return Rate</p>
                <p className="text-xl font-bold mt-1">3.2%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PerformanceMetrics;
