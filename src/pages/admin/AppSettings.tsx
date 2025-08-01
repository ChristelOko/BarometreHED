import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Save, RefreshCw, Info } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAlertStore } from '../../store/alertStore';
import { getAppSettings, updateAppSettings } from '../../services/adminService';
import { useAppSettings } from '../../context/AppSettingsContext';

const AppSettings = () => {
  const { showAlert } = useAlertStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Utiliser les paramètres de l'application depuis le contexte
  const { settings: appSettings, refreshSettings } = useAppSettings();
  const [localSettings, setLocalSettings] = useState({
    showPremiumPage: appSettings.showPremiumPage,
    freeRegistration: appSettings.freeRegistration
  });

  useEffect(() => {
    // Synchroniser les paramètres locaux avec les paramètres de l'application
    setLocalSettings({
      showPremiumPage: appSettings.showPremiumPage,
      freeRegistration: appSettings.freeRegistration
    });
    setIsLoading(false);
  }, [appSettings]);


  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Save settings to localStorage for demo
      localStorage.setItem('appSettings', JSON.stringify(localSettings));
      
      // Rafraîchir les paramètres dans le contexte global
      await refreshSettings();
      
      showAlert('Paramètres enregistrés avec succès', 'success');
    } catch (error) {
      console.error('Error saving app settings:', error);
      showAlert('Erreur lors de l\'enregistrement des paramètres', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-dark/70">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Paramètres de l'application</h2>
          <p className="text-neutral-dark/70">
            Configurez les fonctionnalités et les langues disponibles
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={handleSaveSettings}
          icon={isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          disabled={isSaving}
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>

      {/* Page Premium */}
      <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <Sparkles size={20} className="text-primary mr-3" />
          <h3 className="font-display text-xl">Page Premium</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl">
            <div>
              <h4 className="font-medium">Afficher la page Premium</h4>
              <p className="text-sm text-neutral-dark/70">
                Activez ou désactivez l'accès à la page Premium et aux fonctionnalités payantes
              </p>
            </div>
            <button
              onClick={() => setLocalSettings(prev => ({ ...prev, showPremiumPage: !prev.showPremiumPage }))}
              className={`w-12 h-6 rounded-full transition-colors ${
                localSettings.showPremiumPage ? 'bg-primary' : 'bg-neutral-dark/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  localSettings.showPremiumPage ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl">
            <div>
              <h4 className="font-medium">Inscription gratuite</h4>
              <p className="text-sm text-neutral-dark/70">
                Permettre l'inscription gratuite pendant la phase de test
              </p>
            </div>
            <button
              onClick={() => setLocalSettings(prev => ({ ...prev, freeRegistration: !prev.freeRegistration }))}
              className={`w-12 h-6 rounded-full transition-colors ${
                localSettings.freeRegistration ? 'bg-primary' : 'bg-neutral-dark/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  localSettings.freeRegistration ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {!localSettings.showPremiumPage && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info size={18} className="text-warning mt-1" />
                <div>
                  <p className="text-sm text-warning font-medium">Mode gratuit activé</p>
                  <p className="text-sm text-neutral-dark/70 mt-1">
                    Toutes les fonctionnalités premium seront accessibles gratuitement. Idéal pour la phase de test.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSaveSettings}
          icon={isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          disabled={isSaving}
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>
    </div>
  );
};

export default AppSettings;