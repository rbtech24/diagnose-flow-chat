
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { Activity, Clock, Memory, Zap } from 'lucide-react';

export function PerformanceDashboard() {
  const {
    metrics,
    isMonitoring,
    getPerformanceSummary,
    toggleMonitoring,
    clearMetrics
  } = usePerformanceMonitoring();

  const [summary, setSummary] = useState(getPerformanceSummary());

  useEffect(() => {
    const interval = setInterval(() => {
      setSummary(getPerformanceSummary());
    }, 5000);

    return () => clearInterval(interval);
  }, [getPerformanceSummary]);

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'destructive';
    if (value >= thresholds.warning) return 'default';
    return 'secondary';
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <p className="text-muted-foreground">Monitor application performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isMonitoring ? "default" : "outline"}
            onClick={toggleMonitoring}
          >
            {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
          </Button>
          <Button variant="outline" onClick={clearMetrics}>
            Clear Metrics
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Load Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(summary.averagePageLoad)}
            </div>
            <Badge variant={getStatusColor(summary.averagePageLoad, { warning: 3000, critical: 5000 })}>
              {summary.averagePageLoad < 3000 ? 'Good' : summary.averagePageLoad < 5000 ? 'Warning' : 'Critical'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Response</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(summary.averageApiResponse)}
            </div>
            <Badge variant={getStatusColor(summary.averageApiResponse, { warning: 1000, critical: 3000 })}>
              {summary.averageApiResponse < 1000 ? 'Good' : summary.averageApiResponse < 3000 ? 'Warning' : 'Critical'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Memory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.memoryUsage}MB</div>
            <Badge variant={getStatusColor(summary.memoryUsage, { warning: 50, critical: 80 })}>
              {summary.memoryUsage < 50 ? 'Good' : summary.memoryUsage < 80 ? 'Warning' : 'Critical'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Metrics</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalMetrics}</div>
            <div className="flex gap-1 mt-2">
              {summary.warnings > 0 && (
                <Badge variant="default">{summary.warnings} warnings</Badge>
              )}
              {summary.criticals > 0 && (
                <Badge variant="destructive">{summary.criticals} critical</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Metrics</TabsTrigger>
          <TabsTrigger value="page-load">Page Load</TabsTrigger>
          <TabsTrigger value="api">API Calls</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Performance Metrics</CardTitle>
              <CardDescription>Last 50 recorded metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {metrics.slice(-50).reverse().map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{metric.category}</Badge>
                      <span className="font-medium">{metric.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {metric.value.toFixed(2)}{metric.unit}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {metric.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                {metrics.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No metrics recorded yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="page-load">
          <Card>
            <CardHeader>
              <CardTitle>Page Load Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {metrics
                  .filter(m => m.category === 'page_load')
                  .slice(-20)
                  .reverse()
                  .map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">{metric.name}</span>
                      <div className="text-right">
                        <div>{formatDuration(metric.value)}</div>
                        <div className="text-xs text-muted-foreground">
                          {metric.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Call Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {metrics
                  .filter(m => m.category === 'api_response')
                  .slice(-20)
                  .reverse()
                  .map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">{metric.name}</span>
                      <div className="text-right">
                        <div>{formatDuration(metric.value)}</div>
                        <div className="text-xs text-muted-foreground">
                          {metric.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory">
          <Card>
            <CardHeader>
              <CardTitle>Memory Usage Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {metrics
                  .filter(m => m.category === 'memory_usage')
                  .slice(-20)
                  .reverse()
                  .map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">{metric.name}</span>
                      <div className="text-right">
                        <div>{metric.value.toFixed(2)}{metric.unit}</div>
                        <div className="text-xs text-muted-foreground">
                          {metric.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
