/*
  # Add physical feelings for each HD type

  1. New Data
    - Adds physical feelings for each Human Design type
    - Includes both positive and negative feelings
    - Each feeling has detailed descriptions, exercises, and mantras
  
  2. Structure
    - Adds data to the existing feelings table
    - Uses conditional insertion to avoid duplicates
    - Preserves affected centers as JSON arrays
*/

-- Insert physical feelings for each HD type
-- Manifesting Generator
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Corps impatient', 
  'manifesting-generator', 
  'physical', 
  'Tu ressens une tension vive dans tout ton corps. Tu veux que ça aille plus vite, tu as l''impression que tout te freine.', 
  'Ton feu intérieur est prêt mais ton environnement ou ton mental freine le passage à l''action.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}', jsonb '{"center": "throat"}'], 
  'Mon énergie mérite un passage fluide, pas une précipitation.', 
  'Fais 10 sauts légers sur place, puis respire profondément et dis-toi : ''Je choisis la vitesse juste.''', 
  'Je m''élance', 
  'Avec sagesse', 
  'Ton feu est sacré. Ne le brûle pas en vitesse aveugle. Dirige-le avec conscience.', 
  43, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Corps impatient' AND type_hd = 'manifesting-generator' AND category = 'physical'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Montée d''adrénaline', 
  'manifesting-generator', 
  'physical', 
  'Tu sens une poussée électrique dans ton corps, un élan intense, presque irrépressible. Tu veux agir maintenant.', 
  'Un stimulus extérieur ou intérieur t''a activée, sans te laisser le temps de vérifier ton alignement sacral.', 
  ARRAY[jsonb '{"center": "root"}', jsonb '{"center": "sacral"}', jsonb '{"center": "throat"}'], 
  'Je peux respirer avant de réagir.', 
  'Inspire sur 4 temps, retiens 4 temps, expire sur 6 temps. Refais ce cycle 4 fois.', 
  'Je choisis', 
  'Je canalise', 
  'Ton impulsion est un don. Mais le bon moment, c''est celui que ton sacral confirme.', 
  46, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Montée d''adrénaline' AND type_hd = 'manifesting-generator' AND category = 'physical'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Vitalité bondissante', 
  'manifesting-generator', 
  'physical', 
  'Tu sens une énergie vive, joyeuse, dynamique dans tout ton corps. Tu as envie de bouger, de rire, de faire mille choses à la fois.', 
  'Tu as répondu à un élan juste, et tu es portée par la joie du mouvement aligné.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "g-center"}', jsonb '{"center": "heart"}'], 
  'Quand je réponds à mon feu, je deviens inarrêtable.', 
  'Lance une playlist qui te fait vibrer et laisse ton corps bouger sans réfléchir.', 
  'Je bondis', 
  'Je rayonne', 
  'Tu es faite pour suivre ton feu. Il t''ouvre des chemins inédits.', 
  90, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Vitalité bondissante' AND type_hd = 'manifesting-generator' AND category = 'physical'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Explosion alignée', 
  'manifesting-generator', 
  'physical', 
  'Chaque cellule est en feu, mais dans l''axe. Tu avances à grande vitesse, avec joie, précision et puissance.', 
  'Tu as suivi un oui sacral puissant, sans interruption, dans un environnement stimulant.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}', jsonb '{"center": "throat"}', jsonb '{"center": "g-center"}', jsonb '{"center": "heart"}'], 
  'Quand je suis alignée, je deviens une tornade de création sacrée.', 
  'Choisis une action inspirée et lance-toi sans détour. Laisse l''élan te porter, sans frein ni doute.', 
  'Je suis feu', 
  'Je suis direction', 
  'Tu es une source. Quand tu es dans ton axe, tu propulses le monde.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Explosion alignée' AND type_hd = 'manifesting-generator' AND category = 'physical'
);

