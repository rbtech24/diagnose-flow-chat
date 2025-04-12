
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, DownloadCloud, Upload } from "lucide-react";
import { SubscriptionPlanDialog } from "@/components/admin/subscription/SubscriptionPlanDialog";
import { SubscriptionPlanCard } from "@/components/admin/subscription/SubscriptionPlanCard";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionPlan } from "@/hooks/useSubscriptionPlans";

// Placeholder data for subscription plans
const initialPlans: SubscriptionPlan[] = [
  {
    id: "1",
    name: "Basic",
    price_monthly: 49,
    price_yearly: 470,
    features: ["Up to 5 technicians", "Basic diagnostics", "Email support"],
    is_active: true,
    description: "Perfect for small repair businesses",
    recommended: false,
    trial_period: 30
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
    trial_period: 30
  },
  {
    id: "3",
    name: "Enterprise",
    price_monthly: 199,
    price_yearly: 1900,
    features: ["Unlimited technicians", "All features", "24/7 support", "Dedicated account manager", "Custom integrations"],
    is_active: false,
    description: "For large organizations with complex needs",
    recommended: false,
    trial_period: 30
  }
];

export default function AdminSubscriptionPlans() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    // In a real app, we would fetch the plans from an API
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPlans(initialPlans);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddPlan = () => {
    setEditingPlan(null);
    setDialogOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setDialogOpen(true);
  };

  const handleDeletePlan = (plan: SubscriptionPlan) => {
    // In a real app, we would call an API to delete the plan
    setPlans(plans.filter(p => p.id !== plan.id));
    toast({
      title: "Plan deleted",
      description: `${plan.name} plan has been deleted.`,
    });
  };

  const handleSubmitPlan = async (data: any) => {
    try {
      if (editingPlan) {
        // Update existing plan
        const updatedPlans = plans.map(p => 
          p.id === editingPlan.id ? { ...data, id: editingPlan.id } : p
        );
        setPlans(updatedPlans);
        toast({
          title: "Plan updated",
          description: `${data.name} plan has been updated.`,
        });
      } else {
        // Add new plan
        const newPlan = {
          ...data,
          id: `plan-${Date.now()}`, // Generate a unique ID
        };
        setPlans([...plans, newPlan]);
        toast({
          title: "Plan created",
          description: `${data.name} plan has been created.`,
        });
      }
      setDialogOpen(false);
    } catch (error) {
      console.error("Error submitting plan:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the plan.",
        variant: "destructive",
      });
    }
  };

  const handleExportPlans = () => {
    const dataStr = JSON.stringify(plans, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'subscription-plans.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Plans exported",
      description: "Subscription plans have been exported to JSON.",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground">Manage your subscription plans and pricing</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportPlans}>
            <DownloadCloud className="h-4 w-4 mr-2" />
            Export Plans
          </Button>
          <Button onClick={handleAddPlan}>
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-96 animate-pulse">
              <CardHeader className="bg-gray-100" />
              <CardContent className="pt-6 space-y-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-6 bg-gray-100 rounded" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
            />
          ))}
        </div>
      )}

      <SubscriptionPlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingPlan={editingPlan}
        onSubmit={handleSubmitPlan}
      />
    </div>
  );
}
