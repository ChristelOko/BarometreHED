-- Add Mental State category to the database
-- This migration adds all the feelings from the provided CSV file for the Mental state category
-- Each feeling is inserted only if it doesn't already exist (to avoid duplicates)

-- First, ensure the mental category is recognized in constraints
DO $$
BEGIN
  -- Check if we need to update the feelings category constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'feelings_category_check' 
    AND conrelid = 'feelings'::regclass::oid
    AND pg_get_constraintdef(oid) LIKE '%mental%'
  ) THEN
    -- Update the constraint to include 'mental' category
    ALTER TABLE feelings DROP CONSTRAINT IF EXISTS feelings_category_check;
    
    ALTER TABLE feelings ADD CONSTRAINT feelings_category_check 
      CHECK (category = ANY (ARRAY['general'::text, 'emotional'::text, 'physical'::text, 'mental'::text, 'digestive'::text, 'somatic'::text, 'energetic'::text, 'feminine_cycle'::text, 'hd_specific'::text]));
  END IF;
END $$;

-- Handle feelings_energia table separately with data validation
DO $$
DECLARE
  invalid_rows INT;
BEGIN
  -- Check if the table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'feelings_energia') THEN
    -- Check for rows that would violate the new constraint
    SELECT COUNT(*) INTO invalid_rows 
    FROM feelings_energia 
    WHERE category IS NOT NULL 
    AND category NOT IN ('general', 'emotional', 'physical', 'mental');
    
    -- If there are invalid rows, update them to a valid category
    IF invalid_rows > 0 THEN
      UPDATE feelings_energia 
      SET category = 'general' 
      WHERE category IS NOT NULL 
      AND category NOT IN ('general', 'emotional', 'physical', 'mental');
    END IF;
    
    -- Now it's safe to add or update the constraint
    IF EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'feelings_energia_category_check' 
      AND conrelid = 'feelings_energia'::regclass::oid
    ) THEN
      -- Drop the existing constraint
      ALTER TABLE feelings_energia DROP CONSTRAINT feelings_energia_category_check;
    END IF;
    
    -- Add the updated constraint
    ALTER TABLE feelings_energia ADD CONSTRAINT feelings_energia_category_check 
      CHECK (category = ANY (ARRAY['general'::text, 'emotional'::text, 'physical'::text, 'mental'::text]));
  END IF;
END $$;

