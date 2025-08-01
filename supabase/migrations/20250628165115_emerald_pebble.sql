/*
  # Fix RLS policies for user_feedback_status table
  
  1. Changes
    - Safely add INSERT policy for user_feedback_status table if it doesn't exist
    - Use DO block with conditional logic to avoid errors if policy already exists
  
  2. Security
    - Ensures authenticated users can insert their own feedback status records
    - Maintains existing security model where users can only manage their own data
*/

-- Use a DO block to check if the policy exists before creating it
DO $$
BEGIN
  -- Check if the policy already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_feedback_status' 
    AND policyname = 'Users can insert their own feedback status'
  ) THEN
    -- Create the policy only if it doesn't exist
    CREATE POLICY "Users can insert their own feedback status" 
      ON user_feedback_status 
      FOR INSERT 
      TO authenticated 
      WITH CHECK (auth.uid() = user_id);
      
    RAISE NOTICE 'Created INSERT policy for user_feedback_status table';
  ELSE
    RAISE NOTICE 'INSERT policy for user_feedback_status already exists, skipping creation';
  END IF;
END $$;

-- Ensure RLS is enabled on the table
ALTER TABLE user_feedback_status ENABLE ROW LEVEL SECURITY;