
import { useAuth } from '@/context/AuthContext';

export function useUserRole() {
  const { userRole, isLoading } = useAuth();
  
  return { userRole, isLoading };
}
