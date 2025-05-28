
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SubscriptionPlan, BillingCycle } from "@/types/subscription-consolidated";
import { CheckCircle2, CreditCard, Calendar, Lock } from "lucide-react";

interface PaymentFormProps {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  onComplete: () => void;
  onCancel: () => void;
}

export function PaymentForm({
  plan,
  billingCycle,
  onComplete,
  onCancel
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const price = billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly;
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 1500);
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{plan.name} Plan</h3>
            <p className="text-gray-500 text-sm">{billingCycle === "monthly" ? "Monthly" : "Annual"} billing</p>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">${price.toFixed(2)}</div>
            <p className="text-gray-500 text-sm">
              {billingCycle === "monthly" ? "per month" : "per year"}
            </p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-1">
          <div className="flex items-start text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
            <span>Up to {plan.limits.technicians} technicians & {plan.limits.admins} admins</span>
          </div>
          <div className="flex items-start text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
            <span>{plan.limits.diagnostics_per_day} diagnostics per day</span>
          </div>
          <div className="flex items-start text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
            <span>{plan.limits.storage_gb} GB storage</span>
          </div>
          {Array.isArray(plan.features) && plan.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-start text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
          {Array.isArray(plan.features) && plan.features.length > 3 && (
            <div className="text-sm text-blue-600">+{plan.features.length - 3} more features</div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Payment Details
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              <div className="absolute right-3 top-2.5">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <div className="relative">
                <Input
                  id="expiryDate"
                  value={expiryDate}
                  onChange={e => setExpiryDate(formatExpiryDate(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                <div className="absolute right-3 top-2.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">Security Code</Label>
              <div className="relative">
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  maxLength={4}
                  type="password"
                />
                <div className="absolute right-3 top-2.5">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-2 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || !cardNumber || !cardName || !expiryDate || !cvv}
          className="mb-2 sm:mb-0"
        >
          {isSubmitting ? "Processing..." : `Pay $${price.toFixed(2)}`}
        </Button>
      </div>
      
      <div className="text-center text-xs text-gray-500">
        <Lock className="inline h-3 w-3 mr-1" />
        Secure payment processed by Stripe. We don't store your card details.
      </div>
    </div>
  );
}
