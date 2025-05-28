
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Shield, Globe, Palette, Clock, Download } from 'lucide-react';

export default function TechSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Customize your preferences and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-600">Browser push notifications</p>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-gray-600">Text message alerts</p>
              </div>
              <Switch id="sms-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
                <p className="text-sm text-gray-600">Get reminded before appointments</p>
              </div>
              <Switch id="appointment-reminders" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select defaultValue="system">
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="pst">
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pst">Pacific Standard Time</SelectItem>
                  <SelectItem value="mst">Mountain Standard Time</SelectItem>
                  <SelectItem value="cst">Central Standard Time</SelectItem>
                  <SelectItem value="est">Eastern Standard Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <p className="text-sm text-gray-600">Allow others to see your profile</p>
              </div>
              <Switch id="profile-visibility" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="location-sharing">Location Sharing</Label>
                <p className="text-sm text-gray-600">Share location for job assignments</p>
              </div>
              <Switch id="location-sharing" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="activity-tracking">Activity Tracking</Label>
                <p className="text-sm text-gray-600">Track work activities for analytics</p>
              </div>
              <Switch id="activity-tracking" defaultChecked />
            </div>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Work Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="work-hours">Default Work Hours</Label>
              <Select defaultValue="8-5">
                <SelectTrigger>
                  <SelectValue placeholder="Select work hours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7-4">7:00 AM - 4:00 PM</SelectItem>
                  <SelectItem value="8-5">8:00 AM - 5:00 PM</SelectItem>
                  <SelectItem value="9-6">9:00 AM - 6:00 PM</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="service-area">Service Area Radius</Label>
              <Select defaultValue="25">
                <SelectTrigger>
                  <SelectValue placeholder="Select radius" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 miles</SelectItem>
                  <SelectItem value="25">25 miles</SelectItem>
                  <SelectItem value="50">50 miles</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekend-work">Weekend Availability</Label>
                <p className="text-sm text-gray-600">Accept weekend assignments</p>
              </div>
              <Switch id="weekend-work" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emergency-calls">Emergency Calls</Label>
                <p className="text-sm text-gray-600">Accept after-hours emergency calls</p>
              </div>
              <Switch id="emergency-calls" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Data & Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Work History</p>
                <p className="text-sm text-gray-600">Download your complete work history and reports</p>
              </div>
              <Button variant="outline">Export Data</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Backup Settings</p>
                <p className="text-sm text-gray-600">Download your current settings configuration</p>
              </div>
              <Button variant="outline">Download Backup</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
