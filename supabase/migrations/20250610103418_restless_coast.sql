/*
  # Import des traductions initiales
  
  1. Importation des traductions
    - Utilise la fonction add_translation pour ajouter les traductions
    - Organisées par catégories
    - Inclut les traductions pour les 3 langues (FR, EN, IND)
  
  2. Structure
    - Chaque appel à add_translation ajoute une clé et ses traductions
    - Format: add_translation(clé, catégorie, description, FR, EN, IND)
*/

-- Traductions communes
SELECT add_translation('common.loading', 'common', 'Message de chargement', 'Chargement...', 'Loading...', 'Memuat...');
SELECT add_translation('common.error', 'common', 'Message d''erreur générique', 'Erreur', 'Error', 'Kesalahan');
SELECT add_translation('common.success', 'common', 'Message de succès générique', 'Succès', 'Success', 'Berhasil');
SELECT add_translation('common.save', 'common', 'Bouton de sauvegarde', 'Sauvegarder', 'Save', 'Simpan');
SELECT add_translation('common.cancel', 'common', 'Bouton d''annulation', 'Annuler', 'Cancel', 'Batal');
SELECT add_translation('common.confirm', 'common', 'Bouton de confirmation', 'Confirmer', 'Confirm', 'Konfirmasi');
SELECT add_translation('common.back', 'common', 'Bouton de retour', 'Retour', 'Back', 'Kembali');
SELECT add_translation('common.next', 'common', 'Bouton suivant', 'Suivant', 'Next', 'Selanjutnya');
SELECT add_translation('common.close', 'common', 'Bouton de fermeture', 'Fermer', 'Close', 'Tutup');
SELECT add_translation('common.back_to_profile', 'common', 'Retour au profil', 'Retour au profil', 'Back to profile', 'Kembali ke profil');

-- Navigation
SELECT add_translation('nav.home', 'navigation', 'Lien d''accueil', 'Accueil', 'Home', 'Beranda');
SELECT add_translation('nav.scan', 'navigation', 'Lien de diagnostic', 'Diagnostic', 'Scan', 'Diagnosis');
SELECT add_translation('nav.dashboard', 'navigation', 'Lien du tableau de bord', 'Tableau de Bord', 'Dashboard', 'Dasbor');
SELECT add_translation('nav.about', 'navigation', 'Lien à propos', 'À propos', 'About', 'Tentang');
SELECT add_translation('nav.premium', 'navigation', 'Lien premium', 'Premium', 'Premium', 'Premium');
SELECT add_translation('nav.login', 'navigation', 'Lien de connexion', 'Connexion', 'Login', 'Masuk');
SELECT add_translation('nav.profile', 'navigation', 'Lien de profil', 'Mon profil', 'My Profile', 'Profil Saya');
SELECT add_translation('nav.settings', 'navigation', 'Lien des paramètres', 'Paramètres', 'Settings', 'Pengaturan');
SELECT add_translation('nav.admin', 'navigation', 'Lien d''administration', 'Administration', 'Administration', 'Administrasi');
SELECT add_translation('nav.logout', 'navigation', 'Lien de déconnexion', 'Déconnexion', 'Logout', 'Keluar');

