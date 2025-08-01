/**
 * Service de calendrier lunaire pour les Reflectors et cycles féminins
 * Intègre les phases lunaires dans les analyses énergétiques
 */

export interface LunarPhase {
  name: 'new_moon' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full_moon' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';
  displayName: string;
  emoji: string;
  energy: 'introspective' | 'growing' | 'active' | 'releasing';
  description: string;
  recommendations: string[];
}

export interface LunarInsight {
  currentPhase: LunarPhase;
  daysInPhase: number;
  nextPhase: LunarPhase;
  daysToNextPhase: number;
  energyAlignment: 'aligned' | 'neutral' | 'challenging';
  personalizedMessage: string;
  recommendations: string[];
}

export class LunarCalendar {
  private hdType: string;
  private userName: string;

  constructor(hdType: string, userName: string) {
    this.hdType = hdType;
    this.userName = userName;
  }

  /**
   * Calcule la phase lunaire actuelle
   */
  getCurrentLunarPhase(date: Date = new Date()): LunarPhase {
    // Calcul simplifié de la phase lunaire
    // En production, utiliser une API astronomique précise
    const lunarCycle = 29.53; // Jours dans un cycle lunaire
    const knownNewMoon = new Date('2024-01-11'); // Nouvelle lune de référence
    
    const daysSinceNewMoon = Math.floor((date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24));
    const phasePosition = (daysSinceNewMoon % lunarCycle) / lunarCycle;
    
    return this.getPhaseFromPosition(phasePosition);
  }

  /**
   * Génère des insights lunaires personnalisés
   */
  generateLunarInsights(currentScore: number, recentScans: any[] = []): LunarInsight {
    const currentPhase = this.getCurrentLunarPhase();
    const daysInPhase = this.getDaysInCurrentPhase();
    const nextPhase = this.getNextPhase(currentPhase);
    const daysToNextPhase = this.getDaysToNextPhase();
    
    // Analyser l'alignement énergétique avec la lune
    const energyAlignment = this.analyzeEnergyAlignment(currentScore, currentPhase, recentScans);
    
    // Message personnalisé selon le type HD et la phase
    const personalizedMessage = this.generatePersonalizedMessage(currentPhase, energyAlignment);
    
    // Recommandations adaptées
    const recommendations = this.generateLunarRecommendations(currentPhase, energyAlignment);

    return {
      currentPhase,
      daysInPhase,
      nextPhase,
      daysToNextPhase,
      energyAlignment,
      personalizedMessage,
      recommendations
    };
  }

  /**
   * Recommandations spécifiques pour les Reflectors
   */
  generateReflectorGuidance(lunarInsight: LunarInsight): string[] {
    const guidance: string[] = [];
    
    switch (lunarInsight.currentPhase.name) {
      case 'new_moon':
        guidance.push('Période idéale pour les nouvelles intentions et la réflexion profonde');
        guidance.push('Votre aura est particulièrement réceptive aux énergies subtiles');
        break;
        
      case 'full_moon':
        guidance.push('Moment de clarté maximale - vos perceptions sont amplifiées');
        guidance.push('Excellente période pour prendre des décisions importantes');
        break;
        
      case 'waxing_crescent':
      case 'waxing_gibbous':
        guidance.push('Énergie croissante - bon moment pour développer vos projets');
        guidance.push('Votre capacité de réflexion est en expansion');
        break;
        
      case 'waning_gibbous':
      case 'waning_crescent':
        guidance.push('Période de libération - laissez partir ce qui ne vous sert plus');
        guidance.push('Temps de gratitude et de bilan énergétique');
        break;
    }
    
    // Ajouter des conseils spécifiques aux Reflectors
    guidance.push('Prenez le temps d\'un cycle lunaire complet avant toute décision majeure');
    guidance.push('Observez comment votre énergie reflète celle de votre environnement');
    
    return guidance;
  }

