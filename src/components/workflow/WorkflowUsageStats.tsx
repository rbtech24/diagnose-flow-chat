
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';

export function WorkflowUsageStats() {
  const { workflowUsageStats } = useAuth();
  const [usageData, setUsageData] = useState<any>(null);

  useEffect(() => {
    setUsageData(workflowUsageStats());
  }, [workflowUsageStats]);

  if (!usageData) {
    return <div>Loading usage statistics...</div>;
  }

  // Prepare data for the charts
  const dailyData = Object.entries(usageData.allData).map(([date, data]: [string, any]) => ({
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
                <li>Total workflows used today: {usageData.today}</li>
                <li>Weekly total: {usageData.weekly}</li>
                <li>Monthly total: {usageData.monthly}</li>
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