-- Projector feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Mental en boucle', 
  'projector', 
  'mental', 
  'Des pensées reviennent sans cesse, comme une spirale impossible à stopper. Tu analyses, tu reviens sur les mêmes scénarios, tu cherches à comprendre à tout prix.', 
  'Tu as absorbé trop d''informations extérieures, ou tu cherches une validation que tu ne reçois pas.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "head"}', jsonb '{"center": "spleen"}'], 
  'Je peux relâcher même sans tout comprendre.', 
  'Note tout ce qui tourne en boucle dans ton esprit, puis brûle ou jette le papier. Respire profondément en silence.', 
  'Je laisse aller', 
  'Je m''ouvre à la clarté', 
  'Ta lucidité est précieuse. Mais le silence peut parfois répondre mieux que la logique.', 
  41, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Mental en boucle' AND type_hd = 'projector' AND category = 'mental'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Clarté soudaine', 
  'projector', 
  'mental', 
  'Une idée limpide te traverse. Tu vois tout avec une netteté tranchante, comme si un brouillard venait de se lever.', 
  'Tu t''es recentrée, ou tu as été reconnue dans ta justesse. Ton mental peut alors se déployer naturellement.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "head"}'], 
  'Ma clarté émerge quand je suis centrée.', 
  'Assieds-toi et écris ce que tu vois avec cette clarté. Ancre ce moment de lucidité.', 
  'Je perçois', 
  'Je transmets', 
  'Ta vision est un cadeau. Elle mérite d''être honorée et partagée dans le bon cadre.', 
  91, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Clarté soudaine' AND type_hd = 'projector' AND category = 'mental'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Comparaison mentale', 
  'projector', 
  'mental', 
  'Ton esprit saute d''une référence à une autre. Tu te compares aux autres, tu questionnes ta légitimité ou ta place.', 
  'Tu es en manque de reconnaissance ou tu n''as pas d''espace-ressource pour déposer ta vision.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "g-center"}', jsonb '{"center": "head"}'], 
  'Je suis unique, je n''ai pas à me mesurer.', 
  'Ferme les yeux et visualise-toi dans un espace sans personne. Sens ta valeur intrinsèque.', 
  'Je me distingue', 
  'Je me respecte', 
  'La comparaison déforme ta beauté. Tu es faite pour offrir, pas pour te prouver.', 
  43, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Comparaison mentale' AND type_hd = 'projector' AND category = 'mental'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Vision à long terme', 
  'projector', 
  'mental', 
  'Tu captes des dynamiques, des structures, des directions futures. Ton esprit voit loin, au-delà de l''instant.', 
  'Tu es en posture d''observation détendue, sans pression. Ton génie stratégique peut alors s''exprimer.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "head"}', jsonb '{"center": "g-center"}'], 
  'Je vois au-delà de ce que les autres perçoivent.', 
  'Note les grandes intuitions qui te traversent. Pose-les comme des graines, sans chercher à les forcer.', 
  'Je vois', 
  'Je laisse mûrir', 
  'Tu es faite pour guider dans le temps long. Ton mental est une boussole visionnaire.', 
  90, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Vision à long terme' AND type_hd = 'projector' AND category = 'mental'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Parasitage extérieur', 
  'projector', 
  'mental', 
  'Tu sens des pensées ou des opinions qui ne te ressemblent pas. Ton esprit est troublé, comme si tu avais capté des idées d''ailleurs.', 
  'Tu as été trop exposée à des discours ou à des présences non alignées. Ton mental reflète l''environnement.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "throat"}'], 
  'Je n''ai pas à intégrer ce qui ne vient pas de moi.', 
  'Coupe toutes les sources d''information. Pose-toi dans le silence. Sens ce qui reste quand tout s''éloigne.', 
  'Je me débranche', 
  'Je me retrouve', 
  'Ton mental est un filtre subtil. Prends soin de ce que tu laisses entrer.', 
  42, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Parasitage extérieur' AND type_hd = 'projector' AND category = 'mental'
);

-- Generator feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Frustration mentale', 
  'generator', 
  'mental', 
  'Tu rumines parce que les choses n''avancent pas comme tu le veux. Tu ressasses ce qui bloque ou ce que tu aurais dû faire autrement.', 
  'Tu t''es engagée dans quelque chose qui ne te correspond pas ou tu n''as pas attendu de vraie réponse sacrale.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "head"}', jsonb '{"center": "spleen"}'], 
  'Je n''ai pas à forcer ce qui ne m''appelle pas.', 
  'Inspire profondément en haussant les épaules, expire en les laissant tomber. Répète 7 fois en conscience.', 
  'Je relâche', 
  'Je fais confiance', 
  'La clarté revient quand tu reconnectes avec ton centre sacral. Ton esprit n''est pas là pour décider seul.', 
  42, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Frustration mentale' AND type_hd = 'generator' AND category = 'mental'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Canal de feu', 
  'generator', 
  'mental', 
  'Tu reçois une inspiration brûlante, une idée forte, claire, pulsée par ton ventre. Tout est fluide, incarné et dirigé.', 
  'Tu es en état d''alignement sacral total. Ton corps et ton mental sont unis dans une même vibration.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "sacral"}', jsonb '{"center": "g-center"}', jsonb '{"center": "ajna"}'], 
  'Quand je suis feu, tout devient clair.', 
  'Danse ou bouge sur un rythme fort. Puis assieds-toi et écris ce qui est là, sans filtre.', 
  'Je reçois', 
  'Je transforme', 
  'C''est ton feu sacré qui active ton génie mental. Laisse-le circuler sans l''étouffer.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Canal de feu' AND type_hd = 'generator' AND category = 'mental'
);

-- Manifesting Generator feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Fusion sacrale-mentale', 
  'manifesting-generator', 
  'mental', 
  'Ton esprit et ton ventre sont en accord parfait. Tu penses et agis dans la même énergie, avec puissance et justesse.', 
  'Tu es dans un état d''alignement profond, où chaque action mentale est soutenue par ton feu vital.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "g-center"}', jsonb '{"center": "sacral"}', jsonb '{"center": "throat"}'], 
  'Je suis pensée incarnée.', 
  'Écris une intention et lis-la à voix haute. Ressens si ton ventre dit oui. Si oui, incarne-la tout de suite.', 
  'Je vibre', 
  'Je manifeste', 
  'Tu es un feu multidirectionnel. Quand ton esprit et ton corps s''unissent, tu crées des miracles.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Fusion sacrale-mentale' AND type_hd = 'manifesting-generator' AND category = 'mental'
);

