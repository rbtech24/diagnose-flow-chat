
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useSubscriptions } from '@/hooks/useSubscriptions';

export function Pricing() {
  const navigate = useNavigate();
  const { plans, isLoading } = useSubscriptions();

  const handleSelectPlan = (planId: string) => {
    navigate('/signup', { state: { selectedPlan: planId } });
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Choose the Right Plan</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Select the plan that best fits your business needs. All plans include a free trial period.
        </p>
      </div>

      {isLoading.plans ? (
        <div className="flex justify-center">
          <p>Loading plans...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={plan.name === 'Professional' ? 'border-primary shadow-lg' : ''}>
              <CardHeader>
                {plan.name === 'Professional' && (
                  <div className="bg-primary text-primary-foreground text-xs font-bold tracking-wide uppercase py-1 px-3 rounded-full mb-3 inline-block">
                    Most Popular
                  </div>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">${plan.monthlyPrice}</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSelectPlan(plan.id)} 
                  className="w-full" 
                  variant={plan.name === 'Professional' ? 'default' : 'outline'}
                >
                  Start {plan.trialPeriod}-Day Free Trial
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Need a Custom Plan?</h2>
        <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
          Contact our sales team to discuss custom solutions for your enterprise needs.
        </p>
        <Button variant="outline" onClick={() => navigate('/contact')}>
          Contact Sales
        </Button>
      </div>
    </div>
  );
}
