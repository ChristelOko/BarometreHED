import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Heart, ArrowLeft, Shuffle, Star, Moon, Sun, Zap, Eye, BookOpen, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/authStore';
import { useAlertStore } from '../store/alertStore';

interface OracleCard {
  id: number;
  title: string;
  message: string;
  element: string;
  energy: 'high' | 'medium' | 'low';
  color: string;
  icon: string;
  guidance: string;
  affirmation: string;
}

const oracleCards: OracleCard[] = [
  {
    id: 1,
    title: "Énergie Florissante",
    message: "Ton énergie rayonne comme un soleil d'été. C'est le moment de créer et de partager ta lumière.",
    element: "Feu",
    energy: "high",
    color: "from-orange-400 to-pink-500",
    icon: "🌟",
    guidance: "Utilise cette énergie pour initier de nouveaux projets",
    affirmation: "Je rayonne ma vérité avec confiance"
  },
  {
    id: 2,
    title: "Sagesse Lunaire",
    message: "La lune t'invite à l'introspection. Écoute les murmures de ton âme dans le silence.",
    element: "Eau",
    energy: "low",
    color: "from-purple-400 to-blue-500",
    icon: "🌙",
    guidance: "Prends du temps pour la méditation et la réflexion",
    affirmation: "J'honore ma sagesse intérieure"
  },
  {
    id: 3,
    title: "Ancrage Terrestre",
    message: "Tes racines sont profondes. Connecte-toi à la stabilité de la Terre Mère.",
    element: "Terre",
    energy: "medium",
    color: "from-green-400 to-emerald-600",
    icon: "🌱",
    guidance: "Pratique l'ancrage et la gratitude",
    affirmation: "Je suis stable et enracinée"
  },
  {
    id: 4,
    title: "Souffle de Liberté",
    message: "Le vent du changement souffle. Laisse-toi porter vers de nouveaux horizons.",
    element: "Air",
    energy: "high",
    color: "from-cyan-400 to-blue-400",
    icon: "🦋",
    guidance: "Embrasse les changements avec légèreté",
    affirmation: "Je m'élève avec grâce et liberté"
  },
  {
    id: 5,
    title: "Cœur Ouvert",
    message: "L'amour circule librement en toi. Ton cœur est un jardin en fleurs.",
    element: "Éther",
    energy: "medium",
    color: "from-pink-400 to-rose-500",
    icon: "💖",
    guidance: "Partage ton amour sans condition",
    affirmation: "Mon cœur s'ouvre à l'amour infini"
  },
  {
    id: 6,
    title: "Transformation Sacrée",
    message: "Tu es dans un processus de métamorphose. Fais confiance au processus.",
    element: "Esprit",
    energy: "medium",
    color: "from-violet-400 to-purple-600",
    icon: "🔮",
    guidance: "Accueille les transformations avec patience",
    affirmation: "Je me transforme avec grâce"
  },
  {
    id: 7,
    title: "Intuition Cristalline",
    message: "Ton troisième œil s'ouvre. Fais confiance à tes perceptions subtiles.",
    element: "Lumière",
    energy: "high",
    color: "from-indigo-400 to-purple-500",
    icon: "👁️",
    guidance: "Écoute ton intuition avant tout",
    affirmation: "Je fais confiance à ma vision intérieure"
  },
  {
    id: 8,
    title: "Repos Régénérateur",
    message: "Ton corps et ton âme réclament du repos. Honore ce besoin sacré.",
    element: "Ombre",
    energy: "low",
    color: "from-gray-400 to-slate-500",
    icon: "🌙",
    guidance: "Accorde-toi du temps de récupération",
    affirmation: "Je me repose en paix et confiance"
  },
  {
    id: 9,
    title: "Créativité Débordante",
    message: "Ton énergie créatrice bouillonne. Laisse-la s'exprimer librement.",
    element: "Création",
    energy: "high",
    color: "from-yellow-400 to-orange-500",
    icon: "🎨",
    guidance: "Exprime ta créativité sans limites",
    affirmation: "Je crée avec joie et spontanéité"
  },
  {
    id: 10,
    title: "Équilibre Harmonieux",
    message: "Tu es en parfait équilibre. Savoure cette harmonie intérieure.",
    element: "Équilibre",
    energy: "medium",
    color: "from-teal-400 to-green-500",
    icon: "⚖️",
    guidance: "Maintiens cet équilibre par la conscience",
    affirmation: "Je suis en harmonie parfaite"
  },
  {
    id: 11,
    title: "Passion Ardente",
    message: "Le feu de la passion brûle en toi. Suis ce qui enflamme ton cœur.",
    element: "Flamme",
    energy: "high",
    color: "from-red-400 to-pink-500",
    icon: "🔥",
    guidance: "Poursuis tes passions avec détermination",
    affirmation: "Je vis ma passion pleinement"
  },
  {
    id: 12,
    title: "Guérison Douce",
    message: "L'énergie de guérison t'entoure. Laisse-la opérer sa magie.",
    element: "Guérison",
    energy: "medium",
    color: "from-emerald-400 to-teal-500",
    icon: "🌿",
    guidance: "Permets à la guérison de s'installer",
    affirmation: "Je guéris avec amour et patience"
  }
];

