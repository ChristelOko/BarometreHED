import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, Activity, Calendar, Filter } from 'lucide-react';
import { getAnalyticsData, AnalyticsData } from '../../services/adminService';
import { useAlertStore } from '../../store/alertStore';
import { supabase } from '../../services/supabaseClient';

const AnalyticsPanel = () => {
  const { showAlert } = useAlertStore();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');
  const [realData, setRealData] = useState({
    totalUsers: 0,
    totalScans: 0,
    dailyScans: 0,
    averageScore: 0,
    scansByCategory: {
      general: 0,
      emotional: 0,
      physical: 0
    },
    scansByCenter: {
      'g-center': 0,
      'solar-plexus': 0,
      'heart': 0,
      'throat': 0,
      'sacral': 0,
      'root': 0,
      'spleen': 0,
      'ajna': 0,
      'head': 0
    }
  });

  useEffect(() => {
    fetchRealData();
  }, [timeRange]);

  const fetchRealData = async () => {
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-dark/70">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  // If no data is available yet, show placeholder
  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Statistiques</h2>
            <p className="text-neutral-dark/70">
              Analyse des performances de l'application
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#2D2424] rounded-xl p-2 shadow-sm">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-primary" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent border-none text-sm focus:outline-none"
              >
                <option value="7days">7 derniers jours</option>
                <option value="30days">30 derniers jours</option>
                <option value="90days">90 derniers jours</option>
                <option value="year">Année en cours</option>
                <option value="all">Tout</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Users size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-neutral-dark/70 text-sm">Utilisatrices</p>
                <p className="font-display text-2xl">{realData.totalUsers}</p>
              </div>
            </div>
            <div className="flex items-center text-success text-sm">
              <TrendingUp size={14} className="mr-1" />
              <span>+12% ce mois</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mr-3">
                <Activity size={20} className="text-secondary" />
              </div>
              <div>
                <p className="text-neutral-dark/70 text-sm">Scans réalisés</p>
                <p className="font-display text-2xl">{realData.totalScans}</p>
              </div>
            </div>
            <div className="flex items-center text-success text-sm">
              <TrendingUp size={14} className="mr-1" />
              <span>+24% ce mois</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                <Calendar size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-neutral-dark/70 text-sm">Scans quotidiens</p>
                <p className="font-display text-2xl">{realData.dailyScans}</p>
              </div>
            </div>
            <div className="flex items-center text-success text-sm">
              <TrendingUp size={14} className="mr-1" />
              <span>+8% ce mois</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <BarChart2 size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-neutral-dark/70 text-sm">Score moyen</p>
                <p className="font-display text-2xl">{realData.averageScore}%</p>
              </div>
            </div>
            <div className="flex items-center text-success text-sm">
              <TrendingUp size={14} className="mr-1" />
              <span>+3% ce mois</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
            <h3 className="font-display text-lg mb-4">Scans par catégorie</h3>
            <div className="h-64 flex items-center justify-center">
              <CustomPieChart 
                data={[
                  { name: 'Général', value: realData.scansByCategory.general, color: '#A87878' },
                  { name: 'Émotionnel', value: realData.scansByCategory.emotional, color: '#9F85AF' },
                  { name: 'Physique', value: realData.scansByCategory.physical, color: '#E4C997' }
                ]}
              />
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
            <h3 className="font-display text-lg mb-4">Centres HD les plus fréquents</h3>
            <div className="h-64 flex items-center justify-center">
              <CustomPieChart 
                data={Object.entries(realData.scansByCenter)
                  .filter(([_, count]) => count > 0)
                  .sort(([_, a], [__, b]) => b - a)
                  .slice(0, 5)
                  .map(([center, count]) => ({
                    name: getCenterDisplayName(center),
                    value: count,
                    color: getCenterColor(center)
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
          <h3 className="font-display text-lg mb-4">Évolution des scans</h3>
          <div className="h-80 flex items-center justify-center">
            <BarChart2 size={300} className="text-neutral-dark/20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Statistiques</h2>
          <p className="text-neutral-dark/70">
            Analyse des performances de l'application
          </p>
        </div>
        
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-2 shadow-sm">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-primary" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none text-sm focus:outline-none"
            >
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="90days">90 derniers jours</option>
              <option value="year">Année en cours</option>
              <option value="all">Tout</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Users size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-neutral-dark/70 text-sm">Utilisatrices</p>
              <p className="font-display text-2xl">{analyticsData.totalUsers}</p>
            </div>
          </div>
          <div className={`flex items-center text-sm ${
            analyticsData.userGrowth >= 0 ? 'text-success' : 'text-error'
          }`}>
            <TrendingUp size={14} className="mr-1" />
            <span>{analyticsData.userGrowth >= 0 ? '+' : ''}{analyticsData.userGrowth}% ce mois</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mr-3">
              <Activity size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-neutral-dark/70 text-sm">Scans réalisés</p>
              <p className="font-display text-2xl">{analyticsData.totalScans}</p>
            </div>
          </div>
          <div className={`flex items-center text-sm ${
            analyticsData.scanGrowth >= 0 ? 'text-success' : 'text-error'
          }`}>
            <TrendingUp size={14} className="mr-1" />
            <span>{analyticsData.scanGrowth >= 0 ? '+' : ''}{analyticsData.scanGrowth}% ce mois</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
              <Calendar size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-neutral-dark/70 text-sm">Scans quotidiens</p>
              <p className="font-display text-2xl">{analyticsData.dailyScans}</p>
            </div>
          </div>
          <div className={`flex items-center text-sm ${
            analyticsData.dailyScanGrowth >= 0 ? 'text-success' : 'text-error'
          }`}>
            <TrendingUp size={14} className="mr-1" />
            <span>{analyticsData.dailyScanGrowth >= 0 ? '+' : ''}{analyticsData.dailyScanGrowth}% ce mois</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <BarChart2 size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-neutral-dark/70 text-sm">Score moyen</p>
              <p className="font-display text-2xl">{analyticsData.averageScore}%</p>
            </div>
          </div>
          <div className={`flex items-center text-sm ${
            analyticsData.scoreGrowth >= 0 ? 'text-success' : 'text-error'
          }`}>
            <TrendingUp size={14} className="mr-1" />
            <span>{analyticsData.scoreGrowth >= 0 ? '+' : ''}{analyticsData.scoreGrowth}% ce mois</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
          <h3 className="font-display text-lg mb-4">Scans par catégorie</h3>
          <div className="h-64 flex items-center justify-center">
            <CustomPieChart 
              data={[
                { name: 'Général', value: analyticsData.scansByCategory.general, color: '#A87878' },
                { name: 'Émotionnel', value: analyticsData.scansByCategory.emotional, color: '#9F85AF' },
                { name: 'Physique', value: analyticsData.scansByCategory.physical, color: '#E4C997' }
              ]}
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
          <h3 className="font-display text-lg mb-4">Centres HD les plus fréquents</h3>
          <div className="h-64 flex items-center justify-center">
            <CustomPieChart 
              data={Object.entries(analyticsData.scansByCenter)
                .filter(([_, count]) => count > 0)
                .sort(([_, a], [__, b]) => b - a)
                .slice(0, 5)
                .map(([center, count]) => ({
                  name: getCenterDisplayName(center),
                  value: count,
                  color: getCenterColor(center)
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
        <h3 className="font-display text-lg mb-4">Évolution des scans</h3>
        <div className="h-80 flex items-center justify-center">
          <BarChart2 size={300} className="text-neutral-dark/20" />
        </div>
      </div>
    </div>
  );
};

// Composant CustomPieChart simplifié
const CustomPieChart = ({ data }: { data: { name: string; value: number; color: string }[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return <div className="text-neutral-dark/50">Aucune donnée disponible</div>;
  }
  
  let startAngle = 0;
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const endAngle = startAngle + angle;
          
          // Calculer les coordonnées pour le chemin d'arc
          const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
          
          // Créer le chemin d'arc
          const largeArcFlag = angle > 180 ? 1 : 0;
          const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
          
          // Mettre à jour l'angle de départ pour le prochain segment
          startAngle = endAngle;
          
          return (
            <path
              key={index}
              d={path}
              fill={item.color}
              stroke="#fff"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      
      <div className="absolute top-full mt-4 w-full">
        <div className="flex flex-wrap justify-center gap-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 mr-1"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs">{item.name} ({Math.round((item.value / total) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Fonction pour obtenir le nom d'affichage d'un centre HD
const getCenterDisplayName = (center: string): string => {
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

// Fonction pour obtenir la couleur d'un centre HD
const getCenterColor = (center: string): string => {
  const centerColors: Record<string, string> = {
    'throat': '#4299E1', // blue-500
    'heart': '#E53E3E', // red-500
    'solar-plexus': '#ECC94B', // yellow-500
    'sacral': '#ED8936', // orange-500
    'root': '#9B2C2C', // red-800
    'spleen': '#667EEA', // indigo-500
    'g-center': '#48BB78', // green-500
    'ajna': '#38B2AC', // teal-500
    'head': '#9F7AEA'  // purple-500
  };
  return centerColors[center] || '#A0AEC0'; // gray-500 par défaut
};

export default AnalyticsPanel;