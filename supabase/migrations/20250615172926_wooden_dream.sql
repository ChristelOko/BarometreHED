/*
  # Create feelings table and migrate existing data
  
  1. New Table
    - `feelings` table for storing all feeling data
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `category` (text, not null)
      - `description` (text, not null)
      - `probable_origin` (text, not null)
      - `affected_centers` (text[], not null)
      - `mirror_phrase` (text)
      - `realignment_exercise` (text)
      - `mantra_inhale` (text)
      - `mantra_exhale` (text)
      - `encouragement` (text)
      - `is_positive` (boolean, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `feelings` table
    - Add policies for authenticated users to read feelings
    - Add policies for admins to manage feelings
  
  3. Data Migration
    - Import all feelings from the frontend store
    - Organized by category (general, emotional, physical)
*/

-- Create feelings table
CREATE TABLE IF NOT EXISTS feelings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  probable_origin text NOT NULL,
  affected_centers text[] NOT NULL,
  mirror_phrase text,
  realignment_exercise text,
  mantra_inhale text,
  mantra_exhale text,
  encouragement text,
  is_positive boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE feelings
ADD CONSTRAINT feelings_category_check
CHECK (category IN ('general', 'emotional', 'physical', 'mental', 'digestive', 'somatic', 'energetic', 'feminine_cycle', 'hd_specific'));

-- Enable RLS
ALTER TABLE feelings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read feelings"
  ON feelings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage feelings"
  ON feelings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_feelings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_feelings_updated_at
  BEFORE UPDATE ON feelings
  FOR EACH ROW
  EXECUTE FUNCTION update_feelings_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feelings_category ON feelings(category);
CREATE INDEX IF NOT EXISTS idx_feelings_is_positive ON feelings(is_positive);
CREATE INDEX IF NOT EXISTS idx_feelings_affected_centers ON feelings USING GIN(affected_centers);

