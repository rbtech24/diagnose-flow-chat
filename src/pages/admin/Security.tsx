
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SecurityMonitor } from '@/components/security/SecurityMonitor';
import { RateLimitingConfig } from '@/components/security/RateLimitingConfig';
import { Shield, Activity, Settings } from 'lucide-react';

export default function Security() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 mr-3 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Security Management</h1>
          <p className="text-muted-foreground">Monitor and configure security settings</p>
        </div>
      </div>

      <Tabs defaultValue="monitor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Security Monitor
          </TabsTrigger>
          <TabsTrigger value="rate-limiting" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Rate Limiting
          </TabsTrigger>
          <TabsTrigger value="access-control" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Access Control
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitor">
          <SecurityMonitor />
        </TabsContent>

        <TabsContent value="rate-limiting">
          <RateLimitingConfig />
        </TabsContent>

        <TabsContent value="access-control">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configure role-based permissions and access controls for different user types.
              </p>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Access control configuration will be available in the next update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
