/*
# Ajout de ressentis spécifiques par type HD

1. Nouvelles données
   - Ajout de la colonne type_hd à la table feelings si elle n'existe pas déjà
   - Insertion de ressentis spécifiques pour chaque type HD (Projector, Generator, Manifesting Generator, Manifestor, Reflector)
   - Chaque type HD a des ressentis positifs et négatifs adaptés à sa nature énergétique

2. Structure
   - Utilisation de la syntaxe INSERT INTO ... SELECT ... WHERE NOT EXISTS pour éviter les doublons
   - Format correct pour les tableaux jsonb avec ARRAY[jsonb '{"center": "center-name"}']
   - Tous les champs obligatoires sont remplis, y compris probable_origin
*/

-- Ajout de la colonne type_hd à la table feelings si elle n'existe pas déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'feelings' AND column_name = 'type_hd'
  ) THEN
    ALTER TABLE feelings ADD COLUMN type_hd text;
  END IF;
END $$;

-- Insertion des ressentis spécifiques par type HD
-- Projector
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Oppression dans le ventre ou le plexus', 
  'projector', 
  'general', 
  'Une boule au ventre, une sensation d''étau émotionnel, parfois une nausée discrète, une respiration courte, bloquée. Tu te sens coincée dans une émotion floue ou une impression que quelque chose ne va pas, sans pouvoir l''identifier clairement.', 
  'Tu absorbes les émotions non exprimées des autres. Le Projector, avec un centre émotionnel souvent ouvert, devient une éponge invisible. Tu ressens ce qui n''est pas à toi — sans pouvoir le trier. Cela crée une tension interne qui te coupe de ton centre vital.', 
  ARRAY[jsonb '{"center": "solar-plexus"}'], 
  'Ce n''est pas ta douleur. Ce n''est pas ton émotion. Tu as le droit de te libérer de ce qui ne t''appartient pas.', 
  'Pose une main sur ton cœur, l''autre sur ton ventre. Ferme les yeux. Dis à haute voix : "Ce que je ressens n''est pas forcément à moi."