-- Insert General Category - Positive Feelings
INSERT INTO feelings (
  name,
  category,
  description,
  probable_origin,
  affected_centers,
  mirror_phrase,
  realignment_exercise,
  mantra_inhale,
  mantra_exhale,
  encouragement,
  is_positive
) VALUES
  (
    'Je me sens profondément vivante',
    'general',
    'Mon souffle est fluide, mon corps est léger, mon esprit paisible. Je sens une vibration douce sous ma peau, comme un courant subtil de joie tranquille.',
    'Mon énergie circule librement. Je suis alignée à mon cycle, à mes choix, à mes rythmes naturels. Mon sommeil a été réparateur, mes besoins écoutés.',
    ARRAY['solar-plexus', 'spleen'],
    'Je suis une femme vivante, enracinée et ouverte au monde.',
    'Ferme les yeux. Sens ton ventre se gonfler. Remercie ton énergie pour sa fidélité. Puis ouvre doucement les bras comme si tu dansais avec la vie.',
    'Je m''accueille',
    'Je rayonne',
    'Continue à honorer cette vitalité. Elle est ton socle, ton feu sacré, ta lumière dans le monde.',
    true
  ),
  (
    'Je me sens claire et posée',
    'general',
    'Ma tête est légère, mes idées circulent doucement, sans surcharge. Je ressens une stabilité tranquille dans ma posture, et une clarté douce dans mon regard.',
    'Mon mental est apaisé. J''ai posé des limites saines, j''ai dormi suffisamment, et j''ai écouté mes priorités.',
    ARRAY['head', 'ajna'],
    'Je n''ai rien à prouver. Je suis claire, et cela suffit.',
    'Assieds-toi en silence. Pose une main sur ton front, l''autre sur ta poitrine. Respire profondément, 5 fois. Puis murmure : "Merci, mental."',
    'Je suis paisible',
    'Je suis claire',
    'Ce calme en toi est précieux. Protège-le, car il est ton filtre sacré dans un monde bruyant.',
    true
  ),
  (
    'Je me sens aimée et entourée',
    'general',
    'Je ressens une chaleur dans mon cœur, une sensation d''être portée par la vie. Les connexions avec les autres sont fluides et nourrissantes.',
    'Je suis en lien authentique avec moi-même et les autres. J''ai cultivé des relations saines et équilibrées.',
    ARRAY['heart', 'g-center'],
    'Je mérite l''amour que je reçois et celui que je donne.',
    'Place tes mains sur ton cœur. Respire en pensant à une personne qui t''aime. Sens cette chaleur se diffuser dans tout ton corps.',
    'Je reçois l''amour',
    'Je rayonne l''amour',
    'Cette connexion que tu ressens est réelle. Tu es digne d''amour, simplement parce que tu existes.',
    true
  ),
  (
    'Je me sens fière et en paix',
    'general',
    'Une sensation de plénitude m''habite. Je me sens alignée avec mes valeurs et mes actions. Je reconnais mon chemin parcouru.',
    'J''ai honoré mes engagements envers moi-même. J''ai agi en accord avec ma vérité profonde.',
    ARRAY['heart', 'g-center'],
    'Je célèbre qui je suis devenue et le chemin que j''ai parcouru.',
    'Écris trois choses dont tu es fière aujourd''hui. Lis-les à voix haute en posant la main sur ton cœur.',
    'Je reconnais ma valeur',
    'Je célèbre mon chemin',
    'Cette fierté que tu ressens est méritée. Tu as le droit d''être fière de qui tu es.',
    true
  ),
  (
    'Je me sens inspirée et connectée',
    'general',
    'Les idées affluent naturellement. Je me sens en lien avec ma créativité et mon intuition. Tout semble possible et fluide.',
    'J''ai créé l''espace pour que l''inspiration se manifeste. J''ai nourri ma connexion spirituelle.',
    ARRAY['head', 'ajna', 'throat'],
    'Je suis un canal ouvert pour la créativité et l''inspiration.',
    'Prends un carnet et écris pendant 5 minutes sans t''arrêter, laisse les mots couler librement.',
    'Je m''ouvre à l''inspiration',
    'Je laisse créer à travers moi',
    'Cette inspiration qui te traverse est un cadeau. Fais-lui confiance et laisse-la s''exprimer.',
    true
  ),
  (
    'Je me sens paisible et sereine',
    'general',
    'Une tranquillité profonde m''habite. Mon corps et mon esprit sont en harmonie. Je me sens en sécurité.',
    'J''ai cultivé ma paix intérieure. J''ai pris soin de mon environnement et de mes besoins de base.',
    ARRAY['solar-plexus', 'heart'],
    'La paix que je ressens vient de l''intérieur et m''appartient.',
    'Allonge-toi et respire profondément. À chaque expiration, relâche une tension. Reste ainsi 10 minutes.',
    'Je cultive la paix',
    'Je suis sérénité',
    'Cette paix que tu as cultivée est ton trésor. Elle t''accompagnera dans tous les défis.',
    true
  ),
  (
    'Je me sens alignée et confiante',
    'general',
    'Je ressens une cohérence entre mes pensées, mes émotions et mes actions. La confiance coule naturellement.',
    'J''ai écouté ma sagesse intérieure. J''ai fait des choix alignés avec mon essence.',
    ARRAY['g-center', 'heart'],
    'Je fais confiance à ma sagesse intérieure pour me guider.',
    'Debout, les pieds bien ancrés, répète : "Je suis alignée" en sentant cette vérité dans tout ton corps.',
    'Je m''aligne à ma vérité',
    'Je rayonne ma confiance',
    'Cette confiance que tu ressens est le fruit de ton authenticité. Continue à t''écouter.',
    true
  );

