import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Users, 
  MessageCircle, 
  BarChart, 
  User,
  Save,
  ArrowLeft,
  Globe,
  MapPin,
  Heart
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAlertStore } from '../../store/alertStore';
import { getPrivacySettings, updatePrivacySettings, PrivacySettings as PrivacySettingsType } from '../../services/profileService';
import { useAuthStore } from '../../store/authStore';

const PrivacySettings = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlertStore();
  const { user } = useAuthStore();
  const [settings, setSettings] = useState<PrivacySettingsType>({
    show_stats: true,
    show_posts: true,
    show_hd_type: true,
    show_location: false,
    show_website: true,
    allow_messages: true,
    allow_follow: true,
    profile_visible: true,
    show_cover_photo: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await getPrivacySettings();
      
      if (error) throw error;
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
      showAlert('Erreur lors du chargement des paramètres', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { error } = await updatePrivacySettings(settings);
      
      if (error) throw error;
      
      showAlert('Paramètres de confidentialité sauvegardés', 'success');
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      showAlert('Erreur lors de la sauvegarde', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSetting = (key: keyof PrivacySettingsType) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-dark/70">Chargement des paramètres...</p>
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
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/profile')}
              icon={<ArrowLeft size={18} />}
              className="mr-4"
            >
              Retour
            </Button>
            <div>
              <h1 className="font-display text-3xl mb-2">Confidentialité</h1>
              <p className="text-neutral-dark/70">
                Contrôlez ce que les autres peuvent voir de votre profil
              </p>
            </div>
          </div>

          {/* Aperçu du profil public */}
          <div className="bg-primary/5 rounded-xl p-6 mb-8 border border-primary/20">
            <h3 className="font-display text-lg mb-4 text-primary flex items-center">
              <Globe size={20} className="mr-2" />
              Aperçu de votre profil public
            </h3>
            <p className="text-sm text-neutral-dark/70 mb-4">
              Voici ce que les autres membres de la communauté peuvent voir de votre profil selon vos paramètres actuels.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/profile/public/${user?.id}`, '_blank')}
              icon={<Eye size={16} />}
            >
              Prévisualiser mon profil public
            </Button>
          </div>

          {/* Paramètres de confidentialité */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-display text-xl mb-6 flex items-center">
              <Shield size={20} className="mr-2 text-primary" />
              Paramètres de confidentialité
            </h2>

            {/* Visibilité des statistiques */}
            <div className="flex items-center justify-between p-4 bg-neutral rounded-xl">
              <div className="flex items-center space-x-3">
                <BarChart size={20} className="text-primary" />
                <div>
                  <h4 className="font-medium">Afficher mes statistiques</h4>
                  <p className="text-sm text-neutral-dark/70">
                    Nombre de scans, score moyen, posts, abonnés
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('show_stats')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.show_stats ? 'bg-primary' : 'bg-neutral-dark/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    settings.show_stats ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Visibilité des posts */}
            <div className="flex items-center justify-between p-4 bg-neutral rounded-xl">
              <div className="flex items-center space-x-3">
                <MessageCircle size={20} className="text-secondary" />
                <div>
                  <h4 className="font-medium">Afficher mes posts</h4>
                  <p className="text-sm text-neutral-dark/70">
                    Vos derniers posts dans la communauté
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('show_posts')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.show_posts ? 'bg-primary' : 'bg-neutral-dark/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    settings.show_posts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Visibilité du type HD */}
            <div className="flex items-center justify-between p-4 bg-neutral rounded-xl">
              <div className="flex items-center space-x-3">
                <User size={20} className="text-accent" />
                <div>
                  <h4 className="font-medium">Afficher mon type Human Design</h4>
                  <p className="text-sm text-neutral-dark/70">
                    Votre type HD sur votre profil public
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('show_hd_type')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.show_hd_type ? 'bg-primary' : 'bg-neutral-dark/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    settings.show_hd_type ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Visibilité de la localisation */}
            <div className="flex items-center justify-between p-4 bg-neutral rounded-xl">
              <div className="flex items-center space-x-3">
                <MapPin size={20} className="text-warning" />
                <div>
                  <h4 className="font-medium">Afficher ma localisation</h4>
                  <p className="text-sm text-neutral-dark/70">
                    Votre ville ou région sur votre profil
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('show_location')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.show_location ? 'bg-primary' : 'bg-neutral-dark/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    settings.show_location ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Visibilité du site web */}
            <div className="flex items-center justify-between p-4 bg-neutral rounded-xl">
              <div className="flex items-center space-x-3">
                <Globe size={20} className="text-success" />
                <div>
                  <h4 className="font-medium">Afficher mon site web</h4>
                  <p className="text-sm text-neutral-dark/70">
                    Lien vers votre site personnel ou professionnel
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('show_website')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.show_website ? 'bg-primary' : 'bg-neutral-dark/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    settings.show_website ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Autoriser les messages */}
            <div className="flex items-center justify-between p-4 bg-neutral rounded-xl">
              <div className="flex items-center space-x-3">
                <MessageCircle size={20} className="text-blue-500" />
                <div>
                  <h4 className="font-medium">Autoriser les messages privés</h4>
                  <p className="text-sm text-neutral-dark/70">
                    Les autres membres peuvent vous envoyer des messages
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('allow_messages')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.allow_messages ? 'bg-primary' : 'bg-neutral-dark/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    settings.allow_messages ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Autoriser le suivi */}
            <div className="flex items-center justify-between p-4 bg-neutral rounded-xl">
              <div className="flex items-center space-x-3">
                <Heart size={20} className="text-rose-500" />
                <div>
                  <h4 className="font-medium">Autoriser le suivi</h4>
                  <p className="text-sm text-neutral-dark/70">
                    Les autres membres peuvent vous suivre
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('allow_follow')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.allow_follow ? 'bg-primary' : 'bg-neutral-dark/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    settings.allow_follow ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Informations importantes */}
          <div className="bg-warning/10 rounded-xl p-6 mt-6 border border-warning/20">
            <h3 className="font-medium text-warning mb-2">ℹ️ Informations importantes</h3>
            <ul className="text-sm text-neutral-dark/70 space-y-1">
              <li>• Si votre profil est public, votre nom et photo sont toujours visibles</li>
              <li>• Un profil privé n'apparaît nulle part et n'est pas accessible</li>
              <li>• Vos posts dans la communauté restent visibles selon ces paramètres</li>
              <li>• Vous pouvez modifier ces paramètres à tout moment</li>
              <li>• Certaines informations peuvent être visibles aux administrateurs</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 mt-8">
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
              fullWidth
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
              icon={isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              fullWidth
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacySettings;