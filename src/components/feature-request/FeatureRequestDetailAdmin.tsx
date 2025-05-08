
import React, { useState } from "react";
import { FeatureRequestDetail } from "./FeatureRequestDetail";
import { FeatureRequest, FeatureComment, FeatureRequestStatus } from "@/types/feature-request";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface FeatureRequestDetailAdminProps {
  featureRequest: FeatureRequest;
  comments: FeatureComment[];
  onAddComment: (featureId: string, content: string) => Promise<void>;
  onUpdateStatus?: (id: string, status: FeatureRequestStatus) => Promise<void>;
  onUpdatePriority?: (id: string, priority: string) => Promise<void>;
  isAdmin?: boolean;
}

export const FeatureRequestDetailAdmin: React.FC<FeatureRequestDetailAdminProps> = ({
  featureRequest,
  comments,
  onAddComment,
  onUpdateStatus,
  onUpdatePriority,
  isAdmin = false
}) => {
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [isPriorityUpdating, setIsPriorityUpdating] = useState(false);
  
  const handleStatusChange = async (status: string) => {
    if (onUpdateStatus) {
      setIsStatusUpdating(true);
      try {
        await onUpdateStatus(featureRequest.id, status as FeatureRequestStatus);
      } finally {
        setIsStatusUpdating(false);
      }
    }
  };
  
  const handlePriorityChange = async (priority: string) => {
    if (onUpdatePriority) {
      setIsPriorityUpdating(true);
      try {
        await onUpdatePriority(featureRequest.id, priority);
      } finally {
        setIsPriorityUpdating(false);
      }
    }
  };

  return (
    <div>
      <FeatureRequestDetail 
        featureRequest={featureRequest}
        comments={comments}
        onAddComment={onAddComment}
        onVote={() => {}} // No voting in admin view
      />
      
      {isAdmin && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Admin Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Status</h3>
                <div className="flex items-center gap-4">
                  <Select
                    value={featureRequest.status}
                    onValueChange={handleStatusChange}
                    disabled={isStatusUpdating}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  {isStatusUpdating && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Priority</h3>
                <div className="flex items-center gap-4">
                  <Select
                    value={featureRequest.priority}
                    onValueChange={handlePriorityChange}
                    disabled={isPriorityUpdating}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  {isPriorityUpdating && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" disabled={featureRequest.status === 'approved'}>
                  Approve
                </Button>
                <Button variant="outline" size="sm" disabled={featureRequest.status === 'in-progress'}>
                  Start Development
                </Button>
                <Button variant="outline" size="sm" disabled={featureRequest.status === 'completed'}>
                  Mark as Complete
                </Button>
                <Button variant="outline" size="sm" disabled={featureRequest.status === 'rejected'}>
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