-- Insert General Category - Negative Feelings
INSERT INTO feelings (
  name,
  category,
  description,
  probable_origin,
  affected_centers,
  mirror_phrase,
  realignment_exercise,
  mantra_inhale,
  mantra_exhale,
  encouragement,
  is_positive
) VALUES
  (
    'Lourdeur diffuse',
    'general',
    'Une sensation de poids, sans raison évidente. Le corps semble freiné, ralenti. Chaque geste demande un effort supplémentaire.',
    'Possible surcharge énergétique, période prémenstruelle, ou transition lunaire. Trop d''émotions absorbées, pas assez de libération.',
    ARRAY['spleen', 'sacral'],
    'Je reconnais que mon corps me parle, et je l''écoute avec tendresse.',
    'Allonge-toi au sol, jambes pliées, pieds à plat. Pose tes mains sur ton bas-ventre. Respire lentement. Ferme les yeux et imagine que tu laisses la Terre absorber cette lourdeur. Laisse-la descendre, s''enraciner, se transmuter. Fais-le pendant 5 à 7 minutes sans rien attendre d''autre que le relâchement.',
    'Je m''ancre',
    'et je me libère',
    'Tu es dans une phase de dépose. Ce n''est ni une faiblesse, ni un arrêt : c''est une transition. Honore cette densité comme une sagesse du corps qui te demande de revenir au présent, à l''essentiel, à toi.',
    false
  ),
  (
    'Lourdeur au réveil',
    'general',
    'Difficulté à émerger le matin. Le corps est comme ancré dans le matelas. L''énergie peine à circuler.',
    'Sommeil non réparateur, cycle hormonal, ou besoin de repos plus profond.',
    ARRAY['spleen', 'root'],
    'Mon corps me demande plus de douceur dans mes réveils.',
    'Avant de te lever, étire-toi dans ton lit pendant 5 minutes. Respire profondément et remercie ton corps pour le repos.',
    'Je m''éveille en douceur',
    'Je respecte mon rythme',
    'Ton corps a ses propres rythmes. Respecte-les et il te le rendra au centuple.',
    false
  ),
  (
    'Tensions dans la poitrine',
    'general',
    'Sensation d''oppression ou de compression dans la zone du cœur. La respiration peut sembler contrainte.',
    'Émotions non exprimées, stress accumulé, ou besoin de libération émotionnelle.',
    ARRAY['heart', 'solar-plexus'],
    'Je libère ce qui pèse sur mon cœur avec compassion.',
    'Masse doucement ta poitrine en respirant profondément. Visualise une lumière dorée qui dissout les tensions.',
    'Je libère les tensions',
    'Mon cœur s''ouvre',
    'Ces tensions sont des messages. Écoute-les avec bienveillance et libère ce qui ne te sert plus.',
    false
  ),
  (
    'Brouillard mental',
    'general',
    'Difficulté à penser clairement. Les idées semblent floues, la concentration est difficile.',
    'Fatigue mentale, surcharge d''informations, ou besoin de pause cognitive.',
    ARRAY['head', 'ajna'],
    'Je m''autorise à ne pas tout comprendre maintenant.',
    'Ferme les yeux et compte tes respirations jusqu''à 20. Si tu perds le compte, recommence sans jugement.',
    'Je calme mon mental',
    'Je retrouve ma clarté',
    'Ce brouillard est temporaire. Ton mental a besoin de repos pour retrouver sa clarté naturelle.',
    false
  ),
  (
    'Sensibilité exacerbée',
    'general',
    'Tout semble plus intense. Les émotions, les sensations, les stimuli externes sont amplifiés.',
    'Phase prémenstruelle, pleine lune, ou période de transformation énergétique.',
    ARRAY['solar-plexus', 'spleen'],
    'Ma sensibilité est un don, je l''honore en me protégeant.',
    'Crée un cocon de douceur autour de toi : lumière tamisée, musique douce, vêtements confortables.',
    'J''honore ma sensibilité',
    'Je me protège avec amour',
    'Ta sensibilité est une force. Apprends à la protéger pour qu''elle reste un cadeau.',
    false
  ),
  (
    'Manque d''élan',
    'general',
    'Difficulté à initier l''action. L''énergie semble stagnante, même pour les tâches simples.',
    'Besoin de repos, phase lunaire descendante, ou nécessité de réalignement.',
    ARRAY['sacral', 'root'],
    'Je respecte les cycles de mon énergie, y compris les phases de repos.',
    'Commence par une toute petite action, puis félicite-toi. L''élan reviendra progressivement.',
    'Je respecte mon rythme',
    'L''élan reviendra',
    'Les phases de repos sont nécessaires. Ton élan reviendra quand ce sera le bon moment.',
    false
  ),
  (
    'Sensibilité au bruit',
    'general',
    'Les sons semblent plus agressifs que d''habitude. Le système nerveux est en état d''hypervigilance.',
    'Surcharge sensorielle, fatigue nerveuse, ou besoin de calme profond.',
    ARRAY['head', 'spleen'],
    'Je m''offre le silence dont j''ai besoin pour me régénérer.',
    'Trouve un endroit silencieux et reste-y 15 minutes. Utilise des bouchons d''oreilles si nécessaire.',
    'Je cherche le silence',
    'Je me régénère',
    'Ton système nerveux a besoin de calme. Offre-lui ce repos, c''est un acte d''amour envers toi.',
    false
  );