  /**
   * Synchronisation avec le cycle féminin
   */
  analyzeFeminineLunarAlignment(cycleDay: number, lunarPhase: LunarPhase): {
    alignment: 'synchronized' | 'complementary' | 'neutral';
    insights: string[];
    recommendations: string[];
  } {
    const insights: string[] = [];
    const recommendations: string[] = [];
    
    // Analyser la synchronisation menstruation/nouvelle lune
    const isMenstrualPhase = cycleDay >= 1 && cycleDay <= 5;
    const isOvulationPhase = cycleDay >= 12 && cycleDay <= 16;
    
    let alignment: 'synchronized' | 'complementary' | 'neutral' = 'neutral';
    
    if (isMenstrualPhase && lunarPhase.name === 'new_moon') {
      alignment = 'synchronized';
      insights.push('Votre cycle est parfaitement synchronisé avec la lune ! 🌑');
      insights.push('Cette harmonie amplifie votre pouvoir d\'introspection et de régénération');
      recommendations.push('Profitez de cette période pour vous retirer et vous ressourcer');
      recommendations.push('Vos visions et intuitions sont particulièrement puissantes');
    } else if (isOvulationPhase && lunarPhase.name === 'full_moon') {
      alignment = 'synchronized';
      insights.push('Ovulation en pleine lune - votre énergie créatrice est à son apogée ! 🌕');
      insights.push('Moment idéal pour la manifestation et l\'expression de votre pouvoir féminin');
      recommendations.push('Canalisez cette énergie dans vos projets créatifs');
      recommendations.push('Partagez votre lumière et votre sagesse avec le monde');
    } else if (
      (isMenstrualPhase && lunarPhase.name === 'full_moon') ||
      (isOvulationPhase && lunarPhase.name === 'new_moon')
    ) {
      alignment = 'complementary';
      insights.push('Votre cycle et la lune créent une dynamique complémentaire');
      insights.push('Cette tension créative peut générer des insights profonds');
      recommendations.push('Explorez cette dualité énergétique avec curiosité');
      recommendations.push('Utilisez cette polarité pour équilibrer vos énergies');
    }
    
    return { alignment, insights, recommendations };
  }

  /**
   * Prédictions lunaires pour la semaine
   */
  getWeeklyLunarForecast(): Array<{
    date: string;
    phase: LunarPhase;
    energy: string;
    recommendations: string[];
  }> {
    const forecast: any[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const phase = this.getCurrentLunarPhase(date);
      const energy = this.getEnergyDescription(phase);
      const recommendations = this.getDailyRecommendations(phase);
      
      forecast.push({
        date: date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' }),
        phase,
        energy,
        recommendations
      });
    }
    
    return forecast;
  }

  // Méthodes privées
  private getPhaseFromPosition(position: number): LunarPhase {
    const phases: LunarPhase[] = [
      {
        name: 'new_moon',
        displayName: 'Nouvelle Lune',
        emoji: '🌑',
        energy: 'introspective',
        description: 'Temps de nouveaux commencements et d\'intentions profondes',
        recommendations: ['Méditation', 'Journaling', 'Planification']
      },
      {
        name: 'waxing_crescent',
        displayName: 'Premier Croissant',
        emoji: '🌒',
        energy: 'growing',
        description: 'Énergie de croissance et de développement',
        recommendations: ['Action douce', 'Développement', 'Patience']
      },
      {
        name: 'first_quarter',
        displayName: 'Premier Quartier',
        emoji: '🌓',
        energy: 'active',
        description: 'Moment de décision et d\'action déterminée',
        recommendations: ['Décisions', 'Action', 'Persévérance']
      },
      {
        name: 'waxing_gibbous',
        displayName: 'Lune Gibbeuse Croissante',
        emoji: '🌔',
        energy: 'active',
        description: 'Préparation et affinement avant la plénitude',
        recommendations: ['Perfectionnement', 'Préparation', 'Ajustements']
      },
      {
        name: 'full_moon',
        displayName: 'Pleine Lune',
        emoji: '🌕',
        energy: 'active',
        description: 'Apogée énergétique, clarté et manifestation',
        recommendations: ['Célébration', 'Manifestation', 'Partage']
      },
      {
        name: 'waning_gibbous',
        displayName: 'Lune Gibbeuse Décroissante',
        emoji: '🌖',
        energy: 'releasing',
        description: 'Gratitude et partage de la sagesse acquise',
        recommendations: ['Gratitude', 'Enseignement', 'Partage']
      },
      {
        name: 'last_quarter',
        displayName: 'Dernier Quartier',
        emoji: '🌗',
        energy: 'releasing',
        description: 'Libération et pardon, lâcher-prise',
        recommendations: ['Libération', 'Pardon', 'Nettoyage']
      },
      {
        name: 'waning_crescent',
        displayName: 'Dernier Croissant',
        emoji: '🌘',
        energy: 'introspective',
        description: 'Repos et préparation pour le nouveau cycle',
        recommendations: ['Repos', 'Réflexion', 'Préparation']
      }
    ];

    const index = Math.floor(position * 8);
    return phases[Math.min(index, 7)];
  }

  private getDaysInCurrentPhase(): number {
    // Calcul simplifié - environ 3.7 jours par phase
    return Math.floor(Math.random() * 4) + 1;
  }

