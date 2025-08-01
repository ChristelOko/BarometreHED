import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, MessageCircle, Mic, MicOff, Volume2, VolumeX, Sparkles, Camera, Image, Smile } from 'lucide-react';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { OpenAIService, ChatResponse } from '../../services/openAIService';

interface Message {
  id: string;
  type: 'user' | 'aminata';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  hasImage?: boolean;
  imageUrl?: string;
}

interface ConversationState {
  phase: 'welcome' | 'exploration' | 'deepening' | 'completion';
  selectedFeelings: string[];
  selectedCategory: string;
  insights: string[];
}

const ConversationalScan = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { showAlertDialog } = useAlertStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openAIService, setOpenAIService] = useState<OpenAIService | null>(null);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    phase: 'welcome',
    selectedFeelings: [],
    selectedCategory: 'general',
    insights: []
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Vérifier l'authentification
  useEffect(() => {
    if (!isAuthenticated) {
      showAlertDialog(
        'Connexion requise 🔐',
        'Vous devez être connectée pour accéder au diagnostic conversationnel avec Aminata.',
        'warning',
        () => navigate('/login', { state: { returnTo: '/scan-conversational' } })
      );
    }
  }, [isAuthenticated, navigate]);

  // Initialiser l'IA conversationnelle
  useEffect(() => {
    const initializeAI = async () => {
      if (user?.id && user?.hdType) {
        const ai = new OpenAIService();
        await ai.initializeConversation(user.name || 'ma belle', user.hdType);
        setOpenAIService(ai);
        
        // Message de bienvenue avec image conceptuelle
        if (messages.length === 0) {
          addMessage('aminata', `Bonjour ${user.name || 'ma belle'} 🌸\n\nJe suis Aminata, votre guide énergétique. Imaginez-vous dans un espace sacré, comme une île de paix au milieu de l'océan de votre quotidien.\n\nComment vous sentez-vous dans votre corps en ce moment ?`, false, true, 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800');
        }
      }
    };

    if (isAuthenticated && user) {
      initializeAI();
    }
  }, [user, isAuthenticated]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (type: 'user' | 'aminata', content: string, isTyping = false, hasImage = false, imageUrl?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      isTyping,
      hasImage,
      imageUrl
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !openAIService) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Ajouter le message utilisateur
    addMessage('user', userMessage);
    
    setIsLoading(true);
    
    // Ajouter l'indicateur de frappe
    addMessage('aminata', '', true);
    
    try {
      console.log('🚀 Envoi du message à ChatGPT:', userMessage);
      
      // Dialogue avec Aminata via ChatGPT
      const response = await openAIService.dialogueWithAminata(userMessage);
      
      console.log('📥 Réponse reçue de ChatGPT:', response);
      
      // Supprimer l'indicateur de frappe
      setMessages(prev => prev.filter(m => !m.isTyping));
      
      if (!response.message) {
        console.warn('⚠️ Pas de message dans la réponse');
        addMessage('aminata', "Peux-tu me redire ce que tu ressens ? 🌸");
        return;
      }
      
      // Ajouter la réponse d'Aminata avec image contextuelle parfois
      const shouldAddImage = Math.random() > 0.7; // 30% de chance d'avoir une image
      const contextualImages = [
        'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800'
      ];
      
      const randomImage = contextualImages[Math.floor(Math.random() * contextualImages.length)];
      
      addMessage('aminata', response.message, false, shouldAddImage, shouldAddImage ? randomImage : undefined);
      
      // Extraire les ressentis suggérés par Aminata
      if (response.suggestedFeelings && response.suggestedFeelings.length > 0) {
        console.log('🎯 Ressentis détectés:', response.suggestedFeelings);
        setConversationState(prev => ({
          ...prev,
          selectedFeelings: [...new Set([...prev.selectedFeelings, ...response.suggestedFeelings!])]
        }));
      }
      
      // Vérifier si Aminata indique que la conversation est prête pour l'analyse
      if (response.isReadyForAnalysis || openAIService.isReadyForAnalysis()) {
        console.log('✨ Conversation prête pour l\'analyse');
        setConversationComplete(true);
        setShowCompletionDialog(true);
      }

    } catch (error) {
      console.error('Erreur lors de la génération de réponse:', error);
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      
      showAlertDialog(
        'Aminata se reconnecte... 🌸',
        'Je prends un moment pour mieux t\'écouter. Peux-tu me redire ce que tu ressens dans ton corps ?',
        'info'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in (window as any) || 'SpeechRecognition' in (window as any)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        showAlertDialog(
          'Reconnaissance vocale indisponible 🎤',
          'La reconnaissance vocale n\'est pas disponible sur votre appareil. Vous pouvez continuer en tapant votre message.',
          'info'
        );
      };
      
      recognition.start();
    } else {
      showAlertDialog(
        'Fonctionnalité non supportée 🎤',
        'La reconnaissance vocale n\'est pas supportée par votre navigateur. Vous pouvez continuer en tapant votre message.',
        'info'
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const completeConversation = () => {
    // Calculer un score basé sur la conversation
    const conversationData = openAIService?.getConversationState();
    const detectedFeelings = conversationData?.selectedFeelings || conversationState.selectedFeelings;
    
    // Calcul de score plus intelligent basé sur l'analyse
    let baseScore = 60;
    
    // Analyser le sentiment général de la conversation
    const positiveKeywords = ['bien', 'super', 'génial', 'heureux', 'heureuse', 'énergique', 'motivée', 'sereine', 'paisible'];
    const negativeKeywords = ['mal', 'difficile', 'fatiguée', 'épuisée', 'stressée', 'anxieuse', 'triste', 'lourde', 'tendue'];
    
    const conversationText = messages
      .filter(m => m.type === 'user')
      .map(m => m.content.toLowerCase())
      .join(' ');
    
    const positiveCount = positiveKeywords.filter(word => conversationText.includes(word)).length;
    const negativeCount = negativeKeywords.filter(word => conversationText.includes(word)).length;
    
    // Ajuster le score selon le sentiment
    if (positiveCount > negativeCount) {
      baseScore += (positiveCount - negativeCount) * 8;
    } else if (negativeCount > positiveCount) {
      baseScore -= (negativeCount - positiveCount) * 6;
    }
    
    // Bonus pour la richesse des ressentis détectés
    baseScore += detectedFeelings.length * 3;
    
    // Bonus pour la longueur de la conversation (engagement)
    const userMessages = messages.filter(m => m.type === 'user').length;
    baseScore += Math.min(userMessages * 2, 15);
    
    const finalScore = Math.max(20, Math.min(95, baseScore));
    
    console.log('📊 Calcul du score conversationnel:', {
      baseScore: 60,
      positiveCount,
      negativeCount,
      detectedFeelingsCount: detectedFeelings.length,
      userMessagesCount: userMessages,
      finalScore
    });
    
    // Naviguer vers les résultats avec les données conversationnelles
    navigate('/results', {
      state: {
        results: {
          conversational: {
            score: finalScore,
            selectedFeelings: detectedFeelings,
            category: conversationState.selectedCategory || 'general'
          }
        },
        isConversational: true,
        hdType: user?.hdType || 'generator',
        conversationalData: {
          totalMessages: messages.length,
          conversationDuration: `${Math.floor(messages.length * 1.5)} min`,
          aiInsights: conversationData?.insights || [],
          sentimentAnalysis: {
            positiveCount,
            negativeCount,
            dominantTone: positiveCount > negativeCount ? 'positive' : 
                         negativeCount > positiveCount ? 'challenging' : 'balanced'
          }
        }
      }
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header moderne avec avatar Aminata */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/scan')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50"
                >
                  <img 
                    src="/profilAminata.jpeg" 
                    alt="Aminata"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<span class="text-white text-lg flex items-center justify-center w-full h-full bg-gradient-to-br from-primary to-secondary">🌸</span>';
                    }}
                  />
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h2 className="font-medium text-white">Aminata</h2>
                <p className="text-xs text-white/60">Guide énergétique IA</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {conversationComplete && (
              <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                ✨ Prête
              </div>
            )}
            <button
              onClick={isSpeaking ? stopSpeaking : undefined}
              className={`p-2 rounded-full transition-colors ${
                isSpeaking 
                  ? 'bg-orange-500/20 text-orange-400' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Zone de conversation - Style moderne */}
      <div className="pt-20 pb-24 px-4 h-screen overflow-y-auto">
        <div className="max-w-md mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white rounded-3xl rounded-br-lg'
                    : 'bg-gray-800 text-white rounded-3xl rounded-bl-lg border border-gray-700'
                } px-4 py-3 shadow-lg`}>
                  {message.isTyping ? (
                    <div className="flex items-center space-x-2 py-2">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-white/60 rounded-full"
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-white/80">Aminata réfléchit...</span>
                    </div>
                  ) : (
                    <>
                      {/* Image contextuelle pour Aminata */}
                      {message.hasImage && message.imageUrl && message.type === 'aminata' && (
                        <div className="mb-3 rounded-2xl overflow-hidden">
                          <img 
                            src={message.imageUrl}
                            alt="Visualisation énergétique"
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {message.content}
                      </p>
                      
                      {/* Timestamp discret */}
                      <p className="text-xs text-white/40 mt-2">
                        {message.timestamp.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      
                      {/* Bouton audio pour les messages d'Aminata */}
                      {message.type === 'aminata' && !message.isTyping && (
                        <button
                          onClick={() => speakMessage(message.content)}
                          className="mt-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                          title="Écouter le message"
                        >
                          <Volume2 size={12} className="text-white/60" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions rapides modernes */}

      {/* Zone de saisie moderne - Style iMessage */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-md mx-auto">
          {/* Notification d'analyse prête */}
          {(conversationState.phase === 'completion' || conversationComplete) && (
            <div className="mb-3 p-3 bg-green-500/20 rounded-2xl border border-green-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-green-400">Analyse énergétique prête</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={completeConversation}
                  icon={<Sparkles size={14} />}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1"
                >
                  Voir
                </Button>
              </div>
            </div>
          )}

          {/* Barre de saisie moderne */}
          <div className="flex items-end space-x-3">
            {/* Boutons d'actions */}
            <div className="flex space-x-2">
              <button
                onClick={startListening}
                className={`p-3 rounded-full transition-all ${
                  isListening 
                    ? 'bg-red-500/20 text-red-400 animate-pulse scale-110' 
                    : 'bg-gray-800 text-white/60 hover:bg-gray-700 hover:text-white'
                }`}
                title="Reconnaissance vocale"
                disabled={conversationComplete}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>
            
            {/* Zone de texte */}
            <div className="flex-1 relative">
              <div className="bg-gray-800 rounded-3xl border border-gray-600 overflow-hidden">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={conversationComplete ? "Conversation terminée" : "Tapez votre message..."}
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
                  disabled={isLoading || conversationComplete}
                />
              </div>
            </div>
            
            {/* Bouton d'envoi */}
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || conversationComplete}
              className={`p-3 rounded-full transition-all ${
                inputValue.trim() && !isLoading && !conversationComplete
                  ? 'bg-blue-500 hover:bg-blue-600 scale-100' 
                  : 'bg-gray-700 scale-95'
              }`}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={18} className="text-white/60" />
                </motion.div>
              ) : (
                <Send size={18} className={inputValue.trim() ? 'text-white' : 'text-white/40'} />
              )}
            </button>
          </div>

          {/* Indicateurs de statut */}
          <div className="mt-2 flex items-center justify-center space-x-4 text-xs text-white/40">
            <span>🔒 Conversation sécurisée</span>
            <span>🤖 Alimentée par ChatGPT</span>
            {(conversationState.selectedFeelings.length > 0 || openAIService?.getConversationState()?.selectedFeelings.length) && (
              <span className="bg-primary/20 text-primary px-2 py-1 rounded-full">
                {(openAIService?.getConversationState()?.selectedFeelings.length || conversationState.selectedFeelings.length)} ressentis
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Dialogue de completion */}
      <ConfirmationDialog
        isOpen={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        title="Analyse prête ! ✨"
        message={`J'ai maintenant une belle vision de ton paysage énergétique, ${user?.name || 'ma belle'}. Es-tu prête à découvrir ton analyse personnalisée ?`}
        type="success"
        showActions={true}
        onConfirm={() => {
          setShowCompletionDialog(false);
          completeConversation();
        }}
        confirmText="Voir mon analyse 🌸"
        cancelText="Continuer la conversation"
      />
    </div>
  );
};

export default ConversationalScan;