import { formatReadingText } from '../../utils/formatReadingText';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sun, Calendar, Sparkles, Moon, ArrowRight, Lock, Heart, Activity } from 'lucide-react';
import { useAppSettings } from '../../context/AppSettingsContext';
import { useDailyEnergy } from '../../hooks/useDailyEnergy';
import Button from '../common/Button';
import PremiumFeatureOverlay from '../premium/PremiumFeatureOverlay';
import { useAlertStore } from '../../store/alertStore';
import { useAuthStore } from '../../store/authStore';

interface DailyEnergySectionProps {
  onStartScan: () => void;
}

const DailyEnergySection = ({ onStartScan }: DailyEnergySectionProps) => {
  const { settings } = useAppSettings();
  const { user } = useAuthStore();
  const { 
    reading, 
    isLoading, 
    error, 
    hasReading, 
    getDayEnergy, 
    getMonthEnergy, 
    getYearEnergy, 
    getDescription, 
    getMantra, 
    getDayNumber 
  } = useDailyEnergy();
  const { showAlert } = useAlertStore();
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(false);
  const [freeTrialsRemaining, setFreeTrialsRemaining] = useState(3);

  const handleDailyEnergyClick = () => {
    // Christel a toujours accès complet
    if (user?.email === 'christel.aplogan@gmail.com') {
      showAlert('Accès fondatrice - Contenu complet disponible ! ✨', 'success');
      return;
    }
    
    if (!settings.showPremiumPage) {
      // If premium page is disabled, show full content
      showAlert('Tirage énergétique complet disponible ! ✨', 'success');
    } else if (freeTrialsRemaining > 0) {
      setFreeTrialsRemaining(prev => prev - 1);
      showAlert(`Tirage gratuit utilisé ! Il vous reste ${freeTrialsRemaining - 1} essai${freeTrialsRemaining - 1 > 1 ? 's' : ''}`, 'info');
    } else {
      setShowPremiumOverlay(true);
    }
  };

  const handlePurchase = (plan: 'monthly' | 'yearly' | 'lifetime' | 'single') => {
    showAlert('Redirection vers la page de paiement...', 'info');
    setTimeout(() => {
      navigate('/premium');
    }, 2000);
  };

  if (isLoading) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-dark/70 text-lg">Chargement de l'énergie du jour...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !hasReading()) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <Sun size={40} className="text-primary mr-3" />
              <h2 className="font-display text-4xl md:text-5xl text-primary">
                Ton énergie quotidienne
              </h2>
            </div>
            
            <p className="text-xl text-neutral-dark/80 leading-relaxed mb-10">
              Découvre l'énergie du jour et reçois un message personnalisé pour t'accompagner
            </p>
            
            <div className="mt-8">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={onStartScan}
                icon={<Sparkles size={20} />}
                className="text-lg px-10 py-4"
              >
                Faire mon scan énergétique
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  const today = new Date();
  const dayName = today.toLocaleDateString('fr-FR', { weekday: 'long' });
  const dateString = today.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <section className="py-24 relative overflow-hidden">
      <div id="daily-energy"></div>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 z-0"></div>
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          {/* Header with decorative elements */}
          <div className="text-center mb-12 relative">
            <motion.div 
              className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-40 h-40 rounded-full bg-primary/10 blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-lg rounded-full transform scale-110"></div>
              <div className="relative">
                <Sun size={48} className="text-primary mx-auto mb-4" />
              </div> 
            </motion.div>
            
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl text-primary mb-4 relative"
            >
              Tirage énergétique du jour
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-3"></div>
            </motion.h2>
            
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center justify-center text-neutral-dark/70 mb-4"
            >
              <Calendar size={30} className="mr-2" />
              <span className="capitalize text-xl md:text-2xl font-medium">{dayName} {dateString}</span>
              {getDayNumber() > 0 && (
                <span className="ml-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Jour {getDayNumber()}
                </span>
              )}
            </motion.div>
          </div>

          {/* Énergies du jour - Cards with glass effect */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Énergie du jour */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.1 }}
  viewport={{ once: true }}
  className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
