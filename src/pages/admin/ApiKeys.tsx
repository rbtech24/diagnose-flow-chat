
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Clipboard, Key, Plus, RefreshCw, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
}

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API",
      key: "rap_prod_sk_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    }
  ]);
  
  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  
  const generateApiKey = () => {
    // Generate a more realistic API key format
    const prefix = "rap_";
    const environment = Math.random() > 0.5 ? "prod" : "test";
    const keyType = "_sk_"; // secret key
    const randomPart = Array.from({length: 32}, () => 
      Math.random().toString(36).charAt(2) || Math.random().toString(16).charAt(2)
    ).join('');
    
    return `${prefix}${environment}${keyType}${randomPart}`;
  };
  
  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please provide a name for your API key");
      return;
    }
    
    const newKey = generateApiKey();
    setNewlyCreatedKey(newKey);
    
    const apiKey: ApiKey = {
      id: String(apiKeys.length + 1),
      name: newKeyName,
      key: newKey,
      createdAt: new Date(),
    };
    
    setApiKeys([...apiKeys, apiKey]);
  };
  
  const handleCloseCreateDialog = () => {
    setIsCreateKeyOpen(false);
    setNewKeyName("");
    setNewlyCreatedKey(null);
  };
  
  const handleDeleteKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
    toast.success("API key deleted successfully");
  };
  
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground">Manage API keys for system integration</p>
        </div>
        <Dialog open={isCreateKeyOpen} onOpenChange={setIsCreateKeyOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                API keys allow external services to access the Repair Auto Pilot API.
              </DialogDescription>
            </DialogHeader>
            
            {!newlyCreatedKey ? (
              <>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">API Key Name</Label>
                    <Input
                      id="key-name"
                      placeholder="e.g. Production API"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Give your key a descriptive name for future reference
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseCreateDialog}>Cancel</Button>
                  <Button onClick={handleCreateKey}>Generate API Key</Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <div className="space-y-4 py-4">
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                    <p className="text-amber-800 font-medium mb-2">Important!</p>
                    <p className="text-amber-700 text-sm">
                      This API key will only be displayed once. Please copy it now and store it securely.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-api-key">Your New API Key</Label>
                    <div className="flex">
                      <Input
                        id="new-api-key"
                        value={newlyCreatedKey}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-2"
                        onClick={() => handleCopyKey(newlyCreatedKey)}
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCloseCreateDialog}>Close</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Your API Keys
          </CardTitle>
          <CardDescription>
            Use these keys to authenticate requests to the Repair Auto Pilot API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No API keys created yet. Create your first API key to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map(key => (
                <div key={key.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{key.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {key.key.substring(0, 12)}...
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <span>Created: {formatDate(key.createdAt)}</span>
                      {key.lastUsed && (
                        <span className="ml-4">Last used: {formatDate(key.lastUsed)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopyKey(key.key)}
                    >
                      <Clipboard className="h-3.5 w-3.5 mr-1.5" />
                      Copy
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteKey(key.id)}
                    >
                      <Trash className="h-3.5 w-3.5 mr-1.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>
              Learn how to use the Repair Auto Pilot API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                The Repair Auto Pilot API allows you to programmatically access your repair data, 
                workflows, and manage your technicians. Use the API keys above to authenticate your requests.
              </p>
              <Button variant="outline">View API Documentation</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
