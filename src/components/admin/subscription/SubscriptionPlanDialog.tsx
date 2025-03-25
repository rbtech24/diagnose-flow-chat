
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SubscriptionPlan } from "@/hooks/useSubscriptionPlans";

const subscriptionFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price_monthly: z.coerce.number().positive("Monthly price must be positive"),
  price_yearly: z.coerce.number().positive("Yearly price must be positive"),
  features: z.string().transform(value => value.split('\n').filter(Boolean)),
  is_active: z.boolean().default(true),
  description: z.string().optional(),
  recommended: z.boolean().default(false),
  trial_period: z.coerce.number().positive("Trial period must be positive").default(14),
});

// Create a type for the form values *before* Zod transformations
type SubscriptionFormInput = {
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string; // This is a string in the form
  is_active: boolean;
  description?: string;
  recommended: boolean;
  trial_period: number;
};

// This type is for the transformed values after Zod processing
type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

interface SubscriptionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPlan: SubscriptionPlan | null;
  onSubmit: (data: SubscriptionFormValues) => Promise<void>;
}

export function SubscriptionPlanDialog({
  open,
  onOpenChange,
  editingPlan,
  onSubmit
}: SubscriptionPlanDialogProps) {
  // Use the SubscriptionFormInput type for the form
  const form = useForm<SubscriptionFormInput>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      name: "",
      price_monthly: 0,
      price_yearly: 0,
      features: "", // Now this is correct as we're using a string type
      is_active: true,
      description: "",
      recommended: false,
      trial_period: 14,
    },
  });

  useEffect(() => {
    if (editingPlan) {
      const featuresString = Array.isArray(editingPlan.features) 
        ? editingPlan.features.join('\n')
        : '';
      
      form.reset({
        name: editingPlan.name,
        price_monthly: editingPlan.price_monthly,
        price_yearly: editingPlan.price_yearly,
        features: featuresString, // Now this is correct as we're using a string type
        is_active: editingPlan.is_active,
        description: editingPlan.description || '',
        recommended: editingPlan.recommended || false,
        trial_period: editingPlan.trial_period,
      });
    } else {
      form.reset({
        name: "",
        price_monthly: 0,
        price_yearly: 0,
        features: "", // Now this is correct as we're using a string type
        is_active: true,
        description: "",
        recommended: false,
        trial_period: 14,
      });
    }
  }, [editingPlan, form]);

  const handleSubmit = async (data: SubscriptionFormInput) => {
    // The Zod schema will transform the features string to array
    await onSubmit(data as unknown as SubscriptionFormValues);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingPlan ? "Edit Plan" : "Add New Plan"}</DialogTitle>
          <DialogDescription>
            {editingPlan 
              ? "Update the subscription plan details." 
              : "Create a new subscription plan for your customers."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Basic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price_monthly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2">$</span>
                        <Input type="number" min="0" step="0.01" className="pl-7" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price_yearly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yearly Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2">$</span>
                        <Input type="number" min="0" step="0.01" className="pl-7" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="trial_period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trial Period (days)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter features, one per line"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add one feature per line
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Plan description"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-1">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Active
                      </FormLabel>
                      <FormDescription>
                        Plan is available for purchase
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="recommended"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-1">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Recommended
                      </FormLabel>
                      <FormDescription>
                        Highlight this plan
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="submit">
                {editingPlan ? "Update Plan" : "Create Plan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
