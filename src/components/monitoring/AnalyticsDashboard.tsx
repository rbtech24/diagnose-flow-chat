
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BarChart, Users, Activity, AlertTriangle } from 'lucide-react';

export function AnalyticsDashboard() {
  const {
    events,
    getAnalyticsSummary,
    getCurrentSession
  } = useAnalytics();

  const [summary, setSummary] = useState(getAnalyticsSummary());
  const [session, setSession] = useState(getCurrentSession());

  useEffect(() => {
    const interval = setInterval(() => {
      setSummary(getAnalyticsSummary());
      setSession(getCurrentSession());
    }, 5000);

    return () => clearInterval(interval);
  }, [getAnalyticsSummary, getCurrentSession]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Track user behavior and application usage</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {session.events} in current session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.uniqueSessions}</div>
            <p className="text-xs text-muted-foreground">
              Current: {formatDuration(summary.averageSessionDuration)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.name === 'page_view').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {session.pageViews} in current session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.errorRate}%</div>
            <Badge variant={summary.errorRate > 5 ? "destructive" : summary.errorRate > 2 ? "default" : "secondary"}>
              {summary.errorRate > 5 ? 'High' : summary.errorRate > 2 ? 'Medium' : 'Low'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Events</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Last 50 tracked events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {events.slice(-50).reverse().map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{event.category}</Badge>
                      <span className="font-medium">{event.name}</span>
                      {event.label && (
                        <span className="text-sm text-muted-foreground">• {event.label}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{event.action}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No events recorded yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.topCategories.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <span>{category.category}</span>
                    </div>
                    <Badge variant="outline">{category.count} events</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Top Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.topActions.map((action, index) => (
                  <div key={action.action} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <span>{action.action}</span>
                    </div>
                    <Badge variant="outline">{action.count} events</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Error Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {events
                  .filter(e => e.category === 'error')
                  .slice(-20)
                  .reverse()
                  .map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 border rounded bg-red-50">
                      <div>
                        <div className="font-medium">{event.name}</div>
                        {event.properties?.message && (
                          <div className="text-sm text-muted-foreground">{event.properties.message}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{event.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {event.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                }
                {events.filter(e => e.category === 'error').length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No errors recorded
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
