
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Building2, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function CompanySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Company Settings</h1>
        <p className="text-gray-600">Manage your organization's profile and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" defaultValue="TechFlow Solutions" />
            </div>
            <div>
              <Label htmlFor="company-description">Description</Label>
              <Textarea 
                id="company-description" 
                defaultValue="Leading provider of technical workflow management solutions for HVAC and maintenance professionals."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="company-website">Website</Label>
              <Input id="company-website" defaultValue="https://techflow.com" />
            </div>
            <div>
              <Label htmlFor="company-industry">Industry</Label>
              <Input id="company-industry" defaultValue="HVAC & Maintenance Services" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company-email">Primary Email</Label>
              <Input id="company-email" defaultValue="contact@techflow.com" />
            </div>
            <div>
              <Label htmlFor="company-phone">Phone Number</Label>
              <Input id="company-phone" defaultValue="+1 (555) 123-4567" />
            </div>
            <div>
              <Label htmlFor="company-address">Address</Label>
              <Textarea 
                id="company-address" 
                defaultValue="123 Business Avenue, Suite 100, San Francisco, CA 94105"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-assign">Auto-assign Technicians</Label>
                <p className="text-sm text-gray-600">Automatically assign jobs to available technicians</p>
              </div>
              <Switch id="auto-assign" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="customer-notifications">Customer Notifications</Label>
                <p className="text-sm text-gray-600">Send automated updates to customers</p>
              </div>
              <Switch id="customer-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="inventory-tracking">Inventory Tracking</Label>
                <p className="text-sm text-gray-600">Enable parts and equipment tracking</p>
              </div>
              <Switch id="inventory-tracking" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics">Advanced Analytics</Label>
                <p className="text-sm text-gray-600">Collect detailed performance metrics</p>
              </div>
              <Switch id="analytics" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="logo-upload">Company Logo</Label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <Button variant="outline">Upload Logo</Button>
              </div>
            </div>
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-8 h-8 bg-blue-600 rounded"></div>
                <Input id="primary-color" defaultValue="#2563eb" className="max-w-24" />
              </div>
            </div>
            <div>
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-8 h-8 bg-gray-600 rounded"></div>
                <Input id="secondary-color" defaultValue="#4b5563" className="max-w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
