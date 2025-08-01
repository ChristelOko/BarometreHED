/**
 * Service d'analyse prédictive des patterns énergétiques
 * Utilise l'historique des scans pour prédire les tendances futures
 */

export interface EnergyPattern {
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  dayOfWeek: number;
  averageScore: number;
  dominantCenter: string;
  frequency: number;
  confidence: number;
}

export interface PredictiveInsight {
  type: 'energy_dip' | 'energy_peak' | 'center_activation' | 'cycle_pattern';
  prediction: string;
  confidence: number;
  timeframe: string;
  recommendations: string[];
}

export interface EnergyForecast {
  nextWeek: {
    expectedScore: number;
    riskDays: string[];
    opportunityDays: string[];
  };
  patterns: EnergyPattern[];
  insights: PredictiveInsight[];
}

export class PredictiveAnalytics {
  private userId: string;
  private hdType: string;

  constructor(userId: string, hdType: string) {
    this.userId = userId;
    this.hdType = hdType;
  }

  /**
   * Analyse les patterns énergétiques à partir de l'historique
   */
  async analyzeEnergyPatterns(scanHistory: any[]): Promise<EnergyPattern[]> {
    if (scanHistory.length < 5) {
      return []; // Pas assez de données pour une analyse fiable
    }

    const patterns: Map<string, EnergyPattern> = new Map();

    scanHistory.forEach(scan => {
      const date = new Date(scan.date);
      const timeOfDay = this.getTimeOfDay(date);
      const dayOfWeek = date.getDay();
      
      const key = `${timeOfDay}-${dayOfWeek}`;
      
      if (patterns.has(key)) {
        const existing = patterns.get(key)!;
        existing.averageScore = (existing.averageScore * existing.frequency + scan.score) / (existing.frequency + 1);
        existing.frequency += 1;
      } else {
        patterns.set(key, {
          timeOfDay,
          dayOfWeek,
          averageScore: scan.score,
          dominantCenter: scan.center,
          frequency: 1,
          confidence: 0
        });
      }
    });

    // Calculer la confiance basée sur la fréquence
    const patternArray = Array.from(patterns.values()).map(pattern => ({
      ...pattern,
      confidence: Math.min(pattern.frequency / 10, 1) // Max confiance à 10 occurrences
    }));

    return patternArray.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Génère des prédictions basées sur les patterns
   */
  async generatePredictions(patterns: EnergyPattern[], currentDate: Date = new Date()): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];

    // Prédiction des baisses d'énergie
    const lowEnergyPatterns = patterns.filter(p => p.averageScore < 40 && p.confidence > 0.3);
    if (lowEnergyPatterns.length > 0) {
      const nextLowEnergy = this.findNextOccurrence(lowEnergyPatterns[0], currentDate);
      insights.push({
        type: 'energy_dip',
        prediction: `Baisse d'énergie probable ${nextLowEnergy}`,
        confidence: lowEnergyPatterns[0].confidence,
        timeframe: nextLowEnergy,
        recommendations: [
          'Planifiez des activités douces ce jour-là',
          'Préparez des pratiques de ressourcement',
          'Évitez les engagements importants'
        ]
      });
    }

    // Prédiction des pics d'énergie
    const highEnergyPatterns = patterns.filter(p => p.averageScore > 75 && p.confidence > 0.3);
    if (highEnergyPatterns.length > 0) {
      const nextHighEnergy = this.findNextOccurrence(highEnergyPatterns[0], currentDate);
      insights.push({
        type: 'energy_peak',
        prediction: `Pic d'énergie attendu ${nextHighEnergy}`,
        confidence: highEnergyPatterns[0].confidence,
        timeframe: nextHighEnergy,
        recommendations: [
          'Planifiez vos projets importants',
          'Profitez de cette vitalité créatrice',
          'Partagez votre énergie avec votre entourage'
        ]
      });
    }

