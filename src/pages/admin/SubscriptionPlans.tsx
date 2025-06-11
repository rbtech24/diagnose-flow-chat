import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SubscriptionPlanForm } from "@/components/subscription/SubscriptionPlanForm";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { SubscriptionPlan } from "@/types/subscription-consolidated";
import { Plus, Edit, Users, DollarSign, Settings, Trash2, RefreshCw } from "lucide-react";

export default function AdminSubscriptionPlans() {
  const { 
    plans, 
    fetchPlans, 
    addPlan, 
    updatePlan, 
    deletePlan,
    togglePlanStatus,
    cleanupDuplicatePlans,
    isLoadingPlans 
  } = useSubscriptionStore();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleSavePlan = (planData: SubscriptionPlan) => {
    if (isEditing && selectedPlan) {
      updatePlan(planData);
    } else {
      addPlan(planData);
    }
    setIsFormOpen(false);
    setSelectedPlan(null);
  };

  const handleDeletePlan = (planId: string) => {
    deletePlan(planId);
  };

  const handleToggleStatus = (planId: string) => {
    togglePlanStatus(planId);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedPlan(null);
    setIsEditing(false);
  };

  const handleCleanupDuplicates = async () => {
    await cleanupDuplicatePlans();
  };

  if (isLoadingPlans) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-gray-500">Manage subscription plans and pricing</p>
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Cleanup Duplicates
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cleanup Duplicate Plans</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove duplicate subscription plans from the database, keeping only the earliest created version of each plan. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCleanupDuplicates}>
                  Cleanup Duplicates
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={handleCreatePlan}>
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No subscription plans found</p>
          <p className="text-gray-500 mb-4">Create your first subscription plan to get started</p>
          <Button onClick={handleCreatePlan}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Plan
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.recommended ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">Recommended</Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {plan.name}
                      <Switch
                        checked={plan.is_active}
                        onCheckedChange={() => handleToggleStatus(plan.id)}
                      />
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditPlan(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Subscription Plan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{plan.name}"? This action cannot be undone.
                            Any active licenses using this plan may be affected.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePlan(plan.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Plan
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <div className="text-2xl font-bold">${plan.price_monthly}</div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">${plan.price_yearly}</div>
                    <div className="text-sm text-gray-500">per year</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {plan.limits.technicians} technicians, {plan.limits.admins} admins
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {plan.limits.diagnostics_per_day} diagnostics/day
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {plan.limits.storage_gb} GB storage
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Features:</h4>
                  <div className="space-y-1">
                    {plan.features && typeof plan.features === 'object' && 
                      Object.entries(plan.features).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="text-xs text-gray-600">
                          • {typeof value === 'string' ? value : key.replace(/_/g, ' ')}
                        </div>
                      ))
                    }
                    {plan.features && typeof plan.features === 'object' && 
                      Object.keys(plan.features).length > 3 && (
                        <div className="text-xs text-blue-600">
                          +{Object.keys(plan.features).length - 3} more features
                        </div>
                      )
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Subscription Plan" : "Create New Subscription Plan"}
            </DialogTitle>
          </DialogHeader>
          <SubscriptionPlanForm
            plan={selectedPlan}
            onSave={handleSavePlan}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
