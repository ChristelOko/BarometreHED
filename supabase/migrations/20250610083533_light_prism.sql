/*
  # Create Admin User
  
  1. Changes
    - Creates a new admin user if the email doesn't exist
    - Updates an existing user to admin role if the email exists
    - Handles both auth.users and users tables
  
  2. Security
    - Only affects the specific admin email
    - No changes to RLS policies
*/

-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user(admin_email text)
RETURNS void AS $$
DECLARE
  user_exists boolean;
  auth_user_exists boolean;
  user_id uuid;
BEGIN
  -- Check if the user exists in users table
  SELECT EXISTS (
    SELECT 1 FROM users WHERE email = admin_email
  ) INTO user_exists;
  
  -- Check if the user exists in auth.users table
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = admin_email
  ) INTO auth_user_exists;
  
  -- If user exists in users table, update their role to admin
  IF user_exists THEN
    UPDATE users
    SET role = 'admin'
    WHERE email = admin_email;
    
    RAISE NOTICE 'User % has been set as admin', admin_email;
  ELSIF auth_user_exists THEN
    -- If user exists in auth.users but not in users table, create a record
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = admin_email;
    
    INSERT INTO users (id, email, full_name, role)
    VALUES (
      user_id,
      admin_email,
      'Christel Aplogan',
      'admin'
    )
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin';
    
    RAISE NOTICE 'User record created and set as admin for %', admin_email;
  ELSE
    -- If user doesn't exist at all, we can't create them directly in auth.users
    -- as that requires password hashing and other security measures
    RAISE NOTICE 'User % does not exist in the system. Please register this user first.', admin_email;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function for our admin user
SELECT create_admin_user('christel.aplogan@gmail.com');

-- Drop the function after use
DROP FUNCTION IF EXISTS create_admin_user(text);