Respire profondément dans ton ventre. Visualise une lumière dorée qui te traverse et expulse les énergies étrangères. Termine par une eau chaude ou un câlin d''auto-apaisement.', 
  'J''accueille ce qui est à moi', 
  'Je libère ce qui ne m''appartient pas', 
  '🌞 Ta sensibilité est une richesse. Quand tu te purifies, elle devient lumière pour les autres.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Oppression dans le ventre ou le plexus' AND type_hd = 'projector'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Sensation de légèreté, fluidité et présence paisible', 
  'projector', 
  'general', 
  'Tu te sens claire, posée, vivante. Ton souffle est ample, ton visage détendu, ton ventre souple, ta posture droite sans effort. Rien ne bloque, rien ne tire. Il y a une sensation intérieure de justesse : tu es là, présente, et ton corps te soutient. Tu te sens alignée sans réfléchir, comme si tout coulait avec évidence.', 
  'Tu vis selon ta nature Projector : tu as attendu l''invitation, tu as respecté ton tempo, tu n''as pas forcé. Tu as été reconnue sans avoir à te battre, tu t''es donnée du temps, du repos, de l''espace. Tu as guidé là où c''était juste, et ton aura est restée ouverte mais protégée.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "throat"}', jsonb '{"center": "g-center"}', jsonb '{"center": "heart"}', jsonb '{"center": "solar-plexus"}', jsonb '{"center": "spleen"}', jsonb '{"center": "sacral"}', jsonb '{"center": "root"}'], 
  'Tu n''as rien à faire de plus. Rien à prouver. Ton énergie est juste. Et ça se sent.', 
  '(Facultatif) Installe-toi confortablement. Ferme les yeux. Place tes mains sur ton cœur ou ton ventre. Ressens la stabilité silencieuse qui t''habite. Tu peux te balancer doucement ou respirer simplement, sans chercher à modifier quoi que ce soit. C''est déjà là.', 
  'Je suis à ma place', 
  'Et cela suffit', 
  'Tu es l''incarnation vivante de ta vérité. Tu n''as pas besoin d''attendre demain pour briller. Tu es déjà alignée. Savoure-le.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Sensation de légèreté, fluidité et présence paisible' AND type_hd = 'projector'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Lourdeur dans le bas du dos', 
  'projector', 
  'general', 
  'Une pression sourde, un tiraillement dans les lombaires, comme si ton bassin refusait d''avancer. Tu peux ressentir un blocage mécanique, de la fatigue en position debout ou une lassitude ancrée dans le corps.', 
  'Tu avances dans un rythme qui n''est pas le tien. Tu te forces à accomplir, à produire, à "finir" — sans écoute de ton énergie réelle. Le centre racine ouvert chez la Projector peut déclencher une pression d''urgence, une tentative de "faire vite" dans un monde trop rapide.', 
  ARRAY[jsonb '{"center": "root"}'], 
  'Ce n''est pas toi qui es faible, c''est le monde autour qui va trop vite. Tu as le droit de choisir ton propre tempo.', 
  'Assieds-toi sur une chaise ou un coussin ferme. Pose les deux pieds au sol. Sens le poids de ton bassin, sans jugement. Puis répète : "Je ne suis pas pressée. J''avance à mon rythme." Étire doucement ton bas du dos vers l''arrière, puis relâche.', 
  'Je ralentis', 
  'Je m''aligne', 
  '🌱 Ton tempo est sacré. C''est dans la lenteur que naît ta vraie puissance.', 
  45, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Lourdeur dans le bas du dos' AND type_hd = 'projector'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Tête lourde ou surmenée', 
  'projector', 
  'general', 
  'Une pression dans le crâne, comme une cascade de pensées qui ne s''arrête jamais. Tu ressens une forme de fatigue mentale, des tensions dans les tempes, parfois même des vertiges discrets ou un brouillard cognitif.', 
  'Tu essaies de tout comprendre, tout anticiper, tout résoudre — souvent pour les autres. Le mental cherche à capter la bonne direction, à structurer, à analyser, alors que ta sagesse n''est pas là. Tu es sortie de ton autorité intérieure.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}'], 
  'Tu n''as pas à porter toutes ces questions. C''est normal d''avoir besoin de silence. Tu peux poser ton mental.', 
  'Ferme les yeux. Pose délicatement les mains sur tes tempes. Respire. Imagine que tes pensées se dissolvent dans un nuage violet au-dessus de ta tête. Reste 3 minutes ainsi. Puis note 3 pensées que tu es prête à laisser partir aujourd''hui.', 
  'Je relâche', 
  'Je fais confiance', 
  '☁️ Ta sagesse n''a pas besoin de se prouver. Elle s''exprime mieux dans le calme.', 
  25, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Tête lourde ou surmenée' AND type_hd = 'projector'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Sensation de fluidité et de légèreté', 
  'projector', 
  'general', 
  'Tu te sens souple, détendue, comme si l''énergie circulait librement. Tu n''as pas besoin de réfléchir, tu ressens que tu es à ta place, sans tension. Ton souffle est ample. Ton regard est doux. Tu existes, simplement.', 
  'Tu as respecté ton tempo. Tu as dit non quand c''était non. Tu n''as pas forcé. Et surtout, tu as été reconnue pour ta valeur subtile, dans un cadre qui t''a invitée à rayonner.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "throat"}', jsonb '{"center": "g-center"}', jsonb '{"center": "heart"}', jsonb '{"center": "solar-plexus"}', jsonb '{"center": "spleen"}', jsonb '{"center": "sacral"}', jsonb '{"center": "root"}'], 
  'Tu es exactement là où tu dois être. Ton corps te le confirme.', 
  'Aucun nécessaire. Mais si tu veux ancrer l''instant : danse. Marche. Savoure. Tu peux aussi fermer les yeux et dire merci.', 
  'Je suis', 
  'Et cela suffit', 
  '🌟 Tu es un guide quand tu es bien. Et aujourd''hui, tu es bien. Honore-le.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Sensation de fluidité et de légèreté' AND type_hd = 'projector'
);

