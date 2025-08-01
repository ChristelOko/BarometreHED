/*
  # Migration pour ajouter tous les textes codés en dur

  1. Messages système
    - Messages d'erreur
    - Messages de succès  
    - Messages de chargement
  
  2. Navigation et interface
    - Menus de navigation
    - Boutons et actions
    - Labels de formulaires
  
  3. Contenu métier
    - Centres HD et descriptions
    - Niveaux d'énergie
    - Catégories de scan
*/

-- Messages système - Erreurs
INSERT INTO content_pages (page_slug, section_key, content_type, title, content, metadata, order_index) VALUES
('system', 'error_content_loading', 'text', 'Erreur de chargement', 'Erreur lors du chargement du contenu', '{}', 10),
('system', 'error_category_scores', 'text', 'Erreur scores', 'Erreur lors du chargement des scores par catégorie', '{}', 11),
('system', 'error_data_loading', 'text', 'Erreur données', 'Erreur lors du chargement des données', '{}', 12),

-- Messages système - Succès
('system', 'success_logout', 'text', 'Déconnexion', 'Déconnexion réussie', '{}', 20),
('system', 'success_perfect', 'text', 'Parfait', 'Parfait ! 🌸', '{}', 21),

-- Messages système - Chargement
('system', 'loading_energy_harmonization', 'text', 'Harmonisation', 'Harmonisation des énergies...', '{}', 30),
('system', 'loading_daily_energy', 'text', 'Énergie du jour', 'Chargement de l''énergie du jour...', '{}', 31),

-- Navigation principale
('navigation', 'home', 'text', 'Accueil', 'Accueil', '{}', 10),
('navigation', 'scan', 'text', 'Diagnostic', 'Diagnostic', '{}', 11),
('navigation', 'dashboard', 'text', 'Tableau de Bord', 'Tableau de Bord', '{}', 12),
('navigation', 'about', 'text', 'À propos', 'À propos', '{}', 13),
('navigation', 'login', 'text', 'Connexion', 'Connexion', '{}', 14),

-- Catégories de scan
('categories', 'general', 'text', 'Général', 'Général', '{}', 1),
('categories', 'emotional', 'text', 'Émotionnel', 'Émotionnel', '{}', 2),
('categories', 'physical', 'text', 'Physique', 'Physique', '{}', 3),

-- Dashboard - Titres et labels
('dashboard', 'category_scores_title', 'text', 'Résultats par dimension', 'Résultats par dimension', '{}', 1),
('dashboard', 'center_frequency_title', 'text', 'Centres HD actifs', 'Centres HD les plus actifs', '{}', 2),
('dashboard', 'energy_trend_title', 'text', 'Tendance énergétique', 'Tendance énergétique', '{}', 3),
('dashboard', 'recent_scans_balanced', 'text', 'Énergie équilibrée', 'Énergie équilibrée', '{}', 4),
('dashboard', 'no_scan', 'text', 'Aucun scan', 'Aucun scan', '{}', 5),
('dashboard', 'no_data', 'text', 'Aucune donnée', 'Aucune donnée disponible', '{}', 6),
('dashboard', 'status', 'text', 'Statut', 'Statut', '{}', 7),

-- Dashboard - Statistiques
('dashboard', 'stats_average_score', 'text', 'Score moyen', 'Score moyen', '{}', 10),
('dashboard', 'stats_main_center', 'text', 'Centre principal', 'Centre principal', '{}', 11),
('dashboard', 'stats_trend', 'text', 'Tendance', 'Tendance', '{}', 12),
('dashboard', 'average_score_label', 'text', 'Score énergétique moyen', 'Score énergétique moyen', '{}', 13),

-- Dashboard - Tendances
('dashboard', 'trend_improving', 'text', 'En amélioration', 'En amélioration', '{}', 20),
('dashboard', 'trend_declining', 'text', 'En diminution', 'En diminution', '{}', 21),
('dashboard', 'trend_stable', 'text', 'Stable', 'Stable', '{}', 22),