-- Insert Emotional Category - Positive Feelings
INSERT INTO feelings (
  name,
  category,
  description,
  probable_origin,
  affected_centers,
  mirror_phrase,
  realignment_exercise,
  mantra_inhale,
  mantra_exhale,
  encouragement,
  is_positive
) VALUES
  (
    'Je me sens sereine et confiante',
    'emotional',
    'Une sensation de paix intérieure m''habite. Je me sens en sécurité émotionnelle, capable de faire face aux défis avec calme.',
    'J''ai pris soin de mon équilibre émotionnel. J''ai honoré mes besoins et mes limites.',
    ARRAY['solar-plexus', 'heart'],
    'Ma sérénité est ma force tranquille, je la cultive chaque jour.',
    'Méditation de 5 minutes en visualisant une lumière dorée qui enveloppe ton cœur et ton plexus solaire.',
    'Je suis sereine',
    'Je suis confiante',
    'Cette paix intérieure est ton ancre. Reviens-y quand les vagues émotionnelles s''agitent.',
    true
  ),
  (
    'Je me sens profondément connectée',
    'emotional',
    'Mon cœur est ouvert. Je ressens une connexion authentique avec moi-même et les autres. Les émotions circulent librement.',
    'J''ai cultivé des relations nourrissantes. J''ai créé de l''espace pour l''authenticité.',
    ARRAY['heart', 'g-center'],
    'Je suis reliée à mon essence et à tout ce qui m''entoure.',
    'Place une main sur ton cœur et l''autre sur ton ventre. Respire profondément en visualisant des fils de lumière qui te relient à tout ce que tu aimes.',
    'Je suis reliée',
    'Je suis aimée',
    'Cette connexion est ta nature profonde. Elle te nourrit et te guide vers ce qui est juste pour toi.',
    true
  ),
  (
    'Je me sens émotionnellement stable',
    'emotional',
    'Mes émotions sont présentes mais équilibrées. Je peux les accueillir sans être submergée. Je me sens ancrée.',
    'J''ai développé ma capacité à être présente avec mes émotions. J''ai trouvé mon rythme.',
    ARRAY['solar-plexus', 'root'],
    'Je suis le témoin bienveillant de mes émotions, ni submergée, ni coupée.',
    'Visualise tes émotions comme des vagues sur l''océan. Observe-les monter et descendre, sans t''y identifier complètement.',
    'J''observe mes émotions',
    'Je reste stable',
    'Cette stabilité émotionnelle est un art que tu cultives. Chaque jour, tu deviens plus habile à naviguer tes marées intérieures.',
    true
  ),
  (
    'Je me sens joyeuse sans raison',
    'emotional',
    'Une joie simple et pure émane de mon être. Je me sens légère et reconnaissante. Mon cœur est en expansion.',
    'Je suis alignée avec mon essence. J''ai cultivé la gratitude et la présence.',
    ARRAY['heart', 'sacral'],
    'La joie est mon état naturel quand je suis alignée avec mon essence.',
    'Danse librement pendant 5 minutes sur une musique qui te fait sourire. Laisse ton corps exprimer cette joie sans raison.',
    'Je suis joie',
    'Je suis légèreté',
    'Cette joie sans raison est ton état naturel. Elle est toujours là, sous les nuages passagers de tes pensées et émotions.',
    true
  ),
  (
    'Je me sens créative et inspirée',
    'emotional',
    'Les émotions nourrissent ma créativité. Je me sens en connexion avec ma source d''inspiration. Les idées fluent naturellement.',
    'J''ai donné de l''espace à mon expression créative. J''ai honoré mes élans.',
    ARRAY['throat', 'sacral'],
    'Je suis un canal pour l''inspiration qui cherche à s''exprimer à travers moi.',
    'Prends un carnet et dessine ou écris pendant 10 minutes sans jugement, en laissant ta main guider le mouvement.',
    'Je m''ouvre à l''inspiration',
    'Je crée librement',
    'Ta créativité est une source intarissable. Plus tu l''honores, plus elle se déploie et t''offre ses trésors.',
    true
  );

