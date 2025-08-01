import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';
import { useAppSettings } from '../context/AppSettingsContext';
import Button from '../components/common/Button';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { ArrowRight, Share2, RefreshCcw, BookOpen, Download, Lock, Sparkles } from 'lucide-react';
import { Users } from 'lucide-react';
import EnergyGauge from '../components/results/EnergyGauge';
import HDCenterDisplay from '../components/results/HDCenterDisplay';
import GuidanceCard from '../components/results/GuidanceCard';
import FeelingsSection from '../components/results/FeelingsSection';
import { useAuthStore } from '../store/authStore';
import { useAlertStore } from '../store/alertStore';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { useAnalysisStore } from '../store/analysisStore';
import { useFeelingsStore, Feeling } from '../store/feelingsStore';
import { calculateOverallScore, determineAffectedCenter, generateGuidance } from '../utils/resultsUtils';
import { saveScan } from '../services/scanService';
import PremiumFeatureOverlay from '../components/premium/PremiumFeatureOverlay';
import PDFExportButton from '../components/results/PDFExportButton';
import { generateRemindersFromScan } from '../services/reminderService';
import { MessageCircle } from 'lucide-react';

interface ResultData {
  date: string;
  overallScore: number;
  categoryScores: Record<string, number>;
  affectedCenter: string;
  guidance: string;
  selectedFeelings: string[];
  mantra: {
    inhale: string;
    exhale: string;
  };
  realignmentActivity: string;
  personalizedInsights?: string[];
  isConversational?: boolean;
  conversationalData?: {
    totalMessages: number;
    conversationDuration: string;
    aiInsights: string[];
  };
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslation();
  const { settings } = useAppSettings();
  const { user } = useAuthStore();
  const { showAlert, showAlertDialog } = useAlertStore();
  const [isLoading, setIsLoading] = useState(true);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [scanSaved, setScanSaved] = useState(false); // Track if scan has been saved
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { setResults } = useAnalysisStore();
  
  // Get all feelings from the store instead of just one category
  const { getAllFeelingsData, getAllFeelingsByName } = useFeelingsStore();
  const allFeelings = getAllFeelingsData();
  
  useEffect(() => {
    const processResults = async () => {
      try {
        if (location.state?.results) {
          const categoryData = location.state.results;
          const isConversational = location.state.isConversational || false;
          const overallScore = calculateOverallScore(
            Object.values(categoryData).map(data => data.score)
          );
          
          // Get selected feelings from all categories
          const selectedFeelings = Object.values(categoryData)
            .flatMap(data => data.selectedFeelings || []);
          
          // Determine affected HD center based on scores and feelings
          const affectedCenter = determineAffectedCenter(selectedFeelings, allFeelings);
          
          // Generate personalized guidance with user's HD type
          const guidanceResult = await generateGuidance(
            overallScore, 
            affectedCenter,
            selectedFeelings,
            allFeelings,
            user?.hdType
          );
          
          // Enrichir avec les données conversationnelles si disponibles
          const conversationalInsights = isConversational && location.state.conversationalData?.sentimentAnalysis 
            ? [
                `Analyse conversationnelle : ${location.state.conversationalData.sentimentAnalysis.dominantTone === 'positive' ? 'Ton énergie rayonne à travers tes mots ✨' : 
                  location.state.conversationalData.sentimentAnalysis.dominantTone === 'challenging' ? 'Tes mots révèlent une période de transformation 🌊' : 
                  'Ton échange montre un bel équilibre émotionnel 🌸'}`,
                `Richesse d'expression : ${location.state.conversationalData.totalMessages} échanges avec Aminata`,
                `Durée d'exploration : ${location.state.conversationalData.conversationDuration}`
              ]
            : [];
          
          const newResultData = {
            date: new Date().toISOString(),
            overallScore,
            categoryScores: Object.fromEntries(
              Object.entries(categoryData).map(([key, data]) => [key, data.score])
            ),
            affectedCenter,
            guidance: guidanceResult.guidance,
            selectedFeelings,
            mantra: guidanceResult.mantra,
            realignmentActivity: guidanceResult.realignmentExercise || '',
            personalizedInsights: [
              ...(guidanceResult.personalizedInsights || []),
              ...conversationalInsights
            ],
            isConversational,
            conversationalData: isConversational ? {
              totalMessages: location.state.conversationalData?.totalMessages || 0,
              conversationDuration: location.state.conversationalData?.conversationDuration || '0 min',
              aiInsights: location.state.conversationalData?.aiInsights || [],
              sentimentAnalysis: location.state.conversationalData?.sentimentAnalysis
            } : undefined
          };
          
          setResultData(newResultData);
          setResults(newResultData);
        } else {
          navigate('/scan');
          return;
        }
      } catch (error) {
        console.error('Error processing results:', error);
        showAlertDialog(
          'Erreur de traitement 📊',
          'Impossible de traiter vos résultats énergétiques. Veuillez refaire votre scan.',
          'warning',
          () => navigate('/scan')
        );
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      processResults();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [location, navigate, setResults, user, allFeelings, showAlert]);
  
  useEffect(() => {
    const processScanResults = async () => {
      // Only save if we have data, user, and haven't saved yet
      if (!user?.id || !resultData || scanSaved) return;
      
      setScanSaved(true); // Set flag immediately to prevent duplicate attempts

      try {
        // Prepare category scores for database
        const categoryScores = {
          general: resultData.categoryScores.general || 0,
          emotional: resultData.categoryScores.emotional || 0,
          physical: resultData.categoryScores.physical || 0,
          mental: resultData.categoryScores.mental || 0,
          digestive: resultData.categoryScores.digestive || 0,
          somatic: resultData.categoryScores.somatic || 0,
          energetic: resultData.categoryScores.energetic || 0,
          feminine_cycle: resultData.categoryScores.feminine_cycle || 0,
          hd_specific: resultData.categoryScores.hd_specific || 0
        };

        // Determine the primary category based on the highest score
        const primaryCategory = Object.entries(categoryScores)
          .reduce((a, b) => a[1] > b[1] ? a : b)[0] as keyof typeof categoryScores;
        
        const { data: scanData, error } = await saveScan(
          user.id,
          resultData.overallScore,
          resultData.affectedCenter,
          resultData.selectedFeelings,
          categoryScores,
          primaryCategory as 'general' | 'emotional' | 'physical'
        );

        if (error) throw error;
        
        // Only generate reminders if we have a valid scan ID
        const scanId = scanData?.id;
        if (scanId) {
          // Générer automatiquement des rappels basés sur les résultats
          try {
            await generateRemindersFromScan(
              user.id,
              scanId,
              resultData.overallScore,
              resultData.affectedCenter,
              user.hdType
            );
            
            // Afficher le dialog de confirmation
            setShowSaveDialog(true);
          } catch (reminderError) {
            console.error('Error generating reminders:', reminderError);
            // Ne pas faire échouer le processus principal si la génération de rappels échoue
          }
        }
        
      } catch (error) {
        console.error('Error saving scan:', error);
        showAlertDialog(
          'Erreur de sauvegarde 💾',
          'Impossible de sauvegarder votre scan énergétique. Vos résultats restent visibles mais ne seront pas conservés dans votre historique.',
          'warning'
        );
      }
    };

    processScanResults();
  }, [user, resultData, scanSaved, showAlert]);
  
  const handleDownloadPDF = () => {
    showAlertDialog(
      'Export PDF en préparation 📄',
      'La fonctionnalité d\'export PDF est en cours de développement. Vous pourrez bientôt télécharger vos analyses en format PDF élégant.',
      'info'
    );
  };
  
  // Fonction pour obtenir la description d'un centre HD
  const getCenterDescription = (center: string): string => {
    const centerDescriptions: Record<string, string> = {
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
    
    return centerDescriptions[center] || 'Centre énergétique important dans votre design';
  };

  const handleDailyTirage = () => {
    showAlertDialog(
      'Tirage énergétique du jour 🌟',
      'Vous allez être redirigée vers votre tirage énergétique quotidien personnalisé.',
      'info',
      () => navigate('/#daily-energy')
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          message="Analyse de votre paysage énergétique en cours..." 
        />
      </div>
    );
  }
  
  if (!resultData) return null;

  return (
    <div className="min-h-screen py-20 md:py-32 pb-24 md:pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-6 md:space-y-8"
        >
          {/* Welcome Message */}
          <div className="text-center mb-8 md:mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral/10">
            <h1 className="font-display text-2xl md:text-4xl mb-3">
              Bonjour {user?.name || user?.email?.split('@')[0] || 'ma belle'} 🌸
            </h1>
            {resultData.isConversational && (
              <div className="mb-3 inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                <MessageCircle size={14} className="mr-1" />
                Diagnostic conversationnel complet
              </div>
            )}
            <p className="text-base md:text-lg text-neutral-dark/80">
              {resultData.isConversational 
                ? `Voici ton paysage énergétique complet du ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
                : `Voici ton paysage énergétique du ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
              }
            </p>
          </div>

          {/* Energy Gauge Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-neutral/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div>
                <EnergyGauge score={resultData.overallScore} />
              </div>
              <div>
                <HDCenterDisplay center={resultData.affectedCenter} />
              </div>
            </div>
          </div>

          {/* Guidance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-neutral/10"
          >
            <GuidanceCard 
              guidance={resultData.guidance} 
              personalizedInsights={resultData.personalizedInsights}
              mantra={resultData.mantra}
              realignmentExercise={resultData.realignmentActivity}
            />
          </motion.div>

          {/* Feelings Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral/10"
          >
            <h2 className="font-display text-xl md:text-2xl mb-4 md:mb-6">Analyse de tes ressentis</h2>
            <FeelingsSection 
              selectedFeelings={resultData.selectedFeelings}
              allFeelings={allFeelings}
            />
          </motion.div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-2xl p-6 shadow-sm border border-neutral/10">
            <Button 
              variant="primary"
              onClick={() => navigate('/dashboard')}
              icon={<BookOpen size={18} />}
              fullWidth
            >
              <span className="hidden md:inline">Voir mon tableau de bord</span>
              <span className="md:hidden">Tableau de bord</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/scan')}
              icon={<RefreshCcw size={18} />}
              fullWidth
            >
              <span className="hidden md:inline">Refaire un scan</span>
              <span className="md:hidden">Nouveau scan</span>
            </Button>
          </div>

          {/* Bouton supplémentaire pour partager ou sauvegarder */}
          <div className="flex flex-col md:flex-row justify-center mt-6 space-y-3 md:space-y-0 md:space-x-4">
            <Button 
              variant="outline"
              onClick={async () => {
                const shareText = `Mon score énergétique aujourd'hui : ${resultData.overallScore}% 🌸`;
                
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: 'Mon Baromètre Énergétique',
                      text: shareText,
                      url: window.location.href
                    });
                  } catch (error) {
                    // Fall back to clipboard if sharing fails
                    try {
                      await navigator.clipboard.writeText(shareText);
                      setShowShareDialog(true);
                    } catch (clipboardError) {
                      showAlertDialog(
                        'Partage indisponible 📱',
                        'Impossible de partager vos résultats automatiquement. Vous pouvez faire une capture d\'écran pour les partager.',
                        'info'
                      );
                    }
                  }
                } else {
                  // Fallback for browsers without Web Share API
                  try {
                    await navigator.clipboard.writeText(shareText);
                    setShowShareDialog(true);
                  } catch (clipboardError) {
                    showAlertDialog(
                      'Copie impossible 📋',
                      'Impossible de copier automatiquement. Vous pouvez sélectionner et copier manuellement votre score.',
                      'info'
                    );
                  }
                }
              }}
              icon={<Share2 size={18} />}
              className="w-full md:w-auto"
            >
              <span className="hidden md:inline">Partager mes résultats</span>
              <span className="md:hidden">Partager</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleDailyTirage}
              icon={<Sparkles size={18} />}
              className="w-full md:w-auto"
            >
              <span className="hidden md:inline">Tirage énergétique du jour</span>
              <span className="md:hidden">Tirage du jour</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/community')}
              icon={<Users size={18} />}
              className="w-full md:w-auto"
            >
              <span className="hidden md:inline">Partager en communauté</span>
              <span className="md:hidden">Communauté</span>
            </Button>
          </div>

