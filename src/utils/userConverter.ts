
import { User as FeatureRequestUser } from '@/types/feature-request';
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
    status: user.status
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
    status: user.status || 'active'
  };
}
