import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Lightbulb, AlertTriangle, Sparkles, Moon, ArrowLeft, Brain, Heart, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import { getRecentScans } from '../../services/scanService';
import { PredictiveAnalytics as PredictiveService, EnergyForecast } from '../../services/predictiveAnalytics';
import { LunarCalendar, LunarInsight } from '../../services/lunarCalendar';

const PredictiveAnalyticsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showAlertDialog } = useAlertStore();
  const [forecast, setForecast] = useState<EnergyForecast | null>(null);
  const [lunarInsight, setLunarInsight] = useState<LunarInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scanHistory, setScanHistory] = useState<any[]>([]);

  useEffect(() => {
    loadPredictiveData();
  }, [user]);

  const loadPredictiveData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      // Charger l'historique des scans
      const { data: scans, error } = await getRecentScans(user.id, 30);
      if (error) throw error;
      
      setScanHistory(scans || []);

      if (scans && scans.length >= 3) {
        // Générer les prédictions énergétiques
        const analytics = new PredictiveService(user.id, user.hdType || 'generator');
        const energyForecast = await analytics.generateWeeklyForecast(scans);
        setForecast(energyForecast);

        // Générer les insights lunaires
        const lunarCalendar = new LunarCalendar(user.hdType || 'generator', user.name || 'ma belle');
        const currentScore = scans[0]?.score || 50;
        const lunarInsights = lunarCalendar.generateLunarInsights(currentScore, scans.slice(0, 7));
        setLunarInsight(lunarInsights);
      }
    } catch (error) {
      console.error('Error loading predictive data:', error);
      showAlertDialog(
        'Erreur de chargement 📊',
        'Impossible de charger les données prédictives. Veuillez réessayer.',
        'warning'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="font-display text-xl text-primary mb-2">Analyse prédictive en cours...</h2>
          <p className="text-neutral-dark/70">Génération de vos insights énergétiques</p>
        </div>
      </div>
    );
  }

  if (scanHistory.length < 3) {
    return (
      <div className="min-h-screen py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              icon={<ArrowLeft size={18} />}
              className="mb-8"
            >
              Retour au tableau de bord
            </Button>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral/10">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp size={40} className="text-primary" />
              </div>
              <h2 className="font-display text-3xl text-primary mb-4">
                📈 Prédictions IA
              </h2>
              <p className="text-lg text-neutral-dark/80 mb-6">
                Anticipez vos patterns énergétiques grâce à l'intelligence artificielle
              </p>
              <div className="bg-warning/10 rounded-xl p-6 border border-warning/20 mb-6">
                <h3 className="font-medium text-warning mb-2">Données insuffisantes</h3>
                <p className="text-neutral-dark/70">
                  Effectuez au moins 3 scans énergétiques pour débloquer les prédictions IA personnalisées.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => navigate('/scan')}
                icon={<Sparkles size={18} />}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                Faire un scan énergétique
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                icon={<ArrowLeft size={18} />}
                className="mb-4"
              >
                Retour au tableau de bord
              </Button>
              <h1 className="font-display text-4xl text-primary mb-2">
                📈 Prédictions IA
              </h1>
              <p className="text-lg text-neutral-dark/80">
                Anticipez vos patterns énergétiques avec l'intelligence artificielle
              </p>
            </div>
          </div>

          {/* Prévisions énergétiques */}
          {forecast && (
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 border border-neutral/10">
              <h2 className="font-display text-2xl mb-6 flex items-center">
                <TrendingUp size={24} className="text-primary mr-3" />
                Prévisions Énergétiques
              </h2>

              {/* Résumé de la semaine prochaine */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 mb-6 border border-primary/20">
                <h3 className="font-display text-xl text-primary mb-4">📅 Semaine Prochaine</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-display text-primary mb-2">{forecast.nextWeek.expectedScore}%</div>
                    <div className="text-neutral-dark/70">Score attendu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-display text-warning mb-2">{forecast.nextWeek.riskDays.length}</div>
                    <div className="text-neutral-dark/70">Jours à surveiller</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-display text-success mb-2">{forecast.nextWeek.opportunityDays.length}</div>
                    <div className="text-neutral-dark/70">Jours d'opportunité</div>
                  </div>
                </div>

                {(forecast.nextWeek.riskDays.length > 0 || forecast.nextWeek.opportunityDays.length > 0) && (
                  <div className="mt-6 space-y-3">
                    {forecast.nextWeek.riskDays.length > 0 && (
                      <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
                        <p className="font-medium text-warning mb-2">⚠️ Jours à surveiller :</p>
                        <p className="text-neutral-dark/80">{forecast.nextWeek.riskDays.join(', ')}</p>
                        <p className="text-sm text-neutral-dark/60 mt-2">
                          Prévoyez des activités douces et du temps de repos ces jours-là.
                        </p>
                      </div>
                    )}
                    {forecast.nextWeek.opportunityDays.length > 0 && (
                      <div className="bg-success/10 rounded-lg p-4 border border-success/20">
                        <p className="font-medium text-success mb-2">✨ Jours d'opportunité :</p>
                        <p className="text-neutral-dark/80">{forecast.nextWeek.opportunityDays.join(', ')}</p>
                        <p className="text-sm text-neutral-dark/60 mt-2">
                          Parfait pour vos projets importants et vos initiatives créatives.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Insights prédictifs */}
              {forecast.insights.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl text-neutral-dark">🔮 Prédictions Intelligentes</h3>
                  {forecast.insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-neutral/20 rounded-xl p-6 border border-neutral/10"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          {insight.type === 'energy_dip' && <AlertTriangle size={20} className="text-warning" />}
                          {insight.type === 'energy_peak' && <TrendingUp size={20} className="text-success" />}
                          {insight.type === 'center_activation' && <Sparkles size={20} className="text-primary" />}
                          {insight.type === 'cycle_pattern' && <Calendar size={20} className="text-secondary" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-neutral-dark">{insight.prediction}</h4>
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                              {Math.round(insight.confidence * 100)}% confiance
                            </span>
                          </div>
                          <p className="text-sm text-neutral-dark/70 mb-3">{insight.timeframe}</p>
                          <div className="space-y-2">
                            {insight.recommendations.map((rec, recIndex) => (
                              <p key={recIndex} className="text-sm text-neutral-dark/80 flex items-start">
                                <span className="text-primary mr-2">•</span>
                                {rec}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Insights lunaires */}
          {lunarInsight && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral/10">
              <h2 className="font-display text-2xl mb-6 flex items-center">
                <Moon size={24} className="text-secondary mr-3" />
                Cycles Lunaires
              </h2>

              <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-6 border border-secondary/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{lunarInsight.currentPhase.emoji}</span>
                    <div>
                      <h3 className="font-display text-xl text-secondary">{lunarInsight.currentPhase.displayName}</h3>
                      <p className="text-neutral-dark/70">{lunarInsight.currentPhase.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      lunarInsight.energyAlignment === 'aligned' ? 'text-success' :
                      lunarInsight.energyAlignment === 'challenging' ? 'text-warning' : 'text-primary'
                    }`}>
                      {lunarInsight.energyAlignment === 'aligned' && '✨ Parfaitement alignée'}
                      {lunarInsight.energyAlignment === 'challenging' && '🌊 En transition'}
                      {lunarInsight.energyAlignment === 'neutral' && '🌸 Équilibre neutre'}
                    </div>
                    <div className="text-xs text-neutral-dark/60">
                      Jour {lunarInsight.daysInPhase} de la phase
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 rounded-lg p-4 mb-4">
                  <p className="text-neutral-dark/90 italic font-medium">
                    {lunarInsight.personalizedMessage}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-secondary">🌙 Recommandations lunaires :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lunarInsight.recommendations.map((rec, index) => (
                      <div key={index} className="bg-white/30 rounded-lg p-3">
                        <p className="text-sm text-neutral-dark/80">• {rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prochaine phase */}
                <div className="mt-6 pt-4 border-t border-secondary/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-dark/70">Prochaine phase :</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{lunarInsight.nextPhase.emoji}</span>
                      <span className="font-medium text-secondary">{lunarInsight.nextPhase.displayName}</span>
                      <span className="text-neutral-dark/60">dans {lunarInsight.daysToNextPhase} jour{lunarInsight.daysToNextPhase > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Call to action */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
              <h3 className="font-display text-2xl mb-4 text-primary">
                🔮 Continuez à nourrir vos prédictions
              </h3>
              <p className="text-neutral-dark/80 mb-6 max-w-2xl mx-auto">
                Plus vous effectuez de scans réguliers, plus nos prédictions IA deviennent précises et personnalisées.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  onClick={() => navigate('/scan')}
                  icon={<Sparkles size={18} />}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Nouveau scan énergétique
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  icon={<TrendingUp size={18} />}
                >
                  Voir mes tendances
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsPage;