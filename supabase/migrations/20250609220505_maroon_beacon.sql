/*
  # Set christel.aplogan@gmail.com as admin user
  
  1. Changes
    - Updates the role of christel.aplogan@gmail.com to 'admin'
    - Creates a user record if it exists in auth.users but not in users table
    - Handles the case where the user doesn't exist at all
  
  2. Security
    - No changes to RLS policies
    - Only affects a single user account
*/

-- Set christel.aplogan@gmail.com as admin
DO $$
DECLARE
  user_exists boolean;
  auth_user_exists boolean;
  user_id uuid;
BEGIN
  -- Check if the user exists in users table
  SELECT EXISTS (
    SELECT 1 FROM users WHERE email = 'christel.aplogan@gmail.com'
  ) INTO user_exists;
  
  -- Check if the user exists in auth.users table
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'christel.aplogan@gmail.com'
  ) INTO auth_user_exists;
  
  -- If user exists in users table, update their role to admin
  IF user_exists THEN
    UPDATE users
    SET role = 'admin'
    WHERE email = 'christel.aplogan@gmail.com';
    
    RAISE NOTICE 'User christel.aplogan@gmail.com has been set as admin';
  ELSIF auth_user_exists THEN
    -- If user exists in auth.users but not in users table, create a record
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = 'christel.aplogan@gmail.com';
    
    INSERT INTO users (id, email, full_name, role)
    VALUES (
      user_id,
      'christel.aplogan@gmail.com',
      'Christel Aplogan',
      'admin'
    )
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin';
    
    RAISE NOTICE 'User record created and set as admin for christel.aplogan@gmail.com';
  ELSE
    RAISE NOTICE 'User christel.aplogan@gmail.com does not exist in the system';
  END IF;
END $$;