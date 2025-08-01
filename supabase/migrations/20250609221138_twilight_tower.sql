/*
  # Add manual subscription approval system
  
  1. Changes to subscriptions table
    - Add `is_approved` column (boolean, default false)
    - Add `approval_notes` column (text, nullable)
    - Update status check constraint to include 'pending_approval'
  
  2. New admin functionality
    - Allow admins to approve or reject subscription requests
    - Track approval decisions with notes
*/

-- Add new columns to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS approval_notes text,
ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

-- Update status check constraint to include pending_approval
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;
ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_status_check 
CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'pending_approval', 'rejected'));

-- Create index for faster queries on approval status
CREATE INDEX IF NOT EXISTS idx_subscriptions_approval 
ON subscriptions(is_approved);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status 
ON subscriptions(status);

-- Create function to handle subscription approval
CREATE OR REPLACE FUNCTION approve_subscription(
  subscription_id uuid,
  admin_id uuid,
  notes text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  sub_exists boolean;
BEGIN
  -- Check if subscription exists
  SELECT EXISTS (
    SELECT 1 FROM subscriptions WHERE id = subscription_id
  ) INTO sub_exists;
  
  IF NOT sub_exists THEN
    RETURN false;
  END IF;
  
  -- Update subscription
  UPDATE subscriptions
  SET 
    is_approved = true,
    status = 'active',
    approval_notes = notes,
    reviewed_by = admin_id,
    reviewed_at = now(),
    updated_at = now()
  WHERE id = subscription_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle subscription rejection
CREATE OR REPLACE FUNCTION reject_subscription(
  subscription_id uuid,
  admin_id uuid,
  notes text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  sub_exists boolean;
BEGIN
  -- Check if subscription exists
  SELECT EXISTS (
    SELECT 1 FROM subscriptions WHERE id = subscription_id
  ) INTO sub_exists;
  
  IF NOT sub_exists THEN
    RETURN false;
  END IF;
  
  -- Update subscription
  UPDATE subscriptions
  SET 
    is_approved = false,
    status = 'rejected',
    approval_notes = notes,
    reviewed_by = admin_id,
    reviewed_at = now(),
    updated_at = now()
  WHERE id = subscription_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policy for admin functions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscriptions' AND policyname = 'Admins can manage all subscriptions'
  ) THEN
    CREATE POLICY "Admins can manage all subscriptions"
      ON subscriptions
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid() AND users.role = 'admin'
        )
      );
  END IF;
END $$;