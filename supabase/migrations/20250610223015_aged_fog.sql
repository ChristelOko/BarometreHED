/*
  # Add function to get users with stats
  
  1. New Function
    - `get_users_with_stats` - Returns users with scan count and other stats
  
  2. Purpose
    - Provide a more complete view of users for the admin dashboard
    - Include scan count and other relevant metrics
*/

-- Create function to get users with stats
CREATE OR REPLACE FUNCTION get_users_with_stats()
RETURNS SETOF json AS $$
BEGIN
  RETURN QUERY
  SELECT 
    json_build_object(
      'id', u.id,
      'email', u.email,
      'full_name', u.full_name,
      'avatar_url', u.avatar_url,
      'role', u.role,
      'bio', u.bio,
      'website', u.website,
      'company', u.company,
      'location', u.location,
      'is_active', u.is_active,
      'last_seen', u.last_seen,
      'created_at', u.created_at,
      'updated_at', u.updated_at,
      'hd_type', u.hd_type,
      'birthdate', u.birthdate,
      'phone', u.phone,
      'scan_count', COALESCE(s.scan_count, 0),
      'avg_score', COALESCE(s.avg_score, 0),
      'last_scan_date', s.last_scan_date
    )
  FROM 
    users u
  LEFT JOIN (
    SELECT 
      user_id,
      COUNT(*) as scan_count,
      AVG(score) as avg_score,
      MAX(date) as last_scan_date
    FROM 
      scans
    GROUP BY 
      user_id
  ) s ON u.id = s.user_id
  ORDER BY 
    u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_users_with_stats() TO authenticated;