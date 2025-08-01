/*
  # Fix RLS policies for user_feedback_status table

  1. Security Updates
    - Drop existing problematic policies
    - Create proper RLS policies for user_feedback_status table
    - Ensure users can create, read, update, and delete their own feedback status records

  2. Policy Details
    - INSERT: Allow authenticated users to create their own feedback status
    - SELECT: Allow users to view their own feedback status
    - UPDATE: Allow users to update their own feedback status
    - DELETE: Allow users to delete their own feedback status
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can delete their own feedback status" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can insert their own feedback status" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can update their own feedback status" ON user_feedback_status;
DROP POLICY IF EXISTS "Users can view their own feedback status" ON user_feedback_status;

-- Create comprehensive RLS policies for user_feedback_status table
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

-- Ensure RLS is enabled on the table
ALTER TABLE user_feedback_status ENABLE ROW LEVEL SECURITY;