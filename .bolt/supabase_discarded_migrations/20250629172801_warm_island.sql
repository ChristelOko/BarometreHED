/*
  # Fix RLS policies for user_feedback_status table

  1. Security Updates
    - Add missing INSERT policy for user_feedback_status table
    - Ensure users can insert their own feedback status records
    - Maintain existing policies for other operations

  2. Changes
    - CREATE POLICY for INSERT operations on user_feedback_status
    - Allow authenticated users to insert records where user_id matches auth.uid()
*/

-- Add INSERT policy for user_feedback_status table
CREATE POLICY "Users can insert their own feedback status" 
  ON user_feedback_status 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);