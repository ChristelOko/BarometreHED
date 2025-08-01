/*
  # Fix RLS policies for user_feedback_status table

  1. Security Updates
    - Add explicit INSERT policy for user_feedback_status table
    - Add explicit UPDATE policy for user_feedback_status table
    - Ensure users can manage their own feedback status records

  This migration fixes the RLS policy violations that prevent users from
  creating or updating their feedback status records.
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can manage their own feedback status" ON user_feedback_status;

-- Create explicit INSERT policy
CREATE POLICY "Users can insert their own feedback status"
  ON user_feedback_status
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create explicit SELECT policy
CREATE POLICY "Users can view their own feedback status"
  ON user_feedback_status
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create explicit UPDATE policy
CREATE POLICY "Users can update their own feedback status"
  ON user_feedback_status
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create explicit DELETE policy (for completeness)
CREATE POLICY "Users can delete their own feedback status"
  ON user_feedback_status
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());