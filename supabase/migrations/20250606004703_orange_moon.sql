/*
  # Add guidance data
  
  1. Creates helper functions for data normalization
  2. Sets up temporary table for guidance data
  3. Inserts normalized data into knowledge_base table
*/

-- Create function to parse score range string and return lower bound
CREATE OR REPLACE FUNCTION parse_score_range_lower(range_str text) 
RETURNS int AS $$
BEGIN
  RETURN (regexp_match(range_str, '^(\d+)[-–]'))[1]::int;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to parse score range string and return upper bound
CREATE OR REPLACE FUNCTION parse_score_range_upper(range_str text) 
RETURNS int AS $$
BEGIN
  RETURN (regexp_match(range_str, '[-–](\d+)$'))[1]::int;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to normalize center name
CREATE OR REPLACE FUNCTION normalize_center_name(center_name text) 
RETURNS text AS $$
BEGIN
  RETURN CASE
    WHEN center_name = 'Rate (Spleen)' THEN 'spleen'
    WHEN center_name = 'Plexus Solaire' THEN 'solar-plexus'
    WHEN center_name = 'Cœur' THEN 'heart'
    WHEN center_name = 'Gorge' THEN 'throat'
    WHEN center_name = 'Tête' THEN 'head'
    WHEN center_name = 'G' THEN 'g-center'
    ELSE lower(center_name)
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to normalize HD type
CREATE OR REPLACE FUNCTION normalize_hd_type(type_name text) 
RETURNS text AS $$
BEGIN
  RETURN CASE
    WHEN type_name = 'Manifesting Generator' THEN 'manifesting-generator'
    ELSE lower(type_name)
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create temporary table for guidance data
CREATE TEMPORARY TABLE temp_guidance (
  category text,
  hd_type text,
  score_range text,
  center text,
  message text,
  element text,
  practices text,
  intention text
);

-- Insert data into temporary table
INSERT INTO temp_guidance VALUES
('Général', 'Projector', '0-20', 'Tête', 'Recentre-toi en douceur. Ton centre tête mérite ton écoute et ton amour.', 'Air', 'Repos profond, Silence réparateur, Couper le monde extérieur', 'Je m''autorise à m''éteindre pour mieux renaître.');

-- Insert normalized data into knowledge_base table
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
SELECT DISTINCT
  lower(tg.category),
  normalize_hd_type(tg.hd_type),
  parse_score_range_lower(tg.score_range) as min_score,
  parse_score_range_upper(tg.score_range) as max_score,
  normalize_center_name(tg.center),
  tg.message,
  format('Guidance %s - %s - Score %s', 
    tg.hd_type, 
    tg.center,
    CASE 
      WHEN parse_score_range_lower(tg.score_range) < 20 THEN 'Bas'
      WHEN parse_score_range_lower(tg.score_range) < 40 THEN 'Moyen Bas'
      WHEN parse_score_range_lower(tg.score_range) < 60 THEN 'Moyen'
      WHEN parse_score_range_lower(tg.score_range) < 80 THEN 'Moyen Haut'
      ELSE 'Haut'
    END
  ),
  jsonb_build_object(
    'inhale', 
    split_part(tg.intention, ',', 1),
    'exhale',
    COALESCE(NULLIF(split_part(tg.intention, ',', 2), ''), split_part(tg.intention, ' et ', 2))
  ),
  string_to_array(tg.practices, ', ')
FROM temp_guidance tg
ON CONFLICT (hd_type, min_score, max_score, center) 
DO UPDATE SET
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  mantra = EXCLUDED.mantra,
  realignment_exercise = EXCLUDED.realignment_exercise;

-- Drop temporary table
DROP TABLE temp_guidance;

-- Drop helper functions
DROP FUNCTION parse_score_range_lower;
DROP FUNCTION parse_score_range_upper;
DROP FUNCTION normalize_center_name;
DROP FUNCTION normalize_hd_type;