          {/* Closing Message */}
          <div className="text-center mt-8 md:mt-12 bg-primary/5 rounded-2xl p-6 border border-primary/10">
            {resultData.isConversational && (
              <div className="mb-4">
                <h3 className="font-display text-lg text-primary mb-2">
                  🌸 Merci pour ce voyage conversationnel avec Aminata
                </h3>
                <p className="text-sm text-neutral-dark/70 mb-4">
                  Aminata a exploré avec vous votre paysage énergétique selon votre type {user?.hdType || 'HD'}.
                </p>
                {resultData.conversationalData && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-primary/5 rounded-lg p-3">
                      <span className="font-medium text-primary">💬 Messages échangés</span>
                      <div className="text-lg font-display">{resultData.conversationalData.totalMessages}</div>
                    </div>
                    <div className="bg-secondary/5 rounded-lg p-3">
                      <span className="font-medium text-secondary">⏱️ Durée</span>
                      <div className="text-lg font-display">{resultData.conversationalData.conversationDuration}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <p className="font-display text-base md:text-lg text-neutral-dark/80 italic">
              "Tu es exactement là où tu dois être. Continue à t'écouter avec amour."
            </p>
            <div className="mt-4">
              {/* Export PDF centré */}
              <div className="flex justify-center">
                <PDFExportButton 
                  scanData={resultData}
                  className="max-w-sm"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dialog de confirmation de sauvegarde */}
        <ConfirmationDialog
          isOpen={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          title="Scan sauvegardé ! 🌸"
          message="Votre analyse énergétique a été enregistrée avec succès. Des rappels personnalisés ont été générés automatiquement pour vous accompagner."
          type="success"
          showActions={false}
        />
      </div>
      
      {/* Dialogue de partage réussi */}
      <ConfirmationDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        title="Résultats copiés ! 📋"
        message="Votre score énergétique a été copié dans le presse-papier. Vous pouvez maintenant le coller où vous voulez pour le partager."
        type="success"
        showActions={false}
      />
    </div>
  );
};

export default Results;