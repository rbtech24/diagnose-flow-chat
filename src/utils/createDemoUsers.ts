
// This file has been disabled - demo user creation is no longer available
// Please use the existing authentication system with real user accounts

export interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'company' | 'tech';
}

export const demoUsers: DemoUser[] = [
  {
    email: 'admin@repairautopilot.com',
    password: 'RepairAdmin123!',
    name: 'Super Admin',
    role: 'admin'
  },
  {
    email: 'company@repairautopilot.com',
    password: 'CompanyAdmin123!',
    name: 'Company Admin',
    role: 'company'
  },
  {
    email: 'tech@repairautopilot.com',
    password: 'TechUser123!',
    name: 'Tech User',
    role: 'tech'
  }
];

export async function createDemoUsers(): Promise<{ success: boolean; message: string }> {
  return {
    success: false,
    message: 'Demo user creation has been disabled. Please use existing accounts or create new ones through the proper signup flow.'
  };
}

export function getDemoUserCredentials(): string {
  return demoUsers.map(user => 
    `${user.role.toUpperCase()}: ${user.email} / ${user.password}`
  ).join('\n');
}
