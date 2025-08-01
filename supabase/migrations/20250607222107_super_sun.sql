/*
  # Set christel.aplogan@gmail.com as admin user
  
  1. Changes
    - Updates the role of christel.aplogan@gmail.com to 'admin'
    - Ensures the user exists before attempting the update
    - Uses a safe approach with DO block and conditionals
  
  2. Security
    - No changes to RLS policies
    - Only affects a single user record
*/

-- Set christel.aplogan@gmail.com as admin
DO $$
DECLARE
  user_exists boolean;
BEGIN
  -- Check if the user exists
  SELECT EXISTS (
    SELECT 1 FROM users WHERE email = 'christel.aplogan@gmail.com'
  ) INTO user_exists;
  
  -- If user exists, update their role to admin
  IF user_exists THEN
    UPDATE users
    SET role = 'admin'
    WHERE email = 'christel.aplogan@gmail.com';
    
    RAISE NOTICE 'User christel.aplogan@gmail.com has been set as admin';
  ELSE
    -- If user doesn't exist in the users table but exists in auth.users,
    -- we need to create a record in the users table first
    IF EXISTS (
      SELECT 1 FROM auth.users WHERE email = 'christel.aplogan@gmail.com'
    ) THEN
      -- Get the user's ID from auth.users
      INSERT INTO users (id, email, full_name, role)
      SELECT 
        id, 
        email, 
        COALESCE(raw_user_meta_data->>'full_name', 'Christel Aplogan') as full_name,
        'admin' as role
      FROM auth.users
      WHERE email = 'christel.aplogan@gmail.com'
      ON CONFLICT (id) DO UPDATE
      SET role = 'admin';
      
      RAISE NOTICE 'User record created and set as admin for christel.aplogan@gmail.com';
    ELSE
      RAISE NOTICE 'User christel.aplogan@gmail.com does not exist in the system';
    END IF;
  END IF;
END $$;