import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../context/LanguageContext';
import Button from '../../../components/common/Button';
import { Info, Check, ArrowLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface FeminineCycleCategoryProps {
  onComplete: (data: any) => void;
  onBack?: () => void;
}

const FeminineCycleCategory = ({ onComplete, onBack }: FeminineCycleCategoryProps) => {
  const { t } = useTranslation();
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [activeDescription, setActiveDescription] = useState<string | null>(null);
  const [showAllDescriptions, setShowAllDescriptions] = useState(false);
  
  const positiveFeelings = [
    {
      name: "Clarté intuitive ovulatoire",
      description: "Tu ressens un moment de lumière, de cohérence intérieure et d'inspiration.",
      probableOrigin: "Tu es dans la phase ovulatoire, ton champ magnétique est à son apogée."
    },
    {
      name: "Alignement lunaire doux",
      description: "Tu sens que ton cycle est en phase avec les lunes. Tu vibres avec le cosmos.",
      probableOrigin: "Ton ovulation ou ta menstruation coïncide avec la pleine ou nouvelle lune."
    },
    {
      name: "Sensualité magnétique",
      description: "Tu ressens un plaisir simple dans ton corps, une envie de toucher, de te montrer.",
      probableOrigin: "Ta montée hormonale te rend naturellement rayonnante et sensuelle."
    },
    {
      name: "Éveil utérin doux",
      description: "Tu ressens une pulsation discrète dans ton bas-ventre. Un calme qui respire.",
      probableOrigin: "Ton utérus s'ouvre doucement à une nouvelle phase ou une intention sacrée."
    },
    {
      name: "Cycle comme rituel lunaire sacré",
      description: "Tu vis chaque phase comme une cérémonie. Tu offres ton sang à la Terre ou à ton journal.",
      probableOrigin: "Tu as transformé ton cycle en un rituel personnel de guérison et d'alignement."
    }
  ];
  
  const negativeFeelings = [
    {
      name: "Hypersensibilité prémenstruelle",
      description: "Tu te sens ultra sensible, chaque émotion devient une vague intérieure.",
      probableOrigin: "Tu entres dans la phase prémenstruelle, où ton système énergétique capte tout."
    },
    {
      name: "Fatigue menstruelle dense",
      description: "Ton corps réclame le silence, la chaleur, le vide.",
      probableOrigin: "Tu es en pleine menstruation, ton système est en régénération."
    },
    {
      name: "Instabilité hormonale intérieure",
      description: "Tu te sens en dents de scie : énergie, humeur, pensées… tout bouge sans logique.",
      probableOrigin: "Tu es dans une phase de transition hormonale (prémenstruelle ou post-ovulatoire)."
    },
    {
      name: "Refus d'incarnation",
      description: "Tu rejettes ton corps, ton sang, tes formes. Rien ne semble juste.",
      probableOrigin: "Un traumatisme ancien ou un regard social pesant te remonte en période de saignement."
    },
    {
      name: "Déconnexion cyclique",
      description: "Tu ne sais plus où tu en es dans ton cycle. Tout semble flou.",
      probableOrigin: "Ton stress, ta charge mentale ou une transition intérieure ont perturbé ton rythme."
    }
  ];

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings(prev => 
      prev.includes(feeling)
        ? prev.filter(f => f !== feeling)
        : [...prev, feeling]
    );
  };

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
          className="flex items-center text-rose-500 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Retour aux catégories
        </button>
        <button
          onClick={() => setShowAllDescriptions(!showAllDescriptions)}
          className="flex items-center text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-full hover:bg-rose-500/20 transition-colors"
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
      
      <div className="bg-rose-500/10 rounded-xl p-8 mb-8 border-2 border-rose-500/20">
        <h2 className="font-display text-3xl mb-3 text-rose-500">🌙 Cycle Féminin</h2>
        <p className="text-lg text-neutral-dark/90">
          Comment se sent ton cycle menstruel aujourd'hui ?
        </p>
        <p className="italic text-sm text-rose-500/80 mt-2">
          Prends le temps d'écouter les messages de ton cycle
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          <h3 className="font-display text-xl mb-5 text-rose-500 flex items-center">
            🌸 Ressentis positifs
          </h3>
          <div className="space-y-4">
            {positiveFeelings.map((feeling, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => toggleFeeling(feeling.name)}
                  className={`w-full text-left p-5 rounded-xl transition-all flex items-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'bg-rose-500/20 border-2 border-rose-500'
                      : 'bg-white border-2 border-transparent hover:border-rose-500/30 shadow-sm hover:shadow'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'border-rose-500 bg-rose-500 text-white'
                      : 'border-neutral-dark/30'
                  }`}>
                    {selectedFeelings.includes(feeling.name) && <Check size={14} />}
                  </div>
                  <span className={`text-sm ${
                    selectedFeelings.includes(feeling.name) 
                      ? 'text-rose-500 font-medium' 
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-dark/50 hover:text-rose-500"
                  >
                    <Info size={18} />
                  </button>
                )}
                {(activeDescription === `positive-${index}` || showAllDescriptions) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-sm"
                  >
                    <p className="mb-2">{feeling.description}</p>
                    <p className="text-rose-500 italic">{feeling.probableOrigin}</p>
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
          className="bg-rose-500 hover:bg-rose-500/90 px-10"
          icon={<ChevronRight size={18} />}
        >
          Valider mes ressentis
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-rose-500/70 italic">
            🌙 Ton cycle te parle, merci de l'écouter
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeminineCycleCategory;