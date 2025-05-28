
import { User } from './user';

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: 'submitted' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  votes_count: number;
  comments_count: number;
  user_id: string;
  company_id: string;
  created_by_user: User;
  user_has_voted: boolean;
  created_at: Date;
  updated_at: Date;
}
