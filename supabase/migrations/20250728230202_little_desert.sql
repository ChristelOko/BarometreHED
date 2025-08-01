/*
  # Create has_free_access function

  1. New Functions
    - `has_free_access(user_uuid)` - Check if user has active free access
      - Returns boolean indicating if user has valid free access grant
      - Checks expiration dates and active status

  2. Security
    - Function is accessible to authenticated users
    - Uses existing RLS policies on free_access_grants table
*/

-- Create the has_free_access function
CREATE OR REPLACE FUNCTION public.has_free_access(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has an active free access grant
  RETURN EXISTS (
    SELECT 1 
    FROM public.free_access_grants 
    WHERE user_id = user_uuid 
      AND is_active = true 
      AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.has_free_access(UUID) TO authenticated;