-- Page d'accueil
SELECT add_translation('home.hero.title', 'home', 'Titre principal de la page d''accueil', 'Ressentez votre énergie profonde', 'Feel Your Deep Energy', 'Rasakan Energi Dalam Anda');
SELECT add_translation('home.hero.subtitle', 'home', 'Sous-titre de la page d''accueil', 'Explorez votre équilibre énergétique basé sur le Human Design', 'Explore your energetic balance based on Human Design', 'Jelajahi keseimbangan energi Anda berdasarkan Human Design');
SELECT add_translation('home.hero.cta', 'home', 'Bouton d''appel à l''action', 'Lancer le scan', 'Start Scan', 'Mulai Pemindaian');
SELECT add_translation('home.why_scan.title', 'home', 'Titre de la section pourquoi scanner', 'Pourquoi scanner ton énergie chaque jour ?', 'Why scan your energy every day?', 'Mengapa memindai energi Anda setiap hari?');
SELECT add_translation('home.why_scan.content', 'home', 'Contenu de la section pourquoi scanner', 'Ton énergie est ton langage intérieur. Chaque tension, chaque joie, chaque fatigue est un message. Le Baromètre Énergétique t''aide à écouter ce langage subtil, à reconnaître ce qui se vit en toi, et à t''offrir l''ajustement dont tu as besoin — émotionnel, physique, mental ou spirituel.', 'Your energy is your inner language. Every tension, every joy, every fatigue is a message. The Energy Barometer helps you listen to this subtle language, recognize what is happening within you, and offer you the adjustment you need — emotional, physical, mental, or spiritual.', 'Energi Anda adalah bahasa batin Anda. Setiap ketegangan, setiap kegembiraan, setiap kelelahan adalah pesan. Barometer Energi membantu Anda mendengarkan bahasa halus ini, mengenali apa yang terjadi dalam diri Anda, dan menawarkan penyesuaian yang Anda butuhkan — emosional, fisik, mental, atau spiritual.');
SELECT add_translation('home.why_scan.highlight', 'home', 'Texte mis en évidence', '✨ C''est un miroir doux, non intrusif, profondément féminin.', '✨ It''s a gentle, non-intrusive, deeply feminine mirror.', '✨ Ini adalah cermin lembut, tidak mengganggu, sangat feminin.');
SELECT add_translation('home.how_it_works.title', 'home', 'Titre de la section comment ça marche', 'Comment ça marche ?', 'How does it work?', 'Bagaimana cara kerjanya?');
SELECT add_translation('home.how_it_works.subtitle', 'home', 'Sous-titre de la section comment ça marche', 'Découvre en 3 étapes simples comment le Baromètre Énergétique t''accompagne dans ta reconnexion quotidienne.', 'Discover in 3 simple steps how the Energy Barometer accompanies you in your daily reconnection.', 'Temukan dalam 3 langkah sederhana bagaimana Barometer Energi menemani Anda dalam rekoneksi harian Anda.');
SELECT add_translation('home.step1.title', 'home', 'Titre de l''étape 1', 'Scanner ton énergie', 'Scan your energy', 'Pindai energi Anda');
SELECT add_translation('home.step1.content', 'home', 'Contenu de l''étape 1', 'Je choisis ce que je ressens en ce moment (corps, cœur, tête)', 'I choose what I feel in the present moment (body, heart, mind)', 'Saya memilih apa yang saya rasakan saat ini (tubuh, hati, pikiran)');
SELECT add_translation('home.step2.title', 'home', 'Titre de l''étape 2', 'Recevoir un éclairage personnalisé', 'Receive personalized insights', 'Terima wawasan yang dipersonalisasi');
SELECT add_translation('home.step2.content', 'home', 'Contenu de l''étape 2', 'Je découvre quel centre HD est touché, et ce que cela me dit de moi', 'I discover which HD center is affected, and what this tells me about myself', 'Saya menemukan pusat HD mana yang terpengaruh, dan apa yang ini katakan tentang diri saya');
SELECT add_translation('home.step3.title', 'home', 'Titre de l''étape 3', 'Me réaligner en douceur', 'Realign gently', 'Selaraskan dengan lembut');
SELECT add_translation('home.step3.content', 'home', 'Contenu de l''étape 3', 'Je reçois un mantra, une phrase miroir, un rituel doux… et je repars centrée.', 'I receive a mantra, a mirror phrase, a gentle ritual... and I leave centered.', 'Saya menerima mantra, frasa cermin, ritual lembut... dan saya pergi dengan terpusat.');
SELECT add_translation('home.daily_energy.title', 'home', 'Titre de la section énergie quotidienne', 'Ton énergie quotidienne', 'Your daily energy', 'Energi harian Anda');
SELECT add_translation('home.daily_energy.content', 'home', 'Contenu de la section énergie quotidienne', 'Chaque jour est unique, et ton énergie aussi. Découvre comment elle évolue et ce qu''elle te révèle sur ton chemin.', 'Each day is unique, and so is your energy. Discover how it evolves and what it reveals about your path.', 'Setiap hari unik, begitu juga energi Anda. Temukan bagaimana energi Anda berkembang dan apa yang diungkapkan tentang jalan Anda.');
SELECT add_translation('home.daily_energy.day', 'home', 'Énergie du jour', 'Énergie du jour', 'Energy of the day', 'Energi hari ini');
SELECT add_translation('home.daily_energy.month', 'home', 'Énergie du mois', 'Énergie du mois', 'Energy of the month', 'Energi bulan ini');
SELECT add_translation('home.daily_energy.year', 'home', 'Énergie de l''année', 'Énergie de l''année', 'Energy of the year', 'Energi tahun ini');
SELECT add_translation('home.daily_energy.message', 'home', 'Message du jour', 'Message du jour', 'Message of the day', 'Pesan hari ini');
SELECT add_translation('home.daily_energy.mantra', 'home', 'Mantra du jour', 'Mantra du jour', 'Mantra of the day', 'Mantra hari ini');
SELECT add_translation('home.daily_energy.cta', 'home', 'Bouton pour faire un scan', 'Faire mon scan énergétique', 'Do my energy scan', 'Lakukan pemindaian energi saya');
SELECT add_translation('home.daily_energy.ready', 'home', 'Prête à explorer', 'Prête à explorer ton énergie?', 'Ready to explore your energy?', 'Siap menjelajahi energi Anda?');
SELECT add_translation('home.daily_energy.ready_desc', 'home', 'Description de l''exploration', 'Prends quelques minutes pour te connecter à ton ressenti et découvrir ce que ton énergie te révèle aujourd''hui.', 'Take a few minutes to connect with your feelings and discover what your energy reveals to you today.', 'Luangkan beberapa menit untuk terhubung dengan perasaan Anda dan temukan apa yang energi Anda ungkapkan kepada Anda hari ini.');
SELECT add_translation('home.connect_energy', 'home', 'Message de connexion à l''énergie', '✨ Connecte-toi à ton énergie unique et découvre ce qu''elle te révèle', '✨ Connect to your unique energy and discover what it reveals to you', '✨ Hubungkan dengan energi unik Anda dan temukan apa yang diungkapkannya kepada Anda');

