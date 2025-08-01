import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Calendar, TestTube, Save, Smartphone, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { 
  NotificationSettings as NotificationSettingsType,
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  testNotification,
  initializeNotifications
} from '../../services/notificationService';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';

const NotificationSettings = () => {
  const { user } = useAuthStore();
  const { showAlert } = useAlertStore();
  const [settings, setSettings] = useState<Partial<NotificationSettingsType>>({
    enabled: false,
    morning_time: '08:00',
    evening_reminder: false,
    evening_time: '20:00',
    frequency: 'daily',
    custom_days: [1, 2, 3, 4, 5] // Lundi à vendredi par défaut
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'default' | 'granted' | 'denied'>('default');
  const [isSupported, setIsSupported] = useState(false);

  const daysOfWeek = [
    { value: 0, label: 'Dimanche', short: 'Dim' },
    { value: 1, label: 'Lundi', short: 'Lun' },
    { value: 2, label: 'Mardi', short: 'Mar' },
    { value: 3, label: 'Mercredi', short: 'Mer' },
    { value: 4, label: 'Jeudi', short: 'Jeu' },
    { value: 5, label: 'Vendredi', short: 'Ven' },
    { value: 6, label: 'Samedi', short: 'Sam' }
  ];

  useEffect(() => {
    checkNotificationSupport();
    loadSettings();
  }, [user]);

  const checkNotificationSupport = () => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);
    
    if (supported) {
      setPermissionStatus(Notification.permission);
    }
  };

  const loadSettings = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await getNotificationSettings(user.id);
      
      if (error) throw error;
      
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      showAlert('Erreur lors du chargement des paramètres de notification', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user?.id) return;

    try {
      setIsSaving(true);
      
      // Demander la permission si les notifications sont activées
      if (settings.enabled) {
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) {
          showAlert('Permission de notification requise pour activer les rappels', 'warning');
          return;
        }
        setPermissionStatus('granted');
      }

      const { error } = await saveNotificationSettings(user.id, {
        enabled: settings.enabled || false,
        morning_time: settings.morning_time || '08:00',
        evening_reminder: settings.evening_reminder || false,
        evening_time: settings.evening_time || '20:00',
        frequency: settings.frequency || 'daily',
        custom_days: settings.custom_days || []
      });

      if (error) throw error;

      // Réinitialiser les notifications avec les nouveaux paramètres
      if (settings.enabled && user.name && user.hdType) {
        await initializeNotifications(user.id, user.name, user.hdType);
      }

      setShowConfirmation(true);
      showAlert('Paramètres de notification sauvegardés', 'success');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showAlert('Erreur lors de la sauvegarde des paramètres', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async () => {
    if (!user?.name || !user?.hdType) {
      showAlert('Informations utilisateur manquantes', 'error');
      return;
    }

    try {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        showAlert('Permission de notification requise', 'warning');
        return;
      }

      await testNotification(user.name, user.hdType);
      showAlert('Notification de test envoyée ! 🌸', 'success');
    } catch (error) {
      console.error('Erreur lors du test:', error);
      showAlert('Erreur lors de l\'envoi de la notification de test', 'error');
    }
  };

  const handleRequestPermission = async () => {
    try {
      const granted = await requestNotificationPermission();
      setPermissionStatus(granted ? 'granted' : 'denied');
      
      if (granted) {
        showAlert('Permission accordée ! Vous pouvez maintenant activer les notifications', 'success');
      } else {
        showAlert('Permission refusée. Vous pouvez la modifier dans les paramètres de votre navigateur', 'warning');
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      showAlert('Erreur lors de la demande de permission', 'error');
    }
  };

  const toggleDay = (dayValue: number) => {
    const currentDays = settings.custom_days || [];
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter(d => d !== dayValue)
      : [...currentDays, dayValue].sort();
    
    setSettings(prev => ({ ...prev, custom_days: newDays }));
  };

  if (!isSupported) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="text-center py-8">
          <AlertCircle size={48} className="mx-auto text-warning mb-4" />
          <h3 className="font-display text-xl text-warning mb-2">
            Notifications non supportées
          </h3>
          <p className="text-neutral-dark/70">
            Votre navigateur ne supporte pas les notifications push. 
            Veuillez utiliser un navigateur moderne comme Chrome, Firefox ou Safari.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-dark/70">Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <Bell size={24} className="text-primary mr-3" />
          <div>
            <h2 className="font-display text-2xl">Notifications personnalisées</h2>
            <p className="text-neutral-dark/70">
              Recevez des messages de salutation adaptés à votre type HD
            </p>
          </div>
        </div>

        {/* Statut des permissions */}
        <div className="mb-6 p-4 rounded-xl bg-neutral">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                permissionStatus === 'granted' ? 'bg-success/10' :
                permissionStatus === 'denied' ? 'bg-error/10' : 'bg-warning/10'
              }`}>
                {permissionStatus === 'granted' ? (
                  <CheckCircle size={20} className="text-success" />
                ) : permissionStatus === 'denied' ? (
                  <X size={20} className="text-error" />
                ) : (
                  <AlertCircle size={20} className="text-warning" />
                )}
              </div>
              <div>
                <h3 className="font-medium">Permissions de notification</h3>
                <p className="text-sm text-neutral-dark/70">
                  {permissionStatus === 'granted' && 'Autorisées - Vous recevrez les notifications'}
                  {permissionStatus === 'denied' && 'Refusées - Modifiez dans les paramètres du navigateur'}
                  {permissionStatus === 'default' && 'Non demandées - Cliquez pour autoriser'}
                </p>
              </div>
            </div>
            {permissionStatus !== 'granted' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRequestPermission}
                icon={<Smartphone size={16} />}
              >
                Autoriser
              </Button>
            )}
          </div>
        </div>

        {/* Activation des notifications */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5">
            <div>
              <h3 className="font-medium">Activer les notifications</h3>
              <p className="text-sm text-neutral-dark/70">
                Recevez des rappels personnalisés pour faire votre scan énergétique
              </p>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.enabled ? 'bg-primary' : 'bg-neutral-dark/20'
              }`}
              disabled={permissionStatus !== 'granted'}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {settings.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-6"
          >
            {/* Heure du matin */}
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                <Clock size={16} className="inline mr-1" />
                Rappel du matin
              </label>
              <input
                type="time"
                value={settings.morning_time}
                onChange={(e) => setSettings(prev => ({ ...prev, morning_time: e.target.value }))}
                className="input-field w-32"
              />
              <p className="text-xs text-neutral-dark/60 mt-1">
                Heure à laquelle vous voulez recevoir votre message de salutation
              </p>
            </div>

            {/* Fréquence */}
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fréquence
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="frequency"
                    value="daily"
                    checked={settings.frequency === 'daily'}
                    onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="mr-2"
                  />
                  Tous les jours
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="frequency"
                    value="weekdays"
                    checked={settings.frequency === 'weekdays'}
                    onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="mr-2"
                  />
                  Jours de semaine uniquement
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="frequency"
                    value="custom"
                    checked={settings.frequency === 'custom'}
                    onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="mr-2"
                  />
                  Jours personnalisés
                </label>
              </div>
            </div>

            {/* Jours personnalisés */}
            {settings.frequency === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Sélectionner les jours
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      onClick={() => toggleDay(day.value)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        settings.custom_days?.includes(day.value)
                          ? 'bg-primary text-white'
                          : 'bg-neutral text-neutral-dark hover:bg-primary/10'
                      }`}
                    >
                      {day.short}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rappel du soir */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-neutral-dark">
                  Rappel du soir (optionnel)
                </label>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, evening_reminder: !prev.evening_reminder }))}
                  className={`w-10 h-5 rounded-full transition-colors ${
                    settings.evening_reminder ? 'bg-primary' : 'bg-neutral-dark/20'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                      settings.evening_reminder ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              {settings.evening_reminder && (
                <input
                  type="time"
                  value={settings.evening_time}
                  onChange={(e) => setSettings(prev => ({ ...prev, evening_time: e.target.value }))}
                  className="input-field w-32"
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 mt-6">
          <Button
            variant="primary"
            onClick={handleSaveSettings}
            disabled={isSaving || permissionStatus !== 'granted'}
            icon={isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
          >
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
          
          {settings.enabled && permissionStatus === 'granted' && (
            <Button
              variant="outline"
              onClick={handleTestNotification}
              icon={<TestTube size={18} />}
            >
              Tester
            </Button>
          )}
        </div>

        {/* Aperçu du message */}
        {settings.enabled && user?.hdType && (
          <div className="mt-6 p-4 bg-primary/5 rounded-xl">
            <h3 className="font-medium mb-2">Aperçu du message</h3>
            <div className="text-sm text-neutral-dark/80">
              <p className="font-medium">
                "Bonjour {user.name || 'ma belle'} {user.hdType === 'generator' ? 'Generator' : user.hdType} 🌸"
              </p>
              <p className="mt-1">
                {user.hdType === 'generator' && "Ton énergie sacrale a-t-elle quelque chose à te dire aujourd'hui ? Écoute tes réponses intérieures et fais ton scan énergétique ✨"}
                {user.hdType === 'projector' && "Quelle est la qualité de ton énergie ce matin ? Prends un moment pour observer ton état énergétique ✨"}
                {user.hdType === 'manifesting-generator' && "Ton énergie multi-passionnée est-elle alignée ? Scanne tes différentes facettes énergétiques ⚡"}
                {user.hdType === 'manifestor' && "Ton énergie d'initiation est-elle prête à créer ? Scanne ton potentiel de manifestation du jour 🔥"}
                {user.hdType === 'reflector' && "Que reflète ton énergie de l'environnement aujourd'hui ? Observe les nuances de ton miroir énergétique 🔍"}
              </p>
            </div>
          </div>
        )}

        {/* Instructions pour mobile */}
        <div className="mt-6 p-4 bg-neutral rounded-xl">
          <h4 className="font-medium mb-2 flex items-center">
            <Smartphone size={16} className="mr-2" />
            Instructions pour mobile
          </h4>
          <div className="text-sm text-neutral-dark/70 space-y-1">
            <p>• <strong>iPhone :</strong> Ajoutez le site à votre écran d'accueil via Safari</p>
            <p>• <strong>Android :</strong> Utilisez Chrome et acceptez l'installation de l'app</p>
            <p>• Les notifications fonctionnent même quand l'app est fermée</p>
          </div>
        </div>
      </div>

      {/* Boîte de dialogue de confirmation */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Paramètres sauvegardés ! 🌸"
        message="Vos préférences de notification ont été enregistrées. Vous recevrez maintenant des messages personnalisés selon vos paramètres."
        type="success"
      />
    </div>
  );
};

export default NotificationSettings;