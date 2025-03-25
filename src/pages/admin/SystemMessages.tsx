
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Bell, Trash2, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SystemMessages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [messageType, setMessageType] = useState("all");
  
  // Simulated data
  const messages = [
    { id: "1", title: "Scheduled Maintenance", message: "System will be down for maintenance on Saturday, 10 PM - 2 AM EST.", type: "info", audience: "all", scheduled: "Tomorrow", active: true },
    { id: "2", title: "New Feature Release", message: "We've launched our new diagnostics module!", type: "success", audience: "admins, companies", scheduled: "Active now", active: true },
    { id: "3", title: "Service Disruption", message: "We're experiencing issues with the workflow editor. Our team is investigating.", type: "error", audience: "all", scheduled: "Active now", active: true },
    { id: "4", title: "Version Update Required", message: "Please update your app to the latest version to access new features.", type: "warning", audience: "techs", scheduled: "Next week", active: false },
  ];
  
  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           message.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = messageType === "all" || message.type === messageType;
    return matchesSearch && matchesType;
  });

  const handleAddMessage = () => {
    console.log("Add new system message");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Messages</h1>
          <p className="text-muted-foreground">Manage notifications and alerts for all users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search messages..." 
              className="pl-8 w-[250px]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddMessage}>
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>Manage notifications and alerts for users</CardDescription>
            </div>
            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="info">Information</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Messages</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active messages found
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMessages.filter(msg => msg.active).map((message) => (
                    <div key={message.id} className={`flex items-start justify-between p-4 border rounded-lg ${
                      message.type === 'error' ? 'border-red-200 bg-red-50' : 
                      message.type === 'warning' ? 'border-amber-200 bg-amber-50' : 
                      message.type === 'success' ? 'border-green-200 bg-green-50' : 
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          message.type === 'error' ? 'bg-red-100' : 
                          message.type === 'warning' ? 'bg-amber-100' : 
                          message.type === 'success' ? 'bg-green-100' : 
                          'bg-blue-100'
                        }`}>
                          <Bell className={`h-5 w-5 ${
                            message.type === 'error' ? 'text-red-600' : 
                            message.type === 'warning' ? 'text-amber-600' : 
                            message.type === 'success' ? 'text-green-600' : 
                            'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{message.title}</h3>
                            <Badge variant="outline">{message.type}</Badge>
                          </div>
                          <p className="text-sm mt-1">{message.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-xs text-muted-foreground">Audience: {message.audience}</p>
                            <span>•</span>
                            <p className="text-xs text-muted-foreground">Status: {message.scheduled}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="scheduled">
              <div className="text-center py-8 text-muted-foreground">
                No scheduled messages found
              </div>
            </TabsContent>
            
            <TabsContent value="archived">
              <div className="text-center py-8 text-muted-foreground">
                No archived messages found
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
