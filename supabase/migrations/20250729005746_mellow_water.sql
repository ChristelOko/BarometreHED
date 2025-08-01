/*
  # Fix RLS policies for user_profiles_extended table

  1. Security Updates
    - Add policy for admins to insert user profiles extended
    - Add policy for admins to update user profiles extended
    - Allow admins to manage all user extended profiles

  2. Changes
    - Enable admin INSERT operations on user_profiles_extended
    - Enable admin UPDATE operations on user_profiles_extended
    - Maintain existing user policies for self-management
*/

-- Allow admins to insert user profiles extended
CREATE POLICY "Admins can insert user profiles extended"
  ON user_profiles_extended
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to update user profiles extended
CREATE POLICY "Admins can update user profiles extended"
  ON user_profiles_extended
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to select all user profiles extended
CREATE POLICY "Admins can select all user profiles extended"
  ON user_profiles_extended
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );