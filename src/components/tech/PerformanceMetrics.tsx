
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Activity, Star, Clock, Users, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MetricsProps {
  completedRepairs: number;
  averageTime: string;
  customerRating: number;
  efficiencyScore: number;
  customersServed: number;
}

export function PerformanceMetrics({
  completedRepairs = 248,
  averageTime = "1h 42m",
  customerRating = 4.8,
  efficiencyScore = 92,
  customersServed = 185
}: Partial<MetricsProps>) {
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
            <div className="text-3xl font-bold text-blue-600">{completedRepairs}</div>
            <p className="text-sm text-muted-foreground">Completed Repairs</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-blue-600">{customerRating}</div>
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
              <span className="text-sm font-semibold">{averageTime}</span>
            </div>
            <Progress value={70} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Efficiency Score</span>
              </div>
              <span className="text-sm font-semibold">{efficiencyScore}%</span>
            </div>
            <Progress value={efficiencyScore} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Customers Served</span>
              </div>
              <span className="text-sm font-semibold">{customersServed}</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
