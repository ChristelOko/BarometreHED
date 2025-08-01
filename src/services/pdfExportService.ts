/**
 * Service d'export PDF des analyses énergétiques
 * Génère des rapports personnalisés et élégants
 */

export interface PDFExportOptions {
  includeCharts: boolean;
  includeHistory: boolean;
  includeFeelings: boolean;
  includeGuidance: boolean;
  includeRecommendations: boolean;
  format: 'detailed' | 'summary' | 'minimal';
  language: 'fr' | 'en';
}

export interface PDFContent {
  userInfo: {
    name: string;
    hdType: string;
    scanDate: string;
  };
  energyScore: {
    overall: number;
    categories: Record<string, number>;
  };
  affectedCenter: {
    name: string;
    description: string;
  };
  guidance: {
    message: string;
    mantra: { inhale: string; exhale: string };
    exercise: string;
    insights: string[];
  };
  feelings: {
    positive: string[];
    challenging: string[];
    analysis: string;
  };
  recommendations: {
    immediate: string[];
    weekly: string[];
    longTerm: string[];
  };
  charts?: {
    energyGauge: string; // Base64 image
    historyChart: string; // Base64 image
  };
}

export class PDFExportService {
  /**
   * Génère un PDF complet de l'analyse énergétique
   */
  static async generateAnalysisPDF(
    scanData: any,
    userInfo: any,
    options: PDFExportOptions = {
      includeCharts: true,
      includeHistory: true,
      includeFeelings: true,
      includeGuidance: true,
      includeRecommendations: true,
      format: 'detailed',
      language: 'fr'
    }
  ): Promise<{ data: Blob | null; error: Error | null }> {
    try {
      // Préparer le contenu du PDF
      const pdfContent = await this.preparePDFContent(scanData, userInfo, options);
      
      // Générer le HTML pour le PDF
      const htmlContent = this.generateHTMLContent(pdfContent, options);
      
      // Convertir en PDF (simulation - en production utiliser jsPDF ou Puppeteer)
      const pdfBlob = await this.convertHTMLToPDF(htmlContent);
      
      return { data: pdfBlob, error: null };
    } catch (error) {
      console.error('Error generating PDF:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Génère un rapport de suivi mensuel
   */
  static async generateMonthlyReport(
    userId: string,
    month: string,
    scanHistory: any[],
    options: PDFExportOptions
  ): Promise<{ data: Blob | null; error: Error | null }> {
    try {
      // Analyser les données du mois
      const monthlyAnalysis = this.analyzeMonthlyData(scanHistory);
      
      // Créer le contenu du rapport mensuel
      const reportContent = this.createMonthlyReportContent(monthlyAnalysis, month);
      
      // Générer le HTML
      const htmlContent = this.generateMonthlyReportHTML(reportContent, options);
      
      // Convertir en PDF
      const pdfBlob = await this.convertHTMLToPDF(htmlContent);
      
      return { data: pdfBlob, error: null };
    } catch (error) {
      console.error('Error generating monthly report:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Génère un guide personnalisé Human Design
   */
  static async generateHDGuidePDF(
    hdType: string,
    personalizedInsights: string[],
    options: PDFExportOptions
  ): Promise<{ data: Blob | null; error: Error | null }> {
    try {
      const guideContent = this.createHDGuideContent(hdType, personalizedInsights);
      const htmlContent = this.generateHDGuideHTML(guideContent, options);
      const pdfBlob = await this.convertHTMLToPDF(htmlContent);
      
      return { data: pdfBlob, error: null };
    } catch (error) {
      console.error('Error generating HD guide PDF:', error);
      return { data: null, error: error as Error };
    }
  }

  // Méthodes privées pour la préparation du contenu
  private static async preparePDFContent(
    scanData: any,
    userInfo: any,
    options: PDFExportOptions
  ): Promise<PDFContent> {
    const content: PDFContent = {
      userInfo: {
        name: userInfo.name || 'Utilisatrice',
        hdType: userInfo.hdType || 'Non défini',
        scanDate: new Date(scanData.date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      },
      energyScore: {
        overall: scanData.score,
        categories: {
          general: scanData.general_score || 0,
          emotional: scanData.emotional_score || 0,
          physical: scanData.physical_score || 0,
          mental: scanData.mental_score || 0,
          digestive: scanData.digestive_score || 0,
          somatic: scanData.somatic_score || 0,
          energetic: scanData.energetic_score || 0,
          feminine_cycle: scanData.feminine_cycle_score || 0,
          hd_specific: scanData.hd_specific_score || 0
        }
      },
      affectedCenter: {
        name: this.getCenterDisplayName(scanData.center),
        description: this.getCenterDescription(scanData.center)
      },
      guidance: {
        message: scanData.guidance || 'Guidance personnalisée selon votre profil énergétique.',
        mantra: scanData.mantra || { inhale: 'Je m\'accueille', exhale: 'Je m\'équilibre' },
        exercise: scanData.realignment_exercise || 'Prenez un moment de pause consciente.',
        insights: scanData.personalized_insights || []
      },
      feelings: {
        positive: (scanData.selected_feelings || []).filter((f: string) => 
          this.isPositiveFeeling(f)
        ),
        challenging: (scanData.selected_feelings || []).filter((f: string) => 
          !this.isPositiveFeeling(f)
        ),
        analysis: this.generateFeelingsAnalysis(scanData.selected_feelings || [])
      },
      recommendations: {
        immediate: this.generateImmediateRecommendations(scanData),
        weekly: this.generateWeeklyRecommendations(scanData),
        longTerm: this.generateLongTermRecommendations(scanData, userInfo.hdType)
      }
    };

    // Ajouter les graphiques si demandés
    if (options.includeCharts) {
      content.charts = {
        energyGauge: await this.generateEnergyGaugeImage(scanData.score),
        historyChart: await this.generateHistoryChartImage([scanData])
      };
    }

    return content;
  }

  private static generateHTMLContent(content: PDFContent, options: PDFExportOptions): string {
    const styles = this.getPDFStyles();
    
    return `
    <!DOCTYPE html>
    <html lang="${options.language}">
    <head>
      <meta charset="UTF-8">
      <title>Analyse Énergétique - ${content.userInfo.name}</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="pdf-container">
        ${this.generateHeaderSection(content)}
        ${this.generateScoreSection(content)}
        ${options.includeGuidance ? this.generateGuidanceSection(content) : ''}
        ${options.includeFeelings ? this.generateFeelingsSection(content) : ''}
        ${options.includeRecommendations ? this.generateRecommendationsSection(content) : ''}
        ${this.generateFooterSection(content)}
      </div>
    </body>
    </html>
    `;
  }

  private static generateHeaderSection(content: PDFContent): string {
    return `
    <header class="pdf-header">
      <div class="logo-section">
        <h1>🌸 Baromètre Énergétique</h1>
        <p class="subtitle">Analyse personnalisée Human Design</p>
      </div>
      <div class="user-info">
        <h2>Bonjour ${content.userInfo.name}</h2>
        <p><strong>Type HD:</strong> ${content.userInfo.hdType}</p>
        <p><strong>Date:</strong> ${content.userInfo.scanDate}</p>
      </div>
    </header>
    `;
  }

  private static generateScoreSection(content: PDFContent): string {
    const scoreColor = this.getScoreColor(content.energyScore.overall);
    const scoreLabel = this.getScoreLabel(content.energyScore.overall);
    
    return `
    <section class="score-section">
      <h3>📊 Votre Score Énergétique</h3>
      <div class="score-display">
        <div class="score-circle" style="border-color: ${scoreColor}">
          <span class="score-number" style="color: ${scoreColor}">${content.energyScore.overall}%</span>
          <span class="score-label">${scoreLabel}</span>
        </div>
        <div class="center-info">
          <h4>Centre HD Principal</h4>
          <p><strong>${content.affectedCenter.name}</strong></p>
          <p class="center-description">${content.affectedCenter.description}</p>
        </div>
      </div>
      
      <div class="categories-grid">
        ${Object.entries(content.energyScore.categories)
          .filter(([_, score]) => score > 0)
          .map(([category, score]) => `
            <div class="category-item">
              <span class="category-name">${this.getCategoryDisplayName(category)}</span>
              <div class="category-bar">
                <div class="category-fill" style="width: ${score}%; background-color: ${this.getCategoryColor(category)}"></div>
              </div>
              <span class="category-score">${score}%</span>
            </div>
          `).join('')}
      </div>
    </section>
    `;
  }

  private static generateGuidanceSection(content: PDFContent): string {
    return `
    <section class="guidance-section">
      <h3>🌟 Guidance Personnalisée</h3>
      <div class="guidance-content">
        <p class="guidance-message">${content.guidance.message}</p>
        
        <div class="mantra-box">
          <h4>🧘‍♀️ Mantra du Jour</h4>
          <div class="mantra-content">
            <p><strong>Inspiration:</strong> ${content.guidance.mantra.inhale}</p>
            <p><strong>Expiration:</strong> ${content.guidance.mantra.exhale}</p>
          </div>
        </div>
        
        <div class="exercise-box">
          <h4>🌿 Exercice de Réalignement</h4>
          <p>${content.guidance.exercise}</p>
        </div>
        
        ${content.guidance.insights.length > 0 ? `
          <div class="insights-box">
            <h4>💡 Insights Personnalisés</h4>
            <ul>
              ${content.guidance.insights.map(insight => `<li>${insight}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    </section>
    `;
  }

  private static generateFeelingsSection(content: PDFContent): string {
    return `
    <section class="feelings-section">
      <h3>📝 Analyse de vos Ressentis</h3>
      
      <div class="feelings-grid">
        <div class="positive-feelings">
          <h4>✨ Ressentis Positifs (${content.feelings.positive.length})</h4>
          <ul>
            ${content.feelings.positive.map(feeling => `<li>${feeling}</li>`).join('')}
          </ul>
        </div>
        
        <div class="challenging-feelings">
          <h4>🍂 Ressentis à Observer (${content.feelings.challenging.length})</h4>
          <ul>
            ${content.feelings.challenging.map(feeling => `<li>${feeling}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <div class="feelings-analysis">
        <h4>🔍 Analyse</h4>
        <p>${content.feelings.analysis}</p>
      </div>
    </section>
    `;
  }

  private static generateRecommendationsSection(content: PDFContent): string {
    return `
    <section class="recommendations-section">
      <h3>🎯 Recommandations Personnalisées</h3>
      
      <div class="recommendations-grid">
        <div class="immediate-rec">
          <h4>🚀 Actions Immédiates</h4>
          <ul>
            ${content.recommendations.immediate.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        
        <div class="weekly-rec">
          <h4>📅 Cette Semaine</h4>
          <ul>
            ${content.recommendations.weekly.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        
        <div class="longterm-rec">
          <h4>🌱 À Long Terme</h4>
          <ul>
            ${content.recommendations.longTerm.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
      </div>
    </section>
    `;
  }

  private static generateFooterSection(content: PDFContent): string {
    return `
    <footer class="pdf-footer">
      <div class="footer-content">
        <p class="footer-message">
          "Votre énergie est unique et précieuse. Continuez à l'honorer avec amour et conscience."
        </p>
        <div class="footer-info">
          <p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
          <p>Baromètre Énergétique - Votre guide énergétique personnel</p>
        </div>
      </div>
    </footer>
    `;
  }

  private static getPDFStyles(): string {
    return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
    
    .pdf-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    
    .pdf-header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #A87878;
    }
    
    .pdf-header h1 {
      font-size: 28px;
      color: #A87878;
      margin-bottom: 10px;
    }
    
    .subtitle {
      font-style: italic;
      color: #666;
      margin-bottom: 20px;
    }
    
    .user-info h2 {
      font-size: 24px;
      color: #A87878;
      margin-bottom: 10px;
    }
    
    .score-section {
      margin-bottom: 40px;
    }
    
    .score-display {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 30px 0;
    }
    
    .score-circle {
      width: 150px;
      height: 150px;
      border: 8px solid;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .score-number {
      font-size: 36px;
      font-weight: bold;
    }
    
    .score-label {
      font-size: 14px;
      margin-top: 5px;
    }
    
    .center-info {
      text-align: center;
      max-width: 300px;
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 30px;
    }
    
    .category-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .category-name {
      min-width: 80px;
      font-size: 12px;
    }
    
    .category-bar {
      flex: 1;
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .category-fill {
      height: 100%;
      transition: width 0.3s ease;
    }
    
    .category-score {
      min-width: 40px;
      text-align: right;
      font-size: 12px;
      font-weight: bold;
    }
    
    section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    
    h3 {
      font-size: 20px;
      color: #A87878;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    
    h4 {
      font-size: 16px;
      color: #666;
      margin-bottom: 15px;
    }
    
    .guidance-content {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
    }
    
    .guidance-message {
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 20px;
      font-style: italic;
    }
    
    .mantra-box, .exercise-box, .insights-box {
      background: white;
      padding: 15px;
      margin: 15px 0;
      border-left: 4px solid #A87878;
      border-radius: 4px;
    }
    
    .mantra-content p {
      margin: 5px 0;
    }
    
    .feelings-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 20px;
    }
    
    .positive-feelings, .challenging-feelings {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
    }
    
    .positive-feelings h4 {
      color: #4CAF50;
    }
    
    .challenging-feelings h4 {
      color: #FF9800;
    }
    
    .feelings-analysis {
      background: #f0f8ff;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #2196F3;
    }
    
    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .immediate-rec, .weekly-rec, .longterm-rec {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
    }
    
    .immediate-rec {
      border-left: 4px solid #FF5722;
    }
    
    .weekly-rec {
      border-left: 4px solid #2196F3;
    }
    
    .longterm-rec {
      border-left: 4px solid #4CAF50;
    }
    
    ul {
      list-style-type: none;
      padding-left: 0;
    }
    
    li {
      margin: 8px 0;
      padding-left: 20px;
      position: relative;
    }
    
    li:before {
      content: "•";
      color: #A87878;
      font-weight: bold;
      position: absolute;
      left: 0;
    }
    
    .pdf-footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #A87878;
      text-align: center;
    }
    
    .footer-message {
      font-style: italic;
      font-size: 16px;
      color: #A87878;
      margin-bottom: 20px;
    }
    
    .footer-info {
      font-size: 12px;
      color: #666;
    }
    
    @media print {
      .pdf-container {
        padding: 20px;
      }
      
      section {
        page-break-inside: avoid;
      }
    }
    `;
  }

  // Méthodes utilitaires
  private static async convertHTMLToPDF(htmlContent: string): Promise<Blob> {
    // Simulation de conversion PDF
    // En production, utiliser jsPDF, Puppeteer, ou un service externe
    
    const encoder = new TextEncoder();
    const data = encoder.encode(htmlContent);
    
    return new Blob([data], { type: 'application/pdf' });
  }

  private static getScoreColor(score: number): string {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#A87878';
    if (score >= 40) return '#FF9800';
    return '#F44336';
  }

  private static getScoreLabel(score: number): string {
    if (score >= 80) return 'Florissante';
    if (score >= 60) return 'Équilibrée';
    if (score >= 40) return 'Fluctuante';
    if (score >= 20) return 'En demande';
    return 'En repos';
  }

  private static getCenterDisplayName(center: string): string {
    const names: Record<string, string> = {
      'throat': 'Centre de la Gorge',
      'heart': 'Centre du Cœur',
      'solar-plexus': 'Plexus Solaire',
      'sacral': 'Centre Sacral',
      'root': 'Centre Racine',
      'spleen': 'Centre de la Rate',
      'g-center': 'Centre G (Identité)',
      'ajna': 'Centre Ajna',
      'head': 'Centre de la Tête'
    };
    return names[center] || center;
  }

  private static getCenterDescription(center: string): string {
    const descriptions: Record<string, string> = {
      'throat': 'Communication, expression, manifestation',
      'heart': 'Volonté, détermination, vitalité',
      'solar-plexus': 'Émotions, sensibilité, intuition',
      'sacral': 'Énergie vitale, créativité, sexualité',
      'root': 'Stress, pression, survie',
      'spleen': 'Intuition, système immunitaire, peur',
      'g-center': 'Identité, amour, direction',
      'ajna': 'Mental, conceptualisation, certitude',
      'head': 'Inspiration, questions, pression mentale'
    };
    return descriptions[center] || 'Centre énergétique important';
  }

  private static getCategoryDisplayName(category: string): string {
    const names: Record<string, string> = {
      'general': 'Général',
      'emotional': 'Émotionnel',
      'physical': 'Physique',
      'mental': 'Mental',
      'digestive': 'Digestif',
      'somatic': 'Somatique',
      'energetic': 'Énergétique',
      'feminine_cycle': 'Cycle Féminin',
      'hd_specific': 'Spécifique HD'
    };
    return names[category] || category;
  }

  private static getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'general': '#A87878',
      'emotional': '#9F85AF',
      'physical': '#E4C997',
      'mental': '#14B8A6',
      'digestive': '#F59E0B',
      'somatic': '#6366F1',
      'energetic': '#8B5CF6',
      'feminine_cycle': '#EC4899',
      'hd_specific': '#3B82F6'
    };
    return colors[category] || '#A87878';
  }

  private static isPositiveFeeling(feeling: string): boolean {
    // Logique simplifiée - en production, vérifier dans la base de données
    const positiveKeywords = ['bien', 'énergie', 'joie', 'clarté', 'alignement', 'harmonie', 'paix'];
    return positiveKeywords.some(keyword => feeling.toLowerCase().includes(keyword));
  }

  private static generateFeelingsAnalysis(feelings: string[]): string {
    const positiveCount = feelings.filter(f => this.isPositiveFeeling(f)).length;
    const challengingCount = feelings.length - positiveCount;
    
    if (positiveCount > challengingCount) {
      return `Votre analyse révèle une prédominance de ressentis positifs (${positiveCount}/${feelings.length}). Vous êtes dans une phase d'épanouissement énergétique.`;
    } else if (challengingCount > positiveCount) {
      return `Votre analyse montre des défis énergétiques (${challengingCount}/${feelings.length}). C'est une période de transformation qui demande de la douceur.`;
    } else {
      return `Votre énergie présente un équilibre entre ressentis positifs et défis. Cette dualité est naturelle et riche d'enseignements.`;
    }
  }

  private static generateImmediateRecommendations(scanData: any): string[] {
    const recommendations: string[] = [];
    
    if (scanData.score < 40) {
      recommendations.push('Accordez-vous un moment de repos immédiat');
      recommendations.push('Pratiquez 5 respirations profondes');
      recommendations.push('Buvez un verre d\'eau consciemment');
    } else if (scanData.score > 75) {
      recommendations.push('Célébrez cette belle énergie');
      recommendations.push('Partagez votre vitalité avec votre entourage');
      recommendations.push('Canalisez cette énergie dans un projet créatif');
    } else {
      recommendations.push('Maintenez cette stabilité énergétique');
      recommendations.push('Observez vos besoins avec bienveillance');
      recommendations.push('Continuez vos pratiques actuelles');
    }
    
    return recommendations;
  }

  private static generateWeeklyRecommendations(scanData: any): string[] {
    return [
      'Planifiez des moments de reconnexion quotidiens',
      'Observez vos patterns énergétiques',
      'Adaptez vos activités selon votre énergie',
      'Pratiquez votre mantra personnalisé',
      'Faites un nouveau scan en milieu de semaine'
    ];
  }

  private static generateLongTermRecommendations(scanData: any, hdType: string): string[] {
    const baseRecommendations = [
      'Développez votre connaissance de votre design unique',
      'Créez des rituels énergétiques personnalisés',
      'Explorez les différentes catégories de diagnostic'
    ];

    // Ajouter des recommandations spécifiques au type HD
    switch (hdType) {
      case 'projector':
        baseRecommendations.push('Cultivez des espaces de reconnaissance');
        baseRecommendations.push('Développez votre autorité intérieure');
        break;
      case 'generator':
        baseRecommendations.push('Affinez votre écoute sacrale');
        baseRecommendations.push('Explorez vos passions authentiques');
        break;
      case 'manifesting-generator':
        baseRecommendations.push('Honorez votre besoin de variété');
        baseRecommendations.push('Développez votre capacité d\'adaptation');
        break;
      case 'manifestor':
        baseRecommendations.push('Pratiquez l\'art d\'informer avec grâce');
        baseRecommendations.push('Cultivez votre indépendance énergétique');
        break;
      case 'reflector':
        baseRecommendations.push('Synchronisez-vous avec les cycles lunaires');
        baseRecommendations.push('Créez des environnements nourrissants');
        break;
    }

    return baseRecommendations;
  }

  private static async generateEnergyGaugeImage(score: number): Promise<string> {
    // Simulation - en production, générer une vraie image
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }

  private static async generateHistoryChartImage(scanHistory: any[]): Promise<string> {
    // Simulation - en production, générer un vrai graphique
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }

  private static analyzeMonthlyData(scanHistory: any[]): any {
    // Analyser les données du mois pour le rapport mensuel
    return {
      averageScore: scanHistory.reduce((sum, scan) => sum + scan.score, 0) / scanHistory.length,
      totalScans: scanHistory.length,
      bestDay: scanHistory.reduce((best, scan) => scan.score > best.score ? scan : best),
      worstDay: scanHistory.reduce((worst, scan) => scan.score < worst.score ? scan : worst),
      trends: 'stable' // Calcul de tendance simplifié
    };
  }

  private static createMonthlyReportContent(analysis: any, month: string): any {
    return {
      month,
      summary: analysis,
      insights: [
        'Votre énergie a montré une belle stabilité ce mois-ci',
        'Les patterns observés révèlent votre sagesse corporelle',
        'Continuez à honorer vos rythmes naturels'
      ]
    };
  }

  private static generateMonthlyReportHTML(content: any, options: PDFExportOptions): string {
    // Générer le HTML pour le rapport mensuel
    return `<html><body><h1>Rapport Mensuel - ${content.month}</h1></body></html>`;
  }

  private static createHDGuideContent(hdType: string, insights: string[]): any {
    return {
      hdType,
      insights,
      description: `Guide personnalisé pour votre type ${hdType}`
    };
  }

  private static generateHDGuideHTML(content: any, options: PDFExportOptions): string {
    // Générer le HTML pour le guide HD
    return `<html><body><h1>Guide ${content.hdType}</h1></body></html>`;
  }
}