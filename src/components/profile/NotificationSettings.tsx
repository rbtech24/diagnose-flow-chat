
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, MessageSquare, AlertTriangle, Smartphone } from "lucide-react";

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    email: {
      newAssignments: true,
      statusUpdates: true,
      weeklyReports: false,
      companyAnnouncements: true,
    },
    push: {
      newAssignments: true,
      statusUpdates: true,
      weeklyReports: false,
      companyAnnouncements: false,
    },
    sms: {
      newAssignments: true,
      statusUpdates: false,
      weeklyReports: false,
      companyAnnouncements: false,
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const updateSetting = (category: 'email' | 'push' | 'sms', setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // In a real app, we would save these settings to the user's profile
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated successfully.",
        type: "success"
      });
      
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Manage how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-500" />
            Email Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-assignments" className="flex-1">
                New repair assignments
              </Label>
              <Switch 
                id="email-assignments" 
                checked={settings.email.newAssignments}
                onCheckedChange={(value) => updateSetting('email', 'newAssignments', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-status" className="flex-1">
                Repair status updates
              </Label>
              <Switch 
                id="email-status" 
                checked={settings.email.statusUpdates}
                onCheckedChange={(value) => updateSetting('email', 'statusUpdates', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-reports" className="flex-1">
                Weekly performance reports
              </Label>
              <Switch 
                id="email-reports" 
                checked={settings.email.weeklyReports}
                onCheckedChange={(value) => updateSetting('email', 'weeklyReports', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-announcements" className="flex-1">
                Company announcements
              </Label>
              <Switch 
                id="email-announcements" 
                checked={settings.email.companyAnnouncements}
                onCheckedChange={(value) => updateSetting('email', 'companyAnnouncements', value)}
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-blue-500" />
            Push Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-assignments" className="flex-1">
                New repair assignments
              </Label>
              <Switch 
                id="push-assignments" 
                checked={settings.push.newAssignments}
                onCheckedChange={(value) => updateSetting('push', 'newAssignments', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-status" className="flex-1">
                Repair status updates
              </Label>
              <Switch 
                id="push-status" 
                checked={settings.push.statusUpdates}
                onCheckedChange={(value) => updateSetting('push', 'statusUpdates', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-reports" className="flex-1">
                Weekly performance reports
              </Label>
              <Switch 
                id="push-reports" 
                checked={settings.push.weeklyReports}
                onCheckedChange={(value) => updateSetting('push', 'weeklyReports', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-announcements" className="flex-1">
                Company announcements
              </Label>
              <Switch 
                id="push-announcements" 
                checked={settings.push.companyAnnouncements}
                onCheckedChange={(value) => updateSetting('push', 'companyAnnouncements', value)}
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Smartphone className="h-5 w-5 mr-2 text-blue-500" />
            SMS Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-assignments" className="flex-1">
                New repair assignments
              </Label>
              <Switch 
                id="sms-assignments" 
                checked={settings.sms.newAssignments}
                onCheckedChange={(value) => updateSetting('sms', 'newAssignments', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-status" className="flex-1">
                Repair status updates
              </Label>
              <Switch 
                id="sms-status" 
                checked={settings.sms.statusUpdates}
                onCheckedChange={(value) => updateSetting('sms', 'statusUpdates', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-reports" className="flex-1">
                Weekly performance reports
              </Label>
              <Switch 
                id="sms-reports" 
                checked={settings.sms.weeklyReports}
                onCheckedChange={(value) => updateSetting('sms', 'weeklyReports', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-announcements" className="flex-1">
                Company announcements
              </Label>
              <Switch 
                id="sms-announcements" 
                checked={settings.sms.companyAnnouncements}
                onCheckedChange={(value) => updateSetting('sms', 'companyAnnouncements', value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveSettings} 
          className="w-full"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Notification Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
}
