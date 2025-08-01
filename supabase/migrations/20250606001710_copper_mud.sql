/*
  # Add guidance data for emotional and physical paths
  
  1. New Data
    - Adds guidance entries for emotional and physical paths
    - Includes mantras and realignment exercises
    - Covers different HD types and score ranges
  
  2. Changes
    - Uses correct center values from hd_center enum
    - Adds upsert logic to handle existing entries
*/

-- Insert guidance data for emotional and physical paths
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
  -- Emotional Path - Low Scores (0-20)
  ('guidance', 'projector', 0, 20, 'heart',
   'Ton espace émotionnel demande de la douceur et du repos. Accorde-toi ce temps précieux de reconnexion à toi-même.',
   'Guidance Émotionnelle - Projector - Score Bas',
   '{"inhale": "Je m''accueille", "exhale": "avec amour"}',
   'Méditation guidée de l''ancrage émotionnel, Journal des émotions, Bain relaxant aux huiles essentielles'),

  ('guidance', 'generator', 0, 20, 'heart',
   'Ton énergie émotionnelle est en phase de repos. Honore ce besoin de pause et de ressourcement.',
   'Guidance Émotionnelle - Generator - Score Bas',
   '{"inhale": "Je me permets", "exhale": "de ressentir"}',
   'Respiration profonde, Marche en nature, Visualisation apaisante'),

  -- Emotional Path - Medium Scores (40-60)
  ('guidance', 'projector', 40, 60, 'heart',
   'Tu es dans un bel équilibre émotionnel. Continue d''écouter et d''honorer tes ressentis avec bienveillance.',
   'Guidance Émotionnelle - Projector - Score Moyen',
   '{"inhale": "Je suis stable", "exhale": "et centrée"}',
   'Danse libre, Expression créative, Rituel de gratitude'),

  ('guidance', 'generator', 40, 60, 'heart',
   'Ton énergie émotionnelle trouve son rythme. Reste à l''écoute de ce qui résonne en toi.',
   'Guidance Émotionnelle - Generator - Score Moyen',
   '{"inhale": "J''écoute", "exhale": "mes émotions"}',
   'Yoga doux, Méditation du cœur, Écriture intuitive'),

  -- Physical Path - Low Scores (0-20)
  ('guidance', 'projector', 0, 20, 'sacral',
   'Ton corps demande du repos et de l''attention. Offre-lui la douceur et le soin dont il a besoin.',
   'Guidance Physique - Projector - Score Bas',
   '{"inhale": "Je prends soin", "exhale": "de mon corps"}',
   'Repos conscient, Automassage doux, Étirements légers'),

  ('guidance', 'generator', 0, 20, 'sacral',
   'Ton énergie physique est en phase de récupération. Honore ce besoin de régénération.',
   'Guidance Physique - Generator - Score Bas',
   '{"inhale": "Je me régénère", "exhale": "en profondeur"}',
   'Sieste réparatrice, Hydratation consciente, Respiration profonde'),

  -- Physical Path - Medium Scores (40-60)
  ('guidance', 'projector', 40, 60, 'sacral',
   'Ton corps trouve son équilibre. Continue d''être à l''écoute de ses besoins et de ses rythmes.',
   'Guidance Physique - Projector - Score Moyen',
   '{"inhale": "Je suis alignée", "exhale": "dans mon corps"}',
   'Yoga doux, Marche consciente, Exercices d''ancrage'),

  ('guidance', 'generator', 40, 60, 'sacral',
   'Ton énergie physique s''harmonise. Maintiens cette connexion précieuse avec ton corps.',
   'Guidance Physique - Generator - Score Moyen',
   '{"inhale": "Je m''ancre", "exhale": "je m''équilibre"}',
   'Qi Gong, Danse douce, Pratiques d''enracinement')

ON CONFLICT (hd_type, min_score, max_score, center) 
DO UPDATE SET
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  mantra = EXCLUDED.mantra,
  realignment_exercise = EXCLUDED.realignment_exercise;