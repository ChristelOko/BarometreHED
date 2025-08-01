import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Bell, Lock, LogOut, Smartphone, ArrowLeft, Palette, Globe } from 'lucide-react';
import Button from '../../components/common/Button';
import NotificationSettings from '../../components/settings/NotificationSettings';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useNotifications } from '../../hooks/useNotifications';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { isSupported: notificationsSupported } = useNotifications();
  const [activeTab, setActiveTab] = useState('general');
  const [hdType, setHdType] = useState(user?.hdType || 'generator');

  const hdTypes = [
    { 
      value: 'generator', 
      label: 'Generator',
      description: 'Tu as une énergie vitale constante et créatrice. Tu réponds aux opportunités qui se présentent.',
      characteristics: ['Énergie sacrale', 'Réponse gut feeling', 'Endurance naturelle']
    },
    { 
      value: 'projector', 
      label: 'Projector',
      description: 'Tu es un guide naturel avec une capacité unique à voir les autres et les systèmes.',
      characteristics: ['Sagesse intuitive', 'Besoin de reconnaissance', 'Énergie focalisée']
    },
    { 
      value: 'manifesting-generator', 
      label: 'Manifesting Generator',
      description: 'Tu combines l\'énergie du Generator avec la capacité d\'initiation du Manifestor.',
      characteristics: ['Multi-passionné', 'Énergie rapide', 'Capacité de manifestation']
    },
    { 
      value: 'manifestor', 
      label: 'Manifestor',
      description: 'Tu es un initiateur naturel avec la capacité de créer et d\'impacter.',
      characteristics: ['Énergie d\'initiation', 'Indépendance', 'Impact sur les autres']
    },
    { 
      value: 'reflector', 
      label: 'Reflector',
      description: 'Tu es un miroir de ton environnement avec une sagesse cyclique unique.',
      characteristics: ['Sensibilité environnementale', 'Sagesse lunaire', 'Perspective unique']
    }
  ];

  useEffect(() => {
    // Apply dark mode class to body
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleSaveHdType = async () => {
    try {
      await updateUser({ hdType });
      alert('Type Human Design mis à jour avec succès !');
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentHdType = hdTypes.find(type => type.value === hdType);

  return (
    <div className="min-h-screen py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
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
              Retour au profil
            </Button>
            <div>
              <h1 className="font-display text-3xl mb-2">Paramètres</h1>
              <p className="text-neutral-dark/70">
                Personnalisez votre expérience Baromètre Énergétique
              </p>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex flex-wrap border-b border-neutral-dark/10 mb-8">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 font-medium flex items-center ${
                activeTab === 'general'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-dark hover:text-primary'
              }`}
            >
              <Palette size={16} className="mr-2" />
              Général
            </button>
            
            <button
              onClick={() => setActiveTab('hd-type')}
              className={`px-6 py-3 font-medium flex items-center ${
                activeTab === 'hd-type'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-dark hover:text-primary'
              }`}
            >
              <Globe size={16} className="mr-2" />
              Human Design
            </button>

            {notificationsSupported && (
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-6 py-3 font-medium flex items-center ${
                  activeTab === 'notifications'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-dark hover:text-primary'
                }`}
              >
                <Smartphone size={16} className="mr-2" />
                Notifications
              </button>
            )}

            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 font-medium flex items-center ${
                activeTab === 'security'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-dark hover:text-primary'
              }`}
            >
              <Lock size={16} className="mr-2" />
              Sécurité
            </button>
          </div>

          {/* Contenu des onglets */}
          <div className="space-y-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                {/* Mode sombre */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {isDarkMode ? (
                        <Moon size={20} className="text-primary mr-3" />
                      ) : (
                        <Sun size={20} className="text-primary mr-3" />
                      )}
                      <div>
                        <h3 className="font-display text-lg">Mode sombre</h3>
                        <p className="text-sm text-neutral-dark/70">
                          Adaptez l'interface à votre confort visuel
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        isDarkMode ? 'bg-primary' : 'bg-neutral-dark/20'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                          isDarkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Langue */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe size={20} className="text-primary mr-3" />
                      <div>
                        <h3 className="font-display text-lg">Langue</h3>
                        <p className="text-sm text-neutral-dark/70">
                          Choisissez votre langue préférée
                        </p>
                      </div>
                    </div>
                    <select className="input-field w-32">
                      <option value="fr">Français</option>
                      <option value="en" disabled>English (bientôt)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hd-type' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="font-display text-xl mb-4">Votre Type Human Design</h2>
                  <p className="text-neutral-dark/70 mb-6">
                    Votre type HD détermine l'analyse de vos résultats et les conseils personnalisés que vous recevez.
                  </p>
                  
                  <div className="grid gap-4 mb-6">
                    {hdTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        onClick={() => setHdType(type.value)}
                        className={`p-6 rounded-xl text-left transition-all ${
                          hdType === type.value
                            ? 'bg-primary/20 border-2 border-primary'
                            : 'bg-neutral hover:bg-primary/10 border-2 border-transparent'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className={`font-display text-lg ${
                            hdType === type.value ? 'text-primary' : 'text-neutral-dark'
                          }`}>
                            {type.label}
                          </h3>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            hdType === type.value
                              ? 'border-primary bg-primary'
                              : 'border-neutral-dark/30'
                          }`}>
                            {hdType === type.value && (
                              <div className="w-3 h-3 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <p className="text-neutral-dark/80 mb-3">{type.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {type.characteristics.map((char, index) => (
                            <span
                              key={index}
                              className={`px-3 py-1 rounded-full text-xs ${
                                hdType === type.value
                                  ? 'bg-primary/30 text-primary'
                                  : 'bg-neutral-dark/10 text-neutral-dark/70'
                              }`}
                            >
                              {char}
                            </span>
                          ))}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {hdType !== user?.hdType && (
                    <div className="p-4 bg-primary/5 rounded-xl mb-4">
                      <p className="text-sm text-primary">
                        ⚠️ Vous avez sélectionné un type différent de votre profil actuel. 
                        Cliquez sur "Sauvegarder" pour confirmer le changement.
                      </p>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    onClick={handleSaveHdType}
                    disabled={hdType === user?.hdType}
                    fullWidth
                  >
                    Sauvegarder mon type HD
                  </Button>
                </div>

                {/* Informations sur le type sélectionné */}
                {currentHdType && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-display text-xl mb-4">
                      À propos du type {currentHdType.label}
                    </h3>
                    <p className="text-neutral-dark/80 mb-4">{currentHdType.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currentHdType.characteristics.map((char, index) => (
                        <div key={index} className="p-3 bg-primary/5 rounded-lg text-center">
                          <span className="text-sm font-medium text-primary">{char}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notifications' && notificationsSupported && (
              <NotificationSettings />
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Mot de passe */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <Lock size={20} className="text-primary mr-3" />
                    <h3 className="font-display text-lg">Sécurité du compte</h3>
                  </div>
                  <p className="text-neutral-dark/70 mb-4">
                    Gérez la sécurité de votre compte et vos préférences de confidentialité.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/profile/change-password')}
                    fullWidth
                  >
                    Modifier le mot de passe
                  </Button>
                </div>

                {/* Déconnexion */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <LogOut size={20} className="text-error mr-3" />
                    <h3 className="font-display text-lg">Déconnexion</h3>
                  </div>
                  <p className="text-neutral-dark/70 mb-4">
                    Déconnectez-vous de votre compte sur cet appareil.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-error hover:bg-error/10 hover:text-error border-error/20"
                    fullWidth
                  >
                    Se déconnecter
                  </Button>
                </div>

                {/* Suppression du compte */}
                <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-error/20">
                  <h3 className="font-display text-lg text-error mb-2">Zone de danger</h3>
                  <p className="text-neutral-dark/70 mb-4">
                    Ces actions sont irréversibles. Procédez avec prudence.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => alert('Fonctionnalité à venir')}
                    className="text-error hover:bg-error/10 hover:text-error border-error/20"
                    fullWidth
                  >
                    Supprimer mon compte
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;