-- Page de scan
SELECT add_translation('scan.welcome', 'scan', 'Message de bienvenue', 'Bienvenue dans ton espace diagnostic', 'Welcome to your diagnostic space', 'Selamat datang di ruang diagnosis Anda');
SELECT add_translation('scan.welcome.subtitle', 'scan', 'Sous-titre de bienvenue', 'Prends un moment pour te poser et te connecter à ton ressenti. Choisis la catégorie que tu souhaites explorer aujourd''hui.', 'Take a moment to settle and connect with your feelings. Choose the category you want to explore today.', 'Luangkan waktu untuk menetap dan terhubung dengan perasaan Anda. Pilih kategori yang ingin Anda jelajahi hari ini.');
SELECT add_translation('scan.welcome.cta', 'scan', 'Bouton pour commencer', 'Je suis prête à commencer', 'I''m ready to start', 'Saya siap untuk memulai');
SELECT add_translation('scan.category.general', 'scan', 'Catégorie générale', 'État Général', 'General State', 'Keadaan Umum');
SELECT add_translation('scan.category.general.desc', 'scan', 'Description de la catégorie générale', 'Évaluez votre ressenti global et votre énergie du moment', 'Evaluate your overall feeling and energy of the moment', 'Evaluasi perasaan dan energi Anda secara keseluruhan saat ini');
SELECT add_translation('scan.category.emotional', 'scan', 'Catégorie émotionnelle', 'État Émotionnel', 'Emotional State', 'Keadaan Emosional');
SELECT add_translation('scan.category.emotional.desc', 'scan', 'Description de la catégorie émotionnelle', 'Explorez vos émotions et votre équilibre intérieur', 'Explore your emotions and inner balance', 'Jelajahi emosi dan keseimbangan batin Anda');
SELECT add_translation('scan.category.physical', 'scan', 'Catégorie physique', 'État Physique', 'Physical State', 'Keadaan Fisik');
SELECT add_translation('scan.category.physical.desc', 'scan', 'Description de la catégorie physique', 'Écoutez les sensations de votre corps', 'Listen to the sensations of your body', 'Dengarkan sensasi tubuh Anda');
SELECT add_translation('scan.category.selection', 'scan', 'Sélection de catégorie', 'Quelle dimension souhaites-tu explorer ?', 'Which dimension would you like to explore?', 'Dimensi mana yang ingin Anda jelajahi?');
SELECT add_translation('scan.general.title', 'scan', 'Titre de la catégorie générale', '✨ État Général', '✨ General State', '✨ Keadaan Umum');
SELECT add_translation('scan.general.subtitle', 'scan', 'Sous-titre de la catégorie générale', '🌟 Comment te sens-tu dans ton corps et ton énergie aujourd''hui ?', '🌟 How do you feel in your body and energy today?', '🌟 Bagaimana perasaan Anda dalam tubuh dan energi Anda hari ini?');
SELECT add_translation('scan.general.note', 'scan', 'Note pour la catégorie générale', '✨ Coche tous les ressentis qui résonnent avec ton instant présent', '✨ Check all the feelings that resonate with your present moment', '✨ Centang semua perasaan yang beresonansi dengan momen Anda saat ini');
SELECT add_translation('scan.emotional.title', 'scan', 'Titre de la catégorie émotionnelle', '💗 État Émotionnel', '💗 Emotional State', '💗 Keadaan Emosional');
SELECT add_translation('scan.emotional.subtitle', 'scan', 'Sous-titre de la catégorie émotionnelle', '🌸 Comment te sens-tu émotionnellement aujourd''hui ?', '🌸 How do you feel emotionally today?', '🌸 Bagaimana perasaan emosional Anda hari ini?');
SELECT add_translation('scan.emotional.note', 'scan', 'Note pour la catégorie émotionnelle', '✨ Prends le temps d''écouter tes émotions et de les accueillir', '✨ Take time to listen to your emotions and welcome them', '✨ Luangkan waktu untuk mendengarkan emosi Anda dan menyambutnya');
SELECT add_translation('scan.physical.title', 'scan', 'Titre de la catégorie physique', '🌱 État Physique', '🌱 Physical State', '🌱 Keadaan Fisik');
SELECT add_translation('scan.physical.subtitle', 'scan', 'Sous-titre de la catégorie physique', '🌸 Comment se sent ton corps aujourd''hui ?', '🌸 How does your body feel today?', '🌸 Bagaimana perasaan tubuh Anda hari ini?');
SELECT add_translation('scan.physical.note', 'scan', 'Note pour la catégorie physique', '✨ Prends le temps d''écouter les messages de ton corps', '✨ Take time to listen to the messages from your body', '✨ Luangkan waktu untuk mendengarkan pesan dari tubuh Anda');
SELECT add_translation('scan.positive_feelings', 'scan', 'Ressentis positifs', '🌸 Ressentis positifs', '🌸 Positive feelings', '🌸 Perasaan positif');
SELECT add_translation('scan.negative_feelings', 'scan', 'Ressentis négatifs', '🍂 Ressentis à observer', '🍂 Feelings to observe', '🍂 Perasaan untuk diamati');
SELECT add_translation('scan.validate_button', 'scan', 'Bouton de validation', 'Valider mes ressentis', 'Validate my feelings', 'Validasi perasaan saya');
SELECT add_translation('scan.premium_feature', 'scan', 'Fonctionnalité premium', 'Fonctionnalité premium', 'Premium feature', 'Fitur premium');
SELECT add_translation('scan.back_to_categories', 'scan', 'Retour aux catégories', 'Retour aux catégories', 'Back to categories', 'Kembali ke kategori');

