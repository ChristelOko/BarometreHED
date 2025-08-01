/*
  # Add energetic category to feelings tables

  1. New Categories
    - Add 'energetic' to the category check constraints in both feelings tables
  
  2. New Feelings
    - Add energetic feelings for each HD type
    - Add generic energetic feelings
*/

-- Update constraints to include energetic category
DO $$
BEGIN
  -- Update constraint on feelings table
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'feelings_category_check' 
    AND conrelid = 'feelings'::regclass::oid
  ) THEN
    -- Get current constraint definition
    DECLARE
      current_constraint text;
    BEGIN
      SELECT pg_get_constraintdef(oid) INTO current_constraint
      FROM pg_constraint
      WHERE conname = 'feelings_category_check'
      AND conrelid = 'feelings'::regclass::oid;
      
      -- Check if energetic category is already included
      IF current_constraint NOT LIKE '%energetic%' THEN
        -- Drop old constraint
        ALTER TABLE feelings DROP CONSTRAINT feelings_category_check;
        
        -- Add new constraint with energetic category
        ALTER TABLE feelings ADD CONSTRAINT feelings_category_check 
          CHECK (category = ANY (ARRAY['general'::text, 'emotional'::text, 'physical'::text, 'mental'::text, 'digestive'::text, 'somatic'::text, 'energetic'::text]));
      END IF;
    END;
  END IF;
  
  -- Check if feelings_energia table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'feelings_energia'
  ) THEN
    -- Check if constraint exists
    IF EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'feelings_energia_category_check' 
      AND conrelid = 'feelings_energia'::regclass::oid
    ) THEN
      -- Get current constraint definition
      DECLARE
        current_constraint text;
      BEGIN
        SELECT pg_get_constraintdef(oid) INTO current_constraint
        FROM pg_constraint
        WHERE conname = 'feelings_energia_category_check'
        AND conrelid = 'feelings_energia'::regclass::oid;
        
        -- Check if energetic category is already included
        IF current_constraint NOT LIKE '%energetic%' THEN
          -- Drop old constraint
          ALTER TABLE feelings_energia DROP CONSTRAINT feelings_energia_category_check;
          
          -- Add new constraint with energetic category
          ALTER TABLE feelings_energia ADD CONSTRAINT feelings_energia_category_check 
            CHECK (category = ANY (ARRAY['general'::text, 'emotional'::text, 'physical'::text, 'mental'::text, 'digestive'::text, 'somatic'::text, 'energetic'::text]));
        END IF;
      END;
    ELSE
      -- If constraint doesn't exist, add it
      ALTER TABLE feelings_energia ADD CONSTRAINT feelings_energia_category_check 
        CHECK (category = ANY (ARRAY['general'::text, 'emotional'::text, 'physical'::text, 'mental'::text, 'digestive'::text, 'somatic'::text, 'energetic'::text]));
    END IF;
  END IF;
END $$;

-- Insert energetic feelings for each HD type
-- Projector feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Pic de clarté énergétique', 
  'projector', 
  'energetic', 
  'Une soudaine montée de lucidité t''envahit, comme si tout devenait évident.', 
  'Tu es alignée avec un moment juste, dans un environnement qui te nourrit.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}'], 
  'Ma lucidité est mon pouvoir.', 
  'Note ce que tu ressens. Ce pic est un repère à mémoriser.', 
  'Je capte', 
  'Je comprends', 
  'Ton énergie est directionnelle. Quand elle se pose au bon endroit, elle brille.', 
  91, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Pic de clarté énergétique' AND type_hd = 'projector' AND category = 'energetic'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Vide magnétique', 
  'projector', 
  'energetic', 
  'Tu ressens un vide profond, comme si ton champ énergétique était vidé de sa substance.', 
  'Tu as été exposée trop longtemps à des environnements qui ne te reconnaissent pas.', 
  ARRAY[jsonb '{"center": "g-center"}', jsonb '{"center": "heart"}', jsonb '{"center": "spleen"}'], 
  'Je mérite d''être vue et nourrie par ce qui me reconnaît.', 
  'Isole-toi. Ferme les yeux. Imagine une lumière douce remplir ton espace intérieur.', 
  'Je me régénère', 
  'Je me recentre', 
  'Ton énergie n''est pas faite pour être dilapidée. Elle est précieuse.', 
  32, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Vide magnétique' AND type_hd = 'projector' AND category = 'energetic'
);