-- Insert Emotional Category - Negative Feelings
INSERT INTO feelings (
  name,
  category,
  description,
  probable_origin,
  affected_centers,
  mirror_phrase,
  realignment_exercise,
  mantra_inhale,
  mantra_exhale,
  encouragement,
  is_positive
) VALUES
  (
    'Je ressens de l''anxiété',
    'emotional',
    'Une inquiétude diffuse m''habite. Mon mental est agité, mon corps tendu. J''ai du mal à me poser.',
    'Possible surcharge émotionnelle, changement hormonal, ou besoin de sécurité non exprimé.',
    ARRAY['solar-plexus', 'root'],
    'Mon anxiété est un signal qui mérite mon attention et ma compassion.',
    'Pratique la respiration carrée : inspire sur 4 temps, retiens sur 4 temps, expire sur 4 temps, retiens sur 4 temps. Répète pendant 5 minutes.',
    'J''accueille mon anxiété',
    'Je me détends en conscience',
    'Cette anxiété est passagère. En l''accueillant avec douceur, tu lui permets de se transformer et de te libérer son message.',
    false
  ),
  (
    'Je me sens submergée',
    'emotional',
    'Les émotions semblent trop intenses. J''ai du mal à les contenir ou à les comprendre. Tout déborde.',
    'Accumulation d''émotions non exprimées, période sensible du cycle, ou besoin de libération.',
    ARRAY['solar-plexus', 'heart'],
    'Je peux contenir mes émotions sans être submergée ni les refouler.',
    'Écris tout ce que tu ressens sur une feuille, sans censure. Ensuite, déchire-la ou brûle-la en toute sécurité comme rituel de libération.',
    'Je contiens',
    'Je libère',
    'Cette sensation de submersion est temporaire. Ton être est bien plus vaste que tes émotions, même les plus intenses.',
    false
  ),
  (
    'Je ressens de la tristesse',
    'emotional',
    'Une mélancolie profonde me traverse. Mon cœur est lourd. Les larmes sont proches.',
    'Processus de guérison en cours, phase lunaire descendante, ou besoin de douceur.',
    ARRAY['heart', 'solar-plexus'],
    'Ma tristesse est une rivière qui coule et me purifie quand je lui permets de circuler.',
    'Offre-toi un moment pour pleurer si tu en ressens le besoin. Place tes mains sur ton cœur et dis-lui : "Je t''entends, je suis là avec toi."',
    'J''honore ma tristesse',
    'Je me libère en douceur',
    'Ta tristesse est sacrée. Elle te relie à ta profondeur et à ton humanité. Laisse-la te traverser comme une vague qui finira par s''apaiser.',
    false
  ),
  (
    'Je me sens irritable',
    'emotional',
    'Une tension émotionnelle me traverse. Je suis plus réactive que d''habitude. Tout semble m''affecter.',
    'Phase prémenstruelle, fatigue émotionnelle, ou besoins non honorés.',
    ARRAY['solar-plexus', 'spleen'],
    'Mon irritabilité me signale des limites à poser ou des besoins à honorer.',
    'Frappe doucement un coussin ou crie dans un oreiller pour libérer la tension. Puis demande-toi : "De quoi ai-je vraiment besoin en ce moment ?"',
    'J''accueille ma tension',
    'J''honore mes besoins',
    'Ton irritabilité est un messager précieux. Elle te montre où tu dois être plus attentive à tes limites et à tes besoins profonds.',
    false
  ),
  (
    'Je me sens déconnectée',
    'emotional',
    'J''ai du mal à ressentir mes émotions. Je me sens comme dans une bulle, détachée de mon ressenti.',
    'Mécanisme de protection, surcharge émotionnelle, ou besoin de repos profond.',
    ARRAY['heart', 'g-center'],
    'Cette déconnexion est une protection temporaire que je peux accueillir avec douceur.',
    'Masse doucement ton corps en commençant par les pieds et en remontant lentement. À chaque zone, demande : "Que ressens-tu ici ?"',
    'Je reviens à moi',
    'Je me reconnecte en douceur',
    'Cette déconnexion est un refuge temporaire. Ton corps sait quand il sera prêt à ressentir à nouveau. Fais-lui confiance.',
    false
  );

-- Insert Physical Category - Positive Feelings
INSERT INTO feelings (
  name,
  category,
  description,
  probable_origin,
  affected_centers,
  mirror_phrase,
  realignment_exercise,
  mantra_inhale,
  mantra_exhale,
  encouragement,
  is_positive
) VALUES
  (
    'Je me sens énergique et vitale',
    'physical',
    'Mon corps est léger et plein de vitalité. Je me sens capable de tout accomplir. L''énergie circule librement.',
    'J''ai respecté mes cycles de repos et d''activité. Mon corps est bien nourri et hydraté.',
    ARRAY['sacral', 'root'],
    'Mon corps est une source d''énergie vibrante que j''honore et cultive.',
    'Fais 10 minutes de mouvement qui te fait plaisir : danse, étirements, marche rapide. Célèbre cette vitalité en mouvement.',
    'Je suis pleine d''énergie',
    'Je célèbre ma vitalité',
    'Cette énergie est ton trésor. Utilise-la avec sagesse, en alternant action et repos pour la préserver.',
    true
  ),
  (
    'Je me sens ancrée et stable',
    'physical',
    'Je ressens une connexion forte avec mon corps. Mes mouvements sont fluides et assurés. Je me sens stable.',
    'J''ai pris soin de mon ancrage. J''ai écouté les besoins de mon corps.',
    ARRAY['root', 'sacral'],
    'Je suis solidement ancrée dans mon corps et connectée à la terre.',
    'Marche pieds nus sur le sol pendant 5 minutes, en sentant consciemment chaque pas. Visualise des racines qui partent de tes pieds et s''enfoncent profondément dans la terre.',
    'Je m''ancre',
    'Je me stabilise',
    'Cet ancrage est ta fondation. Il te permet de rester stable même quand les vents soufflent fort autour de toi.',
    true
  ),
  (
    'Je me sens souple et détendue',
    'physical',
    'Mes muscles sont détendus. Je respire profondément et librement. Mon corps est dénoué.',
    'J''ai accordé du temps au mouvement doux. J''ai libéré les tensions accumulées.',
    ARRAY['sacral', 'spleen'],
    'La souplesse de mon corps reflète la fluidité de mon esprit.',
    'Fais 5 minutes d''étirements doux, en te concentrant sur ta respiration et en visualisant chaque muscle qui se relâche.',
    'Je m''assouplis',
    'Je me détends',
    'Cette souplesse est le fruit de ton attention. Continue à écouter ton corps et à lui offrir le mouvement dont il a besoin.',
    true
  ),
  (
    'Je me sens pleine de force',
    'physical',
    'Je ressens ma puissance physique. Mon corps est tonique et réactif. Je me sens capable et confiante.',
    'J''ai honoré mon besoin de mouvement. J''ai nourri ma force naturelle.',
    ARRAY['sacral', 'heart'],
    'Ma force physique est le reflet de ma force intérieure.',
    'Tiens-toi debout, pieds écartés à la largeur des hanches, et prends une posture de puissance pendant 2 minutes : redresse-toi, ouvre ta poitrine, respire profondément.',
    'Je suis forte',
    'Je suis puissante',
    'Cette force est en toi. Elle se développe chaque fois que tu choisis de l''honorer et de la cultiver.',
    true
  ),
  (
    'Je me sens parfaitement reposée',
    'physical',
    'Mon sommeil a été réparateur. Mon corps est rechargé. Je me sens fraîche et disponible.',
    'J''ai respecté mes cycles de sommeil. J''ai créé les conditions pour un repos profond.',
    ARRAY['spleen', 'root'],
    'Le repos est un acte sacré que j''honore pour nourrir mon être tout entier.',
    'Prends 10 minutes pour t''allonger et scanner ton corps des pieds à la tête, en remerciant chaque partie pour son travail.',
    'Je suis reposée',
    'Je suis régénérée',
    'Ce repos est précieux. Il te permet de te régénérer en profondeur et d''accueillir la vie avec une énergie renouvelée.',
    true
  );

