
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserManagementStore } from '@/store/userManagementStore';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/user';

export function DevAuthBypass() {
  const { setCurrentUser } = useUserManagementStore();
  const navigate = useNavigate();

  const createDevUser = (role: 'admin' | 'company' | 'tech', name: string): User => ({
    id: `dev-${role}-${Date.now()}`,
    name,
    email: `dev-${role}@example.com`,
    role,
    companyId: role === 'tech' ? 'company-1' : undefined,
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/300',
    activeJobs: role === 'tech' ? 3 : 0
  });

  const loginAsDev = (role: 'admin' | 'company' | 'tech') => {
    const names = {
      admin: 'Dev Admin',
      company: 'Dev Company Manager',
      tech: 'Dev Technician'
    };
    
    const devUser = createDevUser(role, names[role]);
    setCurrentUser(devUser);
    localStorage.setItem('currentUser', JSON.stringify(devUser));
    navigate(`/${role}`);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Development Authentication</CardTitle>
        <CardDescription>
          Quick login for development purposes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={() => loginAsDev('tech')} 
          className="w-full"
          variant="default"
        >
          Login as Tech User
        </Button>
        <Button 
          onClick={() => loginAsDev('company')} 
          className="w-full"
          variant="outline"
        >
          Login as Company User
        </Button>
        <Button 
          onClick={() => loginAsDev('admin')} 
          className="w-full"
          variant="outline"
        >
          Login as Admin User
        </Button>
      </CardContent>
    </Card>
  );
}
