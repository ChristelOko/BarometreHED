/*
  # Fix RLS policies for user_feedback_status table
  
  1. Security Updates
    - Check if policies exist before creating them
    - Create proper RLS policies for user_feedback_status table
    - Ensure users can only manage their own feedback status records
*/

-- Check if policies exist before creating them
DO $$
BEGIN
  -- Check if INSERT policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_feedback_status' 
    AND policyname = 'Users can insert their own feedback status'
  ) THEN
    CREATE POLICY "Users can insert their own feedback status"
      ON user_feedback_status
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check if SELECT policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_feedback_status' 
    AND policyname = 'Users can view their own feedback status'
  ) THEN
    CREATE POLICY "Users can view their own feedback status"
      ON user_feedback_status
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Check if UPDATE policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_feedback_status' 
    AND policyname = 'Users can update their own feedback status'
  ) THEN
    CREATE POLICY "Users can update their own feedback status"
      ON user_feedback_status
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check if DELETE policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_feedback_status' 
    AND policyname = 'Users can delete their own feedback status'
  ) THEN
    CREATE POLICY "Users can delete their own feedback status"
      ON user_feedback_status
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE user_feedback_status ENABLE ROW LEVEL SECURITY;