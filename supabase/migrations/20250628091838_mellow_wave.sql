/*
  # Add translation keys for dashboard and results

  1. New Tables
    - None (using existing translation tables)
  
  2. New Data
    - Add translation keys for dashboard components
    - Add translation keys for results components
    - Add translation keys for scan components
    - Add translation keys for HD centers
    
  3. Security
    - No changes to security policies
*/

-- First, ensure we have the necessary categories
INSERT INTO translation_categories (name, description)
VALUES 
  ('dashboard', 'Dashboard page and components translations')
ON CONFLICT (name) DO NOTHING;

INSERT INTO translation_categories (name, description)
VALUES 
  ('results', 'Results page and components translations')
ON CONFLICT (name) DO NOTHING;

INSERT INTO translation_categories (name, description)
VALUES 
  ('scan', 'Scan page and components translations')
ON CONFLICT (name) DO NOTHING;

INSERT INTO translation_categories (name, description)
VALUES 
  ('hd_centers', 'Human Design centers translations')
ON CONFLICT (name) DO NOTHING;

INSERT INTO translation_categories (name, description)
VALUES 
  ('energy_levels', 'Energy levels translations')
ON CONFLICT (name) DO NOTHING;

-- Get category IDs
DO $$
DECLARE
  dashboard_category_id uuid;
  results_category_id uuid;
  scan_category_id uuid;
  hd_centers_category_id uuid;
  energy_levels_category_id uuid;
  fr_language_id uuid;
  en_language_id uuid;
  ind_language_id uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO dashboard_category_id FROM translation_categories WHERE name = 'dashboard';
  SELECT id INTO results_category_id FROM translation_categories WHERE name = 'results';
  SELECT id INTO scan_category_id FROM translation_categories WHERE name = 'scan';
  SELECT id INTO hd_centers_category_id FROM translation_categories WHERE name = 'hd_centers';
  SELECT id INTO energy_levels_category_id FROM translation_categories WHERE name = 'energy_levels';
  
  -- Get language IDs
  SELECT id INTO fr_language_id FROM languages WHERE code = 'FR';
  SELECT id INTO en_language_id FROM languages WHERE code = 'EN';
  SELECT id INTO ind_language_id FROM languages WHERE code = 'IND';
  
  -- Dashboard translation keys
  INSERT INTO translation_keys (key, description, category_id)
  VALUES 
    ('dashboard.welcome', 'Welcome message with user name', dashboard_category_id),
    ('dashboard.subtitle', 'Dashboard subtitle', dashboard_category_id),
    ('dashboard.category_scores.title', 'Category scores section title', dashboard_category_id),
    ('dashboard.score_status.good', 'Good score status', dashboard_category_id),
    ('dashboard.score_status.average', 'Average score status', dashboard_category_id),
    ('dashboard.score_status.low', 'Low score status', dashboard_category_id),
    ('dashboard.score_status.very_low', 'Very low score status', dashboard_category_id),
    ('dashboard.status', 'Status label', dashboard_category_id),
    ('dashboard.no_scan', 'No scan message', dashboard_category_id),
    ('dashboard.no_data', 'No data message', dashboard_category_id),
    ('dashboard.loading', 'Loading message', dashboard_category_id),
    ('dashboard.energy_trend.title', 'Energy trend section title', dashboard_category_id),
    ('dashboard.energy_trend.average_score', 'Average energy score label', dashboard_category_id),
    ('dashboard.trends.improving', 'Improving trend label', dashboard_category_id),
    ('dashboard.trends.declining', 'Declining trend label', dashboard_category_id),
    ('dashboard.trends.stable', 'Stable trend label', dashboard_category_id),
    ('dashboard.center_frequency.title', 'Center frequency section title', dashboard_category_id),
    ('dashboard.recent_scans.balanced_energy', 'Balanced energy label', dashboard_category_id),
    ('dashboard.stats.average_score', 'Average score label', dashboard_category_id),
    ('dashboard.stats.main_center', 'Main center label', dashboard_category_id),
    ('dashboard.stats.trend', 'Trend label', dashboard_category_id),
    ('dashboard.energy_state.title', 'Energy state section title', dashboard_category_id),
    ('dashboard.new_scan', 'New scan button label', dashboard_category_id),
    ('dashboard.refresh', 'Refresh button label', dashboard_category_id),
    ('dashboard.tabs.overview', 'Overview tab label', dashboard_category_id),
    ('dashboard.tabs.history', 'History tab label', dashboard_category_id),
    ('dashboard.tabs.analytics', 'Analytics tab label', dashboard_category_id),
    ('dashboard.tabs.reminders', 'Reminders tab label', dashboard_category_id)
  ON CONFLICT (key) DO NOTHING;
  
  -- Results translation keys
  INSERT INTO translation_keys (key, description, category_id)
  VALUES 
    ('results.welcome', 'Welcome message with user name', results_category_id),
    ('results.date', 'Date message', results_category_id),
    ('results.guidance_card', 'Guidance card title', results_category_id),
    ('results.affected_centers', 'Affected centers title', results_category_id),
    ('results.feelings_analysis', 'Feelings analysis title', results_category_id),
    ('results.positive_feelings', 'Positive feelings title', results_category_id),
    ('results.negative_feelings', 'Negative feelings title', results_category_id),
    ('results.no_feelings', 'No feelings message', results_category_id),
    ('results.personalized_insights', 'Personalized insights title', results_category_id),
    ('results.guidance.mantra', 'Mantra section title', results_category_id),
    ('results.guidance.exercise', 'Exercise section title', results_category_id),
    ('results.guidance.intention', 'Intention section title', results_category_id),
    ('results.view_dashboard', 'View dashboard button label', results_category_id),
    ('results.new_scan', 'New scan button label', results_category_id),
    ('results.share_results', 'Share results button label', results_category_id),
    ('results.daily_tirage', 'Daily energy reading button label', results_category_id),
    ('results.closing_message', 'Closing message', results_category_id)
  ON CONFLICT (key) DO NOTHING;
  
  -- Scan translation keys
  INSERT INTO translation_keys (key, description, category_id)
  VALUES 
    ('scan.welcome.title', 'Welcome title', scan_category_id),
    ('scan.welcome.subtitle', 'Welcome subtitle', scan_category_id),
    ('scan.welcome.cta', 'Welcome call to action', scan_category_id),
    ('scan.category.selection', 'Category selection title', scan_category_id),
    ('scan.category.general', 'General category name', scan_category_id),
    ('scan.category.emotional', 'Emotional category name', scan_category_id),
    ('scan.category.physical', 'Physical category name', scan_category_id),
    ('scan.category.general.question', 'General category question', scan_category_id),
    ('scan.category.emotional.question', 'Emotional category question', scan_category_id),
    ('scan.category.physical.question', 'Physical category question', scan_category_id),
    ('scan.category.general.instruction', 'General category instruction', scan_category_id),
    ('scan.category.emotional.instruction', 'Emotional category instruction', scan_category_id),
    ('scan.category.physical.instruction', 'Physical category instruction', scan_category_id),
    ('scan.back_to_categories', 'Back to categories link', scan_category_id),
    ('scan.show_descriptions', 'Show descriptions button', scan_category_id),
    ('scan.hide_descriptions', 'Hide descriptions button', scan_category_id),
    ('scan.validate_feelings', 'Validate feelings button', scan_category_id),
    ('scan.feelings_value', 'Feelings value message', scan_category_id),
    ('scan.emotions_value', 'Emotions value message', scan_category_id),
    ('scan.body_value', 'Body value message', scan_category_id)
  ON CONFLICT (key) DO NOTHING;
  
  -- HD centers translation keys
  INSERT INTO translation_keys (key, description, category_id)
  VALUES 
    ('hd_centers.throat', 'Throat center name', hd_centers_category_id),
    ('hd_centers.heart', 'Heart center name', hd_centers_category_id),
    ('hd_centers.solar_plexus', 'Solar plexus center name', hd_centers_category_id),
    ('hd_centers.sacral', 'Sacral center name', hd_centers_category_id),
    ('hd_centers.root', 'Root center name', hd_centers_category_id),
    ('hd_centers.spleen', 'Spleen center name', hd_centers_category_id),
    ('hd_centers.g_center', 'G center name', hd_centers_category_id),
    ('hd_centers.ajna', 'Ajna center name', hd_centers_category_id),
    ('hd_centers.head', 'Head center name', hd_centers_category_id),
    ('hd_centers.throat.desc', 'Throat center description', hd_centers_category_id),
    ('hd_centers.heart.desc', 'Heart center description', hd_centers_category_id),
    ('hd_centers.solar_plexus.desc', 'Solar plexus center description', hd_centers_category_id),
    ('hd_centers.sacral.desc', 'Sacral center description', hd_centers_category_id),
    ('hd_centers.root.desc', 'Root center description', hd_centers_category_id),
    ('hd_centers.spleen.desc', 'Spleen center description', hd_centers_category_id),
    ('hd_centers.g_center.desc', 'G center description', hd_centers_category_id),
    ('hd_centers.ajna.desc', 'Ajna center description', hd_centers_category_id),
    ('hd_centers.head.desc', 'Head center description', hd_centers_category_id)
  ON CONFLICT (key) DO NOTHING;
  
  -- Energy levels translation keys
  INSERT INTO translation_keys (key, description, category_id)
  VALUES 
    ('energy_levels.flourishing', 'Flourishing energy level', energy_levels_category_id),
    ('energy_levels.balanced', 'Balanced energy level', energy_levels_category_id),
    ('energy_levels.fluctuating', 'Fluctuating energy level', energy_levels_category_id),
    ('energy_levels.demanding', 'Demanding energy level', energy_levels_category_id),
    ('energy_levels.resting', 'Resting energy level', energy_levels_category_id)
  ON CONFLICT (key) DO NOTHING;
  
  -- Add French translations
  IF fr_language_id IS NOT NULL THEN
    -- Dashboard translations
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Bienvenue, {name}'
    FROM translation_keys k WHERE k.key = 'dashboard.welcome'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Voici ton tableau de bord énergétique personnalisé'
    FROM translation_keys k WHERE k.key = 'dashboard.subtitle'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Résultats par dimension'
    FROM translation_keys k WHERE k.key = 'dashboard.category_scores.title'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Bon'
    FROM translation_keys k WHERE k.key = 'dashboard.score_status.good'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Moyen'
    FROM translation_keys k WHERE k.key = 'dashboard.score_status.average'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Faible'
    FROM translation_keys k WHERE k.key = 'dashboard.score_status.low'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Très faible'
    FROM translation_keys k WHERE k.key = 'dashboard.score_status.very_low'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Statut'
    FROM translation_keys k WHERE k.key = 'dashboard.status'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Aucun scan'
    FROM translation_keys k WHERE k.key = 'dashboard.no_scan'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Aucune donnée disponible'
    FROM translation_keys k WHERE k.key = 'dashboard.no_data'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Chargement des scores...'
    FROM translation_keys k WHERE k.key = 'dashboard.loading'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Tendance énergétique'
    FROM translation_keys k WHERE k.key = 'dashboard.energy_trend.title'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Score énergétique moyen'
    FROM translation_keys k WHERE k.key = 'dashboard.energy_trend.average_score'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'En amélioration'
    FROM translation_keys k WHERE k.key = 'dashboard.trends.improving'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'En diminution'
    FROM translation_keys k WHERE k.key = 'dashboard.trends.declining'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Stable'
    FROM translation_keys k WHERE k.key = 'dashboard.trends.stable'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Centres HD les plus actifs'
    FROM translation_keys k WHERE k.key = 'dashboard.center_frequency.title'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Énergie équilibrée'
    FROM translation_keys k WHERE k.key = 'dashboard.recent_scans.balanced_energy'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Score moyen'
    FROM translation_keys k WHERE k.key = 'dashboard.stats.average_score'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Centre principal'
    FROM translation_keys k WHERE k.key = 'dashboard.stats.main_center'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Tendance'
    FROM translation_keys k WHERE k.key = 'dashboard.stats.trend'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'État énergétique actuel'
    FROM translation_keys k WHERE k.key = 'dashboard.energy_state.title'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Nouveau scan énergétique'
    FROM translation_keys k WHERE k.key = 'dashboard.new_scan'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Actualiser'
    FROM translation_keys k WHERE k.key = 'dashboard.refresh'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Aperçu'
    FROM translation_keys k WHERE k.key = 'dashboard.tabs.overview'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Historique'
    FROM translation_keys k WHERE k.key = 'dashboard.tabs.history'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Analyses'
    FROM translation_keys k WHERE k.key = 'dashboard.tabs.analytics'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Rappels'
    FROM translation_keys k WHERE k.key = 'dashboard.tabs.reminders'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    -- Results translations
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Bonjour {name} 🌸'
    FROM translation_keys k WHERE k.key = 'results.welcome'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Voici ton paysage énergétique du {date}'
    FROM translation_keys k WHERE k.key = 'results.date'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Carte de Guidance'
    FROM translation_keys k WHERE k.key = 'results.guidance_card'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Centres HD affectés'
    FROM translation_keys k WHERE k.key = 'results.affected_centers'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Analyse détaillée de tes ressentis'
    FROM translation_keys k WHERE k.key = 'results.feelings_analysis'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Ressentis positifs'
    FROM translation_keys k WHERE k.key = 'results.positive_feelings'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Ressentis à observer'
    FROM translation_keys k WHERE k.key = 'results.negative_feelings'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Aucun ressenti sélectionné à analyser.'
    FROM translation_keys k WHERE k.key = 'results.no_feelings'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Insights personnalisés'
    FROM translation_keys k WHERE k.key = 'results.personalized_insights'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Mantra'
    FROM translation_keys k WHERE k.key = 'results.guidance.mantra'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Exercice de réalignement'
    FROM translation_keys k WHERE k.key = 'results.guidance.exercise'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Intention'
    FROM translation_keys k WHERE k.key = 'results.guidance.intention'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Voir mon tableau de bord'
    FROM translation_keys k WHERE k.key = 'results.view_dashboard'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Refaire un scan'
    FROM translation_keys k WHERE k.key = 'results.new_scan'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Partager mes résultats'
    FROM translation_keys k WHERE k.key = 'results.share_results'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Tirage énergétique du jour'
    FROM translation_keys k WHERE k.key = 'results.daily_tirage'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, '"Tu es exactement là où tu dois être. Continue à t''écouter avec amour."'
    FROM translation_keys k WHERE k.key = 'results.closing_message'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    -- Scan translations
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Bienvenue dans ton espace diagnostic'
    FROM translation_keys k WHERE k.key = 'scan.welcome.title'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Prends un moment pour te poser et te connecter à ton ressenti. Choisis la catégorie que tu souhaites explorer aujourd''hui.'
    FROM translation_keys k WHERE k.key = 'scan.welcome.subtitle'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Je suis prête à commencer'
    FROM translation_keys k WHERE k.key = 'scan.welcome.cta'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Quelle dimension souhaites-tu explorer ?'
    FROM translation_keys k WHERE k.key = 'scan.category.selection'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'État Général'
    FROM translation_keys k WHERE k.key = 'scan.category.general'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'État Émotionnel'
    FROM translation_keys k WHERE k.key = 'scan.category.emotional'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'État Physique'
    FROM translation_keys k WHERE k.key = 'scan.category.physical'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Comment te sens-tu dans ton corps et ton énergie aujourd''hui ?'
    FROM translation_keys k WHERE k.key = 'scan.category.general.question'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Comment te sens-tu émotionnellement aujourd''hui ?'
    FROM translation_keys k WHERE k.key = 'scan.category.emotional.question'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Comment se sent ton corps aujourd''hui ?'
    FROM translation_keys k WHERE k.key = 'scan.category.physical.question'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Coche tous les ressentis qui résonnent avec ton instant présent'
    FROM translation_keys k WHERE k.key = 'scan.category.general.instruction'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Prends le temps d''écouter tes émotions et de les accueillir'
    FROM translation_keys k WHERE k.key = 'scan.category.emotional.instruction'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Prends le temps d''écouter les messages de ton corps'
    FROM translation_keys k WHERE k.key = 'scan.category.physical.instruction'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Retour aux catégories'
    FROM translation_keys k WHERE k.key = 'scan.back_to_categories'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Afficher les descriptions'
    FROM translation_keys k WHERE k.key = 'scan.show_descriptions'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Masquer les descriptions'
    FROM translation_keys k WHERE k.key = 'scan.hide_descriptions'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Valider mes ressentis'
    FROM translation_keys k WHERE k.key = 'scan.validate_feelings'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Tes ressentis sont précieux et uniques'
    FROM translation_keys k WHERE k.key = 'scan.feelings_value'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Chaque émotion que tu ressens est valide'
    FROM translation_keys k WHERE k.key = 'scan.emotions_value'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Ton corps te parle, merci de l''écouter'
    FROM translation_keys k WHERE k.key = 'scan.body_value'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    -- HD centers translations
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Centre de la Gorge'
    FROM translation_keys k WHERE k.key = 'hd_centers.throat'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Centre du Cœur'
    FROM translation_keys k WHERE k.key = 'hd_centers.heart'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Plexus Solaire'
    FROM translation_keys k WHERE k.key = 'hd_centers.solar_plexus'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Centre Sacral'
    FROM translation_keys k WHERE k.key = 'hd_centers.sacral'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Centre Racine'
    FROM translation_keys k WHERE k.key = 'hd_centers.root'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Centre de la Rate'
    FROM translation_keys k WHERE k.key = 'hd_centers.spleen'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Centre G (Identité)'
    FROM translation_keys k WHERE k.key = 'hd_centers.g_center'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Centre Ajna'
    FROM translation_keys k WHERE k.key = 'hd_centers.ajna'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Centre de la Tête'
    FROM translation_keys k WHERE k.key = 'hd_centers.head'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Communication, expression, manifestation'
    FROM translation_keys k WHERE k.key = 'hd_centers.throat.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Volonté, détermination, vitalité'
    FROM translation_keys k WHERE k.key = 'hd_centers.heart.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Émotions, sensibilité, intuition'
    FROM translation_keys k WHERE k.key = 'hd_centers.solar_plexus.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Énergie vitale, créativité, sexualité'
    FROM translation_keys k WHERE k.key = 'hd_centers.sacral.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Stress, pression, survie'
    FROM translation_keys k WHERE k.key = 'hd_centers.root.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Intuition, système immunitaire, peur'
    FROM translation_keys k WHERE k.key = 'hd_centers.spleen.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Identité, amour, direction'
    FROM translation_keys k WHERE k.key = 'hd_centers.g_center.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Mental, conceptualisation, certitude'
    FROM translation_keys k WHERE k.key = 'hd_centers.ajna.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Inspiration, questions, pression mentale'
    FROM translation_keys k WHERE k.key = 'hd_centers.head.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    -- Energy levels translations
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Énergie florissante ✨'
    FROM translation_keys k WHERE k.key = 'energy_levels.flourishing'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Énergie équilibrée 🌸'
    FROM translation_keys k WHERE k.key = 'energy_levels.balanced'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Énergie fluctuante 🌊'
    FROM translation_keys k WHERE k.key = 'energy_levels.fluctuating'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Énergie en demande 🍃'
    FROM translation_keys k WHERE k.key = 'energy_levels.demanding'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, fr_language_id, 'Énergie en repos profond 🌙'
    FROM translation_keys k WHERE k.key = 'energy_levels.resting'
    ON CONFLICT (key_id, language_id) DO NOTHING;
  END IF;
  
  -- Add English translations if English language exists
  IF en_language_id IS NOT NULL THEN
    -- Dashboard translations
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Welcome, {name}'
    FROM translation_keys k WHERE k.key = 'dashboard.welcome'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Here is your personalized energy dashboard'
    FROM translation_keys k WHERE k.key = 'dashboard.subtitle'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Results by dimension'
    FROM translation_keys k WHERE k.key = 'dashboard.category_scores.title'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Good'
    FROM translation_keys k WHERE k.key = 'dashboard.score_status.good'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Average'
    FROM translation_keys k WHERE k.key = 'dashboard.score_status.average'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Low'
    FROM translation_keys k WHERE k.key = 'dashboard.score_status.low'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Very low'
    FROM translation_keys k WHERE k.key = 'dashboard.score_status.very_low'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Status'
    FROM translation_keys k WHERE k.key = 'dashboard.status'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'No scan'
    FROM translation_keys k WHERE k.key = 'dashboard.no_scan'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'No data available'
    FROM translation_keys k WHERE k.key = 'dashboard.no_data'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Loading scores...'
    FROM translation_keys k WHERE k.key = 'dashboard.loading'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Energy trend'
    FROM translation_keys k WHERE k.key = 'dashboard.energy_trend.title'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Average energy score'
    FROM translation_keys k WHERE k.key = 'dashboard.energy_trend.average_score'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Improving'
    FROM translation_keys k WHERE k.key = 'dashboard.trends.improving'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Declining'
    FROM translation_keys k WHERE k.key = 'dashboard.trends.declining'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Stable'
    FROM translation_keys k WHERE k.key = 'dashboard.trends.stable'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Most active HD centers'
    FROM translation_keys k WHERE k.key = 'dashboard.center_frequency.title'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Balanced energy'
    FROM translation_keys k WHERE k.key = 'dashboard.recent_scans.balanced_energy'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Average score'
    FROM translation_keys k WHERE k.key = 'dashboard.stats.average_score'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Main center'
    FROM translation_keys k WHERE k.key = 'dashboard.stats.main_center'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Trend'
    FROM translation_keys k WHERE k.key = 'dashboard.stats.trend'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Current energy state'
    FROM translation_keys k WHERE k.key = 'dashboard.energy_state.title'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'New energy scan'
    FROM translation_keys k WHERE k.key = 'dashboard.new_scan'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Refresh'
    FROM translation_keys k WHERE k.key = 'dashboard.refresh'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Overview'
    FROM translation_keys k WHERE k.key = 'dashboard.tabs.overview'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'History'
    FROM translation_keys k WHERE k.key = 'dashboard.tabs.history'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Analytics'
    FROM translation_keys k WHERE k.key = 'dashboard.tabs.analytics'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Reminders'
    FROM translation_keys k WHERE k.key = 'dashboard.tabs.reminders'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    -- Results translations
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Hello {name} 🌸'
    FROM translation_keys k WHERE k.key = 'results.welcome'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Here is your energetic landscape for {date}'
    FROM translation_keys k WHERE k.key = 'results.date'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Guidance Card'
    FROM translation_keys k WHERE k.key = 'results.guidance_card'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Affected HD Centers'
    FROM translation_keys k WHERE k.key = 'results.affected_centers'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Detailed analysis of your feelings'
    FROM translation_keys k WHERE k.key = 'results.feelings_analysis'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Positive feelings'
    FROM translation_keys k WHERE k.key = 'results.positive_feelings'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Feelings to observe'
    FROM translation_keys k WHERE k.key = 'results.negative_feelings'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'No feelings selected to analyze.'
    FROM translation_keys k WHERE k.key = 'results.no_feelings'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Personalized insights'
    FROM translation_keys k WHERE k.key = 'results.personalized_insights'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Mantra'
    FROM translation_keys k WHERE k.key = 'results.guidance.mantra'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Realignment exercise'
    FROM translation_keys k WHERE k.key = 'results.guidance.exercise'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Intention'
    FROM translation_keys k WHERE k.key = 'results.guidance.intention'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'View my dashboard'
    FROM translation_keys k WHERE k.key = 'results.view_dashboard'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Do another scan'
    FROM translation_keys k WHERE k.key = 'results.new_scan'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Share my results'
    FROM translation_keys k WHERE k.key = 'results.share_results'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Daily energy reading'
    FROM translation_keys k WHERE k.key = 'results.daily_tirage'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, '"You are exactly where you need to be. Continue to listen to yourself with love."'
    FROM translation_keys k WHERE k.key = 'results.closing_message'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    -- Scan translations
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Welcome to your diagnostic space'
    FROM translation_keys k WHERE k.key = 'scan.welcome.title'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Take a moment to settle and connect with your feelings. Choose the category you want to explore today.'
    FROM translation_keys k WHERE k.key = 'scan.welcome.subtitle'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'I''m ready to start'
    FROM translation_keys k WHERE k.key = 'scan.welcome.cta'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Which dimension would you like to explore?'
    FROM translation_keys k WHERE k.key = 'scan.category.selection'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'General State'
    FROM translation_keys k WHERE k.key = 'scan.category.general'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Emotional State'
    FROM translation_keys k WHERE k.key = 'scan.category.emotional'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Physical State'
    FROM translation_keys k WHERE k.key = 'scan.category.physical'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'How do you feel in your body and energy today?'
    FROM translation_keys k WHERE k.key = 'scan.category.general.question'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'How do you feel emotionally today?'
    FROM translation_keys k WHERE k.key = 'scan.category.emotional.question'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'How does your body feel today?'
    FROM translation_keys k WHERE k.key = 'scan.category.physical.question'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Check all the feelings that resonate with your present moment'
    FROM translation_keys k WHERE k.key = 'scan.category.general.instruction'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Take time to listen to your emotions and welcome them'
    FROM translation_keys k WHERE k.key = 'scan.category.emotional.instruction'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Take time to listen to the messages from your body'
    FROM translation_keys k WHERE k.key = 'scan.category.physical.instruction'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Back to categories'
    FROM translation_keys k WHERE k.key = 'scan.back_to_categories'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Show descriptions'
    FROM translation_keys k WHERE k.key = 'scan.show_descriptions'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Hide descriptions'
    FROM translation_keys k WHERE k.key = 'scan.hide_descriptions'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Validate my feelings'
    FROM translation_keys k WHERE k.key = 'scan.validate_feelings'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Your feelings are precious and unique'
    FROM translation_keys k WHERE k.key = 'scan.feelings_value'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Every emotion you feel is valid'
    FROM translation_keys k WHERE k.key = 'scan.emotions_value'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Your body is speaking to you, thank you for listening'
    FROM translation_keys k WHERE k.key = 'scan.body_value'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    -- HD centers translations
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Throat Center'
    FROM translation_keys k WHERE k.key = 'hd_centers.throat'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Heart Center'
    FROM translation_keys k WHERE k.key = 'hd_centers.heart'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Solar Plexus'
    FROM translation_keys k WHERE k.key = 'hd_centers.solar_plexus'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Sacral Center'
    FROM translation_keys k WHERE k.key = 'hd_centers.sacral'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Root Center'
    FROM translation_keys k WHERE k.key = 'hd_centers.root'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Spleen Center'
    FROM translation_keys k WHERE k.key = 'hd_centers.spleen'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'G Center (Identity)'
    FROM translation_keys k WHERE k.key = 'hd_centers.g_center'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Ajna Center'
    FROM translation_keys k WHERE k.key = 'hd_centers.ajna'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Head Center'
    FROM translation_keys k WHERE k.key = 'hd_centers.head'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Communication, expression, manifestation'
    FROM translation_keys k WHERE k.key = 'hd_centers.throat.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Will, determination, vitality'
    FROM translation_keys k WHERE k.key = 'hd_centers.heart.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Emotions, sensitivity, intuition'
    FROM translation_keys k WHERE k.key = 'hd_centers.solar_plexus.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Vital energy, creativity, sexuality'
    FROM translation_keys k WHERE k.key = 'hd_centers.sacral.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Stress, pressure, survival'
    FROM translation_keys k WHERE k.key = 'hd_centers.root.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Intuition, immune system, fear'
    FROM translation_keys k WHERE k.key = 'hd_centers.spleen.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Identity, love, direction'
    FROM translation_keys k WHERE k.key = 'hd_centers.g_center.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Mental, conceptualization, certainty'
    FROM translation_keys k WHERE k.key = 'hd_centers.ajna.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Inspiration, questions, mental pressure'
    FROM translation_keys k WHERE k.key = 'hd_centers.head.desc'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    -- Energy levels translations
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Flourishing energy ✨'
    FROM translation_keys k WHERE k.key = 'energy_levels.flourishing'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Balanced energy 🌸'
    FROM translation_keys k WHERE k.key = 'energy_levels.balanced'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Fluctuating energy 🌊'
    FROM translation_keys k WHERE k.key = 'energy_levels.fluctuating'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Energy in demand 🍃'
    FROM translation_keys k WHERE k.key = 'energy_levels.demanding'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, en_language_id, 'Deep resting energy 🌙'
    FROM translation_keys k WHERE k.key = 'energy_levels.resting'
    ON CONFLICT (key_id, language_id) DO NOTHING;
  END IF;
  
  -- Add Indonesian translations if Indonesian language exists
  IF ind_language_id IS NOT NULL THEN
    -- Dashboard translations
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Selamat datang, {name}'
    FROM translation_keys k WHERE k.key = 'dashboard.welcome'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Inilah dasbor energi personal Anda'
    FROM translation_keys k WHERE k.key = 'dashboard.subtitle'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Hasil berdasarkan dimensi'
    FROM translation_keys k WHERE k.key = 'dashboard.category_scores.title'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Baik'
    FROM translation_keys k WHERE k.key = 'dashboard.score_status.good'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Rata-rata'
    FROM translation_keys k WHERE k.key = 'dashboard.score_status.average'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Rendah'
    FROM translation_keys k WHERE k.key = 'dashboard.score_status.low'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Sangat rendah'
    FROM translation_keys k WHERE k.key = 'dashboard.score_status.very_low'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Status'
    FROM translation_keys k WHERE k.key = 'dashboard.status'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Tidak ada pemindaian'
    FROM translation_keys k WHERE k.key = 'dashboard.no_scan'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Tidak ada data tersedia'
    FROM translation_keys k WHERE k.key = 'dashboard.no_data'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Memuat skor...'
    FROM translation_keys k WHERE k.key = 'dashboard.loading'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Tren energi'
    FROM translation_keys k WHERE k.key = 'dashboard.energy_trend.title'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Skor energi rata-rata'
    FROM translation_keys k WHERE k.key = 'dashboard.energy_trend.average_score'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Meningkat'
    FROM translation_keys k WHERE k.key = 'dashboard.trends.improving'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Menurun'
    FROM translation_keys k WHERE k.key = 'dashboard.trends.declining'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Stabil'
    FROM translation_keys k WHERE k.key = 'dashboard.trends.stable'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Pusat HD paling aktif'
    FROM translation_keys k WHERE k.key = 'dashboard.center_frequency.title'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Energi seimbang'
    FROM translation_keys k WHERE k.key = 'dashboard.recent_scans.balanced_energy'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Skor rata-rata'
    FROM translation_keys k WHERE k.key = 'dashboard.stats.average_score'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Pusat utama'
    FROM translation_keys k WHERE k.key = 'dashboard.stats.main_center'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Tren'
    FROM translation_keys k WHERE k.key = 'dashboard.stats.trend'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Keadaan energi saat ini'
    FROM translation_keys k WHERE k.key = 'dashboard.energy_state.title'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Pemindaian energi baru'
    FROM translation_keys k WHERE k.key = 'dashboard.new_scan'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Segarkan'
    FROM translation_keys k WHERE k.key = 'dashboard.refresh'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Ikhtisar'
    FROM translation_keys k WHERE k.key = 'dashboard.tabs.overview'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Riwayat'
    FROM translation_keys k WHERE k.key = 'dashboard.tabs.history'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Analitik'
    FROM translation_keys k WHERE k.key = 'dashboard.tabs.analytics'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Pengingat'
    FROM translation_keys k WHERE k.key = 'dashboard.tabs.reminders'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    -- Results translations
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Halo {name} 🌸'
    FROM translation_keys k WHERE k.key = 'results.welcome'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Inilah lanskap energi Anda untuk {date}'
    FROM translation_keys k WHERE k.key = 'results.date'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Kartu Panduan'
    FROM translation_keys k WHERE k.key = 'results.guidance_card'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Pusat HD yang Terpengaruh'
    FROM translation_keys k WHERE k.key = 'results.affected_centers'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Analisis rinci perasaan Anda'
    FROM translation_keys k WHERE k.key = 'results.feelings_analysis'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Perasaan positif'
    FROM translation_keys k WHERE k.key = 'results.positive_feelings'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Perasaan untuk diamati'
    FROM translation_keys k WHERE k.key = 'results.negative_feelings'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Tidak ada perasaan yang dipilih untuk dianalisis.'
    FROM translation_keys k WHERE k.key = 'results.no_feelings'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Wawasan yang dipersonalisasi'
    FROM translation_keys k WHERE k.key = 'results.personalized_insights'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Mantra'
    FROM translation_keys k WHERE k.key = 'results.guidance.mantra'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Latihan penyelarasan'
    FROM translation_keys k WHERE k.key = 'results.guidance.exercise'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Niat'
    FROM translation_keys k WHERE k.key = 'results.guidance.intention'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Lihat dasbor saya'
    FROM translation_keys k WHERE k.key = 'results.view_dashboard'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Lakukan pemindaian lain'
    FROM translation_keys k WHERE k.key = 'results.new_scan'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Bagikan hasil saya'
    FROM translation_keys k WHERE k.key = 'results.share_results'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Bacaan energi harian'
    FROM translation_keys k WHERE k.key = 'results.daily_tirage'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, '"Anda berada tepat di mana Anda perlu berada. Teruslah mendengarkan diri Anda dengan cinta."'
    FROM translation_keys k WHERE k.key = 'results.closing_message'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    -- HD centers translations
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Pusat Tenggorokan'
    FROM translation_keys k WHERE k.key = 'hd_centers.throat'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Pusat Jantung'
    FROM translation_keys k WHERE k.key = 'hd_centers.heart'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Pleksus Surya'
    FROM translation_keys k WHERE k.key = 'hd_centers.solar_plexus'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Pusat Sakral'
    FROM translation_keys k WHERE k.key = 'hd_centers.sacral'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Pusat Akar'
    FROM translation_keys k WHERE k.key = 'hd_centers.root'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Pusat Limpa'
    FROM translation_keys k WHERE k.key = 'hd_centers.spleen'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Pusat G (Identitas)'
    FROM translation_keys k WHERE k.key = 'hd_centers.g_center'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Pusat Ajna'
    FROM translation_keys k WHERE k.key = 'hd_centers.ajna'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Pusat Kepala'
    FROM translation_keys k WHERE k.key = 'hd_centers.head'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    -- Energy levels translations
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Energi berkembang ✨'
    FROM translation_keys k WHERE k.key = 'energy_levels.flourishing'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Energi seimbang 🌸'
    FROM translation_keys k WHERE k.key = 'energy_levels.balanced'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Energi berfluktuasi 🌊'
    FROM translation_keys k WHERE k.key = 'energy_levels.fluctuating'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Energi yang menuntut 🍃'
    FROM translation_keys k WHERE k.key = 'energy_levels.demanding'
    ON CONFLICT (key_id, language_id) DO NOTHING;
    
    INSERT INTO translations (key_id, language_id, value)
    SELECT k.id, ind_language_id, 'Energi istirahat dalam 🌙'
    FROM translation_keys k WHERE k.key = 'energy_levels.resting'
    ON CONFLICT (key_id, language_id) DO NOTHING;
  END IF;
END $$;