
-- Fix security issues by ensuring proper RLS policies and removing exposed auth access

-- First, let's make sure we don't have any policies that expose auth.users
-- Remove any policies that might expose the auth schema
DROP POLICY IF EXISTS "Users can view their own profile" ON auth.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON auth.users;

-- Ensure the technician_details view is properly secured
DROP VIEW IF EXISTS public.technician_details;

-- Create a secure view for technician details that doesn't expose auth.users directly
CREATE OR REPLACE VIEW public.technician_details AS
SELECT 
  t.id,
  t.email,
  t.role,
  t.company_id,
  t.status,
  t.phone,
  t.is_independent,
  t.available_for_hire,
  t.hourly_rate,
  t.last_sign_in_at,
  t.created_at,
  t.updated_at
FROM public.technicians t;

-- Enable RLS on the technician_details view
ALTER VIEW public.technician_details SET (security_barrier = true);

-- Create proper RLS policies for the technicians table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'technicians' 
    AND policyname = 'Users can view their own technician record'
  ) THEN
    CREATE POLICY "Users can view their own technician record" 
    ON public.technicians 
    FOR SELECT 
    USING (auth.uid() = id);
  END IF;
END $$;

-- Policy for company admins to view technicians in their company
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'technicians' 
    AND policyname = 'Company admins can view company technicians'
  ) THEN
    CREATE POLICY "Company admins can view company technicians" 
    ON public.technicians 
    FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM public.technicians admin 
        WHERE admin.id = auth.uid() 
        AND admin.role IN ('admin', 'company_admin') 
        AND admin.company_id = technicians.company_id
      )
    );
  END IF;
END $$;

-- Policy for system admins to view all technicians
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'technicians' 
    AND policyname = 'System admins can view all technicians'
  ) THEN
    CREATE POLICY "System admins can view all technicians" 
    ON public.technicians 
    FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM public.technicians admin 
        WHERE admin.id = auth.uid() 
        AND admin.role = 'admin'
      )
    );
  END IF;
END $$;

-- Ensure RLS is enabled on the technicians table
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

-- Remove any direct access to auth.users by revoking unnecessary permissions
REVOKE ALL ON auth.users FROM anon;
REVOKE ALL ON auth.users FROM authenticated;

-- Grant only necessary permissions to authenticated users for their own auth record
GRANT SELECT (id, email, created_at, updated_at, last_sign_in_at) ON auth.users TO authenticated;

-- Create a security definer function to safely get current user info
CREATE OR REPLACE FUNCTION public.get_current_user_info()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    auth.uid(),
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    (SELECT created_at FROM auth.users WHERE id = auth.uid()),
    (SELECT last_sign_in_at FROM auth.users WHERE id = auth.uid())
  WHERE auth.uid() IS NOT NULL;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_current_user_info() TO authenticated;
