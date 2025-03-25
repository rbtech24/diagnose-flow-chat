
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChartIcon } from 'lucide-react';

interface UsageData {
  today: number;
  weekly: number;
  monthly: number;
  allData: Record<string, { count: number }>;
}

export function WorkflowUsageStats() {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsageStats = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch data from an API
        // For now, let's create empty placeholder data
        const emptyData: UsageData = {
          today: 0,
          weekly: 0,
          monthly: 0,
          allData: {}
        };
        
        // Add some dates for the empty charts
        const today = new Date();
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const dateString = date.toISOString().split('T')[0];
          emptyData.allData[dateString] = { count: 0 };
        }
        
        setUsageData(emptyData);
      } catch (error) {
        console.error("Error fetching workflow usage stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsageStats();
  }, []);

  if (isLoading || !usageData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading usage statistics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for the charts
  const dailyData = Object.entries(usageData.allData).map(([date, data]) => ({
    date,
    count: data.count
  })).sort((a, b) => a.date.localeCompare(b.date));

  // Get last 7 days data
  const last7Days = [...dailyData].slice(-7);
  
  // Get last 30 days data
  const last30Days = [...dailyData].slice(-30);

  // Transform data for weekly chart (sum by week)
  const weeklyData = dailyData.reduce((weeks: any[], entry: any) => {
    const date = new Date(entry.date);
    const weekNum = Math.floor(date.getDate() / 7) + 1;
    const weekLabel = `Week ${weekNum}`;
    const month = date.toLocaleString('default', { month: 'short' });
    const weekKey = `${month} ${weekLabel}`;
    
    const existingWeek = weeks.find(w => w.week === weekKey);
    if (existingWeek) {
      existingWeek.count += entry.count;
    } else {
      weeks.push({ week: weekKey, count: entry.count });
    }
    
    return weeks;
  }, []);

  // Check if we have any non-zero data
  const hasData = Object.values(usageData.allData).some(item => item.count > 0);

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center">
            <BarChartIcon className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-muted-foreground text-center">No usage data available yet</p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Statistics will appear here once workflows are used
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Usage Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="mb-4">
            <TabsTrigger value="daily">Daily (Last 7 Days)</TabsTrigger>
            <TabsTrigger value="monthly">Monthly (Last 30 Days)</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Workflow Usage" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Daily Usage Summary</p>
              <ul className="mt-2">
                <li>Total workflows used today: {usageData.today || 0}</li>
                <li>Weekly total: {usageData.weekly || 0}</li>
                <li>Monthly total: {usageData.monthly || 0}</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last30Days}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Workflow Usage" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="weekly">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Weekly Workflow Usage" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
