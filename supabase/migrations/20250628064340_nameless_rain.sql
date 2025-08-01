/*
  # Update General Feelings

  1. New Tables
    - No new tables created
  
  2. Security
    - No security changes
  
  3. Changes
    - Adds feelings data for the "État Général" category from the provided CSV
    - Ensures proper formatting of affected_centers as JSONB arrays
    - Preserves existing feelings by using INSERT ... WHERE NOT EXISTS
*/

-- Insert feelings for the "État Général" category
-- This migration adds all the feelings from the provided CSV file
-- Each feeling is inserted only if it doesn't already exist (to avoid duplicates)

-- Lourdeur diffuse
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Lourdeur diffuse', 
  'general', 
  'Tu ressens une sorte de poids, sans raison évidente. Ton corps semble freiné, ralenti, comme si chaque geste te demandait un effort supplémentaire. Ce n''est pas une douleur, ni une vraie fatigue : c''est plus une densité, une pesanteur intérieure difficile à localiser.', 
  'Cette sensation peut émerger en période prémenstruelle ou lors des jours de transition entre la pleine lune et la lune décroissante. Elle est souvent liée à une surcharge énergétique : trop d''émotions absorbées, trop de sollicitations mentales, pas assez de libérations physiques.', 
  ARRAY[jsonb '{"center": "spleen"}', jsonb '{"center": "sacral"}'], 
  'Je reconnais que mon corps me parle, et je l''écoute avec tendresse.', 
  'Allonge-toi au sol, jambes pliées, pieds à plat. Pose tes mains sur ton bas-ventre. Respire lentement. Ferme les yeux et imagine que tu laisses la Terre absorber cette lourdeur. Laisse-la descendre, s''enraciner, se transmuter. Fais-le pendant 5 à 7 minutes sans rien attendre d''autre que le relâchement.', 
  'Je m''ancre', 
  'et je me libère', 
  'Tu es dans une phase de dépose. Ce n''est ni une faiblesse, ni un arrêt : c''est une transition. Honore cette densité comme une sagesse du corps qui te demande de revenir au présent, à l''essentiel, à toi.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Lourdeur diffuse' AND category = 'general'
);

-- Lourdeur au réveil
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Lourdeur au réveil', 
  'general', 
  'Difficulté à émerger le matin. Le corps est comme ancré dans le matelas. L''énergie peine à circuler.', 
  'Sommeil non réparateur, cycle hormonal, ou besoin de repos plus profond.', 
  ARRAY[jsonb '{"center": "spleen"}', jsonb '{"center": "root"}'], 
  'Mon corps me demande plus de douceur dans mes réveils.', 
  'Avant de te lever, étire-toi dans ton lit pendant 5 minutes. Respire profondément et remercie ton corps pour le repos.', 
  'Je m''éveille en douceur', 
  'Je respecte mon rythme', 
  'Ton corps a ses propres rythmes. Respecte-les et il te le rendra au centuple.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Lourdeur au réveil' AND category = 'general'
);

-- Tensions dans la poitrine
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Tensions dans la poitrine', 
  'general', 
  'Sensation d''oppression ou de compression dans la zone du cœur. La respiration peut sembler contrainte.', 
  'Émotions non exprimées, stress accumulé, ou besoin de libération émotionnelle.', 
  ARRAY[jsonb '{"center": "heart"}', jsonb '{"center": "solar-plexus"}'], 
  'Je libère ce qui pèse sur mon cœur avec compassion.', 
  'Masse doucement ta poitrine en respirant profondément. Visualise une lumière dorée qui dissout les tensions.', 
  'Je libère les tensions', 
  'Mon cœur s''ouvre', 
  'Ces tensions sont des messages. Écoute-les avec bienveillance et libère ce qui ne te sert plus.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Tensions dans la poitrine' AND category = 'general'
);

-- Brouillard mental
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Brouillard mental', 
  'general', 
  'Difficulté à penser clairement. Les idées semblent floues, la concentration est difficile.', 
  'Fatigue mentale, surcharge d''informations, ou besoin de pause cognitive.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}'], 
  'Je m''autorise à ne pas tout comprendre maintenant.', 
  'Ferme les yeux et compte tes respirations jusqu''à 20. Si tu perds le compte, recommence sans jugement.', 
  'Je calme mon mental', 
  'Je retrouve ma clarté', 
  'Ce brouillard est temporaire. Ton mental a besoin de repos pour retrouver sa clarté naturelle.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Brouillard mental' AND category = 'general'
);

