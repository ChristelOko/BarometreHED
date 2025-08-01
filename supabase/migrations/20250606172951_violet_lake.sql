/*
  # Ajouter les colonnes de scores par catégorie
  
  1. Nouvelles colonnes
    - `general_score` : Score pour la catégorie générale
    - `emotional_score` : Score pour la catégorie émotionnelle  
    - `physical_score` : Score pour la catégorie physique
    - `category` : Type de scan effectué
  
  2. Contraintes
    - Validation des scores (0-100)
    - Validation des catégories
  
  3. Index
    - Optimisation des requêtes par catégorie
*/

-- Ajouter les nouvelles colonnes pour les scores par catégorie
ALTER TABLE scans 
ADD COLUMN IF NOT EXISTS general_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS emotional_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS physical_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS category text DEFAULT 'general';

-- Ajouter les contraintes seulement si elles n'existent pas déjà
DO $$ 
BEGIN
    -- Contrainte pour general_score
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'scans_general_score_check'
    ) THEN
        ALTER TABLE scans
        ADD CONSTRAINT scans_general_score_check 
        CHECK (general_score >= 0 AND general_score <= 100);
    END IF;

    -- Contrainte pour emotional_score
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'scans_emotional_score_check'
    ) THEN
        ALTER TABLE scans
        ADD CONSTRAINT scans_emotional_score_check 
        CHECK (emotional_score >= 0 AND emotional_score <= 100);
    END IF;

    -- Contrainte pour physical_score
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'scans_physical_score_check'
    ) THEN
        ALTER TABLE scans
        ADD CONSTRAINT scans_physical_score_check 
        CHECK (physical_score >= 0 AND physical_score <= 100);
    END IF;

    -- Contrainte pour category
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'scans_category_check'
    ) THEN
        ALTER TABLE scans
        ADD CONSTRAINT scans_category_check 
        CHECK (category IN ('general', 'emotional', 'physical'));
    END IF;
END $$;

-- Créer les index seulement s'ils n'existent pas déjà
DO $$
BEGIN
    -- Index pour category
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'scans_category_idx'
    ) THEN
        CREATE INDEX scans_category_idx ON scans(category);
    END IF;

    -- Index pour user_id et category
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'scans_user_category_idx'
    ) THEN
        CREATE INDEX scans_user_category_idx ON scans(user_id, category);
    END IF;
END $$;