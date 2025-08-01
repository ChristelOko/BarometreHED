/*
  # Import des données de guidance - Version corrigée
  
  1. Suppression des données existantes
    - Vide la table knowledge_base pour éviter les doublons
  
  2. Import des nouvelles données
    - Projector : Toutes les tranches de scores pour Général
    - Émotionnel : Centres spécifiques (pas de doublons avec Général)
    - Physique : Centres spécifiques (pas de doublons avec Général)
    - Generator : Exemples de base
  
  3. Évitement des conflits
    - Chaque combinaison (hd_type, min_score, max_score, center) est unique
    - Séparation claire entre les catégories
*/

-- Vider la table pour éviter les doublons
DELETE FROM knowledge_base WHERE category = 'guidance';

-- Import des données GÉNÉRALES - PROJECTOR
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
-- Projector Général 0-20
('guidance', 'projector', 0, 20, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Général - Projector - Tête - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Général - Projector - Ajna - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Général - Projector - Gorge - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Général - Projector - G - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Général - Projector - Cœur - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Général - Projector - Rate - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Général - Projector - Sacral - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Général - Projector - Plexus - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Général - Projector - Racine - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur');

-- Projector Général 21-40
INSERT INTO knowledge_base (category, hd_type, min_score, max_score, center, content, title, mantra, realignment_exercise)
VALUES
('guidance', 'projector', 21, 40, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Général - Projector - Tête - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Général - Projector - Ajna - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Général - Projector - Gorge - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Général - Projector - G - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Général - Projector - Cœur - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Général - Projector - Rate - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Général - Projector - Sacral - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Général - Projector - Plexus - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Général - Projector - Racine - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience');

-- Projector Général 41-60
INSERT INTO knowledge_base (category, hd_type, min_score, max_score, center, content, title, mantra, realignment_exercise)
VALUES
('guidance', 'projector', 41, 60, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Général - Projector - Tête - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Général - Projector - Ajna - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Général - Projector - Gorge - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Général - Projector - G - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Général - Projector - Cœur - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Général - Projector - Rate - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Général - Projector - Sacral - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Général - Projector - Plexus - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Général - Projector - Racine - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante');

-- Projector Général 61-80
INSERT INTO knowledge_base (category, hd_type, min_score, max_score, center, content, title, mantra, realignment_exercise)
VALUES
('guidance', 'projector', 61, 80, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Général - Projector - Tête - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Général - Projector - Ajna - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Général - Projector - Gorge - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Général - Projector - G - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Général - Projector - Cœur - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Général - Projector - Rate - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Général - Projector - Sacral - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Général - Projector - Plexus - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Général - Projector - Racine - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite');

-- Projector Général 81-100
INSERT INTO knowledge_base (category, hd_type, min_score, max_score, center, content, title, mantra, realignment_exercise)
VALUES
('guidance', 'projector', 81, 100, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Général - Projector - Tête - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Général - Projector - Ajna - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Général - Projector - Gorge - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Général - Projector - G - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Général - Projector - Cœur - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Général - Projector - Rate - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Général - Projector - Sacral - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Général - Projector - Plexus - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Général - Projector - Racine - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre');

-- GENERATOR - Exemples de base pour différents centres
INSERT INTO knowledge_base (category, hd_type, min_score, max_score, center, content, title, mantra, realignment_exercise)
VALUES
-- Generator Général 81-100 (centres différents de Projector pour éviter les conflits)
('guidance', 'generator', 81, 100, 'head', 'Ta force génératrice rayonne. Ton centre tête t''invite à partager ta sagesse.', 'Guidance Général - Generator - Tête - Score Haut', '{"inhale": "Je génère", "exhale": "naturellement"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'generator', 81, 100, 'ajna', 'Ta force génératrice rayonne. Ton centre ajna t''invite à partager ta sagesse.', 'Guidance Général - Generator - Ajna - Score Haut', '{"inhale": "Je génère", "exhale": "naturellement"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'generator', 81, 100, 'throat', 'Ta force génératrice rayonne. Ton centre gorge t''invite à partager ta sagesse.', 'Guidance Général - Generator - Gorge - Score Haut', '{"inhale": "Je génère", "exhale": "naturellement"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre');

-- MANIFESTING GENERATOR - Exemples de base
INSERT INTO knowledge_base (category, hd_type, min_score, max_score, center, content, title, mantra, realignment_exercise)
VALUES
-- MG Général 41-60 (centres spécifiques)
('guidance', 'manifesting-generator', 41, 60, 'head', 'Ton énergie multitâche trouve son équilibre. Ton centre tête t''invite à la clarté.', 'Guidance Général - MG - Tête - Score Moyen', '{"inhale": "Je manifeste", "exhale": "avec fluidité"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifesting-generator', 41, 60, 'ajna', 'Ton énergie multitâche trouve son équilibre. Ton centre ajna t''invite à la clarté.', 'Guidance Général - MG - Ajna - Score Moyen', '{"inhale": "Je manifeste", "exhale": "avec fluidité"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifesting-generator', 41, 60, 'throat', 'Ton énergie multitâche trouve son équilibre. Ton centre gorge t''invite à la clarté.', 'Guidance Général - MG - Gorge - Score Moyen', '{"inhale": "Je manifeste", "exhale": "avec fluidité"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante');