
import { User } from "@/types/user";

// This file should be connected to real data from the database
// Currently empty - needs proper implementation once user management is set up
export const mockTechnicians: User[] = [];

// TODO: Replace with real data fetching from Supabase users/technicians table
// This should fetch from the database based on company_id and role='tech'
export const getTechnicians = async (companyId?: string): Promise<User[]> => {
  // Implementation needed: fetch from Supabase
  console.warn('getTechnicians: Using mock data - implement real database fetching');
  return mockTechnicians;
};
