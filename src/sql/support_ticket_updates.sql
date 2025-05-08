
-- Add this migration script to your project and run it to support the new features

-- First, ensure support_ticket_messages table has attachment column
ALTER TABLE support_ticket_messages ADD COLUMN IF NOT EXISTS attachments JSONB;

-- Create a table for ticket assignments tracking
CREATE TABLE IF NOT EXISTS ticket_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id),
  assigned_to UUID NOT NULL,
  assigned_by UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a storage bucket for ticket attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('support-attachments', 'support-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Add policies to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'support-attachments');

-- Add policies to allow users to read files
CREATE POLICY "Allow users to read support attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'support-attachments');

-- Add RLS for ticket assignments table
ALTER TABLE ticket_assignments ENABLE ROW LEVEL SECURITY;

-- Add policy for ticket assignments
CREATE POLICY "Users can view ticket assignments"
ON ticket_assignments FOR SELECT
TO authenticated
USING (true);

-- Add policy for ticket assignments for company admins
CREATE POLICY "Company admins can create ticket assignments"
ON ticket_assignments FOR INSERT
TO authenticated
WITH CHECK (true);

-- Update support_tickets table to ensure assigned_to column exists
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS assigned_to UUID;

-- Make sure notifications table exists (as it's used in the ticket notification system)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Add policy for notifications
CREATE POLICY "Users can view their notifications"
ON notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Add policy for notifications for admin
CREATE POLICY "Admins can insert notifications for anyone"
ON notifications FOR INSERT
TO authenticated
WITH CHECK (true);
