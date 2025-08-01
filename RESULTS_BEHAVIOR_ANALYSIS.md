# Comportement des sections de la page Résultats par catégorie

## 🎯 Vue d'ensemble

La page `/results` contient **6 sections principales** qui s'adaptent dynamiquement selon la catégorie de diagnostic choisie :

---

## 📊 1. Section "Message de bienvenue"

### Comportement :
- **Identique pour toutes les catégories**
- Affiche : `"Bonjour {nom} 🌸"`
- Date du diagnostic
- **Ne change pas** selon la catégorie

---

## ⚡ 2. Section "Jauge énergétique" (EnergyGauge)

### Comportement par catégorie :

#### **Général :**
- Jauge avec animation fluide
- Couleurs selon le score global
- Message : "Énergie florissante ✨" / "Énergie équilibrée 🌸" etc.
- Affiche les centres HD affectés

#### **Émotionnel :**
- **Même jauge** mais score basé sur l'état émotionnel
- Couleurs plus douces (tons pastel)
- Messages adaptés : "Cœur en harmonie 💗" / "Émotions en transition 🌊"

#### **Physique :**
- **Même jauge** mais score basé sur l'état physique
- Couleurs plus terre (verts, bruns)
- Messages adaptés : "Corps énergique 🌱" / "Corps en repos 🌙"

---

## 🎯 3. Section "Centre HD affecté" (HDCenterDisplay)

### Comportement par catégorie :

#### **Général :**
- Détermine le centre selon **tous les ressentis** sélectionnés
- Centres fréquents : G-Center, Plexus Solaire, Rate

#### **Émotionnel :**
- Focus sur les centres émotionnels :
  - **Plexus Solaire** (émotions)
  - **Cœur** (volonté/amour)
  - **G-Center** (identité)

#### **Physique :**
- Focus sur les centres physiques :
  - **Sacral** (vitalité)
  - **Rate** (immunité)
  - **Racine** (ancrage)

---

## 🌟 4. Section "Carte de Guidance" (GuidanceCard)

### Comportement par catégorie :

#### **Général :**
```javascript
// Guidance générale basée sur le score global
guidance: "Concentrez-vous sur l'équilibre global..."
element: "Équilibre"
practice: "Méditation, repos, reconnexion"
```

#### **Émotionnel :**
```javascript
// Guidance émotionnelle spécifique
guidance: "Accueillez vos émotions avec douceur..."
element: "Eau" (fluidité émotionnelle)
practice: "Journal émotionnel, bain relaxant, respiration"
```

#### **Physique :**
```javascript
// Guidance physique spécifique
guidance: "Écoutez les besoins de votre corps..."
element: "Terre" (ancrage physique)
practice: "Mouvement doux, automassage, repos"
```

---

## 📝 5. Section "Analyse des ressentis" (FeelingsSection)

### Comportement par catégorie :

#### **Général :**
- Affiche **7 ressentis positifs** + **7 ressentis négatifs**
- Exemples :
  - ✨ "Je me sens profondément vivante"
  - 🍂 "Lourdeur diffuse"

#### **Émotionnel :**
- Affiche **5 ressentis positifs** + **5 ressentis négatifs**
- Exemples :
  - 💗 "Je me sens sereine et confiante"
  - 🌊 "Je ressens de l'anxiété"

#### **Physique :**
- Affiche **5 ressentis positifs** + **5 ressentis négatifs**
- Exemples :
  - 🌱 "Je me sens énergique et vitale"
  - 😴 "Je ressens de la fatigue"

### Structure des cartes de ressentis :
Chaque ressenti contient :
- **Description** détaillée
- **Origine probable**
- **Centres HD affectés** (différents selon la catégorie)
- **Phrase miroir**
- **Exercice de réalignement**
- **Encouragement**

---

## 🎨 6. Section "Boutons d'action"

### Comportement :
- **Identique pour toutes les catégories**
- "Voir mon tableau de bord"
- "Refaire un scan"

---

## 🔄 Logique de calcul des scores

### **Général :**
```javascript
// Score basé sur ratio positifs/négatifs
const score = (positiveCount/totalPositive * 100 * 0.5) + 
              ((1 - negativeCount/totalNegative) * 100 * 0.5)
```

### **Émotionnel :**
```javascript
// Même logique mais avec ressentis émotionnels uniquement
// Pondération différente pour les émotions
```

### **Physique :**
```javascript
// Même logique mais avec ressentis physiques uniquement
// Pondération différente pour le corps
```

---

## 🎯 Centres HD par catégorie

### **Général :**
- Tous les 9 centres possibles
- Déterminé par l'ensemble des ressentis

### **Émotionnel :**
- **Plexus Solaire** (principal)
- **Cœur**
- **G-Center**
- **Gorge** (expression)

### **Physique :**
- **Sacral** (principal)
- **Rate** (immunité)
- **Racine** (ancrage)
- **Cœur** (vitalité)

---

## 💡 Résumé

**Sections qui changent selon la catégorie :**
1. ⚡ **Jauge énergétique** - couleurs et messages adaptés
2. 🎯 **Centre HD** - centres spécifiques à chaque catégorie
3. 🌟 **Guidance** - conseils personnalisés par catégorie
4. 📝 **Ressentis** - listes différentes par catégorie

**Sections identiques :**
1. 👋 **Message de bienvenue**
2. 🔄 **Boutons d'action**

Chaque catégorie offre une **expérience personnalisée** avec des ressentis, centres HD et guidances spécifiques à son domaine (général, émotionnel, physique).