>
  <div className="flex items-center mb-4">
    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-3">
      <Sun size={24} className="text-primary" />
    </div>
    <h3 className="font-display text-xl text-primary">Énergie du jour</h3>
  </div>

  {(() => {
  const formatted = formatReadingText(getDayEnergy());
  return formatted.__html ? (
    <div
      className="text-neutral-dark/90 leading-relaxed relative z-10 text-base prose prose-sm prose-p:my-3 prose-strong:text-primary prose-em:italic"
      dangerouslySetInnerHTML={{ __html: formatted.__html }}
    />
  ) : (
    <div className="text-neutral-dark/90 leading-relaxed relative z-10 text-base whitespace-pre-line">
      {formatted.text}
    </div>
  );
})()}
</motion.div>

           {/* Énergie du mois */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  viewport={{ once: true }}
  className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-secondary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
>
  <div className="flex items-center mb-4">
    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mr-3">
      <Moon size={24} className="text-secondary" />
    </div>
    <h3 className="font-display text-xl text-secondary">Énergie du mois</h3>
  </div>

 {(() => {
  const formatted = formatReadingText(getMonthEnergy());
  return formatted.__html ? (
    <div
      className="text-neutral-dark/90 leading-relaxed relative z-10 text-base prose prose-sm prose-p:my-3 prose-strong:text-primary prose-em:italic"
      dangerouslySetInnerHTML={{ __html: formatted.__html }}
    />
  ) : (
    <div className="text-neutral-dark/90 leading-relaxed relative z-10 text-base whitespace-pre-line">
      {formatted.text}
    </div>
  );
})()}

  
</motion.div>

            {/* Énergie de l'année */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.3 }}
  viewport={{ once: true }}
  className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
>
  <div className="flex items-center mb-4">
    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mr-3">
      <Sparkles size={24} className="text-accent" />
    </div>
    <h3 className="font-display text-xl text-accent">Énergie de l'année</h3>
  </div>


 {(() => {
  const formatted = formatReadingText(getYearEnergy());
  return formatted.__html ? (
    <div
      className="text-neutral-dark/90 leading-relaxed relative z-10 text-base prose prose-sm prose-p:my-3 prose-strong:text-primary prose-em:italic"
      dangerouslySetInnerHTML={{ __html: formatted.__html }}
    />
  ) : (
    <div className="text-neutral-dark/90 leading-relaxed relative z-10 text-base whitespace-pre-line">
      {formatted.text}
    </div>
  );
})()}
  
</motion.div>
          </div>
            
          
          {/* Description et Mantra - Enhanced cards */}
<div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-12">
  {/* Description */}
  {getDescription() &&
    (() => {
      const formatted = formatReadingText(getDescription());

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="backdrop-blur-sm bg-white/20 rounded-xl p-8 border border-primary/20 shadow-lg relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-xl"></div>
          <h3 className="font-display text-2xl mb-4 text-primary relative z-10">Message du jour</h3>

          {formatted.__html ? (
            <div
  className="text-neutral-dark/90 text-base leading-loose relative z-10 prose prose-sm prose-p:my-3 prose-ul:pl-6 prose-ol:pl-6 prose-li:pl-8 prose-li:ml-8 prose-li:marker:text-primary prose-strong:text-primary prose-em:italic"
  dangerouslySetInnerHTML={{ __html: formatted.__html }}
            />
          ) : (
            <div className="text-neutral-dark/90 leading-relaxed relative z-10 text-lg whitespace-pre-line">
              {formatted.text}
            </div>
          )}
        </motion.div>
      );
    })()}  


