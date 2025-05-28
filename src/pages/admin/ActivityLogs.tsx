
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Shield, Database, Settings } from 'lucide-react';

export default function ActivityLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-600">Monitor system activities and user actions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-green-600">42</p>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Events</p>
                <p className="text-2xl font-bold text-yellow-600">8</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Changes</p>
                <p className="text-2xl font-bold text-purple-600">15</p>
              </div>
              <Database className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-3 border rounded-lg">
              <User className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">User Login</p>
                <p className="text-sm text-gray-600">John Doe logged into the system</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-600">Auth</Badge>
            </div>

            <div className="flex items-start space-x-4 p-3 border rounded-lg">
              <Settings className="w-5 h-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Settings Updated</p>
                <p className="text-sm text-gray-600">Company settings were modified by Admin</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">System</Badge>
            </div>

            <div className="flex items-start space-x-4 p-3 border rounded-lg">
              <Database className="w-5 h-5 text-purple-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Data Export</p>
                <p className="text-sm text-gray-600">User data exported by Jane Smith</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
              <Badge variant="outline" className="text-purple-600 border-purple-600">Data</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
