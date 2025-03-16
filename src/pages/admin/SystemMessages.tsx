
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSystemMessages } from "@/context/SystemMessageContext";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { BellRing, Info, AlertTriangle, X } from "lucide-react";
import { SystemMessage } from "@/components/system/SystemMessage";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export default function SystemMessagesPage() {
  const { messages, addMessage, removeMessage } = useSystemMessages();
  
  const [newMessage, setNewMessage] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "warning" | "maintenance",
    targetUsers: {
      company: true,
      tech: true,
      admin: false
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.title || !newMessage.message) {
      toast.error("Please provide both title and message");
      return;
    }
    
    const targetUsers = Object.entries(newMessage.targetUsers)
      .filter(([_, value]) => value)
      .map(([key]) => key) as ("company" | "tech" | "admin")[];
    
    if (targetUsers.length === 0) {
      toast.error("Please select at least one user type");
      return;
    }
    
    addMessage({
      title: newMessage.title,
      message: newMessage.message,
      type: newMessage.type,
      targetUsers
    });
    
    toast.success("System message added successfully");
    
    // Reset form
    setNewMessage({
      title: "",
      message: "",
      type: "info",
      targetUsers: {
        company: true,
        tech: true,
        admin: false
      }
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Messages</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Current System Messages</CardTitle>
              <CardDescription>Messages displayed to users across the system</CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No active system messages
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className="relative border rounded-lg p-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2"
                        onClick={() => {
                          removeMessage(msg.id);
                          toast.success("Message removed");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      <SystemMessage
                        type={msg.type}
                        title={msg.title}
                        message={msg.message}
                      />
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        <p className="text-xs text-gray-500">Visible to:</p>
                        {msg.targetUsers.map(user => (
                          <span key={user} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {user}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Add New Message</CardTitle>
              <CardDescription>Create a system-wide announcement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Message Title</Label>
                <Input 
                  id="title" 
                  value={newMessage.title}
                  onChange={e => setNewMessage({...newMessage, title: e.target.value})}
                  placeholder="e.g. Scheduled Maintenance"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message Content</Label>
                <Textarea 
                  id="message"
                  value={newMessage.message}
                  onChange={e => setNewMessage({...newMessage, message: e.target.value})}
                  placeholder="Details about the announcement..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Message Type</Label>
                <RadioGroup 
                  value={newMessage.type} 
                  onValueChange={(value) => setNewMessage({
                    ...newMessage, 
                    type: value as "info" | "warning" | "maintenance"
                  })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="info" id="info" />
                    <Label htmlFor="info" className="flex items-center">
                      <Info className="h-4 w-4 text-blue-500 mr-1" /> Info
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="warning" id="warning" />
                    <Label htmlFor="warning" className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" /> Warning
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maintenance" id="maintenance" />
                    <Label htmlFor="maintenance" className="flex items-center">
                      <BellRing className="h-4 w-4 text-red-500 mr-1" /> Maintenance
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-3">
                <Label>Show Message To</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="company" 
                      checked={newMessage.targetUsers.company}
                      onCheckedChange={(checked) => 
                        setNewMessage({
                          ...newMessage, 
                          targetUsers: {...newMessage.targetUsers, company: !!checked}
                        })
                      }
                    />
                    <label htmlFor="company" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Company Users
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tech" 
                      checked={newMessage.targetUsers.tech}
                      onCheckedChange={(checked) => 
                        setNewMessage({
                          ...newMessage, 
                          targetUsers: {...newMessage.targetUsers, tech: !!checked}
                        })
                      }
                    />
                    <label htmlFor="tech" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Technicians
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="admin" 
                      checked={newMessage.targetUsers.admin}
                      onCheckedChange={(checked) => 
                        setNewMessage({
                          ...newMessage, 
                          targetUsers: {...newMessage.targetUsers, admin: !!checked}
                        })
                      }
                    />
                    <label htmlFor="admin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Admin Users
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Add System Message</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>System Message Preview</CardTitle>
            <CardDescription>This is how your message will appear to users</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemMessage
              type={newMessage.type}
              title={newMessage.title || "Message Title"}
              message={newMessage.message || "Message content will appear here..."}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
