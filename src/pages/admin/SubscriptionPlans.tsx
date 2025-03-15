
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { SubscriptionPlanCard } from "@/components/subscription/SubscriptionPlanCard";
import { SubscriptionPlanForm } from "@/components/subscription/SubscriptionPlanForm";
import { SubscriptionPlan } from "@/types/subscription";
import { Plus, Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminSubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const { toast } = useToast();

  const handleCreatePlan = (plan: SubscriptionPlan) => {
    setPlans([...plans, plan]);
    setIsDialogOpen(false);
    setEditingPlan(null);
    toast({
      title: "Plan created",
      description: `${plan.name} plan has been created successfully.`,
    });
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };

  const handleUpdatePlan = (updatedPlan: SubscriptionPlan) => {
    const updatedPlans = plans.map(p => 
      p.id === updatedPlan.id ? updatedPlan : p
    );
    setPlans(updatedPlans);
    setIsDialogOpen(false);
    setEditingPlan(null);
    toast({
      title: "Plan updated",
      description: `${updatedPlan.name} plan has been updated successfully.`,
    });
  };

  const handleTogglePlanStatus = (planId: string) => {
    const updatedPlans = plans.map(plan => 
      plan.id === planId ? { ...plan, isActive: !plan.isActive, updatedAt: new Date() } : plan
    );
    setPlans(updatedPlans);
    
    const plan = updatedPlans.find(p => p.id === planId);
    if (plan) {
      toast({
        title: plan.isActive ? "Plan activated" : "Plan deactivated",
        description: `${plan.name} plan has been ${plan.isActive ? "activated" : "deactivated"}.`,
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-gray-500">Create and manage subscription plans</p>
        </div>
        <Button onClick={() => { setEditingPlan(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Plan
        </Button>
      </div>

      <Separator className="my-6" />

      {plans.length === 0 ? (
        <div className="text-center py-16">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold">No Plans Created</h2>
          <p className="mt-2 text-gray-500">Get started by creating your first subscription plan.</p>
          <Button className="mt-4" onClick={() => { setEditingPlan(null); setIsDialogOpen(true); }}>
            Create First Plan
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              onEdit={() => handleEditPlan(plan)}
              onToggleStatus={() => handleTogglePlanStatus(plan.id)}
              isAdmin={true}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
          </DialogHeader>
          <SubscriptionPlanForm
            initialData={editingPlan}
            onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
