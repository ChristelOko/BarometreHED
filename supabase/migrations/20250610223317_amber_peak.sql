/*
  # Create get_users_with_stats function
  
  1. Changes
    - Drops existing function if it exists
    - Creates a new function that joins users, profiles, and scans tables
    - Returns user data with scan statistics
    - Grants execute permission to authenticated users
  
  2. Security
    - Uses SECURITY DEFINER to respect RLS policies
    - Only authenticated users can execute the function
*/

-- Drop the function if it exists
DROP FUNCTION IF EXISTS get_users_with_stats();

-- Create the get_users_with_stats function
CREATE OR REPLACE FUNCTION get_users_with_stats()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  avatar_url text,
  role text,
  bio text,
  website text,
  company text,
  location text,
  is_active boolean,
  last_seen timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  hd_type text,
  scan_count bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    u.id,
    u.email,
    u.full_name,
    u.avatar_url,
    u.role,
    u.bio,
    u.website,
    u.company,
    u.location,
    u.is_active,
    u.last_seen,
    u.created_at,
    u.updated_at,
    p.hd_type,
    COALESCE(s.scan_count, 0) as scan_count
  FROM users u
  LEFT JOIN profiles p ON u.id = p.id
  LEFT JOIN (
    SELECT 
      user_id, 
      COUNT(*) as scan_count
    FROM scans 
    GROUP BY user_id
  ) s ON u.id = s.user_id
  ORDER BY u.created_at DESC;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_users_with_stats() TO authenticated;