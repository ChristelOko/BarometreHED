import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart, 
  Shield, 
  LogOut, 
  Settings, 
  Crown, 
  Activity,
  TrendingUp,
  Calendar,
  Star,
  Bell,
  Database,
  FileText,
  Zap,
  Sparkles
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import UserManagement from './UserManagement';
import AnalyticsPanel from './AnalyticsPanel';
import AdminTools from './AdminTools';
import AppSettings from './AppSettings';
import BetaTestersManagement from './BetaTestersManagement';
import ContentManagement from './ContentManagement';
import SystemHealth from './SystemHealth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { showAlert } = useAlertStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalScans: 0,
    dailyScans: 0,
    betaTesters: 0,
    averageScore: 0
  });

  const handleLogout = async () => {
    await logout();
    showAlert('Déconnexion réussie', 'success');
    navigate('/login');
  };

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin' && user.email !== 'christel.aplogan@gmail.com')) {
      navigate('/dashboard');
      showAlert('Accès non autorisé', 'error');
    }
  }, [user, navigate, showAlert]);

  // Charger les statistiques
  useEffect(() => {
    const loadStats = async () => {
      // Simuler le chargement des stats
      setStats({
        totalUsers: 156,
        totalScans: 1247,
        dailyScans: 23,
        betaTesters: 12,
        averageScore: 72
      });
    };
    loadStats();
  }, []);

  const menuItems = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: BarChart,
      description: 'Statistiques générales et aperçu'
    },
    {
      id: 'users',
      label: 'Utilisatrices',
      icon: Users,
      description: 'Gestion des comptes utilisateurs'
    },
    {
      id: 'beta_testers',
      label: 'Bétatesteuses',
      icon: Crown,
      description: 'Accès gratuits et tests'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Analyses détaillées et tendances'
    },
    {
      id: 'content',
      label: 'Contenu',
      icon: FileText,
      description: 'Gestion du contenu et traductions'
    },
    {
      id: 'tools',
      label: 'Outils',
      icon: Shield,
      description: 'Outils d\'administration'
    },
    {
      id: 'system',
      label: 'Système',
      icon: Database,
      description: 'Santé système et maintenance'
    },
    {
      id: 'app_settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration de l\'application'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-[#2D2424] shadow-lg border-r border-neutral/10">
          {/* Header Admin */}
          <div className="p-6 border-b border-neutral/10 bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl text-primary">🌸 Console Admin</h1>
                <p className="text-xs text-neutral-dark/60">
                  Baromètre Énergétique
                </p>
              </div>
            </div>
            
            {/* Profil admin */}
            <div className="bg-white/50 rounded-xl p-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-medium text-sm">
                    {user?.name?.charAt(0) || '🌸'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-primary text-sm">👑 {user?.name || 'Christel'}</p>
                  <p className="text-xs text-neutral-dark/60">
                    Fondatrice & Administratrice
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="p-4 flex-1 overflow-y-auto">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all group ${
                      activeTab === item.id 
                        ? 'bg-primary/10 text-primary border-2 border-primary/20' 
                        : 'text-neutral-dark hover:bg-neutral/50 hover:text-primary border-2 border-transparent'
                    }`}
                  >
                    <Icon size={20} className="mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-neutral-dark/60 group-hover:text-primary/70">
                        {item.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-neutral/10">
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => navigate('/dashboard')}
                icon={<Activity size={16} />}
              >
                Retour utilisateur
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={handleLogout}
                icon={<LogOut size={16} />}
                className="text-error hover:bg-error/10 hover:text-error border-error/20"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-white dark:bg-[#2D2424] border-b border-neutral/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl text-primary mb-2">
                  {activeTab === 'overview' && '📊 Vue d\'ensemble'}
                  {activeTab === 'users' && '👥 Gestion des Utilisatrices'}
                  {activeTab === 'beta_testers' && '👑 Gestion des Bétatesteuses'}
                  {activeTab === 'analytics' && '📈 Analytics & Tendances'}
                  {activeTab === 'content' && '📝 Gestion du Contenu'}
                  {activeTab === 'tools' && '🛠️ Outils d\'Administration'}
                  {activeTab === 'system' && '⚙️ Santé du Système'}
                  {activeTab === 'app_settings' && '⚙️ Paramètres Application'}
                </h1>
                <p className="text-neutral-dark/70">
                  {activeTab === 'overview' && 'Aperçu général de votre application'}
                  {activeTab === 'users' && 'Gérez toutes les utilisatrices de l\'application'}
                  {activeTab === 'beta_testers' && 'Accordez des accès gratuits à vos bétatesteuses'}
                  {activeTab === 'analytics' && 'Suivez les performances et l\'usage détaillé'}
                  {activeTab === 'content' && 'Gérez le contenu et les traductions'}
                  {activeTab === 'tools' && 'Outils avancés pour l\'administration'}
                  {activeTab === 'system' && 'Surveillez la santé technique du système'}
                  {activeTab === 'app_settings' && 'Configurez les paramètres globaux'}
                </p>
              </div>
              
              {/* Actions rapides */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm text-neutral-dark/60">Dernière connexion</div>
                  <div className="font-medium text-primary">
                    {new Date().toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={() => window.location.reload()}
                  icon={<Zap size={16} />}
                >
                  Actualiser
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const { testOpenAIConnection } = await import('../../utils/testOpenAI');
                    const result = await testOpenAIConnection();
                    showAlert(result.message, result.success ? 'success' : 'error');
                    console.log('Test OpenAI détails:', result.details);
                  }}
                  icon={<Sparkles size={16} />}
                >
                  Test OpenAI
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Statistiques principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm border border-primary/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users size={24} className="text-primary" />
                      </div>
                      <TrendingUp size={16} className="text-success" />
                    </div>
                    <div className="text-2xl font-display text-primary mb-1">{stats.totalUsers}</div>
                    <div className="text-sm text-neutral-dark/70">Utilisatrices</div>
                    <div className="text-xs text-success mt-1">+12% ce mois</div>
                  </div>

                  <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm border border-secondary/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                        <Activity size={24} className="text-secondary" />
                      </div>
                      <TrendingUp size={16} className="text-success" />
                    </div>
                    <div className="text-2xl font-display text-secondary mb-1">{stats.totalScans}</div>
                    <div className="text-sm text-neutral-dark/70">Scans totaux</div>
                    <div className="text-xs text-success mt-1">+24% ce mois</div>
                  </div>

                  <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm border border-accent/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        <Calendar size={24} className="text-accent" />
                      </div>
                      <TrendingUp size={16} className="text-success" />
                    </div>
                    <div className="text-2xl font-display text-accent mb-1">{stats.dailyScans}</div>
                    <div className="text-sm text-neutral-dark/70">Scans aujourd'hui</div>
                    <div className="text-xs text-success mt-1">+8% vs hier</div>
                  </div>

                  <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm border border-warning/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                        <Crown size={24} className="text-warning" />
                      </div>
                      <Star size={16} className="text-warning" />
                    </div>
                    <div className="text-2xl font-display text-warning mb-1">{stats.betaTesters}</div>
                    <div className="text-sm text-neutral-dark/70">Bétatesteuses</div>
                    <div className="text-xs text-warning mt-1">Actives</div>
                  </div>

                  <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm border border-success/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                        <BarChart size={24} className="text-success" />
                      </div>
                      <TrendingUp size={16} className="text-success" />
                    </div>
                    <div className="text-2xl font-display text-success mb-1">{stats.averageScore}%</div>
                    <div className="text-sm text-neutral-dark/70">Score moyen</div>
                    <div className="text-xs text-success mt-1">+3% ce mois</div>
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
                  <h3 className="font-display text-xl mb-4 text-primary">🚀 Actions rapides</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button
                      variant="primary"
                      onClick={() => setActiveTab('beta_testers')}
                      icon={<Crown size={18} />}
                      fullWidth
                    >
                      Ajouter bétatesteuse
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('users')}
                      icon={<Users size={18} />}
                      fullWidth
                    >
                      Voir utilisatrices
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('analytics')}
                      icon={<BarChart size={18} />}
                      fullWidth
                    >
                      Analytics détaillées
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('app_settings')}
                      icon={<Settings size={18} />}
                      fullWidth
                    >
                      Paramètres app
                    </Button>
                  </div>
                </div>

                {/* Activité récente */}
                <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
                  <h3 className="font-display text-xl mb-4 text-primary">📈 Activité récente</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-neutral/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                          <Users size={16} className="text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Nouvelle utilisatrice inscrite</p>
                          <p className="text-xs text-neutral-dark/60">Il y a 2 minutes</p>
                        </div>
                      </div>
                      <span className="text-xs text-success">+1</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-neutral/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Activity size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Scan énergétique complété</p>
                          <p className="text-xs text-neutral-dark/60">Il y a 5 minutes</p>
                        </div>
                      </div>
                      <span className="text-xs text-primary">Score: 78%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-neutral/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                          <Crown size={16} className="text-warning" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Nouvelle bétatesteuse ajoutée</p>
                          <p className="text-xs text-neutral-dark/60">Il y a 1 heure</p>
                        </div>
                      </div>
                      <span className="text-xs text-warning">Beta</span>
                    </div>
                  </div>
                </div>

                {/* Santé système */}
                <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
                  <h3 className="font-display text-xl mb-4 text-primary">🔧 Santé du système</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                      <div>
                        <p className="font-medium text-success">Base de données</p>
                        <p className="text-xs text-neutral-dark/60">Opérationnelle</p>
                      </div>
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                      <div>
                        <p className="font-medium text-success">API Supabase</p>
                        <p className="text-xs text-neutral-dark/60">Réactive</p>
                      </div>
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                      <div>
                        <p className="font-medium text-success">Edge Functions</p>
                        <p className="text-xs text-neutral-dark/60">Actives</p>
                      </div>
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'beta_testers' && <BetaTestersManagement />}
            {activeTab === 'analytics' && <AnalyticsPanel />}
            {activeTab === 'content' && <ContentManagement />}
            {activeTab === 'tools' && <AdminTools />}
            {activeTab === 'system' && <SystemHealth />}
            {activeTab === 'app_settings' && <AppSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;