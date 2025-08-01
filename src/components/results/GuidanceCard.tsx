import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useAuthStore } from '../../store/authStore';

interface GuidanceCardProps {
  guidance: string;
  personalizedInsights?: string[];
  mantra?: {
    inhale: string;
    exhale: string;
  };
  realignmentExercise?: string;
}

const GuidanceCard = ({ guidance, personalizedInsights = [], mantra, realignmentExercise }: GuidanceCardProps) => {
  const { user } = useAuthStore();

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-sm p-4 md:p-6 overflow-hidden relative mobile-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full -translate-y-16 translate-x-16"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <Sparkles className="w-6 h-6 text-primary mr-2" />
          <h2 className="font-display text-lg md:text-xl">Guidance Personnalisée</h2>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div>
            <h3 className="font-display text-base md:text-lg mb-2">Message</h3>
            <p className="text-neutral-dark text-sm md:text-base leading-relaxed">{guidance}</p>
          </div>

          {personalizedInsights.length > 0 && (
            <div>
              <h3 className="font-display text-base md:text-lg mb-2">Insights Personnalisés</h3>
              <ul className="space-y-2">
                {personalizedInsights.map((insight, index) => (
                  <li key={index} className="text-neutral-dark text-sm md:text-base flex items-start">
                    <span className="text-primary mr-2">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-display text-base md:text-lg mb-2">Mantra</h3>
            {mantra ? (
              <div className="space-y-2 bg-primary/5 rounded-xl p-3 md:p-4">
                <div className="flex flex-col md:flex-row md:items-center">
                  <span className="text-primary font-medium mr-2">Inspiration:</span>
                  <p className="text-neutral-dark text-sm md:text-base">{mantra.inhale}</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center">
                  <span className="text-primary font-medium mr-2">Expiration:</span>
                  <p className="text-neutral-dark text-sm md:text-base">{mantra.exhale}</p>
                </div>
              </div>
            ) : (
              <p className="text-neutral-dark/70 italic text-sm md:text-base">Mantra non disponible</p>
            )}
          </div>

          <div>
            <h3 className="font-display text-base md:text-lg mb-2">Exercice</h3>
            {realignmentExercise ? (
              <div className="bg-accent/5 rounded-xl p-3 md:p-4">
                <p className="text-neutral-dark text-sm md:text-base leading-relaxed">{realignmentExercise}</p>
              </div>
            ) : (
              <p className="text-neutral-dark/70 italic text-sm md:text-base">Exercice non disponible</p>
            )}
          </div>
        </div>
        
        <div className="bg-accent/10 p-4 md:p-5 rounded-xl mt-4 md:mt-6">
          <h3 className="font-display text-base md:text-lg mb-2">Intention</h3>
          <p className="text-neutral-dark/90 italic text-sm md:text-base leading-relaxed">
            {user?.hdType === 'projector' && "Je m'autorise à être vue pour ma sagesse, pas pour ma productivité."}
            {user?.hdType === 'generator' && "Je fais confiance à mes réponses sacrales et j'honore mon rythme."}
            {user?.hdType === 'manifesting-generator' && "Je suis libre de changer de direction quand mon énergie change."}
            {user?.hdType === 'manifestor' && "J'initie avec confiance et j'informe avec amour."}
            {user?.hdType === 'reflector' && "Je prends le temps d'un cycle lunaire pour toute décision importante."}
            {!user?.hdType && "Je m'autorise à ressentir pleinement mon énergie et à honorer mes besoins sans jugement."}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default GuidanceCard;