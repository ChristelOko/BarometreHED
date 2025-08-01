/*
  # Permettre plusieurs scans par jour
  
  1. Suppression de la contrainte unique
    - Supprime l'index unique qui limite à un scan par jour
    - Permet maintenant plusieurs scans quotidiens
  
  2. Nouveau système de gestion
    - Les scans peuvent être créés librement
    - Chaque scan garde sa propre identité
    - L'historique complet est préservé
*/

-- Supprimer l'index unique qui empêche plusieurs scans par jour
DROP INDEX IF EXISTS scans_user_daily_unique_idx;

-- Supprimer la fonction helper qui n'est plus nécessaire
DROP FUNCTION IF EXISTS trunc_date(timestamptz);

-- Créer un nouvel index pour optimiser les requêtes sans contrainte unique
CREATE INDEX IF NOT EXISTS scans_user_date_created_idx 
ON scans(user_id, date DESC, created_at DESC);

-- Ajouter un commentaire pour clarifier le nouveau comportement
COMMENT ON TABLE scans IS 'Table des scans énergétiques - plusieurs scans par jour sont autorisés';