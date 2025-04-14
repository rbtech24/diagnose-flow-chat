
import { useState } from "react";
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentForm } from "@/components/subscription/PaymentForm";
import { LicenseCard } from "@/components/subscription/LicenseCard";
import { Clock, Package, Download, CreditCard, Users, CheckCircle } from "lucide-react";

export default function Subscription() {
  const { toast } = useToast();
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  
  // Mock subscription data
  const [subscription, setSubscription] = useState({
    plan: "Professional",
    status: "active",
    renewalDate: "2023-12-15",
    cost: "$59.99",
    billingCycle: "monthly",
    paymentMethod: {
      type: "credit_card",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2024
    },
    features: [
      "Up to 10 technicians",
      "Advanced diagnostic workflows",
      "Expanded knowledge base",
      "Priority email and chat support",
      "Offline mode",
      "Basic analytics"
    ],
    technicians: {
      allocated: 10,
      used: 6
    },
    storage: {
      allocated: "20GB",
      used: "8.2GB"
    }
  });
  
  const [licenses, setLicenses] = useState([
    {
      id: "lic-123",
      name: "John Smith",
      email: "john@acmerepair.com",
      role: "Technician",
      status: "active",
      activatedOn: "2023-01-15"
    },
    {
      id: "lic-124",
      name: "Jane Doe",
      email: "jane@acmerepair.com",
      role: "Technician",
      status: "active",
      activatedOn: "2023-02-10"
    },
    {
      id: "lic-125",
      name: "Michael Johnson",
      email: "michael@acmerepair.com",
      role: "Technician",
      status: "active",
      activatedOn: "2023-03-05"
    },
    {
      id: "lic-126",
      name: "Sarah Williams",
      email: "sarah@acmerepair.com",
      role: "Technician",
      status: "inactive",
      activatedOn: "2023-04-20"
    },
    {
      id: "lic-127",
      name: "David Brown",
      email: "david@acmerepair.com",
      role: "Technician",
      status: "active",
      activatedOn: "2023-05-12"
    },
    {
      id: "lic-128",
      name: "Emily Davis",
      email: "emily@acmerepair.com",
      role: "Technician",
      status: "active",
      activatedOn: "2023-06-08"
    }
  ]);
  
  const handleUpgradePlan = () => {
    setIsUpgradeDialogOpen(false);
    // Simulate API call to update subscription
    setTimeout(() => {
      setSubscription(prev => ({
        ...prev,
        plan: "Enterprise",
        cost: "$99.99",
        features: [
          "Unlimited technicians",
          "Custom diagnostic workflows",
          "Full knowledge base with editing",
          "24/7 priority support",
          "Advanced analytics and reporting",
          "API access",
          "Custom integrations",
          "Dedicated account manager"
        ],
        technicians: {
          allocated: null, // unlimited
          used: 6
        },
        storage: {
          allocated: "100GB",
          used: "8.2GB"
        }
      }));
      
      toast({
        title: "Subscription updated",
        description: "Your subscription has been updated.",
        type: "success"
      });
    }, 1000);
  };
  
  const handleUpdatePaymentMethod = () => {
    setIsPaymentDialogOpen(false);
    // Simulate API call to update payment method
    setTimeout(() => {
      setSubscription(prev => ({
        ...prev,
        paymentMethod: {
          type: "credit_card",
          last4: "1234",
          expiryMonth: 10,
          expiryYear: 2025
        }
      }));
      
      toast({
        title: "Payment processed",
        description: "Your payment has been processed successfully.",
        type: "success"
      });
    }, 1000);
  };

  const handleCancelSubscription = () => {
    setIsCancelDialogOpen(false);
    // Simulate API call to cancel subscription
    setTimeout(() => {
      setSubscription(prev => ({
        ...prev,
        status: "cancelled",
        renewalDate: "N/A"
      }));
      
      toast({
        title: "License updated",
        description: "Your license has been updated successfully.",
        type: "success"
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Subscription Management</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{subscription.plan} Plan</span>
              <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'} className="capitalize">
                {subscription.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              Your current subscription plan and details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Billing Cycle</p>
                <p className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{subscription.billingCycle}</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Next Renewal</p>
                <p className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{subscription.renewalDate !== 'N/A' ? new Date(subscription.renewalDate).toLocaleDateString() : 'N/A'}</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Cost</p>
                <p className="flex items-center">
                  <CreditCard className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{subscription.cost}/{subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Plan Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4">
                {subscription.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Technician Licenses</h3>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Used</span>
                  <span className="text-sm font-medium">
                    {subscription.technicians.used} / {subscription.technicians.allocated || '∞'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: subscription.technicians.allocated ? 
                        `${(subscription.technicians.used / subscription.technicians.allocated) * 100}%` : 
                        '20%'
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Storage</h3>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Used</span>
                  <span className="text-sm font-medium">
                    {subscription.storage.used} / {subscription.storage.allocated}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(parseFloat(subscription.storage.used) / parseFloat(subscription.storage.allocated)) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Package className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upgrade Subscription</DialogTitle>
                  <DialogDescription>
                    Choose a new plan for your subscription
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="rounded-lg border p-4 cursor-pointer hover:border-primary">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Enterprise Plan</h3>
                        <p className="text-sm text-muted-foreground">$99.99/month</p>
                      </div>
                      <Badge>Recommended</Badge>
                    </div>
                    <ul className="mt-2 text-sm space-y-1">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Unlimited technicians
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Custom workflows
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        24/7 priority support
                      </li>
                    </ul>
                  </div>
                  <Button onClick={handleUpgradePlan}>
                    Confirm Upgrade
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Update Payment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Payment Method</DialogTitle>
                  <DialogDescription>
                    Enter your new payment details
                  </DialogDescription>
                </DialogHeader>
                <PaymentForm onSubmit={handleUpdatePaymentMethod} />
              </DialogContent>
            </Dialog>
            
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full sm:w-auto">
                  Cancel Subscription
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Subscription</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing cycle.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-3 pt-4">
                  <Button variant="destructive" onClick={handleCancelSubscription}>
                    Yes, Cancel My Subscription
                  </Button>
                  <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                    No, Keep My Subscription
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Your current payment details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Credit Card</p>
                    <p className="text-sm text-muted-foreground">
                      **** **** **** {subscription.paymentMethod.last4}
                    </p>
                  </div>
                </div>
                <Badge>Primary</Badge>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Expires {subscription.paymentMethod.expiryMonth}/{subscription.paymentMethod.expiryYear}
              </div>
            </div>
            
            <Button variant="outline" className="w-full" onClick={() => setIsPaymentDialogOpen(true)}>
              Update Payment Method
            </Button>
            
            <Button variant="ghost" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="licenses">
        <TabsList>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>
        <TabsContent value="licenses" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>License Management</CardTitle>
                <Button size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Add License
                </Button>
              </div>
              <CardDescription>
                Manage your technician licenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {licenses.map(license => (
                  <LicenseCard 
                    key={license.id}
                    license={license}
                    onActivate={() => {
                      // Handle activation logic
                    }}
                    onDeactivate={() => {
                      // Handle deactivation logic
                    }}
                    onDelete={() => {
                      // Handle deletion logic
                      setLicenses(licenses.filter(l => l.id !== license.id));
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View your past invoices and payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        Nov 15, 2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        $59.99
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant="outline" className="text-green-600 bg-green-50">Paid</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        Oct 15, 2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        $59.99
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant="outline" className="text-green-600 bg-green-50">Paid</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        Sep 15, 2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        $59.99
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant="outline" className="text-green-600 bg-green-50">Paid</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Calendar icon component
function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