const OracleGame = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showAlert } = useAlertStore();
  const [gameState, setGameState] = useState<'intro' | 'shuffling' | 'selecting' | 'revealing' | 'result'>('intro');
  const [selectedCard, setSelectedCard] = useState<OracleCard | null>(null);
  const [shuffledCards, setShuffledCards] = useState<OracleCard[]>([]);
  const [question, setQuestion] = useState('');
  const [isShuffling, setIsShuffling] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [savedReadings, setSavedReadings] = useState<Array<{card: OracleCard, question: string, date: string}>>([]);

  // Charger les lectures sauvegardées
  useEffect(() => {
    const saved = localStorage.getItem(`oracle_readings_${user?.id}`);
    if (saved) {
      try {
        setSavedReadings(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing saved readings:', error);
        setSavedReadings([]);
      }
    }
  }, [user]);

  // Sauvegarder une lecture
  const saveReading = () => {
    if (!selectedCard || !user?.id) return;
    
    const newReading = {
      card: selectedCard,
      question,
      date: new Date().toISOString()
    };
    
    const updated = [newReading, ...savedReadings.slice(0, 9)]; // Garder 10 max
    setSavedReadings(updated);
    localStorage.setItem(`oracle_readings_${user.id}`, JSON.stringify(updated));
    showAlert('Lecture sauvegardée dans votre journal ! 📖', 'success');
  };

  // Exporter la lecture
  const exportReading = () => {
    if (!selectedCard) return;
    
    const content = `
🔮 ORACLE ÉNERGÉTIQUE - ${new Date().toLocaleDateString('fr-FR')}

Question : ${question}

Carte tirée : ${selectedCard.title} ${selectedCard.icon}
Élément : ${selectedCard.element}
Énergie : ${selectedCard.energy === 'high' ? 'Haute' : selectedCard.energy === 'medium' ? 'Équilibrée' : 'Douce'}

Message :
${selectedCard.message}

Guidance :
${selectedCard.guidance}

Affirmation :
"${selectedCard.affirmation}"

---
Généré par le Baromètre Énergétique
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oracle-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    // Mélanger les cartes au chargement
    setShuffledCards([...oracleCards].sort(() => Math.random() - 0.5));
  }, []);

  const startGame = () => {
    if (!question.trim()) {
      showAlert('Posez une question à l\'oracle pour commencer', 'warning');
      return;
    }
    setGameState('shuffling');
    shuffleCards();
  };

  const shuffleCards = () => {
    setIsShuffling(true);
    
    // Animation de mélange
    setTimeout(() => {
      const newShuffled = [...oracleCards].sort(() => Math.random() - 0.5);
      setShuffledCards(newShuffled);
      setIsShuffling(false);
      setGameState('selecting');
    }, 2000);
  };

  const selectCard = (card: OracleCard) => {
    setSelectedCard(card);
    setGameState('revealing');
    
    // Révélation après animation
    setTimeout(() => {
      setGameState('result');
    }, 1500);
  };

  const resetGame = () => {
    setGameState('intro');
    setSelectedCard(null);
    setQuestion('');
    setShowCardDetails(false);
    setShuffledCards([...oracleCards].sort(() => Math.random() - 0.5));
  };

  const getEnergyIcon = (energy: string) => {
    switch (energy) {
      case 'high': return <Sun size={20} className="text-accent" />;
      case 'medium': return <Star size={20} className="text-primary" />;
      case 'low': return <Moon size={20} className="text-secondary" />;
      default: return <Sparkles size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral via-primary/5 to-secondary/5 relative overflow-hidden py-16 md:py-24 pb-24 md:pb-8">
      {/* Étoiles animées en arrière-plan */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Particules flottantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20 text-primary/60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {['✨', '🌙', '⭐', '🔮', '💫'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-16 md:mb-20 mt-8 md:mt-12">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            icon={<ArrowLeft size={18} />}
            className="bg-white/95 backdrop-blur-sm border-primary/30 text-primary hover:bg-white shadow-sm"
          >
            Retour
          </Button>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl text-primary text-center flex-1 flex items-center justify-center"
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              🔮
            </motion.span>
            Oracle Énergétique
          </motion.h1>
          
          <div className="w-20"></div>
        </div>

        <AnimatePresence mode="wait">
          {/* Introduction */}
          {gameState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="bg-neutral-dark/90 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-primary/20 shadow-xl">
                <div className="relative mb-6">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 3, repeat: Infinity }
                    }}
                    className="text-6xl"
                  >
                    🔮
                  </motion.div>
                  
                  {/* Aura mystique */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </div>
                
                <h2 className="font-display text-2xl text-primary mb-4">
                  Bienvenue dans l'Oracle Énergétique
                </h2>
                
                <p className="text-white/90 mb-6 md:mb-8 leading-relaxed">
                  Posez une question à l'oracle et laissez les cartes vous guider vers la sagesse de votre énergie intérieure.
                </p>
                
                <div className="mb-6 md:mb-8">
                  <label className="block text-white mb-3 font-medium">
                    Quelle est votre question ? ✨
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ex: Quelle énergie dois-je cultiver aujourd'hui ?"
                    className="w-full p-4 rounded-2xl bg-white border-2 border-primary/50 text-neutral-dark placeholder-neutral-dark/60 resize-none focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
                    rows={3}
                  />
                </div>
                
                <Button
                  variant="primary"
                  onClick={startGame}
                  disabled={!question.trim()}
                  icon={<Sparkles size={20} />}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none shadow-lg"
                >
                  Consulter l'Oracle
                </Button>
                
                {/* Lectures sauvegardées */}
                {savedReadings.length > 0 && (
                  <div className="mt-6 p-4 bg-primary/20 rounded-2xl border border-primary/30">
                    <h4 className="font-medium text-white mb-3 flex items-center justify-center">
                      <BookOpen size={16} className="mr-2" />
                      Vos dernières lectures
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {savedReadings.slice(0, 3).map((reading, index) => (
                        <div key={index} className="text-xs text-white/80 p-2 bg-white/20 rounded-lg">
                          <div className="font-medium text-white">{reading.card.title} {reading.card.icon}</div>
                          <div className="truncate text-white/90">{reading.question}</div>
                          <div className="text-accent">{new Date(reading.date).toLocaleDateString('fr-FR')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Mélange des cartes */}
          {gameState === 'shuffling' && (
            <motion.div
              key="shuffling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="max-w-lg mx-auto">
                <div className="bg-neutral-dark/90 backdrop-blur-md rounded-3xl p-8 border border-primary/20 shadow-2xl mb-8">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1],
                      filter: [
                        "hue-rotate(0deg)",
                        "hue-rotate(360deg)"
                      ]
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity },
                      filter: { duration: 3, repeat: Infinity }
                    }}
                    className="text-8xl mb-8"
                  >
                    🔮
                  </motion.div>
                  
                  <h2 className="font-display text-3xl text-primary mb-4">
                    L'Oracle mélange les énergies...
                  </h2>
                  
                  <p className="text-white/90 mb-6 italic">
                    Votre question : <em>"{question}"</em>
                  </p>
                  
                  <div className="bg-primary/20 rounded-xl p-4 mb-8 border border-primary/30">
                    <p className="text-sm text-white">
                      ✨ Les cartes s'imprègnent de votre énergie...
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-16 h-24 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl shadow-lg border-2 border-white/30"
                      animate={{
                        y: [0, -20, 0],
                        rotateY: [0, 180, 360],
                        boxShadow: [
                          "0 10px 30px rgba(168,120,120,0.3)",
                          "0 20px 40px rgba(159,133,175,0.4)",
                          "0 10px 30px rgba(168,120,120,0.3)"
                        ]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-white text-xl">
                        🔮
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Sélection de carte */}
          {gameState === 'selecting' && (
            <motion.div
              key="selecting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h2 className="font-display text-3xl text-primary mb-4">
                Choisissez votre carte
              </h2>
              
              <p className="text-neutral-dark mb-4 text-lg">
                Laissez votre intuition vous guider vers la carte qui vous appelle
              </p>
              
              <div className="bg-neutral-dark/90 backdrop-blur-md rounded-2xl p-4 mb-6 border border-primary/20 max-w-2xl mx-auto">
                <p className="text-sm text-primary font-medium mb-2">
                  💫 Votre question : <em>"{question}"</em>
                </p>
                <p className="text-xs text-white/70">
                  Respirez profondément et laissez votre cœur choisir...
                </p>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 max-w-4xl mx-auto mb-6 md:mb-8">
                {shuffledCards.slice(0, 12).map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 50, rotateY: 180 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      rotateY: 0,
                    }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.6,
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -10,
                      boxShadow: "0 20px 40px rgba(168,120,120,0.4)",
                      rotateY: 5
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selectCard(card)}
                    className="cursor-pointer"
                  >
                    <div className="w-20 h-32 md:w-24 md:h-36 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl border-2 border-white/50 flex items-center justify-center relative overflow-hidden shadow-xl">
                      {/* Motif mystique au dos */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />
                      <div className="absolute inset-2 border border-white/60 rounded-lg" />
                      <div className="absolute inset-4 border border-white/30 rounded-md" />
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="text-white text-2xl"
                      >
                        🔮
                      </motion.div>
                      
                      {/* Effet de brillance */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: [-100, 100] }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          delay: index * 0.3 
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div>
                <Button
                  variant="outline"
                  onClick={shuffleCards}
                  icon={<Shuffle size={18} />}
                  className="bg-white/95 backdrop-blur-sm border-primary/30 text-primary hover:bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Remélanger
                </Button>
              </div>
            </motion.div>
          )}

          {/* Révélation */}
          {gameState === 'revealing' && selectedCard && (
            <motion.div
              key="revealing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h2 className="font-display text-3xl text-primary mb-8">
                Révélation de votre carte...
              </h2>
              
              <div className="bg-neutral-dark/90 backdrop-blur-md rounded-2xl p-6 mb-8 border border-primary/20 max-w-lg mx-auto">
                <p className="text-primary font-medium mb-2">
                  ✨ La carte choisie se révèle...
                </p>
                <p className="text-sm text-white/80">
                  Votre intuition vous a guidé vers la bonne énergie
                </p>
              </div>
              
              <motion.div
                initial={{ rotateY: 0, scale: 1, y: 0 }}
                animate={{ 
                  rotateY: 180, 
                  scale: 1.3,
                  y: -20,
                  boxShadow: [
                    "0 10px 30px rgba(168,120,120,0.3)",
                    "0 30px 60px rgba(168,120,120,0.6)",
                    "0 10px 30px rgba(168,120,120,0.3)"
                  ]
                }}
                transition={{ duration: 1.5, boxShadow: { duration: 2, repeat: Infinity } }}
                className="w-32 h-48 mx-auto bg-gradient-to-br from-primary via-secondary to-accent rounded-xl border-2 border-white/50 flex items-center justify-center shadow-2xl"
              >
                <motion.div 
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 1.5 },
                    scale: { duration: 0.5, repeat: Infinity }
                  }}
                  className="text-white text-4xl"
                >
                  🔮
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Résultat */}
          {gameState === 'result' && selectedCard && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-6 md:mb-8">
                <h2 className="font-display text-3xl text-primary mb-4">
                  Votre Message de l'Oracle
                </h2>
                <p className="text-neutral-dark italic">
                  En réponse à : <em>"{question}"</em>
                </p>
              </div>
              
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-neutral-dark/90 backdrop-blur-md rounded-3xl p-6 md:p-8 border-2 border-primary/20 relative overflow-hidden shadow-2xl"
              >
                {/* Effet de lumière mystique */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                  animate={{ x: [-300, 300] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                <div className="relative z-10">
                  {/* Carte révélée */}
                  <motion.div
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 1 }}
                    className={`w-36 h-56 mx-auto mb-8 bg-gradient-to-br ${selectedCard.color} rounded-xl border-3 border-white/40 flex flex-col items-center justify-center text-white shadow-2xl relative overflow-hidden`}
                  >
                    {/* Effet de brillance sur la carte */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: [-150, 150] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                    
                    <div className="text-5xl mb-3 relative z-10">{selectedCard.icon}</div>
                    <div className="text-sm font-bold text-center px-2 relative z-10">
                      {selectedCard.title}
                    </div>
                    <div className="text-xs mt-2 opacity-90 font-medium relative z-10">
                      {selectedCard.element}
                    </div>
                  </motion.div>
                  
                  {/* Informations de la carte */}
                  <div className="text-center space-y-6">
                    <div>
                      <h3 className="font-display text-2xl text-primary mb-3 flex items-center justify-center">
                        {selectedCard.icon} {selectedCard.title}
                      </h3>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <span className="px-3 py-1 bg-primary/10 rounded-full text-primary text-sm">
                          {selectedCard.element}
                        </span>
                        <div className="flex items-center space-x-1">
                          {getEnergyIcon(selectedCard.energy)}
                          <span className="text-white text-sm capitalize">
                            {selectedCard.energy === 'high' ? 'Énergie Haute' : 
                             selectedCard.energy === 'medium' ? 'Énergie Équilibrée' : 'Énergie Douce'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-primary/20 rounded-2xl p-6 border border-primary/30 relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                        animate={{ x: [-200, 200] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <h4 className="font-medium text-white mb-3">💫 Message</h4>
                      <p className="text-white/90 leading-relaxed text-lg relative z-10">
                        {selectedCard.message}
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-secondary/20 rounded-2xl p-6 border border-secondary/30"
                    >
                      <h4 className="font-medium text-white mb-3">🌟 Guidance</h4>
                      <p className="text-white/90 leading-relaxed">
                        {selectedCard.guidance}
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-6 border-2 border-primary/30 relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
                        animate={{ x: [-250, 250] }}
                        transition={{ duration: 5, repeat: Infinity }}
                      />
                      <h4 className="font-medium text-white mb-3">✨ Affirmation</h4>
                      <p className="text-accent font-bold italic text-xl leading-relaxed relative z-10">
                        "{selectedCard.affirmation}"
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 md:mt-8">
                <Button
                  variant="outline"
                  onClick={saveReading}
                  icon={<BookOpen size={18} />}
                  className="bg-white/95 backdrop-blur-sm border-primary/30 text-primary hover:bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Sauvegarder
                </Button>
                
                <Button
                  variant="outline"
                  onClick={exportReading}
                  icon={<Download size={18} />}
                  className="bg-white/95 backdrop-blur-sm border-primary/30 text-primary hover:bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Exporter
                </Button>
                
                <Button
                  variant="outline"
                  onClick={resetGame}
                  icon={<RotateCcw size={18} />}
                  className="bg-white/95 backdrop-blur-sm border-primary/30 text-primary hover:bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Nouvelle consultation
                </Button>
              </div>
              
              {/* Message de gratitude */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-8 text-center"
              >
                <div className="bg-gradient-to-r from-accent/20 to-warning/20 rounded-2xl p-6 border border-accent/30 max-w-lg mx-auto">
                  <p className="text-white font-medium mb-2">
                    🙏 Merci d'avoir consulté l'Oracle
                  </p>
                  <p className="text-sm text-white/80">
                    Portez cette guidance dans votre cœur et laissez-la illuminer votre chemin
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OracleGame;