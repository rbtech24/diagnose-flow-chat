
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SubscriptionPlan, BillingCycle } from "@/types/subscription";
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
  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const savings = plan.monthlyPrice * 12 - plan.yearlyPrice;

  return (
    <Card className={`border ${isCurrentPlan ? 'border-blue-400 ring-2 ring-blue-200' : ''} ${!plan.isActive && isAdmin ? 'opacity-70' : ''}`}>
      <CardHeader>
        {isAdmin && (
          <div className="flex justify-between items-center mb-2">
            <Switch
              checked={plan.isActive}
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
              <Badge className="mr-2">Up to {plan.maxTechnicians} techs</Badge>
              <Badge>Up to {plan.maxAdmins} admins</Badge>
            </div>
            <div className="flex items-start">
              <Badge className="mr-2">{plan.dailyDiagnostics} diagnostics/day</Badge>
              <Badge>{plan.storageLimit} GB storage</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Features:</p>
          <ul className="space-y-1">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        {isAdmin ? (
          <div className="w-full text-sm text-gray-500">
            {plan.trialPeriod}-day trial period
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
