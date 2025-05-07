
import { User } from "@/types/user";
import { Session } from '@supabase/supabase-js';

export type AuthContextType = {
  user: User | null;
  userRole: 'admin' | 'company' | 'tech' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, role: 'admin' | 'company' | 'tech', userData?: Record<string, any>) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
};
