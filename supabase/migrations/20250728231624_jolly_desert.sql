/*
  # Tables pour les profils utilisateurs et la communauté

  1. Tables créées
    - `user_privacy_settings` - Paramètres de confidentialité des profils
    - `user_follows` - Relations de suivi entre utilisateurs
    - `user_profiles_extended` - Informations étendues des profils
    - `community_posts` - Posts de la communauté (si pas déjà existante)

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques appropriées pour chaque table
    - Index pour les performances
*/

-- Table des paramètres de confidentialité
CREATE TABLE IF NOT EXISTS user_privacy_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  show_stats boolean DEFAULT true,
  show_posts boolean DEFAULT true,
  show_hd_type boolean DEFAULT true,
  show_location boolean DEFAULT false,
  show_website boolean DEFAULT true,
  allow_messages boolean DEFAULT true,
  allow_follow boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Table des relations de suivi
CREATE TABLE IF NOT EXISTS user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Table des informations étendues de profil
CREATE TABLE IF NOT EXISTS user_profiles_extended (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  location text,
  website text,
  social_links jsonb DEFAULT '{}',
  interests text[],
  is_verified boolean DEFAULT false,
  verification_date timestamptz,
  last_active timestamptz DEFAULT now(),
  profile_views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Table des posts communautaires (si elle n'existe pas déjà)
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name text NOT NULL,
  hd_type text,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('experience', 'question', 'insight', 'celebration')),
  tags text[] DEFAULT '{}',
  is_anonymous boolean DEFAULT false,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_extended_user_id ON user_profiles_extended(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_extended_location ON user_profiles_extended(location);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_published ON community_posts(is_published);

-- Activer RLS
ALTER TABLE user_privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles_extended ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_privacy_settings
CREATE POLICY "Users can manage their own privacy settings"
  ON user_privacy_settings
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Politiques pour user_follows
CREATE POLICY "Users can manage their own follows"
  ON user_follows
  FOR ALL
  TO authenticated
  USING (follower_id = auth.uid())
  WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can see who follows them"
  ON user_follows
  FOR SELECT
  TO authenticated
  USING (following_id = auth.uid());

CREATE POLICY "Public can see follow relationships for public profiles"
  ON user_follows
  FOR SELECT
  TO authenticated
  USING (true);

-- Politiques pour user_profiles_extended
CREATE POLICY "Users can manage their own extended profile"
  ON user_profiles_extended
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Public can view extended profiles"
  ON user_profiles_extended
  FOR SELECT
  TO authenticated
  USING (true);

-- Politiques pour community_posts
CREATE POLICY "Users can create their own posts"
  ON community_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own posts"
  ON community_posts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own posts"
  ON community_posts
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Everyone can view published posts"
  ON community_posts
  FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_user_privacy_settings_updated_at
  BEFORE UPDATE ON user_privacy_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_extended_updated_at
  BEFORE UPDATE ON user_profiles_extended
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();