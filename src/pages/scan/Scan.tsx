import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../context/LanguageContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import { useSubscription } from '../../hooks/useSubscription';
import Button from '../../components/common/Button';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { ArrowLeft, Heart, Brain, Activity, Sparkles, Lock, Utensils, Hand, Zap, Moon, User, ChevronRight, ArrowRight, Settings } from 'lucide-react';
import { useFeelingsStore } from '../../store/feelingsStore';
import GeneralCategory from './categories/GeneralCategory';
import EmotionalCategory from './categories/EmotionalCategory';
import PhysicalCategory from './categories/PhysicalCategory';
import MentalCategory from './categories/MentalCategory'; 
import HDSpecificCategory from './categories/HDSpecificCategory';
import EnergeticCategory from './categories/EnergeticCategory';
import DigestiveCategory from './categories/DigestiveCategory'; 
import SomaticCategory from './categories/SomaticCategory'; 
import FeminineCycleCategory from './categories/FeminineCycleCategory';
import PremiumFeatureOverlay from '../../components/premium/PremiumFeatureOverlay'; 
import { useAlertStore } from '../../store/alertStore';

type Category = 'general' | 'emotional' | 'physical' | 'mental' | 'digestive' | 'somatic' | 'energetic' | 'feminine_cycle' | 'hd_specific';

