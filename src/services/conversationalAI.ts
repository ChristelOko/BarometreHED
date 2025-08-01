/**
 * Service d'IA conversationnelle hybride pour Aminata
 * Intègre OpenAI ChatGPT pour des réponses plus naturelles
 * Version optimisée pour une expérience fluide
 */

import { OpenAIService } from './openAIService';
import type { ChatGPTResponse } from './openAIService';

export interface ConversationMemory {
  userId: string;
  hdType: string;
  conversationHistory: ConversationTurn[];
  emotionalPatterns: EmotionalPattern[];
  energyTrends: EnergyTrend[];
  preferences: UserPreferences;
  lastUpdated: string;
}

export interface ConversationTurn {
  timestamp: string;
  category: string;
  userResponse: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  emotionalTone: string[];
  energyLevel: 'high' | 'medium' | 'low';
  selectedFeelings: string[];
  score: number;
}

export interface EmotionalPattern {
  pattern: string;
  frequency: number;
  contexts: string[];
  lastSeen: string;
}

export interface EnergyTrend {
  timeOfDay: string;
  dayOfWeek: string;
  averageScore: number;
  commonFeelings: string[];
}

export interface UserPreferences {
  preferredTone: 'gentle' | 'encouraging' | 'direct';
  responseLength: 'short' | 'medium' | 'detailed';
  focusAreas: string[];
  avoidTopics: string[];
}

export interface IntelligentResponse {
  message: string;
  tone: 'supportive' | 'celebratory' | 'gentle' | 'encouraging';
  followUpQuestion?: string;
  suggestedFeelings?: string[];
  personalizedInsight?: string;
  shouldCompleteConversation?: boolean;
}

/**
 * Moteur d'IA conversationnelle principal
 */
export class ConversationalAI {
  private memory: ConversationMemory | null = null;
  private openAIService: OpenAIService;

  constructor(private userId: string, private hdType: string, private userName: string) {
    this.openAIService = new OpenAIService();
  }

