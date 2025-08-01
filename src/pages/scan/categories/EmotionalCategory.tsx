import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../context/LanguageContext';
import Button from '../../../components/common/Button';
import { Info, Check, ArrowLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useFeelingsStore } from '../../../store/feelingsStore';

interface EmotionalCategoryProps {
  onComplete: (data: any) => void;
  userHdType?: string;
  onBack?: () => void;
  userHdType?: string;
}

const EmotionalCategory = ({ onComplete, onBack, userHdType }: EmotionalCategoryProps) => {
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDescription, setActiveDescription] = useState<string | null>(null);
  const [showAllDescriptions, setShowAllDescriptions] = useState(false);
  const { feelings, isLoading: feelingsLoading, getFeelingsByCategory } = useFeelingsStore();
  
  // Récupérer les ressentis de la catégorie 'emotional'
  const emotionalFeelings = getFeelingsByCategory('emotional', userHdType);
  
  // Séparer les ressentis positifs et négatifs
  const positiveFeelings = emotionalFeelings.filter(feeling => feeling.isPositive);
  const negativeFeelings = emotionalFeelings.filter(feeling => !feeling.isPositive);
  
  // Mettre à jour l'état de chargement
  useEffect(() => {
    setIsLoading(feelingsLoading);
  }, [feelingsLoading]);

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings(prev => 
      prev.includes(feeling)
        ? prev.filter(f => f !== feeling)
        : [...prev, feeling]
    );
  };

  // Si les ressentis sont en cours de chargement, afficher un indicateur de chargement
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto pt-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#9F85AF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-dark/70">Chargement des ressentis...</p>
        </div>
      </div>
    );
  }

  // Si aucun ressenti émotionnel n'est disponible, afficher un message
  if (emotionalFeelings.length === 0) {
    return (
      <div className="max-w-5xl mx-auto pt-6">
        <button 
          onClick={onBack}
          className="md:hidden flex items-center text-secondary mb-6 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Retour aux catégories
        </button>
        
        <div className="bg-[#9F85AF]/10 rounded-xl p-8 mb-8 border-2 border-[#9F85AF]/20">
          <h2 className="font-display text-3xl mb-3 text-[#9F85AF]">💗 État Émotionnel</h2>
          <p className="text-lg text-neutral-dark/90">
            Aucun ressenti émotionnel n'est disponible pour votre type HD ({userHdType || 'non défini'}).
          </p>
          <p className="italic text-sm text-[#9F85AF]/80 mt-2">
            Veuillez contacter l'administrateur ou changer votre type HD dans les paramètres.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="primary"
            onClick={onBack}
            className="bg-[#9F85AF] hover:bg-[#9F85AF]/90"
          >
            Retour aux catégories
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    const positiveCount = selectedFeelings.filter(f => 
      positiveFeelings.some(pf => pf.name === f)
    ).length;
    
    const negativeCount = selectedFeelings.filter(f => 
      negativeFeelings.some(nf => nf.name === f)
    ).length;
    
    const totalPossible = positiveFeelings.length + negativeFeelings.length;
    const positiveWeight = positiveFeelings.length / totalPossible;
    const negativeWeight = negativeFeelings.length / totalPossible;
    
    const positiveScore = (positiveCount / positiveFeelings.length) * 100 * positiveWeight;
    const negativeScore = (1 - (negativeCount / negativeFeelings.length)) * 100 * negativeWeight;
    
    const score = positiveScore + negativeScore;
    
    onComplete({
      selectedFeelings,
      score: Math.round(score),
      positiveCount,
      negativeCount
    });
  };

  return (
    <div className="max-w-5xl mx-auto pt-6">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-secondary hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" /> 
          Retour aux catégories
        </button>
        <button
          onClick={() => setShowAllDescriptions(!showAllDescriptions)}
          className="flex items-center text-secondary bg-secondary/10 px-3 py-1.5 rounded-full hover:bg-secondary/20 transition-colors"
        >
          {showAllDescriptions ? (
            <>
              <EyeOff size={16} className="mr-1.5" />
              Masquer les descriptions
            </>
          ) : (
            <>
              <Eye size={16} className="mr-1.5" />
              Afficher les descriptions
            </>
          )}
        </button>
      </div>
      
      <div className="bg-[#9F85AF]/10 rounded-xl p-8 mb-8 border-2 border-[#9F85AF]/20">
        <h2 className="font-display text-3xl mb-3 text-[#9F85AF]">💗 État Émotionnel</h2>
        <p className="text-lg text-neutral-dark/90">
          Comment te sens-tu émotionnellement aujourd'hui ?
        </p>
        <p className="italic text-sm text-[#9F85AF]/80 mt-2">
          Prends le temps d'écouter tes émotions et de les accueillir
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          <h3 className="font-display text-xl mb-5 text-[#9F85AF] flex items-center">
            🌸 Ressentis positifs
          </h3>
          <div className="space-y-4">
            {positiveFeelings.map((feeling, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => toggleFeeling(feeling.name)}
                  className={`w-full text-left p-5 rounded-xl transition-all flex items-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'bg-[#9F85AF]/20 border-2 border-[#9F85AF]'
                      : 'bg-white border-2 border-transparent hover:border-[#9F85AF]/30 shadow-sm hover:shadow'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'border-[#9F85AF] bg-[#9F85AF] text-white'
                      : 'border-neutral-dark/30'
                  }`}>
                    {selectedFeelings.includes(feeling.name) && <Check size={14} />}
                  </div>
                  <span className={`text-sm ${
                    selectedFeelings.includes(feeling.name) 
                      ? 'text-[#9F85AF] font-medium' 
                      : 'text-neutral-dark'
                  }`}>
                    {feeling.name}
                  </span>
                </button>
                {!showAllDescriptions && (
                  <button
                    onClick={() => setActiveDescription(
                      activeDescription === `positive-${index}` 
                        ? null 
                        : `positive-${index}`
                    )}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-dark/50 hover:text-[#9F85AF]"
                  >
                    <Info size={18} />
                  </button>
                )}
                {(activeDescription === `positive-${index}` || showAllDescriptions) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-4 bg-[#9F85AF]/5 border border-[#9F85AF]/10 rounded-xl text-sm"
                  >
                    <p className="mb-2">{feeling.description}</p>
                    <p className="text-[#9F85AF] italic">{feeling.probableOrigin}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-display text-xl mb-5 text-neutral-dark flex items-center">
            🍂 Ressentis à observer
          </h3>
          <div className="space-y-4">
            {negativeFeelings.map((feeling, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => toggleFeeling(feeling.name)}
                  className={`w-full text-left p-5 rounded-xl transition-all flex items-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'bg-warning/20 border-2 border-warning'
                      : 'bg-white border-2 border-transparent hover:border-warning/30 shadow-sm hover:shadow'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'border-warning bg-warning text-white'
                      : 'border-neutral-dark/30'
                  }`}>
                    {selectedFeelings.includes(feeling.name) && <Check size={14} />}
                  </div>
                  <span className={`text-sm ${
                    selectedFeelings.includes(feeling.name) 
                      ? 'text-warning font-medium' 
                      : 'text-neutral-dark'
                  }`}>
                    {feeling.name}
                  </span>
                </button>
                {!showAllDescriptions && (
                  <button
                    onClick={() => setActiveDescription(
                      activeDescription === `negative-${index}` 
                        ? null 
                        : `negative-${index}`
                    )}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-dark/50 hover:text-warning"
                  >
                    <Info size={18} />
                  </button>
                )}
                {(activeDescription === `negative-${index}` || showAllDescriptions) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-4 bg-neutral rounded-xl text-sm"
                  >
                    <p className="mb-2">{feeling.description}</p>
                    <p className="text-warning italic">{feeling.probableOrigin}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-8">
        <Button 
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={selectedFeelings.length === 0}
          className="bg-[#9F85AF] hover:bg-[#9F85AF]/90 px-10"
          icon={<ChevronRight size={18} />}
        >
          Valider mes ressentis
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-[#9F85AF]/70 italic">
            💗 Chaque émotion que tu ressens est valide
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmotionalCategory;