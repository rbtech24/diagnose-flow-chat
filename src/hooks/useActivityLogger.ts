
import { useCallback } from 'react';
import { logActivity } from '@/api/activityLogsApi';
import { toast } from 'sonner';
import { useUserManagementStore } from '@/store/userManagementStore';

type ActivityType = 
  | 'user' 
  | 'company' 
  | 'workflow'
  | 'system'
  | 'support'
  | 'billing'
  | 'error'
  | 'login'
  | 'logout'
  | 'company_created'
  | 'company_updated'
  | 'user_created'
  | 'user_updated'
  | 'workflow_created'
  | 'workflow_updated'
  | 'system_message';

export function useActivityLogger() {
  const { currentUser } = useUserManagementStore();

  const logEvent = useCallback(async (
    activityType: ActivityType,
    description: string,
    metadata?: Record<string, any>
  ) => {
    try {
      await logActivity({
        activity_type: activityType,
        description,
        metadata: {
          ...metadata,
          user: currentUser ? {
            id: currentUser.id,
            email: currentUser.email,
            role: currentUser.role
          } : undefined
        }
      });
      
      return true;
    } catch (error) {
      console.error('Failed to log activity:', error);
      return false;
    }
  }, [currentUser]);

  return { logEvent };
}
