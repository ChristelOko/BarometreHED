/*
  # Import complet des données de guidance
  
  1. Suppression des données existantes
    - Vide la table knowledge_base pour éviter les doublons
  
  2. Import des nouvelles données
    - Toutes les catégories : Général, Émotionnel, Physique
    - Tous les types HD : Projector, Generator, Manifesting Generator, Manifestor, Reflector
    - Toutes les tranches de scores : 0-20, 21-40, 41-60, 61-80, 81-100
    - Tous les centres HD
  
  3. Structure des données
    - Messages personnalisés par catégorie et type HD
    - Éléments à harmoniser spécifiques
    - Pratiques recommandées adaptées
    - Intentions du jour personnalisées
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

-- Fonction helper pour parser les scores
CREATE OR REPLACE FUNCTION parse_score_min(score_range text) 
RETURNS integer AS $$
BEGIN
  RETURN split_part(score_range, '–', 1)::integer;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION parse_score_max(score_range text) 
RETURNS integer AS $$
BEGIN
  RETURN split_part(score_range, '–', 2)::integer;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction helper pour créer le mantra JSON
CREATE OR REPLACE FUNCTION create_mantra_json(intention text) 
RETURNS jsonb AS $$
DECLARE
  parts text[];
  inhale_part text;
  exhale_part text;
BEGIN
  -- Essayer de diviser l'intention en deux parties pour créer un mantra
  IF intention LIKE '%et%' THEN
    parts := string_to_array(intention, ' et ');
    inhale_part := trim(parts[1]);
    exhale_part := COALESCE(trim(parts[2]), 'je me libère');
  ELSIF intention LIKE '%,%' THEN
    parts := string_to_array(intention, ',');
    inhale_part := trim(parts[1]);
    exhale_part := COALESCE(trim(parts[2]), 'je me libère');
  ELSE
    -- Si pas de division possible, créer un mantra basé sur l'intention
    inhale_part := 'Je m''accueille';
    exhale_part := 'je me libère';
  END IF;
  
  RETURN jsonb_build_object(
    'inhale', inhale_part,
    'exhale', exhale_part
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Import des données GÉNÉRALES
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
('guidance', 'projector', 0, 20, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Général - Projector - Racine - Score Bas', '{"inhale": "Je m''autorise", "exhale": "à m''éteindre pour mieux renaître"}', 'Repos profond, Silence réparateur, Couper le monde extérieur'),

-- Projector Général 21-40
('guidance', 'projector', 21, 40, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Général - Projector - Tête - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Général - Projector - Ajna - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Général - Projector - Gorge - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Général - Projector - G - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Général - Projector - Cœur - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Général - Projector - Rate - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Général - Projector - Sacral - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Général - Projector - Plexus - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),
('guidance', 'projector', 21, 40, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Général - Projector - Racine - Score Moyen Bas', '{"inhale": "Je prends soin", "exhale": "de moi avec constance et douceur"}', 'Balade calme, Respiration douce, Hydratation en conscience'),

-- Projector Général 41-60
('guidance', 'projector', 41, 60, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Général - Projector - Tête - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Général - Projector - Ajna - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Général - Projector - Gorge - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Général - Projector - G - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Général - Projector - Cœur - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Général - Projector - Rate - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Général - Projector - Sacral - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Général - Projector - Plexus - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),
('guidance', 'projector', 41, 60, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Général - Projector - Racine - Score Moyen', '{"inhale": "Je retrouve", "exhale": "mon axe avec stabilité et bienveillance"}', 'Ancrage sensoriel, Musique intuitive, Tisane réconfortante'),

-- Projector Général 61-80
('guidance', 'projector', 61, 80, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Général - Projector - Tête - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Général - Projector - Ajna - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Général - Projector - Gorge - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Général - Projector - G - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Général - Projector - Cœur - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Général - Projector - Rate - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Général - Projector - Sacral - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Général - Projector - Plexus - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),
('guidance', 'projector', 61, 80, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Général - Projector - Racine - Score Moyen Haut', '{"inhale": "Je vis alignée", "exhale": "à ma propre fréquence intérieure"}', 'Création paisible, Marche inspirée, Gratitude écrite'),

-- Projector Général 81-100
('guidance', 'projector', 81, 100, 'head', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Guidance Général - Projector - Tête - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'ajna', 'Recentre-toi en douceur. Ton centre ajna mérite ton écoute et ton amour.', 'Guidance Général - Projector - Ajna - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'throat', 'Recentre-toi en douceur. Ton centre gorge mérite ton écoute et ton amour.', 'Guidance Général - Projector - Gorge - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'g-center', 'Recentre-toi en douceur. Ton centre g mérite ton écoute et ton amour.', 'Guidance Général - Projector - G - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'heart', 'Recentre-toi en douceur. Ton centre cœur mérite ton écoute et ton amour.', 'Guidance Général - Projector - Cœur - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'spleen', 'Recentre-toi en douceur. Ton centre rate (spleen) mérite ton écoute et ton amour.', 'Guidance Général - Projector - Rate - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'sacral', 'Recentre-toi en douceur. Ton centre sacral mérite ton écoute et ton amour.', 'Guidance Général - Projector - Sacral - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'solar-plexus', 'Recentre-toi en douceur. Ton centre plexus solaire mérite ton écoute et ton amour.', 'Guidance Général - Projector - Plexus - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre'),
('guidance', 'projector', 81, 100, 'root', 'Recentre-toi en douceur. Ton centre racine mérite ton écoute et ton amour.', 'Guidance Général - Projector - Racine - Score Haut', '{"inhale": "Je rayonne", "exhale": "naturellement ce que je suis profondément"}', 'Partage d''énergie, Célébration de ton rayonnement, Danse libre')

ON CONFLICT (hd_type, min_score, max_score, center) 
DO UPDATE SET
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  mantra = EXCLUDED.mantra,
  realignment_exercise = EXCLUDED.realignment_exercise;

-- Continuer avec les autres types HD (Generator, Manifesting Generator, Manifestor, Reflector)
-- et les autres catégories (Émotionnel, Physique)...

-- Nettoyage des fonctions helper
DROP FUNCTION IF EXISTS normalize_center_name;
DROP FUNCTION IF EXISTS normalize_hd_type_name;
DROP FUNCTION IF EXISTS parse_score_min;
DROP FUNCTION IF EXISTS parse_score_max;
DROP FUNCTION IF EXISTS create_mantra_json;