-- Page de résultats
SELECT add_translation('results.welcome', 'results', 'Message de bienvenue', 'Bonjour {name} 🌸', 'Hello {name} 🌸', 'Halo {name} 🌸');
SELECT add_translation('results.date', 'results', 'Date des résultats', 'Voici ton paysage énergétique du {date}', 'Here is your energetic landscape for {date}', 'Inilah lanskap energi Anda untuk {date}');
SELECT add_translation('results.energy_gauge', 'results', 'Jauge énergétique', 'Jauge énergétique', 'Energy Gauge', 'Pengukur Energi');
SELECT add_translation('results.affected_centers', 'results', 'Centres HD affectés', 'Centres HD affectés', 'Affected HD Centers', 'Pusat HD yang Terpengaruh');
SELECT add_translation('results.guidance_card', 'results', 'Carte de guidance', 'Carte de Guidance', 'Guidance Card', 'Kartu Panduan');
SELECT add_translation('results.guidance.element', 'results', 'Élément à harmoniser', 'Élément à harmoniser', 'Element to harmonize', 'Elemen untuk diharmoniskan');
SELECT add_translation('results.guidance.practice', 'results', 'Pratique recommandée', 'Pratique recommandée', 'Recommended practice', 'Praktik yang direkomendasikan');
SELECT add_translation('results.guidance.intention', 'results', 'Intention du jour', 'Intention du jour', 'Intention of the day', 'Niat hari ini');
SELECT add_translation('results.feelings_analysis', 'results', 'Analyse des ressentis', 'Analyse détaillée de tes ressentis', 'Detailed analysis of your feelings', 'Analisis rinci perasaan Anda');
SELECT add_translation('results.positive_feelings', 'results', 'Ressentis positifs', '✨ Ressentis positifs', '✨ Positive feelings', '✨ Perasaan positif');
SELECT add_translation('results.negative_feelings', 'results', 'Ressentis négatifs', '🍂 Ressentis à observer', '🍂 Feelings to observe', '🍂 Perasaan untuk diamati');
SELECT add_translation('results.positive_feelings_count', 'results', 'Nombre de ressentis positifs', '✨ Ressentis positifs ({count})', '✨ Positive feelings ({count})', '✨ Perasaan positif ({count})');
SELECT add_translation('results.negative_feelings_count', 'results', 'Nombre de ressentis négatifs', '🍂 Ressentis à observer ({count})', '🍂 Feelings to observe ({count})', '🍂 Perasaan untuk diamati ({count})');
SELECT add_translation('results.positive_feelings_short', 'results', 'Ressentis positifs (court)', 'Ressentis positifs', 'Positive feelings', 'Perasaan positif');
SELECT add_translation('results.negative_feelings_short', 'results', 'Ressentis négatifs (court)', 'Ressentis à observer', 'Feelings to observe', 'Perasaan untuk diamati');
SELECT add_translation('results.feelings_analyzed', 'results', 'Ressentis analysés', 'Ressentis analysés', 'Feelings analyzed', 'Perasaan dianalisis');
SELECT add_translation('results.feelings_summary', 'results', 'Synthèse des ressentis', '📊 Synthèse de tes ressentis', '📊 Summary of your feelings', '📊 Ringkasan perasaan Anda');
SELECT add_translation('results.feelings_insight', 'results', 'Insight sur les ressentis', 'Chaque ressenti que tu as sélectionné est une information précieuse sur ton état énergétique actuel.', 'Each feeling you selected is valuable information about your current energetic state.', 'Setiap perasaan yang Anda pilih adalah informasi berharga tentang keadaan energi Anda saat ini.');
SELECT add_translation('results.no_feelings', 'results', 'Aucun ressenti', 'Aucun ressenti sélectionné à analyser.', 'No feelings selected to analyze.', 'Tidak ada perasaan yang dipilih untuk dianalisis.');
SELECT add_translation('results.personalized_insights', 'results', 'Insights personnalisés', '✨ Insights personnalisés', '✨ Personalized insights', '✨ Wawasan yang dipersonalisasi');
SELECT add_translation('results.download_pdf', 'results', 'Télécharger le PDF', 'Télécharger mon rapport PDF', 'Download my PDF report', 'Unduh laporan PDF saya');
SELECT add_translation('results.premium_feature', 'results', 'Fonctionnalité premium', 'Fonctionnalité premium', 'Premium feature', 'Fitur premium');
SELECT add_translation('results.view_dashboard', 'results', 'Voir le tableau de bord', 'Voir mon tableau de bord', 'View my dashboard', 'Lihat dasbor saya');
SELECT add_translation('results.new_scan', 'results', 'Nouveau scan', 'Refaire un scan', 'Do another scan', 'Lakukan pemindaian lain');
SELECT add_translation('results.share_results', 'results', 'Partager les résultats', 'Partager mes résultats', 'Share my results', 'Bagikan hasil saya');
SELECT add_translation('results.daily_reading', 'results', 'Tirage énergétique du jour', 'Tirage énergétique du jour', 'Daily energy reading', 'Bacaan energi harian');
SELECT add_translation('results.closing_message', 'results', 'Message de clôture', '"Tu es exactement là où tu dois être. Continue à t''écouter avec amour."', '"You are exactly where you need to be. Continue to listen to yourself with love."', '"Anda berada tepat di mana Anda perlu berada. Teruslah mendengarkan diri Anda dengan cinta."');
SELECT add_translation('results.loading', 'results', 'Chargement des résultats', 'Analyse des énergies en cours...', 'Analyzing energies...', 'Menganalisis energi...');
SELECT add_translation('results.interpreting', 'results', 'Interprétation des résultats', 'Nous interprétons tes ressentis', 'We are interpreting your feelings', 'Kami menafsirkan perasaan Anda');