interface CategoryInfo {
  id: Category;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

// Reordering categories according to the logical flow
const categories: CategoryInfo[] = [  
  {
    id: 'general',
    title: 'État Général',
    description: 'Évaluez votre ressenti global et votre énergie du moment',
    icon: <Sparkles size={24} />,
    color: 'bg-primary'
  },
  {
    id: 'physical',
    title: 'État Physique',
    description: 'Sensations physiques, douleurs, tensions, énergie corporelle',
    icon: <Activity size={24} />,
    color: 'bg-accent'
  },
  {
    id: 'digestive',
    title: 'État Digestif',
    description: 'Troubles liés au ventre, digestion, ballonnements, nausées, rapport à l\'alimentation',
    icon: <Utensils size={24} />,
    color: 'bg-amber-500' 
  },
  {
    id: 'somatic',
    title: 'Somatique / Sensoriel',
    description: 'Sensations dans le corps, nerfs, peau, sensibilité aux bruits, lumière, etc.',
    icon: <Hand size={24} />,
    color: 'bg-indigo-500'
  },
  {
    id: 'emotional',
    title: 'État Émotionnel',
    description: 'Explorez vos émotions et votre équilibre intérieur',
    icon: <Heart size={24} />,
    color: 'bg-secondary'
  },
  {
    id: 'mental',
    title: 'État Mental',
    description: 'Pensées envahissantes, ruminations, doutes, perte de clarté, pression mentale',
    icon: <Brain size={24} />,
    color: 'bg-teal-500'
  },
  {
    id: 'energetic',
    title: 'État Énergétique',
    description: 'Perceptions subtiles : fuites d\'énergie, saturation, trop plein, coupure, dispersion',
    icon: <Zap size={24} />,
    color: 'bg-purple-500' 
  },
  {
    id: 'feminine_cycle',
    title: 'Cycle Féminin',
    description: 'Symptômes liés au cycle menstruel, douleurs de règles, ovulation, transitions hormonales',
    icon: <Moon size={24} />,
    color: 'bg-rose-500'
  },
  {
    id: 'hd_specific',
    title: 'Spécifique HD',
    description: 'Signaux propres à chaque type HD ou profil : frustration, amertume, colère, surprise, etc.',
    icon: <User size={24} />,
    color: 'bg-blue-500'
  }
];

const Scan = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const { settings } = useAppSettings();
  const { canAccessCategory, isPremium } = useSubscription();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(false);
  const [selectedPremiumCategory, setSelectedPremiumCategory] = useState<Category | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedCategoryInfo, setSelectedCategoryInfo] = useState<CategoryInfo | null>(null);
  const { showAlert } = useAlertStore();
  const { fetchFeelings } = useFeelingsStore();
  
  // For demo purposes, only general category is free
  const isPremiumCategory = (category: Category) => {
    return !canAccessCategory(category);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: '/scan' } });
    }
  }, [isAuthenticated, navigate]);

  // Charger les ressentis au montage du composant
  useEffect(() => {
    fetchFeelings();
  }, [fetchFeelings]);

  const handleCategoryComplete = (categoryId: Category, data: any) => {
    navigate('/results', { 
      state: { 
        results: {
          [categoryId]: data
        },
        isConversational: false,
        hdType: user?.hdType || 'generator'
      } 
    });
  };

  const handleCategorySelect = (category: Category) => {
    // Christel a accès à tout
    if (user?.email === 'christel.aplogan@gmail.com') {
      setSelectedCategory(category);
      return;
    }
    
    // Si premium désactivé, accès direct à toutes les catégories
    if (!settings.showPremiumPage) {
      setSelectedCategory(category);
      return;
    }
    
    // Logique premium normale
    if (isPremiumCategory(category)) {
      setSelectedPremiumCategory(category);
      setShowPremiumOverlay(true);
    } else {
      setSelectedCategory(category);
    }
  };

  const handlePurchase = (plan: string) => {
    showAlert('Redirection vers la page de paiement...', 'info');
    navigate('/premium');
  };

  const renderCategory = () => {
    switch (selectedCategory) {
      case 'general':
        return <GeneralCategory
          userHdType={user?.hdType}
          onComplete={(data) => handleCategoryComplete('general', data)} 
          onBack={() => setSelectedCategory(null)}
        />;
      case 'emotional':
        return <EmotionalCategory
          userHdType={user?.hdType}
          onComplete={(data) => handleCategoryComplete('emotional', data)}
          onBack={() => setSelectedCategory(null)}
        />;
      case 'physical':
        return <PhysicalCategory
          userHdType={user?.hdType}
          onComplete={(data) => handleCategoryComplete('physical', data)}
          onBack={() => setSelectedCategory(null)} 
        />;
      case 'mental':
        return <MentalCategory
          onComplete={(data) => handleCategoryComplete('mental', data)}
          onBack={() => setSelectedCategory(null)}
        />;
      case 'digestive':
        return <DigestiveCategory
          onComplete={(data) => handleCategoryComplete('digestive', data)}
          onBack={() => setSelectedCategory(null)}
        />;
      case 'somatic':
        return <SomaticCategory
          onComplete={(data) => handleCategoryComplete('somatic', data)}
          onBack={() => setSelectedCategory(null)}
        />;
      case 'energetic':
        return <EnergeticCategory
          onComplete={(data) => handleCategoryComplete('energetic', data)}
          onBack={() => setSelectedCategory(null)}
        />;
      case 'feminine_cycle':
        return <FeminineCycleCategory 
          onComplete={(data) => handleCategoryComplete('feminine_cycle', data)}
          onBack={() => setSelectedCategory(null)}
        />;
      case 'hd_specific':
        return <HDSpecificCategory
          onComplete={(data) => handleCategoryComplete('hd_specific', data)}
          onBack={() => setSelectedCategory(null)}
        />;
      default:
        return null;
    }
  };

  if (showWelcome) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral via-neutral to-primary/5 p-4 pb-24 md:pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-xl w-full mx-4">
          <motion.div
            className="bg-white backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-neutral/20 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-24 h-24 mx-auto mb-6">
              <img 
                src="/favicon.svg" 
                alt="Baromètre Énergétique" 
                className="w-full h-full filter drop-shadow-lg"
              />
            </div>
            <h1 className="font-display text-2xl md:text-3xl mb-4">
              Diagnostic énergétique 🌸
            </h1>
            <p className="text-neutral-dark/80 mb-8 leading-relaxed text-sm md:text-base">
              Explorez votre équilibre énergétique en sélectionnant une catégorie de diagnostic adaptée à votre état du moment.
            </p>
            
            <div className="space-y-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setShowWelcome(false);
                }}
                className="w-full mobile-button rounded-full border-2 border-primary/30 hover:border-primary/50 text-neutral-dark"
              >
                📋 Commencer le diagnostic
              </Button>
              
              <p className="text-xs text-neutral-dark/60">
                Sélectionnez une dimension énergétique à explorer
              </p>
              
              {/* Accès rapide aux autres fonctionnalités */}
              <div className="pt-4 border-t border-neutral-dark/10">
                <p className="text-xs text-neutral-dark/60 mb-3 text-center">Accès rapide :</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/#daily-energy')}
                    className="text-xs"
                  >
                    ✨ Tirage du jour
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/community')}
                    className="text-xs"
                  >
                    🌸 Communauté
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/testimonials')}
                    className="text-xs"
                  >
                    💬 Témoignages
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }
  
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-neutral pb-24 md:pb-8">
        <div className="container mx-auto px-4 pt-6 pb-2 md:block hidden">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setShowWelcome(true);
            }}
            icon={<ArrowLeft size={18} />}
            className="bg-white shadow-sm hover:bg-neutral/10 text-neutral-dark"
          >
            Retour
          </Button>
        </div>

        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-4xl mx-auto pt-8 md:pt-16">
            <h2 className="font-display text-2xl md:text-3xl text-center mb-6 md:mb-8 px-4">
              Quelle dimension veux-tu explorer ?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  className="relative h-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => handleCategorySelect(category.id)}
                    className={`w-full h-full flex flex-col items-center text-center rounded-2xl p-4 md:p-6 shadow-sm transition-all border-2 hover:shadow-md ${
                      category.id === 'general' ? 'bg-[#A87878]/10 text-[#A87878] border-[#A87878]/20' :
                      category.id === 'emotional' ? 'bg-[#9F85AF]/10 text-[#9F85AF] border-[#9F85AF]/20' :
                      category.id === 'physical' ? 'bg-[#E4C997]/10 text-[#E4C997] border-[#E4C997]/20' :
                      category.id === 'mental' ? 'bg-teal-500/10 text-teal-500 border-teal-500/20' :
                      category.id === 'digestive' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      category.id === 'somatic' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                      category.id === 'energetic' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                      category.id === 'feminine_cycle' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    } cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200`}
                  >
                    <div className={`w-14 md:w-16 h-14 md:h-16 rounded-2xl flex items-center justify-center mb-3 md:mb-4 relative ${
                      category.id === 'general' ? 'bg-[#A87878] text-white' :
                      category.id === 'emotional' ? 'bg-[#9F85AF] text-white' :
                      category.id === 'physical' ? 'bg-[#E4C997] text-white' :
                      category.id === 'mental' ? 'bg-teal-500 text-white' : 
                      category.id === 'digestive' ? 'bg-amber-500 text-white' : 
                      category.id === 'somatic' ? 'bg-indigo-500 text-white' : 
                      category.id === 'energetic' ? 'bg-purple-500 text-white' : 
                      category.id === 'feminine_cycle' ? 'bg-rose-500 text-white' : 
                      'bg-blue-500 text-white' 
                    }`}>
                      {category.icon}
                      {isPremiumCategory(category.id) && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                          <Lock size={12} className="text-primary" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-display text-lg md:text-xl mb-2 md:mb-3">{category.title}</h3>
                    <p className="text-neutral-dark/70 text-xs md:text-sm mb-3 md:mb-4 flex-grow leading-relaxed">
                      {category.description}
                    </p>
                    <div className={`mt-auto inline-flex items-center justify-center px-3 md:px-4 py-2 rounded-2xl text-xs md:text-sm font-medium ${
                      category.id === 'general' ? 'bg-[#A87878] text-white' :
                      category.id === 'emotional' ? 'bg-[#9F85AF] text-white' :
                      category.id === 'physical' ? 'bg-[#E4C997] text-white' :
                      category.id === 'mental' ? 'bg-teal-500 text-white' :
                      category.id === 'digestive' ? 'bg-amber-500 text-white' :
                      category.id === 'somatic' ? 'bg-indigo-500 text-white' :
                      category.id === 'energetic' ? 'bg-purple-500 text-white' :
                      category.id === 'feminine_cycle' ? 'bg-rose-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      Commencer <ArrowRight size={16} className="ml-1" />
                    </div>
                    {isPremiumCategory(category.id) && (
                      <div className="mt-2 md:mt-3 text-xs font-medium inline-flex items-center bg-white/80 px-2 py-1 rounded-full">
                        <Lock size={10} className="mr-1" />
                        Contenu premium
                      </div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage de la catégorie sélectionnée
  if (selectedCategory) {
    // Utiliser les composants de catégorie existants
    return renderCategory();
  }

  return (
    <div className="min-h-screen bg-neutral pb-24 md:pb-8">
      {/* Back button - visible only on desktop */}
      <div className="container mx-auto px-4 pt-6 pb-2 hidden md:block">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            setSelectedCategory(null);
          }}
          icon={<ArrowLeft size={18} />}
          className="bg-white shadow-sm hover:bg-white"
        >
          Retour aux catégories
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-8 pt-8 md:pt-20">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {renderCategory()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Premium Feature Overlay */}
      {showPremiumOverlay && selectedPremiumCategory && (
        <PremiumFeatureOverlay
          title={`Débloquez la catégorie ${
            selectedPremiumCategory === 'emotional' ? 'Émotionnelle' : 
            selectedPremiumCategory === 'physical' ? 'Physique' :
            selectedPremiumCategory === 'mental' ? 'Mentale' :
            selectedPremiumCategory === 'digestive' ? 'Digestive' :
            selectedPremiumCategory === 'somatic' ? 'Somatique' :
            selectedPremiumCategory === 'energetic' ? 'Énergétique' :
            selectedPremiumCategory === 'feminine_cycle' ? 'Cycle Féminin' :
            selectedPremiumCategory === 'hd_specific' ? 'HD Spécifique' :
            'Premium'
          }`}
          description={`Accédez à une analyse approfondie de votre état ${
            selectedPremiumCategory === 'emotional' ? 'émotionnel' : 
            selectedPremiumCategory === 'physical' ? 'physique' :
            selectedPremiumCategory === 'mental' ? 'mental' :
            selectedPremiumCategory === 'digestive' ? 'digestif' :
            selectedPremiumCategory === 'somatic' ? 'somatique' :
            selectedPremiumCategory === 'energetic' ? 'énergétique' :
            selectedPremiumCategory === 'feminine_cycle' ? 'cyclique' :
            selectedPremiumCategory === 'hd_specific' ? 'HD spécifique' :
            'énergétique'
          } et recevez des conseils personnalisés.`}
          featureType="category"
          onClose={() => setShowPremiumOverlay(false)}
          onPurchase={handlePurchase}
        />
      )}
      
      {/* Dialog de confirmation de catégorie */}
    </div>
  );
};

export default Scan;