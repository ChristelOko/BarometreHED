/*
  # Manual Subscription Approval System
  
  1. New Columns
    - `is_approved` (boolean) - Indicates if subscription has been approved
    - `approval_notes` (text) - Notes from admin about approval/rejection
    - `reviewed_by` (uuid) - Admin who reviewed the subscription
    - `reviewed_at` (timestamptz) - When the subscription was reviewed
  
  2. New Functions
    - `approve_subscription` - Function to approve a subscription
    - `reject_subscription` - Function to reject a subscription
  
  3. Updated Constraints
    - Modified status check to include 'pending_approval' and 'rejected'
  
  4. Indexes
    - Added indexes for faster filtering by approval status
*/

-- Add new columns to subscriptions table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'is_approved'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN is_approved boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'approval_notes'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN approval_notes text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'reviewed_by'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'reviewed_at'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN reviewed_at timestamptz;
  END IF;
END $$;

-- Update status check constraint to include pending_approval and rejected
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
  
  -- Create notification for user
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    action_url
  )
  SELECT 
    user_id,
    'subscription_approved',
    'Abonnement approuvé',
    'Votre abonnement a été approuvé. Vous avez maintenant accès à toutes les fonctionnalités premium.',
    '/profile'
  FROM subscriptions
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
  user_id_val uuid;
BEGIN
  -- Check if subscription exists and get user_id
  SELECT EXISTS (
    SELECT 1 FROM subscriptions WHERE id = subscription_id
  ), 
  (SELECT user_id FROM subscriptions WHERE id = subscription_id)
  INTO sub_exists, user_id_val;
  
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
  
  -- Create notification for user
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    action_url
  )
  VALUES (
    user_id_val,
    'subscription_rejected',
    'Abonnement non approuvé',
    'Votre demande d''abonnement n''a pas été approuvée. ' || 
    CASE WHEN notes IS NOT NULL THEN 'Raison: ' || notes ELSE 'Veuillez nous contacter pour plus d''informations.' END,
    '/contact'
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policy for admin functions if it doesn't exist
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