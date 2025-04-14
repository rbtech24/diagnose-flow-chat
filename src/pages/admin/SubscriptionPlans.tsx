import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SubscriptionPlanCard } from '@/components/admin/subscription/SubscriptionPlanCard';
import { Plus, Download, Upload, ArrowUpDown } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';

const initialPlans: SubscriptionPlan[] = [
  {
    id: "1",
    name: "Basic",
    description: "Essential features for small repair businesses",
    price_monthly: 29.99,
    price_yearly: 299.99,
    monthlyPrice: 29.99,
    yearlyPrice: 299.99,
    features: [
      "Up to 3 technicians",
      "Basic diagnostic workflows",
      "Standard knowledge base",
      "Email support"
    ],
    is_active: true,
    isActive: true,
    maxTechnicians: 3,
    max_storage: "5GB",
    trial_period: 30,
    trialPeriod: 30
  },
  {
    id: "2",
    name: "Professional",
    description: "Advanced features for growing businesses",
    price_monthly: 59.99,
    price_yearly: 599.99,
    monthlyPrice: 59.99,
    yearlyPrice: 599.99,
    features: [
      "Up to 10 technicians",
      "Advanced diagnostic workflows",
      "Expanded knowledge base",
      "Priority email and chat support",
      "Offline mode",
      "Basic analytics"
    ],
    is_active: true,
    isActive: true,
    maxTechnicians: 10,
    max_storage: "20GB",
    trial_period: 30,
    trialPeriod: 30
  },
  {
    id: "3",
    name: "Enterprise",
    description: "Complete solution for large service organizations",
    price_monthly: 99.99,
    price_yearly: 999.99,
    monthlyPrice: 99.99,
    yearlyPrice: 999.99,
    features: [
      "Unlimited technicians",
      "Custom diagnostic workflows",
      "Full knowledge base with editing",
      "24/7 priority support",
      "Advanced analytics and reporting",
      "API access",
      "Custom integrations",
      "Dedicated account manager"
    ],
    is_active: true,
    isActive: true,
    maxTechnicians: null,
    max_storage: "100GB",
    trial_period: 30,
    trialPeriod: 30
  }
];

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPlans(initialPlans);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleAddPlan = () => {
    setEditingPlan({
      id: "",
      name: "",
      description: "",
      price_monthly: 0,
      price_yearly: 0,
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [],
      is_active: true,
      isActive: true,
      maxTechnicians: null,
      max_storage: "",
      trial_period: 30,
      trialPeriod: 30
    });
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };

  const handleDeletePlan = (planToDelete: SubscriptionPlan) => {
    setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planToDelete.id));
    toast({
      title: "Plan deleted",
      description: `${planToDelete.name} plan has been deleted.`,
      type: "success"
    });
  };

  const handleSavePlan = (data: SubscriptionPlan) => {
    if (data.id) {
      setPlans(prevPlans => 
        prevPlans.map(plan => plan.id === data.id ? data : plan)
      );
      toast({
        title: "Plan updated",
        description: `${data.name} plan has been updated.`,
        type: "success"
      });
    } else {
      const newPlan = { ...data, id: `plan-${Date.now()}` };
      setPlans(prevPlans => [...prevPlans, newPlan]);
      toast({
        title: "Plan created",
        description: `${data.name} plan has been created.`,
        type: "success"
      });
    }
    setIsDialogOpen(false);
  };

  const handleExportPlans = () => {
    try {
      const dataStr = JSON.stringify(plans, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'subscription-plans.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Plans exported",
        description: "Subscription plans have been exported to JSON.",
        type: "success"
      });
    } catch (error) {
      console.error("Error exporting plans:", error);
      toast({
        title: "Error",
        description: "There was a problem exporting the plans.",
        type: "error",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-[400px] bg-gray-200 rounded-md"></div>
          <div className="h-[400px] bg-gray-200 rounded-md"></div>
          <div className="h-[400px] bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Subscription Plans</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPlans}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAddPlan}>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Plans</TabsTrigger>
          <TabsTrigger value="all">All Plans</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.filter(plan => plan.is_active).map(plan => (
              <SubscriptionPlanCard 
                key={plan.id}
                plan={plan}
                onEdit={handleEditPlan}
                onDelete={handleDeletePlan}
              />
            ))}
            {plans.filter(plan => plan.is_active).length === 0 && (
              <Card className="col-span-3 p-6 flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground">No active plans found.</p>
                <Button variant="outline" className="mt-4" onClick={handleAddPlan}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first plan
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <SubscriptionPlanCard 
                key={plan.id}
                plan={plan}
                onEdit={handleEditPlan}
                onDelete={handleDeletePlan}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="draft" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.filter(plan => !plan.is_active).map(plan => (
              <SubscriptionPlanCard 
                key={plan.id}
                plan={plan}
                onEdit={handleEditPlan}
                onDelete={handleDeletePlan}
              />
            ))}
            {plans.filter(plan => !plan.is_active).length === 0 && (
              <Card className="col-span-3 p-6 flex items-center justify-center">
                <p className="text-muted-foreground">No draft plans found.</p>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
