import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Settings, Check, X } from 'lucide-react';
import Button from '../common/Button';
import { PDFExportService, PDFExportOptions } from '../../services/pdfExportService';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';

interface PDFExportButtonProps {
  scanData: any;
  className?: string;
}

const PDFExportButton = ({ scanData, className = '' }: PDFExportButtonProps) => {
  const { user } = useAuthStore();
  const { showAlert } = useAlertStore();
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [exportOptions, setExportOptions] = useState<PDFExportOptions>({
    includeCharts: true,
    includeHistory: true,
    includeFeelings: true,
    includeGuidance: true,
    includeRecommendations: true,
    format: 'detailed',
    language: 'fr'
  });

  const handleExport = async () => {
    if (!user || !scanData) {
      showAlert('Données manquantes pour l\'export', 'error');
      return;
    }

    try {
      setIsExporting(true);
      
      // Générer un vrai PDF HTML
      const htmlContent = generateHTMLReport(scanData, user, exportOptions);
      
      // Créer un blob HTML
      const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(htmlBlob);
      
      // Ouvrir dans une nouvelle fenêtre pour impression/sauvegarde PDF
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            URL.revokeObjectURL(url);
          }, 500);
        };
        showAlert('🌸 Rapport ouvert pour impression/sauvegarde PDF ! ✨', 'success');
      } else {
        // Fallback : télécharger le HTML
        const link = document.createElement('a');
        link.href = url;
        link.download = `barometre-energetique-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showAlert('🌸 Rapport HTML téléchargé ! Ouvrez-le et imprimez en PDF ✨', 'success');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showAlert('Erreur lors de la génération du PDF', 'error');
    } finally {
      setIsExporting(false);
      setShowOptions(false);
    }
  };

  // Générer un rapport HTML stylé pour impression PDF
  const generateHTMLReport = (scanData: any, user: any, options: PDFExportOptions) => {
    const score = scanData.overallScore || scanData.score || 0;
    const center = scanData.affectedCenter || scanData.center || 'Non défini';
    const guidance = scanData.guidance || 'Guidance personnalisée selon votre profil énergétique.';
    const selectedFeelings = scanData.selectedFeelings || [];
    const mantraInhale = scanData.mantra?.inhale || 'Je m\'accueille';
    const mantraExhale = scanData.mantra?.exhale || 'Je m\'équilibre';
    const exercise = scanData.realignmentActivity || scanData.realignmentExercise || scanData.realignment_exercise || 'Prenez un moment de pause consciente.';
    const insights = scanData.personalizedInsights || [];
    
    const getEnergyLabel = (score: number) => {
      if (score >= 80) return '🌟 Énergie florissante';
      if (score >= 60) return '🌸 Énergie équilibrée';
      if (score >= 40) return '🌊 Énergie fluctuante';
      if (score >= 20) return '🍃 Énergie en demande';
      return '🌙 Énergie en repos';
    };

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Baromètre Énergétique - Rapport Personnel</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;0,600;1,300&family=Montserrat:wght@300;400;500&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Montserrat', sans-serif;
            line-height: 1.6;
            color: #6F5959;
            background: #F9F1EE;
            padding: 40px 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(168, 120, 120, 0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #A87878;
            padding-bottom: 30px;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: linear-gradient(135deg, #A87878, #9F85AF);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
        }
        
        h1 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.5rem;
            color: #A87878;
            margin-bottom: 10px;
        }
        
        h2 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.8rem;
            color: #A87878;
            margin: 30px 0 15px 0;
            border-left: 4px solid #A87878;
            padding-left: 15px;
        }
        
        .user-info {
            background: linear-gradient(135deg, #A87878, #9F85AF);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 30px;
        }
        
        .score-section {
            text-align: center;
            background: #F9F1EE;
            padding: 30px;
            border-radius: 15px;
            margin: 20px 0;
        }
        
        .score-circle {
            width: 120px;
            height: 120px;
            border: 8px solid #A87878;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            background: white;
        }
        
        .score-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #A87878;
        }
        
        .guidance-box {
            background: #A87878;
            color: white;
            padding: 25px;
            border-radius: 15px;
            margin: 20px 0;
        }
        
        .mantra-box {
            background: #9F85AF;
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin: 15px 0;
        }
        
        .exercise-box {
            background: #E4C997;
            color: #6F5959;
            padding: 20px;
            border-radius: 15px;
            margin: 15px 0;
        }
        
        .feelings-list {
            background: #F9F1EE;
            padding: 20px;
            border-radius: 15px;
            margin: 15px 0;
        }
        
        .category-scores {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .category-item {
            background: white;
            padding: 15px;
            border-radius: 10px;
            border-left: 4px solid #A87878;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid #A87878;
            font-style: italic;
            color: #A87878;
        }
        
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🌸</div>
            <h1>Baromètre Énergétique</h1>
            <p>Rapport Personnel d'Analyse Énergétique</p>
        </div>
        
        <div class="user-info">
            <h2 style="color: white; border: none; margin: 0 0 10px 0; padding: 0;">👤 Informations Personnelles</h2>
            <p><strong>Nom:</strong> ${user.name || 'Utilisatrice'}</p>
            <p><strong>Type Human Design:</strong> ${user.hdType || 'Non défini'}</p>
            <p><strong>Date du scan:</strong> ${new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
        </div>
        
        <div class="score-section">
            <h2>⚡ Score Énergétique Global</h2>
            <div class="score-circle">
                <div class="score-number">${score}%</div>
            </div>
            <h3>${getEnergyLabel(score)}</h3>
            <p><strong>Centre HD Principal:</strong> ${center}</p>
        </div>
        
        ${options.includeGuidance ? `
        <div class="guidance-box">
            <h2 style="color: white; border: none; margin: 0 0 15px 0; padding: 0;">🌟 Guidance Personnalisée</h2>
            <p>${guidance}</p>
        </div>
        ` : ''}
        
        <div class="mantra-box">
            <h2 style="color: white; border: none; margin: 0 0 15px 0; padding: 0;">🧘‍♀️ Mantra du Jour</h2>
            <p><strong>Inspiration:</strong> "${mantraInhale}"</p>
            <p><strong>Expiration:</strong> "${mantraExhale}"</p>
        </div>
        
        <div class="exercise-box">
            <h2 style="color: #6F5959; border: none; margin: 0 0 15px 0; padding: 0;">🌿 Exercice de Réalignement</h2>
            <p>${exercise}</p>
        </div>
        
        ${options.includeFeelings && selectedFeelings.length > 0 ? `
        <div class="feelings-list">
            <h2>📝 Ressentis Sélectionnés</h2>
            <p>${selectedFeelings.join(', ')}</p>
        </div>
        ` : ''}
        
        ${scanData.categoryScores ? `
        <h2>📊 Scores par Catégorie</h2>
        <div class="category-scores">
            ${Object.entries(scanData.categoryScores)
              .filter(([_, score]) => score > 0)
              .map(([category, score]) => {
                const categoryNames = {
                  general: 'Général',
                  emotional: 'Émotionnel', 
                  physical: 'Physique',
                  mental: 'Mental',
                  digestive: 'Digestif',
                  somatic: 'Somatique',
                  energetic: 'Énergétique',
                  feminine_cycle: 'Cycle Féminin',
                  hd_specific: 'Spécifique HD'
                };
                return `
                <div class="category-item">
                    <strong>${categoryNames[category] || category}</strong><br>
                    <span style="font-size: 1.2em; color: #A87878;">${score}%</span>
                </div>`;
              }).join('')}
        </div>
        ` : ''}
        
        ${insights.length > 0 ? `
        <h2>💫 Insights Personnalisés</h2>
        <div class="feelings-list">
            ${insights.map(insight => `<p>• ${insight}</p>`).join('')}
        </div>
        ` : ''}
        
        <div class="footer">
            <p style="font-size: 1.2em; margin-bottom: 20px;">
                "Tu es exactement là où tu dois être.<br>
                Continue à t'écouter avec amour." 💕
            </p>
            <p>🌸 Généré par le Baromètre Énergétique 🌸</p>
            <p>Avec amour et lumière ✨</p>
        </div>
    </div>
</body>
</html>`;
  };

  const handleQuickExport = async () => {
    if (!user || !scanData) {
      showAlert('Données manquantes pour l\'export', 'error');
      return;
    }

    setIsExporting(true);
    
    try {
      // Sécuriser l'accès aux données
      const score = scanData.overallScore || scanData.score || 0;
      const center = scanData.affectedCenter || scanData.center || 'Non défini';
      const guidance = scanData.guidance || 'Guidance personnalisée selon votre profil énergétique.';
      const selectedFeelings = scanData.selectedFeelings || [];
      const mantraInhale = scanData.mantra?.inhale || 'Je m\'accueille';
      const mantraExhale = scanData.mantra?.exhale || 'Je m\'équilibre';
      const exercise = scanData.realignmentActivity || scanData.realignmentExercise || scanData.realignment_exercise || 'Prenez un moment de pause consciente.';
      const insights = scanData.personalizedInsights || [];
      
      // Fonction pour obtenir le label d'énergie
      const getEnergyLabel = (score) => {
        if (score >= 80) return '🌟 Énergie florissante';
        if (score >= 60) return '🌸 Énergie équilibrée';
        if (score >= 40) return '🌊 Énergie fluctuante';
        if (score >= 20) return '🍃 Énergie en demande';
        return '🌙 Énergie en repos';
      };
      
      // Créer un contenu de rapport structuré
      const pdfContent = `
🌸 BAROMÈTRE ÉNERGÉTIQUE - RAPPORT PERSONNEL 🌸
===============================================

👤 Utilisatrice: ${user.name || 'Utilisatrice'}
✨ Type Human Design: ${user.hdType || 'Non défini'}
📅 Date: ${new Date().toLocaleDateString('fr-FR', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

⚡ SCORE ÉNERGÉTIQUE GLOBAL: ${score}%
${getEnergyLabel(score)}

🎯 CENTRE HD PRINCIPAL: ${center}

🌟 GUIDANCE PERSONNALISÉE:
${guidance}

🧘‍♀️ MANTRA DU JOUR:
• Inspiration: "${mantraInhale}"
• Expiration: "${mantraExhale}"

🌿 EXERCICE DE RÉALIGNEMENT:
${exercise}

📝 RESSENTIS SÉLECTIONNÉS:
${selectedFeelings.length > 0 ? selectedFeelings.join(', ') : 'Aucun ressenti spécifique'}

${scanData.categoryScores ? `
📊 SCORES PAR CATÉGORIE:
${Object.entries(scanData.categoryScores)
  .filter(([_, score]) => score > 0)
  .map(([category, score]) => {
    const categoryNames = {
      general: 'Général',
      emotional: 'Émotionnel', 
      physical: 'Physique',
      mental: 'Mental',
      digestive: 'Digestif',
      somatic: 'Somatique',
      energetic: 'Énergétique',
      feminine_cycle: 'Cycle Féminin',
      hd_specific: 'Spécifique HD'
    };
    return `• ${categoryNames[category] || category}: ${score}%`;
  }).join('\n')}
` : ''}

💫 INSIGHTS PERSONNALISÉS:
${insights.length > 0 ? insights.map(insight => `• ${insight}`).join('\n') : '• Continuez à écouter votre énergie avec bienveillance'}

===============================================

"Tu es exactement là où tu dois être. 
Continue à t'écouter avec amour." 💕

---
🌸 Généré par le Baromètre Énergétique 🌸
Votre guide énergétique personnel

Avec amour et lumière ✨
      `;
      
      // Créer le fichier avec encodage UTF-8 correct
      const blob = new Blob([pdfContent], { 
        type: 'text/plain;charset=utf-8' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Nom de fichier sécurisé
      const safeName = (user.name || 'utilisatrice')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `barometre-energetique-${safeName}-${dateStr}.txt`;
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showAlert('🌸 Rapport texte téléchargé ! Pour un PDF, utilisez les options avancées ✨', 'success');
      
    } catch (error) {
      console.error('Error generating report:', error);
      showAlert(`Erreur lors de la génération du rapport: ${error.message}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bouton principal centré avec style cohérent */}
      <div className="flex flex-col items-center space-y-4">
        <Button
          variant="primary"
          onClick={handleQuickExport}
          disabled={isExporting}
          size="lg"
          icon={isExporting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download size={18} />
          )}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 rounded-full"
        >
          {isExporting ? 'Génération en cours...' : '📄 Télécharger mon rapport'}
        </Button>

        {/* Bouton options discret */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="text-xs text-neutral-dark/50 hover:text-primary transition-colors flex items-center space-x-1"
          title="Options d'export"
        >
          <Settings size={14} />
          <span>Options avancées (PDF stylé)</span>
        </button>
        
        {/* Informations sur le format */}
        <div className="text-xs text-center text-neutral-dark/60 max-w-xs">
          <p>📋 Rapport simple (texte) ou PDF stylé (options avancées)</p>
          <p className="mt-1">Toutes vos données énergétiques personnalisées</p>
        </div>
      </div>

      {/* Options d'export */}
      {showOptions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-primary/20 p-6 relative"
        >
          {/* Bouton fermer */}
          <button
            onClick={() => setShowOptions(false)}
            className="absolute top-4 right-4 p-2 text-neutral-dark/50 hover:text-neutral-dark transition-colors rounded-full hover:bg-neutral/10"
          >
            <X size={20} />
          </button>
          
          <h4 className="font-display text-lg text-primary mb-4 flex items-center justify-center">
            <FileText size={16} className="mr-2" />
            🎨 Personnaliser votre rapport
          </h4>

          <div className="space-y-4">
            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-primary mb-3">
                📄 Format du rapport
              </label>
              <div className="space-y-2">
                {[
                  { value: 'detailed', label: 'Détaillé', desc: 'Analyse complète avec tous les éléments' },
                  { value: 'summary', label: 'Résumé', desc: 'Points essentiels et recommandations' },
                  { value: 'minimal', label: 'Minimal', desc: 'Score et guidance uniquement' }
                ].map(format => (
                  <label key={format.value} className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value={format.value}
                      checked={exportOptions.format === format.value}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as any }))}
                      className="mt-1 text-primary"
                    />
                    <div>
                      <div className="text-sm font-medium text-neutral-dark">{format.label}</div>
                      <div className="text-xs text-neutral-dark/60">{format.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Sections à inclure */}
            <div>
              <label className="block text-sm font-medium text-primary mb-3">
                ✨ Sections à inclure
              </label>
              <div className="space-y-2">
                {[
                  { key: 'includeGuidance', label: 'Guidance personnalisée' },
                  { key: 'includeFeelings', label: 'Analyse des ressentis' },
                  { key: 'includeRecommendations', label: 'Recommandations' },
                  { key: 'includeCharts', label: 'Graphiques et visuels' },
                  { key: 'includeHistory', label: 'Historique des scans' }
                ].map(option => (
                  <label key={option.key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions[option.key as keyof PDFExportOptions] as boolean}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        [option.key]: e.target.checked
                      }))}
                      className="text-primary"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Langue */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                🌍 Langue
              </label>
              <select
                value={exportOptions.language}
                onChange={(e) => setExportOptions(prev => ({ ...prev, language: e.target.value as 'fr' | 'en' }))}
                className="input-field text-sm border-2 border-primary/20 focus:border-primary"
              >
                <option value="fr">Français</option>
                <option value="en">English (bientôt)</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOptions(false)}
              fullWidth
              className="border-2 border-primary/30 hover:border-primary/50"
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
              icon={isExporting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download size={16} />
              )}
              fullWidth
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              {isExporting ? 'Génération...' : 'Générer PDF stylé'}
            </Button>
          </div>
        </motion.div>
        </div>
      )}
    </div>
  );
};

export default PDFExportButton;