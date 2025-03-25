
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { SubscriptionPlan } from "@/hooks/useSubscriptionPlans";
import { format, addDays } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Placeholder data for the company's subscription
const companySubscription = {
  planId: "2", // Professional plan
  status: "active",
  startDate: new Date(2023, 9, 15),
  endDate: new Date(2024, 9, 15),
  paymentMethod: "Credit Card (ending in 4242)",
  autoRenew: true,
};

// Placeholder data for subscription plans
const plans: SubscriptionPlan[] = [
  {
    id: "1",
    name: "Basic",
    price_monthly: 49,
    price_yearly: 470,
    features: ["Up to 5 technicians", "Basic diagnostics", "Email support"],
    is_active: true,
    description: "Perfect for small repair businesses",
    recommended: false,
    trial_period: 14
  },
  {
    id: "2",
    name: "Professional",
    price_monthly: 99,
    price_yearly: 950,
    features: ["Up to 15 technicians", "Advanced diagnostics", "Priority support", "Custom workflows"],
    is_active: true,
    description: "Ideal for growing businesses",
    recommended: true,
    trial_period: 14
  },
  {
    id: "3",
    name: "Enterprise",
    price_monthly: 199,
    price_yearly: 1900,
    features: ["Unlimited technicians", "All features", "24/7 support", "Dedicated account manager", "Custom integrations"],
    is_active: true,
    description: "For large organizations with complex needs",
    recommended: false,
    trial_period: 14
  }
];

export default function CompanySubscription() {
  const { toast } = useToast();
  const [subscription, setSubscription] = useState(companySubscription);
  const [isLoading, setIsLoading] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>(plans);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  // Get the current plan from the available plans
  const currentPlan = availablePlans.find(plan => plan.id === subscription.planId);

  const handleChangePlan = (planId: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubscription({
        ...subscription,
        planId,
      });
      setIsLoading(false);
      toast({
        title: "Plan changed",
        description: "Your subscription plan has been updated.",
      });
    }, 1000);
  };

  const handleToggleAutoRenew = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubscription({
        ...subscription,
        autoRenew: !subscription.autoRenew,
      });
      setIsLoading(false);
      toast({
        title: "Auto-renew setting updated",
        description: `Auto-renew is now ${!subscription.autoRenew ? "enabled" : "disabled"}.`,
      });
    }, 1000);
  };

  const handleChangeBillingCycle = (cycle: "monthly" | "yearly") => {
    setBillingCycle(cycle);
    toast({
      title: "Billing preference updated",
      description: `You'll now see ${cycle} pricing.`,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and billing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Your subscription details and current plan information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h3 className="text-xl font-bold">{currentPlan?.name || "No Plan"}</h3>
                <p className="text-muted-foreground">
                  {currentPlan?.description || "No active subscription"}
                </p>
              </div>
              <Badge variant="outline" className="mt-2 sm:mt-0 w-fit">
                {subscription.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Billing Cycle</p>
                <p className="font-medium">Yearly</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium">
                  ${currentPlan?.price_yearly} / year
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Billing Date</p>
                <p className="font-medium">
                  {format(subscription.endDate, "MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{subscription.paymentMethod}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-6">
              <Button variant="outline" onClick={() => handleToggleAutoRenew()} disabled={isLoading}>
                {subscription.autoRenew ? "Disable Auto-Renew" : "Enable Auto-Renew"}
              </Button>
              <Button variant="outline" asChild>
                <a href="/company/billing-history">View Billing History</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/company/update-payment">Update Payment Method</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your subscription settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="font-medium">Auto-Renew</p>
              <Badge variant={subscription.autoRenew ? "outline" : "destructive"}>
                {subscription.autoRenew ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Subscription Status</p>
              <Badge variant="outline">{subscription.status}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Billing Cycle</p>
              <Badge variant="outline">Yearly</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" variant="outline" asChild>
              <a href="/company/download-invoices">
                Download Invoices
              </a>
            </Button>
            <Button className="w-full" variant="default" asChild>
              <a href="/company/contact-support">
                Contact Support
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {subscription.autoRenew === false && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Auto-Renew Disabled</AlertTitle>
          <AlertDescription>
            Your subscription will expire on {format(subscription.endDate, "MMMM d, yyyy")}. 
            Enable auto-renew to continue using the service.
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Choose the plan that works best for your business
          </p>
          <div className="flex items-center space-x-2">
            <Button 
              variant={billingCycle === "monthly" ? "default" : "outline"} 
              size="sm"
              onClick={() => handleChangeBillingCycle("monthly")}
            >
              Monthly
            </Button>
            <Button 
              variant={billingCycle === "yearly" ? "default" : "outline"} 
              size="sm"
              onClick={() => handleChangeBillingCycle("yearly")}
            >
              Yearly (Save 20%)
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availablePlans.filter(plan => plan.is_active).map((plan) => (
            <Card 
              key={plan.id} 
              className={plan.recommended ? "border-primary" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.recommended && (
                    <Badge className="bg-primary">Recommended</Badge>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-3xl font-bold">
                    ${billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly}
                  </span>
                  <span className="text-muted-foreground">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  variant={plan.id === subscription.planId ? "outline" : "default"}
                  disabled={plan.id === subscription.planId || isLoading}
                  onClick={() => handleChangePlan(plan.id)}
                >
                  {plan.id === subscription.planId ? "Current Plan" : "Upgrade"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing FAQs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">How do I change my billing cycle?</h3>
            <p className="text-muted-foreground">
              You can change your billing cycle from monthly to yearly or vice versa at the end of your current billing period. Contact support for assistance.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">What happens when I upgrade my plan?</h3>
            <p className="text-muted-foreground">
              When you upgrade, you'll be charged the prorated amount for the remaining time in your current billing cycle. You'll get immediate access to the new plan's features.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">What happens if I cancel my subscription?</h3>
            <p className="text-muted-foreground">
              If you cancel, your subscription will remain active until the end of your current billing period. After that, you'll lose access to the premium features.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