-- Generator
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Pression ou tension mentale constante', 
  'generator', 
  'general', 
  'Une sensation de pression dans le crâne, comme une obligation de réfléchir ou de planifier. Tu te sens accaparée par des pensées répétitives ou des obligations mentales que tu n''as pas choisies.', 
  'Tu as dit oui par automatisme. Tu es engagée dans des projets qui n''éclairent pas ton sacral. Ton esprit compense une non-réponse viscérale. Tu fonctionnes en "mode mental" au lieu de "mode vivant".', 
  ARRAY[jsonb '{"center": "ajna"}'], 
  'Tu n''as pas besoin de tout porter avec ta tête. Ton énergie vit quand tu réponds, pas quand tu devines.', 
  'Ferme les yeux. Respire jusqu''au bas du ventre. Demande-toi : "Qu''est-ce qui me répond vraiment aujourd''hui ?" Note sans réfléchir. Puis délaisse une tâche mentale qui ne t''a jamais dit "oui".', 
  'Je respire', 
  'Je réponds', 
  '🧡 Ton feu sacral sait. Laisse-le redevenir maître à bord.', 
  35, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Pression ou tension mentale constante' AND type_hd = 'generator'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Vitalité fluide et vibration intérieure', 
  'generator', 
  'general', 
  'Tu te sens pleine d''élan, même dans le silence. Ton corps bouge avec plaisir, ton énergie pulse doucement. Tu n''as rien à forcer, tu réponds à la vie sans t''épuiser. Tu es pleine de toi, en paix.', 
  'Tu suis ton sacral. Tu dis non avec fermeté. Tu engages ton énergie là où ton corps dit oui. Et tu la retires sans culpabilité.', 
  ARRAY[jsonb '{"center": "sacral"}'], 
  'Tu es exactement dans ton feu. Et ça se voit.', 
  'Rien. Tu es dans le mouvement juste. Si tu veux l''ancrer : danse ou fais quelque chose de simple que tu aimes.', 
  'Je vis', 
  'Je vibre', 
  '🔥 Ton énergie est un cadeau quand elle est respectée. Merci d''avoir honoré ton oui.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Vitalité fluide et vibration intérieure' AND type_hd = 'generator'
);

-- Manifesting Generator
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Tête encombrée ou précipitée', 
  'manifesting-generator', 
  'general', 
  'Une tension nerveuse dans le crâne, des pensées qui se bousculent, comme un flux ininterrompu. Tu passes d''une idée à l''autre sans pouvoir ralentir. Sensation de pression intérieure ou d''impatience mentale.', 
  'Tu es montée trop vite dans une dynamique sans avoir écouté ton sacral. Tu veux aller plus vite que ton alignement réel. La tête essaie de gérer ce que le corps n''a pas encore tranché.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}'], 
  'Tu n''as pas à aller plus vite que ta clarté. Tu peux te poser, sans perdre ton feu.', 
  'Tu as écouté ton sacral, répondu à la vie avec sincérité. Tu ne t''es pas justifiée. Tu as su arrêter ce qui ne vibrait plus. Tu es dans ta force — pas dans l''urgence, pas dans l''imitation.', 
  'Je me pose', 
  'Je choisis', 
  '🌀 La vitesse sacrée commence par l''écoute intérieure.', 
  38, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Tête encombrée ou précipitée' AND type_hd = 'manifesting-generator'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Énergie fluide, vitalité incarnée, joie d''agir', 
  'manifesting-generator', 
  'general', 
  'Tu sens ton corps vivant, vibrant, engagé dans l''instant. Tu n''es ni dans le rush, ni dans la paresse. Tu ressens que tu es là où tu devais être. Tu agis avec plaisir, tu t''arrêtes quand c''est bon. Tu es en conversation joyeuse avec la vie.', 
  'Tu as suivi ton énergie naturelle, sans te forcer ni te retenir. Tu as honoré ton rythme unique et ta capacité à passer rapidement d''une chose à l''autre.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "throat"}', jsonb '{"center": "g-center"}'], 
  'Tu es exactement là où ta joie te porte. Et c''est juste.', 
  '(Facultatif) Fais ce que tu aimes là, tout de suite. Danse, cuisine, crée, marche, ris. Tu n''as rien à "optimiser". C''est vivant.', 
  'Je suis en joie', 
  'Je suis en feu', 
  '🔥 Tu es la vie en mouvement quand tu t''honores avec simplicité.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Énergie fluide, vitalité incarnée, joie d''agir' AND type_hd = 'manifesting-generator'
);

