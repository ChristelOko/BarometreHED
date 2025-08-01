import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/authStore';
import { useSubscription } from '../hooks/useSubscription';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { Sparkles, BarChart, Calendar, Bell, Brain, Utensils, Hand, Zap, Moon, User, Crown, TrendingUp, MessageCircle, Shield } from 'lucide-react';
import ScanHistoryChart from '../components/dashboard/ScanHistoryChart'; 
import DashboardCard from '../components/dashboard/DashboardCard';
import RecentScans from '../components/dashboard/RecentScans';
import CategoryScores from '../components/dashboard/CategoryScores';
import EnergyTrend from '../components/dashboard/EnergyTrend';
import CenterFrequency from '../components/dashboard/CenterFrequency';
import EnergyGauge from '../components/results/EnergyGauge';
import RemindersTab from '../components/dashboard/RemindersTab';
import PredictiveInsights from '../components/dashboard/PredictiveInsights';
import { getRecentScans, getScansStats, type Scan } from '../services/scanService'; 
import { useAlertStore } from '../store/alertStore';
import { ConversationalAI } from '../services/conversationalAI';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Users, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { showAlert, showAlertDialog } = useAlertStore();
  const { currentPlanName, isPremium, getSubscriptionEndDate, isSubscriptionCanceled } = useSubscription();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [scanHistory, setScanHistory] = useState<Scan[]>([]);
  const [totalScans, setTotalScans] = useState(0);
  const [lastScanDate, setLastScanDate] = useState<string | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<number>(0);
  const [stats, setStats] = useState({
    averageScore: 0,
    mostFrequentCenter: 'g-center',
    trend: 'stable' as 'improving' | 'stable' | 'declining',
    categoryScores: {
      general: { score: 0, lastScan: null as string | null },
      emotional: { score: 0, lastScan: null as string | null },
      physical: { score: 0, lastScan: null as string | null },
      mental: { score: 0, lastScan: null as string | null },
      digestive: { score: 0, lastScan: null as string | null },
      somatic: { score: 0, lastScan: null as string | null },
      energetic: { score: 0, lastScan: null as string | null },
      feminine_cycle: { score: 0, lastScan: null as string | null },
      hd_specific: { score: 0, lastScan: null as string | null }
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [conversationalAI, setConversationalAI] = useState<ConversationalAI | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  
  // Fonction pour obtenir les centres HD affectés
  const getAffectedCenters = () => {
    return scanHistory.slice(-3).map(scan => scan.center);
  };

  // Fonction pour obtenir le texte de la tendance
  const getTrendText = () => {
    switch (stats.trend) {
      case 'improving':
        return 'En amélioration';
      case 'declining':
        return 'En diminution';
      default:
        return 'Stable';
    }
  };

  // Calculer les statistiques avancées
  const calculateAdvancedStats = (scans: Scan[]) => {
    if (scans.length === 0) return;

    setTotalScans(scans.length);
    setLastScanDate(scans[0]?.date || null);

    // Calculer le progrès de la semaine
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const thisWeekScans = scans.filter(scan => 
      new Date(scan.date) >= oneWeekAgo
    );
    
    const lastWeekScans = scans.filter(scan => {
      const scanDate = new Date(scan.date);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      return scanDate >= twoWeeksAgo && scanDate < oneWeekAgo;
    });

    if (thisWeekScans.length > 0 && lastWeekScans.length > 0) {
      const thisWeekAvg = thisWeekScans.reduce((sum, scan) => sum + scan.score, 0) / thisWeekScans.length;
      const lastWeekAvg = lastWeekScans.reduce((sum, scan) => sum + scan.score, 0) / lastWeekScans.length;
      setWeeklyProgress(Math.round(((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100));
    }
  };
  
  useEffect(() => {
    // Fetch real scan data
    const fetchScanData = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        
        // Utiliser les services Supabase directs au lieu de l'API Edge Function
        const scansResult = await getRecentScans(user.id, 50); // Plus de données pour de meilleures stats
        const statsResult = await getScansStats(user.id);
        
        if (scansResult.error) {
          throw new Error(scansResult.error.message || 'Failed to fetch scans');
        }
        
        setScanHistory(scansResult.data || []);
        calculateAdvancedStats(scansResult.data || []);
        
        // Mettre à jour les stats avec les vraies données calculées
        setStats({
          averageScore: statsResult.averageScore,
          mostFrequentCenter: statsResult.mostFrequentCenter,
          trend: statsResult.trend,
          categoryScores: statsResult.categoryScores
        });
        
        console.log("Stats calculées:", {
          averageScore: statsResult.averageScore,
          mostFrequentCenter: statsResult.mostFrequentCenter,
          trend: statsResult.trend,
          totalScans: scansResult.data?.length || 0
        });
        
        // Initialiser l'IA conversationnelle pour des insights
        if (user.id && user.hdType) {
          const ai = new ConversationalAI(user.id, user.hdType, user.name || 'utilisatrice');
          await ai.initializeMemory();
          setConversationalAI(ai);
          
          // Générer un insight basé sur l'historique
          const memorySummary = ai.getMemorySummary();
          if (memorySummary && memorySummary.totalConversations > 0) {
            let insight = `Basé sur tes ${memorySummary.totalConversations} explorations récentes, `;
            
            if (memorySummary.averageEnergyLevel > 2.5) {
              insight += "ton énergie semble être dans une belle phase d'expansion ! ✨";
            } else if (memorySummary.averageEnergyLevel < 1.5) {
              insight += "ton énergie traverse une période plus douce. C'est le moment parfait pour la tendresse. 🌙";
            } else {
              insight += "ton énergie trouve son équilibre naturel. Continue à t'écouter ! 🌸";
            }
            
            if (memorySummary.dominantEmotions.length > 0) {
              insight += ` Les thèmes de ${memorySummary.dominantEmotions.slice(0, 2).join(' et ')} semblent importants pour toi en ce moment.`;
            }
            
            setAiInsight(insight);
          }
        }
      } catch (error) {
        console.error('Error fetching scan data:', error);
        showAlertDialog(
          'Erreur de chargement 📊',
          error instanceof Error ? error.message : 'Impossible de charger vos données énergétiques. Veuillez actualiser la page.',
          'warning'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.id) {
      fetchScanData();
    }
  }, [isAuthenticated, user, showAlert, refreshKey]);

  // Rafraîchir les données lorsque l'utilisateur revient sur l'onglet
  useEffect(() => {
    const handleFocus = () => {
      // Rafraîchir les données quand l'utilisateur revient sur l'onglet
      setRefreshKey(prev => prev + 1);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Rafraîchir quand la page redevient visible
        setRefreshKey(prev => prev + 1);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Rafraîchir automatiquement toutes les 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    showAlertDialog(
      'Actualisation en cours... 🔄',
      'Vos données énergétiques sont en cours d\'actualisation.',
      'info'
    );
  };
  
  // Navigation vers la page de scan
  const handleStartScan = () => {
    navigate('/scan', { replace: false });
  };

  // Afficher le dialogue de bienvenue pour les nouveaux utilisateurs
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user?.id}`);
    if (!hasSeenWelcome && user?.id && totalScans === 0) {
      setTimeout(() => {
        setShowWelcomeDialog(true);
        localStorage.setItem(`welcome_seen_${user?.id}`, 'true');
      }, 2000);
    }
  }, [user, totalScans]);

  const subscriptionEndDate = getSubscriptionEndDate();

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          message="Chargement de votre tableau de bord..." 
        />
      </div>
    );
  }

  return ( 
    <div className="min-h-screen py-20 md:py-32 pb-24 md:pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <header className="mb-8">
              <h1 className="font-display text-2xl md:text-4xl mb-3 break-words">
                Bonjour {user?.name || user?.email?.split('@')[0] || 'Utilisatrice'} 🌸
              </h1>
              <p className="text-neutral-dark/70 text-sm md:text-base">
                Voici votre espace personnel pour suivre votre évolution énergétique
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {user?.hdType && (
                  <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-xs md:text-sm">
                    Type HD: {user.hdType}
                  </span>
                )}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm ${
                  isPremium() ? 'bg-warning/10 text-warning' : 'bg-neutral-dark/10 text-neutral-dark/70'
                }`}>
                  {isPremium() && <Crown size={12} className="mr-1" />}
                  {currentPlanName}
                </span>
              </div>
              
              {/* Subscription status for premium users */}
              {isPremium() && subscriptionEndDate && (
                <div className={`mt-3 p-3 rounded-xl ${
                  isSubscriptionCanceled() ? 'bg-warning/10 border border-warning/20' : 'bg-success/10 border border-success/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${isSubscriptionCanceled() ? 'text-warning' : 'text-success'}`}>
                        {isSubscriptionCanceled() ? '⚠️ Abonnement en cours d\'annulation' : '✅ Abonnement actif'}
                      </p>
                      <p className="text-xs text-neutral-dark/70">
                        {isSubscriptionCanceled() 
                          ? `Accès jusqu'au ${subscriptionEndDate.toLocaleDateString('fr-FR')}`
                          : `Renouvellement le ${subscriptionEndDate.toLocaleDateString('fr-FR')}`
                        }
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/premium')}
                      className="text-xs"
                    >
                      Gérer
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Admin access for Christel */}
              {user?.role === 'admin' && (
                <div className="mt-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Shield size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-primary">🌸 Console d'Administration</p>
                        <p className="text-xs text-neutral-dark/70">
                          Gérez votre Baromètre Énergétique
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('/admin')}
                      icon={<Shield size={16} />}
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    >
                      Accéder
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Statistiques rapides */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral/10">
                  <div className="text-xl md:text-2xl font-display text-primary">{totalScans}</div>
                  <div className="text-xs md:text-sm text-neutral-dark/70">Scans</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral/10">
                  <div className="text-xl md:text-2xl font-display text-primary">{stats.averageScore}%</div>
                  <div className="text-xs md:text-sm text-neutral-dark/70">Moyenne</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral/10">
                  <div className={`text-lg font-display ${weeklyProgress >= 0 ? 'text-success' : 'text-warning'}`}>
                    {weeklyProgress >= 0 ? '+' : ''}{weeklyProgress}%
                  </div>
                  <div className="text-xs md:text-sm text-neutral-dark/70">7 jours</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral/10">
                  <div className="text-xl md:text-2xl font-display text-primary">
                    {lastScanDate ? format(new Date(lastScanDate), 'dd/MM', { locale: fr }) : '-'}
                  </div>
                  <div className="text-xs md:text-sm text-neutral-dark/70">Dernier</div>
                </div>
              </div>
            </header>
            
            {/* Insight IA personnalisé */}
            {aiInsight && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">💡 Insight personnalisé d'Aminata</h4>
                    <p className="text-sm text-neutral-dark/80">{aiInsight}</p>
                  </div>
                  <button
                    onClick={() => setAiInsight(null)}
                    className="text-neutral-dark/40 hover:text-neutral-dark/60 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* Accès rapide aux nouvelles fonctionnalités */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 mb-8 border border-primary/10">
              <h3 className="font-display text-xl mb-4 text-primary">🌟 Découvrez vos nouvelles fonctionnalités</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <TrendingUp size={20} className="text-purple-500" />
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-1">Prédictions IA</h4>
                  <p className="text-xs text-neutral-dark/60">Anticipez vos patterns énergétiques</p>
                </button>
                
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Moon size={20} className="text-secondary" />
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-1">Cycles Lunaires</h4>
                  <p className="text-xs text-neutral-dark/60">Synchronisez avec la lune</p>
                </button>
                
                <button
                  onClick={() => navigate('/community')}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Users size={20} className="text-accent" />
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-1">Communauté</h4>
                  <p className="text-xs text-neutral-dark/60">Partagez vos expériences</p>
                </button>
                
                <button
                  onClick={() => navigate('/premium')}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Crown size={20} className="text-warning" />
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-1">{isPremium() ? 'Gérer Premium' : 'Devenir Premium'}</h4>
                  <p className="text-xs text-neutral-dark/60">{isPremium() ? 'Paramètres et facturation' : 'Débloquer toutes les fonctionnalités'}</p>
                </button>
                
                <button
                  onClick={() => navigate('/testimonials')}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MessageCircle size={20} className="text-success" />
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-1">Témoignages</h4>
                  <p className="text-xs text-neutral-dark/60">Partagez votre expérience</p>
                </button>
                
                <button
                  onClick={async () => {
                    const { testOpenAIConnection } = await import('../utils/testOpenAI');
                    const result = await testOpenAIConnection();
                    setTestResult(result);
                    setShowTestDialog(true);
                  }}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Sparkles size={20} className="text-green-500" />
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-1">Test OpenAI</h4>
                  <p className="text-xs text-neutral-dark/60">Vérifier la clé API</p>
                </button>
                
                <button
                  onClick={() => navigate('/scan-conversational')}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MessageCircle size={20} className="text-primary" />
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-1">Scan Conversationnel</h4>
                  <p className="text-xs text-neutral-dark/60">Diagnostic avec Aminata IA</p>
                </button>
                
                <button
                  onClick={() => navigate('/#daily-energy')}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Sparkles size={20} className="text-accent" />
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-1">Tirage du Jour</h4>
                  <p className="text-xs text-neutral-dark/60">Énergie quotidienne</p>
                </button>
                
                <button
                  onClick={() => setActiveTab('reminders')}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Bell size={20} className="text-secondary" />
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-1">Rappels</h4>
                  <p className="text-xs text-neutral-dark/60">Gérer vos rappels</p>
                </button>
                
                <button
                  onClick={() => navigate('/oracle')}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Sparkles size={20} className="text-purple-500" />
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-1">Oracle Énergétique</h4>
                  <p className="text-xs text-neutral-dark/60">Tirage de cartes mystique</p>
                </button>
                
                <button
                  onClick={() => navigate('/testimonials')}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MessageCircle size={20} className="text-success" />
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-1">Témoignages</h4>
                  <p className="text-xs text-neutral-dark/60">Expériences partagées</p>
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 md:gap-4 mb-8">
              <Button 
                variant="primary" 
                onClick={handleStartScan}
                icon={<Sparkles size={18} />}
                className="mobile-button rounded-full"
              >
                <span className="hidden md:inline">Nouveau scan</span>
                <span className="md:hidden">Scanner</span>
              </Button>
              <Button
                variant="outline" 
                onClick={handleRefresh}
                icon={<BarChart size={18} />}
                className="mobile-button rounded-full"
              >
                <span className="hidden md:inline">Actualiser</span>
                <span className="md:hidden">↻</span>
              </Button>
              <Button
                variant="outline" 
                onClick={() => navigate('/scan-details/' + (scanHistory[0]?.id || ''))}
                disabled={!scanHistory[0]?.id}
                icon={<Calendar size={18} />}
                className="mobile-button rounded-full"
              >
                <span className="hidden md:inline">Dernier scan</span>
                <span className="md:hidden">Détails</span>
              </Button>
            </div>
            
            {/* Dashboard Tabs */}
            <div className="flex border-b border-neutral-dark/10 mb-8 overflow-x-auto bg-white rounded-xl p-2 shadow-sm">
              <button 
                className={`px-4 md:px-6 py-3 font-medium whitespace-nowrap rounded-lg transition-colors ${activeTab === 'overview' 
                  ? 'text-white bg-primary' 
                  : 'text-neutral-dark hover:text-primary hover:bg-primary/5'}`}
                onClick={() => setActiveTab('overview')}
              >
                <span className="hidden md:inline">Vue d'ensemble</span>
                <span className="md:hidden">Vue</span>
              </button>
              <button 
                className={`px-4 md:px-6 py-3 font-medium whitespace-nowrap rounded-lg transition-colors ${activeTab === 'history' 
                  ? 'text-white bg-primary' 
                  : 'text-neutral-dark hover:text-primary hover:bg-primary/5'}`}
                onClick={() => setActiveTab('history')}
              >
                Historique
              </button>
              <button 
                className={`px-4 md:px-6 py-3 font-medium whitespace-nowrap rounded-lg transition-colors ${activeTab === 'analytics' 
                  ? 'text-white bg-primary' 
                  : 'text-neutral-dark hover:text-primary hover:bg-primary/5'}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analyses
              </button>
              <button 
                id="reminders"
                className={`px-4 md:px-6 py-3 font-medium whitespace-nowrap rounded-lg transition-colors ${activeTab === 'reminders' 
                  ? 'text-white bg-primary' 
                  : 'text-neutral-dark hover:text-primary hover:bg-primary/5'}`}
                onClick={() => setActiveTab('reminders')}
              >
                Rappels
              </button>
            </div>
            
            {/* Dashboard Content */}
            <div className="mb-8">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Résumé énergétique global */}
                  <div className="lg:col-span-2 mb-4">
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6">
                      <h3 className="font-display text-xl mb-4">📊 Résumé énergétique</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-display text-primary mb-1">{stats.averageScore}%</div>
                          <div className="text-sm text-neutral-dark/70">Score global</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-display text-secondary mb-1">{getTrendText()}</div>
                          <div className="text-sm text-neutral-dark/70">Tendance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-display text-accent mb-1">{totalScans}</div>
                          <div className="text-sm text-neutral-dark/70">Total scans</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-display mb-1 ${weeklyProgress >= 0 ? 'text-success' : 'text-warning'}`}>
                            {weeklyProgress >= 0 ? '+' : ''}{weeklyProgress}%
                          </div>
                          <div className="text-sm text-neutral-dark/70">Évolution 7j</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scores par catégorie - Largeur complète */}
                  <div className="lg:col-span-2 mb-4">
                    <CategoryScores />
                  </div>
                  
                  {/* Scans récents - Largeur complète */}
                  <div className="lg:col-span-2 mb-4">
                    <DashboardCard 
                      title="Scans récents"
                      icon={<Calendar size={20} className="text-primary" />}
                    >
                      <RecentScans limit={5} />
                    </DashboardCard>
                  </div>
                  
                  {/* Mental Category */}
                  <DashboardCard 
                    title="Mental"
                    icon={<Brain size={20} className="text-teal-500" />}
                  >
                    <div className="p-4 bg-teal-500/10 rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-neutral-dark/70">Score moyen</span>
                        <span className="font-medium text-teal-500">{stats.categoryScores.mental?.score || 0}%</span>
                      </div>
                      {stats.categoryScores.mental?.lastScan ? (
                        <div className="text-xs text-neutral-dark/60 text-right">
                          {new Date(stats.categoryScores.mental.lastScan).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-dark/60 text-right">
                          Aucun scan
                        </div>
                      )}
                    </div>
                  </DashboardCard>
                  
                  {/* Digestive Category */}
                  <DashboardCard 
                    title="Digestif"
                    icon={<Utensils size={20} className="text-amber-500" />}
                  >
                    <div className="p-4 bg-amber-500/10 rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-neutral-dark/70">Score moyen</span>
                        <span className="font-medium text-amber-500">{stats.categoryScores.digestive?.score || 0}%</span>
                      </div>
                      {stats.categoryScores.digestive?.lastScan ? (
                        <div className="text-xs text-neutral-dark/60 text-right">
                          {new Date(stats.categoryScores.digestive.lastScan).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-dark/60 text-right">
                          Aucun scan
                        </div>
                      )}
                    </div>
                  </DashboardCard>
                  
                  {/* Somatic Category */}
                  <DashboardCard 
                    title="Somatique"
                    icon={<Hand size={20} className="text-indigo-500" />}
                  >
                    <div className="p-4 bg-indigo-500/10 rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-neutral-dark/70">Score moyen</span>
                        <span className="font-medium text-indigo-500">{stats.categoryScores.somatic?.score || 0}%</span>
                      </div>
                      {stats.categoryScores.somatic?.lastScan ? (
                        <div className="text-xs text-neutral-dark/60 text-right">
                          {new Date(stats.categoryScores.somatic.lastScan).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-dark/60 text-right">
                          Aucun scan
                        </div>
                      )}
                    </div>
                  </DashboardCard>
                  
                  {/* Energetic Category */}
                  <DashboardCard 
                    title="Énergétique"
                    icon={<Zap size={20} className="text-purple-500" />}
                  >
                    <div className="p-4 bg-purple-500/10 rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-neutral-dark/70">Score moyen</span>
                        <span className="font-medium text-purple-500">{stats.categoryScores.energetic?.score || 0}%</span>
                      </div>
                      {stats.categoryScores.energetic?.lastScan ? (
                        <div className="text-xs text-neutral-dark/60 text-right">
                          {new Date(stats.categoryScores.energetic.lastScan).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-dark/60 text-right">
                          Aucun scan
                        </div>
                      )}
                    </div>
                  </DashboardCard>
                  
                  {/* Feminine Cycle Category */}
                  <DashboardCard 
                    title="Cycle Féminin"
                    icon={<Moon size={20} className="text-rose-500" />}
                  >
                    <div className="p-4 bg-rose-500/10 rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-neutral-dark/70">Score moyen</span>
                        <span className="font-medium text-rose-500">{stats.categoryScores.feminine_cycle?.score || 0}%</span>
                      </div>
                      {stats.categoryScores.feminine_cycle?.lastScan ? (
                        <div className="text-xs text-neutral-dark/60 text-right">
                          {new Date(stats.categoryScores.feminine_cycle.lastScan).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-dark/60 text-right">
                          Aucun scan
                        </div>
                      )}
                    </div>
                  </DashboardCard>
                  
                  {/* HD Specific Category */}
                  <DashboardCard 
                    title="Spécifique HD"
                    icon={<User size={20} className="text-blue-500" />}
                  >
                    <div className="p-4 bg-blue-500/10 rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-neutral-dark/70">Score moyen</span>
                        <span className="font-medium text-blue-500">{stats.categoryScores.hd_specific?.score || 0}%</span>
                      </div>
                      {stats.categoryScores.hd_specific?.lastScan ? (
                        <div className="text-xs text-neutral-dark/60 text-right">
                          {new Date(stats.categoryScores.hd_specific.lastScan).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-dark/60 text-right">
                          Aucun scan
                        </div>
                      )}
                    </div>
                  </DashboardCard>
                  
                  {/* Energy Gauge */}
                  <DashboardCard
                    title="État énergétique"
                    icon={<Sparkles size={20} className="text-primary" />}
                  >
                    <div className="flex flex-col items-center">
                      <EnergyGauge
                        score={stats.averageScore} 
                        affectedCenters={getAffectedCenters()}
                      />
                      <div className="text-sm text-neutral-dark/70 text-center mt-4">
                        Tendance : {getTrendText()}
                      </div>
                    </div>
                  </DashboardCard>

                  {/* Tendance énergétique */}
                  <EnergyTrend 
                    trend={stats.trend}
                    averageScore={stats.averageScore}
                  />
                  
                  {/* Recent Scans */}
                  {/* Rappels - Nouveau dans l'aperçu */}
                  <DashboardCard 
                    title="Rappels du jour"
                    icon={<Bell size={20} className="text-accent" />}
                  >
                    <RemindersTab isOverviewMode={true} />
                  </DashboardCard>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="space-y-6">
                  <DashboardCard 
                    title="Évolution énergétique"
                    icon={<BarChart size={20} className="text-primary" />}>
                    <div className="h-80">
                      <ScanHistoryChart scanHistory={scanHistory} />
                    </div>
                  </DashboardCard>
                  
                  <DashboardCard 
                    title="Historique détaillé"
                    icon={<Calendar size={20} className="text-primary" />}
                  >
                    <RecentScans limit={10} />
                  </DashboardCard>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CenterFrequency scans={scanHistory} limit={7} /> 
                  
                  {/* Insights prédictifs */}
                  <div className="lg:col-span-2">
                    <PredictiveInsights scanHistory={scanHistory} />
                  </div>
                  
                  <DashboardCard 
                    title="Statistiques générales"
                    icon={<BarChart size={20} className="text-primary" />}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-dark/70">Total des scans</span>
                        <span className="font-medium text-primary">{scanHistory.length}</span>
                      </div>
                      <div className="flex justify-between items-center"> 
                        <span className="text-neutral-dark/70">Score moyen</span>
                        <span className="font-medium text-primary">{stats.averageScore}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-dark/70">Centre principal</span>
                        <span className="font-medium text-primary capitalize">
                          {stats.mostFrequentCenter} 
                        </span> 
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-dark/70">Tendance</span>
                        <span className={`font-medium ${
                          stats.trend === 'improving' ? 'text-success' :
                          stats.trend === 'declining' ? 'text-error' : 'text-primary'
                        }`}>
                          {getTrendText()}
                        </span>
                      </div>
                    </div>
                  </DashboardCard>

                  {/* Scores par catégorie dans l'onglet Analyses */}
                  <div className="lg:col-span-2">
                    <CategoryScores />
                  </div>
                  
                  {/* Additional Categories in Analytics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <h3 className="font-display text-lg mb-3 flex items-center">
                        <Brain size={18} className="text-teal-500 mr-2" />
                        {t('categories.mental') || "Mental"}
                      </h3>
                      <div className="text-2xl font-display text-teal-500">{stats.categoryScores.mental?.score || 0}%</div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <h3 className="font-display text-lg mb-3 flex items-center">
                        <Utensils size={18} className="text-amber-500 mr-2" />
                        {t('categories.digestive') || "Digestif"}
                      </h3>
                      <div className="text-2xl font-display text-amber-500">{stats.categoryScores.digestive?.score || 0}%</div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <h3 className="font-display text-lg mb-3 flex items-center">
                        <Hand size={18} className="text-indigo-500 mr-2" />
                        {t('categories.somatic') || "Somatique"}
                      </h3>
                      <div className="text-2xl font-display text-indigo-500">{stats.categoryScores.somatic?.score || 0}%</div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <h3 className="font-display text-lg mb-3 flex items-center">
                        <Zap size={18} className="text-purple-500 mr-2" />
                        {t('categories.energetic') || "Énergétique"}
                      </h3>
                      <div className="text-2xl font-display text-purple-500">{stats.categoryScores.energetic?.score || 0}%</div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <h3 className="font-display text-lg mb-3 flex items-center">
                        <Moon size={18} className="text-rose-500 mr-2" />
                        {t('categories.feminine_cycle') || "Cycle Féminin"}
                      </h3>
                      <div className="text-2xl font-display text-rose-500">{stats.categoryScores.feminine_cycle?.score || 0}%</div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <h3 className="font-display text-lg mb-3 flex items-center">
                        <User size={18} className="text-blue-500 mr-2" />
                        {t('categories.hd_specific') || "Spécifique HD"}
                      </h3>
                      <div className="text-2xl font-display text-blue-500">{stats.categoryScores.hd_specific?.score || 0}%</div>
                    </div>
                  </div>
                  
                  {/* Graphique d'évolution sur une période plus longue */}
                  <div className="lg:col-span-2 mt-4">
                    <DashboardCard 
                      title="Évolution à long terme"
                      icon={<BarChart size={20} className="text-primary" />}>
                      <div className="h-80">
                        <ScanHistoryChart scanHistory={scanHistory} />
                      </div>
                    </DashboardCard>
                  </div>
                </div>
              )}
              
              {activeTab === 'reminders' && (
                <RemindersTab />
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Dialogue de bienvenue pour nouveaux utilisateurs */}
      <ConfirmationDialog
        isOpen={showWelcomeDialog}
        onClose={() => setShowWelcomeDialog(false)}
        title="Bienvenue dans votre espace énergétique ! 🌸"
        message={`Bonjour ${user?.name || 'ma belle'} ! Votre compte a été créé avec succès. Vous êtes maintenant prête à explorer votre énergie unique avec le Baromètre Énergétique. Commençons par votre premier scan ?`}
        type="success"
        showActions={true}
        onConfirm={() => {
          setShowWelcomeDialog(false);
          handleStartScan();
        }}
        confirmText="Faire mon premier scan ✨"
        cancelText="Explorer d'abord"
      />
      
      {/* Dialogue de test OpenAI */}
      <ConfirmationDialog
        isOpen={showTestDialog}
        onClose={() => setShowTestDialog(false)}
        title={testResult?.success ? "Test OpenAI réussi ! ✅" : "Test OpenAI échoué ❌"}
        message={testResult?.message || 'Test en cours...'}
        type={testResult?.success ? "success" : "warning"}
        showActions={false}
      />
    </div>
  );
};

export default Dashboard;