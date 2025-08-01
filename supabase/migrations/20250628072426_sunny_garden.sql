-- Première étape: Mettre à jour les contraintes pour inclure la catégorie somatique
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
      
      -- Vérifier si la catégorie somatique est déjà incluse
      IF current_constraint NOT LIKE '%somatic%' THEN
        -- Supprimer l'ancienne contrainte
        ALTER TABLE feelings DROP CONSTRAINT feelings_category_check;
        
        -- Ajouter la nouvelle contrainte avec la catégorie somatique
        ALTER TABLE feelings ADD CONSTRAINT feelings_category_check 
          CHECK (category = ANY (ARRAY['general'::text, 'emotional'::text, 'physical'::text, 'mental'::text, 'digestive'::text, 'somatic'::text]));
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
        
        -- Vérifier si la catégorie somatique est déjà incluse
        IF current_constraint NOT LIKE '%somatic%' THEN
          -- Supprimer l'ancienne contrainte
          ALTER TABLE feelings_energia DROP CONSTRAINT feelings_energia_category_check;
          
          -- Ajouter la nouvelle contrainte avec la catégorie somatique
          ALTER TABLE feelings_energia ADD CONSTRAINT feelings_energia_category_check 
            CHECK (category = ANY (ARRAY['general'::text, 'emotional'::text, 'physical'::text, 'mental'::text, 'digestive'::text, 'somatic'::text]));
        END IF;
      END;
    ELSE
      -- Si la contrainte n'existe pas, l'ajouter
      ALTER TABLE feelings_energia ADD CONSTRAINT feelings_energia_category_check 
        CHECK (category = ANY (ARRAY['general'::text, 'emotional'::text, 'physical'::text, 'mental'::text, 'digestive'::text, 'somatic'::text]));
    END IF;
  END IF;
END $$;

-- Deuxième étape: Insérer les ressentis somatiques pour chaque type HD
-- Projector feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Tension dans les épaules', 
  'projector', 
  'somatic', 
  'Tu ressens un poids entre les omoplates, comme si tu portais un fardeau invisible.', 
  'Tu as endossé des responsabilités ou des attentes qui ne t''appartiennent pas.', 
  ARRAY[jsonb '{"center": "g-center"}', jsonb '{"center": "heart"}', jsonb '{"center": "spleen"}'], 
  'Je suis libre de ne porter que ce qui m''appartient.', 
  'Allonge-toi sur le dos, bras écartés. Respire lentement dans cette zone.', 
  'Je relâche', 
  'Je me libère', 
  'Tu es là pour guider, pas pour porter. Allège-toi.', 
  39, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Tension dans les épaules' AND type_hd = 'projector' AND category = 'somatic'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Frisson de reconnaissance', 
  'projector', 
  'somatic', 
  'Tu ressens un frisson doux, un picotement subtil sur la peau, comme un oui énergétique.', 
  'Tu as été vue, entendue ou reconnue dans ta vérité.', 
  ARRAY[jsonb '{"center": "g-center"}', jsonb '{"center": "throat"}', jsonb '{"center": "ajna"}'], 
  'Je suis touchée par la vérité.', 
  'Note ce qui a provoqué ce frisson. C''est un message-clé pour toi.', 
  'Je reçois', 
  'Je vibre', 
  'Ce frisson, c''est ton corps qui dit oui. Honore-le.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Frisson de reconnaissance' AND type_hd = 'projector' AND category = 'somatic'
);

