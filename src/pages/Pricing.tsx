
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export function Pricing() {
  // Sample pricing data - in a real app, this would come from the database
  const plans = [
    {
      name: "Basic",
      price: 29,
      description: "Essential diagnostics and support for small operations",
      features: [
        "Up to 5 technicians",
        "20 diagnostics per day",
        "10GB storage",
        "Email support",
        "Basic workflows"
      ],
      recommended: false
    },
    {
      name: "Professional",
      price: 89,
      description: "Advanced features for growing businesses",
      features: [
        "Up to 20 technicians",
        "Unlimited diagnostics",
        "50GB storage",
        "Priority support",
        "Custom workflows",
        "Advanced analytics"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      price: 249,
      description: "Full-featured solution for large organizations",
      features: [
        "Unlimited technicians",
        "Unlimited diagnostics",
        "100GB storage",
        "24/7 priority support",
        "Custom integrations",
        "Dedicated account manager",
        "On-premises deployment option"
      ],
      recommended: false
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground">
          Choose the plan that works best for your business
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan, i) => (
          <Card 
            key={i} 
            className={`flex flex-col ${
              plan.recommended ? 'border-primary shadow-lg' : ''
            }`}
          >
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.recommended ? "default" : "outline"}
              >
                {plan.recommended ? "Start Free Trial" : "Choose Plan"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold mb-3">Need a custom solution?</h2>
        <p className="mb-6">Contact our sales team for a tailored plan that fits your specific requirements</p>
        <Button variant="outline" size="lg">Contact Sales</Button>
      </div>
    </div>
  );
}

export default Pricing;