-- Niveaux d'énergie
SELECT add_translation('energy.flourishing', 'results', 'Énergie florissante', 'Énergie florissante ✨', 'Flourishing energy ✨', 'Energi berkembang ✨');
SELECT add_translation('energy.balanced', 'results', 'Énergie équilibrée', 'Énergie équilibrée 🌸', 'Balanced energy 🌸', 'Energi seimbang 🌸');
SELECT add_translation('energy.fluctuating', 'results', 'Énergie fluctuante', 'Énergie fluctuante 🌊', 'Fluctuating energy 🌊', 'Energi berfluktuasi 🌊');
SELECT add_translation('energy.demanding', 'results', 'Énergie en demande', 'Énergie en demande 🍃', 'Energy in demand 🍃', 'Energi yang menuntut 🍃');
SELECT add_translation('energy.resting', 'results', 'Énergie en repos', 'Énergie en repos profond 🌙', 'Deep resting energy 🌙', 'Energi istirahat dalam 🌙');

-- Centres HD
SELECT add_translation('hd.throat', 'results', 'Centre de la gorge', 'Gorge', 'Throat', 'Tenggorokan');
SELECT add_translation('hd.throat.desc', 'results', 'Description du centre de la gorge', 'Communication, expression, manifestation', 'Communication, expression, manifestation', 'Komunikasi, ekspresi, manifestasi');
SELECT add_translation('hd.heart', 'results', 'Centre du cœur', 'Cœur', 'Heart', 'Jantung');
SELECT add_translation('hd.heart.desc', 'results', 'Description du centre du cœur', 'Volonté, détermination, vitalité', 'Will, determination, vitality', 'Kemauan, tekad, vitalitas');
SELECT add_translation('hd.solar_plexus', 'results', 'Centre du plexus solaire', 'Plexus Solaire', 'Solar Plexus', 'Pleksus Surya');
SELECT add_translation('hd.solar_plexus.desc', 'results', 'Description du centre du plexus solaire', 'Émotions, sensibilité, intuition', 'Emotions, sensitivity, intuition', 'Emosi, sensitivitas, intuisi');
SELECT add_translation('hd.sacral', 'results', 'Centre sacral', 'Sacral', 'Sacral', 'Sakral');
SELECT add_translation('hd.sacral.desc', 'results', 'Description du centre sacral', 'Énergie vitale, créativité, sexualité', 'Vital energy, creativity, sexuality', 'Energi vital, kreativitas, seksualitas');
SELECT add_translation('hd.root', 'results', 'Centre racine', 'Racine', 'Root', 'Akar');
SELECT add_translation('hd.root.desc', 'results', 'Description du centre racine', 'Stress, pression, survie', 'Stress, pressure, survival', 'Stres, tekanan, kelangsungan hidup');
SELECT add_translation('hd.spleen', 'results', 'Centre de la rate', 'Rate', 'Spleen', 'Limpa');
SELECT add_translation('hd.spleen.desc', 'results', 'Description du centre de la rate', 'Intuition, système immunitaire, peur', 'Intuition, immune system, fear', 'Intuisi, sistem kekebalan, ketakutan');
SELECT add_translation('hd.g_center', 'results', 'Centre G', 'G-Center', 'G-Center', 'Pusat-G');
SELECT add_translation('hd.g_center.desc', 'results', 'Description du centre G', 'Identité, amour, direction', 'Identity, love, direction', 'Identitas, cinta, arah');
SELECT add_translation('hd.ajna', 'results', 'Centre ajna', 'Ajna', 'Ajna', 'Ajna');
SELECT add_translation('hd.ajna.desc', 'results', 'Description du centre ajna', 'Mental, conceptualisation, certitude', 'Mental, conceptualization, certainty', 'Mental, konseptualisasi, kepastian');
SELECT add_translation('hd.head', 'results', 'Centre de la tête', 'Tête', 'Head', 'Kepala');
SELECT add_translation('hd.head.desc', 'results', 'Description du centre de la tête', 'Inspiration, questions, pression mentale', 'Inspiration, questions, mental pressure', 'Inspirasi, pertanyaan, tekanan mental');

