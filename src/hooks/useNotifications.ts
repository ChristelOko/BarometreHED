import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { initializeNotifications, getNotificationSettings } from '../services/notificationService';

export const useNotifications = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Vérifier le support des notifications
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    const setupNotifications = async () => {
      if (isAuthenticated && user?.id && user?.name && user?.hdType && isSupported) {
        try {
          // Vérifier les paramètres de l'utilisateur
          const { data: settings } = await getNotificationSettings(user.id);
          
          if (settings?.enabled) {
            setIsEnabled(true);
            await initializeNotifications(user.id, user.name, user.hdType);
            console.log('Notifications initialisées pour', user.name);
          }
        } catch (error) {
          console.error('Erreur lors de l\'initialisation des notifications:', error);
        }
      }
    };

    // Délai pour laisser le temps à l'app de se charger
    const timer = setTimeout(setupNotifications, 2000);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, isSupported]);

  // Écouter les changements de permission
  useEffect(() => {
    if (!isSupported) return;

    const handlePermissionChange = () => {
      setPermission(Notification.permission);
    };

    // Vérifier périodiquement les changements de permission
    const interval = setInterval(handlePermissionChange, 5000);
    
    return () => clearInterval(interval);
  }, [isSupported]);

  return {
    isSupported,
    permission,
    isEnabled,
    canReceiveNotifications: isSupported && permission === 'granted' && isEnabled
  };
};