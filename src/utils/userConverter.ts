
import { FeatureRequestUser } from '@/types/feature-request';
import { User as AppUser } from '@/types/user';

/**
 * Converts a general App User to a Feature Request User type
 */
export function convertToFeatureRequestUser(user: AppUser): FeatureRequestUser {
  return {
    id: user.id,
    name: user.name || '',
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl || '',
    status: (user.status === 'archived' || user.status === 'deleted') ? 
      'inactive' : ((user.status || 'active') as 'active' | 'inactive' | 'pending')
  };
}

/**
 * Ensures any user object has the required fields for FeatureRequestUser
 */
export function ensureFeatureRequestUser(user: any): FeatureRequestUser {
  return {
    id: user.id,
    name: user.name || '',
    email: user.email,
    role: user.role || 'company',
    avatarUrl: user.avatarUrl || '',
    status: (user.status === 'archived' || user.status === 'deleted') ? 
      'inactive' : ((user.status || 'active') as 'active' | 'inactive' | 'pending')
  };
}

/**
 * Helper function to ensure a user object has avatarUrl property
 * This is useful for fixing type compatibility issues
 */
export function ensureUserWithAvatar(user: any): any {
  if (!user) return null;
  
  return {
    ...user,
    avatarUrl: user.avatarUrl || '',
  };
}
