/*
  # Fix RLS policy for user_feedback_status table - With Error Handling

  1. Security Changes
    - Safely add INSERT policy for user_feedback_status table
    - Check if policy exists before creating it to avoid errors
    - Allow authenticated users to insert their own feedback status records

  This migration fixes the RLS policy violation that prevents users from creating
  their initial feedback status records when using the feedback system.
*/

-- Add INSERT policy for user_feedback_status table only if it doesn't exist
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
      WITH CHECK (user_id = auth.uid());
      
    RAISE NOTICE 'Created INSERT policy for user_feedback_status table';
  ELSE
    RAISE NOTICE 'INSERT policy for user_feedback_status already exists, skipping creation';
  END IF;
END $$;