-- Insert Physical Category - Negative Feelings
INSERT INTO feelings (
  name,
  category,
  description,
  probable_origin,
  affected_centers,
  mirror_phrase,
  realignment_exercise,
  mantra_inhale,
  mantra_exhale,
  encouragement,
  is_positive
) VALUES
  (
    'Je ressens de la fatigue',
    'physical',
    'Mon corps est lourd et demande du repos. Mes mouvements sont ralentis. L''énergie est basse.',
    'Possible manque de sommeil, phase du cycle menstruel, ou besoin de récupération.',
    ARRAY['sacral', 'root'],
    'Ma fatigue est un message de mon corps qui mérite d''être écouté.',
    'Offre-toi une sieste de 20 minutes ou un moment de repos allongé, sans culpabilité. Place une main sur ton ventre et respire profondément.',
    'J''honore ma fatigue',
    'Je me repose sans culpabilité',
    'Ta fatigue n''est pas une faiblesse, c''est un signal de sagesse. Ton corps te demande ce dont il a besoin pour se régénérer.',
    false
  ),
  (
    'J''ai des tensions musculaires',
    'physical',
    'Je ressens des nœuds et des raideurs. Certaines zones de mon corps sont douloureuses au toucher.',
    'Accumulation de stress physique, posture inadaptée, ou émotions stockées.',
    ARRAY['sacral', 'root'],
    'Mes tensions musculaires me parlent des stress que j''ai accumulés et que je peux maintenant libérer.',
    'Utilise une balle de tennis ou de massage pour appuyer doucement sur les zones tendues pendant 2-3 minutes chacune. Respire dans la tension pour la libérer.',
    'Je relâche les tensions',
    'Je libère mon corps',
    'Ces tensions sont des émotions et du stress cristallisés dans ton corps. En les libérant physiquement, tu libères aussi ton esprit.',
    false
  ),
  (
    'Je me sens faible',
    'physical',
    'Mon énergie est au plus bas. Les gestes simples demandent un effort. Je me sens vulnérable.',
    'Possible déséquilibre nutritionnel, phase de repos nécessaire, ou besoin de recharge.',
    ARRAY['sacral', 'spleen'],
    'Cette faiblesse temporaire m''invite à prendre soin de mes besoins fondamentaux.',
    'Hydrate-toi avec une boisson chaude nourrissante. Mange quelque chose de simple et nutritif. Repose-toi sans culpabilité.',
    'Je nourris mon corps',
    'Je restaure mon énergie',
    'Cette faiblesse est temporaire. Ton corps te demande de ralentir et de te nourrir à tous les niveaux. Écoute sa sagesse.',
    false
  ),
  (
    'J''ai des maux de tête',
    'physical',
    'Une douleur pulsatile ou sourde dans la tête. La lumière et le bruit peuvent être dérangeants.',
    'Tension nerveuse, déshydratation, ou besoin de pause mentale.',
    ARRAY['head', 'ajna'],
    'Ce mal de tête me signale un besoin de calme et d''hydratation.',
    'Bois un grand verre d''eau. Masse doucement tes tempes et ta nuque. Allonge-toi dans une pièce sombre et calme pendant 15 minutes.',
    'Je m''apaise',
    'Je me libère de la douleur',
    'Ce mal de tête est un signal. En répondant à ses besoins sous-jacents, tu retrouveras progressivement ton confort et ta clarté.',
    false
  ),
  (
    'Je ressens des douleurs articulaires',
    'physical',
    'Mes articulations sont raides ou douloureuses. Les mouvements sont limités ou inconfortables.',
    'Changement de temps, besoin de mouvement doux, ou inflammation à observer.',
    ARRAY['root', 'sacral'],
    'Mes articulations me demandent douceur et mouvement adapté.',
    'Prends un bain chaud avec des sels d''Epsom. Fais ensuite des mouvements très doux et lents pour mobiliser tes articulations sans forcer.',
    'Je bouge avec douceur',
    'Je soulage mes articulations',
    'Ces douleurs sont des messagers. Écoute ce qu''elles te disent sur ton besoin de mouvement, de repos ou d''adaptation.',
    false
  );