/*
  # Migration complète du contenu vers la base de données
  
  1. Suppression du contenu existant
    - Nettoie les données de test
  
  2. Migration complète
    - Tout le contenu de Home.tsx
    - Contenu des autres pages
    - Textes des composants
    - Messages d'erreur et de succès
    - Labels et descriptions
  
  3. Organisation par pages
    - home: Page d'accueil
    - scan: Pages de diagnostic
    - results: Page de résultats
    - dashboard: Tableau de bord
    - auth: Authentification
    - common: Éléments communs
*/

-- Nettoyer le contenu existant
DELETE FROM content_pages;

-- ========================================
-- PAGE D'ACCUEIL (HOME)
-- ========================================

INSERT INTO content_pages (page_slug, section_key, content_type, title, content, metadata, order_index) VALUES

-- Hero Section
('home', 'hero', 'hero', 
'Ressentez votre énergie profonde', 
'Explorez votre équilibre énergétique basé sur le Human Design. Un voyage intuitif pour les femmes qui souhaitent vivre en harmonie avec leur nature profonde.', 
'{"subtitle": "\"Votre corps sait. Votre énergie parle. Écoutez.\"", "cta_text": "Lancer le scan", "cta_action": "/scan"}', 1),

-- Section Pourquoi scanner
('home', 'why_scan', 'feature', 
'Pourquoi scanner ton énergie chaque jour ?', 
'Ton énergie est ton langage intérieur. Chaque tension, chaque joie, chaque fatigue est un message. Le Baromètre Énergétique t''aide à écouter ce langage subtil, à reconnaître ce qui se vit en toi, et à t''offrir l''ajustement dont tu as besoin — émotionnel, physique, mental ou spirituel.', 
'{"highlight": "✨ C''est un miroir doux, non intrusif, profondément féminin.", "icon": "heart"}', 2),

-- Section Comment ça marche
('home', 'how_it_works', 'feature', 
'Comment fonctionne le Baromètre Énergétique', 
'Un outil pensé pour les femmes qui souhaitent se reconnecter à leur essence profonde.', 
'{"subtitle": "Découvre en 3 étapes simples comment le Baromètre Énergétique t''accompagne dans ta reconnexion quotidienne.", "icon": "compass"}', 3),

-- Étapes du processus
('home', 'step_1', 'step', 
'Diagnostic intuitif', 
'Répondez à des questions simples sur votre ressenti physique, émotionnel et énergétique actuel.', 
'{"icon": "scan", "step_number": 1, "color": "primary"}', 4),

('home', 'step_2', 'step', 
'Analyse énergétique', 
'Recevez une analyse basée sur votre type Human Design et votre cycle menstruel.', 
'{"icon": "lightbulb", "step_number": 2, "color": "secondary"}', 5),

('home', 'step_3', 'step', 
'Guidance personnalisée', 
'Obtenez des conseils adaptés à votre état énergétique et suivez votre progression au fil du temps.', 
'{"icon": "heart", "step_number": 3, "color": "accent"}', 6),

-- Section Daily Energy
('home', 'daily_energy', 'feature', 
'Ton énergie quotidienne', 
'Chaque jour est unique, et ton énergie aussi. Découvre comment elle évolue et ce qu''elle te révèle sur ton chemin. Le Baromètre Énergétique t''accompagne dans cette exploration quotidienne de ton paysage intérieur.', 
'{"icon": "sun", "highlight": "🌸 Un rendez-vous quotidien avec toi-même", "cta_text": "Commencer mon scan du jour", "cta_action": "/scan", "benefits": ["Comprendre tes cycles énergétiques", "Identifier tes patterns émotionnels", "Cultiver ta connexion intérieure", "Honorer tes rythmes naturels", "Développer ton intuition", "Créer des rituels personnalisés"], "community_message": "Rejoins des milliers de femmes qui prennent soin de leur énergie chaque jour"}', 7),

-- ========================================
-- PAGE DE SCAN
-- ========================================

-- Messages d'accueil scan
('scan', 'welcome', 'hero', 
'Bienvenue dans ton espace diagnostic', 
'Prends un moment pour te poser et te connecter à ton ressenti. Choisis la catégorie que tu souhaites explorer aujourd''hui.', 
'{"cta_text": "Je suis prête à commencer", "subtitle": "Un moment rien que pour toi"}', 1),

-- Catégories de scan
('scan', 'category_general', 'feature', 
'État Général', 
'Évaluez votre ressenti global et votre énergie du moment', 
'{"icon": "sparkles", "color": "primary"}', 2),

('scan', 'category_emotional', 'feature', 
'État Émotionnel', 
'Explorez vos émotions et votre équilibre intérieur', 
'{"icon": "heart", "color": "secondary"}', 3),

('scan', 'category_physical', 'feature', 
'État Physique', 
'Écoutez les sensations de votre corps', 
'{"icon": "activity", "color": "accent"}', 4),

-- Instructions de scan
('scan', 'instructions_general', 'text', 
'Comment te sens-tu dans ton corps et ton énergie aujourd''hui ?', 
'Coche tous les ressentis qui résonnent avec ton instant présent', 
'{"subtitle": "✨ Tes ressentis sont précieux et uniques", "category": "general"}', 5),

