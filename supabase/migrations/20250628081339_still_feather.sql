/*
  # Ajout de la catégorie Cycle Féminin
  
  1. Nouvelles Tables
    - Aucune nouvelle table créée
    
  2. Modifications
    - Mise à jour des contraintes pour inclure la catégorie 'feminine_cycle'
    - Ajout de données pour les ressentis liés au cycle féminin pour chaque type HD
    
  3. Sécurité
    - Aucune modification de sécurité
*/

-- Première étape: Mettre à jour les contraintes pour inclure la catégorie cycle féminin
DO $$
BEGIN
  -- Mettre à jour la contrainte sur la table feelings
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'feelings_category_check' 
    AND conrelid = 'feelings'::regclass::oid
  ) THEN
    -- Récupérer la définition actuelle de la contrainte
    DECLARE
      current_constraint text;
    BEGIN
      SELECT pg_get_constraintdef(oid) INTO current_constraint
      FROM pg_constraint
      WHERE conname = 'feelings_category_check'
      AND conrelid = 'feelings'::regclass::oid;
      
      -- Vérifier si la catégorie cycle féminin est déjà incluse
      IF current_constraint NOT LIKE '%feminine_cycle%' THEN
        -- Supprimer l'ancienne contrainte
        ALTER TABLE feelings DROP CONSTRAINT feelings_category_check;
        
        -- Ajouter la nouvelle contrainte avec la catégorie cycle féminin
        ALTER TABLE feelings ADD CONSTRAINT feelings_category_check 
          CHECK (category = ANY (ARRAY['general'::text, 'emotional'::text, 'physical'::text, 'mental'::text, 'digestive'::text, 'somatic'::text, 'energetic'::text, 'feminine_cycle'::text, 'hd_specific'::text]));
      END IF;
    END;
  END IF;
  
  -- Vérifier si la table feelings_energia existe
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'feelings_energia'
  ) THEN
    -- Vérifier si la contrainte existe
    IF EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'feelings_energia_category_check' 
      AND conrelid = 'feelings_energia'::regclass::oid
    ) THEN
      -- Récupérer la définition actuelle de la contrainte
      DECLARE
        current_constraint text;
      BEGIN
        SELECT pg_get_constraintdef(oid) INTO current_constraint
        FROM pg_constraint
        WHERE conname = 'feelings_energia_category_check'
        AND conrelid = 'feelings_energia'::regclass::oid;
        
        -- Vérifier si la catégorie cycle féminin est déjà incluse
        IF current_constraint NOT LIKE '%feminine_cycle%' THEN
          -- Supprimer l'ancienne contrainte
          ALTER TABLE feelings_energia DROP CONSTRAINT feelings_energia_category_check;
          
          -- Ajouter la nouvelle contrainte avec la catégorie cycle féminin
          ALTER TABLE feelings_energia ADD CONSTRAINT feelings_energia_category_check 
            CHECK (category = ANY (ARRAY['general'::text, 'emotional'::text, 'physical'::text, 'mental'::text, 'digestive'::text, 'somatic'::text, 'energetic'::text, 'feminine_cycle'::text, 'hd_specific'::text]));
        END IF;
      END;
    ELSE
      -- Si la contrainte n'existe pas, l'ajouter
      ALTER TABLE feelings_energia ADD CONSTRAINT feelings_energia_category_check 
        CHECK (category = ANY (ARRAY['general'::text, 'emotional'::text, 'physical'::text, 'mental'::text, 'digestive'::text, 'somatic'::text, 'energetic'::text, 'feminine_cycle'::text, 'hd_specific'::text]));
    END IF;
  END IF;
END $$;

-- Deuxième étape: Insérer les ressentis du cycle féminin pour chaque type HD
-- Projector feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Clarté intuitive ovulatoire', 
  'projector', 
  'feminine_cycle', 
  'Tu ressens un moment de lumière, de cohérence intérieure et d''inspiration.', 
  'Tu es dans la phase ovulatoire, ton champ magnétique est à son apogée.', 
  ARRAY[jsonb '{"center": "g-center"}', jsonb '{"center": "throat"}', jsonb '{"center": "ajna"}'], 
  'Je rayonne sans effort quand je suis au centre de moi.', 
  'Exprime-toi, partage, offre-toi à la vie sans forcer.', 
  'Je rayonne', 
  'Je m''offre', 
  'C''est un moment de fécondité énergétique. Laisse-le s''exprimer.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Clarté intuitive ovulatoire' AND type_hd = 'projector' AND category = 'feminine_cycle'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Hypersensibilité prémenstruelle', 
  'projector', 
  'feminine_cycle', 
  'Tu te sens ultra sensible, chaque émotion devient une vague intérieure.', 
  'Tu entres dans la phase prémenstruelle, où ton système énergétique capte tout.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "spleen"}', jsonb '{"center": "g-center"}'], 
  'Je m''autorise à être traversée sans me juger.', 
  'Réduis les interactions. Écris ce que tu ressens sans filtre.', 
  'Je ressens', 
  'Je me respecte', 
  'Cette hypersensibilité est un appel à ralentir. Elle ne durera pas.', 
  38, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Hypersensibilité prémenstruelle' AND type_hd = 'projector' AND category = 'feminine_cycle'
);