  private getNextPhase(currentPhase: LunarPhase): LunarPhase {
    const phases = ['new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous', 'full_moon', 'waning_gibbous', 'last_quarter', 'waning_crescent'];
    const currentIndex = phases.indexOf(currentPhase.name);
    const nextIndex = (currentIndex + 1) % phases.length;
    
    return this.getPhaseFromPosition(nextIndex / 8);
  }

  private getDaysToNextPhase(): number {
    return Math.floor(Math.random() * 3) + 1;
  }

  private analyzeEnergyAlignment(score: number, phase: LunarPhase, recentScans: any[]): 'aligned' | 'neutral' | 'challenging' {
    // Analyser si l'énergie personnelle est alignée avec l'énergie lunaire
    const expectedEnergyLevel = this.getExpectedEnergyForPhase(phase);
    const energyDifference = Math.abs(score - expectedEnergyLevel);
    
    if (energyDifference < 20) return 'aligned';
    if (energyDifference < 40) return 'neutral';
    return 'challenging';
  }

  private getExpectedEnergyForPhase(phase: LunarPhase): number {
    switch (phase.energy) {
      case 'introspective': return 45; // Énergie plus basse, introspective
      case 'growing': return 65; // Énergie croissante
      case 'active': return 80; // Énergie élevée
      case 'releasing': return 55; // Énergie de libération
      default: return 60;
    }
  }

  private generatePersonalizedMessage(phase: LunarPhase, alignment: 'aligned' | 'neutral' | 'challenging'): string {
    const messages = {
      aligned: {
        new_moon: `${this.userName}, tu es parfaitement alignée avec l'énergie introspective de la nouvelle lune. C'est le moment idéal pour planter de nouvelles graines d'intention.`,
        full_moon: `${this.userName}, ton énergie rayonne en harmonie avec la pleine lune ! Profite de cette clarté pour manifester tes visions.`,
        waxing_crescent: `${this.userName}, ton énergie croît doucement avec la lune. Continue à nourrir tes projets avec patience.`,
        waning_crescent: `${this.userName}, tu es en phase avec l'énergie de libération. Laisse partir ce qui ne te sert plus.`
      },
      challenging: {
        new_moon: `${this.userName}, ton énergie semble en décalage avec la lune. Peut-être as-tu besoin de plus de repos et d'introspection ?`,
        full_moon: `${this.userName}, la pleine lune t'invite à plus d'expression alors que ton énergie demande du calme. Honore tes besoins.`,
        waxing_crescent: `${this.userName}, la lune croît mais ton énergie semble fatiguée. Accorde-toi de la douceur.`,
        waning_crescent: `${this.userName}, c'est le moment de libérer, mais ton énergie semble retenir. Explore ce qui demande à être lâché.`
      }
    };

    const phaseKey = phase.name.includes('moon') ? phase.name : 
                     phase.name.includes('crescent') ? 'waxing_crescent' : 'waning_crescent';
    
    return messages[alignment]?.[phaseKey] || 
           `${this.userName}, observe comment ton énergie danse avec celle de la lune ${phase.emoji}`;
  }

  private generateLunarRecommendations(phase: LunarPhase, alignment: 'aligned' | 'neutral' | 'challenging'): string[] {
    const baseRecommendations = [...phase.recommendations];
    
    // Ajouter des recommandations selon l'alignement
    if (alignment === 'challenging') {
      baseRecommendations.push('Soyez patiente avec vous-même');
      baseRecommendations.push('Explorez cette résistance avec curiosité');
    } else if (alignment === 'aligned') {
      baseRecommendations.push('Profitez de cette harmonie énergétique');
      baseRecommendations.push('Votre intuition est particulièrement juste');
    }

    // Recommandations spécifiques au type HD
    if (this.hdType === 'reflector') {
      baseRecommendations.push('Observez sans jugement les énergies qui vous traversent');
      baseRecommendations.push('Votre sagesse lunaire est précieuse');
    }

    return baseRecommendations;
  }

  private getEnergyDescription(phase: LunarPhase): string {
    const descriptions = {
      introspective: 'Énergie douce et contemplative',
      growing: 'Énergie de développement et de croissance',
      active: 'Énergie dynamique et expansive',
      releasing: 'Énergie de libération et de gratitude'
    };
    
    return descriptions[phase.energy];
  }

  private getDailyRecommendations(phase: LunarPhase): string[] {
    return phase.recommendations.slice(0, 2); // Limiter à 2 recommandations par jour
  }
}