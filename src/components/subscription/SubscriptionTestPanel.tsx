
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { SubscriptionPlan } from "@/types/subscription-consolidated";
import { toast } from "sonner";

export function SubscriptionTestPanel() {
  const { 
    plans, 
    fetchPlans, 
    addPlan, 
    isLoadingPlans 
  } = useSubscriptionStore();

  const [testPlanData, setTestPlanData] = useState({
    name: "Test Plan",
    description: "A test subscription plan",
    price_monthly: 29.99,
    price_yearly: 299.99,
    trial_period: 14
  });

  const handleCreateTestPlan = async () => {
    try {
      console.log('Creating test plan with data:', testPlanData);
      
      const newPlan: SubscriptionPlan = {
        id: crypto.randomUUID(),
        name: testPlanData.name,
        description: testPlanData.description,
        price_monthly: testPlanData.price_monthly,
        price_yearly: testPlanData.price_yearly,
        features: {
          "basic_support": "Email support",
          "dashboard_access": "Basic dashboard",
          "api_access": "Limited API calls"
        },
        limits: {
          technicians: 5,
          admins: 2,
          diagnostics_per_day: 50,
          storage_gb: 10,
          workflows: 20,
          api_calls: 5000
        },
        is_active: true,
        recommended: false,
        trial_period: testPlanData.trial_period,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('About to call addPlan with:', newPlan);
      await addPlan(newPlan);
      console.log('addPlan completed, now refreshing plans...');
      
      // Wait a moment then refresh to ensure we see the new plan
      setTimeout(async () => {
        await fetchPlans();
        console.log('Plans refreshed after creation');
      }, 1000);
      
      toast.success('Test plan created successfully!');
    } catch (error) {
      console.error('Error creating test plan:', error);
      toast.error(`Failed to create test plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleRefreshPlans = async () => {
    try {
      console.log('Manually refreshing plans...');
      const refreshedPlans = await fetchPlans();
      console.log('Refreshed plans:', refreshedPlans);
      toast.success('Plans refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing plans:', error);
      toast.error(`Failed to refresh plans: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleClearPlans = () => {
    console.log('Current plans in store:', plans);
    toast.info(`Found ${plans.length} plans in store`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription System Test Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="planName">Plan Name</Label>
            <Input
              id="planName"
              value={testPlanData.name}
              onChange={(e) => setTestPlanData({...testPlanData, name: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="planDescription">Description</Label>
            <Input
              id="planDescription"
              value={testPlanData.description}
              onChange={(e) => setTestPlanData({...testPlanData, description: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthlyPrice">Monthly Price</Label>
              <Input
                id="monthlyPrice"
                type="number"
                step="0.01"
                value={testPlanData.price_monthly}
                onChange={(e) => setTestPlanData({...testPlanData, price_monthly: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="yearlyPrice">Yearly Price</Label>
              <Input
                id="yearlyPrice"
                type="number"
                step="0.01"
                value={testPlanData.price_yearly}
                onChange={(e) => setTestPlanData({...testPlanData, price_yearly: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleCreateTestPlan} disabled={isLoadingPlans}>
              Create Test Plan
            </Button>
            <Button variant="outline" onClick={handleRefreshPlans} disabled={isLoadingPlans}>
              Refresh Plans
            </Button>
            <Button variant="secondary" onClick={handleClearPlans}>
              Debug Plans
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Plans ({plans.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingPlans ? (
            <p>Loading plans...</p>
          ) : plans.length === 0 ? (
            <p className="text-muted-foreground">No plans found. Try creating a test plan above.</p>
          ) : (
            <div className="space-y-2">
              {plans.map((plan) => (
                <div key={plan.id} className="p-3 border rounded">
                  <div className="font-medium">{plan.name}</div>
                  <div className="text-sm text-muted-foreground">{plan.description}</div>
                  <div className="text-sm">
                    ${plan.price_monthly}/month • ${plan.price_yearly}/year
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Status: {plan.is_active ? 'Active' : 'Inactive'} • 
                    Trial: {plan.trial_period} days • 
                    ID: {plan.id.substring(0, 8)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
