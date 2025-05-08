
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "company" | "tech";
  phone?: string;
  avatarUrl?: string;
  status: "active" | "inactive" | "pending" | "archived" | "deleted";
  companyId?: string;
  companyName?: string;
  subscriptionStatus?: string;
  trialEndsAt?: Date;
  isMainAdmin?: boolean;
  planId?: string;
  onboardingCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface TechnicianInvite {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyId: string;
  createdAt: Date;
  expiresAt: Date;
  status: "pending" | "accepted" | "rejected" | "expired" | "cancelled";
  token?: string;
}

export interface TechnicianProfile {
  id?: string;
  userId: string;
  biography?: string;
  skills?: string[];
  certifications?: Certification[];
  yearsOfExperience?: number;
  serviceArea?: ServiceArea;
  availability?: Availability;
  specialties?: string[];
  rating?: number;
  completedJobs?: number;
  profilePicture?: string;
}

export interface Certification {
  name: string;
  issuedBy: string;
  issueDate: string;
  expiryDate?: string;
  verificationUrl?: string;
}

export interface ServiceArea {
  radius: number;
  zipCodes?: string[];
  city?: string;
  state?: string;
}

export interface Availability {
  monday?: DayAvailability;
  tuesday?: DayAvailability;
  wednesday?: DayAvailability;
  thursday?: DayAvailability;
  friday?: DayAvailability;
  saturday?: DayAvailability;
  sunday?: DayAvailability;
}

export interface DayAvailability {
  available: boolean;
  hours?: string[]; // Format: "09:00-17:00"
}