-- Tableau de bord
SELECT add_translation('dashboard.welcome', 'dashboard', 'Message de bienvenue', 'Bienvenue, {name}', 'Welcome, {name}', 'Selamat datang, {name}');
SELECT add_translation('dashboard.subtitle', 'dashboard', 'Sous-titre du tableau de bord', 'Voici ton tableau de bord énergétique personnalisé', 'Here is your personalized energy dashboard', 'Inilah dasbor energi personal Anda');
SELECT add_translation('dashboard.new_scan', 'dashboard', 'Nouveau scan', 'Nouveau scan énergétique', 'New energy scan', 'Pemindaian energi baru');
SELECT add_translation('dashboard.refresh', 'dashboard', 'Actualiser', 'Actualiser', 'Refresh', 'Segarkan');
SELECT add_translation('dashboard.overview', 'dashboard', 'Onglet aperçu', 'Aperçu', 'Overview', 'Ikhtisar');
SELECT add_translation('dashboard.history', 'dashboard', 'Onglet historique', 'Historique', 'History', 'Riwayat');
SELECT add_translation('dashboard.analytics', 'dashboard', 'Onglet analyses', 'Analyses', 'Analytics', 'Analitik');
SELECT add_translation('dashboard.reminders', 'dashboard', 'Onglet rappels', 'Rappels', 'Reminders', 'Pengingat');
SELECT add_translation('dashboard.category_scores', 'dashboard', 'Scores par catégorie', 'Résultats par dimension', 'Results by dimension', 'Hasil berdasarkan dimensi');
SELECT add_translation('dashboard.energy_state', 'dashboard', 'État énergétique', 'État énergétique actuel', 'Current energy state', 'Keadaan energi saat ini');
SELECT add_translation('dashboard.energy_trend', 'dashboard', 'Tendance énergétique', 'Tendance énergétique', 'Energy trend', 'Tren energi');
SELECT add_translation('dashboard.recent_scans', 'dashboard', 'Scans récents', 'Scans récents', 'Recent scans', 'Pemindaian terbaru');
SELECT add_translation('dashboard.hd_centers', 'dashboard', 'Centres HD', 'Centres HD les plus actifs', 'Most active HD centers', 'Pusat HD paling aktif');
SELECT add_translation('dashboard.no_data', 'dashboard', 'Aucune donnée', 'Aucune donnée disponible', 'No data available', 'Tidak ada data tersedia');
SELECT add_translation('dashboard.loading', 'dashboard', 'Chargement du tableau de bord', 'Chargement de votre tableau de bord...', 'Loading your dashboard...', 'Memuat dasbor Anda...');
SELECT add_translation('dashboard.user', 'dashboard', 'Utilisateur par défaut', 'Utilisatrice', 'User', 'Pengguna');

