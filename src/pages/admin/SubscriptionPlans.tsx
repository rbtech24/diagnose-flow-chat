
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, CheckCheck, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function SubscriptionPlans() {
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState([
    { 
      id: "1", 
      name: "Basic", 
      price: 9.99, 
      interval: "month",
      features: ["5 technicians", "Core diagnostics", "Standard support"],
      isActive: true 
    },
    { 
      id: "2", 
      name: "Professional", 
      price: 24.99, 
      interval: "month",
      features: ["20 technicians", "Advanced diagnostics", "Priority support", "API access"],
      isActive: true 
    },
    { 
      id: "3", 
      name: "Enterprise", 
      price: 99.99, 
      interval: "month",
      features: ["Unlimited technicians", "All diagnostics", "24/7 support", "API access", "Custom integrations"],
      isActive: true 
    },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddPlan = () => {
    // Logic to add a new subscription plan
    console.log("Add new subscription plan");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <Badge variant={plan.isActive ? "default" : "outline"} className="mb-2 w-fit">
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription className="text-2xl font-bold">
                  {formatPrice(plan.price)}/{plan.interval}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCheck className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex-col space-y-2 pt-6">
                <Separator className="mb-4" />
                <div className="flex w-full gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
