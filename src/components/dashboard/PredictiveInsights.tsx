import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Lightbulb, AlertTriangle, Sparkles, Moon } from 'lucide-react';
import { PredictiveAnalytics, EnergyForecast, PredictiveInsight } from '../../services/predictiveAnalytics';
import { LunarCalendar, LunarInsight } from '../../services/lunarCalendar';
import { useAuthStore } from '../../store/authStore';
import { getRecentScans } from '../../services/scanService';

interface PredictiveInsightsProps {
  scanHistory: any[];
}

const PredictiveInsights = ({ scanHistory }: PredictiveInsightsProps) => {
  const { user } = useAuthStore();
  const [forecast, setForecast] = useState<EnergyForecast | null>(null);
  const [lunarInsight, setLunarInsight] = useState<LunarInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, [scanHistory, user]);

  const generateInsights = async () => {
    if (!user?.id || scanHistory.length < 3) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Générer les prédictions énergétiques
      const analytics = new PredictiveAnalytics(user.id, user.hdType || 'generator');
      const energyForecast = await analytics.generateWeeklyForecast(scanHistory);
      setForecast(energyForecast);

      // Générer les insights lunaires
      const lunarCalendar = new LunarCalendar(user.hdType || 'generator', user.name || 'ma belle');
      const currentScore = scanHistory[0]?.score || 50;
      const lunarInsights = lunarCalendar.generateLunarInsights(currentScore, scanHistory.slice(0, 7));
      setLunarInsight(lunarInsights);

    } catch (error) {
      console.error('Error generating predictive insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'energy_dip': return <AlertTriangle size={20} className="text-warning" />;
      case 'energy_peak': return <TrendingUp size={20} className="text-success" />;
      case 'center_activation': return <Sparkles size={20} className="text-primary" />;
      case 'cycle_pattern': return <Calendar size={20} className="text-secondary" />;
      default: return <Lightbulb size={20} className="text-accent" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.7) return 'text-success';
    if (confidence > 0.4) return 'text-warning';
    return 'text-neutral-dark/60';
  };

  const getAlignmentColor = (alignment: string) => {
    switch (alignment) {
      case 'aligned': return 'text-success';
      case 'challenging': return 'text-warning';
      default: return 'text-primary';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="text-center py-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-neutral-dark/70">Génération des insights prédictifs...</p>
        </div>
      </div>
    );
  }

  if (scanHistory.length < 3) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-display text-lg mb-4 flex items-center">
          <Lightbulb size={20} className="text-primary mr-2" />
          Insights Prédictifs
        </h3>
        <div className="text-center py-6">
          <Calendar size={48} className="mx-auto text-neutral-dark/30 mb-4" />
          <p className="text-neutral-dark/70 mb-2">Pas encore assez de données</p>
          <p className="text-sm text-neutral-dark/50">
            Effectuez au moins 3 scans pour débloquer les prédictions énergétiques
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Prévisions énergétiques */}
      {forecast && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-display text-lg mb-4 flex items-center">
            <TrendingUp size={20} className="text-primary mr-2" />
            Prévisions Énergétiques
          </h3>

          {/* Résumé de la semaine prochaine */}
          <div className="bg-primary/5 rounded-xl p-4 mb-6">
            <h4 className="font-medium text-primary mb-3">📅 Semaine Prochaine</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-display text-primary">{forecast.nextWeek.expectedScore}%</div>
                <div className="text-sm text-neutral-dark/70">Score attendu</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-display text-warning">{forecast.nextWeek.riskDays.length}</div>
                <div className="text-sm text-neutral-dark/70">Jours à surveiller</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-display text-success">{forecast.nextWeek.opportunityDays.length}</div>
                <div className="text-sm text-neutral-dark/70">Jours d'opportunité</div>
              </div>
            </div>

            {(forecast.nextWeek.riskDays.length > 0 || forecast.nextWeek.opportunityDays.length > 0) && (
              <div className="mt-4 space-y-2">
                {forecast.nextWeek.riskDays.length > 0 && (
                  <p className="text-sm">
                    <span className="text-warning font-medium">⚠️ Attention :</span> {forecast.nextWeek.riskDays.join(', ')}
                  </p>
                )}
                {forecast.nextWeek.opportunityDays.length > 0 && (
                  <p className="text-sm">
                    <span className="text-success font-medium">✨ Opportunités :</span> {forecast.nextWeek.opportunityDays.join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Insights prédictifs */}
          {forecast.insights.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-dark">🔮 Prédictions Intelligentes</h4>
              {forecast.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-4 bg-neutral rounded-xl"
                >
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-neutral-dark">{insight.prediction}</p>
                      <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {Math.round(insight.confidence * 100)}% confiance
                      </span>
                    </div>
                    <p className="text-sm text-neutral-dark/70 mb-2">{insight.timeframe}</p>
                    <div className="space-y-1">
                      {insight.recommendations.map((rec, recIndex) => (
                        <p key={recIndex} className="text-xs text-neutral-dark/60">
                          • {rec}
                        </p>
                      ))}
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
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-display text-lg mb-4 flex items-center">
            <Moon size={20} className="text-secondary mr-2" />
            Guidance Lunaire
          </h3>

          <div className="bg-secondary/5 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{lunarInsight.currentPhase.emoji}</span>
                <div>
                  <h4 className="font-medium text-secondary">{lunarInsight.currentPhase.displayName}</h4>
                  <p className="text-sm text-neutral-dark/70">{lunarInsight.currentPhase.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${getAlignmentColor(lunarInsight.energyAlignment)}`}>
                  {lunarInsight.energyAlignment === 'aligned' && '✨ Alignée'}
                  {lunarInsight.energyAlignment === 'neutral' && '🌸 Neutre'}
                  {lunarInsight.energyAlignment === 'challenging' && '🌊 En transition'}
                </div>
                <div className="text-xs text-neutral-dark/60">
                  Jour {lunarInsight.daysInPhase} de la phase
                </div>
              </div>
            </div>

            <p className="text-sm text-neutral-dark/80 italic mb-3">
              {lunarInsight.personalizedMessage}
            </p>

            <div className="space-y-2">
              <h5 className="text-sm font-medium text-secondary">Recommandations lunaires :</h5>
              {lunarInsight.recommendations.slice(0, 3).map((rec, index) => (
                <p key={index} className="text-xs text-neutral-dark/70">
                  • {rec}
                </p>
              ))}
            </div>
          </div>

          {/* Prochaine phase */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-dark/70">Prochaine phase :</span>
            <div className="flex items-center space-x-2">
              <span>{lunarInsight.nextPhase.emoji}</span>
              <span className="font-medium">{lunarInsight.nextPhase.displayName}</span>
              <span className="text-neutral-dark/60">dans {lunarInsight.daysToNextPhase} jour{lunarInsight.daysToNextPhase > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recommandations spéciales pour Reflectors */}
      {user?.hdType === 'reflector' && lunarInsight && (
        <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-6 border border-secondary/20">
          <h3 className="font-display text-lg mb-4 flex items-center">
            🌙 Guidance Spéciale Reflector
          </h3>
          <div className="space-y-3">
            {new LunarCalendar(user.hdType, user.name || 'ma belle')
              .generateReflectorGuidance(lunarInsight)
              .map((guidance, index) => (
                <p key={index} className="text-sm text-neutral-dark/80">
                  • {guidance}
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveInsights;