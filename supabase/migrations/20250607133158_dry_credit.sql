/*
  # Ajouter des données d'exemple pour l'énergie quotidienne
  
  1. Données d'exemple
    - Lecture énergétique pour aujourd'hui
    - Données réalistes et inspirantes
    - Structure complète avec tous les champs
*/

-- Insérer une lecture énergétique pour aujourd'hui
INSERT INTO energetic_readings (
  date,
  day_number,
  day_energy,
  month_energy,
  year_energy,
  description,
  mantra
) VALUES (
  CURRENT_DATE,
  EXTRACT(DOY FROM CURRENT_DATE)::integer,
  'Énergie de transformation et de renouveau',
  'Mois des choix émotionnels, maîtrise intérieure',
  'Renaissance, détachement, maturité spirituelle',
  'Aujourd''hui, l''énergie t''invite à embrasser les changements qui se présentent. C''est un jour propice pour lâcher ce qui ne te sert plus et accueillir le nouveau avec confiance. Ton intuition est particulièrement aiguisée.',
  'Je m''ouvre aux transformations avec confiance et sérénité'
)
ON CONFLICT (date) DO UPDATE SET
  day_energy = EXCLUDED.day_energy,
  month_energy = EXCLUDED.month_energy,
  year_energy = EXCLUDED.year_energy,
  description = EXCLUDED.description,
  mantra = EXCLUDED.mantra;

-- Ajouter quelques lectures pour les jours précédents (optionnel)
INSERT INTO energetic_readings (
  date,
  day_number,
  day_energy,
  month_energy,
  year_energy,
  description,
  mantra
) VALUES 
(
  CURRENT_DATE - INTERVAL '1 day',
  EXTRACT(DOY FROM CURRENT_DATE - INTERVAL '1 day')::integer,
  'Énergie d''ancrage et de stabilité',
  'Mois des choix émotionnels, maîtrise intérieure',
  'Renaissance, détachement, maturité spirituelle',
  'Hier était un jour pour poser des bases solides et cultiver la patience. L''énergie terrestre vous invitait à vous connecter à vos racines.',
  'Je cultive la stabilité et la patience en moi'
),
(
  CURRENT_DATE - INTERVAL '2 days',
  EXTRACT(DOY FROM CURRENT_DATE - INTERVAL '2 days')::integer,
  'Énergie créative et inspirante',
  'Mois des choix émotionnels, maîtrise intérieure',
  'Renaissance, détachement, maturité spirituelle',
  'Une journée riche en inspiration créative. L''énergie vous poussait vers l''expression artistique et la connexion à votre enfant intérieur.',
  'Je laisse ma créativité s''exprimer librement'
)
ON CONFLICT (date) DO NOTHING;