import { supabase } from './supabaseClient';

export interface NotificationSettings {
  id?: string;
  user_id: string;
  enabled: boolean;
  morning_time: string;
  evening_reminder: boolean;
  evening_time: string;
  frequency: 'daily' | 'weekdays' | 'custom';
  custom_days: number[];
  created_at?: string;
  updated_at?: string;
}

export interface PushSubscription {
  endpoint: string;
  expirationTime?: number;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Initialise les notifications pour un utilisateur
 */
export const initializeNotifications = async (
  userId: string, 
  userName: string, 
  hdType: string
): Promise<void> => {
  try {
    // Vérifier si les notifications sont supportées
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('Notifications not supported in this browser');
      return;
    }

    // Enregistrer le service worker s'il n'est pas déjà enregistré
    const registration = await navigator.serviceWorker.ready;
    
    // Vérifier les paramètres de notification de l'utilisateur
    const { data: settings } = await getNotificationSettings(userId);
    
    if (settings?.enabled) {
      // Programmer les notifications selon les paramètres
      await scheduleNotifications(userId, userName, hdType, settings);
    }
    
    console.log('Notifications initialized for user:', userName);
  } catch (error) {
    console.error('Error initializing notifications:', error);
    throw error;
  }
};

/**
 * Récupère les paramètres de notification d'un utilisateur
 */
export const getNotificationSettings = async (
  userId: string
): Promise<{ data: NotificationSettings | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Sauvegarde les paramètres de notification
 */
export const saveNotificationSettings = async (
  userId: string,
  settings: Omit<NotificationSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('notification_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;

    // Si les notifications sont activées, programmer les rappels
    if (settings.enabled) {
      await scheduleUserNotifications(userId, settings);
    } else {
      // Si désactivées, supprimer les notifications programmées
      await cancelScheduledNotifications(userId);
    }

    return { error: null };
  } catch (error) {
    console.error('Error saving notification settings:', error);
    return { error: error as Error };
  }
};

/**
 * Demande la permission pour les notifications
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }
    
    if (Notification.permission === 'granted') {
      return true;
    }
    
    if (Notification.permission === 'denied') {
      return false;
    }
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Envoie une notification de test
 */
export const testNotification = async (userName: string, hdType: string): Promise<void> => {
  try {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      throw new Error('Notifications not supported or not permitted');
    }
    
    const messages = getPersonalizedMessages(hdType, userName);
    
    new Notification(`Bonjour ${userName} 🌸`, {
      body: messages.morning,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'test-notification',
      requireInteraction: false,
      silent: false
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    throw error;
  }
};

/**
 * Programme les notifications pour un utilisateur
 */
const scheduleNotifications = async (
  userId: string,
  userName: string,
  hdType: string,
  settings: NotificationSettings
): Promise<void> => {
  try {
    // Supprimer les anciennes notifications programmées
    await cancelScheduledNotifications(userId);
    
    const messages = getPersonalizedMessages(hdType, userName);
    
    // Programmer les notifications du matin
    await scheduleNotification(userId, {
      title: `Bonjour ${userName} 🌸`,
      message: messages.morning,
      time: settings.morning_time,
      frequency: settings.frequency,
      customDays: settings.custom_days,
      type: 'morning'
    });
    
    // Programmer les notifications du soir si activées
    if (settings.evening_reminder) {
      await scheduleNotification(userId, {
        title: `Bonsoir ${userName} 🌙`,
        message: messages.evening,
        time: settings.evening_time,
        frequency: settings.frequency,
        customDays: settings.custom_days,
        type: 'evening'
      });
    }
  } catch (error) {
    console.error('Error scheduling notifications:', error);
    throw error;
  }
};

/**
 * Programme une notification spécifique
 */
const scheduleNotification = async (
  userId: string,
  notification: {
    title: string;
    message: string;
    time: string;
    frequency: 'daily' | 'weekdays' | 'custom';
    customDays: number[];
    type: string;
  }
): Promise<void> => {
  try {
    const now = new Date();
    const [hours, minutes] = notification.time.split(':').map(Number);
    
    // Calculer les prochaines dates selon la fréquence
    const scheduleDates = calculateScheduleDates(
      notification.frequency,
      notification.customDays,
      hours,
      minutes
    );
    
    // Créer les notifications programmées dans la base de données
    const scheduledNotifications = scheduleDates.map(date => ({
      user_id: userId,
      title: notification.title,
      message: notification.message,
      scheduled_for: date.toISOString(),
      type: 'recurring',
      recurrence_pattern: notification.frequency,
      sent: false
    }));
    
    const { error } = await supabase
      .from('scheduled_notifications')
      .insert(scheduledNotifications);
    
    if (error) throw error;
    
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
};

/**
 * Calcule les dates de programmation selon la fréquence
 */
const calculateScheduleDates = (
  frequency: 'daily' | 'weekdays' | 'custom',
  customDays: number[],
  hours: number,
  minutes: number
): Date[] => {
  const dates: Date[] = [];
  const now = new Date();
  
  // Programmer pour les 30 prochains jours
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    date.setHours(hours, minutes, 0, 0);
    
    // Vérifier si cette date correspond à la fréquence
    const dayOfWeek = date.getDay();
    
    let shouldSchedule = false;
    
    switch (frequency) {
      case 'daily':
        shouldSchedule = true;
        break;
      case 'weekdays':
        shouldSchedule = dayOfWeek >= 1 && dayOfWeek <= 5; // Lundi à vendredi
        break;
      case 'custom':
        shouldSchedule = customDays.includes(dayOfWeek);
        break;
    }
    
    if (shouldSchedule && date > now) {
      dates.push(date);
    }
  }
  
  return dates;
};

/**
 * Annule les notifications programmées pour un utilisateur
 */
const cancelScheduledNotifications = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('scheduled_notifications')
      .delete()
      .eq('user_id', userId)
      .eq('sent', false);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error canceling scheduled notifications:', error);
    throw error;
  }
};

