/*
  # Ajouter des colonnes pour améliorer le système de rappels
  
  1. Nouvelles colonnes
    - `scan_id` : Référence au scan qui a généré ce rappel
    - `auto_generated` : Indique si le rappel a été généré automatiquement
    - `frequency` : Fréquence du rappel (daily, weekly, monthly)
    - `priority` : Priorité du rappel (low, medium, high)
  
  2. Index
    - Optimisation des requêtes par scan_id et auto_generated
*/

-- Ajouter les nouvelles colonnes
ALTER TABLE reminders 
ADD COLUMN IF NOT EXISTS scan_id uuid REFERENCES scans(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS auto_generated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS frequency text,
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium';

-- Ajouter les contraintes
DO $$ 
BEGIN
    -- Contrainte pour frequency
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'reminders_frequency_check'
    ) THEN
        ALTER TABLE reminders
        ADD CONSTRAINT reminders_frequency_check 
        CHECK (frequency IN ('daily', 'weekly', 'monthly') OR frequency IS NULL);
    END IF;

    -- Contrainte pour priority
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'reminders_priority_check'
    ) THEN
        ALTER TABLE reminders
        ADD CONSTRAINT reminders_priority_check 
        CHECK (priority IN ('low', 'medium', 'high'));
    END IF;
END $$;

-- Créer les index pour optimiser les requêtes
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'reminders_scan_id_idx'
    ) THEN
        CREATE INDEX reminders_scan_id_idx ON reminders(scan_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'reminders_auto_generated_idx'
    ) THEN
        CREATE INDEX reminders_auto_generated_idx ON reminders(auto_generated);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'reminders_priority_idx'
    ) THEN
        CREATE INDEX reminders_priority_idx ON reminders(priority);
    END IF;
END $$;