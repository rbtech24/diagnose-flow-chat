
import { Card, CardContent } from "@/components/ui/card";

interface CalendarStatsProps {
  todayJobs: number;
  weekJobs: number;
  overdueJobs: number;
  onTimeRate: number;
}

export function CalendarStats({ todayJobs, weekJobs, overdueJobs, onTimeRate }: CalendarStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{todayJobs}</div>
            <p className="text-sm text-gray-600">Today's Jobs</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{weekJobs}</div>
            <p className="text-sm text-gray-600">This Week</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{overdueJobs}</div>
            <p className="text-sm text-gray-600">Overdue</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{onTimeRate}%</div>
            <p className="text-sm text-gray-600">On-Time Rate</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
