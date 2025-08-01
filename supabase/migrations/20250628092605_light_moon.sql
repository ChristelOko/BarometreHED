/*
  # Add translations for dashboard and categories

  1. New Tables
    - Add translations for dashboard elements
    - Add translations for category names and descriptions
    - Add translations for energy levels
    
  2. Security
    - Ensure translations are publicly readable
*/

-- Add translations for dashboard elements
INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.welcome', 'Welcome message on dashboard', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.subtitle', 'Dashboard subtitle', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.category_scores.title', 'Title for category scores section', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.score_status.excellent', 'Excellent score status', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.score_status.good', 'Good score status', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.score_status.average', 'Average score status', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.score_status.low', 'Low score status', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.score_status.very_low', 'Very low score status', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.status', 'Status label', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.no_scan', 'No scan message', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.no_data', 'No data message', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.loading', 'Loading message', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.energy_trend.title', 'Energy trend title', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.energy_trend.average_score', 'Average energy score', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.trends.improving', 'Improving trend', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.trends.declining', 'Declining trend', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.trends.stable', 'Stable trend', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.center_frequency.title', 'HD centers frequency title', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.recent_scans.balanced_energy', 'Balanced energy title', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.stats.average_score', 'Average score label', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.stats.main_center', 'Main center label', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.stats.trend', 'Trend label', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.energy_state.title', 'Energy state title', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.new_scan', 'New scan button', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.refresh', 'Refresh button', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.tabs.overview', 'Overview tab', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.tabs.history', 'History tab', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.tabs.analytics', 'Analytics tab', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.tabs.reminders', 'Reminders tab', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.trend_label', 'Trend label', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'dashboard.no_scans', 'No scans message', cat.id
FROM translation_categories cat
WHERE cat.name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

-- Add translations for categories
INSERT INTO translation_keys (key, description, category_id)
SELECT 'categories.general', 'General category name', cat.id
FROM translation_categories cat
WHERE cat.name = 'Categories'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'categories.emotional', 'Emotional category name', cat.id
FROM translation_categories cat
WHERE cat.name = 'Categories'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'categories.physical', 'Physical category name', cat.id
FROM translation_categories cat
WHERE cat.name = 'Categories'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'categories.mental', 'Mental category name', cat.id
FROM translation_categories cat
WHERE cat.name = 'Categories'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'categories.digestive', 'Digestive category name', cat.id
FROM translation_categories cat
WHERE cat.name = 'Categories'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'categories.somatic', 'Somatic category name', cat.id
FROM translation_categories cat
WHERE cat.name = 'Categories'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'categories.energetic', 'Energetic category name', cat.id
FROM translation_categories cat
WHERE cat.name = 'Categories'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'categories.feminine_cycle', 'Feminine cycle category name', cat.id
FROM translation_categories cat
WHERE cat.name = 'Categories'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'categories.hd_specific', 'HD specific category name', cat.id
FROM translation_categories cat
WHERE cat.name = 'Categories'
ON CONFLICT (key) DO NOTHING;

-- Add translations for energy levels
INSERT INTO translation_keys (key, description, category_id)
SELECT 'energy_levels.flourishing', 'Flourishing energy level', cat.id
FROM translation_categories cat
WHERE cat.name = 'Energy'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'energy_levels.balanced', 'Balanced energy level', cat.id
FROM translation_categories cat
WHERE cat.name = 'Energy'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'energy_levels.fluctuating', 'Fluctuating energy level', cat.id
FROM translation_categories cat
WHERE cat.name = 'Energy'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'energy_levels.demanding', 'Demanding energy level', cat.id
FROM translation_categories cat
WHERE cat.name = 'Energy'
ON CONFLICT (key) DO NOTHING;

INSERT INTO translation_keys (key, description, category_id)
SELECT 'energy_levels.resting', 'Resting energy level', cat.id
FROM translation_categories cat
WHERE cat.name = 'Energy'
ON CONFLICT (key) DO NOTHING;

