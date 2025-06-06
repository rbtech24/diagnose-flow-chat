
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { License, SubscriptionPlan } from "@/types/subscription-consolidated";
import { useSubscriptionStore } from "@/store/subscriptionStore";

interface NewLicenseFormProps {
  onSubmit: (license: License) => void;
  onCancel: () => void;
}

export function NewLicenseForm({
  onSubmit,
  onCancel
}: NewLicenseFormProps) {
  // Use the getActivePlans function from our store
  const { plans, getActivePlans } = useSubscriptionStore();
  const activePlans = getActivePlans();
  
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [planId, setPlanId] = useState("");
  const [activeTechnicians, setActiveTechnicians] = useState("1");
  const [trialPeriod, setTrialPeriod] = useState(
    planId ? activePlans.find(p => p.id === planId)?.trial_period?.toString() || "14" : "14"
  );

  const handlePlanChange = (value: string) => {
    setPlanId(value);
    const plan = activePlans.find(p => p.id === value);
    if (plan) {
      setTrialPeriod(plan.trial_period.toString());
    }
  };

  const handleSubmit = () => {
    const selectedPlan = activePlans.find(p => p.id === planId);
    
    if (!selectedPlan) return;
    
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + parseInt(trialPeriod));
    
    const newLicense: License = {
      id: `license-${Date.now()}`,
      company_id: companyId || `company-${Date.now()}`,
      company_name: companyName,
      plan_id: planId,
      plan_name: selectedPlan.name,
      status: 'trial',
      activeTechnicians: parseInt(activeTechnicians),
      maxTechnicians: selectedPlan.limits.technicians,
      startDate: new Date(),
      trialEndsAt: trialEndDate,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    onSubmit(newLicense);
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          placeholder="Enter company name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="companyId">Company ID (optional)</Label>
        <Input
          id="companyId"
          value={companyId}
          onChange={e => setCompanyId(e.target.value)}
          placeholder="Leave blank to generate automatically"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="plan">Subscription Plan</Label>
        <Select value={planId} onValueChange={handlePlanChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a plan" />
          </SelectTrigger>
          <SelectContent>
            {activePlans.length > 0 ? (
              activePlans.map(plan => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name} (${plan.price_monthly}/month)
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-plans" disabled>
                No active plans available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {activePlans.length === 0 && (
          <p className="text-sm text-red-500 mt-1">
            No active plans available. Please create a plan first.
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="technicians">Number of Technicians</Label>
        <Input
          id="technicians"
          type="number"
          min="1"
          value={activeTechnicians}
          onChange={e => setActiveTechnicians(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="trialPeriod">Trial Period (days)</Label>
        <Input
          id="trialPeriod"
          type="number"
          min="0"
          value={trialPeriod}
          onChange={e => setTrialPeriod(e.target.value)}
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!companyName || !planId || activePlans.length === 0}>
          Create License
        </Button>
      </div>
    </div>
  );
}
