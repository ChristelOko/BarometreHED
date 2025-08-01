import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Sparkles, CreditCard, Zap, Star, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import { StripeService, UserSubscription } from '../../services/stripeService';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';

const PremiumPlans = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { showAlert } = useAlertStore();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  
  const subscriptionProducts = StripeService.getSubscriptionProducts();
  const oneTimeProducts = StripeService.getOneTimeProducts();

  useEffect(() => {
    if (isAuthenticated) {
      loadSubscription();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadSubscription = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await StripeService.getUserSubscription();
      
      if (error) {
        console.warn('Subscription service not available:', error.message);
        // Set default state instead of showing error
      } else {
      }
    } catch (error) {
      console.warn('Subscription service error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = async (priceId: string) => {
    if (!isAuthenticated) {
      showAlert('Veuillez vous connecter pour souscrire à un abonnement', 'warning');
      return;
    }

    try {
      setPurchaseLoading(priceId);
      
      const successUrl = `${window.location.origin}/premium?success=true`;
      const cancelUrl = `${window.location.origin}/premium?canceled=true`;
      
      const { url, error } = await StripeService.createCheckoutSession(
        priceId,
        successUrl,
        cancelUrl
      );

      if (error) {
        throw new Error(error);
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Erreur lors de la souscription:', error);
      showAlert('Erreur lors de la redirection vers le paiement', 'error');
    } finally {
      setPurchaseLoading(null);
    }
  };

  const isCurrentPlan = (priceId: string) => {
    return subscription?.price_id === priceId && 
           (subscription?.subscription_status === 'active' || subscription?.subscription_status === 'trialing');
  };

  const hasActiveSubscription = subscription?.subscription_status === 'active' || subscription?.subscription_status === 'trialing';

  // Check for success/cancel URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      showAlert('Paiement réussi ! Votre accès premium est maintenant actif. 🎉', 'success');
      loadSubscription();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('canceled') === 'true') {
      showAlert('Paiement annulé. Vous pouvez réessayer à tout moment.', 'info');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen py-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-dark/70">Chargement des plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Current subscription status */}
          {hasActiveSubscription && subscription && (
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 mb-8 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Crown size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-primary">Abonnement Actif</h3>
                    <p className="text-neutral-dark/70">
                      {subscription.plan?.name || 'Plan Premium'} • 
                      {subscription.current_period_end && (
                        <span> Renouvellement le {new Date(subscription.current_period_end * 1000).toLocaleDateString('fr-FR')}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-success font-medium">✓ Actif</div>
                  {subscription.cancel_at_period_end && (
                    <div className="text-xs text-warning">Sera annulé à la fin de la période</div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-12">
            <Crown size={48} className="mx-auto text-primary mb-4" />
            <h1 className="font-display text-4xl mb-4">
              {hasActiveSubscription ? 'Votre Abonnement Premium' : 'Plans Premium'}
            </h1>
            <p className="text-lg text-neutral-dark/80 max-w-2xl mx-auto">
              {hasActiveSubscription 
                ? 'Profitez de toutes les fonctionnalités premium de votre Baromètre Énergétique'
                : 'Débloquez tout le potentiel de votre Baromètre Énergétique avec nos plans premium'
              }
            </p>
            <p className="text-lg text-neutral-dark/80 max-w-2xl mx-auto">
              ✨ Rejoignez notre communauté de femmes qui transforment leur relation à l'énergie
            </p>
          </div>

          {/* One-time purchases */}
          <div className="bg-gradient-to-r from-accent/10 to-warning/10 rounded-xl p-6 mb-8 border border-accent/20">
            <h2 className="font-display text-2xl mb-4 text-center text-accent">💫 Essayez sans engagement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {oneTimeProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl p-6 shadow-sm border relative ${
                    product.popular ? 'border-warning/20' : 'border-accent/10'
                  }`}
                >
                  {product.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-warning to-accent text-white px-4 py-1 rounded-full text-xs font-medium">
                        🔥 Populaire
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      product.popular ? 'bg-warning/20' : 'bg-accent/20'
                    }`}>
                      {product.popular ? (
                        <Zap size={24} className="text-warning" />
                      ) : (
                        <Sparkles size={24} className="text-accent" />
                      )}
                    </div>
                    <h3 className="font-display text-xl mb-2">{product.name.replace('Baromètre Énergétique - ', '')}</h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className={`text-3xl font-display ${product.popular ? 'text-warning' : 'text-accent'}`}>
                        {product.price.toFixed(2)}€
                      </span>
                    </div>
                    <p className="text-sm text-neutral-dark/70 mb-4">{product.description}</p>
                  </div>
                  
                  <ul className="space-y-2 mb-6 text-sm">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check size={14} className={`mr-2 ${product.popular ? 'text-warning' : 'text-accent'}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={product.popular ? 'primary' : 'outline'}
                    fullWidth
                    onClick={() => handleSelectPlan(product.priceId)}
                    disabled={purchaseLoading === product.priceId}
                    icon={purchaseLoading === product.priceId ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CreditCard size={18} />
                    )}
                    className={product.popular ? 'bg-warning hover:bg-warning/90' : 'border-accent text-accent hover:bg-accent/10'}
                  >
                    {purchaseLoading === product.priceId ? 'Redirection...' : 'Acheter maintenant'}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Subscription plans */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8 border border-primary/10">
            <h2 className="font-display text-2xl mb-6 text-center text-primary">🌟 Abonnements Premium</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap size={24} className="text-primary" />
                </div>
                <h3 className="font-medium mb-2">Accès Illimité</h3>
                <p className="text-sm text-neutral-dark/70">Toutes les catégories, tous les jours</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={24} className="text-secondary" />
                </div>
                <h3 className="font-medium mb-2">Suivi Avancé</h3>
                <p className="text-sm text-neutral-dark/70">Historique, tendances et prédictions</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown size={24} className="text-accent" />
                </div>
                <h3 className="font-medium mb-2">Expérience VIP</h3>
                <p className="text-sm text-neutral-dark/70">Support prioritaire et nouvelles fonctionnalités</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subscriptionProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white rounded-2xl p-8 shadow-sm relative border-2 ${
                    product.popular ? 'border-primary' : 'border-neutral/10'
                  }`}
                >
                  {product.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                        ⭐ Le plus populaire
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="font-display text-2xl mb-2">{product.name.replace('Baromètre Énergétique - ', '')}</h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-4xl font-display text-primary">{product.price.toFixed(0)}€</span>
                      <span className="text-neutral-dark/70 ml-1">
                        /{product.interval === 'month' ? 'mois' : 'an'}
                      </span>
                    </div>
                    {product.interval === 'year' && (
                      <div className="inline-flex items-center px-3 py-1 bg-success/10 text-success rounded-full text-sm">
                        💰 Économisez 29€ par an (3 mois offerts)
                      </div>
                    )}
                    <p className="text-sm text-neutral-dark/70 mt-3">{product.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check size={16} className="text-primary mr-3 flex-shrink-0" />
                        <span className="text-neutral-dark">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={isCurrentPlan(product.priceId) ? 'outline' : product.popular ? 'primary' : 'outline'}
                    fullWidth
                    onClick={() => handleSelectPlan(product.priceId)}
                    disabled={purchaseLoading === product.priceId || isCurrentPlan(product.priceId)}
                    icon={purchaseLoading === product.priceId ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isCurrentPlan(product.priceId) ? (
                      <Check size={18} />
                    ) : (
                      <ArrowRight size={18} />
                    )}
                  >
                    {purchaseLoading === product.priceId ? 'Redirection...' : 
                     isCurrentPlan(product.priceId) ? 'Plan actuel' :
                     'Choisir ce plan'}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Guarantees and security */}
          <div className="bg-neutral rounded-xl p-6 mb-8">
            <h3 className="font-display text-xl mb-4 text-center">🛡️ Vos garanties</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-2">🔒</div>
                <h4 className="font-medium mb-1">Paiement Sécurisé</h4>
                <p className="text-sm text-neutral-dark/70">Cryptage SSL et protection Stripe</p>
              </div>
              <div>
                <div className="text-2xl mb-2">↩️</div>
                <h4 className="font-medium mb-1">Annulation Libre</h4>
                <p className="text-sm text-neutral-dark/70">Résiliez à tout moment en un clic</p>
              </div>
              <div>
                <div className="text-2xl mb-2">💬</div>
                <h4 className="font-medium mb-1">Support Dédié</h4>
                <p className="text-sm text-neutral-dark/70">Assistance prioritaire 7j/7</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-neutral-dark/60 mb-4">
              Paiement sécurisé via Stripe • Annulation à tout moment • Support inclus
            </p>
            {!hasActiveSubscription && (
              <p className="text-xs text-neutral-dark/50 italic">
                ✨ Rejoignez plus de 1000 femmes qui ont transformé leur relation à l'énergie
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumPlans;