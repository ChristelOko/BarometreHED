/*
  # Add profile insertion policy
  
  1. Changes
    - Add RLS policy for profile insertion
    - Ensure policy only allows authenticated users to create their own profile
  
  2. Security
    - Policy enforces user can only insert their own profile
    - Requires authentication
*/

DO $$ 
BEGIN
  -- Check if the policy doesn't exist yet
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'profiles' 
      AND policyname = 'Users can insert own profile'
  ) THEN
    -- Create the insert policy
    CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);
  END IF;
END $$;