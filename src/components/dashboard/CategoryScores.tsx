import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Activity, Brain, Utensils, Hand, Zap, Moon, User } from 'lucide-react';
import { getScansStats } from '../../services/scanService';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../context/LanguageContext';
import { useAlertStore } from '../../store/alertStore';

const CategoryScores = () => {
  const [categoryScores, setCategoryScores] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { showAlert } = useAlertStore();

  useEffect(() => {
    const fetchCategoryScores = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        // Utiliser getScansStats qui calcule les vraies moyennes
        const stats = await getScansStats(user.id);
        setCategoryScores(stats.categoryScores);
      } catch (error) {
        console.error('Error fetching category scores:', error);
        showAlert('Erreur lors du chargement des scores par catégorie', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryScores();
  }, [user, showAlert]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-success text-white';
    if (score >= 60) return 'bg-primary text-white';
    if (score >= 40) return 'bg-accent text-neutral-dark';
    if (score >= 20) return 'bg-warning text-neutral-dark';
    return 'bg-error text-white';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    if (score >= 20) return 'Faible';
    return 'Très faible';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-primary';
    if (score >= 40) return 'bg-accent';
    if (score >= 20) return 'bg-warning';
    return 'bg-error';
  };

  const categories = [
    { 
      id: 'general',
      name: 'État Général',
      icon: Sparkles,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      data: categoryScores?.general
    },
    {
      id: 'emotional',
      name: 'État Émotionnel',
      icon: Heart,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      data: categoryScores?.emotional
    },
    {
      id: 'physical',
      name: 'État Physique',
      icon: Activity,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      data: categoryScores?.physical
    },
    {
      id: 'mental',
      name: 'État Mental',
      icon: Brain,
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
      data: categoryScores?.mental
    },
    {
      id: 'digestive',
      name: 'État Digestif',
      icon: Utensils,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      data: categoryScores?.digestive
    },
    {
      id: 'somatic',
      name: 'État Somatique',
      icon: Hand,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      data: categoryScores?.somatic
    },
    {
      id: 'energetic',
      name: 'État Énergétique',
      icon: Zap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      data: categoryScores?.energetic
    },
    {
      id: 'feminine_cycle',
      name: 'Cycle Féminin',
      icon: Moon,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      data: categoryScores?.feminine_cycle
    },
    {
      id: 'hd_specific',
      name: 'Design Spécifique',
      icon: User,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      data: categoryScores?.hd_specific
    }
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
        <h3 className="font-display text-lg mb-4">Résultats par dimension</h3>
        <div className="text-center text-neutral-dark/70 py-4">
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-display text-lg mb-6">Résultats par dimension</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => {
          const score = category.data?.score || 0;
          const lastScan = category.data?.lastScan;
          const Icon = category.icon;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${category.bgColor} rounded-xl p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full ${category.bgColor} flex items-center justify-center mr-3`}>
                    <Icon size={20} className={category.color} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-dark break-words">{category.name}</h4>
                    <p className="text-xs text-neutral-dark/60">
                      {lastScan 
                        ? new Date(lastScan).toLocaleDateString(undefined, { 
                            day: 'numeric', 
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Aucun scan'
                      }
                    </p>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(score)}`}>
                  {score > 0 ? `${score}%` : '-'}
                </div>
              </div>

              {score > 0 && (
                <>
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1 min-w-0">
                      <span className="text-sm text-neutral-dark/70">Statut</span>
                      <span className="text-sm font-medium break-words">{getScoreStatus(score)}</span>
                    </div>
                    <div className="w-full bg-neutral-dark/10 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${getProgressColor(score)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                </>
              )}

              {score === 0 && (
                <div className="text-center py-2">
                  <p className="text-sm text-neutral-dark/60">
                    Aucune donnée disponible
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryScores;