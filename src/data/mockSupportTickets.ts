
import { SupportTicket } from '@/types/support-enhanced';
import { User } from '@/types/user';

const mockUser: User = {
  id: 'user-1',
  name: 'John Smith',
  email: 'john@example.com',
  role: 'technician'
};

export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'ticket-1',
    title: 'Unable to access workflow editor',
    description: 'Getting an error when trying to open the workflow editor. The page loads but shows a blank screen.',
    status: 'open',
    priority: 'medium',
    user_id: 'user-1',
    created_by_user_id: 'user-1',
    company_id: 'company-1',
    user: mockUser,
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15')
  }
];

export async function getSupportTickets(): Promise<SupportTicket[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockSupportTickets;
}
