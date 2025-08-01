/*
  # Système de traduction multilingue complet
  
  1. Nouvelles tables
    - `languages` : Liste des langues supportées
    - `translations` : Stockage des traductions pour chaque clé
    - `translation_keys` : Clés de traduction organisées par catégorie
  
  2. Fonctionnalités
    - Support complet pour plusieurs langues
    - Organisation par catégories (interface, contenu, erreurs, etc.)
    - Système de cache pour les performances
    - API pour récupérer les traductions
  
  3. Optimisations
    - Index sur les colonnes critiques
    - Contraintes d'unicité
    - Fonctions utilitaires pour la gestion des traductions
*/

-- Table des langues supportées
CREATE TABLE IF NOT EXISTS languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  flag text,
  is_active boolean DEFAULT true,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des catégories de traduction
CREATE TABLE IF NOT EXISTS translation_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des clés de traduction
CREATE TABLE IF NOT EXISTS translation_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  description text,
  category_id uuid REFERENCES translation_categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des traductions
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id uuid NOT NULL REFERENCES translation_keys(id) ON DELETE CASCADE,
  language_id uuid NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  value text NOT NULL,
  is_approved boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Contrainte d'unicité pour éviter les doublons
  UNIQUE (key_id, language_id)
);

-- Table de cache pour les traductions
CREATE TABLE IF NOT EXISTS translation_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code text NOT NULL,
  cache_key text NOT NULL,
  data jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  -- Contrainte d'unicité pour le cache
  UNIQUE (language_code, cache_key)
);

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_languages_timestamp
BEFORE UPDATE ON languages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_timestamp();

CREATE TRIGGER update_translation_categories_timestamp
BEFORE UPDATE ON translation_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_timestamp();

CREATE TRIGGER update_translation_keys_timestamp
BEFORE UPDATE ON translation_keys
FOR EACH ROW EXECUTE FUNCTION update_updated_at_timestamp();

CREATE TRIGGER update_translations_timestamp
BEFORE UPDATE ON translations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_timestamp();

-- Fonction pour invalider le cache des traductions
CREATE OR REPLACE FUNCTION invalidate_translation_cache()
RETURNS TRIGGER AS $$
DECLARE
  lang_code text;
BEGIN
  -- Récupérer le code de langue
  SELECT l.code INTO lang_code
  FROM languages l
  WHERE l.id = NEW.language_id OR l.id = OLD.language_id;
  
  -- Supprimer les entrées de cache pour cette langue
  DELETE FROM translation_cache
  WHERE language_code = lang_code;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour invalider le cache quand une traduction est modifiée
CREATE TRIGGER invalidate_cache_on_translation_change
AFTER INSERT OR UPDATE OR DELETE ON translations
FOR EACH ROW EXECUTE FUNCTION invalidate_translation_cache();

-- Fonction pour nettoyer le cache expiré
CREATE OR REPLACE FUNCTION clean_expired_translation_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM translation_cache
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Activer RLS sur toutes les tables
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_cache ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour la lecture publique
CREATE POLICY "Anyone can read active languages"
  ON languages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can read translation categories"
  ON translation_categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read translation keys"
  ON translation_keys FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read approved translations"
  ON translations FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Anyone can read translation cache"
  ON translation_cache FOR SELECT
  USING (expires_at > now());

-- Politiques RLS pour les administrateurs
CREATE POLICY "Admins can manage languages"
  ON languages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage translation categories"
  ON translation_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage translation keys"
  ON translation_keys FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage translations"
  ON translations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage translation cache"
  ON translation_cache FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Insertion des langues par défaut
INSERT INTO languages (code, name, flag, is_active, is_default)
VALUES 
  ('FR', 'Français', '🇫🇷', true, true),
  ('EN', 'English', '🇬🇧', true, false),
  ('IND', 'Indonesia', '🇮🇩', true, false)
ON CONFLICT (code) DO UPDATE
SET 
  name = EXCLUDED.name,
  flag = EXCLUDED.flag,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Insertion des catégories de traduction
