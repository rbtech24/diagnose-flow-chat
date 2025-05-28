
import { FeatureRequest } from '@/types/feature-request-enhanced';
import { User } from '@/types/user';

const mockUser: User = {
  id: 'user-1',
  name: 'John Smith',
  email: 'john@example.com',
  role: 'tech'
};

export const mockFeatureRequests: FeatureRequest[] = [
  {
    id: 'feature-1',
    title: 'Mobile App for Field Technicians',
    description: 'A dedicated mobile application that allows technicians to access diagnostic workflows, update repair status, and communicate with customers while in the field.',
    status: 'planned',
    priority: 'high',
    votes_count: 45,
    comments_count: 12,
    user_id: 'user-1',
    company_id: 'company-1',
    created_by_user: mockUser,
    user_has_voted: false,
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-01-15')
  }
];

export async function getFeatureRequests(): Promise<FeatureRequest[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockFeatureRequests;
}
