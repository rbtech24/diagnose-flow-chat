
import { useAuth } from '@/context/auth';

export function useUserRole() {
  const { userRole, isLoading } = useAuth();
  
  return { 
    role: userRole, 
    userRole, 
    isLoading,
    // Improved hasRole function with better type checking
    hasRole: (targetRole: string | string[]) => {
      if (!userRole) return false;
      
      // Special case: admin role has access to everything except specifically excluded routes
      if (userRole === 'admin') return true;
      
      if (Array.isArray(targetRole)) {
        return targetRole.includes(userRole);
      }
      
      return userRole === targetRole;
    }
  };
}
