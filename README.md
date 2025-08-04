# Baromètre Énergétique

Application de diagnostic énergétique basée sur le Human Design pour les femmes.

## Fonctionnalités

- Diagnostic énergétique personnalisé
- Analyse basée sur le Human Design
- Suivi de l'évolution énergétique
- Conseils et pratiques adaptés

## Configuration technique

### Prérequis

- Node.js 18+
- Supabase (base de données et authentification)

### Installation

1. Cloner le dépôt
2. Installer les dépendances : `npm install`
3. Créer un fichier `.env` à la racine du projet avec les variables suivantes :
   ```
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
   VITE_FOUNDER_EMAIL=email_de_la_fondatrice
   ```

   - `VITE_FOUNDER_EMAIL` : adresse email de la fondatrice disposant d'un accès administrateur permanent.

### Développement

- Lancer le serveur de développement : `npm run dev`
- Tester la connexion à Supabase : `npm run test-connection`

### Déploiement

- Construire l'application : `npm run build`
- Prévisualiser la version de production : `npm run preview`

## Edge Functions

L'application utilise des Edge Functions Supabase pour gérer les CORS et certaines fonctionnalités spécifiques.

### cors-proxy

Cette fonction sert d'intermédiaire entre le frontend et la base de données Supabase, en ajoutant les headers CORS nécessaires.

Pour déployer cette fonction :

```bash
supabase functions deploy cors-proxy
```

### make-admin

Cette fonction permet de promouvoir un utilisateur au rôle d'administrateur.

Pour déployer cette fonction :

```bash
supabase functions deploy make-admin
```

## Structure du projet

- `src/` : Code source de l'application
  - `components/` : Composants React réutilisables
  - `pages/` : Pages de l'application
  - `services/` : Services pour l'accès aux données
  - `store/` : État global avec Zustand
  - `context/` : Contextes React (thème, langue, etc.)
  - `hooks/` : Hooks personnalisés
  - `utils/` : Fonctions utilitaires
- `supabase/` : Configuration et fonctions Supabase
  - `functions/` : Edge Functions
  - `migrations/` : Migrations de base de données

## Gestion des CORS

Pour contourner les limitations CORS, nous utilisons une Edge Function Supabase (`cors-proxy`) qui sert d'intermédiaire entre le frontend et la base de données. Cette fonction ajoute les headers CORS nécessaires à toutes les réponses.

## Internationalisation

L'application supporte plusieurs langues :
- Français (par défaut)
- Anglais
- Indonésien

La gestion des traductions est assurée par un contexte React qui charge les traductions depuis la base de données.