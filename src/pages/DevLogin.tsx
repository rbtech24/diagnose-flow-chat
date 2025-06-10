
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export default function DevLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const demoCredentials = [
    { role: 'Admin', email: 'admin@repairautopilot.com', password: 'RepairAdmin123!' },
    { role: 'Company', email: 'company@repairautopilot.com', password: 'CompanyAdmin123!' },
    { role: 'Tech', email: 'tech@repairautopilot.com', password: 'TechUser123!' }
  ];

  // Handle navigation after successful login
  useEffect(() => {
    if (user) {
      console.log('User logged in, redirecting to:', `/${user.role}`);
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
        });
        // Navigation will be handled by useEffect when user state updates
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
        });
        // Navigation will be handled by useEffect when user state updates
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Development Login</h1>
          <p className="text-gray-600 mt-2">Access different user dashboards for testing</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Manual Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Login</CardTitle>
              <CardDescription>Enter credentials manually</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Login Options */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Login</CardTitle>
              <CardDescription>Use demo credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoCredentials.map((cred) => (
                <Button
                  key={cred.role}
                  onClick={() => quickLogin(cred.email, cred.password)}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={isLoading}
                >
                  <div className="text-left">
                    <div className="font-medium">{cred.role} User</div>
                    <div className="text-xs text-gray-500">{cred.email}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
