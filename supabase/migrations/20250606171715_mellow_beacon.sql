/*
  # Ajout des scores par catégorie dans la table scans
  
  1. Nouvelles colonnes
    - `general_score` : Score pour la catégorie générale
    - `emotional_score` : Score pour la catégorie émotionnelle  
    - `physical_score` : Score pour la catégorie physique
    - `category` : Type de scan effectué (general, emotional, physical)
  
  2. Contraintes
    - Validation des scores (0-100)
    - Valeurs par défaut appropriées
*/

-- Ajouter les nouvelles colonnes pour les scores par catégorie
ALTER TABLE scans 
ADD COLUMN IF NOT EXISTS general_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS emotional_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS physical_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS category text DEFAULT 'general';

-- Ajouter les contraintes pour les nouveaux scores
ALTER TABLE scans
ADD CONSTRAINT scans_general_score_check 
CHECK (general_score >= 0 AND general_score <= 100),
ADD CONSTRAINT scans_emotional_score_check 
CHECK (emotional_score >= 0 AND emotional_score <= 100),
ADD CONSTRAINT scans_physical_score_check 
CHECK (physical_score >= 0 AND physical_score <= 100);

-- Ajouter contrainte pour la catégorie
ALTER TABLE scans
ADD CONSTRAINT scans_category_check 
CHECK (category IN ('general', 'emotional', 'physical'));

-- Créer un index pour optimiser les requêtes par catégorie
CREATE INDEX IF NOT EXISTS scans_category_idx ON scans(category);
CREATE INDEX IF NOT EXISTS scans_user_category_idx ON scans(user_id, category);