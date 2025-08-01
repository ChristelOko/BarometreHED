/*
  # Ajouter le contenu Daily Energy
  
  1. Ajout du contenu Daily Energy dans content_pages
    - Section dédiée avec titre, contenu et métadonnées
    - Positionnement correct dans l'ordre d'affichage
  
  2. Contenu optimisé
    - Texte engageant pour encourager l'usage quotidien
    - Métadonnées avec icônes et highlights
    - Call-to-action intégré
*/

-- Ajouter le contenu Daily Energy
INSERT INTO content_pages (page_slug, section_key, content_type, title, content, metadata, order_index) VALUES

-- Section Daily Energy complète
('home', 'daily_energy', 'feature', 'Ton énergie quotidienne', 
'Chaque jour est unique, et ton énergie aussi. Découvre comment elle évolue et ce qu''elle te révèle sur ton chemin. Le Baromètre Énergétique t''accompagne dans cette exploration quotidienne de ton paysage intérieur.', 
'{"icon": "sun", "highlight": "🌸 Un rendez-vous quotidien avec toi-même", "cta_text": "Commencer mon scan du jour", "cta_action": "/scan", "benefits": ["Comprendre tes cycles énergétiques", "Identifier tes patterns", "Cultiver ta connexion intérieure"]}', 7)

ON CONFLICT (page_slug, section_key, order_index) 
WHERE is_active = true
DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  metadata = EXCLUDED.metadata,
  updated_at = now();