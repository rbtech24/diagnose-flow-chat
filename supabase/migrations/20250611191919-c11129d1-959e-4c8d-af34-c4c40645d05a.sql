
-- Create RLS policies for subscription_plans table to allow CRUD operations
-- First, let's create policies for different operations

-- Allow authenticated users to read all subscription plans
CREATE POLICY "Anyone can view subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (true);

-- Allow authenticated users to create subscription plans (for admin functions)
CREATE POLICY "Authenticated users can create subscription plans" 
ON public.subscription_plans 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update subscription plans
CREATE POLICY "Authenticated users can update subscription plans" 
ON public.subscription_plans 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to delete subscription plans
CREATE POLICY "Authenticated users can delete subscription plans" 
ON public.subscription_plans 
FOR DELETE 
USING (auth.uid() IS NOT NULL);