-- Generator feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Élan dans les jambes', 
  'generator', 
  'somatic', 
  'Tu sens une vibration dans les jambes, comme une envie de bouger ou d''agir qui monte de la terre.', 
  'Ton énergie sacrale est activée. Tu es en résonance avec un désir authentique.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}'], 
  'Mon corps me dit : ''Oui, vas-y.''', 
  'Marche rapidement ou danse quelques minutes pour honorer l''élan.', 
  'Je sens', 
  'Je suis portée', 
  'Ton corps sait avant toi. Laisse tes jambes te guider.', 
  88, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Élan dans les jambes' AND type_hd = 'generator' AND category = 'somatic'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Fusion corporelle de joie', 
  'generator', 
  'somatic', 
  'Tu ressens une joie profonde dans tout ton corps, comme si chaque cellule souriait.', 
  'Tu fais ce que tu aimes, avec les bonnes personnes, au bon moment.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "g-center"}', jsonb '{"center": "solar-plexus"}', jsonb '{"center": "heart"}'], 
  'Mon corps célèbre la vie.', 
  'Fais un câlin à quelqu''un ou à toi-même. Laisse cette joie s''imprimer dans ta mémoire corporelle.', 
  'Je suis vivante', 
  'Je suis aimée', 
  'Ta joie est physique, réelle, vibrante. C''est ton baromètre d''alignement.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Fusion corporelle de joie' AND type_hd = 'generator' AND category = 'somatic'
);

-- Manifesting Generator feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Picotement d''impatience', 
  'manifesting-generator', 
  'somatic', 
  'Tu ressens une énergie nerveuse dans les bras ou les jambes, comme si ton corps voulait déjà être ailleurs.', 
  'Ton corps a déjà fini l''expérience intérieurement, mais ton environnement ne suit pas.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}', jsonb '{"center": "throat"}'], 
  'Je peux respecter mon propre rythme sans me forcer à rester.', 
  'Bouge, saute ou fais un geste brusque puis recentre-toi. Laisse passer l''énergie.', 
  'Je bouge', 
  'Je me respecte', 
  'Ton feu va vite. Ce n''est pas une erreur, c''est ton génie.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Picotement d''impatience' AND type_hd = 'manifesting-generator' AND category = 'somatic'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Fusion incarnée éclatante', 
  'manifesting-generator', 
  'somatic', 
  'Tu ressens une présence complète, éclatante. Tu es là, dans ton axe, rayonnante et libre.', 
  'Tu vis, bouges, crées à partir d''un feu aligné, sans te restreindre.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "g-center"}', jsonb '{"center": "throat"}', jsonb '{"center": "ajna"}', jsonb '{"center": "heart"}'], 
  'Je suis puissance incarnée, fluide et brillante.', 
  'Mets la main sur ton ventre et sur ta gorge. Ancre cette verticalité rayonnante.', 
  'Je brille', 
  'Je suis', 
  'Tu es une comète d''énergie alignée. Sois fière de ta fusion.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Fusion incarnée éclatante' AND type_hd = 'manifesting-generator' AND category = 'somatic'
);

-- Manifestor feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Oppression thoracique', 
  'manifestor', 
  'somatic', 
  'Tu ressens un poids sur la poitrine, comme si une présence ou une attente t''empêchait de respirer librement.', 
  'Tu subis un contrôle extérieur ou une contrainte qui viole ton besoin d''autonomie.', 
  ARRAY[jsonb '{"center": "heart"}', jsonb '{"center": "throat"}', jsonb '{"center": "g-center"}'], 
  'Je respire dans mon autorité propre.', 
  'Éloigne-toi, symboliquement ou physiquement. Inspire profondément trois fois.', 
  'Je reprends mon souffle', 
  'Je redeviens libre', 
  'Ton souffle est sacré. Tu n''as pas à laisser d''autres le dicter.', 
  38, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Oppression thoracique' AND type_hd = 'manifestor' AND category = 'somatic'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Éclat corporel fondateur', 
  'manifestor', 
  'somatic', 
  'Tu ressens une montée verticale de puissance et de clarté. Tu es dans l''axe de ton autorité créatrice.', 
  'Tu es en train d''initier un mouvement profondément aligné avec ton essence.', 
  ARRAY[jsonb '{"center": "throat"}', jsonb '{"center": "heart"}', jsonb '{"center": "ajna"}', jsonb '{"center": "g-center"}', jsonb '{"center": "root"}'], 
  'Je suis à l''origine du mouvement juste.', 
  'Déclare à haute voix ton élan. Même à voix basse. Tu poses un acte fondateur.', 
  'Je suis source', 
  'Je crée l''espace', 
  'Tu n''es pas un rouage. Tu es la main qui lance la première impulsion. Honore-la.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Éclat corporel fondateur' AND type_hd = 'manifestor' AND category = 'somatic'
);

