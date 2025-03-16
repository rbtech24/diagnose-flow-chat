
import React from 'react';
import { MessageSquare, FileText, Workflow, Users, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { CommunityPost } from '@/types/community';

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

export interface CommunityStatsProps {
  posts: CommunityPost[];
  showDocumentStats?: boolean;
}

export function CommunityStats({ posts, showDocumentStats = true }: CommunityStatsProps) {
  const questionCount = posts.filter(post => post.type === 'question').length;
  const techSheetRequestCount = posts.filter(post => post.type === 'tech-sheet-request').length;
  const wireDiagramRequestCount = posts.filter(post => post.type === 'wire-diagram-request').length;
  const fulfilledRequestCount = posts.filter(post => 
    (post.type === 'tech-sheet-request' || post.type === 'wire-diagram-request') && 
    post.isFulfilled
  ).length;
  const activeMemberCount = new Set(posts.map(post => post.authorId)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={<MessageSquare className="h-5 w-5 text-blue-600" />}
        label="Questions"
        value={questionCount}
        color="bg-blue-100"
      />
      {showDocumentStats ? (
        <>
          <StatCard
            icon={<FileSpreadsheet className="h-5 w-5 text-amber-600" />}
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
            icon={<CheckCircle className="h-5 w-5 text-emerald-600" />}
            label="Fulfilled Requests"
            value={fulfilledRequestCount}
            color="bg-emerald-100"
          />
        </>
      ) : (
        <StatCard
          icon={<Users className="h-5 w-5 text-purple-600" />}
          label="Active Members"
          value={activeMemberCount}
          color="bg-purple-100"
        />
      )}
    </div>
  );
}
