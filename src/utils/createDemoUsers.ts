
import { supabase } from '@/integrations/supabase/client';

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
  try {
    // First, ensure we have a demo company
    let { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('name', 'Demo Company')
      .single();

    if (companyError || !company) {
      const { data: newCompany, error: createCompanyError } = await supabase
        .from('companies')
        .insert({
          name: 'Demo Company',
          subscription_tier: 'enterprise',
          trial_status: 'active'
        })
        .select('id')
        .single();

      if (createCompanyError) {
        console.error('Error creating demo company:', createCompanyError);
        return { success: false, message: 'Failed to create demo company' };
      }
      company = newCompany;
    }

    // Create each demo user
    const results = [];
    for (const demoUser of demoUsers) {
      try {
        // Try to sign up the user
        const { data, error } = await supabase.auth.signUp({
          email: demoUser.email,
          password: demoUser.password,
          options: {
            data: {
              name: demoUser.name,
              role: demoUser.role,
              company_id: company.id
            }
          }
        });

        if (error && !error.message.includes('already registered')) {
          console.error(`Error creating user ${demoUser.email}:`, error);
          results.push({ email: demoUser.email, success: false, error: error.message });
          continue;
        }

        // If user was created or already exists, ensure technician record exists
        if (data.user) {
          await supabase
            .from('technicians')
            .upsert({
              id: data.user.id,
              email: demoUser.email,
              role: demoUser.role,
              company_id: company.id,
              status: 'active'
            });
        }

        results.push({ email: demoUser.email, success: true });
      } catch (err) {
        console.error(`Unexpected error creating user ${demoUser.email}:`, err);
        results.push({ email: demoUser.email, success: false, error: 'Unexpected error' });
      }
    }

    const successCount = results.filter(r => r.success).length;
    return {
      success: successCount > 0,
      message: `Created ${successCount} of ${demoUsers.length} demo users successfully.`
    };

  } catch (error) {
    console.error('Error in createDemoUsers:', error);
    return { success: false, message: 'Failed to create demo users' };
  }
}

export function getDemoUserCredentials(): string {
  return demoUsers.map(user => 
    `${user.role.toUpperCase()}: ${user.email} / ${user.password}`
  ).join('\n');
}
