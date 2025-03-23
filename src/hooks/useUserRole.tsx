
import { useAuth } from '@/context/AuthContext';

export function useUserRole() {
  const { userRole, isLoading } = useAuth();
  
  // Return both 'role' and 'userRole' to maintain backward compatibility
  return { 
    role: userRole, 
    userRole, // Keep userRole for backward compatibility
    isLoading 
  };
}