-- Centres HD - Noms
('hd_centers', 'throat', 'text', 'Gorge', 'Gorge', '{}', 1),
('hd_centers', 'heart', 'text', 'Cœur', 'Cœur', '{}', 2),
('hd_centers', 'solar_plexus', 'text', 'Plexus Solaire', 'Plexus Solaire', '{}', 3),
('hd_centers', 'sacral', 'text', 'Sacral', 'Sacral', '{}', 4),
('hd_centers', 'root', 'text', 'Racine', 'Racine', '{}', 5),
('hd_centers', 'spleen', 'text', 'Rate', 'Rate', '{}', 6),
('hd_centers', 'g_center', 'text', 'G-Center', 'G-Center', '{}', 7),
('hd_centers', 'ajna', 'text', 'Ajna', 'Ajna', '{}', 8),
('hd_centers', 'head', 'text', 'Tête', 'Tête', '{}', 9),

-- Centres HD - Descriptions
('hd_centers', 'throat_desc', 'text', 'Communication', 'Communication, expression, manifestation', '{}', 11),
('hd_centers', 'heart_desc', 'text', 'Volonté', 'Volonté, détermination, vitalité', '{}', 12),
('hd_centers', 'solar_plexus_desc', 'text', 'Émotions', 'Émotions, sensibilité, intuition', '{}', 13),
('hd_centers', 'sacral_desc', 'text', 'Énergie vitale', 'Énergie vitale, créativité, sexualité', '{}', 14),
('hd_centers', 'root_desc', 'text', 'Stress', 'Stress, pression, survie', '{}', 15),
('hd_centers', 'spleen_desc', 'text', 'Intuition', 'Intuition, système immunitaire, peur', '{}', 16),
('hd_centers', 'g_center_desc', 'text', 'Identité', 'Identité, amour, direction', '{}', 17),
('hd_centers', 'ajna_desc', 'text', 'Mental', 'Mental, conceptualisation, certitude', '{}', 18),
('hd_centers', 'head_desc', 'text', 'Inspiration', 'Inspiration, questions, pression mentale', '{}', 19),

-- Niveaux d'énergie
('energy_levels', 'flourishing', 'text', 'Florissante', 'Énergie florissante ✨', '{}', 1),
('energy_levels', 'balanced', 'text', 'Équilibrée', 'Énergie équilibrée 🌸', '{}', 2),
('energy_levels', 'fluctuating', 'text', 'Fluctuante', 'Énergie fluctuante 🌊', '{}', 3),
('energy_levels', 'demanding', 'text', 'En demande', 'Énergie en demande 🍃', '{}', 4),
('energy_levels', 'resting', 'text', 'En repos', 'Énergie en repos profond 🌙', '{}', 5),

-- Éléments HD
('hd_elements', 'ether', 'text', 'Éther', 'Éther', '{}', 1),
('hd_elements', 'fire', 'text', 'Feu', 'Feu', '{}', 2),
('hd_elements', 'water', 'text', 'Eau', 'Eau', '{}', 3),
('hd_elements', 'earth', 'text', 'Terre', 'Terre', '{}', 4),
('hd_elements', 'air', 'text', 'Air', 'Air', '{}', 5),
('hd_elements', 'balance', 'text', 'Équilibre', 'Équilibre', '{}', 6),

-- Pratiques HD
('hd_practices', 'voice_expression', 'text', 'Expression vocale', 'Exprimer ses vérités à voix haute, journaling, chanter', '{}', 1),
('hd_practices', 'fire_meditation', 'text', 'Méditation du feu', 'Méditation sur la flamme, respiration de feu, activité physique', '{}', 2),
('hd_practices', 'water_connection', 'text', 'Connexion à l''eau', 'Bain de reconnexion, hydratation consciente, moontime', '{}', 3),
('hd_practices', 'earth_grounding', 'text', 'Ancrage terrestre', 'Marche pieds nus, jardinage, visualisation d''ancrage', '{}', 4),
('hd_practices', 'air_breathing', 'text', 'Respiration', 'Respiration alternée, visualisation, yoga', '{}', 5),
('hd_practices', 'balance_practice', 'text', 'Pratique équilibrante', 'Pratique équilibrante, repos, reconnexion à soi', '{}', 6),

