
-- Add support team members table
CREATE TABLE public.support_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'agent', -- 'agent', 'supervisor', 'manager'
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  max_tickets INTEGER DEFAULT 10,
  current_tickets INTEGER DEFAULT 0,
  specializations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add ticket assignments table
CREATE TABLE public.ticket_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES support_team_members(id),
  assigned_by UUID REFERENCES support_team_members(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Add SLA tracking table
CREATE TABLE public.sla_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  priority TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  response_time INTEGER NOT NULL, -- in minutes
  resolution_time INTEGER NOT NULL, -- in minutes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add ticket SLA tracking
CREATE TABLE public.ticket_sla_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  sla_policy_id UUID REFERENCES sla_policies(id),
  response_due_at TIMESTAMP WITH TIME ZONE,
  resolution_due_at TIMESTAMP WITH TIME ZONE,
  first_response_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  response_sla_met BOOLEAN,
  resolution_sla_met BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add support ticket attachments table
CREATE TABLE public.support_ticket_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  message_id UUID REFERENCES support_ticket_messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add email notification preferences
CREATE TABLE public.support_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_created BOOLEAN DEFAULT true,
  ticket_updated BOOLEAN DEFAULT true,
  ticket_assigned BOOLEAN DEFAULT true,
  ticket_resolved BOOLEAN DEFAULT true,
  sla_breach BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add support metrics tracking
CREATE TABLE public.support_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES support_team_members(id),
  metric_date DATE NOT NULL,
  tickets_handled INTEGER DEFAULT 0,
  avg_response_time INTEGER, -- in minutes
  avg_resolution_time INTEGER, -- in minutes
  customer_satisfaction DECIMAL(3,2), -- 0.00 to 5.00
  sla_compliance_rate DECIMAL(5,2), -- percentage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.support_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_sla_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for support team members
CREATE POLICY "Team members can view their company members" ON public.support_team_members
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM technicians WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage team members" ON public.support_team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM technicians 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'company_admin')
      AND company_id = support_team_members.company_id
    )
  );

-- Create RLS policies for ticket assignments
CREATE POLICY "Users can view ticket assignments" ON public.ticket_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM support_tickets st
      JOIN technicians t ON t.company_id = st.company_id
      WHERE st.id = ticket_assignments.ticket_id
      AND t.id = auth.uid()
    )
  );

-- Create RLS policies for SLA policies
CREATE POLICY "Company users can view SLA policies" ON public.sla_policies
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM technicians WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage SLA policies" ON public.sla_policies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM technicians 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'company_admin')
      AND company_id = sla_policies.company_id
    )
  );

-- Create function to auto-assign tickets based on workload
CREATE OR REPLACE FUNCTION assign_ticket_to_best_agent(
  p_ticket_id UUID,
  p_company_id UUID,
  p_priority TEXT DEFAULT 'medium'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_agent_id UUID;
BEGIN
  -- Find the best available agent with lowest current workload
  SELECT id INTO v_agent_id
  FROM support_team_members
  WHERE company_id = p_company_id
  AND is_active = true
  AND current_tickets < max_tickets
  ORDER BY current_tickets ASC, RANDOM()
  LIMIT 1;
  
  IF v_agent_id IS NOT NULL THEN
    -- Create assignment record
    INSERT INTO ticket_assignments (ticket_id, assigned_to, assigned_by)
    VALUES (p_ticket_id, v_agent_id, auth.uid());
    
    -- Update agent's current ticket count
    UPDATE support_team_members 
    SET current_tickets = current_tickets + 1
    WHERE id = v_agent_id;
    
    -- Update ticket assigned_to field
    UPDATE support_tickets 
    SET assigned_to = (SELECT user_id FROM support_team_members WHERE id = v_agent_id)
    WHERE id = p_ticket_id;
  END IF;
  
  RETURN v_agent_id;
END;
$$;

-- Create function to calculate SLA due dates
CREATE OR REPLACE FUNCTION calculate_sla_dates(
  p_ticket_id UUID,
  p_priority TEXT,
  p_company_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sla_policy sla_policies%ROWTYPE;
  v_response_due TIMESTAMP WITH TIME ZONE;
  v_resolution_due TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get SLA policy for priority
  SELECT * INTO v_sla_policy
  FROM sla_policies
  WHERE company_id = p_company_id
  AND priority = p_priority
  AND is_active = true
  LIMIT 1;
  
  IF FOUND THEN
    v_response_due := now() + (v_sla_policy.response_time || ' minutes')::INTERVAL;
    v_resolution_due := now() + (v_sla_policy.resolution_time || ' minutes')::INTERVAL;
    
    INSERT INTO ticket_sla_tracking (
      ticket_id,
      sla_policy_id,
      response_due_at,
      resolution_due_at
    ) VALUES (
      p_ticket_id,
      v_sla_policy.id,
      v_response_due,
      v_resolution_due
    );
  END IF;
END;
$$;

-- Create trigger to auto-assign tickets and set SLA
CREATE OR REPLACE FUNCTION handle_new_support_ticket()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Calculate SLA dates
  PERFORM calculate_sla_dates(NEW.id, NEW.priority, NEW.company_id);
  
  -- Auto-assign if enabled (you can add a company setting for this)
  PERFORM assign_ticket_to_best_agent(NEW.id, NEW.company_id, NEW.priority);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_support_ticket_created
  AFTER INSERT ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_support_ticket();

-- Insert default SLA policies for demonstration
INSERT INTO sla_policies (company_id, name, priority, response_time, resolution_time) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Low Priority SLA', 'low', 480, 2880), -- 8 hours response, 48 hours resolution
  ('11111111-1111-1111-1111-111111111111', 'Medium Priority SLA', 'medium', 240, 1440), -- 4 hours response, 24 hours resolution
  ('11111111-1111-1111-1111-111111111111', 'High Priority SLA', 'high', 60, 480), -- 1 hour response, 8 hours resolution
  ('11111111-1111-1111-1111-111111111111', 'Critical Priority SLA', 'critical', 15, 240); -- 15 minutes response, 4 hours resolution
