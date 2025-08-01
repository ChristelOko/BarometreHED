/*
  # Add function to get analytics stats
  
  1. New Function
    - `get_analytics_stats` - Returns all analytics stats in a single call
  
  2. Purpose
    - Optimize analytics dashboard by reducing the number of database queries
    - Provide a single source of truth for analytics data
*/

-- Create function to get analytics stats
CREATE OR REPLACE FUNCTION get_analytics_stats()
RETURNS json AS $$
DECLARE
    user_count integer;
    scan_count integer;
    daily_scan_count integer;
    average_score numeric;
    categories json;
    centers json;
    yesterday timestamp with time zone;
BEGIN
    -- Get user count
    SELECT COUNT(*) INTO user_count FROM users;
    
    -- Get scan count
    SELECT COUNT(*) INTO scan_count FROM scans;
    
    -- Get daily scan count (last 24 hours)
    yesterday := now() - interval '1 day';
    SELECT COUNT(*) INTO daily_scan_count FROM scans WHERE created_at >= yesterday;
    
    -- Get average score
    SELECT AVG(score) INTO average_score FROM scans;
    
    -- Get scans by category
    SELECT 
        json_build_object(
            'general', COUNT(*) FILTER (WHERE category = 'general'),
            'emotional', COUNT(*) FILTER (WHERE category = 'emotional'),
            'physical', COUNT(*) FILTER (WHERE category = 'physical')
        )
    INTO categories
    FROM scans;
    
    -- Get scans by center
    SELECT 
        json_build_object(
            'throat', COUNT(*) FILTER (WHERE center = 'throat'),
            'heart', COUNT(*) FILTER (WHERE center = 'heart'),
            'solar-plexus', COUNT(*) FILTER (WHERE center = 'solar-plexus'),
            'sacral', COUNT(*) FILTER (WHERE center = 'sacral'),
            'root', COUNT(*) FILTER (WHERE center = 'root'),
            'spleen', COUNT(*) FILTER (WHERE center = 'spleen'),
            'g-center', COUNT(*) FILTER (WHERE center = 'g-center'),
            'ajna', COUNT(*) FILTER (WHERE center = 'ajna'),
            'head', COUNT(*) FILTER (WHERE center = 'head')
        )
    INTO centers
    FROM scans;
    
    -- Return all stats as a single JSON object
    RETURN json_build_object(
        'user_count', user_count,
        'scan_count', scan_count,
        'daily_scan_count', daily_scan_count,
        'average_score', ROUND(average_score),
        'categories', categories,
        'centers', centers
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_analytics_stats() TO authenticated;