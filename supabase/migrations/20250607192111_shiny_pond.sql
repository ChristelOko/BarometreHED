/*
  # Add personalized insights to results table
  
  1. Changes
    - Add personalized_insights column to results table
    - This column will store JSON array of personalized insights based on user's scan
  
  2. Security
    - No changes to existing RLS policies needed
*/

-- Add personalized_insights column to results table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'results' AND column_name = 'personalized_insights'
  ) THEN
    ALTER TABLE results ADD COLUMN personalized_insights jsonb;
  END IF;
END $$;