/*
  # Fix RLS policies for user_feedback_status table

  1. Security Updates
    - Drop existing policies that may be conflicting
    - Create proper INSERT policy for authenticated users
    - Ensure users can only manage their own feedback status
    - Add proper policy for upsert operations

  2. Policy Changes
    - Allow authenticated users to insert their own feedback status
    - Allow authenticated users to update their own feedback status
    - Allow authenticated users to select their own feedback status
    - Allow authenticated users to delete their own feedback status
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own feedback status" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can update their own feedback status" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can view their own feedback status" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can delete their own feedback status" ON user_feedback_status;

-- Create comprehensive RLS policies for user_feedback_status
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

-- Ensure RLS is enabled
ALTER TABLE user_feedback_status ENABLE ROW LEVEL SECURITY;