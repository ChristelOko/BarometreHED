/*
  # Fix RLS policies for user_feedback_status table

  1. Security Updates
    - Drop existing policies that may be conflicting
    - Create comprehensive RLS policies for all CRUD operations
    - Ensure authenticated users can manage their own feedback status

  2. Policy Details
    - INSERT: Users can create their own feedback status
    - SELECT: Users can view their own feedback status  
    - UPDATE: Users can update their own feedback status
    - DELETE: Users can delete their own feedback status
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can delete their own notification settings" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can insert their own notification settings" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can manage their own notification settings" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can update their own notification settings" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can view their own notification settings" ON user_feedback_status;

-- Drop any existing policies on user_feedback_status
DROP POLICY IF EXISTS "Users can delete their own feedback status" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can insert their own feedback status" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can update their own feedback status" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can view their own feedback status" ON user_feedback_status;

-- Create comprehensive RLS policies for user_feedback_status
CREATE POLICY "Users can insert their own feedback status"
  ON user_feedback_status
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback status"
  ON user_feedback_status
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback status"
  ON user_feedback_status
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback status"
  ON user_feedback_status
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);