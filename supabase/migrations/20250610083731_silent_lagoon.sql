/*
  # Create Admin User
  
  1. Changes
    - Creates a new admin user if it doesn't exist
    - Sets christel.aplogan@gmail.com as admin
    - Handles all edge cases properly
  
  2. Security
    - Creates user with admin role
    - Ensures proper permissions
*/

-- First, check if the auth.users table has the user
DO $$
DECLARE
  auth_user_id uuid;
  user_exists boolean;
BEGIN
  -- Check if user exists in auth.users
  SELECT id INTO auth_user_id
  FROM auth.users
  WHERE email = 'christel.aplogan@gmail.com';
  
  -- If user doesn't exist in auth.users, we can't proceed
  IF auth_user_id IS NULL THEN
    RAISE NOTICE 'User christel.aplogan@gmail.com does not exist in auth.users. Please create the account first.';
    RETURN;
  END IF;
  
  -- Check if user exists in public.users
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth_user_id
  ) INTO user_exists;
  
  -- If user exists in public.users, update role to admin
  IF user_exists THEN
    UPDATE public.users
    SET 
      role = 'admin',
      updated_at = now()
    WHERE id = auth_user_id;
    
    RAISE NOTICE 'User christel.aplogan@gmail.com updated to admin role.';
  ELSE
    -- If user doesn't exist in public.users, create a new record
    INSERT INTO public.users (
      id,
      email,
      full_name,
      role,
      is_active,
      created_at,
      updated_at
    ) VALUES (
      auth_user_id,
      'christel.aplogan@gmail.com',
      'Christel Aplogan',
      'admin',
      true,
      now(),
      now()
    );
    
    RAISE NOTICE 'Admin user christel.aplogan@gmail.com created successfully.';
  END IF;
END $$;