-- Manifestor feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Feu fondateur', 
  'manifestor', 
  'mental', 
  'Ta pensée est claire, pure, initiatrice. Elle donne naissance à un nouveau courant, une direction inédite.', 
  'Tu es profondément centrée, ton autorité a parlé, ton canal est ouvert sans résistance.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "throat"}', jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}'], 
  'Ma pensée est origine.', 
  'Note ta pensée fondatrice. Transforme-la immédiatement en premier acte concret, même minime.', 
  'Je reçois', 
  'Je lance', 
  'Ta vision mentale est une étincelle de monde. Ne la minimise jamais.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Feu fondateur' AND type_hd = 'manifestor' AND category = 'mental'
);

-- Reflector feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Résonance mentale cosmique', 
  'reflector', 
  'mental', 
  'Tu captes des pensées qui viennent de plus loin. Comme si ton esprit se connectait à une sagesse au-delà de l''humain.', 
  'Tu es parfaitement centrée, dans un moment de grande ouverture énergétique. Le canal est pur.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}', jsonb '{"center": "throat"}'], 
  'Je suis traversée par la sagesse des étoiles.', 
  'Ferme les yeux. Demande intérieurement : ''Quel message est pour moi aujourd''hui ?'' Note ce qui vient sans logique.', 
  'Je reçois', 
  'Je transmets', 
  'Ton esprit est un portail. N''aie pas peur de sa profondeur.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Résonance mentale cosmique' AND type_hd = 'reflector' AND category = 'mental'
);

-- Generic mental feelings (no specific HD type)
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Pensées claires et organisées', 
  'mental', 
  'Mon esprit est ordonné et lucide. Je peux suivre mes pensées sans confusion et prendre des décisions avec assurance.', 
  'J''ai pris le temps de me recentrer. J''ai créé un environnement propice à la concentration.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}'], 
  'Mon esprit est un outil puissant quand je lui donne l''espace de s''organiser.', 
  'Prends un papier et note tes trois pensées principales du moment. Observe les liens entre elles.', 
  'Je clarifie', 
  'J''organise', 
  'Cette clarté mentale est ton état naturel quand tu prends soin de ton espace intérieur.', 
  90, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Pensées claires et organisées' AND category = 'mental'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Pensées obsessionnelles', 
  'mental', 
  'Mon esprit tourne en boucle sur les mêmes idées. Je n''arrive pas à me libérer de certaines pensées qui reviennent sans cesse.', 
  'Anxiété non traitée, perfectionnisme, ou besoin de contrôle face à l''incertitude.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}'], 
  'Mes pensées ne sont pas des vérités absolues. Je peux les observer sans m''y attacher.', 
  'Écris toutes tes pensées obsessionnelles sur un papier. Puis dis à voix haute : "Ces pensées ne sont pas moi. Je les observe passer."', 
  'J''observe mes pensées', 
  'Je les laisse passer', 
  'Ton esprit cherche à te protéger en anticipant. Remercie-le, puis invite-le doucement à se détendre.', 
  35, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Pensées obsessionnelles' AND category = 'mental'
);

-- Add more generic mental feelings
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Esprit calme et spacieux', 
  'mental', 
  'Mon mental est paisible et vaste. Les pensées vont et viennent sans m''agiter. Je ressens un espace intérieur.', 
  'J''ai pratiqué la présence et l''observation de mes pensées sans m''y identifier.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "spleen"}'], 
  'Je suis l''espace où les pensées apparaissent, pas les pensées elles-mêmes.', 
  'Assieds-toi confortablement. Imagine que ton esprit est comme le ciel, et que tes pensées sont des nuages qui passent. Observe-les sans t''y attacher.', 
  'Je suis l''espace', 
  'Je suis la paix', 
  'Ce calme mental est ton état naturel. Plus tu t''y reconnectes, plus il devient accessible.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Esprit calme et spacieux' AND category = 'mental'
);