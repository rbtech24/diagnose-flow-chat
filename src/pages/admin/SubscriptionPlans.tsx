
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSubscriptionPlans, SubscriptionPlan } from "@/hooks/useSubscriptionPlans";
import { Skeleton } from "@/components/ui/skeleton";
import { SubscriptionPlanDialog } from "@/components/admin/subscription/SubscriptionPlanDialog";
import { SubscriptionPlanCard } from "@/components/admin/subscription/SubscriptionPlanCard";
import { toast } from "@/components/ui/use-toast";

export default function SubscriptionPlans() {
  const { plans, isLoading, createPlan, updatePlan, deletePlan } = useSubscriptionPlans();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const handleAddPlan = () => {
    setEditingPlan(null);
    setDialogOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setDialogOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingPlan) {
        await updatePlan(editingPlan.id, data);
      } else {
        await createPlan({
          name: data.name,
          price_monthly: data.price_monthly,
          price_yearly: data.price_yearly,
          features: data.features,
          is_active: data.is_active,
          description: data.description,
          recommended: data.recommended,
          trial_period: data.trial_period,
          limits: {}
        });
      }
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save subscription plan:", error);
    }
  };

  const handleDeletePlan = async (plan: SubscriptionPlan) => {
    const success = await deletePlan(plan.id);
    if (success) {
      toast({
        title: "Plan Deleted",
        description: `The ${plan.name} plan has been deleted`,
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground">Manage subscription plans and pricing</p>
        </div>
        <Button onClick={handleAddPlan}>
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-6">
              <h3 className="text-lg font-medium mb-2">No subscription plans found</h3>
              <p className="text-muted-foreground mb-4">Add your first subscription plan to get started</p>
              <Button onClick={handleAddPlan}>
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
            </div>
          </CardContent>
        </Card>
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
        onSubmit={onSubmit}
      />
    </div>
  );
}
