
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Play, 
  RefreshCw,
  Shield,
  Database,
  Users,
  Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { checkProductionReadiness, ProductionIssue } from '@/utils/productionReadiness';
import { systemHealthChecker } from '@/utils/systemHealthChecker';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  category: 'auth' | 'database' | 'ui' | 'security' | 'performance';
}

export function ProductionReadinessChecker() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [issues, setIssues] = useState<ProductionIssue[]>([]);
  const { user, session } = useAuth();

  useEffect(() => {
    setIssues(checkProductionReadiness());
  }, []);

  const runTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // Authentication Tests
    results.push({
      name: 'User Authentication',
      status: user ? 'pass' : 'fail',
      message: user ? 'User is authenticated' : 'No user session found',
      category: 'auth'
    });

    results.push({
      name: 'Session Validity',
      status: session && session.expires_at ? 'pass' : 'fail',
      message: session?.expires_at ? 'Valid session with expiration' : 'Invalid or missing session',
      category: 'auth'
    });

    // Database Tests
    try {
      const { data, error } = await supabase.from('companies').select('id').limit(1);
      results.push({
        name: 'Database Connection',
        status: error ? 'fail' : 'pass',
        message: error ? `Database error: ${error.message}` : 'Database connection successful',
        category: 'database'
      });
    } catch (error) {
      results.push({
        name: 'Database Connection',
        status: 'fail',
        message: 'Failed to connect to database',
        category: 'database'
      });
    }

    // System Health Tests
    try {
      const healthCheck = await systemHealthChecker.performHealthCheck();
      results.push({
        name: 'System Health',
        status: healthCheck.overall === 'healthy' ? 'pass' : healthCheck.overall === 'degraded' ? 'warning' : 'fail',
        message: `System status: ${healthCheck.overall}`,
        category: 'performance'
      });
    } catch (error) {
      results.push({
        name: 'System Health',
        status: 'fail',
        message: 'Health check failed',
        category: 'performance'
      });
    }

    // Demo User Creation Test
    try {
      const { data: companies } = await supabase.from('companies').select('id').eq('name', 'Demo Company').single();
      results.push({
        name: 'Demo Data Setup',
        status: companies ? 'pass' : 'warning',
        message: companies ? 'Demo company exists' : 'Demo company not found',
        category: 'database'
      });
    } catch (error) {
      results.push({
        name: 'Demo Data Setup',
        status: 'warning',
        message: 'Could not verify demo data',
        category: 'database'
      });
    }

    // Security Tests
    results.push({
      name: 'HTTPS Protocol',
      status: window.location.protocol === 'https:' || window.location.hostname === 'localhost' ? 'pass' : 'fail',
      message: window.location.protocol === 'https:' ? 'Using HTTPS' : 'Not using HTTPS',
      category: 'security'
    });

    // UI Responsiveness Test
    results.push({
      name: 'Responsive Design',
      status: window.innerWidth >= 320 ? 'pass' : 'warning',
      message: `Screen width: ${window.innerWidth}px`,
      category: 'ui'
    });

    setTestResults(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pass: 'default',
      warning: 'secondary',
      fail: 'destructive',
      pending: 'outline'
    } as const;

    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const getCategoryIcon = (category: TestResult['category']) => {
    switch (category) {
      case 'auth':
        return <Users className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const passedTests = testResults.filter(t => t.status === 'pass').length;
  const totalTests = testResults.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Production Readiness Tests
          </CardTitle>
          <CardDescription>
            Run comprehensive tests to ensure your application is ready for production deployment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              {testResults.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {passedTests}/{totalTests} tests passed
                </p>
              )}
            </div>
            <Button onClick={runTests} disabled={isRunning}>
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Tests
                </>
              )}
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-3">
              {testResults.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(test.category)}
                    <div>
                      <p className="font-medium">{test.name}</p>
                      <p className="text-sm text-muted-foreground">{test.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    {getStatusBadge(test.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Production Issues Found
            </CardTitle>
            <CardDescription>
              Address these issues before deploying to production.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {issues.map((issue, index) => (
                <Alert key={index} variant={issue.severity === 'critical' ? 'destructive' : 'default'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">{issue.description}</p>
                      <p className="text-sm">Recommendation: {issue.recommendation}</p>
                      {issue.file && <p className="text-xs text-muted-foreground">File: {issue.file}</p>}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
