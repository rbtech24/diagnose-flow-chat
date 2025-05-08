
import { useContext } from 'react';
import AuthContext from './AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return {
    ...context,
    // Mock functions for authentication
    login: async () => true,
    logout: async () => true,
    resetPassword: async () => true,
    updateProfile: async () => true,
    resendVerificationEmail: async () => true
  };
};
