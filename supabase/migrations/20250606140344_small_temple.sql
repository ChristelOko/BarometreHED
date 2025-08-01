/*
  # Mise à jour complète des données de guidance
  
  1. Suppression des données existantes
    - Vide la table knowledge_base pour éviter les doublons
  
  2. Import complet des nouvelles données
    - Tous les types HD : Projector, Generator, Manifesting Generator, Manifestor, Reflector
    - Toutes les tranches de scores : 0-20, 21-40, 41-60, 61-80, 81-100
    - Tous les centres HD : Tête, Ajna, Gorge, G, Cœur, Rate, Sacral, Plexus Solaire, Racine
  
  3. Structure des données
    - Messages personnalisés par type HD
    - Éléments à harmoniser spécifiques
    - Pratiques recommandées adaptées
    - Intentions du jour personnalisées
    - Mantras structurés en JSON
*/

-- Vider la table pour éviter les doublons
DELETE FROM knowledge_base WHERE category = 'guidance';

-- Fonction helper pour normaliser les noms de centres
CREATE OR REPLACE FUNCTION normalize_center_name(center_input text) 
RETURNS text AS $$
BEGIN
  RETURN CASE
    WHEN center_input = 'Rate (Spleen)' THEN 'spleen'
    WHEN center_input = 'Plexus Solaire' THEN 'solar-plexus'
    WHEN center_input = 'Cœur' THEN 'heart'
    WHEN center_input = 'Gorge' THEN 'throat'
    WHEN center_input = 'Tête' THEN 'head'
    WHEN center_input = 'G' THEN 'g-center'
    WHEN center_input = 'Ajna' THEN 'ajna'
    WHEN center_input = 'Racine' THEN 'root'
    WHEN center_input = 'Sacral' THEN 'sacral'
    ELSE lower(center_input)
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction helper pour normaliser les types HD
CREATE OR REPLACE FUNCTION normalize_hd_type_name(type_input text) 
RETURNS text AS $$
BEGIN
  RETURN CASE
    WHEN type_input = 'Manifesting Generator' THEN 'manifesting-generator'
    ELSE lower(type_input)
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction helper pour créer le mantra JSON
CREATE OR REPLACE FUNCTION create_mantra_from_intention(intention text) 
RETURNS jsonb AS $$
DECLARE
  inhale_part text;
  exhale_part text;
BEGIN
  -- Créer un mantra basé sur l'intention
  CASE 
    WHEN intention LIKE '%m''autorise%' THEN
      inhale_part := 'Je m''autorise';
      exhale_part := 'à me recentrer';
    WHEN intention LIKE '%prends soin%' THEN
      inhale_part := 'Je prends soin';
      exhale_part := 'de moi avec douceur';
    WHEN intention LIKE '%retrouve%' THEN
      inhale_part := 'Je retrouve';
      exhale_part := 'mon équilibre';
    WHEN intention LIKE '%vis alignée%' THEN
      inhale_part := 'Je vis alignée';
      exhale_part := 'à ma fréquence';
    WHEN intention LIKE '%rayonne%' THEN
      inhale_part := 'Je rayonne';
      exhale_part := 'naturellement';
    ELSE
      inhale_part := 'Je m''accueille';
      exhale_part := 'je me libère';
  END CASE;
  
  RETURN jsonb_build_object(
    'inhale', inhale_part,
    'exhale', exhale_part
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Import des données complètes
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
-- PROJECTOR - Toutes les tranches de scores et centres
('guidance', 'projector', 0, 20, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Projector - Tête - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Projector - Ajna - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Projector - Gorge - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Projector - G - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Projector - Cœur - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Projector - Rate - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Projector - Sacral - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Projector - Plexus - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'projector', 0, 20, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Projector - Racine - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),

-- PROJECTOR 21-40
('guidance', 'projector', 21, 40, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Projector - Tête - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Projector - Ajna - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Projector - Gorge - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Projector - G - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Projector - Cœur - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Projector - Rate - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Projector - Sacral - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Projector - Plexus - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Projector - Racine - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),

-- PROJECTOR 41-60
('guidance', 'projector', 41, 60, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Projector - Tête - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Projector - Ajna - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Projector - Gorge - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Projector - G - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Projector - Cœur - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Projector - Rate - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Projector - Sacral - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Projector - Plexus - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Projector - Racine - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),

-- PROJECTOR 61-80
('guidance', 'projector', 61, 80, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Projector - Tête - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Projector - Ajna - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Projector - Gorge - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Projector - G - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Projector - Cœur - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Projector - Rate - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Projector - Sacral - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Projector - Plexus - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Projector - Racine - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),

-- PROJECTOR 81-100
('guidance', 'projector', 81, 100, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Projector - Tête - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Projector - Ajna - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Projector - Gorge - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Projector - G - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Projector - Cœur - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Projector - Rate - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Projector - Sacral - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Projector - Plexus - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Projector - Racine - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),

-- GENERATOR - Toutes les tranches de scores et centres
('guidance', 'generator', 0, 20, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Generator - Tête - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'generator', 0, 20, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Generator - Ajna - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'generator', 0, 20, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Generator - Gorge - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'generator', 0, 20, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Generator - G - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'generator', 0, 20, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Generator - Cœur - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'generator', 0, 20, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Generator - Rate - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'generator', 0, 20, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Generator - Sacral - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'generator', 0, 20, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Generator - Plexus - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'generator', 0, 20, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Generator - Racine - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),

-- GENERATOR 21-40
('guidance', 'generator', 21, 40, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Generator - Tête - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'generator', 21, 40, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Generator - Ajna - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'generator', 21, 40, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Generator - Gorge - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'generator', 21, 40, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Generator - G - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'generator', 21, 40, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Generator - Cœur - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'generator', 21, 40, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Generator - Rate - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'generator', 21, 40, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Generator - Sacral - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'generator', 21, 40, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Generator - Plexus - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'generator', 21, 40, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Generator - Racine - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),

-- GENERATOR 41-60
('guidance', 'generator', 41, 60, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Generator - Tête - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'generator', 41, 60, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Generator - Ajna - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'generator', 41, 60, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Generator - Gorge - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'generator', 41, 60, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Generator - G - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'generator', 41, 60, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Generator - Cœur - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'generator', 41, 60, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Generator - Rate - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'generator', 41, 60, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Generator - Sacral - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'generator', 41, 60, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Generator - Plexus - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'generator', 41, 60, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Generator - Racine - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),

-- GENERATOR 61-80
('guidance', 'generator', 61, 80, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Generator - Tête - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'generator', 61, 80, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Generator - Ajna - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'generator', 61, 80, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Generator - Gorge - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'generator', 61, 80, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Generator - G - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'generator', 61, 80, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Generator - Cœur - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'generator', 61, 80, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Generator - Rate - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'generator', 61, 80, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Generator - Sacral - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'generator', 61, 80, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Generator - Plexus - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'generator', 61, 80, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Generator - Racine - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),

-- GENERATOR 81-100
('guidance', 'generator', 81, 100, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Generator - Tête - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'generator', 81, 100, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Generator - Ajna - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'generator', 81, 100, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Generator - Gorge - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'generator', 81, 100, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Generator - G - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'generator', 81, 100, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Generator - Cœur - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'generator', 81, 100, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Generator - Rate - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'generator', 81, 100, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Generator - Sacral - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'generator', 81, 100, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Generator - Plexus - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'generator', 81, 100, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Generator - Racine - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),

-- MANIFESTING GENERATOR - Toutes les tranches de scores et centres
('guidance', 'manifesting-generator', 0, 20, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance MG - Tête - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifesting-generator', 0, 20, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance MG - Ajna - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifesting-generator', 0, 20, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance MG - Gorge - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifesting-generator', 0, 20, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance MG - G - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifesting-generator', 0, 20, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance MG - Cœur - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifesting-generator', 0, 20, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance MG - Rate - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifesting-generator', 0, 20, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance MG - Sacral - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifesting-generator', 0, 20, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance MG - Plexus - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifesting-generator', 0, 20, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance MG - Racine - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),

-- MANIFESTING GENERATOR 21-40
('guidance', 'manifesting-generator', 21, 40, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance MG - Tête - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifesting-generator', 21, 40, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance MG - Ajna - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifesting-generator', 21, 40, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance MG - Gorge - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifesting-generator', 21, 40, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance MG - G - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifesting-generator', 21, 40, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance MG - Cœur - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifesting-generator', 21, 40, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance MG - Rate - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifesting-generator', 21, 40, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance MG - Sacral - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifesting-generator', 21, 40, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance MG - Plexus - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifesting-generator', 21, 40, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance MG - Racine - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),

-- MANIFESTING GENERATOR 41-60
('guidance', 'manifesting-generator', 41, 60, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance MG - Tête - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifesting-generator', 41, 60, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance MG - Ajna - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifesting-generator', 41, 60, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance MG - Gorge - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifesting-generator', 41, 60, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance MG - G - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifesting-generator', 41, 60, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance MG - Cœur - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifesting-generator', 41, 60, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance MG - Rate - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifesting-generator', 41, 60, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance MG - Sacral - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifesting-generator', 41, 60, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance MG - Plexus - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifesting-generator', 41, 60, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance MG - Racine - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),

-- MANIFESTING GENERATOR 61-80
('guidance', 'manifesting-generator', 61, 80, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance MG - Tête - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifesting-generator', 61, 80, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance MG - Ajna - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifesting-generator', 61, 80, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance MG - Gorge - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifesting-generator', 61, 80, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance MG - G - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifesting-generator', 61, 80, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance MG - Cœur - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifesting-generator', 61, 80, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance MG - Rate - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifesting-generator', 61, 80, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance MG - Sacral - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifesting-generator', 61, 80, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance MG - Plexus - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifesting-generator', 61, 80, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance MG - Racine - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),

-- MANIFESTING GENERATOR 81-100
('guidance', 'manifesting-generator', 81, 100, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance MG - Tête - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifesting-generator', 81, 100, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance MG - Ajna - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifesting-generator', 81, 100, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance MG - Gorge - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifesting-generator', 81, 100, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance MG - G - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifesting-generator', 81, 100, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance MG - Cœur - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifesting-generator', 81, 100, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance MG - Rate - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifesting-generator', 81, 100, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance MG - Sacral - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifesting-generator', 81, 100, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance MG - Plexus - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifesting-generator', 81, 100, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance MG - Racine - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),

-- MANIFESTOR - Toutes les tranches de scores et centres
('guidance', 'manifestor', 0, 20, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Manifestor - Tête - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifestor', 0, 20, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Manifestor - Ajna - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifestor', 0, 20, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Manifestor - Gorge - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifestor', 0, 20, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Manifestor - G - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifestor', 0, 20, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Manifestor - Cœur - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifestor', 0, 20, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Manifestor - Rate - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifestor', 0, 20, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Manifestor - Sacral - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifestor', 0, 20, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Manifestor - Plexus - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'manifestor', 0, 20, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Manifestor - Racine - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),

-- MANIFESTOR 21-40
('guidance', 'manifestor', 21, 40, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Manifestor - Tête - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifestor', 21, 40, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Manifestor - Ajna - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifestor', 21, 40, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Manifestor - Gorge - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifestor', 21, 40, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Manifestor - G - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifestor', 21, 40, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Manifestor - Cœur - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifestor', 21, 40, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Manifestor - Rate - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifestor', 21, 40, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Manifestor - Sacral - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifestor', 21, 40, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Manifestor - Plexus - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'manifestor', 21, 40, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Manifestor - Racine - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),

-- MANIFESTOR 41-60
('guidance', 'manifestor', 41, 60, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Manifestor - Tête - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifestor', 41, 60, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Manifestor - Ajna - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifestor', 41, 60, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Manifestor - Gorge - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifestor', 41, 60, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Manifestor - G - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifestor', 41, 60, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Manifestor - Cœur - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifestor', 41, 60, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Manifestor - Rate - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifestor', 41, 60, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Manifestor - Sacral - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifestor', 41, 60, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Manifestor - Plexus - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'manifestor', 41, 60, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Manifestor - Racine - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),

-- MANIFESTOR 61-80
('guidance', 'manifestor', 61, 80, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Manifestor - Tête - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifestor', 61, 80, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Manifestor - Ajna - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifestor', 61, 80, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Manifestor - Gorge - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifestor', 61, 80, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Manifestor - G - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifestor', 61, 80, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Manifestor - Cœur - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifestor', 61, 80, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Manifestor - Rate - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifestor', 61, 80, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Manifestor - Sacral - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifestor', 61, 80, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Manifestor - Plexus - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'manifestor', 61, 80, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Manifestor - Racine - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),

-- MANIFESTOR 81-100
('guidance', 'manifestor', 81, 100, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Manifestor - Tête - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifestor', 81, 100, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Manifestor - Ajna - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifestor', 81, 100, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Manifestor - Gorge - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifestor', 81, 100, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Manifestor - G - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifestor', 81, 100, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Manifestor - Cœur - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifestor', 81, 100, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Manifestor - Rate - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifestor', 81, 100, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Manifestor - Sacral - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifestor', 81, 100, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Manifestor - Plexus - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'manifestor', 81, 100, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Manifestor - Racine - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),

-- REFLECTOR - Toutes les tranches de scores et centres
('guidance', 'reflector', 0, 20, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Reflector - Tête - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'reflector', 0, 20, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Reflector - Ajna - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'reflector', 0, 20, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Reflector - Gorge - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'reflector', 0, 20, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Reflector - G - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'reflector', 0, 20, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Reflector - Cœur - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'reflector', 0, 20, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Reflector - Rate - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'reflector', 0, 20, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Reflector - Sacral - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'reflector', 0, 20, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Reflector - Plexus - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),
('guidance', 'reflector', 0, 20, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Reflector - Racine - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),

-- REFLECTOR 21-40
('guidance', 'reflector', 21, 40, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Reflector - Tête - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'reflector', 21, 40, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Reflector - Ajna - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'reflector', 21, 40, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Reflector - Gorge - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'reflector', 21, 40, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Reflector - G - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'reflector', 21, 40, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Reflector - Cœur - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'reflector', 21, 40, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Reflector - Rate - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'reflector', 21, 40, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Reflector - Sacral - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'reflector', 21, 40, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Reflector - Plexus - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'reflector', 21, 40, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Reflector - Racine - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),

-- REFLECTOR 41-60
('guidance', 'reflector', 41, 60, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Reflector - Tête - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'reflector', 41, 60, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Reflector - Ajna - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'reflector', 41, 60, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Reflector - Gorge - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'reflector', 41, 60, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Reflector - G - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'reflector', 41, 60, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Reflector - Cœur - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'reflector', 41, 60, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Reflector - Rate - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'reflector', 41, 60, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Reflector - Sacral - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'reflector', 41, 60, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Reflector - Plexus - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'reflector', 41, 60, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Reflector - Racine - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),

-- REFLECTOR 61-80
('guidance', 'reflector', 61, 80, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Reflector - Tête - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'reflector', 61, 80, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Reflector - Ajna - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'reflector', 61, 80, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Reflector - Gorge - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'reflector', 61, 80, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Reflector - G - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'reflector', 61, 80, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Reflector - Cœur - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'reflector', 61, 80, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Reflector - Rate - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'reflector', 61, 80, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Reflector - Sacral - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'reflector', 61, 80, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Reflector - Plexus - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'reflector', 61, 80, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Reflector - Racine - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),

-- REFLECTOR 81-100
('guidance', 'reflector', 81, 100, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Reflector - Tête - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'reflector', 81, 100, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Reflector - Ajna - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'reflector', 81, 100, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Reflector - Gorge - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'reflector', 81, 100, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Reflector - G - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'reflector', 81, 100, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Reflector - Cœur - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'reflector', 81, 100, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Reflector - Rate - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'reflector', 81, 100, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Reflector - Sacral - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'reflector', 81, 100, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Reflector - Plexus - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'reflector', 81, 100, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Reflector - Racine - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre')

ON CONFLICT (hd_type, min_score, max_score, center) 
DO UPDATE SET
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  mantra = EXCLUDED.mantra,
  realignment_exercise = EXCLUDED.realignment_exercise;

-- Nettoyage des fonctions helper
DROP FUNCTION IF EXISTS normalize_center_name;
DROP FUNCTION IF EXISTS normalize_hd_type_name;
DROP FUNCTION IF EXISTS create_mantra_from_intention;

-- Afficher le nombre total d'enregistrements insérés
SELECT COUNT(*) as total_guidance_entries FROM knowledge_base WHERE category = 'guidance';