
import { useAuth } from '@/context/AuthContext';

export function useUserRole() {
  const { userRole, isLoading } = useAuth();
  
  // Return both 'role' and 'userRole' to maintain backward compatibility
  return { 
    role: userRole, 
    userRole, 
    isLoading,
    // Add a hasRole function to check if user has specific role
    hasRole: (role: string | string[]) => {
      if (!userRole) return false;
      
      if (Array.isArray(role)) {
        return role.includes(userRole);
      }
      
      return userRole === role;
    }
  };
}
