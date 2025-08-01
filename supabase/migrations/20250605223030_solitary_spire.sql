/*
  # Add constraints and indexes to scans table
  
  1. Changes
    - Add score range constraint (0-100)
    - Add center value constraint
    - Add unique constraint for one scan per user per day
    - Add performance indexes
  
  2. Security
    - No security changes needed
*/

-- Add constraints
ALTER TABLE scans
ADD CONSTRAINT scans_score_check 
CHECK (score >= 0 AND score <= 100);

ALTER TABLE scans
ADD CONSTRAINT scans_center_check 
CHECK (center IN ('throat', 'heart', 'solar-plexus', 'sacral', 'root', 'spleen', 'g-center', 'ajna', 'head'));

-- Add unique constraint for one scan per user per day
CREATE UNIQUE INDEX scans_user_daily_unique_idx 
ON scans(user_id, date);

-- Add indexes for performance
CREATE INDEX scans_user_date_idx ON scans(user_id, date DESC);
CREATE INDEX scans_score_idx ON scans(score);