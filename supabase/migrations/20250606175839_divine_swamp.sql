/*
  # Ajouter des colonnes pour stocker plus de détails dans les résultats
  
  1. Nouvelles colonnes dans results
    - `personalized_insights` (jsonb) : Insights personnalisés
    - `category` (text) : Catégorie du scan associé
    - `score` (integer) : Score du scan pour référence rapide
  
  2. Index pour optimiser les requêtes
    - Index sur scan_id pour les jointures
    - Index sur category pour filtrer par type
*/

-- Ajouter les nouvelles colonnes à la table results
ALTER TABLE results 
ADD COLUMN IF NOT EXISTS personalized_insights jsonb,
ADD COLUMN IF NOT EXISTS category text DEFAULT 'general',
ADD COLUMN IF NOT EXISTS score integer DEFAULT 0;

-- Ajouter une contrainte pour la catégorie
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'results_category_check'
    ) THEN
        ALTER TABLE results
        ADD CONSTRAINT results_category_check 
        CHECK (category IN ('general', 'emotional', 'physical'));
    END IF;
END $$;

-- Ajouter une contrainte pour le score
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'results_score_check'
    ) THEN
        ALTER TABLE results
        ADD CONSTRAINT results_score_check 
        CHECK (score >= 0 AND score <= 100);
    END IF;
END $$;

-- Créer des index pour optimiser les requêtes
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'results_category_idx'
    ) THEN
        CREATE INDEX results_category_idx ON results(category);
    END IF;
END $$;