/*
  # Mise à jour de la table knowledge_base

  1. Nouvelles colonnes
    - `hd_type` : Type Human Design (generator, projector, etc.)
    - `min_score` : Score minimum pour ce contenu
    - `max_score` : Score maximum pour ce contenu
    - `center` : Centre HD concerné
    - `mantra` : Structure JSON pour le mantra
    - `realignment_exercise` : Exercice de réalignement

  2. Contraintes
    - Validation des types HD
    - Validation des scores
    - Validation des centres
*/

-- Ajout des nouvelles colonnes
ALTER TABLE knowledge_base
ADD COLUMN IF NOT EXISTS hd_type text,
ADD COLUMN IF NOT EXISTS min_score integer,
ADD COLUMN IF NOT EXISTS max_score integer,
ADD COLUMN IF NOT EXISTS center text,
ADD COLUMN IF NOT EXISTS mantra jsonb,
ADD COLUMN IF NOT EXISTS realignment_exercise text;

-- Ajout des contraintes
ALTER TABLE knowledge_base
ADD CONSTRAINT knowledge_base_hd_type_check
CHECK (
  hd_type IN (
    'generator',
    'projector',
    'manifesting-generator',
    'manifestor',
    'reflector'
  )
),
ADD CONSTRAINT knowledge_base_score_range_check
CHECK (
  (min_score IS NULL AND max_score IS NULL) OR
  (min_score >= 0 AND max_score <= 100 AND min_score <= max_score)
),
ADD CONSTRAINT knowledge_base_center_check
CHECK (
  center IN (
    'throat',
    'heart',
    'solar-plexus',
    'sacral',
    'root',
    'spleen',
    'g-center',
    'ajna',
    'head'
  )
);

-- Ajout d'index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS knowledge_base_hd_type_idx ON knowledge_base(hd_type);
CREATE INDEX IF NOT EXISTS knowledge_base_score_range_idx ON knowledge_base(min_score, max_score);
CREATE INDEX IF NOT EXISTS knowledge_base_center_idx ON knowledge_base(center);