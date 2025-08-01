/*
  # Système de gestion de contenu
  
  1. Nouvelle table
    - `content_pages` pour stocker tous les contenus des pages
      - `id` (uuid, primary key)
      - `page_slug` (text, identifiant de la page)
      - `section_key` (text, clé de la section)
      - `content_type` (text, type de contenu)
      - `title` (text, titre)
      - `content` (text, contenu principal)
      - `metadata` (jsonb, métadonnées additionnelles)
      - `order_index` (integer, ordre d'affichage)
      - `is_active` (boolean, contenu actif)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Sécurité
    - Enable RLS
    - Politique de lecture publique pour les contenus actifs
    - Politique d'écriture pour les administrateurs
  
  3. Index
    - Index sur page_slug et section_key pour les requêtes rapides
    - Index sur is_active pour filtrer les contenus actifs
*/

-- Créer la table de gestion de contenu
CREATE TABLE IF NOT EXISTS content_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL,
  section_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  title text,
  content text,
  metadata jsonb DEFAULT '{}',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ajouter les contraintes
ALTER TABLE content_pages
ADD CONSTRAINT content_pages_content_type_check 
CHECK (content_type IN ('text', 'hero', 'feature', 'step', 'testimonial', 'faq', 'cta'));

-- Créer un index unique pour éviter les doublons
CREATE UNIQUE INDEX content_pages_unique_section_idx 
ON content_pages(page_slug, section_key, order_index) 
WHERE is_active = true;

-- Créer les index pour les performances
CREATE INDEX content_pages_page_slug_idx ON content_pages(page_slug);
CREATE INDEX content_pages_section_key_idx ON content_pages(section_key);
CREATE INDEX content_pages_is_active_idx ON content_pages(is_active);
CREATE INDEX content_pages_order_idx ON content_pages(order_index);

-- Activer RLS
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique pour les contenus actifs
CREATE POLICY "Anyone can read active content"
  ON content_pages
  FOR SELECT
  USING (is_active = true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_content_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_content_pages_updated_at
  BEFORE UPDATE ON content_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_content_pages_updated_at();

-- Insérer le contenu de la page d'accueil
INSERT INTO content_pages (page_slug, section_key, content_type, title, content, metadata, order_index) VALUES

-- Section Hero
('home', 'hero', 'hero', 'Ressentez votre énergie profonde', 'Explorez votre équilibre énergétique basé sur le Human Design. Un voyage intuitif pour les femmes qui souhaitent vivre en harmonie avec leur nature profonde.', 
'{"subtitle": "\"Votre corps sait. Votre énergie parle. Écoutez.\"", "cta_text": "Lancer le scan", "cta_action": "/scan"}', 1),

-- Section Pourquoi scanner
('home', 'why_scan', 'feature', 'Pourquoi scanner ton énergie chaque jour ?', 'Ton énergie est ton langage intérieur. Chaque tension, chaque joie, chaque fatigue est un message. Le Baromètre Énergétique t''aide à écouter ce langage subtil, à reconnaître ce qui se vit en toi, et à t''offrir l''ajustement dont tu as besoin — émotionnel, physique, mental ou spirituel.', 
'{"highlight": "✨ C''est un miroir doux, non intrusif, profondément féminin.", "icon": "heart"}', 2),

-- Section Comment ça marche - Titre
('home', 'how_it_works', 'feature', 'Comment ça marche ?', 'Découvre en 3 étapes simples comment le Baromètre Énergétique t''accompagne dans ta reconnexion quotidienne.', 
'{"icon": "compass"}', 3),

-- Étape 1
('home', 'how_it_works_step1', 'step', 'Scanner ton énergie', 'Je choisis ce que je ressens en ce moment (corps, cœur, tête)', 
'{"icon": "scan", "step_number": 1, "color": "primary"}', 4),

-- Étape 2
('home', 'how_it_works_step2', 'step', 'Recevoir un éclairage personnalisé', 'Je découvre quel centre HD est touché, et ce que cela me dit de moi', 
'{"icon": "lightbulb", "step_number": 2, "color": "secondary"}', 5),

-- Étape 3
('home', 'how_it_works_step3', 'step', 'Me réaligner en douceur', 'Je reçois un mantra, une phrase miroir, un rituel doux… et je repars centrée.', 
'{"icon": "heart", "step_number": 3, "color": "accent"}', 6),

-- Section Daily Energy
('home', 'daily_energy', 'feature', 'Ton énergie quotidienne', 'Chaque jour est unique, et ton énergie aussi. Découvre comment elle évolue et ce qu''elle te révèle sur ton chemin.', 
'{"icon": "sun", "highlight": "🌸 Un rendez-vous quotidien avec toi-même"}', 7),

-- Section Features
('home', 'features_title', 'feature', 'Comment fonctionne le Baromètre Énergétique', 'Un outil pensé pour les femmes qui souhaitent se reconnecter à leur essence profonde.', 
'{"icon": "sparkles"}', 8),

-- Feature 1
('home', 'feature_diagnostic', 'feature', 'Diagnostic intuitif', 'Répondez à des questions simples sur votre ressenti physique, émotionnel et énergétique actuel.', 
'{"icon": "heart", "step_number": 1, "color": "primary"}', 9),

-- Feature 2
('home', 'feature_analysis', 'feature', 'Analyse énergétique', 'Recevez une analyse basée sur votre type Human Design et votre cycle menstruel.', 
'{"icon": "brain", "step_number": 2, "color": "secondary"}', 10),

-- Feature 3
('home', 'feature_guidance', 'feature', 'Guidance personnalisée', 'Obtenez des conseils adaptés à votre état énergétique et suivez votre progression au fil du temps.', 
'{"icon": "compass", "step_number": 3, "color": "accent"}', 11);