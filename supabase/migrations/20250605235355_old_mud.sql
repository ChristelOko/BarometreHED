/*
  # Add guidance system tables
  
  1. New Tables
    - `guidance` table for storing HD type-specific guidance
      - `id` (uuid, primary key)
      - `hd_type` (enum)
      - `score_range` (int4range)
      - `center` (enum)
      - `message` (text)
      - `element` (text)
      - `practices` (text[])
      - `intention` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `guidance` table
    - Add policy for authenticated users to read guidance
*/

-- Create enum types for HD types and centers
DO $$ BEGIN
  CREATE TYPE hd_type AS ENUM (
    'generator',
    'projector',
    'manifesting-generator',
    'manifestor',
    'reflector'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE hd_center AS ENUM (
    'throat',
    'heart',
    'solar_plexus',
    'sacral',
    'root',
    'spleen',
    'g_center',
    'ajna',
    'head'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create guidance table
CREATE TABLE IF NOT EXISTS guidance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hd_type hd_type NOT NULL,
  score_range int4range NOT NULL,
  center hd_center NOT NULL,
  message text NOT NULL,
  element text NOT NULL,
  practices text[] NOT NULL,
  intention text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create unique constraint for type-score-center combination
CREATE UNIQUE INDEX guidance_type_score_center_idx 
ON guidance(hd_type, score_range, center);

-- Enable RLS
ALTER TABLE guidance ENABLE ROW LEVEL SECURITY;

-- Create policy for reading guidance
CREATE POLICY "Anyone can read guidance"
  ON guidance
  FOR SELECT
  TO authenticated
  USING (true);

-- Import guidance data
INSERT INTO guidance (hd_type, score_range, center, message, element, practices, intention)
VALUES
  ('projector', '[0,20]', 'solar_plexus', 
   'Accueille tes émotions, ma belle avec douceur. Ton centre plexus solaire t''invite à ressentir sans te juger.',
   'Eau',
   ARRAY['Repos émotionnel', 'Écriture de décharge', 'Cocooning protecteur'],
   'Je m''autorise à être vulnérable et à me replier si nécessaire.'),
  
  ('projector', '[0,20]', 'heart',
   'Accueille tes émotions, ma belle avec douceur. Ton centre cœur t''invite à ressentir sans te juger.',
   'Feu',
   ARRAY['Repos émotionnel', 'Écriture de décharge', 'Cocooning protecteur'],
   'Je m''autorise à être vulnérable et à me replier si nécessaire.'),
   
  ('generator', '[81,100]', 'heart',
   'Accueille tes émotions, ma belle avec douceur. Ton centre cœur t''invite à ressentir sans te juger.',
   'Feu',
   ARRAY['Célébration de son authenticité', 'Rituel de gratitude émotionnelle', 'Soutien à une autre femme'],
   'Je rayonne depuis l''espace sacré de mon cœur pleinement ressenti.')
;