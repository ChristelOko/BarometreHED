/*
  # Fix RLS policies for user_feedback_status table

  1. Security Updates
    - Drop existing restrictive policies
    - Add comprehensive policies that allow proper UPSERT operations
    - Ensure users can only manage their own feedback status records

  2. Policy Changes
    - Allow authenticated users to INSERT their own records
    - Allow authenticated users to UPDATE their own records  
    - Allow authenticated users to SELECT their own records
    - Ensure all operations check that user_id matches auth.uid()
*/

-- Drop existing policies
DROP POLICY IF EXISTS "System can insert feedback status" ON user_feedback_status;
DROP POLICY IF EXISTS "System can update feedback status" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can view their own feedback status" ON user_feedback_status;

-- Create new comprehensive policies
CREATE POLICY "Users can manage their own feedback status"
  ON user_feedback_status
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Alternative: Create separate policies for each operation if needed
-- CREATE POLICY "Users can insert their own feedback status"
--   ON user_feedback_status
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (user_id = auth.uid());

-- CREATE POLICY "Users can update their own feedback status"
--   ON user_feedback_status
--   FOR UPDATE
--   TO authenticated
--   USING (user_id = auth.uid())
--   WITH CHECK (user_id = auth.uid());

-- CREATE POLICY "Users can select their own feedback status"
--   ON user_feedback_status
--   FOR SELECT
--   TO authenticated
--   USING (user_id = auth.uid());