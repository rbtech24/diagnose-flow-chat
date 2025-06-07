
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Database, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type TaskStatus = "completed" | "running" | "failed" | "pending";

interface OptimizationTask {
  id: string;
  type: 'vacuum' | 'reindex' | 'analyze' | 'cleanup';
  table: string;
  status: TaskStatus;
  progress: number;
  estimatedTime?: string;
  benefit?: string;
}

export function DatabaseOptimization() {
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<OptimizationTask[]>([
    {
      id: '1',
      type: 'vacuum',
      table: 'workflows',
      status: 'pending',
      progress: 0,
      estimatedTime: '2-3 minutes',
      benefit: 'Reclaim disk space and improve query performance'
    },
    {
      id: '2',
      type: 'reindex',
      table: 'workflow_categories',
      status: 'pending',
      progress: 0,
      estimatedTime: '1-2 minutes',
      benefit: 'Optimize index performance'
    },
    {
      id: '3',
      type: 'analyze',
      table: 'user_activity_logs',
      status: 'pending',
      progress: 0,
      estimatedTime: '30-60 seconds',
      benefit: 'Update table statistics for better query planning'
    },
    {
      id: '4',
      type: 'cleanup',
      table: 'temp_data',
      status: 'pending',
      progress: 0,
      estimatedTime: '1 minute',
      benefit: 'Remove temporary and orphaned data'
    }
  ]);

  const runOptimization = async () => {
    setIsRunning(true);
    
    // Reset all tasks to pending
    setTasks(currentTasks => 
      currentTasks.map(task => ({ ...task, status: 'pending' as TaskStatus, progress: 0 }))
    );

    for (let i = 0; i < tasks.length; i++) {
      // Start task
      setTasks(currentTasks => 
        currentTasks.map(task => 
          task.id === tasks[i].id 
            ? { ...task, status: 'running' as TaskStatus }
            : task
        )
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setTasks(currentTasks => 
          currentTasks.map(task => 
            task.id === tasks[i].id 
              ? { ...task, progress }
              : task
          )
        );
      }

      // Complete task
      setTasks(currentTasks => 
        currentTasks.map(task => 
          task.id === tasks[i].id 
            ? { ...task, status: 'completed' as TaskStatus, progress: 100 }
            : task
        )
      );
    }

    setIsRunning(false);
    toast({
      title: "Optimization Complete",
      description: "Database optimization tasks have been completed successfully."
    });
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'running': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'vacuum': return <Database className="h-4 w-4" />;
      case 'reindex': return <RotateCcw className="h-4 w-4" />;
      case 'analyze': return <Play className="h-4 w-4" />;
      case 'cleanup': return <AlertTriangle className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Run optimization tasks to improve database performance and reclaim disk space.
              </p>
              <Button 
                onClick={runOptimization} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isRunning ? 'Running...' : 'Start Optimization'}
              </Button>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTaskIcon(task.type)}
                      <span className="font-medium capitalize">{task.type}</span>
                      <span className="text-sm text-muted-foreground">({task.table})</span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(task.status)} text-white`}
                    >
                      {task.status}
                    </Badge>
                  </div>
                  
                  <Progress value={task.progress} className="mb-2" />
                  
                  <div className="text-sm text-muted-foreground">
                    <div>Estimated time: {task.estimatedTime}</div>
                    <div>Benefit: {task.benefit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
