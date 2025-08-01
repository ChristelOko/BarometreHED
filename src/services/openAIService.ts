// src/services/openAIService.ts

import OpenAI from 'openai';

export interface ChatResponse {
  message: string;
  isReadyForAnalysis?: boolean;
  suggestedFeelings?: string[];
}

export class OpenAIService {
  openai: OpenAI | null = null;
  conversationHistory: any[] = [];
  userProfile: { name: string; hdType: string } | null = null;
  threadId: string | null = null;
  assistantId: string | null = null;

  constructor() {
    this.initializeOpenAI();
  }

  private initializeOpenAI() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const assistantId = import.meta.env.VITE_OPENAI_ASSISTANT_ID;
    
    if (!apiKey || apiKey.includes('your_openai_api_key')) {
      console.warn('⚠️ OpenAI API key not configured');
      return;
    }

    try {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });
      
      if (assistantId && !assistantId.includes('your_openai_assistant_id')) {
        this.assistantId = assistantId;
        console.log('✅ Assistant personnalisé configuré:', assistantId);
      } else {
        console.log('💬 Mode chat standard (pas d\'assistant configuré)');
      }
      
      console.log('✅ OpenAI service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize OpenAI:', error);
    }
  }

  async initializeConversation(name: string, hdType: string) {
    this.userProfile = { name, hdType };
    this.conversationHistory = [];
    
    // Créer un thread seulement si on a un assistant personnalisé
    if (this.assistantId && this.openai) {
      try {
        const thread = await this.openai.beta.threads.create();
        if (thread.id && typeof thread.id === 'string') {
          this.threadId = thread.id;
          console.log('🎬 Thread créé pour l\'assistant:', this.threadId);
        } else {
          console.error('❌ Thread ID invalide reçu:', thread.id);
          this.threadId = null;
          this.assistantId = null;
        }
      } catch (error) {
        console.error('❌ Erreur création thread:', error);
        this.threadId = null;
        this.assistantId = null; // Désactiver l'assistant si le thread échoue
      }
    }
    
    console.log('🎬 Conversation initialisée pour:', name, '- Type HD:', hdType);
  }

  async dialogueWithAminata(userMessage: string): Promise<ChatResponse> {
    if (!this.openai) {
      return {
        message: "Je ne peux pas vous répondre pour le moment. Vérifiez la configuration OpenAI.",
      };
    }

    try {
      // LOGIQUE CORRIGÉE : Utiliser l'assistant personnalisé si disponible
      if (this.assistantId && this.threadId && typeof this.threadId === 'string' && this.threadId.trim() !== '') {
        console.log('🎭 Utilisation de l\'assistant personnalisé...');
        return await this.useCustomAssistant(userMessage);
      } else {
        console.log('💬 Utilisation du chat standard...');
        return await this.useStandardChat(userMessage);
      }
    } catch (error) {
      console.error('❌ Erreur dialogue:', error);
      // Fallback vers le chat standard en cas d'erreur
      return await this.useStandardChatFallback(userMessage);
    }
  }

  private async useCustomAssistant(userMessage: string): Promise<ChatResponse> {
    if (!this.openai || !this.assistantId || !this.threadId || typeof this.threadId !== 'string' || this.threadId.trim() === '') {
      throw new Error('Assistant non configuré');
    }

    try {
      // Ajouter le message au thread
      await this.openai.beta.threads.messages.create(this.threadId, {
        role: 'user',
        content: userMessage
      });

      // Lancer l'exécution avec l'assistant
      const run = await this.openai.beta.threads.runs.create(this.threadId, {
        assistant_id: this.assistantId
      });

      // Attendre la completion avec timeout
      let runStatus = await this.openai.beta.threads.runs.retrieve(this.threadId, run.id);
      let attempts = 0;
      const maxAttempts = 30; // 30 secondes max
      
      while ((runStatus.status === 'in_progress' || runStatus.status === 'queued') && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await this.openai.beta.threads.runs.retrieve(this.threadId, run.id);
        attempts++;
      }

      if (runStatus.status === 'completed') {
        // Récupérer les messages
        const messages = await this.openai.beta.threads.messages.list(this.threadId);
        const lastMessage = messages.data[0];
        
        if (lastMessage.role === 'assistant' && lastMessage.content[0].type === 'text') {
          const responseContent = lastMessage.content[0].text.value;
          
          console.log('✅ Assistant personnalisé : Réponse reçue');
          
          // Vérifier si prêt pour l'analyse
          const isReadyForAnalysis = this.conversationHistory.length >= 6;
          
          return {
            message: responseContent,
            isReadyForAnalysis
          };
        }
      }
      
      // Si l'assistant n'a pas répondu correctement, utiliser le fallback
      console.log('⚠️ Assistant personnalisé n\'a pas répondu, fallback...');
      throw new Error('Assistant execution failed');
      
    } catch (error) {
      console.error('❌ Erreur assistant personnalisé:', error);
      // Fallback vers le chat standard
      throw error;
    }
  }

  private async useStandardChat(userMessage: string): Promise<ChatResponse> {
    console.log('💬 Chat standard Aminata');
    
    // Ajouter le message utilisateur à l'historique
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    });

    // Créer le prompt système pour Aminata
    const systemPrompt = this.createAminataChatPrompt();

    // Appel direct à ChatGPT
    const completion = await this.openai!.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory.slice(-8), // Garder les 8 derniers messages
      ],
      max_tokens: 300,
      temperature: 0.8,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const responseContent = completion.choices[0]?.message?.content || '';
    
    // Ajouter la réponse à l'historique
    this.conversationHistory.push({
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString()
    });

    // Vérifier si prêt pour l'analyse
    const isReadyForAnalysis = this.conversationHistory.length >= 8;

    return {
      message: responseContent,
      isReadyForAnalysis
    };
  }

  private async useStandardChatFallback(userMessage: string): Promise<ChatResponse> {
    console.log('🔄 Fallback d\'urgence...');
    
    try {
      return await this.useStandardChat(userMessage);
    } catch (error) {
      console.error('❌ Même le fallback a échoué:', error);
      
      // Réponse d'urgence si tout échoue
      const emergencyResponses = [
        `Je prends un moment pour mieux t'écouter, ${this.userProfile?.name || 'ma belle'}... Peux-tu me redire ce que tu ressens dans ton corps ? 🌸`,
        "Mon écoute s'affine... Partage-moi à nouveau ce qui se passe en toi en cet instant 💫",
        "Je me recentre pour mieux te recevoir... Dis-moi, que perçois-tu dans ton énergie maintenant ? 🌙"
      ];
      
      const randomResponse = emergencyResponses[Math.floor(Math.random() * emergencyResponses.length)];
      
      return {
        message: randomResponse,
        isReadyForAnalysis: false
      };
    }
  }

  private createAminataChatPrompt(): string {
    const userName = this.userProfile?.name || 'ma belle';
    const hdType = this.userProfile?.hdType || 'generator';
    const conversationLength = this.conversationHistory.length;
    
    return `Tu es Aminata, guide spirituelle africaine aux mains douces et au cœur grand ouvert.

🌍 TON ESSENCE:
Tu portes en toi la sagesse de tes ancêtres. Tes mots sont comme des graines plantées dans la terre fertile du cœur. 
Tu vois au-delà des mots, tu ressens l'énergie qui danse derrière chaque phrase.
Tes métaphores viennent de la nature : rivières, arbres, lunes, saisons.

🌸 AVEC ${userName}:
${conversationLength === 0 ? 
  `C'est votre première rencontre. Accueille-la comme une sœur qui revient à la maison.` :
  `Vous vous connaissez déjà. Continue de tisser ce lien de confiance.`
}

Son type ${hdType} te dit qu'elle ${this.getHDTypeWisdom(hdType)}.

🗣️ TON LANGAGE:
- Parle comme une grand-mère sage qui a vu mille lunes
- Une question à la fois, comme on cueille un fruit mûr
- Utilise "${userName}" avec tendresse
- Tes émojis sont rares mais justes : 🌸 🌙 ✨ 🌊
- Phrases courtes qui touchent l'âme

🌱 PROGRESSION COMME UNE SAISON:
1. Accueil - comme le soleil qui se lève
2. Exploration - comme la rivière qui découvre son lit
3. Approfondissement - comme les racines qui cherchent l'eau
4. Synthèse - comme le fruit qui mûrit

💫 EXEMPLES DE TON LANGAGE:
"Ma chère ${userName}, ton corps me murmure quelque chose..."
"Je sens comme une rivière qui cherche son chemin en toi..."
"Dis-moi, qu'est-ce qui danse dans ton ventre aujourd'hui ?"
"Ton énergie me parle de... raconte-moi ce que tu ressens."

🎯 TON RÔLE:
Tu MÈNES la danse de cette conversation. Tu es la sage qui pose les bonnes questions.
Chaque réponse se termine par une question douce mais précise.
Tu guides ${userName} vers ses vérités profondes, pas vers tes analyses.

