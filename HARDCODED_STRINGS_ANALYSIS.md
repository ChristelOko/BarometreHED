# Analyse exhaustive des chaînes de caractères codées en dur

## 🔍 **Fichiers analysés et occurrences trouvées**

### **1. src/components/common/Alert.tsx**
- **Ligne 45** : `"Erreur lors du chargement du contenu"`
- **Clé suggérée** : `system.errors.content_loading`

### **2. src/components/common/Button.tsx**
- **Ligne 38** : Variable `buttonText` déclarée mais non utilisée
- **Action** : Supprimer la variable inutilisée

### **3. src/components/common/ConfirmationDialog.tsx**
- **Ligne 89** : `"Parfait ! 🌸"`
- **Clé suggérée** : `buttons.perfect`

### **4. src/components/common/LoadingScreen.tsx**
- **Ligne 8** : `"Harmonisation des énergies..."`
- **Clé suggérée** : `system.loading.energy_harmonization`

### **5. src/components/dashboard/CategoryScores.tsx**
- **Ligne 25** : `"Erreur lors du chargement des scores par catégorie"`
- **Clé suggérée** : `system.errors.category_scores_loading`
- **Ligne 71** : `"Résultats par dimension"`
- **Clé suggérée** : `dashboard.category_scores.title`
- **Ligne 78** : `"Général"`, `"Émotionnel"`, `"Physique"`
- **Clés suggérées** : `categories.general`, `categories.emotional`, `categories.physical`
- **Ligne 120** : `"Aucun scan"`, `"Statut"`, `"Aucune donnée disponible"`
- **Clés suggérées** : `dashboard.no_scan`, `dashboard.status`, `dashboard.no_data`

### **6. src/components/dashboard/CenterFrequency.tsx**
- **Ligne 11-20** : Noms des centres HD
- **Clés suggérées** : `hd_centers.throat`, `hd_centers.heart`, etc.
- **Ligne 67** : `"Centres HD les plus actifs"`
- **Clé suggérée** : `dashboard.center_frequency.title`
- **Ligne 72** : `"Aucune donnée disponible"`
- **Clé suggérée** : `dashboard.no_data`

### **7. src/components/dashboard/EnergyTrend.tsx**
- **Ligne 15-25** : `"En amélioration"`, `"En diminution"`, `"Stable"`
- **Clés suggérées** : `dashboard.trends.improving`, `dashboard.trends.declining`, `dashboard.trends.stable`
- **Ligne 50** : `"Tendance énergétique"`
- **Clé suggérée** : `dashboard.energy_trend.title`
- **Ligne 65** : `"Score énergétique moyen"`
- **Clé suggérée** : `dashboard.energy_trend.average_score`

### **8. src/components/dashboard/RecentScans.tsx**
- **Ligne 40** : `"Erreur lors du chargement des données"`
- **Clé suggérée** : `system.errors.data_loading`
- **Ligne 75** : `"Énergie équilibrée"`
- **Clé suggérée** : `dashboard.recent_scans.balanced_energy`
- **Ligne 79-85** : `"Score moyen"`, `"Centre principal"`, `"Tendance"`
- **Clés suggérées** : `dashboard.stats.average_score`, `dashboard.stats.main_center`, `dashboard.stats.trend`

### **9. src/components/dashboard/RemindersTab.tsx**
- **Ligne 100+** : Nombreux textes d'interface
- **Clés suggérées** : `reminders.title`, `reminders.description`, etc.

### **10. src/components/home/DailyEnergySection.tsx**
- **Ligne 20** : `"Chargement de l'énergie du jour..."`
- **Clé suggérée** : `system.loading.daily_energy`
- **Ligne 35** : `"Ton énergie quotidienne"`
- **Clé suggérée** : `home.daily_energy.title`

### **11. src/components/layout/Header.tsx**
- **Ligne 50** : `"Déconnexion réussie"`
- **Clé suggérée** : `system.success.logout`
- **Ligne 65** : `"Accueil"`, `"Diagnostic"`, `"Tableau de Bord"`, `"À propos"`
- **Clés suggérées** : `navigation.home`, `navigation.scan`, `navigation.dashboard`, `navigation.about`
- **Ligne 75** : `"Connexion"`
- **Clé suggérée** : `navigation.login`

### **12. src/components/results/EnergyGauge.tsx**
- **Ligne 35-40** : Messages d'énergie
- **Clés suggérées** : `energy_levels.flourishing`, `energy_levels.balanced`, etc.

