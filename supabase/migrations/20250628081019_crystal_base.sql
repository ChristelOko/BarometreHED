-- Première étape: Mettre à jour les contraintes pour inclure la catégorie spécifique HD
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
      
      -- Vérifier si la catégorie spécifique HD est déjà incluse
      IF current_constraint NOT LIKE '%hd_specific%' THEN
        -- Supprimer l'ancienne contrainte
        ALTER TABLE feelings DROP CONSTRAINT feelings_category_check;
        
        -- Ajouter la nouvelle contrainte avec la catégorie spécifique HD
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
        
        -- Vérifier si la catégorie spécifique HD est déjà incluse
        IF current_constraint NOT LIKE '%hd_specific%' THEN
          -- Supprimer l'ancienne contrainte
          ALTER TABLE feelings_energia DROP CONSTRAINT feelings_energia_category_check;
          
          -- Ajouter la nouvelle contrainte avec la catégorie spécifique HD
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

-- Deuxième étape: Insérer les ressentis spécifiques HD pour chaque type HD
-- Projector feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Clarté de direction intérieure', 
  'projector', 
  'hd_specific', 
  'Tu sens exactement ce qui est juste, où aller, quoi dire. C''est limpide.', 
  'Tu es dans ton autorité. Ta vision est alignée à ton rôle de guide.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}'], 
  'Je sais où je vais. Et j''ai le droit d''attendre l''invitation pour l''offrir.', 
  'Note cette clarté. Garde-la précieusement. Elle te servira.', 
  'Je vois', 
  'Je garde confiance', 
  'Ce sens de direction, c''est ton cadeau Projector. Il mérite d''être attendu.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Clarté de direction intérieure' AND type_hd = 'projector' AND category = 'hd_specific'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Invisibilité douloureuse', 
  'projector', 
  'hd_specific', 
  'Tu as l''impression d''être transparente. Personne ne te consulte, ne te voit.', 
  'Tu n''es pas reconnu·e. Tu essaies peut-être de te rendre visible sans invitation.', 
  ARRAY[jsonb '{"center": "throat"}', jsonb '{"center": "g-center"}', jsonb '{"center": "heart"}'], 
  'Je n''ai pas à me prouver. Ma sagesse se révèle au bon moment.', 
  'Retiens ton élan. Observe. Offre-toi de la reconnaissance intérieure.', 
  'Je suis là', 
  'Je me reconnais', 
  'Tu n''es pas invisible. Tu es précieuse. Ta reconnaissance commence par toi.', 
  32, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Invisibilité douloureuse' AND type_hd = 'projector' AND category = 'hd_specific'
);

-- Generator feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Engagement plein et nourrissant', 
  'generator', 
  'hd_specific', 
  'Tu es absorbée dans une activité qui te remplit. Le temps disparaît.', 
  'Ton sacral est activé par une réponse alignée. Tu es dans ton flot naturel.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "g-center"}', jsonb '{"center": "root"}'], 
  'Je suis faite pour construire avec passion.', 
  'Identifie ce qui t''active ainsi. Fais-en une priorité.', 
  'Je m''engage', 
  'Je savoure', 
  'Quand tu dis oui avec ton corps, tu entres dans ton pouvoir sacré.', 
  98, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Engagement plein et nourrissant' AND type_hd = 'generator' AND category = 'hd_specific'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Oui mental non sacral', 
  'generator', 
  'hd_specific', 
  'Tu as dit oui alors que ton corps disait non. Et tu t''en veux.', 
  'Tu as réagi depuis le mental, pas depuis ta vérité énergétique.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "ajna"}', jsonb '{"center": "throat"}'], 
  'Je suis libre de dire non, même après avoir dit oui.', 
  'Annule ou ajuste. Honore ton vrai oui.', 
  'Je m''écoute', 
  'Je rectifie', 
  'C''est en te corrigeant que tu retrouves ton axe. Pas en t''accusant.', 
  41, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Oui mental non sacral' AND type_hd = 'generator' AND category = 'hd_specific'
);

-- Manifesting Generator feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Éclair d''énergie fulgurant', 
  'manifesting-generator', 
  'hd_specific', 
  'Une poussée soudaine d''envie te traverse. Tu veux tout lancer maintenant.', 
  'Ton canal d''initiation est activé. Tu reçois un feu pur.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "throat"}', jsonb '{"center": "root"}'], 
  'Quand l''élan est là, je n''ai pas à douter.', 
  'Note l''idée. Respire. Vérifie ensuite ton sacral.', 
  'Je reçois', 
  'Je canalise', 
  'Ces éclairs sont tes messagers. À toi de les honorer sans t''éparpiller.', 
  91, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Éclair d''énergie fulgurant' AND type_hd = 'manifesting-generator' AND category = 'hd_specific'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Impatience explosive', 
  'manifesting-generator', 
  'hd_specific', 
  'Tu veux que tout aille plus vite. Tu t''agaces de la lenteur autour.', 
  'Ton énergie est plus rapide que la moyenne. Mais le monde ne suit pas.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}', jsonb '{"center": "ajna"}'], 
  'Mon rythme est unique. Mon impatience est un signal.', 
  'Fais un sprint symbolique (physique ou écrit). Laisse sortir la pression.', 
  'Je tempère', 
  'Je choisis', 
  'Tu n''as pas à tout faire maintenant. Mais ton feu est précieux.', 
  39, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Impatience explosive' AND type_hd = 'manifesting-generator' AND category = 'hd_specific'
);

