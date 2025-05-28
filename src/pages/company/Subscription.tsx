
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BillingCycle } from "@/types/subscription-consolidated";
import { SubscriptionPlanCard } from "@/components/subscription/SubscriptionPlanCard";
import { PaymentForm } from "@/components/subscription/PaymentForm";
import { AlertCircle, Clock, Users, Calendar, CreditCard } from "lucide-react";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export default function CompanySubscription() {
  const { 
    plans, 
    licenses, 
    fetchPlans, 
    fetchLicenses,
    isLoadingPlans,
    isLoadingLicenses
  } = useSubscriptionStore();
  
  const activePlans = plans.filter(plan => plan.is_active);
  
  // For demo purposes, use the first license with company_id "company-2"
  const [currentLicense, setCurrentLicense] = useState(licenses.find(license => license.company_id === "company-2"));
  
  // Load data when component mounts
  useEffect(() => {
    fetchPlans();
    fetchLicenses("company-2");
  }, [fetchPlans, fetchLicenses]);
  
  // Load the license when licenses are available
  useEffect(() => {
    const companyLicense = licenses.find(license => license.company_id === "company-2");
    if (companyLicense) {
      setCurrentLicense(companyLicense);
    }
  }, [licenses]);

  const [selectedPlan, setSelectedPlan] = useState(activePlans.length > 0 ? activePlans[0] : null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentComplete = () => {
    // In a real app, this would process the payment and update the subscription
    setIsPaymentDialogOpen(false);
    setSelectedPlan(null);
  };

  // Calculate days left in trial
  const daysLeft = currentLicense?.trialEndsAt ? 
    Math.max(0, Math.ceil((currentLicense.trialEndsAt.getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : 0;

  if (isLoadingPlans || isLoadingLicenses) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Loading subscription data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-gray-500 mb-6">Manage your subscription plan and billing information</p>

          {currentLicense?.status === 'trial' && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Clock className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-blue-800">Trial Period</AlertTitle>
              <AlertDescription className="text-blue-700">
                Your trial period will end in {daysLeft} days. Please select a subscription plan to continue using the service.
              </AlertDescription>
            </Alert>
          )}

          {currentLicense?.status === 'expired' && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-800">Subscription Expired</AlertTitle>
              <AlertDescription className="text-red-700">
                Your subscription has expired. Please renew to continue using the service.
              </AlertDescription>
            </Alert>
          )}

          {activePlans.length === 0 ? (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <AlertTitle className="text-amber-800">No Plans Available</AlertTitle>
              <AlertDescription className="text-amber-700">
                There are currently no subscription plans available. Please contact support for assistance.
              </AlertDescription>
            </Alert>
          ) : (
            <Tabs defaultValue="monthly" className="mb-6" onValueChange={(value) => setBillingCycle(value as BillingCycle)}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Available Plans</h2>
                <TabsList>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly (Save 15%+)</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="monthly" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activePlans.map((plan) => (
                  <SubscriptionPlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={() => handlePlanSelect(plan)}
                    billingCycle="monthly"
                    isCurrentPlan={currentLicense?.plan_id === plan.id}
                  />
                ))}
              </TabsContent>

              <TabsContent value="yearly" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activePlans.map((plan) => (
                  <SubscriptionPlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={() => handlePlanSelect(plan)}
                    billingCycle="yearly"
                    isCurrentPlan={currentLicense?.plan_id === plan.id}
                  />
                ))}
              </TabsContent>
            </Tabs>
          )}
        </div>

        <div className="w-full lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>Your current plan and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentLicense ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">{currentLicense.plan_name}</span>
                    <Badge className={
                      currentLicense.status === 'active' ? 'bg-green-100 text-green-800' :
                      currentLicense.status === 'trial' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'
                    }>
                      {currentLicense.status.charAt(0).toUpperCase() + currentLicense.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{currentLicense.activeTechnicians} active technicians</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {currentLicense.status === 'trial' ? (
                          <>Trial ends on {currentLicense.trialEndsAt?.toLocaleDateString()}</>
                        ) : currentLicense.status === 'active' ? (
                          <>Renews on {currentLicense.nextPayment?.toLocaleDateString()}</>
                        ) : (
                          <>Expired on {currentLicense.endDate?.toLocaleDateString()}</>
                        )}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No active subscription</p>
                  {activePlans.length > 0 && (
                    <Button className="mt-4" onClick={() => selectedPlan && handlePlanSelect(selectedPlan)}>
                      Select a Plan
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
            {currentLicense && activePlans.length > 0 && (
              <CardFooter>
                <Button className="w-full" onClick={() => {
                  const currentPlan = activePlans.find(p => p.id === currentLicense.plan_id);
                  handlePlanSelect(currentPlan || activePlans[0]);
                }}>
                  {currentLicense.status === 'active' ? 'Change Plan' : 'Subscribe Now'}
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <CreditCard className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-gray-500">No payment history yet</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <PaymentForm
              plan={selectedPlan}
              billingCycle={billingCycle}
              onComplete={handlePaymentComplete}
              onCancel={() => setIsPaymentDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
