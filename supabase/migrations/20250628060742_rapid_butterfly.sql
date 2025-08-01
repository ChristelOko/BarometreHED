/*
  # Add emotional feelings by HD type

  1. New Data
    - Add emotional feelings for each HD type (Projector, Generator, Manifesting Generator, Manifestor, Reflector)
    - Each feeling includes detailed descriptions, mirror phrases, exercises, and mantras
  
  2. Structure
    - Uses the existing feelings table
    - Ensures proper JSON format for affected_centers
    - Adds type_hd field to filter feelings by Human Design type
*/

-- Insert emotional feelings for each HD type
-- Projector
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Sérénité tranquille', 
  'projector', 
  'emotional', 
  'Un sentiment doux et stable, comme si tout était à sa place. Tu ressens une paix intérieure qui ne dépend de rien à l''extérieur. Tu observes le monde sans te laisser happer, et tu es pleinement présente à toi-même.', 
  'Tu es dans un environnement reconnaissant, tu respectes ton rythme, et tu as écouté les bonnes invitations. Ton intuition est claire. Ton énergie circule sans dispersion.', 
  ARRAY[jsonb '{"center": "spleen"}', jsonb '{"center": "ajna"}', jsonb '{"center": "g-center"}'], 
  'J''ai le droit de m''ancrer dans ma propre paix, sans justification.', 
  'Trouve un endroit silencieux. Ferme les yeux. Pose les deux mains sur ton ventre. Ressens la stabilité de ton souffle. Puis répète doucement ta propre phrase miroir à haute voix.', 
  'Je suis paisible', 
  'Je suis entière', 
  'Continue à nourrir ce calme intérieur. Il est ton socle, ton point d''équilibre, ton plus grand guide.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Sérénité tranquille' AND type_hd = 'projector' AND category = 'emotional'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Hypersensibilité émotionnelle', 
  'projector', 
  'emotional', 
  'Tu te sens bouleversée sans raison précise. Tu absorbes les émotions des autres comme une éponge. Un mot, un regard, une énergie extérieure suffit à te faire basculer. Tu n''arrives plus à distinguer ce qui est à toi.', 
  'Centre émotionnel non défini, ambiance familiale ou sociale chargée, manque d''espace personnel, surexposition aux autres.', 
  ARRAY[jsonb '{"center": "solar-plexus"}'], 
  'Ce que je ressens ne m''appartient pas toujours.', 
  'Allonge-toi ou isole-toi. Pose tes mains sur ta poitrine. Respire profondément. Imagine que tu rends à la Terre tout ce qui ne t''appartient pas. Visualise une lumière bleue qui t''enveloppe.', 
  'Je relâche', 
  'Ce qui ne m''appartient pas', 
  'Tu n''es pas trop sensible. Tu es simplement très perméable. Et cette porosité peut devenir un don… quand elle est protégée.', 
  58, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Hypersensibilité émotionnelle' AND type_hd = 'projector' AND category = 'emotional'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Présence émotionnelle pure', 
  'projector', 
  'emotional', 
  'Tu ressens tes émotions sans filtre, sans débordement, sans peur. Tu sais ce qui t''anime, tu accueilles ce qui te traverse sans t''y accrocher. Ta sensibilité est éclatante, mais ancrée.', 
  'Tu as honoré ton rythme intérieur. Tu es dans un environnement qui te reconnaît. Tu as laissé l''émotion passer à travers toi sans y résister.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}'], 
  'Je suis capable de tout ressentir, et de rester libre.', 
  'Mains sur le cœur, ferme les yeux. Nomme à voix haute ce que tu ressens. Puis dis : ''Je suis en paix avec cette émotion.'' Respire profondément trois fois.', 
  'Je ressens pleinement', 
  'Je suis souveraine', 
  'C''est dans la clarté de tes ressentis que tu retrouves ta puissance. Ton cœur est un guide sacré — et aujourd''hui, il est parfaitement ouvert.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Présence émotionnelle pure' AND type_hd = 'projector' AND category = 'emotional'
);

-- Generator
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Engouement vibrant', 
  'generator', 
  'emotional', 
  'Tu ressens une excitation profonde, stable, presque animale. Ton corps est d''accord. Tu es dans une action qui te nourrit, et ça pétille à l''intérieur.', 
  'Tu réponds à un stimulus clair venu de l''extérieur, en accord avec ton autorité. Ton énergie s''auto-alimente.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "g-center"}'], 
  'Ce qui me nourrit m''appelle.', 
  'Ferme les yeux et ressens ton bas-ventre. Laisse monter le ''mmh'' ou ''yes'' intérieur. Puis ancre-le dans un mouvement du corps.', 
  'Je réponds', 
  'Depuis mes tripes', 
  'Ce feu doux qui pétille en toi est ton vrai moteur. Nourris-le avec discernement.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Engouement vibrant' AND type_hd = 'generator' AND category = 'emotional'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Frustration rampante', 
  'generator', 
  'emotional', 
  'Tu ressens un agacement constant, comme une tension qui monte sans issue. Tu fais, mais rien ne semble juste ou satisfaisant.', 
  'Tu t''es engagée dans une action sans réponse sacrale claire. Tu suis un ''il faut'' au lieu d''un ''j''ai envie''.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "ajna"}'], 
  'Je mérite de me réajuster sans me juger.', 
  'Arrête-toi. Pose-toi une seule question : Est-ce que j''ai dit oui à ça ? Si ce n''est pas un vrai oui, libère-toi de cette action.', 
  'Je lâche', 
  'Ce qui ne m''appartient pas', 
  'Ta frustration est un GPS. Elle ne dit pas que tu es mauvaise — elle dit que tu n''es pas là où tu vibres.', 
  52, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Frustration rampante' AND type_hd = 'generator' AND category = 'emotional'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Chaleur intérieure rayonnante', 
  'generator', 
  'emotional', 
  'Tu ressens une chaleur douce et stable dans tout ton corps. Tu es à ta place, tu fais ce que tu aimes, sans effort, sans lutte. C''est fluide, aligné, évident.', 
  'Tu as écouté ton sacral. Tu es dans une activité juste, au bon moment, dans le bon contexte. Tu es en syntonie avec toi-même.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}'], 
  'Je suis faite pour vivre dans le plaisir d''être utile.', 
  'Remercie-toi. Ferme les yeux. Ressens cette chaleur dans ton corps et dis merci à ta vie d''aujourd''hui.', 
  'Je savoure', 
  'Je rayonne', 
  'C''est quand tu es bien que tu donnes le meilleur. Tu mérites cette paix active.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Chaleur intérieure rayonnante' AND type_hd = 'generator' AND category = 'emotional'
);

-- Manifesting Generator
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Élan fulgurant', 
  'manifesting-generator', 
  'emotional', 
  'Un enthousiasme puissant te traverse. Tu sens que c''est le moment d''agir. Tu n''as pas besoin de réfléchir : ton corps est déjà en train de répondre.', 
  'Tu as capté une opportunité juste pour toi. Ton sacral et ton capacité de manifestation sont alignés.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "throat"}', jsonb '{"center": "g-center"}'], 
  'Je suis née pour initier avec réponse.', 
  'Laisse ton corps bouger comme il veut. Même 2 minutes. Danse l''élan. Ancre l''envie.', 
  'Je m''autorise', 
  'À foncer', 
  'Ce n''est pas trop. C''est toi, entière, vivante, vibrante. Ne retiens pas ta lumière.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Élan fulgurant' AND type_hd = 'manifesting-generator' AND category = 'emotional'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Frustration explosive', 
  'manifesting-generator', 
  'emotional', 
  'Tu te sens contenue, empêchée, ralentie. Tu bouillonnes intérieurement. Rien ne va assez vite, assez loin. Et tu perds patience.', 
  'Tu t''es embarquée dans quelque chose qui n''a pas été validé par ton sacral. Ou tu as sauté des étapes pour aller plus vite.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "ajna"}', jsonb '{"center": "throat"}'], 
  'Mon énergie mérite un chemin fluide, pas un couloir étroit.', 
  'Crée un espace d''expression physique : sauts, cris, écriture instinctive. Laisse sortir la surcharge.', 
  'Je relâche', 
  'La pression', 
  'Ta frustration est une boussole. Elle te montre ce qui n''est plus ton chemin.', 
  50, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Frustration explosive' AND type_hd = 'manifesting-generator' AND category = 'emotional'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Clarté instantanée', 
  'manifesting-generator', 
  'emotional', 
  'Tu ressens un flash de vérité intérieure. Tu sais. C''est limpide. Tu n''as pas besoin d''expliquer. Ton corps, ton cœur et ton énergie sont d''accord.', 
  'Tu es pleinement connectée à ton autorité intérieure. Tu n''as pas mentalisé, tu as ressenti et agi.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "spleen"}', jsonb '{"center": "g-center"}'], 
  'Ma vérité est mon meilleur guide.', 
  'Écris une décision récente. Note : ''Qu''est-ce que je savais déjà ?'' Observe ta première sensation.', 
  'Je sais', 
  'Je m''honore', 
  'Cette clarté est ton don. Fais-lui confiance, même si personne ne la comprend.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Clarté instantanée' AND type_hd = 'manifesting-generator' AND category = 'emotional'
);