INSERT INTO translation_categories (name, description)
VALUES 
  ('common', 'Textes communs à toute l''application'),
  ('navigation', 'Éléments de navigation'),
  ('home', 'Page d''accueil'),
  ('scan', 'Pages de diagnostic'),
  ('results', 'Page de résultats'),
  ('dashboard', 'Tableau de bord'),
  ('settings', 'Paramètres'),
  ('profile', 'Profil utilisateur'),
  ('premium', 'Fonctionnalités premium'),
  ('admin', 'Administration'),
  ('errors', 'Messages d''erreur'),
  ('success', 'Messages de succès')
ON CONFLICT (name) DO UPDATE
SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Fonction pour ajouter une clé de traduction et ses valeurs
CREATE OR REPLACE FUNCTION add_translation(
  p_key text,
  p_category text,
  p_description text,
  p_fr text,
  p_en text,
  p_ind text
)
RETURNS void AS $$
DECLARE
  v_category_id uuid;
  v_key_id uuid;
  v_fr_lang_id uuid;
  v_en_lang_id uuid;
  v_ind_lang_id uuid;
BEGIN
  -- Get category ID
  SELECT id INTO v_category_id
  FROM translation_categories
  WHERE name = p_category;
  
  -- Create key if it doesn't exist
  INSERT INTO translation_keys (key, description, category_id)
  VALUES (p_key, p_description, v_category_id)
  ON CONFLICT (key) DO UPDATE
  SET 
    description = p_description,
    category_id = v_category_id,
    updated_at = now()
  RETURNING id INTO v_key_id;
  
  -- Get language IDs
  SELECT id INTO v_fr_lang_id FROM languages WHERE code = 'FR';
  SELECT id INTO v_en_lang_id FROM languages WHERE code = 'EN';
  SELECT id INTO v_ind_lang_id FROM languages WHERE code = 'IND';
  
  -- Insert translations
  IF p_fr IS NOT NULL THEN
    INSERT INTO translations (key_id, language_id, value)
    VALUES (v_key_id, v_fr_lang_id, p_fr)
    ON CONFLICT (key_id, language_id) DO UPDATE
    SET 
      value = p_fr,
      updated_at = now();
  END IF;
  
  IF p_en IS NOT NULL THEN
    INSERT INTO translations (key_id, language_id, value)
    VALUES (v_key_id, v_en_lang_id, p_en)
    ON CONFLICT (key_id, language_id) DO UPDATE
    SET 
      value = p_en,
      updated_at = now();
  END IF;
  
  IF p_ind IS NOT NULL THEN
    INSERT INTO translations (key_id, language_id, value)
    VALUES (v_key_id, v_ind_lang_id, p_ind)
    ON CONFLICT (key_id, language_id) DO UPDATE
    SET 
      value = p_ind,
      updated_at = now();
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour récupérer toutes les traductions d'une langue
CREATE OR REPLACE FUNCTION get_translations(lang_code text)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  -- Check cache first
  SELECT data INTO result
  FROM translation_cache
  WHERE language_code = lang_code AND expires_at > now();
  
  -- If cache hit, return cached data
  IF result IS NOT NULL THEN
    RETURN result;
  END IF;
  
  -- Otherwise, fetch translations from database
  SELECT jsonb_object_agg(tk.key, t.value) INTO result
  FROM translation_keys tk
  JOIN translations t ON tk.id = t.key_id
  JOIN languages l ON t.language_id = l.id
  WHERE l.code = lang_code AND t.is_approved = true;
  
  -- Cache the result for 1 hour
  INSERT INTO translation_cache (language_code, cache_key, data, expires_at)
  VALUES (lang_code, 'all_translations', result, now() + interval '1 hour')
  ON CONFLICT (language_code, cache_key) DO UPDATE
  SET 
    data = result,
    expires_at = now() + interval '1 hour';
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour récupérer les traductions par catégorie
CREATE OR REPLACE FUNCTION get_translations_by_category(lang_code text, category_name text)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  cache_key text;
BEGIN
  -- Create cache key
  cache_key := 'category_' || category_name;
  
  -- Check cache first
  SELECT data INTO result
  FROM translation_cache
  WHERE language_code = lang_code AND cache_key = cache_key AND expires_at > now();
  
  -- If cache hit, return cached data
  IF result IS NOT NULL THEN
    RETURN result;
  END IF;
  
  -- Otherwise, fetch translations from database
  SELECT jsonb_object_agg(tk.key, t.value) INTO result
  FROM translation_keys tk
  JOIN translations t ON tk.id = t.key_id
  JOIN languages l ON t.language_id = l.id
  JOIN translation_categories tc ON tk.category_id = tc.id
  WHERE l.code = lang_code AND tc.name = category_name AND t.is_approved = true;
  
  -- Cache the result for 1 hour
  INSERT INTO translation_cache (language_code, cache_key, data, expires_at)
  VALUES (lang_code, cache_key, result, now() + interval '1 hour')
  ON CONFLICT (language_code, cache_key) DO UPDATE
  SET 
    data = result,
    expires_at = now() + interval '1 hour';
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour récupérer une traduction spécifique
CREATE OR REPLACE FUNCTION get_translation(lang_code text, translation_key text)
RETURNS text AS $$
DECLARE
  result text;