  /**
   * Initialise ou charge la mémoire conversationnelle
   */
  async initializeMemory(): Promise<void> {
    // Initialiser OpenAI avec le contexte utilisateur
    this.openAIService.initializeConversation(this.userName, this.hdType);
    
    console.log(`🧠 Mémoire conversationnelle initialisée pour ${this.userName}`);
    
    try {
      // Charger depuis localStorage d'abord
      const stored = localStorage.getItem(`conversation_memory_${this.userId}`);
      
      if (stored) {
        this.memory = JSON.parse(stored);
      } else {
        // Créer une nouvelle mémoire
        this.memory = {
          userId: this.userId,
          hdType: this.hdType,
          conversationHistory: [],
          emotionalPatterns: [],
          energyTrends: [],
          preferences: {
            preferredTone: 'gentle',
            responseLength: 'medium',
            focusAreas: [],
            avoidTopics: []
          },
          lastUpdated: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Error initializing conversation memory:', error);
      // Fallback vers une mémoire vide
      this.memory = {
        userId: this.userId,
        hdType: this.hdType,
        conversationHistory: [],
        emotionalPatterns: [],
        energyTrends: [],
        preferences: {
          preferredTone: 'gentle',
          responseLength: 'medium',
          focusAreas: [],
          avoidTopics: []
        },
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Analyse intelligente d'une réponse utilisateur
   */
  analyzeUserResponse(response: string, category: string): {
    sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
    emotionalTone: string[];
    energyLevel: 'high' | 'medium' | 'low';
    keyThemes: string[];
    urgencyLevel: 'low' | 'medium' | 'high';
  } {
    const lowerResponse = response.toLowerCase();
    
    // Analyse du sentiment
    const positiveWords = ['bien', 'super', 'génial', 'formidable', 'excellent', 'parfait', 'heureux', 'heureuse', 'joyeux', 'joyeuse', 'énergique', 'motivée', 'inspirée', 'sereine', 'paisible', 'équilibrée', 'harmonieuse', 'vivante', 'rayonnante'];
    const negativeWords = ['mal', 'difficile', 'dur', 'fatiguée', 'épuisée', 'stressée', 'anxieuse', 'triste', 'déprimée', 'lourde', 'tendue', 'bloquée', 'vide', 'perdue', 'confuse', 'irritée', 'frustrée', 'déconnectée'];
    const neutralWords = ['normal', 'habituel', 'comme d\'habitude', 'moyen', 'correct', 'stable'];

    const positiveCount = positiveWords.filter(word => lowerResponse.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerResponse.includes(word)).length;
    const neutralCount = neutralWords.filter(word => lowerResponse.includes(word)).length;

    let sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
    if (positiveCount > negativeCount && positiveCount > 0) {
      sentiment = 'positive';
    } else if (negativeCount > positiveCount && negativeCount > 0) {
      sentiment = 'negative';
    } else if (positiveCount > 0 && negativeCount > 0) {
      sentiment = 'mixed';
    } else {
      sentiment = 'neutral';
    }

    // Analyse du ton émotionnel
    const emotionalTone: string[] = [];
    if (lowerResponse.includes('stress') || lowerResponse.includes('anxie') || lowerResponse.includes('panique')) {
      emotionalTone.push('anxieux');
    }
    if (lowerResponse.includes('fatigue') || lowerResponse.includes('épuis') || lowerResponse.includes('crevée')) {
      emotionalTone.push('fatigué');
    }
    if (lowerResponse.includes('colère') || lowerResponse.includes('énervée') || lowerResponse.includes('irritée')) {
      emotionalTone.push('irrité');
    }
    if (lowerResponse.includes('joie') || lowerResponse.includes('heureux') || lowerResponse.includes('content')) {
      emotionalTone.push('joyeux');
    }
    if (lowerResponse.includes('calme') || lowerResponse.includes('serein') || lowerResponse.includes('paisible')) {
      emotionalTone.push('serein');
    }

    // Analyse du niveau d'énergie
    let energyLevel: 'high' | 'medium' | 'low';
    const highEnergyWords = ['énergique', 'motivée', 'dynamique', 'active', 'vivante', 'pétillante'];
    const lowEnergyWords = ['fatiguée', 'épuisée', 'lourde', 'lente', 'endormie', 'vidée'];
    
    const highEnergyCount = highEnergyWords.filter(word => lowerResponse.includes(word)).length;
    const lowEnergyCount = lowEnergyWords.filter(word => lowerResponse.includes(word)).length;
    
    if (highEnergyCount > lowEnergyCount) {
      energyLevel = 'high';
    } else if (lowEnergyCount > highEnergyCount) {
      energyLevel = 'low';
    } else {
      energyLevel = 'medium';
    }

    // Extraction des thèmes clés
    const keyThemes: string[] = [];
    const themeWords = {
      'travail': ['travail', 'boulot', 'job', 'bureau', 'collègues', 'patron'],
      'relations': ['relation', 'couple', 'famille', 'amis', 'conflit', 'dispute'],
      'santé': ['santé', 'maladie', 'douleur', 'médecin', 'symptôme'],
      'sommeil': ['sommeil', 'dormir', 'insomnie', 'réveil', 'fatigue'],
      'alimentation': ['manger', 'nourriture', 'digestion', 'ventre', 'appétit'],
      'cycle': ['règles', 'cycle', 'hormones', 'ovulation', 'menstruation']
    };

    Object.entries(themeWords).forEach(([theme, words]) => {
      if (words.some(word => lowerResponse.includes(word))) {
        keyThemes.push(theme);
      }
    });

    // Niveau d'urgence
    let urgencyLevel: 'low' | 'medium' | 'high';
    const urgentWords = ['urgent', 'grave', 'inquiet', 'panique', 'aide', 'sos'];
    const urgentCount = urgentWords.filter(word => lowerResponse.includes(word)).length;
    
    if (urgentCount > 0 || (negativeCount > 2 && energyLevel === 'low')) {
      urgencyLevel = 'high';
    } else if (negativeCount > 0 || sentiment === 'mixed') {
      urgencyLevel = 'medium';
    } else {
      urgencyLevel = 'low';
    }

    return {
      sentiment,
      emotionalTone,
      energyLevel,
      keyThemes,
      urgencyLevel
    };
  }

  /**
   * Génère une réponse intelligente et personnalisée
   */
  async generateIntelligentResponse(
    userResponse: string,
    category: string,
    context: 'welcome' | 'transition' | 'exploration' | 'completion'
  ): Promise<IntelligentResponse> {
    try {
      // Utiliser ChatGPT pour générer la réponse
      console.log(`💬 Génération réponse ChatGPT pour contexte: ${context}`);
      
      const gptResponse = await this.openAIService.generateResponse(userResponse, category, context);
      
        recentFeelings: this.memory?.conversationHistory.slice(-3).flatMap(c => c.selectedFeelings) || []
      // Analyser la réponse utilisateur pour la mémoire
      const analysis = await this.openAIService.analyzeUserResponse(userResponse);
      
      // Ajouter un insight personnalisé basé sur l'historique local
      const personalizedInsight = this.generatePersonalizedInsight(analysis, category);

      // Enrichir avec le contexte conversationnel
      const enrichedResponse = this.enrichResponseWithContext(gptResponse, analysis);
      
      // Vérifier si Aminata indique qu'elle est prête pour l'analyse
      const shouldCompleteConversation = gptResponse.isReadyForAnalysis || 
                                        this.openAIService.isReadyForAnalysis();
      return {
        message: enrichedResponse.message,
        tone: gptResponse.tone,
        followUpQuestion: gptResponse.followUpQuestion,
        suggestedFeelings: gptResponse.suggestedFeelings,
        personalizedInsight: personalizedInsight || gptResponse.personalizedInsight,
        shouldCompleteConversation
      };
    } catch (error) {
      console.error('Erreur ChatGPT, utilisation du fallback:', error);
      
      console.log('🔄 Basculement vers le mode fallback');
      
      // Fallback vers l'ancienne méthode en cas d'erreur
      const analysis = this.analyzeUserResponse(userResponse, category);
      
      let tone: 'supportive' | 'celebratory' | 'gentle' | 'encouraging';
      
      if (analysis.sentiment === 'positive' && analysis.energyLevel === 'high') {
        tone = 'celebratory';
      } else if (analysis.sentiment === 'negative' || analysis.urgencyLevel === 'high') {
        tone = 'supportive';
      } else if (analysis.energyLevel === 'low' || analysis.emotionalTone.includes('fatigué')) {
        tone = 'gentle';
      } else {
        tone = 'encouraging';
      }

      const message = this.generatePersonalizedMessage(analysis, category, context, tone);
      const personalizedInsight = this.generatePersonalizedInsight(analysis, category);

      return {
        message,
        tone,
        personalizedInsight
      };
    }
  }

  /**
   * Enrichit la réponse ChatGPT avec le contexte local
   */
  private enrichResponseWithContext(
    gptResponse: ChatGPTResponse, 
    analysis: any
  ): ChatGPTResponse {
    let enrichedMessage = gptResponse.message;
    
    // Ajouter des éléments contextuels selon l'historique
    if (this.memory && this.memory.conversationHistory.length > 0) {
      const recentPatterns = this.findRecentPatterns();
      
      if (recentPatterns.length > 0) {
        // Ajouter subtilement une référence aux patterns récents
        const patternInsight = this.generatePatternInsight(recentPatterns);
        if (patternInsight && !enrichedMessage.includes(patternInsight.substring(0, 20))) {
          enrichedMessage += ` ${patternInsight}`;
        }
      }
    }
    
    return {
      ...gptResponse,
      message: enrichedMessage
    };
  }

  /**
   * Génère un message personnalisé selon l'analyse
   */
  private generatePersonalizedMessage(
    analysis: any,
    category: string,
    context: string,
    tone: string
  ): string {
    console.log(`🎨 Génération message personnalisé (${tone})`);
    
    const hdMessages = this.getHDSpecificMessages();
    const baseMessage = hdMessages[this.hdType] || hdMessages.generator;

    let message = '';

    // Message d'accueil selon le sentiment
    if (context === 'welcome') {
      if (analysis.sentiment === 'positive') {
        message = `${this.userName}, je sens cette belle énergie qui rayonne de toi ! ✨ ${baseMessage.positive}`;
      } else if (analysis.sentiment === 'negative') {
        message = `${this.userName}, je t'accueille avec toute ta vérité. ${baseMessage.supportive} 💕`;
      } else if (analysis.sentiment === 'mixed') {
        message = `${this.userName}, je sens cette richesse émotionnelle en toi. ${baseMessage.mixed} 🌊`;
      } else {
        message = `${this.userName}, ${baseMessage.neutral} 🌸`;
      }
    }

    // Ajouter des éléments contextuels
    if (analysis.keyThemes.includes('fatigue') || analysis.energyLevel === 'low') {
      message += ' Ton corps me dit qu\'il a besoin de douceur aujourd\'hui.';
    }

    if (analysis.keyThemes.includes('stress') || analysis.emotionalTone.includes('anxieux')) {
      message += ' Je sens cette tension que tu portes. On va explorer ça ensemble avec bienveillance.';
    }

    if (analysis.keyThemes.includes('travail')) {
      message += ' Le monde professionnel peut parfois bousculer notre énergie naturelle.';
    }

    return message;
  }

  /**
   * Génère un insight personnalisé basé sur l'historique
   */
  private generatePersonalizedInsight(analysis: any, category: string): string | undefined {
    console.log('💡 Génération insight personnalisé...');
    
    if (!this.memory || this.memory.conversationHistory.length === 0) {
      return undefined;
    }

    // Analyser les patterns récents
    const recentConversations = this.memory.conversationHistory.slice(-5);
    const commonThemes = this.findCommonThemes(recentConversations);
    
    if (commonThemes.length > 0) {
      const theme = commonThemes[0];
      return `Je remarque que "${theme}" revient souvent dans nos échanges. C'est peut-être un point d'attention important pour toi en ce moment.`;
    }

    // Comparer avec les tendances énergétiques
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? 'matin' : currentHour < 18 ? 'après-midi' : 'soir';
    
    const similarTimeConversations = recentConversations.filter(conv => {
      const convHour = new Date(conv.timestamp).getHours();
      const convTimeOfDay = convHour < 12 ? 'matin' : convHour < 18 ? 'après-midi' : 'soir';
      return convTimeOfDay === timeOfDay;
    });

    if (similarTimeConversations.length > 1) {
      const avgScore = similarTimeConversations.reduce((sum, conv) => sum + conv.score, 0) / similarTimeConversations.length;
      if (avgScore < 50) {
        return `Je remarque que tes énergies du ${timeOfDay} ont tendance à être plus douces ces derniers temps. C'est peut-être ton rythme naturel qui s'exprime.`;
      } else if (avgScore > 70) {
        return `Tes énergies du ${timeOfDay} sont généralement très belles ! Tu sembles être dans ton élément à ce moment de la journée.`;
      }
    }

    return undefined;
  }

  /**
   * Trouve les thèmes communs dans l'historique
   */
  private findCommonThemes(conversations: ConversationTurn[]): string[] {
    console.log('🔍 Recherche des thèmes communs...');
    
    const themeCount: Record<string, number> = {};
    
    conversations.forEach(conv => {
      conv.emotionalTone.forEach(tone => {
        themeCount[tone] = (themeCount[tone] || 0) + 1;
      });
    });

    return Object.entries(themeCount)
      .filter(([_, count]) => count >= 2)
      .sort(([_, a], [__, b]) => b - a)
      .map(([theme, _]) => theme);
  }

  /**
   * Trouve les patterns récents dans la conversation
   */
  private findRecentPatterns(): string[] {
    if (!this.memory || this.memory.conversationHistory.length < 3) return [];
    
    const recent = this.memory.conversationHistory.slice(-3);
    const patterns: string[] = [];
    
    // Détecter des patterns simples
    const emotions = recent.flatMap(conv => conv.emotionalTone);
    const dominantEmotion = emotions.reduce((a, b, _, arr) => 
      arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
    );
    
    if (dominantEmotion) patterns.push(dominantEmotion);
    
    return patterns;
  }

  /**
   * Messages spécifiques par type HD
   */
  private getHDSpecificMessages() {
    return {
      projector: {
        positive: "Ta sagesse rayonne et c'est magnifique à percevoir.",
        supportive: "Prends le temps d'observer sans pression... Ton système perçoit tout avec finesse.",
        mixed: "Cette complexité que tu ressens est le reflet de ta capacité unique à voir les nuances.",
        neutral: "je suis là pour t'accompagner dans cette exploration avec toute la douceur que tu mérites."
      },
      generator: {
        positive: "Ton sacral vibre de cette belle énergie ! Continue à suivre ce qui t'allume.",
        supportive: "Écoute ton corps, il sait... Tes réponses sacrales sont tes guides les plus sûrs.",
        mixed: "Ton sacral te guide vers ce qui est juste, même dans cette complexité.",
        neutral: "ton énergie sacrale a des messages précieux à partager avec toi."
      },
      'manifesting-generator': {
        positive: "Cette énergie multi-facettes que tu portes est un véritable cadeau !",
        supportive: "Suis ton rythme rapide... change de direction si ton corps le demande.",
        mixed: "Ta capacité à naviguer entre plusieurs énergies est magnifique, même dans les moments complexes.",
        neutral: "ton énergie unique et rapide a tant à nous révéler."
      },
      manifestor: {
        positive: "Ton pouvoir d'initiation rayonne ! C'est beau à voir.",
        supportive: "Initie tes réponses... suis ton autorité intérieure. Tu sais ce qui est juste.",
        mixed: "Même dans cette complexité, ton énergie d'initiation reste précieuse.",
        neutral: "ton énergie d'initiation a des vérités importantes à partager."
      },
      reflector: {
        positive: "Tu reflètes une belle harmonie aujourd'hui ! C'est lumineux.",
        supportive: "Observe sans jugement... tu es un miroir précieux de l'énergie environnante.",
        mixed: "Cette diversité que tu reflètes montre la richesse de ton environnement énergétique.",
        neutral: "ta capacité à refléter la vérité est un don rare que nous allons explorer ensemble."
      }
    };
  }

  /**
   * Génère un insight basé sur les patterns détectés
   */
  private generatePatternInsight(patterns: string[]): string | undefined {
    if (patterns.length === 0) return undefined;
    
    const pattern = patterns[0];
    const insights = {
      'fatigué': 'Je remarque que la fatigue revient souvent... c\'est peut-être ton corps qui demande plus de douceur.',
      'joyeux': 'Cette joie qui revient dans tes partages est précieuse... continue à la cultiver.',
      'anxieux': 'L\'anxiété semble présente ces derniers temps... rappelle-toi que tu es en sécurité ici.'
    };
    
    return insights[pattern];
  }

  /**
   * Sauvegarde la conversation dans la mémoire
   */
  saveConversationTurn(
    userResponse: string,
    category: string,
    selectedFeelings: string[],
    score: number
  ): void {
    if (!this.memory) return;
    
    console.log('💾 Sauvegarde du tour de conversation...');

    // Utiliser l'analyse locale pour la mémoire (plus rapide)
    const analysis = this.analyzeUserResponse(userResponse, category);
    
    const turn: ConversationTurn = {
      timestamp: new Date().toISOString(),
      category,
      userResponse,
      sentiment: analysis.sentiment,
      emotionalTone: analysis.emotionalTone,
      energyLevel: analysis.energyLevel,
      selectedFeelings,
      score
    };

    this.memory.conversationHistory.push(turn);
    
    // Garder seulement les 20 dernières conversations
    if (this.memory.conversationHistory.length > 20) {
      this.memory.conversationHistory = this.memory.conversationHistory.slice(-20);
    }

    // Mettre à jour les patterns émotionnels
    this.updateEmotionalPatterns(analysis);
    
    // Sauvegarder en localStorage
    this.memory.lastUpdated = new Date().toISOString();
    localStorage.setItem(`conversation_memory_${this.userId}`, JSON.stringify(this.memory));
    
    // Déclencher un événement pour actualiser le dashboard
    window.dispatchEvent(new CustomEvent('conversationUpdated', {
      detail: { userId: this.userId, turn }
    }));
  }

  /**
   * Met à jour les patterns émotionnels
   */
  private updateEmotionalPatterns(analysis: any): void {
    console.log('📊 Mise à jour des patterns émotionnels...');
    
    if (!this.memory) return;

    analysis.emotionalTone.forEach((tone: string) => {
      const existingPattern = this.memory!.emotionalPatterns.find(p => p.pattern === tone);
      
      if (existingPattern) {
        existingPattern.frequency += 1;
        existingPattern.lastSeen = new Date().toISOString();
      } else {
        this.memory!.emotionalPatterns.push({
          pattern: tone,
          frequency: 1,
          contexts: [analysis.keyThemes],
          lastSeen: new Date().toISOString()
        });
      }
    });

    // Garder seulement les 10 patterns les plus fréquents
    this.memory.emotionalPatterns.sort((a, b) => b.frequency - a.frequency);
    this.memory.emotionalPatterns = this.memory.emotionalPatterns.slice(0, 10);
  }

  /**
   * Génère une question de suivi intelligente
   */
  async generateFollowUpQuestion(category: string, analysis: any): Promise<string | undefined> {
    // Essayer d'abord avec ChatGPT
    try {
      console.log('❓ Génération question de suivi avec ChatGPT...');
      
      const gptQuestion = await this.openAIService.generateFollowUpQuestion(
        category, 
        [analysis.keyThemes.join(', ')]
      );
      if (gptQuestion) return gptQuestion;
    } catch (error) {
      console.error('Erreur génération question ChatGPT:', error);
      
      console.log('🔄 Fallback pour la question de suivi...');
    }
    
    // Questions basées sur l'analyse et le type HD
    const hdQuestions = {
      projector: {
        high_energy: "Cette clarté que tu ressens, d'où vient-elle selon toi ?",
        low_energy: "As-tu eu l'espace pour te retirer et observer aujourd'hui ?",
        mixed: "Que perçois-tu dans ton environnement qui pourrait influencer cette énergie ?"
      },
      generator: {
        high_energy: "Ton sacral dit-il 'oui' à quelque chose en particulier en ce moment ?",
        low_energy: "Ton corps te demande-t-il de ralentir ou de changer de direction ?",
        mixed: "Quelles sont les réponses que ton sacral t'envoie aujourd'hui ?"
      }
    };

    const questions = hdQuestions[this.hdType as keyof typeof hdQuestions];
    if (!questions) return undefined;

    if (analysis.energyLevel === 'high') {
      return questions.high_energy;
    } else if (analysis.energyLevel === 'low') {
      return questions.low_energy;
    } else {
      return questions.mixed;
    }
  }

  /**
   * Obtient un résumé de la mémoire conversationnelle
   */
  getMemorySummary(): {
    totalConversations: number;
    dominantEmotions: string[];
    averageEnergyLevel: number;
    preferredCategories: string[];
  } | null {
    if (!this.memory || this.memory.conversationHistory.length === 0) {
      console.log('📊 Aucune mémoire conversationnelle disponible');
      return null;
    }

    const history = this.memory.conversationHistory;
    
    // Émotions dominantes
    const emotionCounts: Record<string, number> = {};
    history.forEach(conv => {
      conv.emotionalTone.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });
    
    const dominantEmotions = Object.entries(emotionCounts)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3)
      .map(([emotion, _]) => emotion);

    // Niveau d'énergie moyen
    const energyLevels = history.map(conv => {
      switch (conv.energyLevel) {
        case 'high': return 3;
        case 'medium': return 2;
        case 'low': return 1;
        default: return 2;
      }
    });
    const averageEnergyLevel = energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length;

    // Catégories préférées
    const categoryCounts: Record<string, number> = {};
    history.forEach(conv => {
      categoryCounts[conv.category] = (categoryCounts[conv.category] || 0) + 1;
    });
    
    const preferredCategories = Object.entries(categoryCounts)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3)
      .map(([category, _]) => category);

    return {
      totalConversations: history.length,
      dominantEmotions,
      averageEnergyLevel,
      preferredCategories
    };
  }

  /**
   * Nettoie l'historique ChatGPT
   */
  clearChatGPTHistory(): void {
    console.log('🧹 Nettoyage de l\'historique ChatGPT...');
    this.openAIService.clearHistory();
  }
}