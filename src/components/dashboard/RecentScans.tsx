import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getRecentScans, getScansStats, type Scan } from '../../services/scanService'; 
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import { useTranslation } from '../../context/LanguageContext';
import { Eye, TrendingUp, TrendingDown, Minus, Calendar, Target } from 'lucide-react';

interface RecentScansProps {
  limit?: number;
}

const RecentScans = ({ limit = 3 }: RecentScansProps) => {
  const navigate = useNavigate();
  const [scans, setScans] = useState<Scan[]>([]);
  const [stats, setStats] = useState({
    averageScore: 0,
    mostFrequentCenter: '',
    trend: 'improving' | 'stable' | 'declining'
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { showAlert } = useAlertStore();

  // Initialiser les stats
  useEffect(() => {
    setStats({
    averageScore: 0,
    mostFrequentCenter: 'g-center',
    trend: 'stable'
    });
  }, []);

  const handleScanClick = (scanId: string) => {
    navigate(`/scan-details/${scanId}`);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return; 

      try {
        setIsLoading(true);
        const [scansResult, statsResult] = await Promise.all([
          getRecentScans(user.id, limit),
          getScansStats(user.id)
        ]);

        if (scansResult.error) throw scansResult.error;
        setScans(scansResult.data || []); 
        
        // Extraire les stats correctement
        setStats({
          averageScore: statsResult.averageScore,
          mostFrequentCenter: statsResult.mostFrequentCenter,
          trend: statsResult.trend
        });
      } catch (error) {
        console.error('Error fetching scan data:', error);
        showAlert('Erreur lors du chargement des données', 'error');
      } finally {
        setIsLoading(false);
      }
    }; 

    fetchData();
  }, [user, limit, showAlert]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-br from-success to-success/80 text-white shadow-lg';
    if (score >= 60) return 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg';
    if (score >= 40) return 'bg-gradient-to-br from-accent to-accent/80 text-neutral-dark shadow-lg';
    if (score >= 20) return 'bg-gradient-to-br from-warning to-warning/80 text-neutral-dark shadow-lg';
    return 'bg-gradient-to-br from-error to-error/80 text-white shadow-lg';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return '✨';
    if (score >= 60) return '🌸';
    if (score >= 40) return '🌊';
    if (score >= 20) return '🍃';
    return '🌙';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Florissante';
    if (score >= 60) return 'Équilibrée';
    if (score >= 40) return 'Fluctuante';
    if (score >= 20) return 'En demande';
    return 'En repos';
  };

  const getCenterDisplayName = (center: string) => {
    const centerNames: Record<string, string> = {
      'throat': 'Gorge',
      'heart': 'Cœur',
      'solar-plexus': 'Plexus Solaire',
      'sacral': 'Sacral',
      'root': 'Racine',
      'spleen': 'Rate',
      'g-center': 'G-Center',
      'ajna': 'Ajna',
      'head': 'Tête'
    };
    return centerNames[center] || center;
  };

  const getCenterColor = (center: string) => {
    const centerColors: Record<string, string> = {
      'throat': 'text-blue-500',
      'heart': 'text-red-500',
      'solar-plexus': 'text-yellow-600',
      'sacral': 'text-orange-500',
      'root': 'text-red-800',
      'spleen': 'text-indigo-500',
      'g-center': 'text-green-500',
      'ajna': 'text-teal-500',
      'head': 'text-purple-500'
    };
    return centerColors[center] || 'text-neutral-dark';
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      'emotional': 'bg-secondary/10 text-secondary border-secondary/20',
      'physical': 'bg-accent/10 text-accent border-accent/20',
      'mental': 'bg-teal-500/10 text-teal-500 border-teal-500/20',
      'digestive': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      'somatic': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      'energetic': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'feminine_cycle': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      'hd_specific': 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    };
    return categoryColors[category] || 'bg-primary/10 text-primary border-primary/20';
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryNames: Record<string, string> = {
      'emotional': 'Émotionnel',
      'physical': 'Physique',
      'mental': 'Mental',
      'digestive': 'Digestif',
      'somatic': 'Somatique',
      'energetic': 'Énergétique',
      'feminine_cycle': 'Cycle Féminin',
      'hd_specific': 'Spécifique HD'
    };
    return categoryNames[category] || 'Général';
  };
  if (isLoading) { 
    return (
      <div className="text-center text-neutral-dark/70 py-4">
        Chargement...
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="text-center text-neutral-dark/70 py-4"> 
        Aucun scan disponible
      </div>
    );
  }
  
  return (
    <div>
      {limit <= 3 && (
        <div className="mb-6 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl text-primary">
              {stats.averageScore >= 80 && '✨ Énergie florissante'}
              {stats.averageScore >= 60 && stats.averageScore < 80 && '🌸 Énergie équilibrée'}
              {stats.averageScore >= 40 && stats.averageScore < 60 && '🌊 Énergie fluctuante'}
              {stats.averageScore >= 20 && stats.averageScore < 40 && '🍃 Énergie en demande'}
              {stats.averageScore < 20 && '🌙 Énergie en repos'}
            </h3>
            <div className="flex items-center text-sm text-neutral-dark/70">
              <Calendar size={14} className="mr-1" />
              {scans.length} scan{scans.length > 1 ? 's' : ''}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <div className={`w-12 h-12 rounded-full ${getScoreColor(stats.averageScore)} flex items-center justify-center text-lg font-bold`}>
                  {stats.averageScore}
                </div>
              </div>
              <div className="text-sm font-medium text-neutral-dark">Score moyen</div>
              <div className="text-xs text-neutral-dark/60">{getScoreLabel(stats.averageScore)}</div>
            </div>
            <div> 
              <div className="flex items-center justify-center mb-2">
                <Target size={24} className={getCenterColor(stats.mostFrequentCenter)} />
              </div>
              <div className="text-sm font-medium text-neutral-dark">
                {getCenterDisplayName(stats.mostFrequentCenter)}
              </div>
              <div className="text-xs text-neutral-dark/60">Centre principal</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                {stats.trend === 'improving' && <TrendingUp size={24} className="text-success" />}
                {stats.trend === 'stable' && <Minus size={24} className="text-primary" />}
                {stats.trend === 'declining' && <TrendingDown size={24} className="text-warning" />}
              </div>
              <div className="text-sm font-medium text-neutral-dark">
                {stats.trend === 'improving' && 'En amélioration'}
                {stats.trend === 'stable' && 'Stable'}
                {stats.trend === 'declining' && 'En diminution'}
              </div> 
              <div className="text-xs text-neutral-dark/60">Tendance</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {scans.map((scan) => (
          <div 
            key={scan.id} 
            className="flex items-center p-4 rounded-xl bg-white hover:bg-neutral/50 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md border border-neutral/10"
            onClick={() => handleScanClick(scan.id)}
          >
            <div className={`w-16 h-16 rounded-full ${getScoreColor(scan.score)} flex flex-col items-center justify-center mr-4 relative`}>
              <span className="text-lg font-bold">{scan.score}</span>
              <span className="text-xs opacity-80">{getScoreIcon(scan.score)}</span>
            </div>
             
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-medium text-lg ${getCenterColor(scan.center)}`}>
                  {getCenterDisplayName(scan.center)}
                </span>
                {scan.category && scan.category !== 'general' && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(scan.category)}`}>
                    {getCategoryDisplayName(scan.category)}
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm text-neutral-dark/70 mb-1">
                <Calendar size={14} className="mr-1" />
                {format(parseISO(scan.date), 'EEEE dd MMMM yyyy', { locale: fr })}
              </div>
              <div className="flex items-center text-xs text-neutral-dark/60">
                <span className="mr-2">Score: {scan.score}% • {getScoreLabel(scan.score)}</span>
                {scan.selected_feelings && scan.selected_feelings.length > 0 && (
                  <span>{scan.selected_feelings.length} ressenti{scan.selected_feelings.length > 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Indicateur de tendance si on a plusieurs scans */}
              {scans.length > 1 && (
                <div className="text-xs text-neutral-dark/50">
                  {scans.indexOf(scan) === 0 && '🆕'}
                </div>
              )}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 rounded-full p-2">
                <Eye size={16} className="text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Résumé en bas si plus de 3 scans */}
      {limit > 3 && scans.length > 0 && (
        <div className="mt-6 p-4 bg-neutral/30 rounded-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div>
              <div className="font-medium text-primary">{stats.averageScore}%</div>
              <div className="text-neutral-dark/70">Moyenne</div>
            </div>
            <div>
              <div className="font-medium text-success">{Math.max(...scans.map(s => s.score))}%</div>
              <div className="text-neutral-dark/70">Meilleur</div>
            </div>
            <div>
              <div className="font-medium text-warning">{Math.min(...scans.map(s => s.score))}%</div>
              <div className="text-neutral-dark/70">Plus bas</div>
            </div>
            <div>
              <div className="font-medium text-primary capitalize">
                {getCenterDisplayName(stats.mostFrequentCenter)}
              </div>
              <div className="text-neutral-dark/70">Fréquent</div>
            </div>
          </div>
        </div>
      )}
      </div>
  );
};

export default RecentScans;