-- Generator feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Montée d''énergie ovulatoire', 
  'generator', 
  'feminine_cycle', 
  'Tu sens ton énergie monter naturellement, ton envie d''agir et de créer se déploie sans effort.', 
  'La phase ovulatoire active ton feu sacral et ton aura devient magnétique.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "g-center"}', jsonb '{"center": "throat"}'], 
  'Je suis fertile dans tous les sens du mot.', 
  'Choisis une action qui te fait vibrer et mets-la en mouvement.', 
  'Je rayonne', 
  'Je crée', 
  'Tu es dans ton feu. Savoure cette montée. Elle est précieuse.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Montée d''énergie ovulatoire' AND type_hd = 'generator' AND category = 'feminine_cycle'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Chute de motivation prémenstruelle', 
  'generator', 
  'feminine_cycle', 
  'Tu sens ton feu s''éteindre, ton élan se réduire et tes envies se brouiller.', 
  'Tu entres dans la phase prémenstruelle, où ton énergie se retire pour préparer l''élimination.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "spleen"}', jsonb '{"center": "root"}'], 
  'Mon énergie n''est pas linéaire. Elle obéit à une sagesse plus profonde.', 
  'Réduis les tâches. Honore les pauses. Nourris-toi autrement.', 
  'Je ralentis', 
  'Je respecte mon feu', 
  'Ce ralentissement est une transition. Il te prépare à renaître.', 
  36, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Chute de motivation prémenstruelle' AND type_hd = 'generator' AND category = 'feminine_cycle'
);

-- Manifesting Generator feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Rythme accéléré ovulatoire', 
  'manifesting-generator', 
  'feminine_cycle', 
  'Tu sens une vague d''élan, de désir d''agir vite, d''aller partout à la fois.', 
  'Ton feu ovulatoire amplifie ton énergie hybride. Tu vibres fort.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "throat"}', jsonb '{"center": "g-center"}', jsonb '{"center": "root"}'], 
  'Je crée à mon rythme, même s''il va plus vite que les autres.', 
  'Lance plusieurs idées. Bouge. Canalise en créant, pas en te contrôlant.', 
  'Je pulse', 
  'Je manifeste', 
  'Ton énergie est cyclique ET fulgurante. Ne t''excuse pas d''aller vite.', 
  94, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Rythme accéléré ovulatoire' AND type_hd = 'manifesting-generator' AND category = 'feminine_cycle'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Blocage physique soudain', 
  'manifesting-generator', 
  'feminine_cycle', 
  'Tu sens ton corps dire non d''un coup, alors que tu étais pleine d''élan.', 
  'Tu ignores une phase prémenstruelle ou menstruelle et ton corps te stoppe net.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "spleen"}', jsonb '{"center": "root"}'], 
  'Mon cycle me parle plus vite que ma tête.', 
  'Stoppe. Observe ton flux. Respire. Réajuste ton tempo.', 
  'Je freine', 
  'Je m''honore', 
  'Ton feu a besoin de pauses pour rester juste. Ton cycle te protège.', 
  31, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Blocage physique soudain' AND type_hd = 'manifesting-generator' AND category = 'feminine_cycle'
);

-- Manifestor feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Phase ovulatoire de puissance magnétique', 
  'manifestor', 
  'feminine_cycle', 
  'Tu te sens souveraine, rayonnante, impossible à ignorer.', 
  'Ta montée hormonale nourrit ton aura d''impact.', 
  ARRAY[jsonb '{"center": "g-center"}', jsonb '{"center": "throat"}', jsonb '{"center": "heart"}'], 
  'Je suis une force créatrice en pleine expression.', 
  'Fais un acte public : poste, parle, montre-toi.', 
  'Je rayonne', 
  'Je gouverne', 
  'C''est un pic d''énergie. Utilise-le sans t''excuser.', 
  96, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Phase ovulatoire de puissance magnétique' AND type_hd = 'manifestor' AND category = 'feminine_cycle'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Phase menstruelle d''isolement', 
  'manifestor', 
  'feminine_cycle', 
  'Tu ressens le besoin de t''isoler totalement. Même la présence des autres devient agressive.', 
  'Ton corps manifeste une mise à distance pendant le saignement.', 
  ARRAY[jsonb '{"center": "root"}', jsonb '{"center": "spleen"}', jsonb '{"center": "heart"}'], 
  'Mon sang appelle le silence, pas la performance.', 
  'Planifie une journée off. Aucune explication. Coupe tout.', 
  'Je me retire', 
  'Je m''écoute', 
  'Ce besoin d''isolement n''est pas une fuite. C''est une souveraineté.', 
  38, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Phase menstruelle d''isolement' AND type_hd = 'manifestor' AND category = 'feminine_cycle'
);

