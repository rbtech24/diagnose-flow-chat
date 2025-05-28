
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SubscriptionPlan, BillingCycle } from "@/types/subscription-consolidated";
import { CheckCircle2, Edit, Package } from "lucide-react";

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  onSelect?: () => void;
  onEdit?: () => void;
  onToggleStatus?: () => void;
  billingCycle?: BillingCycle;
  isCurrentPlan?: boolean;
  isAdmin?: boolean;
}

export function SubscriptionPlanCard({
  plan,
  onSelect,
  onEdit,
  onToggleStatus,
  billingCycle = "monthly",
  isCurrentPlan = false,
  isAdmin = false
}: SubscriptionPlanCardProps) {
  const price = billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly;
  const savings = plan.price_monthly * 12 - plan.price_yearly;

  return (
    <Card className={`border ${isCurrentPlan ? 'border-blue-400 ring-2 ring-blue-200' : ''} ${!plan.is_active && isAdmin ? 'opacity-70' : ''}`}>
      <CardHeader>
        {isAdmin && (
          <div className="flex justify-between items-center mb-2">
            <Switch
              checked={plan.is_active}
              onCheckedChange={onToggleStatus}
            />
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription className="mt-1">{plan.description}</CardDescription>
          </div>
          <Package className="h-10 w-10 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">${price.toFixed(2)}</span>
            <span className="text-gray-500 ml-1">/{billingCycle}</span>
          </div>
          {billingCycle === "yearly" && (
            <div className="text-green-600 text-sm mt-1">
              Save ${savings.toFixed(2)} per year
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Includes:</p>
          <div className="space-y-1">
            <div className="flex items-start">
              <Badge className="mr-2">Up to {plan.limits.technicians} techs</Badge>
              <Badge>Up to {plan.limits.admins} admins</Badge>
            </div>
            <div className="flex items-start">
              <Badge className="mr-2">{plan.limits.diagnostics_per_day} diagnostics/day</Badge>
              <Badge>{plan.limits.storage_gb} GB storage</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Features:</p>
          <ul className="space-y-1">
            {Object.entries(plan.features).map(([key, value], index) => {
              if (typeof value === 'boolean' && value) {
                const featureName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{featureName}</span>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        {isAdmin ? (
          <div className="w-full text-sm text-gray-500">
            {plan.trial_period}-day trial period
          </div>
        ) : (
          <Button
            className="w-full"
            variant={isCurrentPlan ? "outline" : "default"}
            onClick={onSelect}
            disabled={isCurrentPlan}
          >
            {isCurrentPlan ? "Current Plan" : "Select Plan"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