BEGIN
  SELECT t.value INTO result
  FROM translation_keys tk
  JOIN translations t ON tk.id = t.key_id
  JOIN languages l ON t.language_id = l.id
  WHERE l.code = lang_code AND tk.key = translation_key AND t.is_approved = true;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour importer des traductions depuis un fichier JSON
CREATE OR REPLACE FUNCTION import_translations_from_json(translations_json jsonb)
RETURNS void AS $$
DECLARE
  category text;
  key text;
  translation jsonb;
BEGIN
  -- Parcourir les catégories
  FOR category IN SELECT jsonb_object_keys(translations_json)
  LOOP
    -- Parcourir les clés de chaque catégorie
    FOR key IN SELECT jsonb_object_keys(translations_json->category)
    LOOP
      -- Récupérer la traduction
      translation := translations_json->category->key;
      
      -- Ajouter la traduction
      PERFORM add_translation(
        category || '.' || key,
        category,
        translation->>'description',
        translation->>'fr',
        translation->>'en',
        translation->>'ind'
      );
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Créer une vue pour faciliter la gestion des traductions
CREATE OR REPLACE VIEW translation_management AS
SELECT 
  tk.id AS key_id,
  tk.key,
  tk.description,
  tc.name AS category,
  fr.value AS fr_value,
  en.value AS en_value,
  ind.value AS ind_value,
  tk.created_at,
  tk.updated_at
FROM translation_keys tk
LEFT JOIN translation_categories tc ON tk.category_id = tc.id
LEFT JOIN (
  SELECT t.key_id, t.value
  FROM translations t
  JOIN languages l ON t.language_id = l.id
  WHERE l.code = 'FR'
) fr ON tk.id = fr.key_id
LEFT JOIN (
  SELECT t.key_id, t.value
  FROM translations t
  JOIN languages l ON t.language_id = l.id
  WHERE l.code = 'EN'
) en ON tk.id = en.key_id
LEFT JOIN (
  SELECT t.key_id, t.value
  FROM translations t
  JOIN languages l ON t.language_id = l.id
  WHERE l.code = 'IND'
) ind ON tk.id = ind.key_id
ORDER BY tc.name, tk.key;

-- Créer une vue pour les statistiques de traduction
CREATE OR REPLACE VIEW translation_stats AS
SELECT
  l.code AS language_code,
  l.name AS language_name,
  COUNT(t.id) AS translated_count,
  (SELECT COUNT(*) FROM translation_keys) AS total_keys,
  ROUND(COUNT(t.id)::numeric / (SELECT COUNT(*) FROM translation_keys) * 100, 2) AS completion_percentage
FROM languages l
LEFT JOIN translations t ON l.id = t.language_id
GROUP BY l.id, l.code, l.name
ORDER BY l.is_default DESC, completion_percentage DESC;

-- Créer des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_translations_key_id ON translations(key_id);
CREATE INDEX IF NOT EXISTS idx_translations_language_id ON translations(language_id);
CREATE INDEX IF NOT EXISTS idx_translation_keys_category_id ON translation_keys(category_id);
CREATE INDEX IF NOT EXISTS idx_translation_cache_expires ON translation_cache(expires_at);