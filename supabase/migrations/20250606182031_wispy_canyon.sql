/*
  # Add missing columns to reminders table

  1. Changes
    - Add `auto_generated` column (boolean, default false)
    - Add `frequency` column (text with check constraint)
    - Add `priority` column (text with check constraint)
    - Add `scan_id` column (uuid, foreign key to scans table)

  2. Security
    - No changes to existing RLS policies needed
    - New columns follow existing security model
*/

-- Add auto_generated column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminders' AND column_name = 'auto_generated'
  ) THEN
    ALTER TABLE reminders ADD COLUMN auto_generated boolean DEFAULT false;
  END IF;
END $$;

-- Add frequency column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminders' AND column_name = 'frequency'
  ) THEN
    ALTER TABLE reminders ADD COLUMN frequency text;
  END IF;
END $$;

-- Add priority column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminders' AND column_name = 'priority'
  ) THEN
    ALTER TABLE reminders ADD COLUMN priority text;
  END IF;
END $$;

-- Add scan_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminders' AND column_name = 'scan_id'
  ) THEN
    ALTER TABLE reminders ADD COLUMN scan_id uuid;
  END IF;
END $$;

-- Add check constraints for frequency
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'reminders_frequency_check'
  ) THEN
    ALTER TABLE reminders ADD CONSTRAINT reminders_frequency_check 
    CHECK (frequency IS NULL OR frequency = ANY (ARRAY['daily'::text, 'weekly'::text, 'monthly'::text]));
  END IF;
END $$;

-- Add check constraints for priority
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'reminders_priority_check'
  ) THEN
    ALTER TABLE reminders ADD CONSTRAINT reminders_priority_check 
    CHECK (priority IS NULL OR priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]));
  END IF;
END $$;

-- Add foreign key constraint for scan_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'reminders_scan_id_fkey'
  ) THEN
    ALTER TABLE reminders ADD CONSTRAINT reminders_scan_id_fkey 
    FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS reminders_auto_generated_idx ON reminders (auto_generated);
CREATE INDEX IF NOT EXISTS reminders_frequency_idx ON reminders (frequency);
CREATE INDEX IF NOT EXISTS reminders_priority_idx ON reminders (priority);
CREATE INDEX IF NOT EXISTS reminders_scan_id_idx ON reminders (scan_id);