-- Add French translations
INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Bienvenue, {name}'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.welcome' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Bienvenue, {name}';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Voici ton tableau de bord énergétique personnalisé'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.subtitle' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Voici ton tableau de bord énergétique personnalisé';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Résultats par dimension'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.category_scores.title' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Résultats par dimension';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Excellent'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.excellent' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Excellent';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Bon'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.good' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Bon';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Moyen'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.average' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Moyen';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Faible'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.low' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Faible';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Très faible'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.very_low' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Très faible';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Statut'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.status' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Statut';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Aucun scan'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.no_scan' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Aucun scan';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Aucune donnée disponible'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.no_data' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Aucune donnée disponible';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Chargement des scores...'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.loading' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Chargement des scores...';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Tendance énergétique'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.energy_trend.title' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Tendance énergétique';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Score énergétique moyen'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.energy_trend.average_score' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Score énergétique moyen';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'En amélioration'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.trends.improving' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'En amélioration';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'En diminution'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.trends.declining' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'En diminution';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Stable'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.trends.stable' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Stable';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Centres HD les plus actifs'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.center_frequency.title' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Centres HD les plus actifs';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Énergie équilibrée'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.recent_scans.balanced_energy' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Énergie équilibrée';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Score moyen'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.stats.average_score' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Score moyen';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Centre principal'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.stats.main_center' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Centre principal';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Tendance'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.stats.trend' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Tendance';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'État énergétique actuel'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.energy_state.title' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'État énergétique actuel';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Nouveau scan énergétique'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.new_scan' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Nouveau scan énergétique';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Actualiser'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.refresh' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Actualiser';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Aperçu'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.tabs.overview' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Aperçu';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Historique'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.tabs.history' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Historique';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Analyses'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.tabs.analytics' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Analyses';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Rappels'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.tabs.reminders' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Rappels';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Tendance'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.trend_label' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Tendance';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Aucun scan enregistré pour le moment'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.no_scans' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Aucun scan enregistré pour le moment';

-- Add translations for categories
INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Général'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.general' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Général';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Émotionnel'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.emotional' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Émotionnel';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Physique'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.physical' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Physique';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Mental'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.mental' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Mental';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Digestif'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.digestive' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Digestif';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Somatique'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.somatic' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Somatique';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Énergétique'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.energetic' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Énergétique';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Cycle Féminin'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.feminine_cycle' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Cycle Féminin';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Spécifique HD'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.hd_specific' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Spécifique HD';

-- Add translations for energy levels
INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Énergie florissante ✨'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.flourishing' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Énergie florissante ✨';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Énergie équilibrée 🌸'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.balanced' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Énergie équilibrée 🌸';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Énergie fluctuante 🌊'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.fluctuating' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Énergie fluctuante 🌊';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Énergie en demande 🍃'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.demanding' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Énergie en demande 🍃';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Énergie en repos profond 🌙'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.resting' AND l.code = 'FR'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Énergie en repos profond 🌙';

-- Add English translations
INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Welcome, {name}'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.welcome' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Welcome, {name}';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Here is your personalized energy dashboard'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.subtitle' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Here is your personalized energy dashboard';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Results by dimension'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.category_scores.title' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Results by dimension';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Excellent'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.excellent' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Excellent';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Good'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.good' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Good';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Average'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.average' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Average';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Low'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.low' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Low';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Very low'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.very_low' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Very low';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Status'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.status' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Status';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'No scan'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.no_scan' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'No scan';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'No data available'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.no_data' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'No data available';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Loading scores...'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.loading' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Loading scores...';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Energy trend'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.energy_trend.title' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Energy trend';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Average energy score'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.energy_trend.average_score' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Average energy score';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Improving'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.trends.improving' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Improving';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Declining'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.trends.declining' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Declining';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Stable'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.trends.stable' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Stable';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Most active HD centers'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.center_frequency.title' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Most active HD centers';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Balanced energy'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.recent_scans.balanced_energy' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Balanced energy';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Average score'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.stats.average_score' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Average score';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Main center'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.stats.main_center' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Main center';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Trend'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.stats.trend' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Trend';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Current energy state'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.energy_state.title' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Current energy state';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'New energy scan'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.new_scan' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'New energy scan';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Refresh'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.refresh' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Refresh';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Overview'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.tabs.overview' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Overview';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'History'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.tabs.history' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'History';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Analytics'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.tabs.analytics' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Analytics';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Reminders'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.tabs.reminders' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Reminders';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Trend'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.trend_label' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Trend';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'No scans recorded yet'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.no_scans' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'No scans recorded yet';

