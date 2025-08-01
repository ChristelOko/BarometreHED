/*
  # Correction des politiques RLS pour translation_cache
  
  1. Problème
    - Les politiques RLS actuelles sont trop restrictives
    - Les utilisateurs ne peuvent pas insérer de nouvelles entrées dans le cache
  
  2. Solution
    - Supprimer les politiques existantes
    - Créer des politiques plus permissives pour toutes les opérations
    - Permettre aux utilisateurs anonymes et authentifiés d'utiliser le cache
*/

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Allow translation cache read" ON translation_cache;
DROP POLICY IF EXISTS "Allow translation cache insert" ON translation_cache;
DROP POLICY IF EXISTS "Allow translation cache update" ON translation_cache;
DROP POLICY IF EXISTS "Allow translation cache delete" ON translation_cache;
DROP POLICY IF EXISTS "Anyone can read translation cache" ON translation_cache;
DROP POLICY IF EXISTS "Admins can manage translation cache" ON translation_cache;

-- Créer des politiques plus permissives
CREATE POLICY "Allow translation cache read"
  ON translation_cache
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow translation cache insert"
  ON translation_cache
  FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (true);

CREATE POLICY "Allow translation cache update"
  ON translation_cache
  FOR UPDATE
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow translation cache delete"
  ON translation_cache
  FOR DELETE
  TO anon, authenticated, service_role
  USING (true);

-- S'assurer que RLS est activé
ALTER TABLE translation_cache ENABLE ROW LEVEL SECURITY;