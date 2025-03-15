
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  CreditCard, Mail, MessageSquare, Database, Sparkles, Save, 
  Check, AlertCircle, Info, Lock
} from "lucide-react";

interface APIConfig {
  enabled: boolean;
  apiKey: string;
  apiSecret?: string;
  region?: string;
  additionalSettings?: Record<string, string>;
}

interface APIConfigurations {
  stripe: APIConfig;
  helcim: APIConfig;
  twilio: APIConfig;
  sendgrid: APIConfig;
  supabase: APIConfig;
  openai: APIConfig;
  claude: APIConfig;
  grox: APIConfig;
}

export default function APIIntegrations() {
  const [configs, setConfigs] = useState<APIConfigurations>({
    stripe: { enabled: false, apiKey: '', apiSecret: '' },
    helcim: { enabled: false, apiKey: '', apiSecret: '' },
    twilio: { enabled: false, apiKey: '', apiSecret: '', additionalSettings: { accountSid: '' }},
    sendgrid: { enabled: false, apiKey: '' },
    supabase: { enabled: true, apiKey: '***************', apiSecret: '***************' },
    openai: { enabled: false, apiKey: '', additionalSettings: { organization: '' } },
    claude: { enabled: false, apiKey: '' },
    grox: { enabled: false, apiKey: '' }
  });

  const [activeTab, setActiveTab] = useState("payment");

  const handleToggleService = (service: keyof APIConfigurations) => {
    setConfigs(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        enabled: !prev[service].enabled
      }
    }));
  };

  const handleInputChange = (
    service: keyof APIConfigurations, 
    field: string, 
    value: string
  ) => {
    setConfigs(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (
    service: keyof APIConfigurations, 
    parentField: string,
    field: string, 
    value: string
  ) => {
    setConfigs(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        [parentField]: {
          ...prev[service][parentField as keyof APIConfig] as Record<string, string>,
          [field]: value
        }
      }
    }));
  };

  const handleSaveConfig = (service: keyof APIConfigurations) => {
    // In a real app, this would save to the database
    toast.success(`${service.charAt(0).toUpperCase() + service.slice(1)} configuration saved`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">API Integrations</h1>
        <p className="text-gray-500">Configure external API services for the system</p>
      </div>

      <Tabs defaultValue="payment" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="ai">AI Services</TabsTrigger>
        </TabsList>

        <TabsContent value="payment" className="space-y-6">
          {/* Stripe */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-6 w-6 text-purple-500" />
                  <div>
                    <CardTitle>Stripe</CardTitle>
                    <CardDescription>Payment processing for subscriptions and one-time payments</CardDescription>
                  </div>
                </div>
                <Switch 
                  checked={configs.stripe.enabled}
                  onCheckedChange={() => handleToggleService('stripe')}
                />
              </div>
            </CardHeader>
            {configs.stripe.enabled && (
              <>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-api-key">API Key</Label>
                    <Input 
                      id="stripe-api-key" 
                      type="password"
                      placeholder="sk_live_..."
                      value={configs.stripe.apiKey}
                      onChange={(e) => handleInputChange('stripe', 'apiKey', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-api-secret">Webhook Secret</Label>
                    <Input 
                      id="stripe-api-secret" 
                      type="password"
                      placeholder="whsec_..."
                      value={configs.stripe.apiSecret || ''}
                      onChange={(e) => handleInputChange('stripe', 'apiSecret', e.target.value)}
                    />
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Ensure you've set up the required webhook endpoints in your Stripe dashboard.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => handleSaveConfig('stripe')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>

          {/* Helcim */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-6 w-6 text-blue-500" />
                  <div>
                    <CardTitle>Helcim</CardTitle>
                    <CardDescription>Alternative payment processor for card transactions</CardDescription>
                  </div>
                </div>
                <Switch 
                  checked={configs.helcim.enabled}
                  onCheckedChange={() => handleToggleService('helcim')}
                />
              </div>
            </CardHeader>
            {configs.helcim.enabled && (
              <>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="helcim-api-key">API Key</Label>
                    <Input 
                      id="helcim-api-key" 
                      type="password"
                      placeholder="Enter Helcim API key"
                      value={configs.helcim.apiKey}
                      onChange={(e) => handleInputChange('helcim', 'apiKey', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="helcim-api-secret">API Secret</Label>
                    <Input 
                      id="helcim-api-secret" 
                      type="password"
                      placeholder="Enter Helcim API secret"
                      value={configs.helcim.apiSecret || ''}
                      onChange={(e) => handleInputChange('helcim', 'apiSecret', e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => handleSaveConfig('helcim')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          {/* Twilio */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-6 w-6 text-red-400" />
                  <div>
                    <CardTitle>Twilio</CardTitle>
                    <CardDescription>SMS and voice communication services</CardDescription>
                  </div>
                </div>
                <Switch 
                  checked={configs.twilio.enabled}
                  onCheckedChange={() => handleToggleService('twilio')}
                />
              </div>
            </CardHeader>
            {configs.twilio.enabled && (
              <>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="twilio-account-sid">Account SID</Label>
                    <Input 
                      id="twilio-account-sid" 
                      placeholder="AC..."
                      value={configs.twilio.additionalSettings?.accountSid || ''}
                      onChange={(e) => handleNestedInputChange('twilio', 'additionalSettings', 'accountSid', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twilio-api-key">API Key</Label>
                    <Input 
                      id="twilio-api-key" 
                      type="password"
                      placeholder="SK..."
                      value={configs.twilio.apiKey}
                      onChange={(e) => handleInputChange('twilio', 'apiKey', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twilio-api-secret">API Secret</Label>
                    <Input 
                      id="twilio-api-secret" 
                      type="password"
                      placeholder="Enter Twilio API secret"
                      value={configs.twilio.apiSecret || ''}
                      onChange={(e) => handleInputChange('twilio', 'apiSecret', e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => handleSaveConfig('twilio')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>

          {/* SendGrid */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-6 w-6 text-blue-400" />
                  <div>
                    <CardTitle>SendGrid</CardTitle>
                    <CardDescription>Email delivery service for communications</CardDescription>
                  </div>
                </div>
                <Switch 
                  checked={configs.sendgrid.enabled}
                  onCheckedChange={() => handleToggleService('sendgrid')}
                />
              </div>
            </CardHeader>
            {configs.sendgrid.enabled && (
              <>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sendgrid-api-key">API Key</Label>
                    <Input 
                      id="sendgrid-api-key" 
                      type="password"
                      placeholder="SG..."
                      value={configs.sendgrid.apiKey}
                      onChange={(e) => handleInputChange('sendgrid', 'apiKey', e.target.value)}
                    />
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Make sure to verify your sender domains in SendGrid before sending emails.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => handleSaveConfig('sendgrid')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
          {/* Supabase */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-6 w-6 text-green-500" />
                  <div>
                    <CardTitle>Supabase</CardTitle>
                    <CardDescription>Database, authentication and storage service</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Connected
                  </div>
                  <Switch 
                    checked={configs.supabase.enabled}
                    onCheckedChange={() => handleToggleService('supabase')}
                  />
                </div>
              </div>
            </CardHeader>
            {configs.supabase.enabled && (
              <>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="supabase-url">Supabase URL</Label>
                    <Input 
                      id="supabase-url" 
                      value="https://jukatimjnqhhlxkrxsak.supabase.co"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supabase-api-key">API Key</Label>
                    <Input 
                      id="supabase-api-key" 
                      type="password"
                      value={configs.supabase.apiKey}
                      disabled
                    />
                  </div>
                  <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      Supabase configuration is managed through the native Lovable integration.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </>
            )}
          </Card>

          {/* Google integration could be added here */}
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          {/* OpenAI */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-teal-500" />
                  <div>
                    <CardTitle>OpenAI</CardTitle>
                    <CardDescription>AI models for diagnostics and insights</CardDescription>
                  </div>
                </div>
                <Switch 
                  checked={configs.openai.enabled}
                  onCheckedChange={() => handleToggleService('openai')}
                />
              </div>
            </CardHeader>
            {configs.openai.enabled && (
              <>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openai-api-key">API Key</Label>
                    <Input 
                      id="openai-api-key" 
                      type="password"
                      placeholder="sk-..."
                      value={configs.openai.apiKey}
                      onChange={(e) => handleInputChange('openai', 'apiKey', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openai-organization">Organization ID (optional)</Label>
                    <Input 
                      id="openai-organization" 
                      placeholder="org-..."
                      value={configs.openai.additionalSettings?.organization || ''}
                      onChange={(e) => handleNestedInputChange('openai', 'additionalSettings', 'organization', e.target.value)}
                    />
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      The system will use OpenAI for generating diagnostic suggestions and technical insights.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => handleSaveConfig('openai')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>

          {/* Claude.ai */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                  <div>
                    <CardTitle>Claude AI</CardTitle>
                    <CardDescription>Alternative AI models for specific use cases</CardDescription>
                  </div>
                </div>
                <Switch 
                  checked={configs.claude.enabled}
                  onCheckedChange={() => handleToggleService('claude')}
                />
              </div>
            </CardHeader>
            {configs.claude.enabled && (
              <>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="claude-api-key">API Key</Label>
                    <Input 
                      id="claude-api-key" 
                      type="password"
                      placeholder="Enter Claude API key"
                      value={configs.claude.apiKey}
                      onChange={(e) => handleInputChange('claude', 'apiKey', e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => handleSaveConfig('claude')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>

          {/* Grox */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-orange-500" />
                  <div>
                    <CardTitle>Grox</CardTitle>
                    <CardDescription>Specialized repair diagnostic AI models</CardDescription>
                  </div>
                </div>
                <Switch 
                  checked={configs.grox.enabled}
                  onCheckedChange={() => handleToggleService('grox')}
                />
              </div>
            </CardHeader>
            {configs.grox.enabled && (
              <>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="grox-api-key">API Key</Label>
                    <Input 
                      id="grox-api-key" 
                      type="password"
                      placeholder="Enter Grox API key"
                      value={configs.grox.apiKey}
                      onChange={(e) => handleInputChange('grox', 'apiKey', e.target.value)}
                    />
                  </div>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Grox API is in beta. Contact Grox support for access to their repair-specific AI models.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => handleSaveConfig('grox')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