-- Paramètres
SELECT add_translation('settings.title', 'settings', 'Titre des paramètres', 'Paramètres', 'Settings', 'Pengaturan');
SELECT add_translation('settings.subtitle', 'settings', 'Sous-titre des paramètres', 'Personnalisez votre expérience Baromètre Énergétique', 'Customize your Energy Barometer experience', 'Sesuaikan pengalaman Barometer Energi Anda');
SELECT add_translation('settings.general', 'settings', 'Onglet général', 'Général', 'General', 'Umum');
SELECT add_translation('settings.hd_type', 'settings', 'Onglet type HD', 'Human Design', 'Human Design', 'Human Design');
SELECT add_translation('settings.notifications', 'settings', 'Onglet notifications', 'Notifications', 'Notifications', 'Notifikasi');
SELECT add_translation('settings.security', 'settings', 'Onglet sécurité', 'Sécurité', 'Security', 'Keamanan');
SELECT add_translation('settings.dark_mode', 'settings', 'Mode sombre', 'Mode sombre', 'Dark mode', 'Mode gelap');
SELECT add_translation('settings.dark_mode.desc', 'settings', 'Description du mode sombre', 'Adaptez l''interface à votre confort visuel', 'Adapt the interface to your visual comfort', 'Sesuaikan antarmuka dengan kenyamanan visual Anda');
SELECT add_translation('settings.dark_mode.night', 'settings', 'Mode nuit', 'Mode Nuit', 'Night Mode', 'Mode Malam');
SELECT add_translation('settings.dark_mode.day', 'settings', 'Mode jour', 'Mode Jour', 'Day Mode', 'Mode Siang');
SELECT add_translation('settings.language', 'settings', 'Langue', 'Langue', 'Language', 'Bahasa');
SELECT add_translation('settings.language.description', 'settings', 'Description de la langue', 'Choisissez la langue de l''application', 'Choose the application language', 'Pilih bahasa aplikasi');
SELECT add_translation('settings.hd_type.title', 'settings', 'Titre du type HD', 'Votre Type Human Design', 'Your Human Design Type', 'Tipe Human Design Anda');
SELECT add_translation('settings.hd_type.desc', 'settings', 'Description du type HD', 'Votre type HD détermine l''analyse de vos résultats et les conseils personnalisés que vous recevez.', 'Your HD type determines the analysis of your results and the personalized advice you receive.', 'Tipe HD Anda menentukan analisis hasil Anda dan saran personal yang Anda terima.');
SELECT add_translation('settings.security.title', 'settings', 'Titre de la sécurité', 'Sécurité du compte', 'Account security', 'Keamanan akun');
SELECT add_translation('settings.security.desc', 'settings', 'Description de la sécurité', 'Gérez la sécurité de votre compte et vos préférences de confidentialité.', 'Manage your account security and privacy preferences.', 'Kelola keamanan akun dan preferensi privasi Anda.');
SELECT add_translation('settings.change_password', 'settings', 'Changer le mot de passe', 'Modifier le mot de passe', 'Change password', 'Ubah kata sandi');
SELECT add_translation('settings.logout', 'settings', 'Déconnexion', 'Déconnexion', 'Logout', 'Keluar');
SELECT add_translation('settings.logout.desc', 'settings', 'Description de la déconnexion', 'Déconnectez-vous de votre compte sur cet appareil.', 'Log out of your account on this device.', 'Keluar dari akun Anda di perangkat ini.');
SELECT add_translation('settings.danger_zone', 'settings', 'Zone de danger', 'Zone de danger', 'Danger zone', 'Zona bahaya');
SELECT add_translation('settings.danger_zone.desc', 'settings', 'Description de la zone de danger', 'Ces actions sont irréversibles. Procédez avec prudence.', 'These actions are irreversible. Proceed with caution.', 'Tindakan ini tidak dapat diubah. Lanjutkan dengan hati-hati.');
SELECT add_translation('settings.delete_account', 'settings', 'Supprimer le compte', 'Supprimer mon compte', 'Delete my account', 'Hapus akun saya');
SELECT add_translation('settings.save_hd_type', 'settings', 'Sauvegarder le type HD', 'Sauvegarder mon type HD', 'Save my HD type', 'Simpan tipe HD saya');

-- Authentification
SELECT add_translation('auth.login', 'auth', 'Titre de connexion', 'Connexion', 'Login', 'Masuk');
SELECT add_translation('auth.register', 'auth', 'Titre d''inscription', 'Créer un compte', 'Create an account', 'Buat akun');
SELECT add_translation('auth.login.subtitle', 'auth', 'Sous-titre de connexion', 'Accédez à votre tableau de bord énergétique', 'Access your energy dashboard', 'Akses dasbor energi Anda');
SELECT add_translation('auth.register.subtitle', 'auth', 'Sous-titre d''inscription', 'Rejoignez notre communauté de femmes conscientes', 'Join our community of conscious women', 'Bergabunglah dengan komunitas wanita sadar kami');
SELECT add_translation('auth.name', 'auth', 'Champ nom', 'Nom', 'Name', 'Nama');
SELECT add_translation('auth.email', 'auth', 'Champ email', 'Email', 'Email', 'Email');
SELECT add_translation('auth.password', 'auth', 'Champ mot de passe', 'Mot de passe', 'Password', 'Kata sandi');
SELECT add_translation('auth.hdType', 'auth', 'Champ type HD', 'Type Human Design', 'Human Design Type', 'Tipe Human Design');
SELECT add_translation('auth.bio', 'auth', 'Champ bio', 'Bio', 'Bio', 'Bio');
SELECT add_translation('auth.login.button', 'auth', 'Bouton de connexion', 'Se connecter', 'Login', 'Masuk');
SELECT add_translation('auth.register.button', 'auth', 'Bouton d''inscription', 'Créer un compte', 'Create an account', 'Buat akun');
SELECT add_translation('auth.forgot_password', 'auth', 'Mot de passe oublié', 'Mot de passe oublié ?', 'Forgot password?', 'Lupa kata sandi?');
SELECT add_translation('auth.no_account', 'auth', 'Pas de compte', 'Pas encore de compte ? Créez-en un', 'Don''t have an account yet? Create one', 'Belum punya akun? Buat satu');
SELECT add_translation('auth.have_account', 'auth', 'Déjà un compte', 'Déjà un compte ? Connectez-vous', 'Already have an account? Log in', 'Sudah punya akun? Masuk');

