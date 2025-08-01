/*
  # Système de gestion de contenu complet

  1. Tables principales
    - `content_types` : Types de contenu (titre, description, bouton, etc.)
    - `content_categories` : Catégories pour organiser les contenus
    - `content_items` : Contenu principal avec versioning
    - `content_translations` : Support multilingue
    - `content_cache` : Cache pour les performances
    - `content_audit` : Audit trail des modifications

  2. Fonctionnalités
    - Versioning automatique des contenus
    - Cache intelligent avec expiration
    - Support multilingue complet
    - Audit trail des modifications
    - RLS pour la sécurité

  3. Optimisations
    - Index sur les colonnes critiques
    - Cache automatique
    - Fonctions utilitaires pour récupération rapide
*/

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des types de contenu
CREATE TABLE IF NOT EXISTS content_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text,
  template jsonb DEFAULT '{}',
  validation_rules jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des catégories de contenu
CREATE TABLE IF NOT EXISTS content_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES content_categories(id) ON DELETE SET NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table principale des contenus
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type_id uuid REFERENCES content_types(id) ON DELETE RESTRICT,
  category_id uuid REFERENCES content_categories(id) ON DELETE SET NULL,
  key text NOT NULL, -- Identifiant unique du contenu (ex: "home.hero.title")
  title text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  tags text[] DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  version integer DEFAULT 1,
  is_current boolean DEFAULT true,
  published_at timestamptz,
  expires_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Contraintes
  CONSTRAINT unique_current_content UNIQUE (key, is_current) DEFERRABLE INITIALLY DEFERRED
);

-- Table des traductions
CREATE TABLE IF NOT EXISTS content_translations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_item_id uuid REFERENCES content_items(id) ON DELETE CASCADE,
  language_code text NOT NULL DEFAULT 'fr',
  title text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  translated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Contraintes
  UNIQUE (content_item_id, language_code)
);

-- Table de cache pour les performances
CREATE TABLE IF NOT EXISTS content_cache (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cache_key text UNIQUE NOT NULL,
  content jsonb NOT NULL,
  language_code text DEFAULT 'fr',
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Table d'audit pour tracer les modifications
CREATE TABLE IF NOT EXISTS content_audit (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_item_id uuid REFERENCES content_items(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('create', 'update', 'delete', 'publish', 'archive')),
  old_values jsonb,
  new_values jsonb,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_content_items_key ON content_items(key);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(content_type_id);
CREATE INDEX IF NOT EXISTS idx_content_items_category ON content_items(category_id);
CREATE INDEX IF NOT EXISTS idx_content_items_current ON content_items(is_current) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_content_items_published ON content_items(published_at) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_content_items_tags ON content_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_items_metadata ON content_items USING GIN(metadata);

CREATE INDEX IF NOT EXISTS idx_content_translations_language ON content_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_content_translations_status ON content_translations(status);

CREATE INDEX IF NOT EXISTS idx_content_cache_key ON content_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_content_cache_expires ON content_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_content_cache_language ON content_cache(language_code);

CREATE INDEX IF NOT EXISTS idx_content_audit_item ON content_audit(content_item_id);
CREATE INDEX IF NOT EXISTS idx_content_audit_action ON content_audit(action);
CREATE INDEX IF NOT EXISTS idx_content_audit_created ON content_audit(created_at);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_content_types_updated_at
  BEFORE UPDATE ON content_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_categories_updated_at
  BEFORE UPDATE ON content_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_items_updated_at
  BEFORE UPDATE ON content_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_translations_updated_at
  BEFORE UPDATE ON content_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour gérer le versioning
CREATE OR REPLACE FUNCTION handle_content_versioning()
RETURNS TRIGGER AS $$
BEGIN
  -- Si on modifie un contenu publié, créer une nouvelle version
  IF OLD.status = 'published' AND NEW.content != OLD.content THEN
    -- Marquer l'ancienne version comme non-courante
    UPDATE content_items 
    SET is_current = false 
    WHERE key = OLD.key AND is_current = true AND id != NEW.id;
    
    -- Incrémenter la version
    NEW.version = OLD.version + 1;
    NEW.is_current = true;
    NEW.status = 'draft';
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour le versioning
CREATE TRIGGER content_versioning_trigger
  BEFORE UPDATE ON content_items
  FOR EACH ROW EXECUTE FUNCTION handle_content_versioning();

-- Fonction pour l'audit trail
CREATE OR REPLACE FUNCTION log_content_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO content_audit (content_item_id, action, new_values, user_id)
    VALUES (NEW.id, 'create', to_jsonb(NEW), NEW.created_by);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO content_audit (content_item_id, action, old_values, new_values, user_id)
    VALUES (NEW.id, 'update', to_jsonb(OLD), to_jsonb(NEW), NEW.updated_by);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO content_audit (content_item_id, action, old_values)
    VALUES (OLD.id, 'delete', to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger pour l'audit
CREATE TRIGGER content_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON content_items
  FOR EACH ROW EXECUTE FUNCTION log_content_changes();

-- Fonction pour nettoyer le cache expiré
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM content_cache WHERE expires_at < now();
END;
$$ language 'plpgsql';

-- Fonction pour invalider le cache
CREATE OR REPLACE FUNCTION invalidate_content_cache()
RETURNS TRIGGER AS $$
BEGIN
  -- Supprimer les entrées de cache liées au contenu modifié
  DELETE FROM content_cache 
  WHERE cache_key LIKE '%' || COALESCE(NEW.key, OLD.key) || '%';
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger pour invalider le cache
CREATE TRIGGER invalidate_cache_trigger
  AFTER INSERT OR UPDATE OR DELETE ON content_items
  FOR EACH ROW EXECUTE FUNCTION invalidate_content_cache();

-- Vue pour récupérer facilement les contenus avec traductions
CREATE OR REPLACE VIEW content_with_translations AS
SELECT 
  ci.id,
  ci.key,
  ci.title,
  ci.content,
  ci.metadata,
  ci.status,
  ci.version,
  ci.published_at,
  ct.name as content_type,
  cc.name as category,
  COALESCE(
    jsonb_object_agg(
      ctr.language_code, 
      jsonb_build_object(
        'title', ctr.title,
        'content', ctr.content,
        'metadata', ctr.metadata,
        'status', ctr.status
      )
    ) FILTER (WHERE ctr.id IS NOT NULL),
    '{}'::jsonb
  ) as translations
FROM content_items ci
LEFT JOIN content_types ct ON ci.content_type_id = ct.id
LEFT JOIN content_categories cc ON ci.category_id = cc.id
LEFT JOIN content_translations ctr ON ci.id = ctr.content_item_id
WHERE ci.is_current = true
GROUP BY ci.id, ci.key, ci.title, ci.content, ci.metadata, ci.status, ci.version, ci.published_at, ct.name, cc.name;

-- Politique de sécurité RLS
ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_audit ENABLE ROW LEVEL SECURITY;

-- Politiques pour la lecture publique des contenus publiés
CREATE POLICY "Public can read published content types"
  ON content_types FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can read active categories"
  ON content_categories FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can read published content"
  ON content_items FOR SELECT
  TO public
  USING (status = 'published' AND is_current = true);

CREATE POLICY "Public can read published translations"
  ON content_translations FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Public can read cache"
  ON content_cache FOR SELECT
  TO public
  USING (expires_at > now());

-- Politiques pour les utilisateurs authentifiés (gestion complète)
CREATE POLICY "Authenticated users can manage content types"
  ON content_types FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage categories"
  ON content_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage content"
  ON content_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage translations"
  ON content_translations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage cache"
  ON content_cache FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read audit"
  ON content_audit FOR SELECT
  TO authenticated
  USING (true);

-- Insertion des types de contenu de base
INSERT INTO content_types (name, description, template) VALUES
('page_title', 'Titres de pages', '{"max_length": 100, "required": true}'),
('page_description', 'Descriptions de pages', '{"max_length": 500, "required": true}'),
('button_text', 'Textes de boutons', '{"max_length": 50, "required": true}'),
('menu_item', 'Elements de menu', '{"max_length": 30, "required": true}'),
('hero_section', 'Sections hero', '{"title": "", "subtitle": "", "cta_text": ""}'),
('feature_section', 'Sections de fonctionnalites', '{"title": "", "description": "", "icon": ""}'),
('error_message', 'Messages d erreur', '{"max_length": 200, "required": true}'),
('success_message', 'Messages de succes', '{"max_length": 200, "required": true}'),
('form_label', 'Labels de formulaires', '{"max_length": 50, "required": true}'),
('tooltip', 'Textes d aide', '{"max_length": 150, "required": true}')
ON CONFLICT (name) DO NOTHING;

-- Insertion des catégories de base
INSERT INTO content_categories (name, slug, description) VALUES
('pages', 'pages', 'Contenus des pages principales'),
('navigation', 'navigation', 'Elements de navigation'),
('forms', 'forms', 'Contenus des formulaires'),
('messages', 'messages', 'Messages systeme'),
('components', 'components', 'Contenus des composants')
ON CONFLICT (name) DO NOTHING;

-- Fonction utilitaire pour récupérer du contenu avec cache
CREATE OR REPLACE FUNCTION get_content(
  content_key text,
  lang_code text DEFAULT 'fr',
  use_cache boolean DEFAULT true
)
RETURNS jsonb AS $$
DECLARE
  cached_content jsonb;
  fresh_content jsonb;
  cache_key_full text;
BEGIN
  cache_key_full := content_key || '_' || lang_code;
  
  -- Vérifier le cache si demandé
  IF use_cache THEN
    SELECT content INTO cached_content
    FROM content_cache
    WHERE cache_key = cache_key_full AND expires_at > now();
    
    IF cached_content IS NOT NULL THEN
      RETURN cached_content;
    END IF;
  END IF;
  
  -- Récupérer le contenu frais
  SELECT jsonb_build_object(
    'id', ci.id,
    'key', ci.key,
    'title', COALESCE(ctr.title, ci.title),
    'content', COALESCE(ctr.content, ci.content),
    'metadata', COALESCE(ctr.metadata, ci.metadata),
    'status', ci.status,
    'published_at', ci.published_at
  ) INTO fresh_content
  FROM content_items ci
  LEFT JOIN content_translations ctr ON ci.id = ctr.content_item_id AND ctr.language_code = lang_code
  WHERE ci.key = content_key 
    AND ci.is_current = true 
    AND ci.status = 'published';
  
  -- Mettre en cache pour 1 heure
  IF fresh_content IS NOT NULL AND use_cache THEN
    INSERT INTO content_cache (cache_key, content, language_code, expires_at)
    VALUES (cache_key_full, fresh_content, lang_code, now() + interval '1 hour')
    ON CONFLICT (cache_key) DO UPDATE SET
      content = EXCLUDED.content,
      expires_at = EXCLUDED.expires_at;
  END IF;
  
  RETURN fresh_content;
END;
$$ language 'plpgsql';

-- Fonction pour récupérer plusieurs contenus d'une page
CREATE OR REPLACE FUNCTION get_page_content(
  page_slug text,
  lang_code text DEFAULT 'fr'
)
RETURNS jsonb AS $$
DECLARE
  page_content jsonb;
BEGIN
  SELECT jsonb_object_agg(
    SUBSTRING(ci.key FROM LENGTH(page_slug) + 2), -- Enlever le préfixe "page_slug."
    jsonb_build_object(
      'title', COALESCE(ctr.title, ci.title),
      'content', COALESCE(ctr.content, ci.content),
      'metadata', COALESCE(ctr.metadata, ci.metadata)
    )
  ) INTO page_content
  FROM content_items ci
  LEFT JOIN content_translations ctr ON ci.id = ctr.content_item_id AND ctr.language_code = lang_code
  WHERE ci.key LIKE page_slug || '.%'
    AND ci.is_current = true 
    AND ci.status = 'published';
  
  RETURN COALESCE(page_content, '{}'::jsonb);
END;
$$ language 'plpgsql';