-- Reflector feelings
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Frisson lunaire', 
  'reflector', 
  'somatic', 
  'Tu ressens un frisson subtil, presque électrique, qui te parcourt sans raison apparente.', 
  'Tu captes un changement énergétique ou une vérité invisible dans ton environnement.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "spleen"}', jsonb '{"center": "g-center"}'], 
  'Je reflète les fréquences sans les absorber.', 
  'Ferme les yeux. Respire lentement. Demande à ton corps ce qu''il essaie de dire.', 
  'Je perçois', 
  'Je relâche', 
  'Ton corps parle la langue du subtil. Il n''invente rien. Il traduit.', 
  86, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Frisson lunaire' AND type_hd = 'reflector' AND category = 'somatic'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Fusion paisible avec le monde', 
  'reflector', 
  'somatic', 
  'Tu ressens une harmonie parfaite entre ton corps et ton environnement.', 
  'Tu es dans un lieu, un temps et une vibration parfaitement synchrones avec toi.', 
  ARRAY[jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}', jsonb '{"center": "ajna"}', jsonb '{"center": "solar-plexus"}'], 
  'Je suis une avec l''instant.', 
  'Allonge-toi au sol. Respire la beauté de l''instant à travers tous tes pores.', 
  'Je me fonds', 
  'Je suis le monde', 
  'Tu es à ta place. Ton corps te le montre par sa paix absolue.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Fusion paisible avec le monde' AND type_hd = 'reflector' AND category = 'somatic'
);

-- Generic somatic feelings (no specific HD type)
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Sensibilité tactile accrue', 
  'somatic', 
  'Je ressens une sensibilité accrue au toucher. Les textures, les contacts, les sensations sont amplifiées.', 
  'Mon système nerveux est en état d''hypervigilance ou d''ouverture sensorielle particulière.', 
  ARRAY[jsonb '{"center": "spleen"}', jsonb '{"center": "solar-plexus"}'], 
  'Ma sensibilité est une intelligence subtile.', 
  'Touche différentes textures en pleine conscience. Observe les sensations sans jugement.', 
  'Je ressens', 
  'J''accueille', 
  'Cette sensibilité accrue est une forme d''intelligence corporelle. Elle te permet de capter des informations précieuses.', 
  85, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Sensibilité tactile accrue' AND category = 'somatic'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Hypersensibilité au bruit', 
  'somatic', 
  'Les sons me paraissent plus forts, plus agressifs ou plus envahissants que d''habitude.', 
  'Mon système nerveux est surchargé ou en état de protection.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "spleen"}'], 
  'Je peux me protéger des stimulations excessives.', 
  'Trouve un endroit calme. Couvre tes oreilles avec tes mains et respire profondément pendant une minute.', 
  'Je m''isole', 
  'Je me protège', 
  'Cette sensibilité est un signal que ton système a besoin de calme. Honore ce besoin sans culpabilité.', 
  35, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Hypersensibilité au bruit' AND category = 'somatic'
);

-- Ajouter d'autres ressentis somatiques génériques
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Présence corporelle ancrée', 
  'somatic', 
  'Je me sens pleinement présent(e) dans mon corps. Chaque sensation est claire, chaque mouvement est conscient.', 
  'J''ai pris le temps de me reconnecter à mes sensations et d''habiter pleinement mon corps.', 
  ARRAY[jsonb '{"center": "root"}', jsonb '{"center": "sacral"}', jsonb '{"center": "g-center"}'], 
  'Mon corps est ma maison première.', 
  'Marche lentement en sentant chaque contact de tes pieds avec le sol. Ressens ton poids, ta présence.', 
  'J''habite', 
  'Je suis présent(e)', 
  'Cette présence corporelle est ton ancrage dans la réalité. Elle te donne accès à ta sagesse instinctive.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Présence corporelle ancrée' AND category = 'somatic'
);