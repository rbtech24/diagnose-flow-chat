
import { User } from './user';

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  user_id: string;
  created_by_user_id: string;
  company_id: string;
  user: User;
  created_at: Date;
  updated_at: Date;
}
