import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Server, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Activity,
  Clock,
  HardDrive,
  Wifi,
  Shield
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAlertStore } from '../../store/alertStore';

interface SystemStatus {
  service: string;
  status: 'healthy' | 'warning' | 'error';
  responseTime: number;
  lastCheck: string;
  details: string;
}

const SystemHealth = () => {
  const { showAlert } = useAlertStore();
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const services = [
    {
      name: 'Base de données Supabase',
      key: 'database',
      icon: Database,
      color: 'text-primary'
    },
    {
      name: 'API REST',
      key: 'api',
      icon: Server,
      color: 'text-secondary'
    },
    {
      name: 'Edge Functions',
      key: 'functions',
      icon: Zap,
      color: 'text-accent'
    },
    {
      name: 'Authentification',
      key: 'auth',
      icon: Shield,
      color: 'text-warning'
    },
    {
      name: 'Stockage fichiers',
      key: 'storage',
      icon: HardDrive,
      color: 'text-success'
    },
    {
      name: 'Réseau CDN',
      key: 'cdn',
      icon: Wifi,
      color: 'text-purple-500'
    }
  ];

  useEffect(() => {
    checkSystemHealth();
    
    // Vérification automatique toutes les 30 secondes
    const interval = setInterval(checkSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    try {
      setIsLoading(true);
      
      // Simuler les vérifications de santé
      const mockStatuses: SystemStatus[] = [
        {
          service: 'database',
          status: 'healthy',
          responseTime: 45,
          lastCheck: new Date().toISOString(),
          details: 'Connexions actives: 12/100'
        },
        {
          service: 'api',
          status: 'healthy',
          responseTime: 120,
          lastCheck: new Date().toISOString(),
          details: 'Requêtes/min: 156'
        },
        {
          service: 'functions',
          status: 'warning',
          responseTime: 890,
          lastCheck: new Date().toISOString(),
          details: 'Latence élevée détectée'
        },
        {
          service: 'auth',
          status: 'healthy',
          responseTime: 67,
          lastCheck: new Date().toISOString(),
          details: 'Sessions actives: 23'
        },
        {
          service: 'storage',
          status: 'healthy',
          responseTime: 234,
          lastCheck: new Date().toISOString(),
          details: 'Espace utilisé: 2.3GB/10GB'
        },
        {
          service: 'cdn',
          status: 'healthy',
          responseTime: 34,
          lastCheck: new Date().toISOString(),
          details: 'Cache hit ratio: 94%'
        }
      ];
      
      setSystemStatus(mockStatuses);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error checking system health:', error);
      showAlert('Erreur lors de la vérification du système', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={20} className="text-success" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-warning" />;
      case 'error':
        return <XCircle size={20} className="text-error" />;
      default:
        return <Clock size={20} className="text-neutral-dark/50" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-success/10 border-success/20';
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'error':
        return 'bg-error/10 border-error/20';
      default:
        return 'bg-neutral/10 border-neutral/20';
    }
  };

  const getOverallHealth = () => {
    const healthyCount = systemStatus.filter(s => s.status === 'healthy').length;
    const warningCount = systemStatus.filter(s => s.status === 'warning').length;
    const errorCount = systemStatus.filter(s => s.status === 'error').length;
    
    if (errorCount > 0) return 'error';
    if (warningCount > 0) return 'warning';
    return 'healthy';
  };

  const getAverageResponseTime = () => {
    if (systemStatus.length === 0) return 0;
    const total = systemStatus.reduce((sum, status) => sum + status.responseTime, 0);
    return Math.round(total / systemStatus.length);
  };

  if (isLoading && systemStatus.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-dark/70">Vérification du système...</p>
        </div>
      </div>
    );
  }

  const overallHealth = getOverallHealth();
  const avgResponseTime = getAverageResponseTime();

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`rounded-xl p-6 border-2 ${getStatusColor(overallHealth)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              {getStatusIcon(overallHealth)}
            </div>
            <Activity size={24} className="text-neutral-dark/30" />
          </div>
          <div className="text-2xl font-display mb-1">
            {overallHealth === 'healthy' ? 'Excellent' : 
             overallHealth === 'warning' ? 'Attention' : 'Problème'}
          </div>
          <div className="text-sm text-neutral-dark/70">État général</div>
        </div>

        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock size={24} className="text-primary" />
            </div>
            <RefreshCw size={24} className="text-neutral-dark/30" />
          </div>
          <div className="text-2xl font-display text-primary mb-1">{avgResponseTime}ms</div>
          <div className="text-sm text-neutral-dark/70">Temps de réponse moyen</div>
        </div>

        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle size={24} className="text-success" />
            </div>
            <Server size={24} className="text-neutral-dark/30" />
          </div>
          <div className="text-2xl font-display text-success mb-1">
            {systemStatus.filter(s => s.status === 'healthy').length}/{systemStatus.length}
          </div>
          <div className="text-sm text-neutral-dark/70">Services opérationnels</div>
        </div>

        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
              <Activity size={24} className="text-secondary" />
            </div>
            <div className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={checkSystemHealth}
                icon={isLoading ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                disabled={isLoading}
              >
                {isLoading ? 'Vérification...' : 'Actualiser'}
              </Button>
            </div>
          </div>
          <div className="text-sm text-neutral-dark/70">
            Dernière vérification: {lastUpdate.toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>

      {/* Détail des services */}
      <div className="bg-white dark:bg-[#2D2424] rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral/10">
          <h3 className="font-display text-xl text-primary">État détaillé des services</h3>
          <p className="text-neutral-dark/70 text-sm">
            Surveillance en temps réel de tous les composants système
          </p>
        </div>

        <div className="divide-y divide-neutral/10">
          {services.map((service, index) => {
            const status = systemStatus.find(s => s.service === service.key);
            const Icon = service.icon;
            
            return (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-neutral/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      status?.status === 'healthy' ? 'bg-success/10' :
                      status?.status === 'warning' ? 'bg-warning/10' :
                      status?.status === 'error' ? 'bg-error/10' : 'bg-neutral/10'
                    }`}>
                      <Icon size={24} className={service.color} />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-neutral-dark">{service.name}</h4>
                      <p className="text-sm text-neutral-dark/60">
                        {status?.details || 'En attente de vérification...'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {status && (
                      <>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {status.responseTime}ms
                          </div>
                          <div className="text-xs text-neutral-dark/60">
                            {new Date(status.lastCheck).toLocaleTimeString('fr-FR')}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(status.status)}
                          <span className={`text-sm font-medium ${
                            status.status === 'healthy' ? 'text-success' :
                            status.status === 'warning' ? 'text-warning' : 'text-error'
                          }`}>
                            {status.status === 'healthy' ? 'Opérationnel' :
                             status.status === 'warning' ? 'Attention' : 'Erreur'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Actions de maintenance */}
      <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
        <h3 className="font-display text-xl mb-4 text-primary">🔧 Actions de maintenance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => showAlert('Cache vidé avec succès', 'success')}
            icon={<RefreshCw size={16} />}
            fullWidth
          >
            Vider le cache
          </Button>
          
          <Button
            variant="outline"
            onClick={() => showAlert('Base de données optimisée', 'success')}
            icon={<Database size={16} />}
            fullWidth
          >
            Optimiser la DB
          </Button>
          
          <Button
            variant="outline"
            onClick={() => showAlert('Logs exportés', 'success')}
            icon={<Activity size={16} />}
            fullWidth
          >
            Exporter les logs
          </Button>
        </div>
      </div>

      {/* Alertes système */}
      <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
        <h3 className="font-display text-xl mb-4 text-primary">🚨 Alertes récentes</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle size={16} className="text-warning" />
              <div>
                <p className="font-medium text-sm">Latence élevée détectée</p>
                <p className="text-xs text-neutral-dark/60">Edge Functions - Il y a 5 minutes</p>
              </div>
            </div>
            <span className="text-xs text-warning">Surveillance</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle size={16} className="text-success" />
              <div>
                <p className="font-medium text-sm">Maintenance programmée terminée</p>
                <p className="text-xs text-neutral-dark/60">Base de données - Il y a 2 heures</p>
              </div>
            </div>
            <span className="text-xs text-success">Résolu</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-neutral/10 rounded-lg">
            <div className="flex items-center space-x-3">
              <Activity size={16} className="text-neutral-dark/50" />
              <div>
                <p className="font-medium text-sm">Pic de trafic géré avec succès</p>
                <p className="text-xs text-neutral-dark/60">CDN - Il y a 1 jour</p>
              </div>
            </div>
            <span className="text-xs text-neutral-dark/60">Info</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;