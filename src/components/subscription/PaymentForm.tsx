
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, DollarSign, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { SubscriptionPlan, BillingCycle } from "@/types/subscription-consolidated";
import { StripeService } from "@/services/stripeService";
import { processHelcimPayment } from "@/utils/api/helcim";
import { useAPIConfigStore } from "@/store/apiConfigStore";

interface PaymentFormProps {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  onComplete: () => void;
  onCancel: () => void;
}

export function PaymentForm({ plan, billingCycle, onComplete, onCancel }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'helcim'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const { configs } = useAPIConfigStore();
  const isHelcimEnabled = configs.helcim.enabled && configs.helcim.apiKey;
  const isStripeEnabled = configs.stripe.enabled && configs.stripe.apiKey;

  const amount = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
  const savings = billingCycle === 'yearly' ? 
    Math.round(((plan.price_monthly * 12) - plan.price_yearly) / (plan.price_monthly * 12) * 100) : 0;

  const handleStripePayment = async () => {
    try {
      setIsProcessing(true);
      const session = await StripeService.createCheckoutSession(plan.id, billingCycle);
      
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHelcimPayment = async () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      toast.error('Please fill in all card details');
      return;
    }

    try {
      setIsProcessing(true);
      
      const result = await processHelcimPayment(
        amount,
        cardDetails.number,
        cardDetails.expiry,
        cardDetails.cvv,
        plan.id,
        billingCycle
      );

      if (result.success) {
        toast.success('Payment successful! Your subscription has been activated.');
        onComplete();
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      console.error('Helcim payment error:', error);
      toast.error('Payment failed. Please check your card details and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'stripe') {
      await handleStripePayment();
    } else if (paymentMethod === 'helcim') {
      await handleHelcimPayment();
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Order Summary
          </CardTitle>
          <CardDescription>Review your subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">{plan.name} Plan</span>
            <Badge variant="secondary">{billingCycle}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Subtotal</span>
            <span>${amount.toFixed(2)}</span>
          </div>
          
          {savings > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span>Annual savings ({savings}%)</span>
              <span>-${((plan.price_monthly * 12) - plan.price_yearly).toFixed(2)}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total</span>
            <span>${amount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {(isStripeEnabled || isHelcimEnabled) ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
            <CardDescription>Choose your preferred payment method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={(value: 'stripe' | 'helcim') => setPaymentMethod(value)}>
              {isStripeEnabled && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer">
                    <div className="text-sm font-medium">Stripe</div>
                    <Badge variant="outline">Secure Checkout</Badge>
                  </Label>
                </div>
              )}
              
              {isHelcimEnabled && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="helcim" id="helcim" />
                  <Label htmlFor="helcim" className="flex items-center gap-2 cursor-pointer">
                    <div className="text-sm font-medium">Helcim</div>
                    <Badge variant="outline">Direct Payment</Badge>
                  </Label>
                </div>
              )}
            </RadioGroup>

            {paymentMethod === 'helcim' && (
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                      maxLength={5}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No payment methods are currently configured. Please contact your administrator to set up payment processing.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        
        <Button 
          type="submit" 
          disabled={isProcessing || (!isStripeEnabled && !isHelcimEnabled)}
          className="flex-1"
        >
          {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
}