### **13. src/components/results/GuidanceCard.tsx**
- **Ligne 50+** : Éléments et pratiques HD
- **Clés suggérées** : `hd_elements.ether`, `hd_practices.voice_expression`, etc.

### **14. src/components/results/HDCenterDisplay.tsx**
- **Ligne 8-25** : Descriptions des centres HD
- **Clés suggérées** : `hd_centers.throat.title`, `hd_centers.throat.description`, etc.

### **15. src/components/settings/NotificationSettings.tsx**
- **Ligne 50+** : Interface des paramètres de notification
- **Clés suggérées** : `settings.notifications.title`, `settings.notifications.description`, etc.

### **16. src/pages/About.tsx**
- **Ligne 15** : `"À propos du Baromètre Énergétique"`
- **Clé suggérée** : `about.title`
- **Ligne 25+** : Tout le contenu de la page
- **Clés suggérées** : `about.introduction`, `about.team.christel`, etc.

### **17. src/pages/Contact.tsx**
- **Ligne 20** : `"Contactez-nous"`
- **Clé suggérée** : `contact.title`
- **Ligne 30+** : Formulaire et contenu
- **Clés suggérées** : `contact.form.title`, `contact.form.name`, etc.

### **18. src/pages/Dashboard.tsx**
- **Ligne 50+** : Interface du tableau de bord
- **Clés suggérées** : `dashboard.welcome`, `dashboard.tabs.overview`, etc.

### **19. src/pages/Help.tsx**
- **Ligne 15** : `"Centre d'aide"`
- **Clé suggérée** : `help.title`
- **Ligne 20+** : FAQ et contenu
- **Clés suggérées** : `help.faq.hd_question`, `help.faq.hd_answer`, etc.

### **20. src/pages/Legal.tsx**
- **Ligne 10** : `"Mentions légales"`
- **Clé suggérée** : `legal.title`
- **Ligne 15+** : Contenu légal
- **Clés suggérées** : `legal.editor`, `legal.data_protection`, etc.

### **21. src/pages/Login.tsx**
- **Ligne 30+** : Formulaire de connexion
- **Clés suggérées** : `auth.login.title`, `auth.register.title`, etc.

### **22. src/pages/Results.tsx**
- **Ligne 50+** : Page de résultats
- **Clés suggérées** : `results.welcome`, `results.analysis_title`, etc.

### **23. src/pages/scan/categories/GeneralCategory.tsx**
- **Ligne 15+** : Tous les ressentis et descriptions
- **Clés suggérées** : `scan.general.title`, `feelings.positive.alive`, etc.

### **24. src/pages/scan/categories/EmotionalCategory.tsx**
- **Ligne 15+** : Ressentis émotionnels
- **Clés suggérées** : `scan.emotional.title`, `feelings.emotional.serene`, etc.

### **25. src/pages/scan/categories/PhysicalCategory.tsx**
- **Ligne 15+** : Ressentis physiques
- **Clés suggérées** : `scan.physical.title`, `feelings.physical.energetic`, etc.

### **26. src/pages/scan/Scan.tsx**
- **Ligne 30+** : Interface de scan
- **Clés suggérées** : `scan.welcome.title`, `scan.category_selection`, etc.

### **27. src/pages/ScanDetails.tsx**
- **Ligne 30+** : Détails du scan
- **Clés suggérées** : `scan_details.title`, `scan_details.category`, etc.

### **28. src/pages/profile/Profile.tsx**
- **Ligne 50+** : Interface de profil
- **Clés suggérées** : `profile.title`, `profile.personal_info`, etc.

### **29. src/pages/profile/Settings.tsx**
- **Ligne 30+** : Paramètres utilisateur
- **Clés suggérées** : `settings.title`, `settings.general`, etc.

## 📊 **Statistiques**
- **Total de fichiers analysés** : 29
- **Total d'occurrences trouvées** : ~500+
- **Catégories principales** :
  - Messages système (erreurs, succès, chargement)
  - Interface utilisateur (boutons, labels, titres)
  - Contenu métier (ressentis, centres HD, guidance)
  - Navigation et menus
  - Formulaires et validation

## 🎯 **Recommandations**
1. **Priorité 1** : Messages système et erreurs
2. **Priorité 2** : Navigation et interface principale
3. **Priorité 3** : Contenu métier spécialisé
4. **Priorité 4** : Textes longs et descriptions

## 🔧 **Actions à effectuer**
1. Créer les entrées dans la base de données `content_pages`
2. Remplacer les chaînes codées en dur par des appels aux hooks de contenu
3. Tester l'affichage avec les nouvelles clés
4. Valider la cohérence des traductions