/*
  # Ajout de la catégorie État Digestif
  
  1. Nouvelles données
    - Ajout de la catégorie "digestive" aux contraintes de vérification des tables feelings et feelings_energia
    - Insertion des ressentis digestifs pour chaque type HD
  
  2. Modifications
    - Mise à jour des contraintes de vérification pour inclure la catégorie digestive
    - Utilisation de méthodes sécurisées pour éviter les erreurs de contrainte
  
  3. Sécurité
    - Vérification de l'existence des contraintes avant modification
    - Utilisation de blocs DO pour gérer les erreurs potentielles
*/

-- Première étape: Mettre à jour les contraintes pour inclure la catégorie digestive
DO $$
BEGIN
  -- Mettre à jour la contrainte sur la table feelings
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'feelings_category_check' 
    AND conrelid = 'feelings'::regclass::oid
  ) THEN
    -- Supprimer l'ancienne contrainte
    ALTER TABLE feelings DROP CONSTRAINT feelings_category_check;
    
    -- Ajouter la nouvelle contrainte avec la catégorie digestive
    ALTER TABLE feelings ADD CONSTRAINT feelings_category_check 
      CHECK (category = ANY (ARRAY['general'::text, 'emotional'::text, 'physical'::text, 'mental'::text, 'digestive'::text]));
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
        
        -- Vérifier si la catégorie digestive est déjà incluse
        IF current_constraint NOT LIKE '%digestive%' THEN
          -- Supprimer l'ancienne contrainte
          ALTER TABLE feelings_energia DROP CONSTRAINT feelings_energia_category_check;
          
          -- Ajouter la nouvelle contrainte avec la catégorie digestive
          ALTER TABLE feelings_energia ADD CONSTRAINT feelings_energia_category_check 
            CHECK (category = ANY (ARRAY['general'::text, 'emotional'::text, 'physical'::text, 'mental'::text, 'digestive'::text]));
        END IF;
      END;
    ELSE
      -- Si la contrainte n'existe pas, l'ajouter
      ALTER TABLE feelings_energia ADD CONSTRAINT feelings_energia_category_check 
        CHECK (category = ANY (ARRAY['general'::text, 'emotional'::text, 'physical'::text, 'mental'::text, 'digestive'::text]));
    END IF;
  END IF;
END $$;

-- Deuxième étape: Insérer les ressentis digestifs pour chaque type HD
-- Projector feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Ballonnement après interaction', 
  'projector', 
  'digestive', 
  'Ton ventre gonfle comme un ballon après avoir passé du temps avec certaines personnes ou dans un environnement chargé.', 
  'Tu as absorbé des émotions ou de l''énergie qui ne t''appartiennent pas, sans filtrer consciemment.', 
  ARRAY[jsonb '{"center": "spleen"}', jsonb '{"center": "solar-plexus"}', jsonb '{"center": "g-center"}'], 
  'Je digère mieux quand je m''entoure avec soin.', 
  'Mets les mains sur ton ventre, respire profondément et imagine que tu rends ce qui ne t''appartient pas.', 
  'Je relâche', 
  'Je me nettoie', 
  'Ton ventre est un capteur sensible. Il mérite des environnements doux et respectueux.', 
  42, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Ballonnement après interaction' AND type_hd = 'projector' AND category = 'digestive'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Digestion intuitive et fluide', 
  'projector', 
  'digestive', 
  'Tu sais exactement quoi manger, en quelle quantité, et tu te sens légère et nourrie après.', 
  'Tu as écouté ton intuition corporelle et respecté ton besoin de calme et de lenteur.', 
  ARRAY[jsonb '{"center": "spleen"}', jsonb '{"center": "solar-plexus"}', jsonb '{"center": "g-center"}'], 
  'Mon corps sait ce dont il a besoin.', 
  'Prends trois inspirations profondes avant de manger. Écoute si ton corps dit oui ou non.', 
  'Je ressens', 
  'Je reçois', 
  'Ta digestion devient divine quand tu te poses dans le moment présent.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Digestion intuitive et fluide' AND type_hd = 'projector' AND category = 'digestive'
);

-- Generator feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Frustration digestive', 
  'generator', 
  'digestive', 
  'Tu manges sans plaisir réel. Ton ventre est lourd, ton énergie descend, comme si ton feu sacral s''était éteint.', 
  'Tu as mangé par automatisme ou pour faire plaisir, sans écouter ta vraie envie.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "solar-plexus"}', jsonb '{"center": "spleen"}'], 
  'Mon corps mérite de l''enthousiasme, même dans l''alimentation.', 
  'Avant de manger, demande à ton ventre : est-ce que j''ai vraiment envie de ça ?', 
  'Je choisis', 
  'Je respecte', 
  'Ton plaisir digestif est sacré. Tu as le droit de manger avec désir, pas par devoir.', 
  39, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Frustration digestive' AND type_hd = 'generator' AND category = 'digestive'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Plaisir sacral en bouche', 
  'generator', 
  'digestive', 
  'Tu ressens une joie réelle à manger. Chaque bouchée est vivante, ton ventre réagit avec plaisir.', 
  'Tu as suivi ton autorité sacrale, mangé ce qui te fait vibrer sans compromis.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "solar-plexus"}', jsonb '{"center": "root"}'], 
  'Ce qui me nourrit me réjouit.', 
  'Ferme les yeux entre deux bouchées. Goûte chaque sensation, laisse ton feu s''embraser.', 
  'Je savoure', 
  'Je m''aligne', 
  'Ta digestion commence par l''enthousiasme. C''est une porte d''accès à ta puissance.', 
  92, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Plaisir sacral en bouche' AND type_hd = 'generator' AND category = 'digestive'
);

-- Manifesting Generator feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Repas zappé', 
  'manifesting-generator', 
  'digestive', 
  'Tu réalises que tu as mangé sans vraiment t''en rendre compte. Ton corps est repu, mais ton esprit ne l''a pas vécu.', 
  'Tu es allée trop vite, dans ton rythme naturel d''action. Tu as sauté la pleine présence.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}', jsonb '{"center": "throat"}'], 
  'Je mérite aussi de savourer lentement.', 
  'Refais un mini-repas en conscience : 2 bouchées, lentes, en silence.', 
  'Je ralentis', 
  'Je m''ancre', 
  'Ton énergie est rapide, mais ta digestion demande de la présence.', 
  38, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Repas zappé' AND type_hd = 'manifesting-generator' AND category = 'digestive'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Nourriture comme carburant divin', 
  'manifesting-generator', 
  'digestive', 
  'Tu sens que ce que tu as mangé t''active dans toutes tes dimensions : énergie, créativité, intuition, mouvement.', 
  'Tu as honoré ton timing unique, ton autorité intérieure, et tu t''es laissée guider par ton feu sacré.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "g-center"}', jsonb '{"center": "throat"}', jsonb '{"center": "solar-plexus"}', jsonb '{"center": "root"}'], 
  'Je transforme la matière en lumière.', 
  'Médite 2 minutes après avoir mangé, en te visualisant comme une torche vivante.', 
  'Je suis feu', 
  'Je suis propulsion', 
  'Ton alimentation devient une technologie divine quand elle est choisie en pleine réponse.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Nourriture comme carburant divin' AND type_hd = 'manifesting-generator' AND category = 'digestive'
);

-- Manifestor feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Refus de manger imposé', 
  'manifestor', 
  'digestive', 
  'Tu ressens une crispation dès que l''on t''impose un rythme ou un contenu alimentaire.', 
  'Ton système réagit fortement à toute tentative de contrôle. Tu as besoin de souveraineté digestive.', 
  ARRAY[jsonb '{"center": "throat"}', jsonb '{"center": "solar-plexus"}', jsonb '{"center": "root"}'], 
  'Je mange quand c''est juste pour moi.', 
  'Prends un moment seule pour sentir ce que ton corps demande, sans influence extérieure.', 
  'Je choisis', 
  'Je m''impose', 
  'Ta digestion commence par ta liberté. Tu es la seule à savoir ce qui est bon pour toi.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Refus de manger imposé' AND type_hd = 'manifestor' AND category = 'digestive'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Souveraineté digestive sacrée', 
  'manifestor', 
  'digestive', 
  'Tu manges dans un état d''accord total avec toi-même. C''est simple, aligné, puissant, vibrant.', 
  'Tu as respecté ton autorité intérieure. Aucun compromis. Juste ton feu en action.', 
  ARRAY[jsonb '{"center": "throat"}', jsonb '{"center": "g-center"}', jsonb '{"center": "root"}', jsonb '{"center": "solar-plexus"}', jsonb '{"center": "spleen"}'], 
  'Je suis libre dans chaque bouchée.', 
  'Visualise-toi comme une reine/roi dans ton palais intérieur, recevant la nourriture que tu as choisie.', 
  'Je m''honore', 
  'Je me nourris', 
  'Ta digestion est royale quand elle est choisie avec amour.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Souveraineté digestive sacrée' AND type_hd = 'manifestor' AND category = 'digestive'
);