-- Manifestor
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Pression cérébrale ou besoin d''évasion', 
  'manifestor', 
  'general', 
  'Une sensation de pression intense dans le crâne, comme si le mental était pris au piège. Pensées obsédantes, incapacité à s''arrêter, envie de tout fuir, couper, claquer une porte mentale.', 
  'Tu n''as pas honoré ton besoin de solitude ou de silence mental. Tu es restée trop longtemps dans un environnement où on attendait que tu répondes. Ton esprit a été forcé à interagir.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}'], 
  'Tu n''as pas à expliquer ton silence. Tu as le droit de penser librement.', 
  'Ferme les yeux. Coupe toute stimulation. Répète : "Je n''ai rien à prouver." Respire. Marche seule si tu le peux. Retire-toi quelques instants.', 
  'Je coupe', 
  'Je me retrouve', 
  '🌫 Ta paix mentale est sacrée. Reviens-y sans permission.', 
  39, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Pression cérébrale ou besoin d''évasion' AND type_hd = 'manifestor'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Présence souveraine, puissance tranquille', 
  'manifestor', 
  'general', 
  'Tu te sens entière, droite, présente et libre. Ton énergie rayonne doucement, sans effort. Tu n''attends personne, mais tu ne repousses rien. Tu sens que tu peux initier sans justification, que ton mouvement intérieur est propre et sacré.', 
  'Tu as respecté ton besoin d''espace, de solitude, de direction propre. Tu as informé, posé ton cadre, agi à partir de ton feu. Tu as écouté ton autorité. Tu as choisi ta voie avec souveraineté.', 
  ARRAY[jsonb '{"center": "throat"}', jsonb '{"center": "g-center"}', jsonb '{"center": "heart"}', jsonb '{"center": "root"}'], 
  'Tu es la source. Tu n''as rien à forcer, tout à révéler.', 
  '(Facultatif) Marche seule, même 5 minutes. Sens ta colonne, ta marche, ton rythme. Dis : "Je trace ma voie." Respire. Et ressens l''impact de ta simple présence.', 
  'Je décide', 
  'J''incarne', 
  '👑 Ton feu est noble. Ton calme est puissance. Merci d''être là.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Présence souveraine, puissance tranquille' AND type_hd = 'manifestor'
);

-- Reflector
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Tête brumeuse ou absorbée', 
  'reflector', 
  'general', 
  'Tu ressens une lourdeur nuageuse dans la tête, comme si tes pensées n''étaient pas les tiennes. Une difficulté à faire le tri entre ce que tu sens vraiment et ce que tu as capté d''autrui.', 
  'Tu es restée trop longtemps dans une ambiance mentale bruyante ou rapide. Tu as absorbé les pensées, jugements ou confusions des autres sans en avoir conscience.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}'], 
  'Tout ce que tu ressens ne t''appartient pas. Tu peux faire le tri, doucement.', 
  'Allonge-toi ou isole-toi. Respire profondément. Imagine que tu balayes ta tête avec une plume douce. Dis : "Je relâche ce qui n''est pas moi."', 
  'Je reviens à moi', 
  'Je laisse partir le reste', 
  '🌫 Tu es traversée, pas définie. C''est ta force.', 
  37, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Tête brumeuse ou absorbée' AND type_hd = 'reflector'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Clarté paisible et rayonnement lunaire', 
  'reflector', 
  'general', 
  'Tu te sens calme, disponible, vivante. Tu es traversée par le monde, mais sans être déstabilisée. Tu sais qui tu es dans l''instant, sans besoin de te définir. Tu es centrée dans ton miroir, à l''écoute, stable, lumineuse.', 
  'Tu t''es ancrée dans ton rythme naturel. Tu as pris le temps. Tu as été dans les bons lieux, avec les bonnes personnes. Tu as filtré l''extérieur avec amour, et tu te sens claire, fluide, joyeusement réceptive.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "throat"}', jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}', jsonb '{"center": "solar-plexus"}', jsonb '{"center": "root"}'], 
  'Je suis la clarté en mouvement. Je reflète ce qui est beau, vrai, vivant.', 
  '(facultatif) Expose-toi à la Lune, au calme, ou assieds-toi dans un lieu paisible. Respire. Laisse-toi traverser. Puis souris. Tu es bien là.', 
  'Je reflète', 
  'Je rayonne', 
  '🌝 Ton être est un guide doux. Ta présence est médecine.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Clarté paisible et rayonnement lunaire' AND type_hd = 'reflector'
);