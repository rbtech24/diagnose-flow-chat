
import { useState, useEffect } from 'react';
import { 
  fetchFeatureRequests, 
  fetchFeatureRequestById, 
  fetchFeatureComments,
  createFeatureRequest,
  updateFeatureRequest,
  addFeatureComment,
  voteForFeature
} from '@/api/featureRequestsApi';
import { FeatureRequest, FeatureComment } from '@/types/feature-request';

export function useFeatureRequests(initialStatus?: string, companyId?: string) {
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadRequests = async (status?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFeatureRequests(status, companyId);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching feature requests'));
    } finally {
      setIsLoading(false);
    }
  };

  // Load requests on component mount
  useEffect(() => {
    loadRequests(initialStatus);
  }, [initialStatus, companyId]);

  const getRequestById = async (id: string): Promise<FeatureRequest> => {
    try {
      return await fetchFeatureRequestById(id);
    } catch (err) {
      throw err instanceof Error ? err : new Error(`Failed to fetch feature request ${id}`);
    }
  };

  const getRequestComments = async (requestId: string): Promise<FeatureComment[]> => {
    try {
      return await fetchFeatureComments(requestId);
    } catch (err) {
      throw err instanceof Error ? err : new Error(`Failed to fetch comments for feature request ${requestId}`);
    }
  };

  const createRequest = async (requestData: Partial<FeatureRequest>): Promise<FeatureRequest> => {
    try {
      const newRequest = await createFeatureRequest(requestData);
      // Reload requests to include the new one
      loadRequests(initialStatus);
      return newRequest;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create feature request');
    }
  };

  const updateRequest = async (requestId: string, updateData: Partial<FeatureRequest>): Promise<FeatureRequest> => {
    try {
      const updatedRequest = await updateFeatureRequest(requestId, updateData);
      // Update the request in the local state
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId ? { ...request, ...updateData } : request
        )
      );
      return updatedRequest;
    } catch (err) {
      throw err instanceof Error ? err : new Error(`Failed to update feature request ${requestId}`);
    }
  };

  const addComment = async (requestId: string, content: string): Promise<FeatureComment> => {
    try {
      return await addFeatureComment({
        feature_id: requestId,
        content
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add comment');
    }
  };

  const voteForRequest = async (requestId: string): Promise<boolean> => {
    try {
      const result = await voteForFeature(requestId);
      
      if (result) {
        // Update the local state to reflect the vote
        setRequests(prevRequests => 
          prevRequests.map(request => 
            request.id === requestId 
              ? { 
                  ...request, 
                  votes_count: request.votes_count + 1,
                  user_has_voted: true
                } 
              : request
          )
        );
      }
      
      return result;
    } catch (err) {
      throw err instanceof Error ? err : new Error(`Failed to vote for feature request ${requestId}`);
    }
  };

  return {
    requests,
    isLoading,
    error,
    loadRequests,
    getRequestById,
    getRequestComments,
    createRequest,
    updateRequest,
    addComment,
    voteForRequest
  };
}
