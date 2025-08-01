import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../context/LanguageContext';
import Button from '../../../components/common/Button';
import { Info, Check, ArrowLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface EnergeticCategoryProps {
  onComplete: (data: any) => void;
  onBack?: () => void;
}

const EnergeticCategory = ({ onComplete, onBack }: EnergeticCategoryProps) => {
  const { t } = useTranslation();
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [activeDescription, setActiveDescription] = useState<string | null>(null);
  const [showAllDescriptions, setShowAllDescriptions] = useState(false);
  
  const positiveFeelings = [
    {
      name: "Pic de clarté énergétique",
      description: "Une soudaine montée de lucidité t'envahit, comme si tout devenait évident.",
      probableOrigin: "Tu es alignée avec un moment juste, dans un environnement qui te nourrit."
    },
    {
      name: "Rayonnement tranquille",
      description: "Tu sens une chaleur douce rayonner depuis ton centre, sans effort.",
      probableOrigin: "Tu es exactement là où tu dois être. Reconnaissance et repos t'entourent."
    },
    {
      name: "Point d'ancrage lumineux",
      description: "Tu sens un point stable, chaud et serein dans ton ventre ou ta poitrine.",
      probableOrigin: "Tu es revenue à toi après avoir observé. Tu es ancrée sans être piégée."
    },
    {
      name: "Connexion divine",
      description: "Tu ressens un flux limpide entre le haut de ton crâne et ton cœur. Tu es en lien.",
      probableOrigin: "Une vérité, une vision ou une reconnaissance t'a reconnectée à l'essentiel."
    },
    {
      name: "Énergie cristalline stable",
      description: "Tu ressens une clarté légère et stable. Ton corps, ton esprit et ton espace sont limpides.",
      probableOrigin: "Tu vis un moment d'harmonie collective. L'alignement du monde résonne en toi."
    }
  ];
  
  const negativeFeelings = [
    {
      name: "Vide magnétique",
      description: "Tu ressens un vide profond, comme si ton champ énergétique était vidé de sa substance.",
      probableOrigin: "Tu as été exposée trop longtemps à des environnements qui ne te reconnaissent pas."
    },
    {
      name: "Éparpillement interne",
      description: "Tu te sens fragmentée, comme si ton énergie était dispersée dans mille directions.",
      probableOrigin: "Tu t'es engagée dans trop de choses sans véritable invitation."
    },
    {
      name: "Fuite énergétique subtile",
      description: "Tu ressens une fatigue étrange, comme si ton énergie s'évaporait lentement.",
      probableOrigin: "Tu donnes ton attention sans qu'elle soit invitée, ou tu restes dans un lieu désaligné."
    },
    {
      name: "Chute brutale d'énergie",
      description: "Tu passes d'un état fonctionnel à une lourdeur instantanée, sans raison apparente.",
      probableOrigin: "Ton corps te signale qu'il est allé au-delà de ses limites invisibles."
    },
    {
      name: "Débordement d'informations subtiles",
      description: "Tu captes tout : émotions, tensions, non-dits. Tu ne sais plus ce qui t'appartient.",
      probableOrigin: "Ton aura est ouverte mais sans ancrage. Tu es submergée."
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
          className="flex items-center text-purple-500 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Retour aux catégories
        </button>
        <button
          onClick={() => setShowAllDescriptions(!showAllDescriptions)}
          className="flex items-center text-purple-500 bg-purple-500/10 px-3 py-1.5 rounded-full hover:bg-purple-500/20 transition-colors"
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
      
      <div className="bg-purple-500/10 rounded-xl p-8 mb-8 border-2 border-purple-500/20">
        <h2 className="font-display text-3xl mb-3 text-purple-500">⚡ État Énergétique</h2>
        <p className="text-lg text-neutral-dark/90">
          Comment se sent ton champ énergétique aujourd'hui ?
        </p>
        <p className="italic text-sm text-purple-500/80 mt-2">
          Prends le temps d'observer les flux subtils de ton énergie
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          <h3 className="font-display text-xl mb-5 text-purple-500 flex items-center">
            🌸 Ressentis positifs
          </h3>
          <div className="space-y-4">
            {positiveFeelings.map((feeling, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => toggleFeeling(feeling.name)}
                  className={`w-full text-left p-5 rounded-xl transition-all flex items-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'bg-purple-500/20 border-2 border-purple-500'
                      : 'bg-white border-2 border-transparent hover:border-purple-500/30 shadow-sm hover:shadow'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'border-purple-500 bg-purple-500 text-white'
                      : 'border-neutral-dark/30'
                  }`}>
                    {selectedFeelings.includes(feeling.name) && <Check size={14} />}
                  </div>
                  <span className={`text-sm ${
                    selectedFeelings.includes(feeling.name) 
                      ? 'text-purple-500 font-medium' 
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-dark/50 hover:text-purple-500"
                  >
                    <Info size={18} />
                  </button>
                )}
                {(activeDescription === `positive-${index}` || showAllDescriptions) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl text-sm"
                  >
                    <p className="mb-2">{feeling.description}</p>
                    <p className="text-purple-500 italic">{feeling.probableOrigin}</p>
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
          className="bg-purple-500 hover:bg-purple-500/90 px-10"
          icon={<ChevronRight size={18} />}
        >
          Valider mes ressentis
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-purple-500/70 italic">
            ⚡ Ton énergie te parle, merci de l'écouter
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnergeticCategory;