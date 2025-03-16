
import React from 'react';
import { MessageSquare, FileText, Workflow, Users, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { CommunityPost } from '@/types/community';
import { useIsMobile } from '@/hooks/use-mobile';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center p-4">
        <div className={`p-2 rounded-full ${color} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <h3 className="text-xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

export interface CommunityStatsProps {
  posts: CommunityPost[];
  showDocumentStats?: boolean;
}

export function CommunityStats({ posts, showDocumentStats = true }: CommunityStatsProps) {
  const isMobile = useIsMobile();
  const questionCount = posts.filter(post => post.type === 'question').length;
  const techSheetRequestCount = posts.filter(post => post.type === 'tech-sheet-request').length;
  const wireDiagramRequestCount = posts.filter(post => post.type === 'wire-diagram-request').length;
  const fulfilledRequestCount = posts.filter(post => 
    (post.type === 'tech-sheet-request' || post.type === 'wire-diagram-request') && 
    post.isFulfilled
  ).length;
  
  return (
    <Card className="bg-card shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-base font-medium mb-3">Post Statistics</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-3">
            <MessageSquare className="h-8 w-8 text-blue-500 mb-1" />
            <span className="text-2xl font-bold">{questionCount}</span>
            <span className="text-xs text-muted-foreground">Questions</span>
          </div>
          
          {showDocumentStats && (
            <>
              <div className="flex flex-col items-center justify-center bg-amber-50 rounded-lg p-3">
                <FileSpreadsheet className="h-8 w-8 text-amber-500 mb-1" />
                <span className="text-2xl font-bold">{techSheetRequestCount}</span>
                <span className="text-xs text-muted-foreground">Tech Sheet Requests</span>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-green-50 rounded-lg p-3">
                <Workflow className="h-8 w-8 text-green-500 mb-1" />
                <span className="text-2xl font-bold">{wireDiagramRequestCount}</span>
                <span className="text-xs text-muted-foreground">Wire Diagram Requests</span>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-emerald-50 rounded-lg p-3">
                <CheckCircle className="h-8 w-8 text-emerald-500 mb-1" />
                <span className="text-2xl font-bold">{fulfilledRequestCount}</span>
                <span className="text-xs text-muted-foreground">Fulfilled Requests</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
