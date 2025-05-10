
export type Company = {
  id: string;
  name: string;
  status: 'trial' | 'active' | 'expired' | 'inactive';
  planName: string;
  trial_end_date?: Date;
  trialEndDate?: Date; // For compatibility with older code
  createdAt: Date;
  updatedAt: Date;
}
