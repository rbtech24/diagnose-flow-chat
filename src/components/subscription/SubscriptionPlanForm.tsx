
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SubscriptionPlan } from "@/types/subscription";

// Create schema for form validation
const subscriptionPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  monthlyPrice: z.coerce.number().min(0, "Monthly price must be a positive number"),
  yearlyPrice: z.coerce.number().min(0, "Yearly price must be a positive number"),
  trialPeriod: z.coerce.number().min(0, "Trial period must be a positive number"),
  maxTechnicians: z.coerce.number().min(1, "Must allow at least 1 technician"),
  maxAdmins: z.coerce.number().min(1, "Must allow at least 1 admin"),
  dailyDiagnostics: z.coerce.number().min(0, "Must be a positive number"),
  storageLimit: z.coerce.number().min(0, "Must be a positive number"),
  features: z.string().optional(),
  isActive: z.boolean().default(true),
});

type SubscriptionPlanFormValues = z.infer<typeof subscriptionPlanSchema>;

interface SubscriptionPlanFormProps {
  initialData?: SubscriptionPlan;
  onSubmit: (data: SubscriptionPlan) => void;
  onCancel: () => void;
}

export default function SubscriptionPlanForm({ initialData, onSubmit, onCancel }: SubscriptionPlanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: SubscriptionPlanFormValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    monthlyPrice: initialData?.price?.monthly || 0,
    yearlyPrice: initialData?.price?.yearly || 0,
    maxTechnicians: initialData?.limits?.maxTechnicians || 5,
    maxAdmins: initialData?.limits?.maxAdmins || 1,
    dailyDiagnostics: initialData?.limits?.dailyDiagnostics || 10,
    storageLimit: initialData?.limits?.storageLimit || 5,
    features: initialData?.features?.join(", ") || "",
    trialPeriod: initialData?.trialPeriod || 14,
    isActive: initialData?.isActive ?? true,
  };

  const form = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues
  });

  const handleFormSubmit = (values: SubscriptionPlanFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert features string to array
      const featuresArray = values.features 
        ? values.features.split(",").map(feature => feature.trim()).filter(Boolean)
        : [];

      // Transform form data to match SubscriptionPlan type
      const planData: SubscriptionPlan = {
        id: initialData?.id || crypto.randomUUID(),
        name: values.name,
        description: values.description,
        price: {
          monthly: values.monthlyPrice,
          yearly: values.yearlyPrice
        },
        limits: {
          maxTechnicians: values.maxTechnicians,
          maxAdmins: values.maxAdmins,
          dailyDiagnostics: values.dailyDiagnostics,
          storageLimit: values.storageLimit
        },
        features: featuresArray,
        trialPeriod: values.trialPeriod,
        isActive: values.isActive,
        createdAt: initialData?.createdAt || new Date(),
        updatedAt: new Date(),
        billingCycle: initialData?.billingCycle || "monthly"
      };
      
      onSubmit(planData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Plan basics */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Plan Information</h3>
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Basic Plan" {...field} />
                </FormControl>
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
                  <Textarea placeholder="Enter plan description" {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="monthlyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} step={0.01} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="yearlyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yearly Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} step={0.01} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Plan Limits */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Plan Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="maxTechnicians"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Technicians</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxAdmins"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Admins</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dailyDiagnostics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Diagnostics</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="storageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage Limit (GB)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Features</h3>
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features (comma separated)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g. Unlimited diagnostics, Priority support, Custom workflows" 
                    {...field} 
                    rows={3} 
                  />
                </FormControl>
                <FormDescription>
                  Enter features separated by commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Trial and status */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Trial & Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="trialPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trial Period (days)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Active Status
                    </FormLabel>
                    <FormDescription>
                      Make this plan available to customers
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
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