-- Manifestor
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Fureur de contrainte', 
  'manifestor', 
  'emotional', 
  'Tu ressens une rage sourde quand on t''empêche d''avancer ou qu''on t''impose une direction. C''est une colère viscérale, difficile à exprimer sans exploser.', 
  'Quelqu''un a tenté de te contrôler ou tu t''es forcée à suivre une voie non initiée par toi.', 
  ARRAY[jsonb '{"center": "throat"}', jsonb '{"center": "heart"}', jsonb '{"center": "root"}'], 
  'Je suis libre de tracer ma voie.', 
  'Prends une feuille et écris tout ce que tu as envie de faire sans qu''on t''en empêche. Puis choisis-en une chose à initier aujourd''hui.', 
  'Je suis libre', 
  'Je me libère', 
  'Ta colère est légitime. Elle défend ton droit d''exister à ta manière. Utilise-la pour reprendre ton pouvoir.', 
  48, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Fureur de contrainte' AND type_hd = 'manifestor' AND category = 'emotional'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Calme de visionnaire', 
  'manifestor', 
  'emotional', 
  'Tu es en retrait, mais en clarté. Tu sens que quelque chose se prépare en toi. Tu es en silence, mais pas en vide. Tu es concentrée, paisible.', 
  'Tu respectes ton besoin de solitude régénérante. Tu es dans ta phase intérieure avant l''action.', 
  ARRAY[jsonb '{"center": "spleen"}', jsonb '{"center": "ajna"}', jsonb '{"center": "g-center"}'], 
  'Mon retrait est une force. Mon silence est fertile.', 
  'Ferme les yeux. Respire profondément. Pose ta main sur ton ventre et écoute ce que ton corps prépare en silence.', 
  'Je me ressource', 
  'Je prépare', 
  'Tu n''as rien à prouver. Ce que tu prépares en secret sera un cadeau pour le monde.', 
  91, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Calme de visionnaire' AND type_hd = 'manifestor' AND category = 'emotional'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Fierté paisible', 
  'manifestor', 
  'emotional', 
  'Tu te sens bien. Alignée. Pas besoin d''être vue, ni reconnue. Tu sais que tu es à ta place. Tu avances sereinement, avec autorité intérieure.', 
  'Tu as respecté ton cycle énergétique. Tu as initié une action juste, sans résistance ni explication.', 
  ARRAY[jsonb '{"center": "heart"}', jsonb '{"center": "throat"}', jsonb '{"center": "spleen"}'], 
  'Ma souveraineté se passe de permission.', 
  'Marche lentement dans une pièce, la tête haute. Ressens ton corps. Dis-toi intérieurement : ''Je n''ai besoin de l''approbation de personne.''', 
  'Je me tiens droite', 
  'Je m''appartiens', 
  'Tu es un pilier silencieux. Et c''est ton calme qui inspire.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Fierté paisible' AND type_hd = 'manifestor' AND category = 'emotional'
);