-- Pages principales - Titres
('about', 'page_title', 'text', 'À propos', 'À propos du Baromètre Énergétique', '{}', 1),
('contact', 'page_title', 'text', 'Contact', 'Contactez-nous', '{}', 1),
('help', 'page_title', 'text', 'Aide', 'Centre d''aide', '{}', 1),
('legal', 'page_title', 'text', 'Mentions légales', 'Mentions légales', '{}', 1),
('profile', 'page_title', 'text', 'Profil', 'Mon Profil', '{}', 1),
('settings', 'page_title', 'text', 'Paramètres', 'Paramètres', '{}', 1),

-- Scan - Interface
('scan', 'general_title', 'text', 'État Général', '✨ État Général', '{}', 1),
('scan', 'emotional_title', 'text', 'État Émotionnel', '💗 État Émotionnel', '{}', 2),
('scan', 'physical_title', 'text', 'État Physique', '🌱 État Physique', '{}', 3),
('scan', 'general_subtitle', 'text', 'Ressenti global', '🌟 Comment te sens-tu dans ton corps et ton énergie aujourd''hui ?', '{}', 4),
('scan', 'emotional_subtitle', 'text', 'Ressenti émotionnel', '🌸 Comment te sens-tu émotionnellement aujourd''hui ?', '{}', 5),
('scan', 'physical_subtitle', 'text', 'Ressenti physique', '🌸 Comment se sent ton corps aujourd''hui ?', '{}', 6),

-- Scan - Sections de ressentis
('scan', 'positive_feelings', 'text', 'Ressentis positifs', '🌸 Ressentis positifs', '{}', 10),
('scan', 'negative_feelings', 'text', 'Ressentis à observer', '🍂 Ressentis à observer', '{}', 11),
('scan', 'validate_button', 'text', 'Valider', 'Valider mes ressentis', '{}', 12),
('scan', 'feelings_precious', 'text', 'Ressentis précieux', '✨ Tes ressentis sont précieux et uniques', '{}', 13),
('scan', 'emotions_valid', 'text', 'Émotions valides', '💗 Chaque émotion que tu ressens est valide', '{}', 14),
('scan', 'body_speaks', 'text', 'Corps qui parle', '🌱 Ton corps te parle, merci de l''écouter', '{}', 15),

-- Résultats - Interface
('results', 'welcome_hello', 'text', 'Bonjour', 'Bonjour', '{}', 1),
('results', 'energy_landscape', 'text', 'Paysage énergétique', 'Voici ton paysage énergétique du', '{}', 2),
('results', 'guidance_card_title', 'text', 'Carte de Guidance', 'Carte de Guidance', '{}', 3),
('results', 'feelings_analysis', 'text', 'Analyse des ressentis', '📝 Analyse détaillée de tes ressentis', '{}', 4),
('results', 'view_dashboard', 'text', 'Voir tableau de bord', 'Voir mon tableau de bord', '{}', 5),
('results', 'new_scan', 'text', 'Nouveau scan', 'Refaire un scan', '{}', 6),
('results', 'share_results', 'text', 'Partager', 'Partager mes résultats', '{}', 7),
('results', 'closing_message', 'text', 'Message de clôture', 'Tu es exactement là où tu dois être. Continue à t''écouter avec amour.', '{}', 8),

-- Home - Daily Energy
('home', 'daily_energy_title', 'text', 'Énergie du jour', 'Ton énergie quotidienne', '{}', 10),
('home', 'daily_energy_day', 'text', 'Énergie du jour', 'Énergie du jour', '{}', 11),
('home', 'daily_energy_month', 'text', 'Énergie du mois', 'Énergie du mois', '{}', 12),
('home', 'daily_energy_year', 'text', 'Énergie de l''année', 'Énergie de l''année', '{}', 13),
('home', 'daily_message', 'text', 'Message du jour', 'Message du jour', '{}', 14),
('home', 'daily_mantra', 'text', 'Mantra du jour', 'Mantra du jour', '{}', 15),
('home', 'ready_explore', 'text', 'Prête à explorer', 'Prête à explorer ton énergie personnelle aujourd''hui ?', '{}', 16),
('home', 'scan_cta', 'text', 'Faire mon scan', 'Faire mon scan énergétique', '{}', 17),
('home', 'connect_energy', 'text', 'Connecte-toi', '✨ Connecte-toi à ton énergie unique et découvre ce qu''elle te révèle', '{}', 18)

ON CONFLICT (page_slug, section_key, order_index) WHERE is_active = true DO NOTHING;