('scan', 'instructions_emotional', 'text', 
'Comment te sens-tu émotionnellement aujourd''hui ?', 
'Prends le temps d''écouter tes émotions et de les accueillir', 
'{"subtitle": "💗 Chaque émotion que tu ressens est valide", "category": "emotional"}', 6),

('scan', 'instructions_physical', 'text', 
'Comment se sent ton corps aujourd''hui ?', 
'Prends le temps d''écouter les messages de ton corps', 
'{"subtitle": "🌱 Ton corps te parle, merci de l''écouter", "category": "physical"}', 7),

-- ========================================
-- PAGE DE RÉSULTATS
-- ========================================

('results', 'welcome', 'hero', 
'Bonjour {name} 🌸', 
'Voici ton paysage énergétique du {date}', 
'{"dynamic_content": true}', 1),

('results', 'energy_levels', 'feature', 
'Messages énergétiques', 
'', 
'{"levels": {"80-100": "Énergie florissante ✨", "60-79": "Énergie équilibrée 🌸", "40-59": "Énergie fluctuante 🌊", "20-39": "Énergie en demande 🍃", "0-19": "Énergie en repos profond 🌙"}}', 2),

('results', 'closing_message', 'text', 
'Tu es exactement là où tu dois être', 
'Continue à t''écouter avec amour.', 
'{"style": "italic", "type": "encouragement"}', 3),

-- ========================================
-- AUTHENTIFICATION
-- ========================================

('auth', 'login_title', 'text', 'Connexion', 'Accédez à votre tableau de bord énergétique', '{}', 1),
('auth', 'register_title', 'text', 'Créer un compte', 'Rejoignez notre communauté de femmes conscientes', '{}', 2),
('auth', 'forgot_password', 'text', 'Mot de passe oublié ?', '', '{}', 3),
('auth', 'no_account', 'text', 'Pas encore de compte ? Créez-en un', '', '{}', 4),
('auth', 'have_account', 'text', 'Déjà un compte ? Connectez-vous', '', '{}', 5),

-- ========================================
-- DASHBOARD
-- ========================================

('dashboard', 'welcome', 'hero', 
'Bienvenue, {name}', 
'Voici ton tableau de bord énergétique personnalisé', 
'{"dynamic_content": true}', 1),

('dashboard', 'new_scan_cta', 'cta', 
'Nouveau scan énergétique', 
'', 
'{"action": "/scan", "icon": "sparkles"}', 2),

('dashboard', 'refresh_cta', 'cta', 
'Actualiser', 
'', 
'{"action": "refresh", "icon": "refresh"}', 3),

-- ========================================
-- MESSAGES COMMUNS
-- ========================================

('common', 'loading', 'text', 'Chargement...', '', '{}', 1),
('common', 'error_generic', 'text', 'Une erreur est survenue', 'Veuillez réessayer plus tard', '{}', 2),
('common', 'success_generic', 'text', 'Opération réussie', '', '{}', 3),
('common', 'cancel', 'text', 'Annuler', '', '{}', 4),
('common', 'save', 'text', 'Sauvegarder', '', '{}', 5),
('common', 'continue', 'text', 'Continuer', '', '{}', 6),
('common', 'back', 'text', 'Retour', '', '{}', 7),

-- ========================================
-- NAVIGATION
-- ========================================

('nav', 'home', 'text', 'Accueil', '', '{}', 1),
('nav', 'scan', 'text', 'Diagnostic', '', '{}', 2),
('nav', 'dashboard', 'text', 'Tableau de Bord', '', '{}', 3),
('nav', 'about', 'text', 'À propos', '', '{}', 4),
('nav', 'profile', 'text', 'Mon profil', '', '{}', 5),
('nav', 'settings', 'text', 'Paramètres', '', '{}', 6),
('nav', 'logout', 'text', 'Déconnexion', '', '{}', 7),

-- ========================================
-- TYPES HUMAN DESIGN
-- ========================================

('hd_types', 'generator', 'text', 
'Generator', 
'Tu as une énergie vitale constante et créatrice. Tu réponds aux opportunités qui se présentent.', 
'{"characteristics": ["Énergie sacrale", "Réponse gut feeling", "Endurance naturelle"]}', 1),

('hd_types', 'projector', 'text', 
'Projector', 
'Tu es un guide naturel avec une capacité unique à voir les autres et les systèmes.', 
'{"characteristics": ["Sagesse intuitive", "Besoin de reconnaissance", "Énergie focalisée"]}', 2),

('hd_types', 'manifesting-generator', 'text', 
'Manifesting Generator', 
'Tu combines l''énergie du Generator avec la capacité d''initiation du Manifestor.', 
'{"characteristics": ["Multi-passionné", "Énergie rapide", "Capacité de manifestation"]}', 3),

('hd_types', 'manifestor', 'text', 
'Manifestor', 
'Tu es un initiateur naturel avec la capacité de créer et d''impacter.', 
'{"characteristics": ["Énergie d''initiation", "Indépendance", "Impact sur les autres"]}', 4),

('hd_types', 'reflector', 'text', 
'Reflector', 
'Tu es un miroir de ton environnement avec une sagesse cyclique unique.', 
'{"characteristics": ["Sensibilité environnementale", "Sagesse lunaire", "Perspective unique"]}', 5);