    // Analyse des patterns de centres HD
    const centerPatterns = this.analyzeCenterPatterns(patterns);
    if (centerPatterns.length > 0) {
      insights.push({
        type: 'center_activation',
        prediction: `Votre centre ${centerPatterns[0].center} est souvent actif ${centerPatterns[0].timing}`,
        confidence: centerPatterns[0].confidence,
        timeframe: centerPatterns[0].timing,
        recommendations: centerPatterns[0].recommendations
      });
    }

    return insights;
  }

  /**
   * Génère un forecast énergétique pour la semaine suivante
   */
  async generateWeeklyForecast(scanHistory: any[]): Promise<EnergyForecast> {
    const patterns = await this.analyzeEnergyPatterns(scanHistory);
    const insights = await this.generatePredictions(patterns);

    // Calculer le score attendu pour la semaine prochaine
    const recentScores = scanHistory.slice(0, 7).map(s => s.score);
    const expectedScore = recentScores.length > 0 
      ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length)
      : 50;

    // Identifier les jours à risque et d'opportunité
    const riskDays: string[] = [];
    const opportunityDays: string[] = [];

    for (let i = 0; i < 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      
      const dayPattern = patterns.find(p => 
        p.dayOfWeek === futureDate.getDay() && p.confidence > 0.2
      );

      if (dayPattern) {
        const dayName = futureDate.toLocaleDateString('fr-FR', { weekday: 'long' });
        if (dayPattern.averageScore < 40) {
          riskDays.push(dayName);
        } else if (dayPattern.averageScore > 70) {
          opportunityDays.push(dayName);
        }
      }
    }

    return {
      nextWeek: {
        expectedScore,
        riskDays,
        opportunityDays
      },
      patterns,
      insights
    };
  }

  /**
   * Analyse spécifique pour le cycle féminin
   */
  async analyzeFeminineCycle(scanHistory: any[]): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];
    
    // Analyser les patterns sur 28 jours
    const cycleData = scanHistory.filter(scan => {
      const scanDate = new Date(scan.date);
      const daysSince = Math.floor((Date.now() - scanDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince <= 28;
    });

    if (cycleData.length >= 10) {
      // Détecter les patterns cycliques
      const cyclicPatterns = this.detectCyclicPatterns(cycleData);
      
      if (cyclicPatterns.length > 0) {
        insights.push({
          type: 'cycle_pattern',
          prediction: 'Pattern cyclique détecté dans votre énergie',
          confidence: 0.7,
          timeframe: 'Cycle de 28 jours',
          recommendations: [
            'Planifiez selon vos phases énergétiques naturelles',
            'Honorez les moments de retrait et d\'expansion',
            'Synchronisez vos projets avec votre cycle'
          ]
        });
      }
    }

    return insights;
  }

  /**
   * Recommandations personnalisées basées sur les prédictions
   */
  generatePersonalizedRecommendations(forecast: EnergyForecast): string[] {
    const recommendations: string[] = [];

    // Recommandations basées sur le type HD
    const hdRecommendations = this.getHDSpecificRecommendations(forecast);
    recommendations.push(...hdRecommendations);

    // Recommandations basées sur les patterns
    if (forecast.nextWeek.riskDays.length > 0) {
      recommendations.push(
        `Attention aux ${forecast.nextWeek.riskDays.join(', ')} - prévoyez des activités douces`
      );
    }

    if (forecast.nextWeek.opportunityDays.length > 0) {
      recommendations.push(
        `Profitez des ${forecast.nextWeek.opportunityDays.join(', ')} pour vos projets importants`
      );
    }

    return recommendations;
  }

  // Méthodes utilitaires privées
  private getTimeOfDay(date: Date): 'morning' | 'afternoon' | 'evening' {
    const hour = date.getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  private findNextOccurrence(pattern: EnergyPattern, currentDate: Date): string {
    const daysUntil = (pattern.dayOfWeek + 7 - currentDate.getDay()) % 7;
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + (daysUntil === 0 ? 7 : daysUntil));
    
    return nextDate.toLocaleDateString('fr-FR', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }

  private analyzeCenterPatterns(patterns: EnergyPattern[]): any[] {
    const centerCounts: Record<string, { count: number; timing: string[] }> = {};
    
    patterns.forEach(pattern => {
      if (!centerCounts[pattern.dominantCenter]) {
        centerCounts[pattern.dominantCenter] = { count: 0, timing: [] };
      }
      centerCounts[pattern.dominantCenter].count += pattern.frequency;
      centerCounts[pattern.dominantCenter].timing.push(`${pattern.timeOfDay}`);
    });

    return Object.entries(centerCounts)
      .map(([center, data]) => ({
        center,
        confidence: Math.min(data.count / 10, 1),
        timing: data.timing[0],
        recommendations: this.getCenterRecommendations(center)
      }))
      .filter(item => item.confidence > 0.3)
      .sort((a, b) => b.confidence - a.confidence);
  }

  private detectCyclicPatterns(cycleData: any[]): any[] {
    // Algorithme simple de détection de cycles
    const patterns: any[] = [];
    
    // Analyser les variations sur 7, 14, 21, 28 jours
    [7, 14, 21, 28].forEach(period => {
      const correlation = this.calculateCyclicCorrelation(cycleData, period);
      if (correlation > 0.6) {
        patterns.push({ period, correlation });
      }
    });

    return patterns;
  }

  private calculateCyclicCorrelation(data: any[], period: number): number {
    if (data.length < period * 2) return 0;
    
    let correlation = 0;
    let comparisons = 0;
    
    for (let i = 0; i < data.length - period; i++) {
      const score1 = data[i].score;
      const score2 = data[i + period]?.score;
      
      if (score2 !== undefined) {
        const diff = Math.abs(score1 - score2);
        correlation += (100 - diff) / 100;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? correlation / comparisons : 0;
  }

  private getHDSpecificRecommendations(forecast: EnergyForecast): string[] {
    const recommendations: string[] = [];
    
    switch (this.hdType) {
      case 'projector':
        recommendations.push('Respectez vos besoins de reconnaissance et de repos');
        if (forecast.nextWeek.expectedScore < 50) {
          recommendations.push('Période idéale pour observer et conseiller plutôt qu\'agir');
        }
        break;
        
      case 'generator':
        recommendations.push('Écoutez vos réponses sacrales pour vos engagements');
        if (forecast.nextWeek.expectedScore > 70) {
          recommendations.push('Excellente période pour vos projets créatifs');
        }
        break;
        
      case 'manifesting-generator':
        recommendations.push('Honorez votre besoin de variété et de changement');
        break;
        
      case 'manifestor':
        recommendations.push('Informez votre entourage de vos initiatives');
        break;
        
      case 'reflector':
        recommendations.push('Prenez le temps d\'un cycle lunaire pour les décisions importantes');
        break;
    }
    
    return recommendations;
  }

  private getCenterRecommendations(center: string): string[] {
    const recommendations: Record<string, string[]> = {
      'solar-plexus': [
        'Pratiquez la respiration émotionnelle',
        'Accordez-vous du temps pour ressentir',
        'Évitez les décisions dans l\'émotion'
      ],
      'heart': [
        'Écoutez votre vérité intérieure',
        'Respectez vos limites énergétiques',
        'Cultivez l\'amour de soi'
      ],
      'sacral': [
        'Suivez vos réponses corporelles',
        'Respectez vos rythmes naturels',
        'Engagez-vous selon votre enthousiasme'
      ],
      'throat': [
        'Exprimez votre vérité authentique',
        'Prenez le temps avant de parler',
        'Honorez votre besoin de communication'
      ],
      'g-center': [
        'Reconnectez-vous à votre identité',
        'Suivez votre direction naturelle',
        'Cultivez l\'amour de soi'
      ]
    };
    
    return recommendations[center] || ['Portez attention à ce centre énergétique'];
  }
}