-- Reflector feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Lune synchronisée au cycle', 
  'reflector', 
  'feminine_cycle', 
  'Tu ressens un alignement parfait entre ton flux menstruel et les phases lunaires.', 
  'Ton cycle et la lune sont en syntonie. Tu vis selon ta vraie horloge.', 
  ARRAY[jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}', jsonb '{"center": "root"}'], 
  'Je suis le reflet de la Lune en moi.', 
  'Observe la phase de la Lune. Note ce qu''elle t''inspire.', 
  'Je reflète', 
  'Je suis guidée', 
  'Cette harmonie est rare. C''est une bénédiction.', 
  98, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Lune synchronisée au cycle' AND type_hd = 'reflector' AND category = 'feminine_cycle'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Désorientation hormonale', 
  'reflector', 
  'feminine_cycle', 
  'Tu ne sais plus où tu en es. Tes sensations varient d''heure en heure.', 
  'Ta grande réceptivité rend chaque phase intense, surtout dans un environnement instable.', 
  ARRAY[jsonb '{"center": "g-center"}', jsonb '{"center": "head"}', jsonb '{"center": "spleen"}'], 
  'Mon corps est un baromètre, pas un problème.', 
  'Change d''espace. Respire. Trouve un lieu neutre.', 
  'Je ressens', 
  'Je m''ancre', 
  'Ce n''est pas toi qui es instable. Tu captes beaucoup. Protège-toi.', 
  35, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Désorientation hormonale' AND type_hd = 'reflector' AND category = 'feminine_cycle'
);

-- Generic feminine cycle feelings (no specific HD type)
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Harmonie cyclique', 
  'feminine_cycle', 
  'Je me sens en harmonie avec mon cycle menstruel. Chaque phase est accueillie avec conscience et respect.', 
  'J''ai développé une relation saine avec mon cycle et j''honore ses différentes phases.', 
  ARRAY[jsonb '{"center": "g-center"}', jsonb '{"center": "sacral"}', jsonb '{"center": "spleen"}'], 
  'Mon cycle est une sagesse incarnée.', 
  'Prends un moment pour identifier ta phase actuelle et note ce qu''elle t''apporte comme sagesse.', 
  'J''honore', 
  'Je célèbre', 
  'Cette harmonie avec ton cycle est une forme profonde d''amour-propre. Elle te connecte à ta nature cyclique.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Harmonie cyclique' AND category = 'feminine_cycle'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Douleurs menstruelles intenses', 
  'feminine_cycle', 
  'Je ressens des douleurs physiques intenses pendant mes règles qui limitent mes activités.', 
  'Tensions accumulées, déséquilibres hormonaux, ou problèmes gynécologiques sous-jacents.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}'], 
  'J''écoute la sagesse de mon corps, même quand elle s''exprime par la douleur.', 
  'Applique une bouillotte chaude sur ton bas-ventre. Respire profondément en visualisant ton utérus qui se détend.', 
  'J''accueille', 
  'Je relâche', 
  'Cette douleur mérite ton attention et tes soins. Elle n''est pas une punition mais un message.', 
  30, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Douleurs menstruelles intenses' AND category = 'feminine_cycle'
);

-- Ajouter d'autres ressentis génériques du cycle féminin
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Connexion à la sagesse cyclique', 
  'feminine_cycle', 
  'Je ressens une profonde connexion à la sagesse de mon cycle. Chaque phase m''apporte des enseignements uniques.', 
  'J''ai développé une conscience aiguë des fluctuations de mon énergie à travers mon cycle.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}'], 
  'Mon cycle est mon guide intérieur.', 
  'Tiens un journal de ton cycle et note les insights qui émergent à chaque phase.', 
  'J''écoute', 
  'J''apprends', 
  'Cette connexion à ta sagesse cyclique est un trésor. Elle te guide vers une vie plus alignée avec ta nature profonde.', 
  98, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Connexion à la sagesse cyclique' AND category = 'feminine_cycle'
);