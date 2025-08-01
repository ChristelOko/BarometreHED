-- Insert feelings for the "État Mental" category
-- This migration adds all the feelings from the provided CSV file
-- Each feeling is inserted only if it doesn't already exist (to avoid duplicates)

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
  'Téléchargement intuitif', 
  'projector', 
  'mental', 
  'Un flot de compréhension profonde arrive, sans effort, comme un message clair tombé du ciel.', 
  'Tu es parfaitement centrée, détendue, dans un état d''ouverture totale à ton environnement subtil.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "g-center"}', jsonb '{"center": "spleen"}'], 
  'Ma lucidité me traverse quand je ne force rien.', 
  'Ferme les yeux. Pose tes deux mains sur ton cœur. Laisse venir ce qui veut s''imprimer en toi.', 
  'Je reçois', 
  'Je transmets', 
  'Tu es une antenne raffinée. Quand tu t''abandonnes au silence, le monde t''envoie sa sagesse.', 
  100, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Téléchargement intuitif' AND type_hd = 'projector' AND category = 'mental'
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
  'Saut mental permanent', 
  'manifesting-generator', 
  'mental', 
  'Ton esprit saute d''une idée à l''autre sans jamais aller au bout. C''est stimulant mais aussi épuisant.', 
  'Tu t''es laissée entraîner par plusieurs impulsions sans attendre de réponse claire. Tu disperses ton feu.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "head"}', jsonb '{"center": "sacral"}'], 
  'Je peux canaliser mon feu sans l''éparpiller.', 
  'Choisis une idée et engage-toi dessus pendant 10 minutes sans switcher. Observe ton mental se poser.', 
  'Je me pose', 
  'Je m''ancre', 
  'Tu es rapide, mais tu gagnes en puissance quand tu canalises. Une seule idée peut ouvrir tout un monde.', 
  43, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Saut mental permanent' AND type_hd = 'manifesting-generator' AND category = 'mental'
);

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
  'Mental fermé', 
  'manifestor', 
  'mental', 
  'Tu n''arrives pas à recevoir les idées des autres. Tu ressens une forme de rejet ou de fermeture brutale aux suggestions extérieures.', 
  'Tu as été interrompue dans ton élan intérieur ou mal accueillie dans ta spontanéité mentale.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "head"}', jsonb '{"center": "throat"}'], 
  'Je protège mon espace mental sans rejeter l''extérieur.', 
  'Prends un moment seule. Écris ce que tu veux vraiment penser, sans influence.', 
  'Je m''isole', 
  'Je m''ouvre', 
  'Ton mental a besoin d''autonomie. Mais il gagne en nuance quand tu t''autorises à l''adoucir.', 
  43, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Mental fermé' AND type_hd = 'manifestor' AND category = 'mental'
);

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
  'Saturation mentale collective', 
  'reflector', 
  'mental', 
  'Tu ressens comme si le mental du monde entier était dans ta tête. Tu absorbes trop de pensées qui ne t''appartiennent pas.', 
  'Tu as passé trop de temps dans des environnements bruyants ou surstimulants. Ton aura s''est chargée sans filtre.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "spleen"}'], 
  'Je peux relâcher ce qui ne m''appartient pas.', 
  'Place une main sur ton front, une autre sur ta poitrine. Dis : ''Je rends ce qui ne m''appartient pas.''', 
  'Je me vide', 
  'Je me retrouve', 
  'Tu es une antenne subtile. Ton mental a besoin de tri pour refléter avec justesse.', 
  41, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Saturation mentale collective' AND type_hd = 'reflector' AND category = 'mental'
);

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

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Créativité mentale fluide', 
  'mental', 
  'Les idées jaillissent naturellement. Mon esprit fait des connections inattendues et inspirantes.', 
  'J''ai donné à mon esprit l''espace de jouer et d''explorer sans pression de performance.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "throat"}'], 
  'Mon esprit est un jardin fertile quand je lui donne liberté et espace.', 
  'Prends 10 minutes pour faire un brainstorming libre sur n''importe quel sujet qui t''inspire. Ne juge aucune idée.', 
  'Je m''ouvre', 
  'Je crée', 
  'Ta créativité mentale est une source inépuisable. Plus tu lui fais confiance, plus elle s''épanouit.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Créativité mentale fluide' AND category = 'mental'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Confusion mentale', 
  'mental', 
  'Mes pensées sont embrouillées. J''ai du mal à prendre des décisions ou à voir clairement la situation.', 
  'Surcharge d''informations, fatigue mentale, ou conflit intérieur non résolu.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}'], 
  'La confusion est temporaire. La clarté reviendra quand je me donnerai l''espace de respirer.', 
  'Ferme les yeux. Respire profondément pendant 5 minutes. Puis pose-toi une seule question simple et écoute la première réponse qui vient.', 
  'Je ralentis', 
  'Je clarifie', 
  'La confusion n''est pas un échec. C''est une invitation à ralentir et à simplifier.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Confusion mentale' AND category = 'mental'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Concentration profonde', 
  'mental', 
  'Je suis complètement absorbée dans ma tâche. Mon esprit est focalisé et présent, sans distraction.', 
  'J''ai trouvé une activité qui correspond à mes talents naturels et à mes intérêts profonds.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "g-center"}'], 
  'Je suis capable d''une attention profonde quand je suis alignée avec ce que je fais.', 
  'Continue ton activité en pleine conscience. Observe comment ton esprit reste naturellement engagé sans effort.', 
  'Je suis présente', 
  'Je suis concentrée', 
  'Cette concentration est ton état naturel quand tu es alignée avec ce qui te passionne vraiment.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Concentration profonde' AND category = 'mental'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Pensées négatives', 
  'mental', 
  'Mon esprit est envahi de pensées pessimistes ou critiques. Je vois surtout les problèmes et les obstacles.', 
  'Stress prolongé, habitudes de pensée négative, ou environnement toxique.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "solar-plexus"}'], 
  'Mes pensées négatives sont des visiteurs, pas des résidents permanents.', 
  'Pour chaque pensée négative qui surgit, écris immédiatement une pensée alternative plus équilibrée ou positive.', 
  'J''observe sans juger', 
  'Je choisis ma perspective', 
  'Ton esprit est comme un jardin. Tu peux choisir quelles graines tu y laisses pousser.', 
  35, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Pensées négatives' AND category = 'mental'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Intuition aiguisée', 
  'mental', 
  'Je perçois des informations subtiles sans effort analytique. Je sais des choses sans pouvoir expliquer comment.', 
  'J''ai appris à faire confiance à ma sagesse intérieure. J''ai créé l''espace pour l''écouter.', 
  ARRAY[jsonb '{"center": "spleen"}', jsonb '{"center": "ajna"}', jsonb '{"center": "solar-plexus"}'], 
  'Mon intuition est une intelligence profonde qui mérite ma confiance.', 
  'Ferme les yeux. Pose-toi une question importante. Observe la première réponse qui monte, avant toute analyse.', 
  'J''écoute', 
  'Je fais confiance', 
  'Ton intuition est une forme d''intelligence supérieure. Plus tu l''honores, plus elle s''affine.', 
  90, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Intuition aiguisée' AND category = 'mental'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Surcharge mentale', 
  'mental', 
  'Mon esprit est submergé d''informations et de tâches. J''ai l''impression de ne plus pouvoir traiter quoi que ce soit.', 
  'Trop de responsabilités, manque de limites claires, ou habitude de multitâche excessive.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "root"}'], 
  'Je n''ai pas à tout porter dans mon esprit en même temps.', 
  'Prends une feuille et note absolument tout ce qui occupe ton esprit. Puis entoure les 3 choses vraiment essentielles pour aujourd''hui.', 
  'Je décharge', 
  'Je priorise', 
  'Ton esprit n''est pas fait pour tout contenir. Il s''épanouit quand tu lui donnes des priorités claires.', 
  30, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Surcharge mentale' AND category = 'mental'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Clarté décisionnelle', 
  'mental', 
  'Je sais exactement ce que je veux et pourquoi. Mon esprit est aligné avec mes valeurs et mes priorités.', 
  'J''ai pris le temps de me connecter à ce qui compte vraiment pour moi. J''ai clarifié mes valeurs.', 
  ARRAY[jsonb '{"center": "ajna"}', jsonb '{"center": "g-center"}', jsonb '{"center": "heart"}'], 
  'Mes décisions sont claires quand elles sont alignées avec mon essence.', 
  'Écris ta décision et les 3 raisons profondes qui la soutiennent. Ressens si cela résonne en toi.', 
  'Je sais', 
  'Je choisis', 
  'Cette clarté décisionnelle est ton pouvoir. Elle vient de l''alignement entre ton esprit et ton cœur.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Clarté décisionnelle' AND category = 'mental'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Rumination mentale', 
  'mental', 
  'Je ressasse sans cesse les mêmes pensées, souvent négatives ou anxieuses. Mon esprit est pris dans une boucle.', 
  'Anxiété non traitée, tendance au perfectionnisme, ou besoin de contrôle face à l''incertitude.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "solar-plexus"}'], 
  'Je peux interrompre le cycle de rumination en revenant au présent.', 
  'Engage tes sens : touche 5 objets, nomme 4 choses que tu vois, 3 sons que tu entends, 2 odeurs que tu sens, 1 goût que tu perçois.', 
  'Je reviens au présent', 
  'Je libère mon mental', 
  'La rumination est un piège mental. Ton corps et tes sens sont la porte de sortie.', 
  35, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Rumination mentale' AND category = 'mental'
);

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