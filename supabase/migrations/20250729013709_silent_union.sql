/*
  # Ajout de la colonne cover_photo

  1. Modifications
    - Ajouter la colonne `cover_photo` à la table `user_profiles_extended`
    - Type: text (pour stocker l'URL de la photo de couverture)
    - Nullable: true (optionnel)

  2. Sécurité
    - Aucune modification des politiques RLS nécessaire
    - La colonne hérite des permissions existantes de la table
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles_extended' AND column_name = 'cover_photo'
  ) THEN
    ALTER TABLE user_profiles_extended ADD COLUMN cover_photo text;
  END IF;
END $$;