-- Generator feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Élan sacral spontané', 
  'generator', 
  'energetic', 
  'Tu ressens une montée chaude et pleine de puissance dans le bas-ventre.', 
  'Tu es confrontée à une activité, une personne ou un choix qui réveille ton oui sacral.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "g-center"}', jsonb '{"center": "root"}'], 
  'Je réponds à la vie par mon feu intérieur.', 
  'Observe ce qui déclenche cette montée. C''est ta boussole vivante.', 
  'Je ressens', 
  'Je dis oui', 
  'Ton énergie est une réponse vivante. Ce feu sacral est ton signal de vérité.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Élan sacral spontané' AND type_hd = 'generator' AND category = 'energetic'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Énergie stagnante', 
  'generator', 
  'energetic', 
  'Tu ressens une lourdeur persistante, comme un moteur au point mort.', 
  'Tu es dans une activité qui ne te stimule pas ou te frustre.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}', jsonb '{"center": "heart"}'], 
  'Je mérite une réponse qui m''anime.', 
  'Stoppe. Observe. Reviens à un choix qui allume ton oui.', 
  'Je me respecte', 
  'Je me réaligne', 
  'Ta stagnation n''est pas une faiblesse, c''est un signal sacré.', 
  36, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Énergie stagnante' AND type_hd = 'generator' AND category = 'energetic'
);

-- Manifesting Generator feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Montée fulgurante d''énergie', 
  'manifesting-generator', 
  'energetic', 
  'Tu ressens une explosion d''énergie, prête à tout faire à la fois.', 
  'Tu viens de croiser un projet, une idée ou une personne qui allume ton feu hybride.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "g-center"}', jsonb '{"center": "root"}', jsonb '{"center": "throat"}'], 
  'Je suis faite pour agir vite quand je suis allumée.', 
  'Note cette impulsion. Donne-lui une direction claire et respectueuse de ton rythme.', 
  'Je démarre', 
  'Je construis', 
  'Cette montée est ton super pouvoir. Canalise-la pour créer ton monde.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Montée fulgurante d''énergie' AND type_hd = 'manifesting-generator' AND category = 'energetic'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Extinction brusque', 
  'manifesting-generator', 
  'energetic', 
  'Tu étais pleine d''énergie, et soudain, tout s''éteint.', 
  'Tu es allée trop vite, trop loin, sans pauses sacrales.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}', jsonb '{"center": "spleen"}'], 
  'Je n''ai pas à tout finir si mon feu s''éteint.', 
  'Repose-toi. Ton feu ne t''a pas trahie. Il s''est protégé.', 
  'Je me coupe', 
  'Je me respecte', 
  'Ce n''est pas un échec. C''est une sagesse physique. Écoute-la.', 
  31, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Extinction brusque' AND type_hd = 'manifesting-generator' AND category = 'energetic'
);

-- Manifestor feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Charge explosive intérieure', 
  'manifestor', 
  'energetic', 
  'Tu ressens une montée brutale d''énergie, presque incontrôlable, prête à initier quelque chose de fort.', 
  'Un besoin de création, de rupture ou de libération cherche à s''exprimer sans entrave.', 
  ARRAY[jsonb '{"center": "heart"}', jsonb '{"center": "throat"}', jsonb '{"center": "root"}'], 
  'Mon impulsion est sacrée. Je peux l''honorer avec puissance.', 
  'Écris ou exprime ce que tu ressens sans filtre. Libère sans blesser.', 
  'J''initie', 
  'Je libère', 
  'Tu es une porteuse de mouvement. Ce feu est ton droit sacré.', 
  93, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Charge explosive intérieure' AND type_hd = 'manifestor' AND category = 'energetic'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Coupure énergétique brutale', 
  'manifestor', 
  'energetic', 
  'Tu te sens soudainement éteinte, comme si un interrupteur avait coupé le courant.', 
  'Tu as été interrompue, contrôlée ou empêchée d''agir librement.', 
  ARRAY[jsonb '{"center": "heart"}', jsonb '{"center": "g-center"}', jsonb '{"center": "throat"}', jsonb '{"center": "root"}'], 
  'Je n''ai pas à m''excuser de mon rythme unique.', 
  'Éloigne-toi. Repose-toi dans le silence. Récupère ton territoire.', 
  'Je me retire', 
  'Je me respecte', 
  'Ta coupure n''est pas une faiblesse, c''est une réponse à l''intrusion.', 
  34, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Coupure énergétique brutale' AND type_hd = 'manifestor' AND category = 'energetic'
);

