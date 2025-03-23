import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { SubscriptionPlan } from "@/types/subscription";
import { Trash2, Plus } from "lucide-react";

interface SubscriptionPlanFormProps {
  initialData?: SubscriptionPlan | null;
  onSubmit: (plan: SubscriptionPlan) => void;
  onCancel: () => void;
}

export function SubscriptionPlanForm({
  initialData,
  onSubmit,
  onCancel
}: SubscriptionPlanFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [monthlyPrice, setMonthlyPrice] = useState(initialData?.monthlyPrice.toString() || "0");
  const [yearlyPrice, setYearlyPrice] = useState(initialData?.yearlyPrice.toString() || "0");
  const [maxTechnicians, setMaxTechnicians] = useState(initialData?.maxTechnicians.toString() || "5");
  const [maxAdmins, setMaxAdmins] = useState(initialData?.maxAdmins.toString() || "1");
  const [dailyDiagnostics, setDailyDiagnostics] = useState(initialData?.dailyDiagnostics.toString() || "20");
  const [storageLimit, setStorageLimit] = useState(initialData?.storageLimit.toString() || "10");
  const [features, setFeatures] = useState<string[]>(initialData?.features || [
    "Basic AI diagnostics",
    "Mobile app access",
    "Community access",
    "Email support"
  ]);
  const [newFeature, setNewFeature] = useState("");
  const [trialPeriod, setTrialPeriod] = useState(initialData?.trialPeriod.toString() || "30");
  const [isActive, setIsActive] = useState(initialData?.isActive !== false);

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const plan: SubscriptionPlan = {
      id: initialData?.id || `plan-${Date.now()}`,
      name,
      description,
      monthlyPrice: parseFloat(monthlyPrice) || 0,
      yearlyPrice: parseFloat(yearlyPrice) || 0,
      maxTechnicians: parseInt(maxTechnicians) || 1,
      maxAdmins: parseInt(maxAdmins) || 1,
      dailyDiagnostics: parseInt(dailyDiagnostics) || 0,
      storageLimit: parseInt(storageLimit) || 0,
      features,
      trialPeriod: parseInt(trialPeriod) || 30,
      isActive,
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    onSubmit(plan);
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <Label htmlFor="name">Plan Name</Label>
        <Input
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Basic, Professional, Enterprise"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Brief description of this plan"
          className="min-h-[80px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="monthlyPrice">Monthly Price ($)</Label>
          <Input
            id="monthlyPrice"
            type="number"
            min="0"
            step="0.01"
            value={monthlyPrice}
            onChange={e => setMonthlyPrice(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="yearlyPrice">Yearly Price ($)</Label>
          <Input
            id="yearlyPrice"
            type="number"
            min="0"
            step="0.01"
            value={yearlyPrice}
            onChange={e => setYearlyPrice(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxTechnicians">Max Technicians</Label>
          <Input
            id="maxTechnicians"
            type="number"
            min="1"
            value={maxTechnicians}
            onChange={e => setMaxTechnicians(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maxAdmins">Max Admins</Label>
          <Input
            id="maxAdmins"
            type="number"
            min="1"
            value={maxAdmins}
            onChange={e => setMaxAdmins(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dailyDiagnostics">Daily Diagnostics</Label>
          <Input
            id="dailyDiagnostics"
            type="number"
            min="0"
            value={dailyDiagnostics}
            onChange={e => setDailyDiagnostics(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="storageLimit">Storage (GB)</Label>
          <Input
            id="storageLimit"
            type="number"
            min="0"
            value={storageLimit}
            onChange={e => setStorageLimit(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Features</Label>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox id={`feature-${index}`} checked />
              <Label htmlFor={`feature-${index}`} className="flex-1">{feature}</Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFeature(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          
          <div className="flex items-center space-x-2">
            <Input
              value={newFeature}
              onChange={e => setNewFeature(e.target.value)}
              placeholder="Add a feature"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddFeature}
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="trialPeriod">Trial Period (days)</Label>
        <Input
          id="trialPeriod"
          type="number"
          min="0"
          value={trialPeriod}
          onChange={e => setTrialPeriod(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <Label htmlFor="active">Active</Label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </div>
  );
}
