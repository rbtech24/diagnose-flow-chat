
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Zap, 
  BarChart3, 
  Settings, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  HardDrive
} from 'lucide-react';

interface TableStats {
  name: string;
  size: string;
  rows: number;
  indexSize: string;
  lastAnalyzed: Date;
  performance: 'good' | 'warning' | 'critical';
}

interface OptimizationTask {
  id: string;
  type: 'vacuum' | 'reindex' | 'analyze' | 'cleanup';
  table: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  estimatedTime?: string;
  benefit?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export function DatabaseOptimization() {
  const [tableStats, setTableStats] = useState<TableStats[]>([]);
  const [tasks, setTasks] = useState<OptimizationTask[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    // Mock data
    setTableStats([
      {
        name: 'repairs',
        size: '1.2 GB',
        rows: 45623,
        indexSize: '156 MB',
        lastAnalyzed: new Date(Date.now() - 86400000),
        performance: 'good'
      },
      {
        name: 'user_activity_logs',
        size: '890 MB',
        rows: 125000,
        indexSize: '78 MB',
        lastAnalyzed: new Date(Date.now() - 259200000),
        performance: 'warning'
      },
      {
        name: 'email_logs',
        size: '2.1 GB',
        rows: 89000,
        indexSize: '234 MB',
        lastAnalyzed: new Date(Date.now() - 604800000),
        performance: 'critical'
      }
    ]);

    setMetrics([
      {
        name: 'Query Response Time',
        value: 45,
        unit: 'ms',
        status: 'good',
        trend: 'down'
      },
      {
        name: 'Connection Pool Usage',
        value: 78,
        unit: '%',
        status: 'warning',
        trend: 'up'
      },
      {
        name: 'Index Hit Ratio',
        value: 99.2,
        unit: '%',
        status: 'good',
        trend: 'stable'
      },
      {
        name: 'Disk Usage',
        value: 65,
        unit: '%',
        status: 'good',
        trend: 'up'
      }
    ]);

    setTasks([
      {
        id: '1',
        type: 'vacuum',
        table: 'user_activity_logs',
        status: 'pending',
        progress: 0,
        estimatedTime: '5 minutes',
        benefit: 'Reduce table bloat by ~200MB'
      },
      {
        id: '2',
        type: 'reindex',
        table: 'email_logs',
        status: 'pending',
        progress: 0,
        estimatedTime: '15 minutes',
        benefit: 'Improve query performance by 30%'
      }
    ]);
  }, []);

  const getPerformanceColor = (performance: TableStats['performance']) => {
    switch (performance) {
      case 'good': return 'default';
      case 'warning': return 'outline';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  const getMetricStatusColor = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: PerformanceMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      case 'stable': return <div className="h-3 w-3 rounded-full bg-gray-400" />;
    }
  };

  const runOptimization = async (taskId: string) => {
    setIsOptimizing(true);
    
    // Simulate optimization progress
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, status: 'running' } : t
      ));

      const interval = setInterval(() => {
        setTasks(currentTasks => {
          const updatedTasks = currentTasks.map(t => {
            if (t.id === taskId && t.status === 'running') {
              if (t.progress >= 100) {
                return { ...t, status: 'completed', progress: 100 };
              }
              return { ...t, progress: t.progress + 10 };
            }
            return t;
          });
          
          const runningTask = updatedTasks.find(t => t.id === taskId);
          if (runningTask?.status === 'completed') {
            clearInterval(interval);
            setIsOptimizing(false);
          }
          
          return updatedTasks;
        });
      }, 500);
    }
  };

  const runAllOptimizations = () => {
    tasks.forEach(task => {
      if (task.status === 'pending') {
        setTimeout(() => runOptimization(task.id), Math.random() * 2000);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {getTrendIcon(metric.trend)}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>
                {metric.value}{metric.unit}
              </div>
              <p className="text-xs text-muted-foreground">
                Status: {metric.status}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">Table Statistics</TabsTrigger>
          <TabsTrigger value="optimization">Optimization Tasks</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Table Statistics
                </CardTitle>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Stats
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tableStats.map((table, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{table.name}</p>
                      <p className="text-sm text-muted-foreground">Table</p>
                    </div>
                    <div>
                      <p className="font-medium">{table.size}</p>
                      <p className="text-sm text-muted-foreground">Size</p>
                    </div>
                    <div>
                      <p className="font-medium">{table.rows.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Rows</p>
                    </div>
                    <div>
                      <p className="font-medium">{table.indexSize}</p>
                      <p className="text-sm text-muted-foreground">Index Size</p>
                    </div>
                    <div>
                      <p className="font-medium">{table.lastAnalyzed.toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">Last Analyzed</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant={getPerformanceColor(table.performance)}>
                        {table.performance}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Analyze
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Optimization Tasks
                </CardTitle>
                <Button 
                  onClick={runAllOptimizations}
                  disabled={isOptimizing}
                >
                  Run All Tasks
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium capitalize">
                          {task.type} - {task.table}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {task.benefit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          task.status === 'completed' ? 'default' :
                          task.status === 'running' ? 'outline' :
                          task.status === 'failed' ? 'destructive' : 'secondary'
                        }>
                          {task.status}
                        </Badge>
                        {task.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => runOptimization(task.id)}
                            disabled={isOptimizing}
                          >
                            Run Task
                          </Button>
                        )}
                      </div>
                    </div>

                    {task.status === 'running' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="w-full" />
                      </div>
                    )}

                    {task.estimatedTime && task.status === 'pending' && (
                      <p className="text-sm text-muted-foreground">
                        Estimated time: {task.estimatedTime}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Maintenance Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Daily Maintenance</h3>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Update table statistics (2:00 AM)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Clean temporary files (3:00 AM)
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Weekly Maintenance</h3>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      VACUUM analyze (Sunday 1:00 AM)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Reindex fragmented indexes (Sunday 2:00 AM)
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Monthly Maintenance</h3>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Full database vacuum (1st Sunday 12:00 AM)
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Performance audit (1st Monday 6:00 AM)
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
