
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Activity, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SecurityEvent {
  id: string;
  type: 'failed_login' | 'suspicious_activity' | 'rate_limit_exceeded' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  userId?: string;
  ipAddress?: string;
}

export function SecurityMonitor() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [activeThreats, setActiveThreats] = useState(0);

  useEffect(() => {
    // Simulate security events for demo
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'failed_login',
        severity: 'medium',
        message: 'Multiple failed login attempts detected',
        timestamp: new Date(Date.now() - 300000),
        ipAddress: '192.168.1.100'
      },
      {
        id: '2',
        type: 'rate_limit_exceeded',
        severity: 'high',
        message: 'API rate limit exceeded from IP address',
        timestamp: new Date(Date.now() - 600000),
        ipAddress: '203.0.113.45'
      }
    ];
    
    setEvents(mockEvents);
    setActiveThreats(mockEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length);
  }, []);

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getEventIcon = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'failed_login': return <Shield className="h-4 w-4" />;
      case 'suspicious_activity': return <AlertTriangle className="h-4 w-4" />;
      case 'rate_limit_exceeded': return <Activity className="h-4 w-4" />;
      case 'unauthorized_access': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeThreats}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Secure</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getEventIcon(event.type)}
                  <div>
                    <p className="font-medium">{event.message}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{event.timestamp.toLocaleString()}</span>
                      {event.ipAddress && <span>• IP: {event.ipAddress}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getSeverityColor(event.severity)}>
                    {event.severity.toUpperCase()}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Investigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
