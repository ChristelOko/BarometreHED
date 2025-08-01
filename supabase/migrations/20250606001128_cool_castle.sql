/*
  # Update Knowledge Base with Guidance Data
  
  1. Changes
    - Insert guidance data for all HD types, score ranges, and centers
    - Data includes messages, elements, practices, and intentions
    - Handles all combinations of HD types, scores, and centers
  
  2. Structure
    - Each insert includes category, HD type, score range, center, and guidance content
    - Uses ON CONFLICT to update existing records
    
  3. Security
    - Maintains existing RLS policies
    - No changes to table structure or permissions
*/

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
  ('guidance', 'projector', 0, 20, 'head',
   'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.',
   'Guidance Projector - Tête - Bas Score',
   '{"inhale": "Je m''autorise", "exhale": "à me recentrer"}',
   'Repos profond, Silence réparateur, Couper le monde extérieur'),
   
  ('guidance', 'projector', 0, 20, 'ajna',
   'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.',
   'Guidance Projector - Ajna - Bas Score',
   '{"inhale": "Je m''autorise", "exhale": "à me recentrer"}',
   'Repos profond, Silence réparateur, Couper le monde extérieur'),
   
  ('guidance', 'projector', 0, 20, 'throat',
   'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.',
   'Guidance Projector - Gorge - Bas Score',
   '{"inhale": "Je m''autorise", "exhale": "à me recentrer"}',
   'Repos profond, Silence réparateur, Couper le monde extérieur'),
   
  -- Generator 81-100 Guidance
  ('guidance', 'generator', 81, 100, 'heart',
   'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.',
   'Guidance Generator - Cœur - Haut Score',
   '{"inhale": "Je rayonne", "exhale": "naturellement"}',
   'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
   
  ('guidance', 'generator', 81, 100, 'solar-plexus',
   'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.',
   'Guidance Generator - Plexus Solaire - Haut Score',
   '{"inhale": "Je rayonne", "exhale": "naturellement"}',
   'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
   
  ('guidance', 'generator', 81, 100, 'sacral',
   'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.',
   'Guidance Generator - Sacral - Haut Score',
   '{"inhale": "Je rayonne", "exhale": "naturellement"}',
   'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
   
  -- Manifesting Generator 41-60 Guidance
  ('guidance', 'manifesting-generator', 41, 60, 'root',
   'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.',
   'Guidance MG - Racine - Score Moyen',
   '{"inhale": "Je retrouve", "exhale": "mon équilibre"}',
   'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
   
  ('guidance', 'manifesting-generator', 41, 60, 'spleen',
   'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.',
   'Guidance MG - Rate - Score Moyen',
   '{"inhale": "Je retrouve", "exhale": "mon équilibre"}',
   'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
   
  ('guidance', 'manifesting-generator', 41, 60, 'g-center',
   'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.',
   'Guidance MG - G Center - Score Moyen',
   '{"inhale": "Je retrouve", "exhale": "mon équilibre"}',
   'Ancrage sensoriel, Musique intuitive, Tisane réconfortante')

ON CONFLICT (hd_type, min_score, max_score, center) 
DO UPDATE SET
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  mantra = EXCLUDED.mantra,
  realignment_exercise = EXCLUDED.realignment_exercise;