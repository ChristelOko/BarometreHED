/*
  # Update scans table for all categories

  1. New Columns
    - Add columns for all 9 categories of scans
    - Add constraints to ensure scores are between 0 and 100
    - Add indexes for efficient querying

  2. Category Constraint
    - Update the category check constraint to include all 9 categories
    - Ensure backward compatibility with existing data
*/

-- Add columns for additional category scores if they don't exist
DO $$
BEGIN
  -- Check if mental_score column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'scans' AND column_name = 'mental_score'
  ) THEN
    ALTER TABLE scans ADD COLUMN mental_score integer DEFAULT 0;
    ALTER TABLE scans ADD CONSTRAINT scans_mental_score_check CHECK ((mental_score >= 0) AND (mental_score <= 100));
    CREATE INDEX scans_mental_score_idx ON scans(mental_score);
  END IF;

  -- Check if digestive_score column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'scans' AND column_name = 'digestive_score'
  ) THEN
    ALTER TABLE scans ADD COLUMN digestive_score integer DEFAULT 0;
    ALTER TABLE scans ADD CONSTRAINT scans_digestive_score_check CHECK ((digestive_score >= 0) AND (digestive_score <= 100));
    CREATE INDEX scans_digestive_score_idx ON scans(digestive_score);
  END IF;

  -- Check if somatic_score column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'scans' AND column_name = 'somatic_score'
  ) THEN
    ALTER TABLE scans ADD COLUMN somatic_score integer DEFAULT 0;
    ALTER TABLE scans ADD CONSTRAINT scans_somatic_score_check CHECK ((somatic_score >= 0) AND (somatic_score <= 100));
    CREATE INDEX scans_somatic_score_idx ON scans(somatic_score);
  END IF;

  -- Check if energetic_score column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'scans' AND column_name = 'energetic_score'
  ) THEN
    ALTER TABLE scans ADD COLUMN energetic_score integer DEFAULT 0;
    ALTER TABLE scans ADD CONSTRAINT scans_energetic_score_check CHECK ((energetic_score >= 0) AND (energetic_score <= 100));
    CREATE INDEX scans_energetic_score_idx ON scans(energetic_score);
  END IF;

  -- Check if feminine_cycle_score column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'scans' AND column_name = 'feminine_cycle_score'
  ) THEN
    ALTER TABLE scans ADD COLUMN feminine_cycle_score integer DEFAULT 0;
    ALTER TABLE scans ADD CONSTRAINT scans_feminine_cycle_score_check CHECK ((feminine_cycle_score >= 0) AND (feminine_cycle_score <= 100));
    CREATE INDEX scans_feminine_cycle_score_idx ON scans(feminine_cycle_score);
  END IF;

  -- Check if hd_specific_score column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'scans' AND column_name = 'hd_specific_score'
  ) THEN
    ALTER TABLE scans ADD COLUMN hd_specific_score integer DEFAULT 0;
    ALTER TABLE scans ADD CONSTRAINT scans_hd_specific_score_check CHECK ((hd_specific_score >= 0) AND (hd_specific_score <= 100));
    CREATE INDEX scans_hd_specific_score_idx ON scans(hd_specific_score);
  END IF;

  -- Update category check constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'scans_category_check' 
    AND conrelid = 'scans'::regclass::oid
  ) THEN
    -- Get current constraint definition
    DECLARE
      current_constraint text;
    BEGIN
      SELECT pg_get_constraintdef(oid) INTO current_constraint
      FROM pg_constraint
      WHERE conname = 'scans_category_check'
      AND conrelid = 'scans'::regclass::oid;
      
      -- Check if all categories are already included
      IF current_constraint NOT LIKE '%mental%' OR 
         current_constraint NOT LIKE '%digestive%' OR 
         current_constraint NOT LIKE '%somatic%' OR 
         current_constraint NOT LIKE '%energetic%' OR 
         current_constraint NOT LIKE '%feminine_cycle%' OR 
         current_constraint NOT LIKE '%hd_specific%' THEN
        
        -- Drop old constraint
        ALTER TABLE scans DROP CONSTRAINT scans_category_check;
        
        -- Add new constraint with all categories
        ALTER TABLE scans ADD CONSTRAINT scans_category_check 
          CHECK (category = ANY (ARRAY[
            'general'::text, 
            'emotional'::text, 
            'physical'::text, 
            'mental'::text, 
            'digestive'::text, 
            'somatic'::text, 
            'energetic'::text, 
            'feminine_cycle'::text, 
            'hd_specific'::text
          ]));
      END IF;
    END;
  ELSE
    -- If constraint doesn't exist, add it
    ALTER TABLE scans ADD CONSTRAINT scans_category_check 
      CHECK (category = ANY (ARRAY[
        'general'::text, 
        'emotional'::text, 
        'physical'::text, 
        'mental'::text, 
        'digestive'::text, 
        'somatic'::text, 
        'energetic'::text, 
        'feminine_cycle'::text, 
        'hd_specific'::text
      ]));
  END IF;
END $$;