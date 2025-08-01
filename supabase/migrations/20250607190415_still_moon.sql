/*
  # Création de la table content_pages pour stocker tous les contenus

  1. Nouvelle table
    - `content_pages` pour stocker tous les textes de l'application
    - Structure simple avec page_slug, section_key, title, content
    - Métadonnées JSON pour les données supplémentaires
    - Index optimisés pour les performances

  2. Sécurité
    - RLS activé
    - Politique de lecture publique pour les contenus actifs

  3. Contenu pré-rempli
    - Page d'accueil complète
    - Messages système
    - Navigation
    - Boutons et formulaires
*/

-- Table simplifiée pour les contenus de pages
CREATE TABLE IF NOT EXISTS content_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL, -- ex: 'home', 'about', 'scan'
  section_key text NOT NULL, -- ex: 'hero', 'features', 'cta'
  content_type text NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'hero', 'feature', 'step', 'testimonial', 'faq', 'cta')),
  title text,
  content text,
  metadata jsonb DEFAULT '{}',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS content_pages_page_slug_idx ON content_pages(page_slug);
CREATE INDEX IF NOT EXISTS content_pages_section_key_idx ON content_pages(section_key);
CREATE INDEX IF NOT EXISTS content_pages_is_active_idx ON content_pages(is_active);
CREATE INDEX IF NOT EXISTS content_pages_order_idx ON content_pages(order_index);

-- Index unique conditionnel pour éviter les doublons sur les contenus actifs
CREATE UNIQUE INDEX IF NOT EXISTS content_pages_unique_section_idx 
ON content_pages(page_slug, section_key, order_index) 
WHERE is_active = true;

-- Fonction pour mettre à jour updated_at (avec DROP IF EXISTS pour éviter les conflits)
DROP FUNCTION IF EXISTS update_content_pages_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION update_content_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at (avec DROP IF EXISTS pour éviter les conflits)
DROP TRIGGER IF EXISTS update_content_pages_updated_at ON content_pages;

CREATE TRIGGER update_content_pages_updated_at
  BEFORE UPDATE ON content_pages
  FOR EACH ROW EXECUTE FUNCTION update_content_pages_updated_at();

-- Politique de sécurité RLS
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Anyone can read active content" ON content_pages;

-- Politique pour lecture publique des contenus actifs
CREATE POLICY "Anyone can read active content"
  ON content_pages FOR SELECT
  TO public
  USING (is_active = true);

-- Insertion du contenu de la page d'accueil
INSERT INTO content_pages (page_slug, section_key, content_type, title, content, metadata, order_index) VALUES

-- Section Hero
('home', 'hero', 'hero', 
 'Ressentez votre énergie profonde', 
 'Explorez votre équilibre énergétique basé sur le Human Design et découvrez les messages de votre corps.',
 '{"subtitle": "Votre corps sait. Votre énergie parle. Écoutez.", "cta_text": "Lancer le scan", "cta_action": "/scan"}',
 1),

-- Section Pourquoi scanner
('home', 'why_scan', 'feature',
 'Pourquoi scanner ton énergie chaque jour ?',
 'Ton énergie est ton langage intérieur. Chaque tension, chaque joie, chaque fatigue est un message précieux qui mérite d''être écouté et compris. Ce scan t''aide à décoder ces signaux avec douceur et précision.',
 '{"highlight": "✨ Un miroir doux pour ton bien-être", "icon": "heart"}',
 2),

-- Section Comment ça marche
('home', 'how_it_works', 'feature',
 'Comment ça marche',
 'Un processus simple et intuitif pour explorer votre énergie en 3 étapes.',
 '{"subtitle": "Découvrez votre équilibre énergétique en quelques minutes"}',
 3),

-- Étapes du processus
('home', 'step_1', 'step',
 'Écoute',
 'Connecte-toi à tes ressentis du moment présent. Prends le temps d''observer ce que ton corps et ton cœur te disent.',
 '{"icon": "heart", "color": "primary", "step_number": 1}',
 4),

('home', 'step_2', 'step',
 'Analyse',
 'Découvre ton état énergétique personnalisé basé sur ton type Human Design et tes ressentis actuels.',
 '{"icon": "brain", "color": "secondary", "step_number": 2}',
 5),

('home', 'step_3', 'step',
 'Harmonise',
 'Reçois des conseils adaptés à ton profil pour rééquilibrer et nourrir ton énergie naturelle.',
 '{"icon": "sparkles", "color": "accent", "step_number": 3}',
 6),

-- Messages système
('system', 'loading', 'text',
 'Chargement...',
 'Harmonisation des énergies en cours...',
 '{}',
 1),

('system', 'error_generic', 'text',
 'Erreur',
 'Une erreur est survenue. Veuillez réessayer.',
 '{}',
 2),

('system', 'success_scan', 'text',
 'Scan terminé',
 'Votre analyse énergétique est prête !',
 '{}',
 3),

('system', 'error_network', 'text',
 'Erreur de connexion',
 'Vérifiez votre connexion internet et réessayez.',
 '{}',
 4),

('system', 'error_auth', 'text',
 'Erreur d''authentification',
 'Veuillez vous reconnecter.',
 '{}',
 5),

('system', 'success_login', 'text',
 'Connexion réussie',
 'Bienvenue dans votre espace personnel !',
 '{}',
 6),

('system', 'success_save', 'text',
 'Sauvegarde réussie',
 'Vos données ont été enregistrées avec succès.',
 '{}',
 7),

-- Navigation
('navigation', 'menu_home', 'text',
 'Accueil',
 'Retour à la page d''accueil',
 '{}',
 1),

('navigation', 'menu_scan', 'text',
 'Diagnostic',
 'Commencer un scan énergétique',
 '{}',
 2),

('navigation', 'menu_dashboard', 'text',
 'Tableau de Bord',
 'Voir mes résultats et statistiques',
 '{}',
 3),

('navigation', 'menu_about', 'text',
 'À propos',
 'En savoir plus sur le projet',
 '{}',
 4),

-- Boutons et actions
('buttons', 'start_scan', 'text',
 'Commencer mon scan',
 'Lancer le diagnostic énergétique',
 '{}',
 1),

('buttons', 'view_results', 'text',
 'Voir mes résultats',
 'Consulter l''analyse énergétique',
 '{}',
 2),

('buttons', 'new_scan', 'text',
 'Nouveau scan',
 'Refaire un diagnostic',
 '{}',
 3),

('buttons', 'dashboard', 'text',
 'Tableau de bord',
 'Accéder au tableau de bord',
 '{}',
 4),

-- Formulaires
('forms', 'email_label', 'text',
 'Email',
 'Votre adresse email',
 '{}',
 1),

('forms', 'password_label', 'text',
 'Mot de passe',
 'Votre mot de passe',
 '{}',
 2),

('forms', 'name_label', 'text',
 'Nom',
 'Votre nom complet',
 '{}',
 3),

-- Page de scan
('scan', 'welcome_title', 'text',
 'Bienvenue dans ton espace diagnostic',
 'Prends un moment pour te poser et te connecter à ton ressenti.',
 '{}',
 1),

('scan', 'category_selection', 'text',
 'Quelle dimension souhaites-tu explorer ?',
 'Choisis la catégorie qui résonne avec toi aujourd''hui.',
 '{}',
 2),

-- Résultats
('results', 'welcome_message', 'text',
 'Voici ton paysage énergétique',
 'Découvre l''analyse de ton état énergétique actuel.',
 '{}',
 1),

('results', 'guidance_title', 'text',
 'Carte de Guidance',
 'Tes conseils personnalisés pour harmoniser ton énergie.',
 '{}',
 2),

-- Textes de la page About
('about', 'hero_title', 'text',
 'À propos du Baromètre Énergétique',
 'Découvrez l''histoire et la mission de notre projet.',
 '{}',
 1),

('about', 'mission', 'text',
 'Notre mission',
 'Accompagner les femmes dans leur reconnexion à leur énergie naturelle grâce au Human Design.',
 '{}',
 2),

-- Textes de la page Contact
('contact', 'hero_title', 'text',
 'Contactez-nous',
 'Nous sommes là pour vous accompagner dans votre parcours énergétique.',
 '{}',
 1),

('contact', 'form_title', 'text',
 'Formulaire de contact',
 'Envoyez-nous un message, nous vous répondrons rapidement.',
 '{}',
 2)

ON CONFLICT DO NOTHING;