-- Add translations for categories in English
INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'General'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.general' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'General';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Emotional'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.emotional' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Emotional';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Physical'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.physical' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Physical';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Mental'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.mental' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Mental';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Digestive'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.digestive' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Digestive';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Somatic'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.somatic' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Somatic';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Energetic'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.energetic' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Energetic';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Feminine Cycle'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.feminine_cycle' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Feminine Cycle';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'HD Specific'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.hd_specific' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'HD Specific';

-- Add translations for energy levels in English
INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Flourishing energy ✨'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.flourishing' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Flourishing energy ✨';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Balanced energy 🌸'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.balanced' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Balanced energy 🌸';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Fluctuating energy 🌊'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.fluctuating' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Fluctuating energy 🌊';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Energy in demand 🍃'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.demanding' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Energy in demand 🍃';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Deep resting energy 🌙'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.resting' AND l.code = 'EN'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Deep resting energy 🌙';

-- Add Indonesian translations
INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Selamat datang, {name}'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.welcome' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Selamat datang, {name}';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Inilah dasbor energi personal Anda'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.subtitle' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Inilah dasbor energi personal Anda';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Hasil berdasarkan dimensi'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.category_scores.title' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Hasil berdasarkan dimensi';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Sangat Baik'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.excellent' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Sangat Baik';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Baik'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.good' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Baik';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Rata-rata'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.average' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Rata-rata';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Rendah'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.low' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Rendah';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Sangat rendah'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.score_status.very_low' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Sangat rendah';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Status'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.status' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Status';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Tidak ada pemindaian'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.no_scan' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Tidak ada pemindaian';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Tidak ada data tersedia'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.no_data' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Tidak ada data tersedia';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Memuat skor...'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.loading' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Memuat skor...';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Tren energi'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.energy_trend.title' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Tren energi';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Skor energi rata-rata'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.energy_trend.average_score' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Skor energi rata-rata';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Meningkat'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.trends.improving' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Meningkat';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Menurun'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.trends.declining' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Menurun';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Stabil'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.trends.stable' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Stabil';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Pusat HD paling aktif'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.center_frequency.title' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Pusat HD paling aktif';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Energi seimbang'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.recent_scans.balanced_energy' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Energi seimbang';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Skor rata-rata'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.stats.average_score' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Skor rata-rata';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Pusat utama'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.stats.main_center' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Pusat utama';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Tren'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.stats.trend' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Tren';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Keadaan energi saat ini'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.energy_state.title' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Keadaan energi saat ini';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Pemindaian energi baru'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.new_scan' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Pemindaian energi baru';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Segarkan'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.refresh' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Segarkan';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Ikhtisar'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.tabs.overview' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Ikhtisar';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Riwayat'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.tabs.history' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Riwayat';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Analitik'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.tabs.analytics' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Analitik';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Pengingat'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.tabs.reminders' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Pengingat';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Tren'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.trend_label' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Tren';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Belum ada pemindaian yang direkam'
FROM translation_keys tk, languages l
WHERE tk.key = 'dashboard.no_scans' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Belum ada pemindaian yang direkam';

-- Add translations for categories in Indonesian
INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Umum'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.general' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Umum';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Emosional'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.emotional' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Emosional';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Fisik'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.physical' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Fisik';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Mental'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.mental' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Mental';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Pencernaan'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.digestive' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Pencernaan';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Somatik'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.somatic' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Somatik';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Energetik'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.energetic' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Energetik';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Siklus Feminin'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.feminine_cycle' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Siklus Feminin';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Spesifik HD'
FROM translation_keys tk, languages l
WHERE tk.key = 'categories.hd_specific' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Spesifik HD';

-- Add translations for energy levels in Indonesian
INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Energi berkembang ✨'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.flourishing' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Energi berkembang ✨';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Energi seimbang 🌸'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.balanced' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Energi seimbang 🌸';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Energi berfluktuasi 🌊'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.fluctuating' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Energi berfluktuasi 🌊';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Energi yang menuntut 🍃'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.demanding' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Energi yang menuntut 🍃';

INSERT INTO translations (key_id, language_id, value)
SELECT tk.id, l.id, 'Energi istirahat dalam 🌙'
FROM translation_keys tk, languages l
WHERE tk.key = 'energy_levels.resting' AND l.code = 'IND'
ON CONFLICT (key_id, language_id) DO UPDATE SET value = 'Energi istirahat dalam 🌙';