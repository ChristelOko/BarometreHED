import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Calendar, Sparkles, ArrowLeft, Sun, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import { LunarCalendar, LunarInsight } from '../../services/lunarCalendar';
import { getRecentScans } from '../../services/scanService';

const LunarCyclesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showAlertDialog } = useAlertStore();
  const [lunarInsight, setLunarInsight] = useState<LunarInsight | null>(null);
  const [weeklyForecast, setWeeklyForecast] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLunarData();
  }, [user]);

  const loadLunarData = async () => {
    if (!user?.id || !user?.hdType) return;

    try {
      setIsLoading(true);
      
      const lunarCalendar = new LunarCalendar(user.hdType, user.name || 'ma belle');
      
      // Charger les scans récents pour l'analyse
      const { data: scans } = await getRecentScans(user.id, 7);
      const currentScore = scans?.[0]?.score || 50;
      
      // Générer les insights lunaires
      const insights = lunarCalendar.generateLunarInsights(currentScore, scans || []);
      setLunarInsight(insights);
      
      // Générer les prévisions hebdomadaires
      const forecast = lunarCalendar.getWeeklyLunarForecast();
      setWeeklyForecast(forecast);
      
    } catch (error) {
      console.error('Error loading lunar data:', error);
      showAlertDialog(
        'Erreur lunaire 🌙',
        'Impossible de charger les données lunaires. Veuillez réessayer.',
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
          <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="font-display text-xl text-secondary mb-2">Synchronisation lunaire...</h2>
          <p className="text-neutral-dark/70">Connexion aux cycles cosmiques</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32 bg-gradient-to-br from-neutral via-secondary/5 to-accent/5">
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
                className="mb-4 bg-white/90 backdrop-blur-sm"
              >
                Retour au tableau de bord
              </Button>
              <h1 className="font-display text-4xl text-secondary mb-2">
                🌙 Cycles Lunaires
              </h1>
              <p className="text-lg text-neutral-dark/80">
                Synchronisez votre énergie avec les rythmes cosmiques
              </p>
            </div>
          </div>

          {/* Phase lunaire actuelle */}
          {lunarInsight && (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8 border border-secondary/20">
              <h2 className="font-display text-2xl mb-6 text-center text-secondary">
                Phase Lunaire Actuelle
              </h2>
              
              <div className="text-center mb-8">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity }
                  }}
                  className="text-8xl mb-4"
                >
                  {lunarInsight.currentPhase.emoji}
                </motion.div>
                <h3 className="font-display text-3xl text-secondary mb-2">
                  {lunarInsight.currentPhase.displayName}
                </h3>
                <p className="text-lg text-neutral-dark/80 mb-4">
                  {lunarInsight.currentPhase.description}
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-secondary/10 text-secondary rounded-full">
                  Jour {lunarInsight.daysInPhase} de la phase • {lunarInsight.daysToNextPhase} jours jusqu'à la suivante
                </div>
              </div>

              {/* Message personnalisé */}
              <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-6 mb-6 border border-secondary/20">
                <h4 className="font-medium text-secondary mb-3">💫 Message personnalisé pour vous :</h4>
                <p className="text-neutral-dark/90 italic text-lg leading-relaxed">
                  {lunarInsight.personalizedMessage}
                </p>
              </div>

              {/* Alignement énergétique */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    lunarInsight.energyAlignment === 'aligned' ? 'bg-success/20' :
                    lunarInsight.energyAlignment === 'challenging' ? 'bg-warning/20' : 'bg-primary/20'
                  }`}>
                    {lunarInsight.energyAlignment === 'aligned' && <Sparkles size={24} className="text-success" />}
                    {lunarInsight.energyAlignment === 'challenging' && <Moon size={24} className="text-warning" />}
                    {lunarInsight.energyAlignment === 'neutral' && <Star size={24} className="text-primary" />}
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-1">Alignement</h4>
                  <p className="text-sm text-neutral-dark/70">
                    {lunarInsight.energyAlignment === 'aligned' && 'Parfaitement synchronisée'}
                    {lunarInsight.energyAlignment === 'challenging' && 'En transition'}
                    {lunarInsight.energyAlignment === 'neutral' && 'Équilibre naturel'}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar size={24} className="text-secondary" />
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-1">Énergie</h4>
                  <p className="text-sm text-neutral-dark/70 capitalize">
                    {lunarInsight.currentPhase.energy === 'introspective' && 'Introspective'}
                    {lunarInsight.currentPhase.energy === 'growing' && 'Croissante'}
                    {lunarInsight.currentPhase.energy === 'active' && 'Active'}
                    {lunarInsight.currentPhase.energy === 'releasing' && 'Libératrice'}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sun size={24} className="text-accent" />
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-1">Prochaine phase</h4>
                  <p className="text-sm text-neutral-dark/70">
                    {lunarInsight.nextPhase.displayName}
                  </p>
                </div>
              </div>

              {/* Recommandations */}
              <div className="bg-neutral/20 rounded-xl p-6">
                <h4 className="font-medium text-secondary mb-4">🌟 Recommandations pour cette phase :</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lunarInsight.recommendations.map((rec, index) => (
                    <div key={index} className="bg-white/50 rounded-lg p-4">
                      <p className="text-sm text-neutral-dark/80">• {rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Prévisions hebdomadaires */}
          {weeklyForecast.length > 0 && (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-accent/20">
              <h2 className="font-display text-2xl mb-6 flex items-center">
                <Calendar size={24} className="text-accent mr-3" />
                Prévisions de la Semaine
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {weeklyForecast.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-accent/10 to-secondary/10 rounded-xl p-4 text-center border border-accent/20"
                  >
                    <div className="text-3xl mb-2">{day.phase.emoji}</div>
                    <h4 className="font-medium text-neutral-dark mb-2">{day.date}</h4>
                    <p className="text-xs text-neutral-dark/70 mb-3">{day.energy}</p>
                    <div className="space-y-1">
                      {day.recommendations.slice(0, 2).map((rec, recIndex) => (
                        <p key={recIndex} className="text-xs text-neutral-dark/60">
                          • {rec}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Guidance spéciale pour Reflectors */}
          {user?.hdType === 'reflector' && lunarInsight && (
            <div className="bg-gradient-to-r from-secondary/20 to-accent/20 rounded-2xl p-8 border border-secondary/30 mt-8">
              <h2 className="font-display text-2xl mb-6 text-secondary text-center">
                🌙 Guidance Spéciale Reflector
              </h2>
              <div className="space-y-4">
                {new LunarCalendar(user.hdType, user.name || 'ma belle')
                  .generateReflectorGuidance(lunarInsight)
                  .map((guidance, index) => (
                    <div key={index} className="bg-white/30 rounded-lg p-4">
                      <p className="text-neutral-dark/90">• {guidance}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Call to action */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl p-8 border border-secondary/20">
              <h3 className="font-display text-2xl mb-4 text-secondary">
                🌙 Vivez en harmonie avec la lune
              </h3>
              <p className="text-neutral-dark/80 mb-6 max-w-2xl mx-auto">
                Intégrez les cycles lunaires dans votre quotidien pour une vie plus alignée et naturelle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  onClick={() => navigate('/scan')}
                  icon={<Moon size={18} />}
                  className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90"
                >
                  Scanner mon énergie lunaire
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  icon={<Calendar size={18} />}
                >
                  Retour au tableau de bord
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LunarCyclesPage;