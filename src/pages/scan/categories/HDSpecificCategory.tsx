import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../context/LanguageContext';
import Button from '../../../components/common/Button';
import { Info, Check, ArrowLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

interface HDSpecificCategoryProps {
  onComplete: (data: any) => void;
  onBack?: () => void;
}

const HDSpecificCategory = ({ onComplete, onBack }: HDSpecificCategoryProps) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [activeDescription, setActiveDescription] = useState<string | null>(null);
  const [showAllDescriptions, setShowAllDescriptions] = useState(false);
  const [userHDType, setUserHDType] = useState<string | null>(null);
  
  useEffect(() => {
    if (user?.hdType) {
      setUserHDType(user.hdType);
    }
  }, [user]);

  // Filtrer les ressentis en fonction du type HD de l'utilisateur
  const getFeelingsForUserType = (isPositive: boolean) => {
    const hdType = userHDType || 'generator'; // Valeur par défaut si non défini
    
    if (hdType === 'generator') {
      return isPositive ? generatorPositiveFeelings : generatorNegativeFeelings;
    } else if (hdType === 'projector') {
      return isPositive ? projectorPositiveFeelings : projectorNegativeFeelings;
    } else if (hdType === 'manifesting-generator') {
      return isPositive ? manifestingGeneratorPositiveFeelings : manifestingGeneratorNegativeFeelings;
    } else if (hdType === 'manifestor') {
      return isPositive ? manifestorPositiveFeelings : manifestorNegativeFeelings;
    } else if (hdType === 'reflector') {
      return isPositive ? reflectorPositiveFeelings : reflectorNegativeFeelings;
    }
    
    // Fallback aux ressentis Generator si le type n'est pas reconnu
    return isPositive ? generatorPositiveFeelings : generatorNegativeFeelings;
  };
  
  // Ressentis positifs pour chaque type HD
  const projectorPositiveFeelings = [
    {
      name: "Clarté de direction intérieure",
      description: "Tu sens exactement ce qui est juste, où aller, quoi dire. C'est limpide.",
      probableOrigin: "Tu es dans ton autorité. Ta vision est alignée à ton rôle de guide."
    },
    {
      name: "Invitation inattendue reçue",
      description: "Quelqu'un t'a demandé conseil ou t'a invité à guider. C'était fluide.",
      probableOrigin: "Tu étais dans ton énergie juste, observant, sans forcer."
    },
    {
      name: "Sensibilité fine à l'environnement",
      description: "Tu captes tout. Les non-dits, les tensions, les intentions. C'est clair.",
      probableOrigin: "Tes centres ouverts agissent comme un radar. Tu perçois sans filtre."
    },
    {
      name: "Alignement instantané avec une personne",
      description: "Tu sens que tu comprends l'autre en un clin d'œil. Il y a fusion sans effort.",
      probableOrigin: "Tu es dans ton rôle de Projector, miroir, guide, canal profond."
    },
    {
      name: "Besoin d'hyper-justesse",
      description: "Tu ne supportes plus le faux, le forcé, le flou. Tout en toi réclame du vrai.",
      probableOrigin: "Ton aura affine son discernement. Tu approches une mutation."
    }
  ];
  
  const projectorNegativeFeelings = [
    {
      name: "Invisibilité douloureuse",
      description: "Tu as l'impression d'être transparente. Personne ne te consulte, ne te voit.",
      probableOrigin: "Tu n'es pas reconnu·e. Tu essaies peut-être de te rendre visible sans invitation."
    },
    {
      name: "Épuisement sans raison apparente",
      description: "Tu es vidé·e sans comprendre pourquoi. Même après du repos, la fatigue est là.",
      probableOrigin: "Tu fonctionnes comme un Generator. Tu forces. Tu absorbes l'énergie des autres."
    },
    {
      name: "Amertume sourde",
      description: "Tu ressens un fond d'agacement, de mépris, ou de retrait. Sans mot clair.",
      probableOrigin: "Tu n'as pas été reconnu·e. Tu t'es investi·e sans réponse ou retour."
    },
    {
      name: "Posture de guide non respectée",
      description: "Tu as partagé une vision mais on t'a ignoré·e, contredit·e ou devancé·e.",
      probableOrigin: "Tu as guidé sans être invité·e ou dans un mauvais timing."
    },
    {
      name: "Sentiment d'incompréhension totale",
      description: "Personne ne semble te comprendre. Tu te sens étrangère, isolée.",
      probableOrigin: "Ton aura unique te rend difficile à cerner. Tu n'es pas faite pour être standard."
    }
  ];

  const generatorPositiveFeelings = [
    {
      name: "Engagement plein et nourrissant",
      description: "Tu es absorbée dans une activité qui te remplit. Le temps disparaît.",
      probableOrigin: "Ton sacral est activé par une réponse alignée. Tu es dans ton flot naturel."
    },
    {
      name: "Répétition joyeuse",
      description: "Tu répètes une tâche simple, chaque jour, avec plaisir et fluidité.",
      probableOrigin: "Ton sacral aime la répétition quand elle est choisie et vivante."
    },
    {
      name: "Sacral ralenti mais vivant",
      description: "Tu n'as pas d'élan, mais tu sens que l'énergie est en recharge, pas en panne.",
      probableOrigin: "Ton corps te demande un rythme plus doux, sans pression de performance."
    },
    {
      name: "Énergie expansive après un oui sacral",
      description: "Tu as dit oui et tu sens ton énergie se déployer à vitesse divine.",
      probableOrigin: "Tu as suivi une réponse sacrale pure. Tu es dans ta puissance générative."
    },
    {
      name: "Joie de créer pour le plaisir",
      description: "Tu fais quelque chose qui n'a aucun but, mais qui te remplit.",
      probableOrigin: "Ton feu sacral est activé sans pression de résultat. Tu es dans ton essence."
    }
  ];
  
  const generatorNegativeFeelings = [
    {
      name: "Oui mental non sacral",
      description: "Tu as dit oui alors que ton corps disait non. Et tu t'en veux.",
      probableOrigin: "Tu as réagi depuis le mental, pas depuis ta vérité énergétique."
    },
    {
      name: "Frustration sans nom",
      description: "Tu t'agaces facilement. Rien n'avance comme tu veux.",
      probableOrigin: "Ton sacral est fermé. Tu fais des choses qui ne t'appartiennent plus."
    },
    {
      name: "Envie de tout envoyer balader",
      description: "Tu es à deux doigts de claquer la porte. Ton corps hurle l'arrêt.",
      probableOrigin: "Tu es engagée dans une voie qui ne nourrit plus ton feu."
    },
    {
      name: "Désalignement par surcharge",
      description: "Tu fais trop, trop vite. Ton énergie est brouillée. Tu n'es plus là.",
      probableOrigin: "Tu as oublié de sentir avant d'agir. Ton feu est dispersé."
    },
    {
      name: "Trou énergétique",
      description: "Tu as l'impression d'avoir tout donné sans rien recevoir en retour.",
      probableOrigin: "Tu t'es investie sans réponse claire ou sans satisfaction sacrale."
    }
  ];

  const manifestingGeneratorPositiveFeelings = [
    {
      name: "Éclair d'énergie fulgurant",
      description: "Une poussée soudaine d'envie te traverse. Tu veux tout lancer maintenant.",
      probableOrigin: "Ton canal d'initiation est activé. Tu reçois un feu pur."
    },
    {
      name: "Sauts logiques incompris",
      description: "Tu changes de sujet, d'envie ou de plan sans prévenir. Les autres ne suivent pas.",
      probableOrigin: "Tu es faite pour zigzaguer. Les lignes droites ne sont pas ton chemin."
    },
    {
      name: "Puissance sacrale hybride",
      description: "Tu sens que tu réponds ET que tu inities. Un feu à deux moteurs t'habite.",
      probableOrigin: "Tu es dans ton autorité. Les deux énergies te traversent harmonieusement."
    },
    {
      name: "Réponse instantanée claire",
      description: "Ton corps dit oui immédiatement. Tu sais, sans réfléchir.",
      probableOrigin: "Une proposition, un message ou une interaction a réveillé ton feu sacral et mental en même temps."
    },
    {
      name: "Besoin de tout réinventer",
      description: "Tu veux casser un système. Créer ta propre méthode. C'est vital.",
      probableOrigin: "Ton feu sacral est activé pour innover. Tu es prête à sauter les étapes."
    }
  ];
  
  const manifestingGeneratorNegativeFeelings = [
    {
      name: "Impatience explosive",
      description: "Tu veux que tout aille plus vite. Tu t'agaces de la lenteur autour.",
      probableOrigin: "Ton énergie est plus rapide que la moyenne. Mais le monde ne suit pas."
    },
    {
      name: "Épuisement par dispersion",
      description: "Tu as commencé 100 choses et rien n'est fini. Tu es à plat.",
      probableOrigin: "Tu n'as pas pris le temps de répondre sacralement avant de foncer."
    },
    {
      name: "Colère frustrée",
      description: "Tu te sens bridée, en cage. Ton feu se retourne contre toi.",
      probableOrigin: "Tu as dit oui sans feu. Tu t'es niée pour entrer dans un moule."
    },
    {
      name: "Blocage énergétique avant l'action",
      description: "Tu veux bouger mais ton corps dit non. Il y a comme un frein.",
      probableOrigin: "Tu essaies de forcer sans réponse sacrale ou sans clarté d'intention."
    },
    {
      name: "Énergie dispersée",
      description: "Tu ressens une fatigue étrange, comme si ton énergie était absorbée partout sauf sur l'essentiel.",
      probableOrigin: "Tu as dit oui à trop de directions sans t'écouter."
    }
  ];

  const manifestorPositiveFeelings = [
    {
      name: "Élan pur d'initiation",
      description: "Tu ressens une poussée inarrêtable de faire, dire ou lancer quelque chose.",
      probableOrigin: "Ton aura est ouverte pour initier. Tu es dans ton rôle de déclencheuse."
    },
    {
      name: "Impulsion canalisée",
      description: "Tu sens une idée ou une action mûrir en toi avec clarté et puissance.",
      probableOrigin: "Tu t'es donné le temps de sentir ton feu. Tu es prête à initier de façon alignée."
    },
    {
      name: "Silence génératif",
      description: "Tu ressens une paix dense, presque magnétique, dans ton espace intérieur.",
      probableOrigin: "Tu es en train de te recharger après avoir initié ou exprimé quelque chose d'essentiel."
    },
    {
      name: "Alignement d'impact",
      description: "Tu sens que ce que tu fais crée un effet puissant autour de toi.",
      probableOrigin: "Tu es dans ton rôle naturel d'initiatrice, respectée et libre."
    },
    {
      name: "Feu directorial",
      description: "Tu ressens une clarté impérieuse, un besoin d'ordonner, de structurer, de guider.",
      probableOrigin: "Tu as perçu une vision claire et tu es appelée à initier sa réalisation."
    }
  ];
  
  const manifestorNegativeFeelings = [
    {
      name: "Colère inexpliquée",
      description: "Une montée de rage ou d'irritation surgit, sans cause apparente.",
      probableOrigin: "Tu es bloquée dans ton initiation. Ton aura est contrariée."
    },
    {
      name: "Refus instinctif du contrôle",
      description: "Tu veux fuir tout cadre, règle ou autorité extérieure.",
      probableOrigin: "Ton autorité intérieure est réprimée. Ton aura se protège."
    },
    {
      name: "Envie de tout quitter",
      description: "Tu ressens une urgence de rupture, de départ, ou de changement radical.",
      probableOrigin: "Tu as été enfermée dans une dynamique étroite, sans espace de manœuvre."
    },
    {
      name: "Pression incontrôlée",
      description: "Tu sens une tension qui monte sans forme ni direction.",
      probableOrigin: "Ton énergie d'initiation est bloquée. Tu n'as pas trouvé comment l'exprimer."
    },
    {
      name: "Fermeture énergétique",
      description: "Tu ressens un mur intérieur. Tu ne veux plus interagir avec personne.",
      probableOrigin: "Tu as dépassé tes limites relationnelles. Ton aura se replie pour se protéger."
    }
  ];

  const reflectorPositiveFeelings = [
    {
      name: "Clarté lunaire intérieure",
      description: "Tu te sens centrée, paisible, en écho doux avec l'énergie du moment.",
      probableOrigin: "Ton aura a filtré les environnements. Tu es accordée à ta vibration naturelle."
    },
    {
      name: "Émerveillement pur",
      description: "Tout t'émeut : la lumière, les gens, un chant, un moment.",
      probableOrigin: "Tu es pleinement connectée à ta qualité d'observation pure et poétique."
    },
    {
      name: "Connexion sacrée à la nature",
      description: "Tu ressens un alignement immédiat dès que tu es dans la nature.",
      probableOrigin: "Ton aura se synchronise naturellement avec les cycles vivants."
    },
    {
      name: "Sensation d'unité collective",
      description: "Tu sens que tu fais partie de quelque chose de plus grand. Tout est interrelié.",
      probableOrigin: "Ton aura perçoit l'unité à travers les formes humaines. Tu es en lien avec l'âme du groupe."
    },
    {
      name: "Joie subtile et stable",
      description: "Tu ressens une paix douce, pas spectaculaire mais ancrée.",
      probableOrigin: "Ton aura est nourrie. Tu es dans un lieu ou un lien juste."
    }
  ];
  
  const reflectorNegativeFeelings = [
    {
      name: "Sensation d'être envahie",
      description: "Tu ressens les émotions ou les énergies des autres comme si c'étaient les tiennes.",
      probableOrigin: "Tu as absorbé des énergies externes sans filtre ni recentrage."
    },
    {
      name: "Perte de repères intérieurs",
      description: "Tu ne sais plus ce que tu veux, ni ce que tu ressens vraiment.",
      probableOrigin: "Trop de stimulations, pas assez de vide pour filtrer ce qui est toi."
    },
    {
      name: "Fermeture instinctive",
      description: "Tu ne veux voir personne, ni parler. C'est comme un réflexe vital.",
      probableOrigin: "Ton aura a trop absorbé. Elle te protège temporairement."
    },
    {
      name: "Énergie morcelée",
      description: "Tu changes d'avis, d'émotion, de direction toutes les heures.",
      probableOrigin: "Tu vis trop vite les reflets du monde. Ton rythme lunaire est nié."
    },
    {
      name: "Lune noire intérieure",
      description: "Tu ressens un vide étrange, comme un entre-deux, sans émotion ni élan.",
      probableOrigin: "Tu es dans une phase de transition lunaire. Rien ne doit être forcé."
    }
  ];

  const positiveFeelings = getFeelingsForUserType(true);
  const negativeFeelings = getFeelingsForUserType(false);

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

  const getHDTypeDisplayName = () => {
    switch(userHDType) {
      case 'projector': return 'Projector';
      case 'generator': return 'Generator';
      case 'manifesting-generator': return 'Manifesting Generator';
      case 'manifestor': return 'Manifestor';
      case 'reflector': return 'Reflector';
      default: return 'Human Design';
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-6">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-500 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Retour aux catégories
        </button>
        <button
          onClick={() => setShowAllDescriptions(!showAllDescriptions)}
          className="flex items-center text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full hover:bg-blue-500/20 transition-colors"
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
      
      <div className="bg-blue-500/10 rounded-xl p-8 mb-8 border-2 border-blue-500/20">
        <h2 className="font-display text-3xl mb-3 text-blue-500">👤 Spécifique {getHDTypeDisplayName()}</h2>
        <p className="text-lg text-neutral-dark/90">
          Comment te sens-tu dans ton design énergétique unique ?
        </p>
        <p className="italic text-sm text-blue-500/80 mt-2">
          Ces ressentis sont spécifiquement adaptés à ton type Human Design
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          <h3 className="font-display text-xl mb-5 text-blue-500 flex items-center">
            🌸 Ressentis positifs
          </h3>
          <div className="space-y-4">
            {positiveFeelings.map((feeling, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => toggleFeeling(feeling.name)}
                  className={`w-full text-left p-5 rounded-xl transition-all flex items-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'bg-blue-500/20 border-2 border-blue-500'
                      : 'bg-white border-2 border-transparent hover:border-blue-500/30 shadow-sm hover:shadow'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                    selectedFeelings.includes(feeling.name)
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-neutral-dark/30'
                  }`}>
                    {selectedFeelings.includes(feeling.name) && <Check size={14} />}
                  </div>
                  <span className={`text-sm ${
                    selectedFeelings.includes(feeling.name) 
                      ? 'text-blue-500 font-medium' 
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-dark/50 hover:text-blue-500"
                  >
                    <Info size={18} />
                  </button>
                )}
                {(activeDescription === `positive-${index}` || showAllDescriptions) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl text-sm"
                  >
                    <p className="mb-2">{feeling.description}</p>
                    <p className="text-blue-500 italic">{feeling.probableOrigin}</p>
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
          className="bg-blue-500 hover:bg-blue-500/90 px-10"
          icon={<ChevronRight size={18} />}
        >
          Valider mes ressentis
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-blue-500/70 italic">
            👤 Ton design énergétique te parle, merci de l'écouter
          </p>
        </div>
      </div>
    </div>
  );
};

export default HDSpecificCategory;