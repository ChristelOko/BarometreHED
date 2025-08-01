/*
  # Fix RLS policies for user_feedback_status table

  1. Security
    - Add missing INSERT policy for authenticated users to create their own feedback status
    - Ensure UPDATE policy allows users to modify their own feedback status
    - Verify SELECT policy allows users to read their own feedback status
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own feedback status" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can update their own feedback status" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can view their own feedback status" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can delete their own feedback status" ON user_feedback_status;

-- Create comprehensive RLS policies for user_feedback_status table
CREATE POLICY "Users can insert their own feedback status"
  ON user_feedback_status
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback status"
  ON user_feedback_status
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback status"
  ON user_feedback_status
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback status"
  ON user_feedback_status
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure RLS is enabled on the table
ALTER TABLE user_feedback_status ENABLE ROW LEVEL SECURITY;