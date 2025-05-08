
import React from "react";
import { FeatureRequestDetail } from "./FeatureRequestDetail";
import { FeatureRequest, FeatureComment, FeatureRequestStatus } from "@/types/feature-request";

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
  return (
    <div>
      <FeatureRequestDetail 
        featureRequest={featureRequest}
        comments={comments}
        onAddComment={onAddComment}
        onVote={() => {}} // No voting in admin view
      />
      
      {isAdmin && (
        <div className="mt-6 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-4">Admin Controls</h3>
          
          {/* Status update controls would go here */}
          <div>
            {/* Management tools would be implemented here */}
          </div>
        </div>
      )}
    </div>
  );
};
