
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FileText, Users } from 'lucide-react';

export interface CommunityStatsProps {
  questionCount: number;
  techSheetRequestCount: number;
  wireDiagramRequestCount: number;
  activeMemberCount: number;
}

export function CommunityStats({ 
  questionCount = 345, 
  techSheetRequestCount = 127, 
  wireDiagramRequestCount = 198, 
  activeMemberCount = 523 
}: Partial<CommunityStatsProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium">Questions</span>
            </div>
            <span className="text-sm font-bold">{questionCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-sm font-medium">Tech Sheet Requests</span>
            </div>
            <span className="text-sm font-bold">{techSheetRequestCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium">Wire Diagram Requests</span>
            </div>
            <span className="text-sm font-bold">{wireDiagramRequestCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-sm font-medium">Active Members</span>
            </div>
            <span className="text-sm font-bold">{activeMemberCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