-- Manifestor feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Élan pur d''initiation', 
  'manifestor', 
  'hd_specific', 
  'Tu ressens une poussée inarrêtable de faire, dire ou lancer quelque chose.', 
  'Ton aura est ouverte pour initier. Tu es dans ton rôle de déclencheuse.', 
  ARRAY[jsonb '{"center": "throat"}', jsonb '{"center": "root"}', jsonb '{"center": "heart"}'], 
  'Je suis née pour initier. C''est ma vérité profonde.', 
  'Écris ou dis à voix haute ce que tu veux activer. Ne retiens rien.', 
  'J''ose', 
  'J''ouvre le chemin', 
  'Ce feu intérieur est sacré. Il mérite ta confiance absolue.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Élan pur d''initiation' AND type_hd = 'manifestor' AND category = 'hd_specific'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Colère inexpliquée', 
  'manifestor', 
  'hd_specific', 
  'Une montée de rage ou d''irritation surgit, sans cause apparente.', 
  'Tu es bloquée dans ton initiation. Ton aura est contrariée.', 
  ARRAY[jsonb '{"center": "heart"}', jsonb '{"center": "throat"}', jsonb '{"center": "root"}'], 
  'Ma colère est une messagère. Elle me demande d''agir ou de me retirer.', 
  'Crée un espace pour toi. Va marcher. Respire avec les poings serrés puis relâchés.', 
  'Je ressens', 
  'Je choisis mon mouvement', 
  'Ta colère est sacrée. Elle contient ta direction non vécue.', 
  42, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Colère inexpliquée' AND type_hd = 'manifestor' AND category = 'hd_specific'
);

-- Reflector feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Clarté lunaire intérieure', 
  'reflector', 
  'hd_specific', 
  'Tu te sens centrée, paisible, en écho doux avec l''énergie du moment.', 
  'Ton aura a filtré les environnements. Tu es accordée à ta vibration naturelle.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}'], 
  'Quand je me donne le temps, tout devient limpide.', 
  'Note la phase de la lune. Observe comment tu te sens. Crée ton journal lunaire.', 
  'Je reflète', 
  'Je m''accorde', 
  'Ta sagesse est cyclique. Elle fleurit quand tu honores ton tempo.', 
  93, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Clarté lunaire intérieure' AND type_hd = 'reflector' AND category = 'hd_specific'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Sensation d''être envahie', 
  'reflector', 
  'hd_specific', 
  'Tu ressens les émotions ou les énergies des autres comme si c''étaient les tiennes.', 
  'Tu as absorbé des énergies externes sans filtre ni recentrage.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "ajna"}', jsonb '{"center": "g-center"}'], 
  'Ce que je ressens n''est pas toujours à moi.', 
  'Place-toi seule, respire profondément, pose la main sur le cœur. Demande : est-ce à moi ?', 
  'Je me sépare', 
  'Je me recentre', 
  'Tu n''es pas submergée. Tu es sensible. Et tu peux choisir ce que tu gardes.', 
  36, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Sensation d''être envahie' AND type_hd = 'reflector' AND category = 'hd_specific'
);

-- Generic HD specific feelings (no specific HD type)
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Alignement avec mon design', 
  'hd_specific', 
  'Je me sens en parfaite harmonie avec mon design énergétique. Mes décisions et actions sont alignées avec ma nature profonde.', 
  'J''ai respecté mon autorité intérieure et suivi ma stratégie Human Design.', 
  ARRAY[jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}'], 
  'Je suis fidèle à mon design unique.', 
  'Prends un moment pour reconnaître comment tu te sens quand tu es aligné(e) avec ton design. Ancre cette sensation.', 
  'Je suis authentique', 
  'Je suis aligné(e)', 
  'Cet alignement est ta boussole intérieure. Plus tu le reconnais, plus il devient facile à retrouver.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Alignement avec mon design' AND category = 'hd_specific'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Désalignement avec mon design', 
  'hd_specific', 
  'Je me sens en contradiction avec ma nature profonde. Mes actions semblent forcées ou inappropriées pour mon type énergétique.', 
  'J''ai ignoré mon autorité intérieure ou suivi des conseils qui ne correspondent pas à mon design.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "root"}'], 
  'Je peux revenir à mon design authentique à tout moment.', 
  'Prends un moment de pause. Respire profondément et demande-toi : quelle serait l''action alignée avec mon design maintenant ?', 
  'Je reconnais', 
  'Je me réaligne', 
  'Ce sentiment de désalignement est précieux. Il te montre le chemin du retour vers ton authenticité.', 
  35, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Désalignement avec mon design' AND category = 'hd_specific'
);

-- Ajouter d'autres ressentis génériques spécifiques HD
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Reconnaissance de mon autorité intérieure', 
  'hd_specific', 
  'Je ressens clairement ma sagesse intérieure me guider dans mes décisions. Je sais quand quelque chose est juste pour moi.', 
  'J''ai développé une relation consciente avec mon autorité intérieure et je lui fais confiance.', 
  ARRAY[jsonb '{"center": "spleen"}', jsonb '{"center": "solar-plexus"}', jsonb '{"center": "sacral"}'], 
  'Mon autorité intérieure est ma boussole personnelle.', 
  'Avant de prendre une décision importante, prends un moment pour consulter ton autorité intérieure. Observe sa réponse.', 
  'J''écoute', 
  'Je fais confiance', 
  'Cette connexion à ton autorité intérieure est ta plus grande force. Elle te guide toujours vers ce qui est juste pour toi.', 
  98, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Reconnaissance de mon autorité intérieure' AND category = 'hd_specific'
);