-- Reflector feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Repas émotionnel absorbé', 
  'reflector', 
  'digestive', 
  'Tu as mangé dans une ambiance tendue ou triste, et ton ventre a absorbé toute l''énergie ambiante.', 
  'Ta digestion reflète l''atmosphère collective. Tu n''as pas filtré l''émotion autour de toi.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "spleen"}', jsonb '{"center": "g-center"}'], 
  'Je peux choisir ce que j''intègre.', 
  'Prends 3 grandes respirations loin de la table. Ferme les yeux. Visualise une bulle autour de toi.', 
  'Je filtre', 
  'Je protège', 
  'Tu as le droit de te nourrir dans un espace pur, à ton rythme, loin des projections.', 
  39, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Repas émotionnel absorbé' AND type_hd = 'reflector' AND category = 'digestive'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Nourriture comme fréquence de guérison', 
  'reflector', 
  'digestive', 
  'Tu sens que ce que tu as mangé t''a réalignée, purifiée, élevée. Ce n''est pas un repas, c''est un soin.', 
  'Tu as été guidée par une intuition très fine. Ton corps et l''aliment ont fusionné vibratoirement.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "spleen"}', jsonb '{"center": "solar-plexus"}', jsonb '{"center": "g-center"}'], 
  'Je me guéris par la lumière de ce que je reçois.', 
  'Prie ou chante doucement après le repas. Ancre la vibration.', 
  'Je guéris', 
  'Je m''élève', 
  'Tu es une prêtresse vibratoire. Ton corps sait capter la médecine cachée.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Nourriture comme fréquence de guérison' AND type_hd = 'reflector' AND category = 'digestive'
);

-- Generic digestive feelings (no specific HD type)
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Digestion harmonieuse', 
  'digestive', 
  'Mon système digestif fonctionne parfaitement. Je me sens légère et énergisée après avoir mangé.', 
  'J''ai mangé des aliments qui me conviennent, à mon rythme, dans un environnement calme.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "sacral"}'], 
  'Mon corps sait transformer la nourriture en énergie vitale.', 
  'Après le repas, pose tes mains sur ton ventre et remercie ton corps pour sa sagesse digestive.', 
  'Je reçois', 
  'Je transforme', 
  'Ta digestion est le reflet de ton harmonie intérieure. Prends-en soin comme d''un trésor.', 
  90, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Digestion harmonieuse' AND category = 'digestive'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Inconfort digestif', 
  'digestive', 
  'Je ressens une gêne dans mon ventre après avoir mangé. Ballonnements, lourdeur ou crampes perturbent mon confort.', 
  'Alimentation trop rapide, stress pendant le repas, ou aliments qui ne me conviennent pas.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "sacral"}'], 
  'J''écoute les messages de mon ventre avec bienveillance.', 
  'Allonge-toi sur le côté gauche pendant 10 minutes. Respire profondément en visualisant ton ventre qui se détend.', 
  'Je relâche', 
  'Je m''apaise', 
  'Ton inconfort est un message, pas une punition. Écoute-le avec douceur pour mieux comprendre tes besoins.', 
  35, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Inconfort digestif' AND category = 'digestive'
);

-- Ajouter d'autres ressentis digestifs génériques
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Satiété consciente', 
  'digestive', 
  'Je reconnais facilement quand j''ai suffisamment mangé. Je m''arrête naturellement au bon moment, sans excès ni privation.', 
  'J''ai développé une écoute fine des signaux de mon corps et je respecte ses limites.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "spleen"}', jsonb '{"center": "sacral"}'], 
  'Je sais quand c''est assez, et je respecte cette sagesse.', 
  'À mi-repas, pose ta fourchette et prends trois grandes respirations. Demande à ton corps : ai-je encore faim ?', 
  'J''écoute', 
  'Je respecte', 
  'Cette capacité à reconnaître ta satiété est une forme profonde d''amour-propre. Continue à la cultiver.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Satiété consciente' AND category = 'digestive'
);