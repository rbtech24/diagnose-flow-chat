
import { TechnicianProfile } from '@/types/technician-enhanced';

export const mockTechnicians: TechnicianProfile[] = [
  {
    id: 'tech-1',
    company_id: 'company-1',
    email: 'john@example.com',
    phone: '+1-555-0123',
    role: 'technician',
    status: 'active',
    is_independent: false,
    available_for_hire: true,
    hourly_rate: 75,
    last_sign_in_at: '2024-01-15T10:30:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    full_name: 'John Smith',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  }
];

export async function getTechnicians(): Promise<TechnicianProfile[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockTechnicians;
}