-- Reflector
INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Surcharge ambiante', 
  'reflector', 
  'emotional', 
  'Tu ressens les émotions des autres comme si elles étaient les tiennes. Tu es bouleversée sans savoir pourquoi, prise dans une marée émotionnelle étrangère.', 
  'Tu as absorbé l''énergie émotionnelle d''un lieu ou d''une personne sans filtre. Tu ne t''es pas recentrée.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}'], 
  'Ce que je ressens ne m''appartient pas toujours.', 
  'Va dans un lieu neutre, calme. Assieds-toi. Pose cette intention : ''Je rends ce qui n''est pas à moi.'' Respire profondément.', 
  'Je me nettoie', 
  'Je me retrouve', 
  'Tu es un miroir. Mais tu n''es pas une éponge. Tu as le droit de filtrer ce que tu gardes.', 
  49, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Surcharge ambiante' AND type_hd = 'reflector' AND category = 'emotional'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Émerveillement fragile', 
  'reflector', 
  'emotional', 
  'Tu vis une beauté inattendue, un détail te touche profondément. Mais c''est si subtil que tu n''oses pas toujours le partager.', 
  'Ton aura a capté une fréquence élevée dans ton environnement. Tu es dans une phase d''ouverture sensible.', 
  ARRAY[jsonb '{"center": "g-center"}', jsonb '{"center": "ajna"}', jsonb '{"center": "head"}'], 
  'Je peux m''émerveiller même si les autres ne comprennent pas.', 
  'Note ou photographie ce qui t''a émerveillée. Garde une trace. C''est ta boussole secrète.', 
  'Je contemple', 
  'Je me nourris', 
  'Ce que tu ressens est précieux. Même si personne ne le voit. Laisse-toi toucher.', 
  87, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Émerveillement fragile' AND type_hd = 'reflector' AND category = 'emotional'
);

INSERT INTO feelings (name, type_hd, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Connexion mystique', 
  'reflector', 
  'emotional', 
  'Tu te sens en lien avec quelque chose de plus grand. L''univers te parle à travers les signes, les regards, les silences. Tu es traversée, inspirée.', 
  'Ton aura est ouverte, ton environnement est aligné, et tu te laisses guider sans résister.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}'], 
  'Je suis un canal vivant de conscience.', 
  'Tire une carte, fais silence, ou médite 7 minutes. Laisse venir ce qui vient. Reste réceptive.', 
  'Je reçois', 
  'Je rayonne', 
  'Quand tu es alignée, tu deviens oracle. Ce que tu captes est sacré.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Connexion mystique' AND type_hd = 'reflector' AND category = 'emotional'
);

