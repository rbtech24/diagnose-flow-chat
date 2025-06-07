
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Database, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  Play,
  Pause
} from 'lucide-react';

interface BackupJob {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'running' | 'failed' | 'scheduled';
  size: string;
  duration: string;
  createdAt: Date;
  nextRun?: Date;
}

interface BackupStrategy {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  retention: number; // days
  enabled: boolean;
  includeFiles: boolean;
  compression: boolean;
}

export function BackupManager() {
  const [backups, setBackups] = useState<BackupJob[]>([]);
  const [strategies, setStrategies] = useState<BackupStrategy[]>([]);
  const [currentBackup, setCurrentBackup] = useState<{ progress: number; status: string } | null>(null);

  useEffect(() => {
    // Mock data
    setBackups([
      {
        id: '1',
        name: 'Daily Database Backup',
        type: 'full',
        status: 'completed',
        size: '2.3 GB',
        duration: '15m 23s',
        createdAt: new Date(Date.now() - 86400000),
        nextRun: new Date(Date.now() + 3600000)
      },
      {
        id: '2',
        name: 'Weekly Full Backup',
        type: 'full',
        status: 'completed',
        size: '8.7 GB',
        duration: '1h 45m',
        createdAt: new Date(Date.now() - 604800000),
        nextRun: new Date(Date.now() + 259200000)
      },
      {
        id: '3',
        name: 'Incremental Backup',
        type: 'incremental',
        status: 'failed',
        size: '345 MB',
        duration: '2m 15s',
        createdAt: new Date(Date.now() - 7200000)
      }
    ]);

    setStrategies([
      {
        id: '1',
        name: 'Production Database',
        frequency: 'daily',
        retention: 30,
        enabled: true,
        includeFiles: false,
        compression: true
      },
      {
        id: '2',
        name: 'Complete System',
        frequency: 'weekly',
        retention: 90,
        enabled: true,
        includeFiles: true,
        compression: true
      }
    ]);
  }, []);

  const getStatusColor = (status: BackupJob['status']) => {
    switch (status) {
      case 'completed': return 'default';
      case 'running': return 'outline';
      case 'failed': return 'destructive';
      case 'scheduled': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: BackupJob['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'running': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const startManualBackup = () => {
    setCurrentBackup({ progress: 0, status: 'Initializing backup...' });
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setCurrentBackup(prev => {
        if (!prev || prev.progress >= 100) {
          clearInterval(interval);
          return null;
        }
        return {
          progress: prev.progress + 10,
          status: prev.progress < 50 ? 'Backing up database...' : 'Compressing files...'
        };
      });
    }, 1000);
  };

  const updateStrategy = (id: string, updates: Partial<BackupStrategy>) => {
    setStrategies(strategies.map(strategy => 
      strategy.id === id ? { ...strategy, ...updates } : strategy
    ));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 hours ago</div>
            <p className="text-xs text-muted-foreground">Daily backup completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5 GB</div>
            <p className="text-xs text-muted-foreground">Across all backups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Backup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 hours</div>
            <p className="text-xs text-muted-foreground">Scheduled daily backup</p>
          </CardContent>
        </Card>
      </div>

      {currentBackup && (
        <Card>
          <CardHeader>
            <CardTitle>Backup in Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentBackup.status}</span>
                <span>{currentBackup.progress}%</span>
              </div>
              <Progress value={currentBackup.progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Backups</CardTitle>
              <Button onClick={startManualBackup} disabled={!!currentBackup}>
                <Play className="h-4 w-4 mr-2" />
                Start Manual Backup
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(backup.status)}
                    <div>
                      <p className="font-medium">{backup.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{backup.size}</span>
                        <span>•</span>
                        <span>{backup.duration}</span>
                        <span>•</span>
                        <span>{backup.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(backup.status)}>
                      {backup.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Backup Strategies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {strategies.map((strategy) => (
              <div key={strategy.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{strategy.name}</h3>
                  <Switch
                    checked={strategy.enabled}
                    onCheckedChange={(checked) => updateStrategy(strategy.id, { enabled: checked })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Frequency</Label>
                    <Select
                      value={strategy.frequency}
                      onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                        updateStrategy(strategy.id, { frequency: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Retention (days)</Label>
                    <Select
                      value={strategy.retention.toString()}
                      onValueChange={(value) => 
                        updateStrategy(strategy.id, { retention: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={strategy.includeFiles}
                      onCheckedChange={(checked) => updateStrategy(strategy.id, { includeFiles: checked })}
                    />
                    <Label className="text-sm">Include Files</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={strategy.compression}
                      onCheckedChange={(checked) => updateStrategy(strategy.id, { compression: checked })}
                    />
                    <Label className="text-sm">Compression</Label>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
