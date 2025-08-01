/*
  # Create has_free_access RPC function

  1. New Functions
    - `has_free_access(user_uuid)` - Checks if a user has free access through grants
      - Returns boolean indicating if user has active free access
      - Uses SECURITY DEFINER to bypass RLS restrictions
      - Checks free_access_grants table for active grants

  2. Security
    - Function runs with elevated privileges to access required tables
    - Only checks for active grants with valid expiration dates
    - Safe for public access as it only returns boolean result
*/

CREATE OR REPLACE FUNCTION has_free_access(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has any active free access grants
  RETURN EXISTS (
    SELECT 1 
    FROM free_access_grants 
    WHERE user_id = user_uuid 
      AND is_active = true 
      AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION has_free_access(uuid) TO authenticated, anon;