-- Sensibilité exacerbée
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Sensibilité exacerbée', 
  'general', 
  'Tout semble plus intense. Les émotions, les sensations, les stimuli externes sont amplifiés.', 
  'Phase prémenstruelle, pleine lune, ou période de transformation énergétique.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "spleen"}'], 
  'Ma sensibilité est un don, je l''honore en me protégeant.', 
  'Crée un cocon de douceur autour de toi : lumière tamisée, musique douce, vêtements confortables.', 
  'J''honore ma sensibilité', 
  'Je me protège avec amour', 
  'Ta sensibilité est une force. Apprends à la protéger pour qu''elle reste un cadeau.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Sensibilité exacerbée' AND category = 'general'
);

-- Manque d'élan
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Manque d''élan', 
  'general', 
  'Difficulté à initier l''action. L''énergie semble stagnante, même pour les tâches simples.', 
  'Besoin de repos, phase lunaire descendante, ou nécessité de réalignement.', 
  ARRAY[jsonb '{"center": "sacral"}', jsonb '{"center": "root"}'], 
  'Je respecte les cycles de mon énergie, y compris les phases de repos.', 
  'Commence par une toute petite action, puis félicite-toi. L''élan reviendra progressivement.', 
  'Je respecte mon rythme', 
  'L''élan reviendra', 
  'Les phases de repos sont nécessaires. Ton élan reviendra quand ce sera le bon moment.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Manque d''élan' AND category = 'general'
);

-- Sensibilité au bruit
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Sensibilité au bruit', 
  'general', 
  'Les sons semblent plus agressifs que d''habitude. Le système nerveux est en état d''hypervigilance.', 
  'Surcharge sensorielle, fatigue nerveuse, ou besoin de calme profond.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "spleen"}'], 
  'Je m''offre le silence dont j''ai besoin pour me régénérer.', 
  'Trouve un endroit silencieux et reste-y 15 minutes. Utilise des bouchons d''oreilles si nécessaire.', 
  'Je cherche le silence', 
  'Je me régénère', 
  'Ton système nerveux a besoin de calme. Offre-lui ce repos, c''est un acte d''amour envers toi.', 
  40, 
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Sensibilité au bruit' AND category = 'general'
);

-- Positive feelings
INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens profondément vivante', 
  'general', 
  'Mon souffle est fluide, mon corps est léger, mon esprit paisible. Je sens une vibration douce sous ma peau, comme un courant subtil de joie tranquille.', 
  'Mon énergie circule librement. Je suis alignée à mon cycle, à mes choix, à mes rythmes naturels. Mon sommeil a été réparateur, mes besoins écoutés.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "spleen"}'], 
  'Je suis une femme vivante, enracinée et ouverte au monde.', 
  'Ferme les yeux. Sens ton ventre se gonfler. Remercie ton énergie pour sa fidélité. Puis ouvre doucement les bras comme si tu dansais avec la vie.', 
  'Je m''accueille', 
  'Je rayonne', 
  'Continue à honorer cette vitalité. Elle est ton socle, ton feu sacré, ta lumière dans le monde.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens profondément vivante' AND category = 'general'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens claire et posée', 
  'general', 
  'Ma tête est légère, mes idées circulent doucement, sans surcharge. Je ressens une stabilité tranquille dans ma posture, et une clarté douce dans mon regard.', 
  'Mon mental est apaisé. J''ai posé des limites saines, j''ai dormi suffisamment, et j''ai écouté mes priorités.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}'], 
  'Je n''ai rien à prouver. Je suis claire, et cela suffit.', 
  'Assieds-toi en silence. Pose une main sur ton front, l''autre sur ta poitrine. Respire profondément, 5 fois. Puis murmure : "Merci, mental."', 
  'Je suis paisible', 
  'Je suis claire', 
  'Ce calme en toi est précieux. Protège-le, car il est ton filtre sacré dans un monde bruyant.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens claire et posée' AND category = 'general'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens aimée et entourée', 
  'general', 
  'Je ressens une chaleur dans mon cœur, une sensation d''être portée par la vie. Les connexions avec les autres sont fluides et nourrissantes.', 
  'Je suis en lien authentique avec moi-même et les autres. J''ai cultivé des relations saines et équilibrées.', 
  ARRAY[jsonb '{"center": "heart"}', jsonb '{"center": "g-center"}'], 
  'Je mérite l''amour que je reçois et celui que je donne.', 
  'Place tes mains sur ton cœur. Respire en pensant à une personne qui t''aime. Sens cette chaleur se diffuser dans tout ton corps.', 
  'Je reçois l''amour', 
  'Je rayonne l''amour', 
  'Cette connexion que tu ressens est réelle. Tu es digne d''amour, simplement parce que tu existes.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens aimée et entourée' AND category = 'general'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens fière et en paix', 
  'general', 
  'Une sensation de plénitude m''habite. Je me sens alignée avec mes valeurs et mes actions. Je reconnais mon chemin parcouru.', 
  'J''ai honoré mes engagements envers moi-même. J''ai agi en accord avec ma vérité profonde.', 
  ARRAY[jsonb '{"center": "heart"}', jsonb '{"center": "g-center"}'], 
  'Je célèbre qui je suis devenue et le chemin que j''ai parcouru.', 
  'Écris trois choses dont tu es fière aujourd''hui. Lis-les à voix haute en posant la main sur ton cœur.', 
  'Je reconnais ma valeur', 
  'Je célèbre mon chemin', 
  'Cette fierté que tu ressens est méritée. Tu as le droit d''être fière de qui tu es.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens fière et en paix' AND category = 'general'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens inspirée et connectée', 
  'general', 
  'Les idées affluent naturellement. Je me sens en lien avec ma créativité et mon intuition. Tout semble possible et fluide.', 
  'J''ai créé l''espace pour que l''inspiration se manifeste. J''ai nourri ma connexion spirituelle.', 
  ARRAY[jsonb '{"center": "head"}', jsonb '{"center": "ajna"}', jsonb '{"center": "throat"}'], 
  'Je suis un canal ouvert pour la créativité et l''inspiration.', 
  'Prends un carnet et écris pendant 5 minutes sans t''arrêter, laisse les mots couler librement.', 
  'Je m''ouvre à l''inspiration', 
  'Je laisse créer à travers moi', 
  'Cette inspiration qui te traverse est un cadeau. Fais-lui confiance et laisse-la s''exprimer.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens inspirée et connectée' AND category = 'general'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens paisible et sereine', 
  'general', 
  'Une tranquillité profonde m''habite. Mon corps et mon esprit sont en harmonie. Je me sens en sécurité.', 
  'J''ai cultivé ma paix intérieure. J''ai pris soin de mon environnement et de mes besoins de base.', 
  ARRAY[jsonb '{"center": "solar-plexus"}', jsonb '{"center": "heart"}'], 
  'La paix que je ressens vient de l''intérieur et m''appartient.', 
  'Allonge-toi et respire profondément. À chaque expiration, relâche une tension. Reste ainsi 10 minutes.', 
  'Je cultive la paix', 
  'Je suis sérénité', 
  'Cette paix que tu as cultivée est ton trésor. Elle t''accompagnera dans tous les défis.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens paisible et sereine' AND category = 'general'
);

INSERT INTO feelings (name, category, description, probable_origin, affected_centers, mirror_phrase, realignment_exercise, mantra_inhale, mantra_exhale, encouragement, alignment_score, is_positive)
SELECT 
  'Je me sens alignée et confiante', 
  'general', 
  'Je ressens une cohérence entre mes pensées, mes émotions et mes actions. La confiance coule naturellement.', 
  'J''ai écouté ma sagesse intérieure. J''ai fait des choix alignés avec mon essence.', 
  ARRAY[jsonb '{"center": "g-center"}', jsonb '{"center": "heart"}'], 
  'Je fais confiance à ma sagesse intérieure pour me guider.', 
  'Debout, les pieds bien ancrés, répète : "Je suis alignée" en sentant cette vérité dans tout ton corps.', 
  'Je m''aligne à ma vérité', 
  'Je rayonne ma confiance', 
  'Cette confiance que tu ressens est le fruit de ton authenticité. Continue à t''écouter.', 
  95, 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM feelings WHERE name = 'Je me sens alignée et confiante' AND category = 'general'
);