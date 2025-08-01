/**
 * Système de design unifié pour le Baromètre Énergétique
 * Centralise toutes les constantes de design pour assurer la cohérence
 */

// 🎨 Couleurs des types Human Design (standardisées)
export const HD_TYPE_COLORS = {
  generator: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    accent: '#22C55E'
  },
  projector: {
    bg: 'bg-blue-100',
    text: 'text-blue-800', 
    border: 'border-blue-200',
    accent: '#3B82F6'
  },
  'manifesting-generator': {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    accent: '#8B5CF6'
  },
  manifestor: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    accent: '#EF4444'
  },
  reflector: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    accent: '#F59E0B'
  }
} as const;

// 🎯 Couleurs des centres HD (standardisées)
export const HD_CENTER_COLORS = {
  'throat': { bg: 'bg-blue-500', text: 'text-blue-500', accent: '#3B82F6' },
  'heart': { bg: 'bg-red-500', text: 'text-red-500', accent: '#EF4444' },
  'solar-plexus': { bg: 'bg-yellow-500', text: 'text-yellow-600', accent: '#EAB308' },
  'sacral': { bg: 'bg-orange-500', text: 'text-orange-500', accent: '#F97316' },
  'root': { bg: 'bg-red-800', text: 'text-red-800', accent: '#991B1B' },
  'spleen': { bg: 'bg-indigo-500', text: 'text-indigo-500', accent: '#6366F1' },
  'g-center': { bg: 'bg-green-500', text: 'text-green-500', accent: '#22C55E' },
  'ajna': { bg: 'bg-teal-500', text: 'text-teal-500', accent: '#14B8A6' },
  'head': { bg: 'bg-purple-500', text: 'text-purple-500', accent: '#8B5CF6' }
} as const;

// 📊 Couleurs des catégories (standardisées)
export const CATEGORY_COLORS = {
  general: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', accent: '#A87878' },
  emotional: { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/20', accent: '#9F85AF' },
  physical: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/20', accent: '#E4C997' },
  mental: { bg: 'bg-teal-500/10', text: 'text-teal-500', border: 'border-teal-500/20', accent: '#14B8A6' },
  digestive: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', accent: '#F59E0B' },
  somatic: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/20', accent: '#6366F1' },
  energetic: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', accent: '#8B5CF6' },
  feminine_cycle: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20', accent: '#EC4899' },
  hd_specific: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', accent: '#3B82F6' }
} as const;

// 📏 Espacements standardisés
export const SPACING = {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
  xxl: '4rem'     // 64px
} as const;

// 📱 Breakpoints standardisés
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// 🔤 Typographie standardisée
export const TYPOGRAPHY = {
  display: {
    xl: 'text-4xl md:text-5xl font-display',
    lg: 'text-3xl md:text-4xl font-display',
    md: 'text-2xl md:text-3xl font-display',
    sm: 'text-xl md:text-2xl font-display'
  },
  heading: {
    lg: 'text-xl md:text-2xl font-display',
    md: 'text-lg md:text-xl font-display',
    sm: 'text-base md:text-lg font-display'
  },
  body: {
    lg: 'text-lg',
    md: 'text-base',
    sm: 'text-sm'
  }
} as const;

// 🎯 Classes de boutons standardisées
export const BUTTON_STYLES = {
  back: 'bg-white/95 backdrop-blur-sm border-primary/30 text-primary hover:bg-white shadow-sm',
  primary: 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl',
  outline: 'border-2 border-primary/30 hover:border-primary/50 text-primary hover:bg-primary/10'
} as const;

// 📦 Classes de cartes standardisées
export const CARD_STYLES = {
  default: 'bg-white rounded-xl p-6 shadow-sm border border-neutral/10 hover:shadow-md transition-shadow',
  elevated: 'bg-white rounded-2xl p-8 shadow-lg border border-neutral/10 hover:shadow-xl transition-all',
  gradient: 'bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20'
} as const;

// 🎭 Animations standardisées
export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 }
  }
} as const;

// 🔧 Fonctions utilitaires
export const getHDTypeColor = (hdType: string) => {
  return HD_TYPE_COLORS[hdType as keyof typeof HD_TYPE_COLORS] || HD_TYPE_COLORS.generator;
};

export const getCenterColor = (center: string) => {
  return HD_CENTER_COLORS[center as keyof typeof HD_CENTER_COLORS] || HD_CENTER_COLORS['g-center'];
};

export const getCategoryColor = (category: string) => {
  return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.general;
};

export const getCenterDisplayName = (center: string): string => {
  const centerNames: Record<string, string> = {
    'throat': 'Gorge',
    'heart': 'Cœur', 
    'solar-plexus': 'Plexus Solaire',
    'sacral': 'Sacral',
    'root': 'Racine',
    'spleen': 'Rate',
    'g-center': 'G-Center',
    'ajna': 'Ajna',
    'head': 'Tête'
  };
  return centerNames[center] || center;
};

export const getCategoryDisplayName = (category: string): string => {
  const categoryNames: Record<string, string> = {
    'general': 'Général',
    'emotional': 'Émotionnel',
    'physical': 'Physique',
    'mental': 'Mental',
    'digestive': 'Digestif',
    'somatic': 'Somatique',
    'energetic': 'Énergétique',
    'feminine_cycle': 'Cycle Féminin',
    'hd_specific': 'Spécifique HD'
  };
  return categoryNames[category] || category;
};

// 📊 Fonctions de score
export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-primary';
  if (score >= 40) return 'text-accent';
  if (score >= 20) return 'text-warning';
  return 'text-error';
};

export const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Florissante';
  if (score >= 60) return 'Équilibrée';
  if (score >= 40) return 'Fluctuante';
  if (score >= 20) return 'En demande';
  return 'En repos';
};

// 🎯 Classes communes pour la cohérence
export const COMMON_CLASSES = {
  pageContainer: 'min-h-screen py-32 pb-24 md:pb-8',
  contentWrapper: 'container mx-auto px-4',
  maxWidth: 'max-w-4xl mx-auto',
  backButton: 'flex items-center text-primary hover:underline mb-6',
  sectionTitle: 'font-display text-2xl md:text-3xl mb-6 text-primary',
  cardGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  inputField: 'w-full px-4 py-3 rounded-xl border-2 border-neutral/20 focus:border-primary/50 focus:outline-none transition-colors',
  loadingSpinner: 'w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'
} as const;