import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Sparkles, CreditCard, Check, Crown } from 'lucide-react';
import Button from '../common/Button';
import { StripeService } from '../../services/stripeService';
import { stripeProducts } from '../../stripe-config';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';

interface PremiumFeatureOverlayProps {
  title: string;
  description: string;
  featureType: 'category' | 'report' | 'daily';
  onClose: () => void;
  onPurchase?: (plan: string) => void;
}

const PremiumFeatureOverlay = ({ 
  title, 
  description, 
  featureType, 
  onClose, 
  onPurchase 
}: PremiumFeatureOverlayProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const { showAlert } = useAlertStore();
  const [selectedPriceId, setSelectedPriceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Get relevant products based on feature type
  const getRelevantProducts = () => {
    switch (featureType) {
      case 'category':
        return stripeProducts.filter(p => 
          p.id === 'prod_SlWI7pXKgR4q2G' || // Catégorie Unique
          p.id === 'prod_SlWIcTAvWRN0TG' || // Pass 24h
          p.mode === 'subscription'
        );
      case 'report':
        return stripeProducts.filter(p => 
          p.id === 'prod_SlWIcTAvWRN0TG' || // Pass 24h
          p.mode === 'subscription'
        );
      case 'daily':
        return stripeProducts.filter(p => 
          p.id === 'prod_SlWIcTAvWRN0TG' || // Pass 24h
          p.mode === 'subscription'
        );
      default:
        return stripeProducts;
    }
  };

  const relevantProducts = getRelevantProducts();

  // Set default selection to the most popular relevant product
  useState(() => {
    const popularProduct = relevantProducts.find(p => p.popular);
    if (popularProduct) {
      setSelectedPriceId(popularProduct.priceId);
    } else if (relevantProducts.length > 0) {
      setSelectedPriceId(relevantProducts[0].priceId);
    }
  });

  const handlePurchase = async () => {
    if (!isAuthenticated || !user?.id) {
      showAlert('Veuillez vous connecter pour continuer', 'warning');
      return;
    }

    if (!selectedPriceId) {
      showAlert('Veuillez sélectionner un plan', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      
      const successUrl = `${window.location.origin}/premium?success=true`;
      const cancelUrl = `${window.location.origin}${window.location.pathname}`;
      
      const { url, error } = await StripeService.createCheckoutSession(
        selectedPriceId,
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
      console.error('Erreur lors du paiement:', error);
      showAlert('Erreur lors de la redirection vers le paiement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getFeaturesList = () => {
    switch (featureType) {
      case 'category':
        return [
          'Accès à toutes les catégories de scan',
          'Analyses énergétiques détaillées',
          'Conseils personnalisés par catégorie',
          'Suivi de progression par dimension'
        ];
      case 'report':
        return [
          'Rapport PDF détaillé et personnalisé',
          'Analyse complète de votre état énergétique',
          'Conseils et pratiques adaptés à votre type HD',
          'Format élégant à conserver ou imprimer'
        ];
      case 'daily':
        return [
          'Tirage énergétique quotidien personnalisé',
          'Mantra adapté à votre type HD',
          'Conseils pour harmoniser votre journée',
          'Notifications quotidiennes inspirantes'
        ];
      default:
        return [];
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-[#2D2424] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-dark/50 hover:text-neutral-dark transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Premium feature header */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-t-2xl p-6 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={24} className="text-primary" />
              </div>
              <h2 className="font-display text-2xl mb-2">{title}</h2>
              <p className="text-neutral-dark/80 max-w-sm mx-auto">
                {description}
              </p>
            </div>
          </div>

          {/* Plans selection */}
          <div className="p-6">
            <h3 className="font-display text-lg mb-4">Choisissez votre offre</h3>
            
            <div className="space-y-3 mb-6">
              {relevantProducts.map((product) => (
                <div key={product.id} className="relative">
                  <button
                    onClick={() => setSelectedPriceId(product.priceId)}
                    className={`w-full p-4 rounded-xl text-left transition-all flex items-start ${
                      selectedPriceId === product.priceId
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-neutral hover:bg-primary/5 border-2 border-transparent'
                    }`}
                  >
                    {product.popular && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-secondary text-white px-2 py-1 rounded-full text-xs">
                        ⭐ Populaire
                      </div>
                    )}
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 border-2 mr-3 flex items-center justify-center mt-0.5 ${
                      selectedPriceId === product.priceId
                        ? 'border-primary bg-primary text-white'
                        : 'border-neutral-dark/30'
                    }`}>
                      {selectedPriceId === product.priceId && <Check size={14} />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-medium ${
                          selectedPriceId === product.priceId ? 'text-primary' : 'text-neutral-dark'
                        }`}>
                          {product.name.replace('Baromètre Énergétique - ', '')}
                        </span>
                        <span className="font-display text-lg">
                          {product.price.toFixed(2)}€
                          {product.interval && `/${product.interval === 'month' ? 'mois' : 'an'}`}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-dark/70">{product.description}</p>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* Features list */}
            <div className="bg-neutral rounded-xl p-4 mb-6">
              <h4 className="font-medium mb-3">Ce que vous obtenez :</h4>
              <ul className="space-y-2">
                {getFeaturesList().map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={16} className="text-primary mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={handlePurchase}
                disabled={isLoading || !selectedPriceId}
                icon={isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Crown size={18} />
                )}
              >
                {isLoading ? 'Redirection...' : 'Débloquer maintenant'}
              </Button>
              
              <p className="text-xs text-center text-neutral-dark/60">
                Paiement sécurisé via Stripe • Annulation libre • Support inclus
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PremiumFeatureOverlay;