-- Manifestor
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Pression dans la cage thoracique', 
  'manifestor', 
  'physical', 
  'Tu ressens une oppression dans la poitrine, comme un poids qui t''empêche d''initier ou de t''exprimer librement.', 
  'Tu n''as pas informé ou exprimé un besoin d''action. Tu te contiens pour éviter les réactions extérieures.', 
  ARRAY[jsonb '{"center": "throat"}', jsonb '{"center": "heart"}', jsonb '{"center": "solar-plexus"}'], 
  'Ma parole mérite d''ouvrir la voie.', 
  'Inspire en levant les bras au ciel, expire en les ramenant doucement sur le cœur. Répète ce cycle 7 fois.', 
  'J''initie', 
  'Je respire', 
  'Tu n''as pas besoin d''attendre la permission. Ton énergie est là pour ouvrir des chemins.', 
  44, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Pression dans la cage thoracique' AND type_hd = 'manifestor' AND category = 'physical'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Chaleur au creux du dos', 
  'manifestor', 
  'physical', 
  'Tu ressens une chaleur dense dans le bas du dos, signe d''une énergie prête à initier un mouvement profond.', 
  'Tu es sur le point d''initier quelque chose qui t''appartient. Ton énergie se concentre pour l''impulsion.', 
  ARRAY[jsonb '{"center": "root"}', jsonb '{"center": "spleen"}', jsonb '{"center": "g-center"}'], 
  'Mon feu intérieur prépare le saut.', 
  'Visualise une flamme à la base de ta colonne. Respire en profondeur, sans chercher à contrôler.', 
  'Je prépare', 
  'Mon élan', 
  'Quand la chaleur monte, c''est que le signal approche. Fais confiance à cette montée intérieure.', 
  89, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Chaleur au creux du dos' AND type_hd = 'manifestor' AND category = 'physical'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Présence magnétique', 
  'manifestor', 
  'physical', 
  'Ton corps entier semble dégager une force tranquille. Tu n''as rien à prouver, et pourtant tu imposes naturellement.', 
  'Tu es alignée avec ton rythme et ton autorité. Tu as initié quelque chose avec clarté.', 
  ARRAY[jsonb '{"center": "heart"}', jsonb '{"center": "g-center"}', jsonb '{"center": "throat"}', jsonb '{"center": "root"}'], 
  'Quand je suis centrée, je rayonne sans bruit.', 
  'Tiens-toi debout, pieds bien à plat. Sens ton axe. Visualise un cercle énergétique autour de toi.', 
  'Je suis force', 
  'Je suis paix', 
  'Ton aura fait le travail. Reste centrée. Tu n''as rien à forcer.', 
  92, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Présence magnétique' AND type_hd = 'manifestor' AND category = 'physical'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Impulsion divine', 
  'manifestor', 
  'physical', 
  'Tu ressens un éclair de puissance traverser ton corps. Tout devient clair, simple, inarrêtable. Tu es un canal d''initiation pure.', 
  'Tu as écouté ton autorité intérieure. Tu es prête à initier depuis un espace sacré et centré.', 
  ARRAY[jsonb '{"center": "root"}', jsonb '{"center": "throat"}', jsonb '{"center": "g-center"}', jsonb '{"center": "heart"}'], 
  'Mon élan est une prière en mouvement.', 
  'Laisse ton corps bouger comme il le souhaite, sans résistance. Honore ce feu sacré.', 
  'Je reçois', 
  'Je lance', 
  'Tu es là pour ouvrir. Quand tu agis depuis cet endroit, l''univers se réaligne autour de toi.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Impulsion divine' AND type_hd = 'manifestor' AND category = 'physical'
);

-- Reflector
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Corps saturé', 
  'reflector', 
  'physical', 
  'Tu ressens une lourdeur diffuse, comme si ton corps avait absorbé les charges émotionnelles ou mentales d''autrui. Tu es fatiguée sans cause apparente.', 
  'Tu as été trop exposée aux autres ou à des environnements chargés. Ton aura a capté des fréquences qui ne t''appartiennent pas.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "solar-plexus"}', jsonb '{"center": "spleen"}'], 
  'Je suis une lune, pas une éponge.', 
  'Prends une douche ou un bain en conscience. Visualise que tu libères chaque influence absorbée.', 
  'Je nettoie', 
  'Je redeviens moi', 
  'Tu n''es pas ce que tu ressens. Ce sont parfois les reflets du monde. Honore ton besoin de purification.', 
  41, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Corps saturé' AND type_hd = 'reflector' AND category = 'physical'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Légèreté subtile', 
  'reflector', 
  'physical', 
  'Ton corps semble aérien, comme s''il flottait. Tu es bien, douce, presque translucide. Une sensation de paix physique rare.', 
  'Tu es en harmonie avec ton cycle lunaire et ton environnement. Ton aura reflète une grande clarté.', 
  ARRAY[jsonb '{"center": "g-center"}', jsonb '{"center": "head"}', jsonb '{"center": "spleen"}'], 
  'Quand je suis claire, mon corps devient nuage.', 
  'Allonge-toi et imagine ton corps comme une vapeur lumineuse, entourée d''un halo apaisant.', 
  'Je flotte', 
  'Je suis légère', 
  'Cette sensation est ton état naturel lorsque tu es respectée dans ton rythme et ton espace.', 
  91, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Légèreté subtile' AND type_hd = 'reflector' AND category = 'physical'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Transparence absolue', 
  'reflector', 
  'physical', 
  'Ton corps ne fait plus barrière. Tu es comme un cristal traversé par la lumière, sans résistance, sans poids, sans crainte.', 
  'Tu es dans un pic d''alignement lunaire. Ton environnement te soutient totalement, tu es pleinement toi.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}', jsonb '{"center": "solar-plexus"}'], 
  'Quand je suis limpide, je deviens source.', 
  'Assieds-toi en nature, sans rien faire. Laisse l''air, la lumière et le silence te traverser.', 
  'Je suis claire', 
  'Je suis divine', 
  'Ta transparence n''est pas un vide. C''est une sagesse incarnée. Tu es le miroir du monde.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Transparence absolue' AND type_hd = 'reflector' AND category = 'physical'
);

