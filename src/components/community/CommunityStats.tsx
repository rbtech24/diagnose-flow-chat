
import React from 'react';
import { MessageSquare, FileText, Workflow, Users } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className={`p-2 rounded-full ${color} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

interface CommunityStatsProps {
  questionCount: number;
  techSheetRequestCount: number;
  wireDiagramRequestCount: number;
  activeMemberCount: number;
}

export function CommunityStats({
  questionCount,
  techSheetRequestCount,
  wireDiagramRequestCount,
  activeMemberCount
}: CommunityStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={<MessageSquare className="h-5 w-5 text-blue-600" />}
        label="Questions"
        value={questionCount}
        color="bg-blue-100"
      />
      <StatCard
        icon={<FileText className="h-5 w-5 text-amber-600" />}
        label="Tech Sheet Requests"
        value={techSheetRequestCount}
        color="bg-amber-100"
      />
      <StatCard
        icon={<Workflow className="h-5 w-5 text-green-600" />}
        label="Wire Diagram Requests"
        value={wireDiagramRequestCount}
        color="bg-green-100"
      />
      <StatCard
        icon={<Users className="h-5 w-5 text-purple-600" />}
        label="Active Members"
        value={activeMemberCount}
        color="bg-purple-100"
      />
    </div>
  );
}
