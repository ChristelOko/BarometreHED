export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  interval?: 'month' | 'year';
  popular?: boolean;
  features: string[];
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SlWKjIWEL2eBxj',
    priceId: 'price_1RpzHyHyc6AKrdeKISF3glsu',
    name: 'Baromètre Énergétique - Annuel',
    description: 'Accès complet et illimité à toutes les fonctionnalités premium de l\'application pour une année entière, avec une économie significative par rapport à l\'abonnement mensuel (3 mois offerts)',
    mode: 'subscription',
    price: 79.00,
    currency: 'EUR',
    interval: 'year',
    popular: true,
    features: [
      'Toutes les catégories de scan',
      'Rapports PDF détaillés',
      'Tirage énergétique quotidien',
      'Suivi personnalisé',
      'Notifications intelligentes',
      'Support prioritaire',
      '3 mois offerts',
      'Accès aux nouvelles fonctionnalités'
    ]
  },
  {
    id: 'prod_SlWJSNdpPj6lRM',
    priceId: 'price_1RpzHIHyc6AKrdeKSKOdf1LD',
    name: 'Baromètre Énergétique - Mensuel',
    description: 'Accès complet et illimité à toutes les fonctionnalités premium de l\'application, incluant toutes les catégories de scan, rapports PDF, tirage énergétique quotidien, suivi personnalisé et support prioritaire.',
    mode: 'subscription',
    price: 9.00,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Toutes les catégories de scan',
      'Rapports PDF détaillés',
      'Tirage énergétique quotidien',
      'Suivi personnalisé',
      'Notifications intelligentes',
      'Support prioritaire'
    ]
  },
  {
    id: 'prod_SlWIcTAvWRN0TG',
    priceId: 'price_1RpzGMHyc6AKrdeK2YYuqbrO',
    name: 'Baromètre Énergétique - Pass 24h',
    description: 'Accès illimité à toutes les fonctionnalités premium de l\'application (toutes les catégories de scan, rapports PDF, tirage énergétique du jour) pendant 24 heures.',
    mode: 'payment',
    price: 3.00,
    currency: 'EUR',
    popular: true,
    features: [
      'Toutes les catégories de scan',
      'Rapports PDF illimités',
      'Tirage énergétique du jour',
      'Support inclus'
    ]
  },
  {
    id: 'prod_SlWI7pXKgR4q2G',
    priceId: 'price_1RpzFaHyc6AKrdeK0riUlJ7P',
    name: 'Baromètre Énergétique - Catégorie Unique',
    description: 'Accès à une catégorie de scan de votre choix (ex: Émotionnel, Physique, Mental) pendant 7 jours. Idéal pour explorer une dimension spécifique de votre énergie.',
    mode: 'payment',
    price: 1.00,
    currency: 'EUR',
    features: [
      'Accès à 1 catégorie de votre choix',
      'Analyse détaillée de cette dimension',
      'Conseils personnalisés',
      'Valable 7 jours'
    ]
  }
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getSubscriptionProducts = (): StripeProduct[] => {
  return stripeProducts.filter(product => product.mode === 'subscription');
};

export const getOneTimeProducts = (): StripeProduct[] => {
  return stripeProducts.filter(product => product.mode === 'payment');
};