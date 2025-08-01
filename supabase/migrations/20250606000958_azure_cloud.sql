/*
  # Add unique constraint and guidance data
  
  1. Changes
    - Add unique constraint on hd_type, min_score, max_score, and center
    - Insert guidance data for Projector and Generator types
  
  2. Security
    - No changes to RLS policies
*/

-- Add unique constraint
ALTER TABLE knowledge_base
ADD CONSTRAINT knowledge_base_guidance_unique 
UNIQUE (hd_type, min_score, max_score, center);

-- Insert guidance data
INSERT INTO knowledge_base (
  category,
  hd_type,
  min_score,
  max_score,
  center,
  content,
  title,
  mantra,
  realignment_exercise
)
VALUES
  -- Projector 0-20 Guidance
  ('guidance', 'projector', 0, 20, 'solar-plexus',
   'Accueille tes émotions, ma belle avec douceur. Ton centre plexus solaire t''invite à ressentir sans te juger.',
   'Guidance Projector - Plexus Solaire - Bas Score',
   '{"inhale": "Je m''accueille", "exhale": "Je me ressource"}',
   'Repos émotionnel, Écriture de décharge, Cocooning protecteur'),
   
  ('guidance', 'projector', 0, 20, 'heart',
   'Accueille tes émotions, ma belle avec douceur. Ton centre cœur t''invite à ressentir sans te juger.',
   'Guidance Projector - Cœur - Bas Score',
   '{"inhale": "Je m''accueille", "exhale": "Je me ressource"}',
   'Repos émotionnel, Écriture de décharge, Cocooning protecteur'),
   
  ('guidance', 'projector', 0, 20, 'g-center',
   'Accueille tes émotions, ma belle avec douceur. Ton centre g t''invite à ressentir sans te juger.',
   'Guidance Projector - G Center - Bas Score',
   '{"inhale": "Je m''accueille", "exhale": "Je me ressource"}',
   'Repos émotionnel, Écriture de décharge, Cocooning protecteur'),
   
  -- Generator 81-100 Guidance
  ('guidance', 'generator', 81, 100, 'solar-plexus',
   'Accueille tes émotions, ma belle avec douceur. Ton centre plexus solaire t''invite à ressentir sans te juger.',
   'Guidance Generator - Plexus Solaire - Haut Score',
   '{"inhale": "Je rayonne", "exhale": "Je partage"}',
   'Célébration de son authenticité, Rituel de gratitude émotionnelle, Soutien à une autre femme'),
   
  ('guidance', 'generator', 81, 100, 'heart',
   'Accueille tes émotions, ma belle avec douceur. Ton centre cœur t''invite à ressentir sans te juger.',
   'Guidance Generator - Cœur - Haut Score',
   '{"inhale": "Je rayonne", "exhale": "Je partage"}',
   'Célébration de son authenticité, Rituel de gratitude émotionnelle, Soutien à une autre femme'),
   
  ('guidance', 'generator', 81, 100, 'g-center',
   'Accueille tes émotions, ma belle avec douceur. Ton centre g t''invite à ressentir sans te juger.',
   'Guidance Generator - G Center - Haut Score',
   '{"inhale": "Je rayonne", "exhale": "Je partage"}',
   'Célébration de son authenticité, Rituel de gratitude émotionnelle, Soutien à une autre femme')

ON CONFLICT (hd_type, min_score, max_score, center) 
DO UPDATE SET
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  mantra = EXCLUDED.mantra,
  realignment_exercise = EXCLUDED.realignment_exercise;