-- Generic physical feelings (no specific HD type)
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens énergique et vitale', 
  'physical', 
  'Mon corps est léger et plein de vitalité. Je me sens capable de tout accomplir. L''énergie circule librement.', 
  'J''ai respecté mes cycles de repos et d''activité. Mon corps est bien nourri et hydraté.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}'], 
  'Mon corps est une source d''énergie quand je l''honore.', 
  'Fais une activité physique qui te fait plaisir pendant 10-15 minutes. Ressens la vitalité qui circule.', 
  'Je suis énergie', 
  'Je suis vie', 
  'Cette vitalité est ton état naturel quand tu prends soin de ton temple corporel.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens énergique et vitale' AND category = 'physical'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je ressens de la fatigue', 
  'physical', 
  'Mon corps est lourd et demande du repos. Mes mouvements sont ralentis. L''énergie est basse.', 
  'Possible manque de sommeil, phase du cycle menstruel, ou besoin de récupération.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}'], 
  'Ma fatigue est un message, pas une faiblesse.', 
  'Allonge-toi 15 minutes. Pose les mains sur le ventre. Respire profondément et dis : "Je m''accorde le repos dont j''ai besoin."', 
  'J''honore ma fatigue', 
  'Je me régénère', 
  'Ta fatigue est une invitation à ralentir. Ton corps te parle avec sagesse.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je ressens de la fatigue' AND category = 'physical'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens ancrée et stable', 
  'physical', 
  'Je ressens une connexion forte avec mon corps. Mes mouvements sont fluides et assurés. Je me sens stable.', 
  'J''ai pris soin de mon ancrage. J''ai écouté les besoins de mon corps.', 
  ARRAY[jsonb '{"center": "root"}', jsonb '{"center": "sacral"}'], 
  'Je suis solidement ancrée dans mon corps et dans la terre.', 
  'Marche pieds nus si possible. Sens chaque pas. Visualise des racines qui partent de tes pieds et s''enfoncent dans la terre.', 
  'Je m''enracine', 
  'Je suis stable', 
  'Cet ancrage est ta force. Il te permet de rester stable même quand tout bouge autour de toi.', 
  90, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens ancrée et stable' AND category = 'physical'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'J''ai des tensions musculaires', 
  'physical', 
  'Je ressens des nœuds et des raideurs. Certaines zones de mon corps sont douloureuses au toucher.', 
  'Accumulation de stress physique, posture inadaptée, ou émotions stockées.', 
  ARRAY[jsonb '{"center": "root"}', jsonb '{"center": "sacral"}'], 
  'Mes tensions me montrent où j''ai besoin d''attention et de douceur.', 
  'Masse doucement la zone tendue. Respire profondément en imaginant que ton souffle atteint cette zone. Visualise la tension qui se dissout.', 
  'Je relâche', 
  'Je m''adoucis', 
  'Ton corps stocke ce que ton esprit ne peut pas traiter. Sois douce avec ces messages corporels.', 
  45, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'J''ai des tensions musculaires' AND category = 'physical'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens souple et détendue', 
  'physical', 
  'Mes muscles sont détendus. Je respire profondément et librement. Mon corps est dénoué.', 
  'J''ai accordé du temps au mouvement doux. J''ai libéré les tensions accumulées.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}'], 
  'Mon corps est fait pour être fluide et détendu.', 
  'Fais quelques étirements doux, en respirant profondément. Sens chaque muscle qui s''allonge et se détend.', 
  'Je m''étire', 
  'Je me libère', 
  'Cette souplesse est ton état naturel. Ton corps est fait pour bouger avec aisance et fluidité.', 
  85, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens souple et détendue' AND category = 'physical'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens faible', 
  'physical', 
  'Mon énergie est au plus bas. Les gestes simples demandent un effort. Je me sens vulnérable.', 
  'Possible déséquilibre nutritionnel, phase de repos nécessaire, ou besoin de recharge.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}'], 
  'Ma faiblesse temporaire me rappelle de prendre soin de mes besoins fondamentaux.', 
  'Assieds-toi confortablement. Pose les mains sur tes cuisses. Respire profondément et visualise une lumière dorée qui remplit ton corps d''énergie.', 
  'Je me nourris', 
  'Je me renforce', 
  'Cette faiblesse est temporaire. Ton corps te demande simplement ce dont il a besoin pour se régénérer.', 
  35, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens faible' AND category = 'physical'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens pleine de force', 
  'physical', 
  'Je ressens ma puissance physique. Mon corps est tonique et réactif. Je me sens capable et confiante.', 
  'J''ai honoré mon besoin de mouvement. J''ai nourri ma force naturelle.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}', jsonb '{"center": "heart"}'], 
  'Ma force physique est le reflet de ma force intérieure.', 
  'Tiens-toi debout, pieds écartés à la largeur des hanches. Sens ta puissance dans tes jambes, ton bassin, ton dos. Respire profondément.', 
  'Je suis forte', 
  'Je suis puissante', 
  'Cette force que tu ressens est ton héritage naturel. Ton corps est fait pour être puissant et capable.', 
  90, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens pleine de force' AND category = 'physical'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'J''ai des maux de tête', 
  'physical', 
  'Une douleur pulsatile ou sourde dans la tête. La lumière et le bruit peuvent être dérangeants.', 
  'Tension nerveuse, déshydratation, ou besoin de pause mentale.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}'], 
  'Mon mal de tête me rappelle de ralentir et de prendre soin de mon esprit.', 
  'Ferme les yeux dans un endroit calme. Masse doucement tes tempes en faisant des cercles. Bois un grand verre d''eau.', 
  'Je ralentis', 
  'Je m''apaise', 
  'Ton mal de tête est un signal d''alarme bienveillant. Écoute ce qu''il essaie de te dire.', 
  30, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'J''ai des maux de tête' AND category = 'physical'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens parfaitement reposée', 
  'physical', 
  'Mon sommeil a été réparateur. Mon corps est rechargé. Je me sens fraîche et disponible.', 
  'J''ai respecté mes cycles de sommeil. J''ai créé les conditions pour un repos profond.', 
  ARRAY[jsonb '{"center": "root"}', jsonb '{"center": "spleen"}'], 
  'Le repos est un acte sacré que je m''offre avec amour.', 
  'Prends un moment pour remercier ton corps pour ce repos. Étire-toi doucement et souris.', 
  'Je suis reposée', 
  'Je suis renouvelée', 
  'Ce repos profond est la fondation de ta vitalité. Honore ce sentiment comme un trésor précieux.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens parfaitement reposée' AND category = 'physical'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je ressens des douleurs articulaires', 
  'physical', 
  'Mes articulations sont raides ou douloureuses. Les mouvements sont limités ou inconfortables.', 
  'Changement de temps, besoin de mouvement doux, ou inflammation à observer.', 
  ARRAY[jsonb '{"center": "root"}', jsonb '{"center": "sacral"}'], 
  'Mes articulations me demandent douceur et mouvement adapté.', 
  'Fais des mouvements circulaires très doux avec les articulations douloureuses. Imagine de l''huile qui les lubrifie. Respire profondément.', 
  'J''assouplis', 
  'Je fluidifie', 
  'Ces douleurs sont des messages. Ton corps te demande une attention particulière, pas un jugement.', 
  35, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je ressens des douleurs articulaires' AND category = 'physical'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens légère et fluide', 
  'physical', 
  'Mon corps se déplace sans effort. Chaque mouvement est gracieux et naturel. Je me sens en harmonie avec la gravité.', 
  'J''ai trouvé mon rythme naturel. J''ai libéré les tensions accumulées. Je suis alignée avec mon corps.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "g-center"}'], 
  'Mon corps est fait pour être léger et fluide.', 
  'Danse librement pendant quelques minutes, en te concentrant sur la sensation de légèreté et de fluidité dans tes mouvements.', 
  'Je flotte', 
  'Je danse', 
  'Cette légèreté est ton état naturel quand tu es alignée avec ton corps et ton énergie.', 
  90, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens légère et fluide' AND category = 'physical'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je ressens une lourdeur générale', 
  'physical', 
  'Mon corps semble peser plus que d''habitude. Mes mouvements sont lents et demandent plus d''effort.', 
  'Rétention d''eau, fatigue accumulée, ou besoin de détoxification.', 
  ARRAY[jsonb '{"center": "root"}', jsonb '{"center": "sacral"}'], 
  'Ma lourdeur est temporaire. Mon corps est en train de se réguler.', 
  'Bois un grand verre d''eau. Fais 5 minutes de mouvements doux qui activent la circulation. Respire profondément.', 
  'Je m''allège', 
  'Je me libère', 
  'Cette lourdeur est un passage. Ton corps est intelligent et sait comment retrouver son équilibre.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je ressens une lourdeur générale' AND category = 'physical'
);