import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../context/LanguageContext';
import Button from '../../../components/common/Button';
import { Info, Check, ArrowLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface DigestiveCategoryProps {
  onComplete: (data: any) => void;
  onBack?: () => void;
}

const DigestiveCategory = ({ onComplete, onBack }: DigestiveCategoryProps) => {
  const { t } = useTranslation();
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [activeDescription, setActiveDescription] = useState<string | null>(null);
  const [showAllDescriptions, setShowAllDescriptions] = useState(false);
  
  const positiveFeelings = [
    {
      name: "Digestion intuitive et fluide",
      description: "Tu sais exactement quoi manger, en quelle quantité, et tu te sens légère et nourrie après.",
      probableOrigin: "Tu as écouté ton intuition corporelle et respecté ton besoin de calme et de lenteur."
    },
    {
      name: "Plaisir sacral en bouche",
      description: "Tu ressens une joie réelle à manger. Chaque bouchée est vivante, ton ventre réagit avec plaisir.",
      probableOrigin: "Tu as suivi ton autorité sacrale, mangé ce qui te fait vibrer sans compromis."
    },
    {
      name: "Lenteur bénéfique après repas",
      description: "Après avoir mangé lentement, tu te sens calme, en paix, presque méditative.",
      probableOrigin: "Tu as respecté ton rythme digestif naturel. Tu es alignée avec ta sagesse corporelle."
    },
    {
      name: "Alignement digestif subtil",
      description: "Tu sens que ce que tu as mangé te soutient. Ton corps se pose, ton esprit s'éclaircit, tu es nourrie à tous les niveaux.",
      probableOrigin: "Tu as suivi ton rythme naturel, respecté ton intuition, et mangé dans un bon environnement."
    },
    {
      name: "Satiété consciente",
      description: "Tu reconnais facilement quand tu as suffisamment mangé. Tu t'arrêtes naturellement au bon moment, sans excès ni privation.",
      probableOrigin: "Tu as développé une écoute fine des signaux de ton corps et tu respectes ses limites."
    }
  ];
  
  const negativeFeelings = [
    {
      name: "Ballonnement après interaction",
      description: "Ton ventre gonfle comme un ballon après avoir passé du temps avec certaines personnes ou dans un environnement chargé.",
      probableOrigin: "Tu as absorbé des émotions ou de l'énergie qui ne t'appartiennent pas, sans filtrer consciemment."
    },
    {
      name: "Nœud au plexus après repas",
      description: "Tu ressens une tension ou une boule au niveau du plexus solaire après avoir mangé, sans raison apparente.",
      probableOrigin: "Tu as mangé trop vite, ou dans un contexte émotionnel stressant. Ton système s'est braqué."
    },
    {
      name: "Vide digestif malgré l'alimentation",
      description: "Tu manges, mais tu ne te sens pas nourrie. Comme s'il manquait quelque chose d'essentiel.",
      probableOrigin: "Tu n'as pas reçu d'énergie nourrissante dans tes échanges. Le vide est énergétique plus que physique."
    },
    {
      name: "Surcharge digestive émotionnelle",
      description: "Tu ressens un poids lourd après avoir mangé, comme si tu avais avalé autre chose que de la nourriture.",
      probableOrigin: "Tu as absorbé une tension émotionnelle ambiante. Ton système digestif en fait les frais."
    },
    {
      name: "Inconfort digestif",
      description: "Tu ressens une gêne dans ton ventre après avoir mangé. Ballonnements, lourdeur ou crampes perturbent ton confort.",
      probableOrigin: "Alimentation trop rapide, stress pendant le repas, ou aliments qui ne te conviennent pas."
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
          className="flex items-center text-amber-500 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Retour aux catégories
        </button>
        <button
          onClick={() => setShowAllDescriptions(!showAllDescriptions)}
          className="flex items-center text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full hover:bg-amber-500/20 transition-colors"
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
      
      <div className="bg-amber-500/10 rounded-xl p-8 mb-8 border-2 border-amber-500/20">
        <h2 className="font-display text-3xl mb-3 text-amber-500">🍽️ État Digestif</h2>
        <p className="text-lg text-neutral-dark/90">
          Comment se sent ton système digestif aujourd'hui ?
        </p>
        <p className="italic text-sm text-amber-500/80 mt-2">
          Prends le temps d'écouter les messages de ton ventre
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          <h3 className="font-display text-xl mb-5 text-amber-500 flex items-center">
            🌸 Ressentis positifs
          </h3>
          <div className="space-y-4">
            {positiveFeelings.map((feeling, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => toggleFeeling(feeling.name)}
                  className={`w-full text-left p-5 rounded-xl transition-all flex items-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'bg-amber-500/20 border-2 border-amber-500'
                      : 'bg-white border-2 border-transparent hover:border-amber-500/30 shadow-sm hover:shadow'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-neutral-dark/30'
                  }`}>
                    {selectedFeelings.includes(feeling.name) && <Check size={14} />}
                  </div>
                  <span className={`text-sm ${
                    selectedFeelings.includes(feeling.name) 
                      ? 'text-amber-500 font-medium' 
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-dark/50 hover:text-amber-500"
                  >
                    <Info size={18} />
                  </button>
                )}
                {(activeDescription === `positive-${index}` || showAllDescriptions) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl text-sm"
                  >
                    <p className="mb-2">{feeling.description}</p>
                    <p className="text-amber-500 italic">{feeling.probableOrigin}</p>
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
          className="bg-amber-500 hover:bg-amber-500/90 px-10"
          icon={<ChevronRight size={18} />}
        >
          Valider mes ressentis
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-amber-500/70 italic">
            🍽️ Ton ventre te parle, merci de l'écouter
          </p>
        </div>
      </div>
    </div>
  );
};

export default DigestiveCategory;