import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Target, Heart, Activity } from 'lucide-react';
import Button from '../components/common/Button';
import EnergyGauge from '../components/results/EnergyGauge';
import HDCenterDisplay from '../components/results/HDCenterDisplay';
import GuidanceCard from '../components/results/GuidanceCard';
import FeelingsSection from '../components/results/FeelingsSection';
import { getScanDetails, type ScanDetails } from '../services/scanService';
import { useAuthStore } from '../store/authStore';
import { useAlertStore } from '../store/alertStore';
import { useFeelingsStore } from '../store/feelingsStore';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const ScanDetailsPage = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showAlert } = useAlertStore();
  const { getFeelingsByCategory } = useFeelingsStore();
  const [scanDetails, setScanDetails] = useState<ScanDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  // Get all feelings from the store, filtered by user's HD type
  const allFeelings = getFeelingsByCategory('general', user?.hdType);

  useEffect(() => {
    const fetchScanDetails = async () => {
      if (!scanId || !user?.id) {
        navigate('/dashboard');
        return;
      }

      try {
        const { data, error } = await getScanDetails(scanId);
        if (error) throw error;
        
        if (!data) {
          showAlert('Scan non trouvé', 'error');
          navigate('/dashboard');
          return;
        }

        // Verify the scan belongs to the current user
        if (data.user_id !== user.id) {
          showAlert('Accès non autorisé', 'error');
          navigate('/dashboard');
          return;
        }

        setScanDetails(data);
      } catch (error) {
        console.error('Error fetching scan details:', error);
        showAlert('Erreur lors du chargement du scan', 'error');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScanDetails();
  }, [scanId, user, navigate, showAlert]);

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

  const getCategoryDisplayName = (category: string) => {
    const categoryNames: Record<string, string> = {
      'general': 'Général',
      'emotional': 'Émotionnel',
      'physical': 'Physique'
    };
    return categoryNames[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emotional':
        return <Heart size={20} className="text-secondary" />;
      case 'physical':
        return <Activity size={20} className="text-accent" />;
      default:
        return <Target size={20} className="text-primary" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="font-display text-xl text-primary">Chargement des détails...</h2>
        </div>
      </div>
    );
  }

  if (!scanDetails) return null;

  return (
    <div className="min-h-screen py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
              icon={<ArrowLeft size={18} />}
              className="mr-4"
            >
              Retour
            </Button>
            <div>
              <h1 className="font-display text-3xl md:text-4xl">
                Détails du scan
              </h1>
              <p className="text-neutral-dark/70">
                {format(parseISO(scanDetails.date), 'EEEE dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>

          {/* Scan Overview */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(scanDetails.category)}
                  <div>
                    <h3 className="font-display text-lg">Catégorie</h3>
                    <p className="text-neutral-dark/70">{getCategoryDisplayName(scanDetails.category)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Calendar size={20} className="text-primary" />
                <div>
                  <h3 className="font-display text-lg">Date</h3>
                  <p className="text-neutral-dark/70">
                    {format(parseISO(scanDetails.date), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Target size={20} className="text-primary" />
                <div>
                  <h3 className="font-display text-lg">Centre principal</h3>
                  <p className="text-neutral-dark/70">{getCenterDisplayName(scanDetails.center)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Scores */}
          {(scanDetails.general_score > 0 || scanDetails.emotional_score > 0 || scanDetails.physical_score > 0) && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <h2 className="font-display text-2xl mb-6">Scores par dimension</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {scanDetails.general_score > 0 && (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                      <Target size={24} className="text-primary" />
                    </div>
                    <h3 className="font-display text-lg mb-1">Général</h3>
                    <div className="text-3xl font-display text-primary">{scanDetails.general_score}%</div>
                  </div>
                )}
                
                {scanDetails.emotional_score > 0 && (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Heart size={24} className="text-secondary" />
                    </div>
                    <h3 className="font-display text-lg mb-1">Émotionnel</h3>
                    <div className="text-3xl font-display text-secondary">{scanDetails.emotional_score}%</div>
                  </div>
                )}
                
                {scanDetails.physical_score > 0 && (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-accent/10 rounded-full flex items-center justify-center">
                      <Activity size={24} className="text-accent" />
                    </div>
                    <h3 className="font-display text-lg mb-1">Physique</h3>
                    <div className="text-3xl font-display text-accent">{scanDetails.physical_score}%</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Energy Gauge and HD Center */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <EnergyGauge score={scanDetails.score} />
              </div>
              <div>
                <HDCenterDisplay center={scanDetails.center} />
              </div>
            </div>
          </div>

          {/* Guidance Card */}
          {scanDetails.guidance && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8"
            >
              <GuidanceCard 
                guidance={scanDetails.guidance} 
                personalizedInsights={scanDetails.personalized_insights}
                mantra={scanDetails.mantra}
                realignmentExercise={scanDetails.realignment_exercise}
              />
            </motion.div>
          )}

          {/* Feelings Analysis */}
          {scanDetails.selected_feelings && scanDetails.selected_feelings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-sm mb-8"
            >
              <h2 className="font-display text-2xl mb-6">📝 Ressentis sélectionnés</h2>
              <FeelingsSection 
                selectedFeelings={scanDetails.selected_feelings}
                allFeelings={allFeelings}
              />
            </motion.div>
          )}

          {/* Mantra and Exercise */}
          {(scanDetails.mantra || scanDetails.realignment_exercise) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {scanDetails.mantra && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-display text-xl mb-4">🧘‍♀️ Mantra du jour</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-primary/5 rounded-xl">
                      <p className="text-sm text-neutral-dark/70 mb-1">Inspiration</p>
                      <p className="font-medium text-primary">{scanDetails.mantra.inhale}</p>
                    </div>
                    <div className="p-4 bg-secondary/5 rounded-xl">
                      <p className="text-sm text-neutral-dark/70 mb-1">Expiration</p>
                      <p className="font-medium text-secondary">{scanDetails.mantra.exhale}</p>
                    </div>
                  </div>
                </div>
              )}

              {scanDetails.realignment_exercise && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-display text-xl mb-4">🌿 Exercice de réalignement</h3>
                  <p className="text-neutral-dark/80 leading-relaxed">
                    {scanDetails.realignment_exercise}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="primary"
              onClick={() => navigate('/dashboard')}
              fullWidth
            >
              Retour au tableau de bord
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/scan')}
              fullWidth
            >
              Nouveau scan
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScanDetailsPage;