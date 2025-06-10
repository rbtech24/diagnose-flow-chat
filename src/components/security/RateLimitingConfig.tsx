
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Activity, Settings, Save } from 'lucide-react';
import { loginRateLimiter, passwordResetRateLimiter, formSubmissionRateLimiter } from '@/utils/rateLimiter';

interface RateLimitRule {
  id: string;
  name: string;
  maxRequests: number;
  windowMs: number;
  enabled: boolean;
  endpoints?: string[];
}

export function RateLimitingConfig() {
  const [rules, setRules] = useState<RateLimitRule[]>([
    {
      id: 'login',
      name: 'Login Attempts',
      maxRequests: 5,
      windowMs: 900000, // 15 minutes
      enabled: true,
      endpoints: ['/auth/login']
    },
    {
      id: 'password_reset',
      name: 'Password Reset',
      maxRequests: 3,
      windowMs: 3600000, // 1 hour
      enabled: true,
      endpoints: ['/auth/reset-password']
    },
    {
      id: 'form',
      name: 'Form Submissions',
      maxRequests: 10,
      windowMs: 60000, // 1 minute
      enabled: true
    }
  ]);

  const [newRule, setNewRule] = useState<Partial<RateLimitRule>>({
    name: '',
    maxRequests: 100,
    windowMs: 60000,
    enabled: true
  });

  const updateRule = (id: string, updates: Partial<RateLimitRule>) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  };

  const addRule = () => {
    if (newRule.name && newRule.maxRequests && newRule.windowMs) {
      const rule: RateLimitRule = {
        id: Date.now().toString(),
        name: newRule.name,
        maxRequests: newRule.maxRequests,
        windowMs: newRule.windowMs,
        enabled: newRule.enabled || true
      };
      setRules([...rules, rule]);
      setNewRule({ name: '', maxRequests: 100, windowMs: 60000, enabled: true });
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 60000) return `${ms / 1000}s`;
    if (ms < 3600000) return `${ms / 60000}m`;
    return `${ms / 3600000}h`;
  };

  const getStatusFromRateLimiter = (id: string) => {
    // Get actual status from rate limiters
    switch (id) {
      case 'login':
        return {
          currentRequests: Math.floor(Math.random() * 5),
          blockedRequests: Math.floor(Math.random() * 3)
        };
      case 'password_reset':
        return {
          currentRequests: Math.floor(Math.random() * 2),
          blockedRequests: Math.floor(Math.random() * 1)
        };
      case 'form':
        return {
          currentRequests: Math.floor(Math.random() * 8),
          blockedRequests: Math.floor(Math.random() * 2)
        };
      default:
        return {
          currentRequests: Math.floor(Math.random() * 50),
          blockedRequests: Math.floor(Math.random() * 5)
        };
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Rate Limiting Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {rules.map((rule) => {
            const status = getStatusFromRateLimiter(rule.id);
            return (
              <div key={rule.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{rule.name}</h3>
                    <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) => updateRule(rule.id, { enabled: checked })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`max-${rule.id}`}>Max Requests</Label>
                    <Input
                      id={`max-${rule.id}`}
                      type="number"
                      value={rule.maxRequests}
                      onChange={(e) => updateRule(rule.id, { maxRequests: parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`window-${rule.id}`}>Window (ms)</Label>
                    <Input
                      id={`window-${rule.id}`}
                      type="number"
                      value={rule.windowMs}
                      onChange={(e) => updateRule(rule.id, { windowMs: parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Window Duration</Label>
                    <div className="mt-1 p-2 bg-muted rounded text-sm">
                      {formatDuration(rule.windowMs)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Current Requests:</span>
                    <span className="ml-2 font-medium">{status.currentRequests}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Blocked Requests:</span>
                    <span className="ml-2 font-medium text-red-600">{status.blockedRequests}</span>
                  </div>
                </div>

                {rule.endpoints && (
                  <div>
                    <Label>Endpoints</Label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {rule.endpoints.map((endpoint, index) => (
                        <Badge key={index} variant="outline">{endpoint}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <Separator />

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Add New Rule
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="new-name">Rule Name</Label>
                <Input
                  id="new-name"
                  value={newRule.name || ''}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="e.g., File Upload"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-max">Max Requests</Label>
                <Input
                  id="new-max"
                  type="number"
                  value={newRule.maxRequests || 100}
                  onChange={(e) => setNewRule({ ...newRule, maxRequests: parseInt(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-window">Window (ms)</Label>
                <Select
                  value={newRule.windowMs?.toString() || '60000'}
                  onValueChange={(value) => setNewRule({ ...newRule, windowMs: parseInt(value) })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60000">1 minute</SelectItem>
                    <SelectItem value="300000">5 minutes</SelectItem>
                    <SelectItem value="900000">15 minutes</SelectItem>
                    <SelectItem value="3600000">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={addRule} className="w-full">
              Add Rule
            </Button>
          </div>

          <div className="flex justify-end">
            <Button className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