-- Premium
SELECT add_translation('premium.content', 'premium', 'Contenu premium', 'Contenu premium', 'Premium content', 'Konten premium');
SELECT add_translation('premium.click_to_unlock', 'premium', 'Cliquer pour débloquer', 'Cliquez pour débloquer', 'Click to unlock', 'Klik untuk membuka');
SELECT add_translation('premium.free_trials_remaining', 'premium', 'Essais gratuits restants', '{count} essais gratuits restants', '{count} free trials remaining', '{count} uji coba gratis tersisa');
SELECT add_translation('premium.daily_reading.title', 'premium', 'Tirage énergétique du jour', 'Tirage énergétique du jour', 'Daily energy reading', 'Bacaan energi harian');
SELECT add_translation('premium.daily_reading.description', 'premium', 'Description du tirage énergétique', 'Recevez un tirage énergétique et un mantra personnalisé pour vous guider tout au long de la journée.', 'Receive a personalized energy reading and mantra to guide you throughout the day.', 'Terima bacaan energi dan mantra yang dipersonalisasi untuk memandu Anda sepanjang hari.');
SELECT add_translation('premium.unlock_category.emotional', 'premium', 'Débloquer la catégorie émotionnelle', 'Débloquez la catégorie Émotionnelle', 'Unlock the Emotional category', 'Buka kategori Emosional');
SELECT add_translation('premium.unlock_category.physical', 'premium', 'Débloquer la catégorie physique', 'Débloquez la catégorie Physique', 'Unlock the Physical category', 'Buka kategori Fisik');
SELECT add_translation('premium.unlock_category.description.emotional', 'premium', 'Description du déblocage émotionnel', 'Accédez à une analyse approfondie de votre état émotionnel et recevez des conseils personnalisés.', 'Access an in-depth analysis of your emotional state and receive personalized advice.', 'Akses analisis mendalam tentang keadaan emosional Anda dan terima saran yang dipersonalisasi.');
SELECT add_translation('premium.unlock_category.description.physical', 'premium', 'Description du déblocage physique', 'Accédez à une analyse approfondie de votre état physique et recevez des conseils personnalisés.', 'Access an in-depth analysis of your physical state and receive personalized advice.', 'Akses analisis mendalam tentang keadaan fisik Anda dan terima saran yang dipersonalisasi.');

-- Administration
SELECT add_translation('admin.access', 'admin', 'Accès administrateur', 'Accès Admin Temporaire', 'Temporary Admin Access', 'Akses Admin Sementara');
SELECT add_translation('admin.title', 'admin', 'Titre de l''administration', 'Console Admin', 'Admin Console', 'Konsol Admin');
SELECT add_translation('admin.subtitle', 'admin', 'Sous-titre de l''administration', 'Baromètre Énergétique', 'Energy Barometer', 'Barometer Energi');
SELECT add_translation('admin.users', 'admin', 'Utilisateurs', 'Utilisatrices', 'Users', 'Pengguna');
SELECT add_translation('admin.content', 'admin', 'Contenu', 'Contenu', 'Content', 'Konten');
SELECT add_translation('admin.analytics', 'admin', 'Statistiques', 'Statistiques', 'Statistics', 'Statistik');
SELECT add_translation('admin.notifications', 'admin', 'Notifications', 'Notifications', 'Notifications', 'Notifikasi');
SELECT add_translation('admin.database', 'admin', 'Base de données', 'Base de données', 'Database', 'Database');
SELECT add_translation('admin.settings', 'admin', 'Paramètres', 'Paramètres', 'Settings', 'Pengaturan');
SELECT add_translation('admin.tools', 'admin', 'Outils admin', 'Outils admin', 'Admin tools', 'Alat admin');
SELECT add_translation('admin.loading', 'admin', 'Chargement de l''administration', 'Chargement de la console d''administration...', 'Loading admin console...', 'Memuat konsol admin...');
SELECT add_translation('admin.database.title', 'admin', 'Titre de la base de données', 'Gestion de la base de données', 'Database Management', 'Manajemen Database');
SELECT add_translation('admin.database.subtitle', 'admin', 'Sous-titre de la base de données', 'Cette fonctionnalité sera disponible prochainement.', 'This feature will be available soon.', 'Fitur ini akan segera tersedia.');
SELECT add_translation('admin.notifications.title', 'admin', 'Titre des notifications', 'Gestion des notifications', 'Notifications Management', 'Manajemen Notifikasi');
SELECT add_translation('admin.notifications.subtitle', 'admin', 'Sous-titre des notifications', 'Cette fonctionnalité sera disponible prochainement.', 'This feature will be available soon.', 'Fitur ini akan segera tersedia.');