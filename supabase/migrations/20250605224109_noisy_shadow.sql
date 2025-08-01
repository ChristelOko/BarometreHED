/*
  # Fix scan table constraints and indexes
  
  1. Changes
    - Remove existing indexes
    - Create function for date truncation
    - Clean up duplicate records
    - Create new unique index
    - Add constraints for score and center
  
  2. Security
    - No changes to RLS policies
*/

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS scans_user_daily_unique_idx;
DROP INDEX IF EXISTS scans_user_date_idx;

-- Create a function to truncate timestamp to date
CREATE OR REPLACE FUNCTION trunc_date(ts timestamptz) 
RETURNS date AS $$
BEGIN
    RETURN date_trunc('day', ts)::date;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Delete duplicate records keeping only the latest scan per user per day
DELETE FROM scans a USING (
    SELECT user_id, trunc_date(date) as scan_date, 
           MAX(date) as max_date
    FROM scans
    GROUP BY user_id, trunc_date(date)
    HAVING COUNT(*) > 1
) b
WHERE a.user_id = b.user_id 
  AND trunc_date(a.date) = b.scan_date
  AND a.date < b.max_date;

-- Create new unique index using the immutable function
CREATE UNIQUE INDEX scans_user_daily_unique_idx 
ON scans(user_id, (trunc_date(date)));

-- Recreate optimized index for date-based queries
CREATE INDEX scans_user_date_idx 
ON scans(user_id, date DESC);

-- Add score and center constraints if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'scans_score_check'
    ) THEN
        ALTER TABLE scans
        ADD CONSTRAINT scans_score_check 
        CHECK (score >= 0 AND score <= 100);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'scans_center_check'
    ) THEN
        ALTER TABLE scans
        ADD CONSTRAINT scans_center_check 
        CHECK (center IN ('throat', 'heart', 'solar-plexus', 'sacral', 'root', 'spleen', 'g-center', 'ajna', 'head'));
    END IF;
END $$;