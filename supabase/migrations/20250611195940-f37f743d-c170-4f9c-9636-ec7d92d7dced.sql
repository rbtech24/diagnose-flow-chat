
-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Authenticated users can create subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Authenticated users can update subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Authenticated users can delete subscription plans" ON public.subscription_plans;

-- Create new policies that properly handle authentication
-- Allow anyone to view active subscription plans (for public pricing pages)
CREATE POLICY "Anyone can view active subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (is_active = true);

-- Allow authenticated users to view all subscription plans
CREATE POLICY "Authenticated users can view all subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to create subscription plans
CREATE POLICY "Authenticated users can create subscription plans" 
ON public.subscription_plans 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update subscription plans
CREATE POLICY "Authenticated users can update subscription plans" 
ON public.subscription_plans 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to delete subscription plans
CREATE POLICY "Authenticated users can delete subscription plans" 
ON public.subscription_plans 
FOR DELETE 
USING (auth.uid() IS NOT NULL);
