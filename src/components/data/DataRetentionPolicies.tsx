
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Archive, Clock, Database, Save } from 'lucide-react';

interface RetentionPolicy {
  id: string;
  name: string;
  table: string;
  retentionPeriod: number;
  retentionUnit: 'days' | 'months' | 'years';
  action: 'delete' | 'archive';
  enabled: boolean;
  lastRun?: Date;
  recordsAffected?: number;
}

export function DataRetentionPolicies() {
  const [policies, setPolicies] = useState<RetentionPolicy[]>([
    {
      id: '1',
      name: 'Old Log Cleanup',
      table: 'user_activity_logs',
      retentionPeriod: 90,
      retentionUnit: 'days',
      action: 'delete',
      enabled: true,
      lastRun: new Date(Date.now() - 86400000),
      recordsAffected: 15420
    },
    {
      id: '2',
      name: 'Completed Repairs Archive',
      table: 'repairs',
      retentionPeriod: 2,
      retentionUnit: 'years',
      action: 'archive',
      enabled: true,
      lastRun: new Date(Date.now() - 604800000),
      recordsAffected: 1250
    },
    {
      id: '3',
      name: 'Email Logs Cleanup',
      table: 'email_logs',
      retentionPeriod: 6,
      retentionUnit: 'months',
      action: 'delete',
      enabled: false
    }
  ]);

  const [newPolicy, setNewPolicy] = useState<Partial<RetentionPolicy>>({
    name: '',
    table: '',
    retentionPeriod: 30,
    retentionUnit: 'days',
    action: 'delete',
    enabled: true
  });

  const tables = [
    'user_activity_logs',
    'email_logs',
    'api_usage_logs',
    'notifications',
    'file_uploads',
    'repairs',
    'support_tickets',
    'analytics_metrics'
  ];

  const updatePolicy = (id: string, updates: Partial<RetentionPolicy>) => {
    setPolicies(policies.map(policy => 
      policy.id === id ? { ...policy, ...updates } : policy
    ));
  };

  const addPolicy = () => {
    if (newPolicy.name && newPolicy.table && newPolicy.retentionPeriod) {
      const policy: RetentionPolicy = {
        id: Date.now().toString(),
        name: newPolicy.name,
        table: newPolicy.table,
        retentionPeriod: newPolicy.retentionPeriod,
        retentionUnit: newPolicy.retentionUnit || 'days',
        action: newPolicy.action || 'delete',
        enabled: newPolicy.enabled || true
      };
      setPolicies([...policies, policy]);
      setNewPolicy({
        name: '',
        table: '',
        retentionPeriod: 30,
        retentionUnit: 'days',
        action: 'delete',
        enabled: true
      });
    }
  };

  const runPolicy = (id: string) => {
    // Simulate running the policy
    const policy = policies.find(p => p.id === id);
    if (policy) {
      const recordsAffected = Math.floor(Math.random() * 1000) + 100;
      updatePolicy(id, {
        lastRun: new Date(),
        recordsAffected
      });
    }
  };

  const deletePolicy = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
  };

  const getActionIcon = (action: RetentionPolicy['action']) => {
    return action === 'delete' ? (
      <Trash2 className="h-4 w-4 text-red-500" />
    ) : (
      <Archive className="h-4 w-4 text-blue-500" />
    );
  };

  const formatRetention = (period: number, unit: string) => {
    return `${period} ${unit}${period !== 1 ? '' : unit.slice(0, -1)}`;
  };

  const estimateDataSize = (policy: RetentionPolicy) => {
    // Mock estimation based on table type
    const estimates: Record<string, number> = {
      'user_activity_logs': policy.recordsAffected ? policy.recordsAffected * 0.5 : 0, // KB
      'email_logs': policy.recordsAffected ? policy.recordsAffected * 2 : 0,
      'repairs': policy.recordsAffected ? policy.recordsAffected * 10 : 0,
      'file_uploads': policy.recordsAffected ? policy.recordsAffected * 1024 : 0 // Much larger
    };
    
    const sizeKB = estimates[policy.table] || 0;
    if (sizeKB > 1024) {
      return `${(sizeKB / 1024).toFixed(1)} MB`;
    }
    return `${sizeKB.toFixed(0)} KB`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Retention Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {policies.map((policy) => (
            <div key={policy.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">{policy.name}</h3>
                  <Badge variant={policy.enabled ? 'default' : 'secondary'}>
                    {policy.enabled ? 'Active' : 'Disabled'}
                  </Badge>
                  {getActionIcon(policy.action)}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={policy.enabled}
                    onCheckedChange={(checked) => updatePolicy(policy.id, { enabled: checked })}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runPolicy(policy.id)}
                    disabled={!policy.enabled}
                  >
                    Run Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deletePolicy(policy.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label>Table</Label>
                  <div className="mt-1 p-2 bg-muted rounded font-mono text-xs">
                    {policy.table}
                  </div>
                </div>
                <div>
                  <Label>Retention Period</Label>
                  <div className="mt-1 p-2 bg-muted rounded">
                    {formatRetention(policy.retentionPeriod, policy.retentionUnit)}
                  </div>
                </div>
                <div>
                  <Label>Action</Label>
                  <div className="mt-1 p-2 bg-muted rounded capitalize">
                    {policy.action}
                  </div>
                </div>
                <div>
                  <Label>Next Run</Label>
                  <div className="mt-1 p-2 bg-muted rounded text-xs">
                    {policy.enabled ? 'Tomorrow 2:00 AM' : 'Disabled'}
                  </div>
                </div>
              </div>

              {policy.lastRun && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>Last run: {policy.lastRun.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Records affected: {policy.recordsAffected?.toLocaleString()}</span>
                    <span>Data freed: {estimateDataSize(policy)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Separator />

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">Add New Policy</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="policy-name">Policy Name</Label>
                <Input
                  id="policy-name"
                  value={newPolicy.name || ''}
                  onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                  placeholder="e.g., Old Notifications Cleanup"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="policy-table">Table</Label>
                <Select
                  value={newPolicy.table || ''}
                  onValueChange={(value) => setNewPolicy({ ...newPolicy, table: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table} value={table}>{table}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="policy-period">Retention Period</Label>
                <Input
                  id="policy-period"
                  type="number"
                  value={newPolicy.retentionPeriod || 30}
                  onChange={(e) => setNewPolicy({ ...newPolicy, retentionPeriod: parseInt(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="policy-unit">Unit</Label>
                <Select
                  value={newPolicy.retentionUnit || 'days'}
                  onValueChange={(value: 'days' | 'months' | 'years') => 
                    setNewPolicy({ ...newPolicy, retentionUnit: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="policy-action">Action</Label>
                <Select
                  value={newPolicy.action || 'delete'}
                  onValueChange={(value: 'delete' | 'archive') => 
                    setNewPolicy({ ...newPolicy, action: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="archive">Archive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={addPolicy} className="w-full">
              Add Policy
            </Button>
          </div>

          <div className="flex justify-end">
            <Button className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save All Policies
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