/**
 * Programme les notifications pour un utilisateur (fonction helper)
 */
const scheduleUserNotifications = async (
  userId: string,
  settings: NotificationSettings
): Promise<void> => {
  try {
    // Cette fonction sera appelée par un cron job ou un service externe
    // Pour l'instant, on stocke juste les paramètres
    console.log('User notifications scheduled with settings:', settings);
  } catch (error) {
    console.error('Error scheduling user notifications:', error);
    throw error;
  }
};

/**
 * Messages personnalisés selon le type HD
 */
const getPersonalizedMessages = (hdType: string, userName: string) => {
  const messages = {
    generator: {
      morning: `Ton énergie sacrale a-t-elle quelque chose à te dire aujourd'hui ? Écoute tes réponses intérieures et fais ton scan énergétique ✨`,
      evening: `Comment ton sacral a-t-il vécu cette journée ? Prends un moment pour faire le point sur ton énergie 🌙`
    },
    projector: {
      morning: `Quelle est la qualité de ton énergie ce matin ? Prends un moment pour observer ton état énergétique ✨`,
      evening: `As-tu été reconnue aujourd'hui ? Observe ce que ton énergie a vécu et fais ton bilan 🌙`
    },
    'manifesting-generator': {
      morning: `Ton énergie multi-passionnée est-elle alignée ? Scanne tes différentes facettes énergétiques ⚡`,
      evening: `Comment tes multiples énergies ont-elles dansé aujourd'hui ? Fais le point sur ton alignement 🌙`
    },
    manifestor: {
      morning: `Ton énergie d'initiation est-elle prête à créer ? Scanne ton potentiel de manifestation du jour 🔥`,
      evening: `As-tu pu initier librement aujourd'hui ? Observe l'état de ton énergie créatrice 🌙`
    },
    reflector: {
      morning: `Que reflète ton énergie de l'environnement aujourd'hui ? Observe les nuances de ton miroir énergétique 🔍`,
      evening: `Qu'as-tu reflété du monde aujourd'hui ? Prends le temps d'observer tes perceptions 🌙`
    }
  };
  
  return messages[hdType] || messages.generator;
};

/**
 * Envoie une notification immédiate
 */
export const sendImmediateNotification = async (
  userId: string,
  title: string,
  message: string,
  actionUrl?: string
): Promise<{ error: Error | null }> => {
  try {
    // Envoyer la notification via l'API du navigateur si possible
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: `immediate-${Date.now()}`,
        requireInteraction: false,
        silent: false
      });
    }
    
    // Sauvegarder aussi dans la base pour l'historique
    const { error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        type: 'immediate',
        title,
        message,
        action_url: actionUrl || '',
        is_read: false
      }]);
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error('Error sending immediate notification:', error);
    return { error: error as Error };
  }
};