{/* Mantra */}
{getMantra() && (() => {
  const formattedMantra = formatReadingText(getMantra());

  return (
    <motion.div
      onClick={handleDailyEnergyClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl p-8 shadow-lg border border-white/20 relative overflow-hidden cursor-pointer group"
    >
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
      <h3 className="font-display text-2xl mb-6 text-primary relative z-10">Mantra du jour</h3>

      <div className="bg-white/0 backdrop-blur-sm rounded-lg p-6 relative z-10 overflow-hidden">
        {freeTrialsRemaining > 0 || !settings.showPremiumPage ? (
          <>
            {formattedMantra.__html ? (
              <div
                className="text-neutral-dark/90 text-base leading-loose relative z-10 prose prose-sm prose-p:my-3 prose-ul:pl-6 prose-ol:pl-6 prose-li:pl-8 prose-li:ml-8 prose-li:marker:text-primary prose-strong:text-primary prose-em:italic text-center"
                dangerouslySetInnerHTML={{ __html: formattedMantra.__html }}
              />
            ) : (
              <p className="font-display text-base italic text-neutral-dark/90 text-center font-medium">
                "{formattedMantra.text}"
              </p>
            )}
          </>
        ) : user?.email === 'christel.aplogan@gmail.com' ? (
          <>
            {formattedMantra.__html ? (
              <div
                className="text-neutral-dark/90 text-base leading-loose relative z-10 prose prose-sm prose-p:my-3 prose-ul:pl-6 prose-ol:pl-6 prose-li:pl-8 prose-li:ml-8 prose-li:marker:text-primary prose-strong:text-primary prose-em:italic text-center"
                dangerouslySetInnerHTML={{ __html: formattedMantra.__html }}
              />
            ) : (
              <p className="font-display text-base italic text-neutral-dark/90 text-center font-medium">
                "{formattedMantra.text}"
              </p>
            )}
            <div className="absolute bottom-2 right-2 text-xs text-primary/70">
              👑 Accès Fondatrice
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
            <Lock size={24} className="text-white mb-2" />
            <p className="text-white text-center font-medium">Contenu premium</p>
            <p className="text-neutral-dark/70 text-sm text-center mt-1">Cliquez pour débloquer</p>
          </div>
        )}

        <div className="absolute bottom-2 right-2 text-xs text-neutral-dark/70">
          {user?.email === 'christel.aplogan@gmail.com' ? '' : 
           settings.showPremiumPage && freeTrialsRemaining > 0 ? `${freeTrialsRemaining} essais gratuits restants` : ''}
        </div>
      </div>
    </motion.div>
  );
})()}
  
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center justify-center space-x-2 text-primary bg-white/20 px-3 py-2 rounded-full">
                    <Sparkles size={16} />
                    <span>9 catégories</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-secondary bg-white/20 px-3 py-2 rounded-full">
                    <Heart size={16} />
                    <span>Guidance HD</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-accent bg-white/20 px-3 py-2 rounded-full">
                    <Activity size={16} />
                    <span>Suivi évolution</span>
                  </div>
                </div>
              </div>

          {/* Call to Action - Enhanced with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl blur-xl transform scale-105"></div>
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 border border-primary/20 relative z-10">
              <h3 className="font-display text-2xl text-primary mb-4">Prête à explorer ton énergie?</h3>
              <p className="text-lg text-neutral-dark/80 mb-8 max-w-2xl mx-auto">
                Prends quelques minutes pour te connecter à ton ressenti et découvrir ce que ton énergie te révèle aujourd'hui.
              </p>
              
              <Button 
                variant="primary" 
                size="lg" 
                onClick={onStartScan}
                icon={<Sparkles size={20} />}
                className="text-lg px-10 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Faire mon scan énergétique
                <ArrowRight size={18} className="ml-2" />
              </Button>
              
              <p className="text-sm text-neutral-dark/60 italic mt-6">
                ✨ Connecte-toi à ton énergie unique et découvre ce qu'elle te révèle
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Premium Feature Overlay */}
      {showPremiumOverlay && settings.showPremiumPage && (
        <PremiumFeatureOverlay
          title="Tirage énergétique du jour"
          description="Recevez un tirage énergétique et un mantra personnalisé pour vous guider tout au long de la journée."
          featureType="daily"
          onClose={() => setShowPremiumOverlay(false)}
          onPurchase={handlePurchase}
        />
      )}
    </section>
  );
};

export default DailyEnergySection;