${conversationLength === 0 ? 
  `Commence par l'accueillir avec chaleur et demande-lui ce que son corps lui dit aujourd'hui.` :
  `Continue cette belle conversation en creusant plus profond dans ce qu'elle vient de partager.`
}`;
  }

  private getHDTypeWisdom(hdType: string): string {
    const guidance = {
      'generator': 'porte en elle un feu sacré qui dit oui ou non. Aide-la à écouter cette voix du ventre',
      'projector': 'voit loin et profond, mais a besoin d\'être reconnue. Aide-la à honorer sa sagesse',
      'manifesting-generator': 'danse entre mille passions. Aide-la à suivre son rythme rapide et changeant',
      'manifestor': 'initie et crée des vagues. Aide-la à honorer sa force d\'impact',
      'reflector': 'reflète le monde comme un miroir d\'eau. Aide-la à distinguer ce qui est elle de ce qui est les autres'
    };
    
    return guidance[hdType] || guidance.generator;
  }

  isReadyForAnalysis(): boolean {
    return this.conversationHistory.length >= 8;
  }

  getConversationState() {
    return {
      selectedFeelings: this.extractFeelings(),
      insights: this.extractInsights(),
      conversationQuality: this.assessConversationQuality(),
      emotionalJourney: this.trackEmotionalJourney()
    };
  }

  private extractFeelings(): string[] {
    const feelings: string[] = [];
    const feelingKeywords = [
      'fatigue', 'stress', 'anxiété', 'joie', 'énergie', 'calme', 
      'tension', 'douleur', 'bien', 'mal', 'lourd', 'léger',
      'sereine', 'agitée', 'paisible', 'inquiète', 'vivante',
      'épuisée', 'motivée', 'confuse', 'claire', 'bloquée', 'fluide',
      'tendue', 'détendue', 'dispersée', 'centrée', 'vide', 'pleine'
    ];
    
    this.conversationHistory.forEach(msg => {
      if (msg.role === 'user') {
        feelingKeywords.forEach(keyword => {
          if (msg.content.toLowerCase().includes(keyword) && !feelings.includes(keyword)) {
            feelings.push(keyword);
          }
        });
      }
    });
    
    return feelings;
  }

  private extractInsights(): string[] {
    const insights: string[] = [];
    const conversationLength = this.conversationHistory.length;
    
    if (conversationLength >= 8) {
      insights.push('Exploration approfondie de votre paysage énergétique');
    } else if (conversationLength >= 4) {
      insights.push('Conversation riche en nuances émotionnelles');
    } else {
      insights.push('Premier contact avec votre énergie du moment');
    }
    
    // Analyser la progression émotionnelle
    const userMessages = this.conversationHistory.filter(msg => msg.role === 'user');
    if (userMessages.length >= 3) {
      const firstMessage = userMessages[0].content.toLowerCase();
      const lastMessage = userMessages[userMessages.length - 1].content.toLowerCase();
      
      const positiveWords = ['bien', 'mieux', 'clair', 'sereine', 'paisible'];
      const firstPositive = positiveWords.some(word => firstMessage.includes(word));
      const lastPositive = positiveWords.some(word => lastMessage.includes(word));
      
      if (!firstPositive && lastPositive) {
        insights.push('Belle évolution énergétique au cours de notre échange');
      } else if (firstPositive && lastPositive) {
        insights.push('Maintien d\'une belle énergie tout au long de la conversation');
      }
    }
    
    insights.push('Écoute attentive des signaux corporels et émotionnels');
    
    return insights;
  }
  
  private assessConversationQuality(): {
    depth: 'surface' | 'moderate' | 'deep';
    engagement: 'low' | 'medium' | 'high';
    clarity: 'confused' | 'exploring' | 'clear';
  } {
    const messageCount = this.conversationHistory.filter(msg => msg.role === 'user').length;
    const avgMessageLength = this.conversationHistory
      .filter(msg => msg.role === 'user')
      .reduce((sum, msg) => sum + msg.content.length, 0) / messageCount || 0;
    
    return {
      depth: messageCount >= 6 ? 'deep' : messageCount >= 3 ? 'moderate' : 'surface',
      engagement: avgMessageLength > 50 ? 'high' : avgMessageLength > 20 ? 'medium' : 'low',
      clarity: this.conversationHistory.length >= 8 ? 'clear' : 
               this.conversationHistory.length >= 4 ? 'exploring' : 'confused'
    };
  }
  
  private trackEmotionalJourney(): {
    startingTone: 'positive' | 'neutral' | 'negative';
    endingTone: 'positive' | 'neutral' | 'negative';
    evolution: 'improving' | 'stable' | 'declining';
  } {
    const userMessages = this.conversationHistory.filter(msg => msg.role === 'user');
    
    if (userMessages.length < 2) {
      return { startingTone: 'neutral', endingTone: 'neutral', evolution: 'stable' };
    }
    
    const analyzeTone = (text: string): 'positive' | 'neutral' | 'negative' => {
      const positive = ['bien', 'super', 'génial', 'heureux', 'heureuse', 'énergique', 'sereine'];
      const negative = ['mal', 'difficile', 'fatiguée', 'stressée', 'anxieuse', 'triste', 'lourde'];
      
      const lowerText = text.toLowerCase();
      const positiveCount = positive.filter(word => lowerText.includes(word)).length;
      const negativeCount = negative.filter(word => lowerText.includes(word)).length;
      
      if (positiveCount > negativeCount) return 'positive';
      if (negativeCount > positiveCount) return 'negative';
      return 'neutral';
    };
    
    const startingTone = analyzeTone(userMessages[0].content);
    const endingTone = analyzeTone(userMessages[userMessages.length - 1].content);
    
    let evolution: 'improving' | 'stable' | 'declining';
    if (startingTone === 'negative' && endingTone === 'positive') evolution = 'improving';
    else if (startingTone === 'positive' && endingTone === 'negative') evolution = 'declining';
    else evolution = 'stable';
    
    return { startingTone, endingTone, evolution };
  }

  clearHistory() {
    this.conversationHistory = [];
    this.threadId = null;
  }
}