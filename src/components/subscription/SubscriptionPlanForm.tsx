
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { SubscriptionPlan } from "@/types/subscription-consolidated";
import { Trash2, Plus } from "lucide-react";

interface SubscriptionPlanFormProps {
  plan?: SubscriptionPlan;
  onSave: (plan: SubscriptionPlan) => void;
  onCancel: () => void;
}

export function SubscriptionPlanForm({ plan, onSave, onCancel }: SubscriptionPlanFormProps) {
  const [formData, setFormData] = useState<Partial<SubscriptionPlan>>({
    name: plan?.name || "",
    description: plan?.description || "",
    price_monthly: plan?.price_monthly || 0,
    price_yearly: plan?.price_yearly || 0,
    is_active: plan?.is_active ?? true,
    features: plan?.features || {},
    limits: plan?.limits || {
      technicians: 1,
      admins: 1,
      diagnostics_per_day: 10,
      storage_gb: 1,
      workflows: 10,
      api_calls: 1000
    }
  });

  const [featuresArray, setFeaturesArray] = useState<string[]>(
    Array.isArray(plan?.features) ? plan.features : 
    plan?.features && typeof plan.features === 'object' ? Object.keys(plan.features) : []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert features array to SubscriptionFeatures object
    const featuresObject = featuresArray.reduce((acc, feature, index) => {
      acc[`feature_${index}`] = feature;
      return acc;
    }, {} as Record<string, string>);

    onSave({
      id: plan?.id || crypto.randomUUID(),
      created_at: plan?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...formData,
      features: featuresObject
    } as SubscriptionPlan);
  };

  const addFeature = () => {
    setFeaturesArray([...featuresArray, ""]);
  };

  const updateFeature = (index: number, value: string) => {
    const updated = [...featuresArray];
    updated[index] = value;
    setFeaturesArray(updated);
  };

  const removeFeature = (index: number) => {
    setFeaturesArray(featuresArray.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Plan Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price_monthly">Monthly Price</Label>
            <Input
              id="price_monthly"
              type="number"
              step="0.01"
              value={formData.price_monthly}
              onChange={(e) => setFormData({...formData, price_monthly: parseFloat(e.target.value)})}
              required
            />
          </div>
          <div>
            <Label htmlFor="price_yearly">Yearly Price</Label>
            <Input
              id="price_yearly"
              type="number"
              step="0.01"
              value={formData.price_yearly}
              onChange={(e) => setFormData({...formData, price_yearly: parseFloat(e.target.value)})}
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
          />
          <Label htmlFor="is_active">Active Plan</Label>
        </div>

        <div>
          <Label>Features</Label>
          <div className="space-y-2">
            {featuresArray.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Enter feature"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addFeature}>
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </div>

        <div>
          <Label>Limits</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="technicians">Technicians</Label>
              <Input
                id="technicians"
                type="number"
                value={formData.limits?.technicians}
                onChange={(e) => setFormData({
                  ...formData,
                  limits: {...formData.limits!, technicians: parseInt(e.target.value)}
                })}
              />
            </div>
            <div>
              <Label htmlFor="admins">Admins</Label>
              <Input
                id="admins"
                type="number"
                value={formData.limits?.admins}
                onChange={(e) => setFormData({
                  ...formData,
                  limits: {...formData.limits!, admins: parseInt(e.target.value)}
                })}
              />
            </div>
            <div>
              <Label htmlFor="diagnostics_per_day">Diagnostics per Day</Label>
              <Input
                id="diagnostics_per_day"
                type="number"
                value={formData.limits?.diagnostics_per_day}
                onChange={(e) => setFormData({
                  ...formData,
                  limits: {...formData.limits!, diagnostics_per_day: parseInt(e.target.value)}
                })}
              />
            </div>
            <div>
              <Label htmlFor="storage_gb">Storage (GB)</Label>
              <Input
                id="storage_gb"
                type="number"
                value={formData.limits?.storage_gb}
                onChange={(e) => setFormData({
                  ...formData,
                  limits: {...formData.limits!, storage_gb: parseInt(e.target.value)}
                })}
              />
            </div>
            <div>
              <Label htmlFor="workflows">Workflows</Label>
              <Input
                id="workflows"
                type="number"
                value={formData.limits?.workflows}
                onChange={(e) => setFormData({
                  ...formData,
                  limits: {...formData.limits!, workflows: parseInt(e.target.value)}
                })}
              />
            </div>
            <div>
              <Label htmlFor="api_calls">API Calls</Label>
              <Input
                id="api_calls"
                type="number"
                value={formData.limits?.api_calls}
                onChange={(e) => setFormData({
                  ...formData,
                  limits: {...formData.limits!, api_calls: parseInt(e.target.value)}
                })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {plan ? "Update Plan" : "Create Plan"}
        </Button>
      </div>
    </form>
  );
}
