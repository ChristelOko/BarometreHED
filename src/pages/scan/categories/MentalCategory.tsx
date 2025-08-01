import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../context/LanguageContext';
import Button from '../../../components/common/Button';
import { Info, Check, ArrowLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface MentalCategoryProps {
  onComplete: (data: any) => void;
  onBack?: () => void;
}

const MentalCategory = ({ onComplete, onBack }: MentalCategoryProps) => {
  const { t } = useTranslation();
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [activeDescription, setActiveDescription] = useState<string | null>(null);
  const [showAllDescriptions, setShowAllDescriptions] = useState(false);
  
  const positiveFeelings = [
    {
      name: "Clarté soudaine",
      description: "Une idée limpide te traverse. Tu vois tout avec une netteté tranchante, comme si un brouillard venait de se lever.",
      probableOrigin: "Tu t'es recentrée, ou tu as été reconnue dans ta justesse. Ton mental peut alors se déployer naturellement."
    },
    {
      name: "Vision à long terme",
      description: "Tu captes des dynamiques, des structures, des directions futures. Ton esprit voit loin, au-delà de l'instant.",
      probableOrigin: "Tu es en posture d'observation détendue, sans pression. Ton génie stratégique peut alors s'exprimer."
    },
    {
      name: "Sagesse tranquille",
      description: "Tu ressens une stabilité intérieure. Ton esprit est posé, comme un lac clair. Tu sais, sans avoir besoin d'expliquer.",
      probableOrigin: "Tu es alignée, reconnue, et à ta juste place. Ton autorité intérieure est respectée."
    },
    {
      name: "Observation pénétrante",
      description: "Tu vois à travers les mots, les intentions, les dynamiques cachées. Ton esprit capte l'invisible, avec justesse.",
      probableOrigin: "Tu es dans un espace neutre où ton regard peut se poser librement, sans pression."
    },
    {
      name: "Pensées claires et organisées",
      description: "Mon esprit est ordonné et lucide. Je peux suivre mes pensées sans confusion et prendre des décisions avec assurance.",
      probableOrigin: "J'ai pris le temps de me recentrer. J'ai créé un environnement propice à la concentration."
    }
  ];
  
  const negativeFeelings = [
    {
      name: "Mental en boucle",
      description: "Des pensées reviennent sans cesse, comme une spirale impossible à stopper. Tu analyses, tu reviens sur les mêmes scénarios, tu cherches à comprendre à tout prix.",
      probableOrigin: "Tu as absorbé trop d'informations extérieures, ou tu cherches une validation que tu ne reçois pas."
    },
    {
      name: "Comparaison mentale",
      description: "Ton esprit saute d'une référence à une autre. Tu te compares aux autres, tu questionnes ta légitimité ou ta place.",
      probableOrigin: "Tu es en manque de reconnaissance ou tu n'as pas d'espace-ressource pour déposer ta vision."
    },
    {
      name: "Parasitage extérieur",
      description: "Tu sens des pensées ou des opinions qui ne te ressemblent pas. Ton esprit est troublé, comme si tu avais capté des idées d'ailleurs.",
      probableOrigin: "Tu as été trop exposée à des discours ou à des présences non alignées. Ton mental reflète l'environnement."
    },
    {
      name: "Hypervigilance mentale",
      description: "Ton esprit est en alerte constante. Tu anticipes tout, comme si tu devais contrôler ce qui pourrait mal tourner.",
      probableOrigin: "Tu as été poussée à prouver ta valeur intellectuelle ou à éviter des erreurs. Tu es en mode protection."
    },
    {
      name: "Pensées obsessionnelles",
      description: "Mon esprit tourne en boucle sur les mêmes idées. Je n'arrive pas à me libérer de certaines pensées qui reviennent sans cesse.",
      probableOrigin: "Anxiété non traitée, perfectionnisme, ou besoin de contrôle face à l'incertitude."
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
          className="flex items-center text-teal-500 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Retour aux catégories
        </button>
        <button
          onClick={() => setShowAllDescriptions(!showAllDescriptions)}
          className="flex items-center text-teal-500 bg-teal-500/10 px-3 py-1.5 rounded-full hover:bg-teal-500/20 transition-colors"
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
      
      <div className="bg-teal-500/10 rounded-xl p-8 mb-8 border-2 border-teal-500/20">
        <h2 className="font-display text-3xl mb-3 text-teal-500">🧠 État Mental</h2>
        <p className="text-lg text-neutral-dark/90">
          Comment se sent ton esprit aujourd'hui ?
        </p>
        <p className="italic text-sm text-teal-500/80 mt-2">
          Prends le temps d'observer tes pensées et ton activité mentale
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          <h3 className="font-display text-xl mb-5 text-teal-500 flex items-center">
            🌸 Ressentis positifs
          </h3>
          <div className="space-y-4">
            {positiveFeelings.map((feeling, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => toggleFeeling(feeling.name)}
                  className={`w-full text-left p-5 rounded-xl transition-all flex items-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'bg-teal-500/20 border-2 border-teal-500'
                      : 'bg-white border-2 border-transparent hover:border-teal-500/30 shadow-sm hover:shadow'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'border-teal-500 bg-teal-500 text-white'
                      : 'border-neutral-dark/30'
                  }`}>
                    {selectedFeelings.includes(feeling.name) && <Check size={14} />}
                  </div>
                  <span className={`text-sm ${
                    selectedFeelings.includes(feeling.name) 
                      ? 'text-teal-500 font-medium' 
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-dark/50 hover:text-teal-500"
                  >
                    <Info size={18} />
                  </button>
                )}
                {(activeDescription === `positive-${index}` || showAllDescriptions) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-4 bg-teal-500/5 border border-teal-500/10 rounded-xl text-sm"
                  >
                    <p className="mb-2">{feeling.description}</p>
                    <p className="text-teal-500 italic">{feeling.probableOrigin}</p>
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
          className="bg-teal-500 hover:bg-teal-500/90 px-10"
          icon={<ChevronRight size={18} />}
        >
          Valider mes ressentis
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-teal-500/70 italic">
            🧠 Ton esprit te parle, merci de l'écouter
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentalCategory;