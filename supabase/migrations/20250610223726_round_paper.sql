/*
  # Système de récolte d'avis utilisateurs
  
  1. Nouvelles tables
    - `feedbacks` : Stocke les avis des utilisateurs
    - `user_feedback_status` : Suit le nombre d'utilisations et si l'utilisateur a déjà donné son avis
  
  2. Fonctionnalités
    - Suivi du nombre d'utilisations de l'application par utilisateur
    - Stockage des avis avec note (1-5 étoiles) et commentaire
    - Option pour rendre les avis publics ou privés
  
  3. Sécurité
    - Politiques RLS pour protéger les données
    - Les utilisateurs ne peuvent voir que leurs propres statuts
    - Seuls les administrateurs peuvent voir tous les avis
*/

-- Table pour les avis utilisateurs
CREATE TABLE IF NOT EXISTS feedbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Table pour suivre le statut des avis par utilisateur
CREATE TABLE IF NOT EXISTS user_feedback_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  usage_count integer DEFAULT 0,
  has_submitted_feedback boolean DEFAULT false,
  last_updated timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback_status ENABLE ROW LEVEL SECURITY;

-- Politiques pour les avis
CREATE POLICY "Users can insert their own feedback"
  ON feedbacks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
  ON feedbacks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public feedbacks"
  ON feedbacks
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "Admins can manage all feedbacks"
  ON feedbacks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Politiques pour le statut des avis
CREATE POLICY "Users can view their own feedback status"
  ON user_feedback_status
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback statuses"
  ON user_feedback_status
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "System can update feedback status"
  ON user_feedback_status
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert feedback status"
  ON user_feedback_status
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Créer des index pour les performances
CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_is_public ON feedbacks(is_public);
CREATE INDEX IF NOT EXISTS idx_feedbacks_rating ON feedbacks(rating);
CREATE INDEX IF NOT EXISTS idx_user_feedback_status_user_id ON user_feedback_status(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_status_has_submitted ON user_feedback_status(has_submitted_feedback);

-- Fonction pour obtenir les statistiques des avis
CREATE OR REPLACE FUNCTION get_feedback_stats()
RETURNS json AS $$
DECLARE
  total_count integer;
  avg_rating numeric;
  rating_distribution json;
  recent_feedbacks json;
BEGIN
  -- Nombre total d'avis
  SELECT COUNT(*) INTO total_count FROM feedbacks;
  
  -- Note moyenne
  SELECT COALESCE(AVG(rating), 0) INTO avg_rating FROM feedbacks;
  
  -- Distribution des notes
  SELECT json_build_object(
    '5', COUNT(*) FILTER (WHERE rating = 5),
    '4', COUNT(*) FILTER (WHERE rating = 4),
    '3', COUNT(*) FILTER (WHERE rating = 3),
    '2', COUNT(*) FILTER (WHERE rating = 2),
    '1', COUNT(*) FILTER (WHERE rating = 1)
  ) INTO rating_distribution
  FROM feedbacks;
  
  -- Avis récents (5 derniers)
  SELECT json_agg(f)
  FROM (
    SELECT id, user_name, rating, comment, created_at
    FROM feedbacks
    ORDER BY created_at DESC
    LIMIT 5
  ) f INTO recent_feedbacks;
  
  -- Retourner toutes les statistiques
  RETURN json_build_object(
    'total_count', total_count,
    'average_rating', ROUND(avg_rating, 1),
    'rating_distribution', rating_distribution,
    'recent_feedbacks', recent_feedbacks
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Accorder les permissions d'exécution
GRANT EXECUTE ON FUNCTION get_feedback_stats() TO authenticated;