-- Generic emotional feelings (no specific HD type)
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens sereine et confiante', 
  'emotional', 
  'Une sensation de paix intérieure m''habite. Je me sens en sécurité émotionnelle, capable de faire face aux défis avec calme.', 
  'J''ai pris soin de mon équilibre émotionnel. J''ai honoré mes besoins et mes limites.', 
  ARRAY[jsonb '{"center": "solar-plexus"}'], 
  'Ma sérénité est ma force. Je peux rester calme même dans la tempête.', 
  'Assieds-toi confortablement. Ferme les yeux. Pose une main sur ton cœur. Respire profondément pendant 3 minutes en te concentrant sur la sensation de paix.', 
  'Je suis calme', 
  'Je suis confiante', 
  'Cette paix que tu ressens est ton état naturel. Tu peux y revenir à tout moment.', 
  90, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens sereine et confiante' AND category = 'emotional'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je ressens de l''anxiété', 
  'emotional', 
  'Une inquiétude diffuse m''habite. Mon mental est agité, mon corps tendu. J''ai du mal à me poser.', 
  'Possible surcharge émotionnelle, changement hormonal, ou besoin de sécurité non exprimé.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "root"}'], 
  'Mon anxiété est un message, pas une identité.', 
  'Pose tes deux mains sur ton ventre. Respire profondément en comptant jusqu''à 4 à l''inspiration, et jusqu''à 6 à l''expiration. Répète 10 fois.', 
  'J''accueille mon anxiété', 
  'Je la laisse passer', 
  'Ton anxiété n''est qu''un nuage dans ton ciel intérieur. Elle passera, comme tous les nuages.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je ressens de l''anxiété' AND category = 'emotional'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens profondément connectée', 
  'emotional', 
  'Mon cœur est ouvert. Je ressens une connexion authentique avec moi-même et les autres. Les émotions circulent librement.', 
  'J''ai cultivé des relations nourrissantes. J''ai créé de l''espace pour l''authenticité.', 
  ARRAY[jsonb '{"center": "heart"}', jsonb '{"center": "g-center"}'], 
  'Je suis reliée à tout ce qui vit. Je fais partie du grand tout.', 
  'Ferme les yeux. Visualise des fils de lumière qui te relient à tout ce que tu aimes. Ressens cette connexion pendant quelques minutes.', 
  'Je suis reliée', 
  'Je suis aimée', 
  'Cette connexion que tu ressens est ta nature profonde. Tu n''es jamais vraiment seule.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens profondément connectée' AND category = 'emotional'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens submergée', 
  'emotional', 
  'Les émotions semblent trop intenses. J''ai du mal à les contenir ou à les comprendre. Tout déborde.', 
  'Accumulation d''émotions non exprimées, période sensible du cycle, ou besoin de libération.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "heart"}'], 
  'Je peux accueillir le flot sans me noyer.', 
  'Prends un papier et écris tout ce que tu ressens, sans filtre. Laisse couler les mots comme une rivière. Puis déchire ou brûle ce papier.', 
  'J''accueille la vague', 
  'Je reste ancrée', 
  'Tu es plus vaste que tes émotions. Comme l''océan qui contient la tempête, tu peux tout accueillir.', 
  35, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens submergée' AND category = 'emotional'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je ressens de la tristesse', 
  'emotional', 
  'Une mélancolie profonde me traverse. Mon cœur est lourd. Les larmes sont proches.', 
  'Processus de guérison en cours, phase lunaire descendante, ou besoin de douceur.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "heart"}'], 
  'Ma tristesse est une rivière qui me traverse, pas un lac où je me noie.', 
  'Permets-toi de pleurer si tu en ressens le besoin. Tiens-toi dans tes bras. Dis-toi doucement : "C''est ok d''être triste. Je t''aime quand même."', 
  'J''honore ma tristesse', 
  'Je me tiens avec amour', 
  'Ta tristesse est sacrée. Elle te montre ce qui compte vraiment pour toi. Honore-la comme une amie.', 
  45, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je ressens de la tristesse' AND category = 'emotional'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens joyeuse sans raison', 
  'emotional', 
  'Une joie simple et pure émane de mon être. Je me sens légère et reconnaissante. Mon cœur est en expansion.', 
  'Je suis alignée avec mon essence. J''ai cultivé la gratitude et la présence.', 
  ARRAY[jsonb '{"center": "heart"}', jsonb '{"center": "g-center"}', jsonb '{"center": "solar-plexus"}'], 
  'Je mérite cette joie qui vient de l''intérieur.', 
  'Danse ou bouge ton corps librement pendant 2-3 minutes. Laisse cette joie s''exprimer physiquement.', 
  'Je célèbre', 
  'Je rayonne', 
  'Cette joie est ton état naturel. Plus tu la célèbres, plus elle s''amplifie.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens joyeuse sans raison' AND category = 'emotional'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens irritable', 
  'emotional', 
  'Une tension émotionnelle me traverse. Je suis plus réactive que d''habitude. Tout semble m''affecter.', 
  'Phase prémenstruelle, fatigue émotionnelle, ou besoins non honorés.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "spleen"}'], 
  'Mon irritabilité me montre mes limites. Je peux les respecter avec douceur.', 
  'Isole-toi quelques minutes. Respire profondément. Demande-toi : "De quoi ai-je vraiment besoin en ce moment ?" Puis offre-toi une petite chose qui répond à ce besoin.', 
  'Je reconnais mes limites', 
  'Je prends soin de moi', 
  'Ton irritabilité n''est pas un défaut. C''est un signal de ton corps qui te demande de ralentir et de t''écouter.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens irritable' AND category = 'emotional'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens déconnectée', 
  'emotional', 
  'J''ai du mal à ressentir mes émotions. Je me sens comme dans une bulle, détachée de mon ressenti.', 
  'Mécanisme de protection, surcharge émotionnelle, ou besoin de repos profond.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "g-center"}'], 
  'Ma déconnexion est une protection temporaire. Je peux revenir quand je serai prête.', 
  'Pose une main sur ton cœur. Ferme les yeux. Respire profondément et dis : "Je suis là. Je t''écoute." Reste ainsi 5 minutes.', 
  'Je m''observe', 
  'Sans me juger', 
  'Cette déconnexion est temporaire. Ton cœur se protège. Quand tu seras prête, les émotions reviendront.', 
  38, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens déconnectée' AND category = 'emotional'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens émotionnellement stable', 
  'emotional', 
  'Mes émotions sont présentes mais équilibrées. Je peux les accueillir sans être submergée. Je me sens ancrée.', 
  'J''ai développé ma capacité à être présente avec mes émotions. J''ai trouvé mon rythme.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "spleen"}', jsonb '{"center": "root"}'], 
  'Je suis le ciel qui accueille tous les nuages émotionnels.', 
  'Assieds-toi confortablement. Observe tes émotions comme des nuages qui passent dans ton ciel intérieur. Reste témoin, sans t''identifier.', 
  'J''observe', 
  'Je reste stable', 
  'Cette stabilité émotionnelle est un trésor que tu as cultivé. Elle te permet d''être pleinement présente à la vie.', 
  85, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens émotionnellement stable' AND category = 'emotional'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens créative et inspirée', 
  'emotional', 
  'Les émotions nourrissent ma créativité. Je me sens en connexion avec ma source d''inspiration. Les idées fluent naturellement.', 
  'J''ai donné de l''espace à mon expression créative. J''ai honoré mes élans.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "throat"}'], 
  'Ma créativité est un canal pour mes émotions.', 
  'Prends un moment pour créer quelque chose - un dessin, un texte, une mélodie - qui exprime ce que tu ressens maintenant.', 
  'Je m''ouvre', 
  'Je crée', 
  'Ta créativité est un pont entre ton monde intérieur et le monde extérieur. Laisse-la s''exprimer librement.', 
  90, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens créative et inspirée' AND category = 'emotional'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je ressens de la peur', 
  'emotional', 
  'Une appréhension m''envahit. Je sens mon corps se contracter, mon souffle se raccourcir. Mon mental anticipe le pire.', 
  'Insécurité réelle ou perçue, traumatisme passé, ou signal d''alerte du système nerveux.', 
  ARRAY[jsonb '{"center": "spleen"}', jsonb '{"center": "root"}'], 
  'Ma peur est une information, pas une condamnation.', 
  'Pose tes mains sur ton ventre. Respire profondément. Dis à voix haute : "Je suis en sécurité maintenant. Je peux faire face à ce qui vient."', 
  'J''accueille ma peur', 
  'Je reste ancrée', 
  'Ta peur ne définit pas qui tu es. C''est une visiteuse temporaire qui te rappelle ce qui compte pour toi.', 
  35, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je ressens de la peur' AND category = 'emotional'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens en colère', 
  'emotional', 
  'Une énergie puissante monte en moi. Je sens mon corps se tendre, ma température augmenter. J''ai envie d''exprimer cette force.', 
  'Limites non respectées, injustice perçue, ou besoin d''affirmation.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "heart"}', jsonb '{"center": "throat"}'], 
  'Ma colère est une énergie de transformation. Elle me montre ce qui doit changer.', 
  'Trouve un espace privé. Exprime physiquement ta colère : frappe un coussin, crie dans une serviette, ou écris une lettre que tu ne posteras pas.', 
  'J''honore ma colère', 
  'Je la transforme', 
  'Ta colère est une force puissante. Bien canalisée, elle peut être le moteur de changements importants dans ta vie.', 
  45, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens en colère' AND category = 'emotional'
);