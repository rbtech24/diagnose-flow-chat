
import { toast } from 'sonner';

interface DemoUser {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'company' | 'tech';
  name: string;
  companyId: string;
}

const DEMO_USERS: DemoUser[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'admin@repairautopilot.com',
    password: 'RepairAuto2024!',
    role: 'admin',
    name: 'System Admin',
    companyId: '11111111-1111-1111-1111-111111111111'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'company@repairautopilot.com',
    password: 'RepairAuto2024!',
    role: 'company',
    name: 'Company Manager',
    companyId: '22222222-2222-2222-2222-222222222222'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'tech@repairautopilot.com',
    password: 'RepairAuto2024!',
    role: 'tech',
    name: 'Demo Technician',
    companyId: '22222222-2222-2222-2222-222222222222'
  }
];

export class DemoAuthService {
  static authenticateDemo(email: string, password: string): DemoUser | null {
    const user = DEMO_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (user) {
      console.log('Demo authentication successful for:', email);
      // Store demo session
      localStorage.setItem('demo_session', JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          companyId: user.companyId,
          status: 'active',
          activeJobs: 0
        },
        expires: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
      }));
      return user;
    }
    
    return null;
  }

  static getDemoSession() {
    try {
      const session = localStorage.getItem('demo_session');
      if (!session) return null;
      
      const parsed = JSON.parse(session);
      if (parsed.expires < Date.now()) {
        localStorage.removeItem('demo_session');
        return null;
      }
      
      return parsed.user;
    } catch (error) {
      console.error('Error reading demo session:', error);
      return null;
    }
  }

  static clearDemoSession() {
    localStorage.removeItem('demo_session');
  }

  static isDemoEmail(email: string): boolean {
    return DEMO_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
  }
}