-- Reflector feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Vitalité lunaire fluide', 
  'reflector', 
  'energetic', 
  'Tu te sens vivante, paisible, en phase avec les cycles lunaires et les rythmes du monde.', 
  'Tu es en syntonie avec un environnement doux, respectueux et lent.', 
  ARRAY[jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}', jsonb '{"center": "ajna"}'], 
  'Je suis un miroir de paix quand je suis entourée de paix.', 
  'Expose-toi à la nature, au silence ou à la lumière lunaire. Reçois.', 
  'Je reflète', 
  'Je respire', 
  'Ta vitalité n''est jamais constante. Elle est belle parce qu''elle danse.', 
  90, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Vitalité lunaire fluide' AND type_hd = 'reflector' AND category = 'energetic'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Effondrement énergétique', 
  'reflector', 
  'energetic', 
  'Tu ne peux plus avancer. Ton corps dit stop, ton mental est embrumé.', 
  'Tu as ignoré ton besoin de repos cyclique ou tu t''es exposée à trop de pression.', 
  ARRAY[jsonb '{"center": "spleen"}', jsonb '{"center": "root"}', jsonb '{"center": "ajna"}'], 
  'Je ne suis pas faite pour être constante.', 
  'Coupe tout. Rentre dans ta grotte. Laisse-toi renaître demain.', 
  'Je m''arrête', 
  'Je récupère', 
  'Tu es lunaire, pas linéaire. Ton énergie reviendra.', 
  29, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Effondrement énergétique' AND type_hd = 'reflector' AND category = 'energetic'
);

-- Generic energetic feelings (no specific HD type)
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Flux énergétique harmonieux', 
  'energetic', 
  'Je ressens une circulation fluide d''énergie dans tout mon corps. Tout semble couler naturellement.', 
  'J''ai pris soin de mon équilibre énergétique et j''ai éliminé les blocages intérieurs.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "heart"}', jsonb '{"center": "throat"}'], 
  'Mon énergie circule librement quand je suis aligné(e).', 
  'Visualise un courant doré qui circule dans tout ton corps, dissolvant toute résistance.', 
  'Je laisse circuler', 
  'Je suis fluide', 
  'Cette fluidité énergétique est ton état naturel. Plus tu la reconnais, plus elle devient accessible.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Flux énergétique harmonieux' AND category = 'energetic'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Blocage énergétique', 
  'energetic', 
  'Je ressens une zone de stagnation ou de résistance dans mon champ énergétique. L''énergie ne circule pas librement.', 
  'Stress accumulé, émotions non exprimées, ou exposition à des énergies dissonantes.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "throat"}'], 
  'Je peux identifier et libérer ce qui bloque mon énergie.', 
  'Place tes mains sur la zone bloquée. Respire profondément en visualisant une lumière qui dissout le blocage.', 
  'Je reconnais', 
  'Je libère', 
  'Les blocages sont temporaires. En les reconnaissant avec compassion, tu leur permets de se dissoudre.', 
  35, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Blocage énergétique' AND category = 'energetic'
);

-- Add more generic energetic feelings
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Rayonnement énergétique', 
  'energetic', 
  'Je sens mon énergie rayonner au-delà des limites de mon corps. Je me sens expansif(ve) et lumineux(se).', 
  'Alignement profond avec mon essence, pratiques énergétiques régulières, ou moment de joie intense.', 
  ARRAY[jsonb '{"center": "heart"}', jsonb '{"center": "g-center"}', jsonb '{"center": "solar-plexus"}'], 
  'Je suis une source de lumière qui rayonne naturellement.', 
  'Tiens-toi debout, bras légèrement écartés. Visualise ta lumière qui s''étend autour de toi, touchant tout avec douceur.', 
  'Je rayonne', 
  'Je partage', 
  'Ce rayonnement est ta nature profonde. Il nourrit non seulement toi, mais aussi ceux qui t''entourent.', 
  98, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Rayonnement énergétique' AND category = 'energetic'
);