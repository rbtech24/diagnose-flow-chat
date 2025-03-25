
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeyRound, Plus, Eye, EyeOff, Copy, RefreshCw, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ApiKeys() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("api-keys");
  
  // Simulated data
  const apiKeys = [
    { id: "1", name: "Production API Key", key: "sk_prod_a1b2c3d4e5f6g7h8i9j0", created: "2023-05-15", lastUsed: "Today", permissions: "full-access" },
    { id: "2", name: "Testing API Key", key: "sk_test_z9y8x7w6v5u4t3s2r1q0", created: "2023-06-20", lastUsed: "Yesterday", permissions: "read-only" },
    { id: "3", name: "Development API Key", key: "sk_dev_k1l2m3n4o5p6q7r8s9t0", created: "2023-07-10", lastUsed: "1 week ago", permissions: "read-write" },
  ];
  
  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You would typically show a toast notification here
    console.log("Copied to clipboard");
  };
  
  const getMaskedKey = (key: string) => {
    return `${key.substring(0, 10)}${"•".repeat(20)}`;
  };
  
  const handleCreateKey = () => {
    console.log("Create new API key");
  };
  
  const handleRegenerateKey = (id: string) => {
    console.log(`Regenerate key ${id}`);
  };
  
  const handleDeleteKey = (id: string) => {
    console.log(`Delete key ${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground">Manage API keys for external integrations</p>
        </div>
        <Button onClick={handleCreateKey}>
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      <Tabs defaultValue="api-keys" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Active API Keys</CardTitle>
              <CardDescription>Manage API keys for your application</CardDescription>
            </CardHeader>
            <CardContent>
              {apiKeys.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No API keys found. Create your first API key to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <KeyRound className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{apiKey.name}</h3>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground">Created: {apiKey.created}</p>
                              <span>•</span>
                              <p className="text-xs text-muted-foreground">Last used: {apiKey.lastUsed}</p>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {apiKey.permissions === 'full-access' ? 'Full Access' : 
                           apiKey.permissions === 'read-only' ? 'Read Only' : 'Read/Write'}
                        </Badge>
                      </div>
                      
                      <div className="bg-muted p-3 rounded-md flex justify-between items-center">
                        <code className="text-sm font-mono">
                          {showKeys[apiKey.id] ? apiKey.key : getMaskedKey(apiKey.key)}
                        </code>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {showKeys[apiKey.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showKeys[apiKey.id] ? "Hide" : "Show"} API Key
                            </span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy API Key</span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRegenerateKey(apiKey.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerate
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteKey(apiKey.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>API Usage & Limits</CardTitle>
              <CardDescription>Track your API usage and manage rate limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                API usage statistics will be shown here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>API Permissions</CardTitle>
              <CardDescription>Manage permission scopes for API keys</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Permission Level</Label>
                    <Select defaultValue="read-write">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a permission level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-access">Full Access</SelectItem>
                        <SelectItem value="read-write">Read & Write</SelectItem>
                        <SelectItem value="read-only">Read Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>API Rate Limit (requests per minute)</Label>
                    <Input type="number" defaultValue="100" />
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Custom Permission Scopes</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">User Data</p>
                        <p className="text-xs text-muted-foreground">Access to user profiles and accounts</p>
                      </div>
                      <Select defaultValue="read-only">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select permissions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-access">No Access</SelectItem>
                          <SelectItem value="read-only">Read Only</SelectItem>
                          <SelectItem value="read-write">Read & Write</SelectItem>
                          <SelectItem value="full-access">Full Access</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Diagnostic Data</p>
                        <p className="text-xs text-muted-foreground">Access to workflow and diagnostic information</p>
                      </div>
                      <Select defaultValue="read-write">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select permissions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-access">No Access</SelectItem>
                          <SelectItem value="read-only">Read Only</SelectItem>
                          <SelectItem value="read-write">Read & Write</SelectItem>
                          <SelectItem value="full-access">Full Access</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Billing Data</p>
                        <p className="text-xs text-muted-foreground">Access to payment and subscription information</p>
                      </div>
                      <Select defaultValue="no-access">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select permissions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-access">No Access</SelectItem>
                          <SelectItem value="read-only">Read Only</SelectItem>
                          <SelectItem value="read-write">Read & Write</SelectItem>
                          <SelectItem value="full-access">Full Access</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
