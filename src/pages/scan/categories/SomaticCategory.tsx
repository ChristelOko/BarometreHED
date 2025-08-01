import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../context/LanguageContext';
import Button from '../../../components/common/Button';
import { Info, Check, ArrowLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface SomaticCategoryProps {
  onComplete: (data: any) => void;
  onBack?: () => void;
}

const SomaticCategory = ({ onComplete, onBack }: SomaticCategoryProps) => {
  const { t } = useTranslation();
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [activeDescription, setActiveDescription] = useState<string | null>(null);
  const [showAllDescriptions, setShowAllDescriptions] = useState(false);
  
  const positiveFeelings = [
    {
      name: "Frisson de reconnaissance",
      description: "Tu ressens un frisson doux, un picotement subtil sur la peau, comme un oui énergétique.",
      probableOrigin: "Tu as été vue, entendue ou reconnue dans ta vérité."
    },
    {
      name: "Peau qui respire",
      description: "Tu ressens une fraîcheur agréable sur la peau, comme si ton corps respirait de l'intérieur.",
      probableOrigin: "Tu es dans un environnement sain, et ton énergie circule librement."
    },
    {
      name: "Chair de poule intuitive",
      description: "Tu ressens la chair de poule sans cause apparente. Une vérité invisible est passée par là.",
      probableOrigin: "Ton système perçoit quelque chose de juste, au-delà du mental. Une guidance subtile."
    },
    {
      name: "Toucher réparateur",
      description: "Tu ressens qu'un contact doux (mains, étoffe, animal) recharge ton système.",
      probableOrigin: "Ton champ énergétique a trouvé un point de régénération via le contact sensoriel."
    },
    {
      name: "Présence corporelle ancrée",
      description: "Je me sens pleinement présent(e) dans mon corps. Chaque sensation est claire, chaque mouvement est conscient.",
      probableOrigin: "J'ai pris le temps de me reconnecter à mes sensations et d'habiter pleinement mon corps."
    }
  ];
  
  const negativeFeelings = [
    {
      name: "Tension dans les épaules",
      description: "Tu ressens un poids entre les omoplates, comme si tu portais un fardeau invisible.",
      probableOrigin: "Tu as endossé des responsabilités ou des attentes qui ne t'appartiennent pas."
    },
    {
      name: "Impression de lourdeur",
      description: "Ton corps semble pesant, comme tiré vers le sol, sans vitalité ni élévation.",
      probableOrigin: "Tu as absorbé l'énergie d'un environnement non aligné. Trop de bruit extérieur."
    },
    {
      name: "Sensation d'étouffement",
      description: "Tu ressens une oppression dans la poitrine ou autour de la gorge, comme si l'air manquait.",
      probableOrigin: "Tu t'es sentie incomprise, pressée, ou envahie. Tu n'as pas eu l'espace pour être toi."
    },
    {
      name: "Fourmillements dans les mains",
      description: "Tes mains vibrent, picotent, comme si elles retenaient une énergie non libérée.",
      probableOrigin: "Tu as capté une information, une volonté ou un besoin d'agir... sans passage à l'acte."
    },
    {
      name: "Hypersensibilité au bruit",
      description: "Les sons me paraissent plus forts, plus agressifs ou plus envahissants que d'habitude.",
      probableOrigin: "Mon système nerveux est surchargé ou en état de protection."
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
          className="flex items-center text-indigo-500 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Retour aux catégories
        </button>
        <button
          onClick={() => setShowAllDescriptions(!showAllDescriptions)}
          className="flex items-center text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-full hover:bg-indigo-500/20 transition-colors"
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
      
      <div className="bg-indigo-500/10 rounded-xl p-8 mb-8 border-2 border-indigo-500/20">
        <h2 className="font-display text-3xl mb-3 text-indigo-500">👐 Somatique / Sensoriel</h2>
        <p className="text-lg text-neutral-dark/90">
          Comment se sentent ton corps et tes sens aujourd'hui ?
        </p>
        <p className="italic text-sm text-indigo-500/80 mt-2">
          Prends le temps d'écouter les sensations subtiles de ton corps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          <h3 className="font-display text-xl mb-5 text-indigo-500 flex items-center">
            🌸 Ressentis positifs
          </h3>
          <div className="space-y-4">
            {positiveFeelings.map((feeling, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => toggleFeeling(feeling.name)}
                  className={`w-full text-left p-5 rounded-xl transition-all flex items-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'bg-indigo-500/20 border-2 border-indigo-500'
                      : 'bg-white border-2 border-transparent hover:border-indigo-500/30 shadow-sm hover:shadow'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-neutral-dark/30'
                  }`}>
                    {selectedFeelings.includes(feeling.name) && <Check size={14} />}
                  </div>
                  <span className={`text-sm ${
                    selectedFeelings.includes(feeling.name) 
                      ? 'text-indigo-500 font-medium' 
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-dark/50 hover:text-indigo-500"
                  >
                    <Info size={18} />
                  </button>
                )}
                {(activeDescription === `positive-${index}` || showAllDescriptions) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-sm"
                  >
                    <p className="mb-2">{feeling.description}</p>
                    <p className="text-indigo-500 italic">{feeling.probableOrigin}</p>
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
          className="bg-indigo-500 hover:bg-indigo-500/90 px-10"
          icon={<ChevronRight size={18} />}
        >
          Valider mes ressentis
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-indigo-500/70 italic">
            👐 Ton corps te parle à travers tes sensations
          </p>
        </div>
      </div>
    </div>
  );
};

export default SomaticCategory;