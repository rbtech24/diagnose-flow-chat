
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "company" | "tech";
  phone?: string;
  avatarUrl?: string;
  status: "active" | "inactive" | "pending" | "archived" | "deleted";
  companyId?: string; // Added companyId
  subscriptionStatus?: string;
  trialEndsAt?: Date;
  planId?: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface TechnicianInvite {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyId?: string; // Consistent naming convention
  createdAt: Date;
  expiresAt: Date;
  status: "pending" | "accepted" | "rejected" | "expired";
}
