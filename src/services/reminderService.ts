import { supabase } from './supabaseClient';

export interface Reminder {
  id?: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  type: 'exercise' | 'practice' | 'ritual';
  completed?: boolean;
  auto_generated?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly';
  priority?: 'low' | 'medium' | 'high';
  scan_id?: string;
  created_at?: string;
}

/**
 * Récupère les rappels d'un utilisateur
 */
export const getUserReminders = async (
  userId: string,
  completed?: boolean,
  limit?: number
): Promise<{ data: Reminder[] | null; error: Error | null }> => {
  try {
    let query = supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    if (completed !== undefined) {
      query = query.eq('completed', completed);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Récupère les rappels du jour
 */
export const getTodayReminders = async (
  userId: string
): Promise<{ data: Reminder[] | null; error: Error | null }> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .eq('completed', false)
      .order('priority', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching today reminders:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Récupère les rappels à venir
 */
export const getUpcomingReminders = async (
  userId: string,
  days: number = 7
): Promise<{ data: Reminder[] | null; error: Error | null }> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .gte('date', today)
      .lte('date', futureDateStr)
      .eq('completed', false)
      .order('date', { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching upcoming reminders:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Crée un nouveau rappel
 */
export const createReminder = async (
  reminder: Omit<Reminder, 'id' | 'created_at'>
): Promise<{ data: Reminder | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('reminders')
      .insert([{
        ...reminder,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error creating reminder:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Met à jour un rappel
 */
export const updateReminder = async (
  reminderId: string,
  updates: Partial<Reminder>
): Promise<{ data: Reminder | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('reminders')
      .update(updates)
      .eq('id', reminderId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating reminder:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Supprime un rappel
 */
export const deleteReminder = async (
  reminderId: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', reminderId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return { error: error as Error };
  }
};

/**
 * Marque un rappel comme terminé
 */
export const completeReminder = async (
  reminderId: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('reminders')
      .update({ completed: true })
      .eq('id', reminderId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error completing reminder:', error);
    return { error: error as Error };
  }
};

/**
 * Génère automatiquement des rappels basés sur les résultats d'un scan
 */
export const generateRemindersFromScan = async (
  userId: string,
  scanId: string,
  score: number,
  center: string,
  hdType?: string
): Promise<{ error: Error | null }> => {
  try {
    const reminders: Omit<Reminder, 'id' | 'created_at'>[] = [];
    const today = new Date();
    
    // Rappels basés sur le score
    if (score < 40) {
      // Score faible - rappels de récupération
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      reminders.push({
        user_id: userId,
        scan_id: scanId,
        title: '🌿 Moment de repos',
        description: 'Votre énergie demande de la douceur. Prenez 10 minutes pour vous reposer et vous reconnecter.',
        date: tomorrow.toISOString().split('T')[0],
        type: 'practice',
        auto_generated: true,
        priority: 'high'
      });
    } else if (score > 80) {
      // Score élevé - rappels de maintien
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      reminders.push({
        user_id: userId,
        scan_id: scanId,
        title: '✨ Célébrer votre énergie',
        description: 'Votre énergie est florissante ! Prenez un moment pour la célébrer et la partager.',
        date: tomorrow.toISOString().split('T')[0],
        type: 'ritual',
        auto_generated: true,
        priority: 'medium'
      });
    }

    // Rappels basés sur le centre HD affecté
    const centerReminders = getCenterSpecificReminders(center, userId, scanId);
    reminders.push(...centerReminders);

    // Rappels basés sur le type HD
    if (hdType) {
      const hdReminders = getHDTypeReminders(hdType, userId, scanId);
      reminders.push(...hdReminders);
    }

    // Insérer les rappels en base
    if (reminders.length > 0) {
      const { error } = await supabase
        .from('reminders')
        .insert(reminders);

      if (error) throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Error generating reminders:', error);
    return { error: error as Error };
  }
};

/**
 * Rappels spécifiques aux centres HD
 */
const getCenterSpecificReminders = (
  center: string,
  userId: string,
  scanId: string
): Omit<Reminder, 'id' | 'created_at'>[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const centerReminders: Record<string, Omit<Reminder, 'id' | 'created_at'>> = {
    'solar-plexus': {
      user_id: userId,
      scan_id: scanId,
      title: '💗 Respiration émotionnelle',
      description: 'Votre plexus solaire demande attention. Pratiquez 5 respirations profondes pour harmoniser vos émotions.',
      date: tomorrowStr,
      type: 'exercise',
      auto_generated: true,
      priority: 'medium'
    },
    'heart': {
      user_id: userId,
      scan_id: scanId,
      title: '❤️ Écouter votre cœur',
      description: 'Votre centre cœur est actif. Prenez un moment pour écouter votre vérité intérieure et honorer vos besoins.',
      date: tomorrowStr,
      type: 'practice',
      auto_generated: true,
      priority: 'medium'
    },
    'sacral': {
      user_id: userId,
      scan_id: scanId,
      title: '🔥 Honorer votre énergie vitale',
      description: 'Votre sacral vous parle. Respectez vos rythmes naturels et écoutez vos réponses corporelles.',
      date: tomorrowStr,
      type: 'practice',
      auto_generated: true,
      priority: 'medium'
    },
    'throat': {
      user_id: userId,
      scan_id: scanId,
      title: '🗣️ Expression authentique',
      description: 'Votre centre gorge a besoin d\'expression. Prenez le temps de dire votre vérité aujourd\'hui.',
      date: tomorrowStr,
      type: 'practice',
      auto_generated: true,
      priority: 'medium'
    },
    'g-center': {
      user_id: userId,
      scan_id: scanId,
      title: '🧭 Reconnexion à votre identité',
      description: 'Votre centre G vous guide vers votre direction. Prenez un moment pour vous reconnecter à qui vous êtes.',
      date: tomorrowStr,
      type: 'practice',
      auto_generated: true,
      priority: 'medium'
    }
  };

  return centerReminders[center] ? [centerReminders[center]] : [];
};

/**
 * Rappels spécifiques aux types HD
 */
const getHDTypeReminders = (
  hdType: string,
  userId: string,
  scanId: string
): Omit<Reminder, 'id' | 'created_at'>[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const hdReminders: Record<string, Omit<Reminder, 'id' | 'created_at'>> = {
    'projector': {
      user_id: userId,
      scan_id: scanId,
      title: '👁️ Moment d\'observation',
      description: 'En tant que Projector, prenez du recul pour retrouver votre clarté et votre sagesse unique.',
      date: tomorrowStr,
      type: 'practice',
      auto_generated: true,
      priority: 'medium'
    },
    'generator': {
      user_id: userId,
      scan_id: scanId,
      title: '⚡ Écouter votre sacral',
      description: 'Generator, écoutez les signaux de votre corps pour vos prochaines décisions et engagements.',
      date: tomorrowStr,
      type: 'practice',
      auto_generated: true,
      priority: 'medium'
    },
    'manifesting-generator': {
      user_id: userId,
      scan_id: scanId,
      title: '🌟 Honorer votre multi-passion',
      description: 'Manifesting Generator, respectez votre besoin de variété et vos changements de direction naturels.',
      date: tomorrowStr,
      type: 'practice',
      auto_generated: true,
      priority: 'medium'
    },
    'manifestor': {
      user_id: userId,
      scan_id: scanId,
      title: '🚀 Informer avec grâce',
      description: 'Manifestor, n\'oubliez pas d\'informer votre entourage de vos initiatives pour maintenir l\'harmonie.',
      date: tomorrowStr,
      type: 'practice',
      auto_generated: true,
      priority: 'medium'
    },
    'reflector': {
      user_id: userId,
      scan_id: scanId,
      title: '🌙 Cycle lunaire de décision',
      description: 'Reflector, prenez le temps d\'un cycle lunaire pour toute décision importante. Observez sans vous presser.',
      date: tomorrowStr,
      type: 'practice',
      auto_generated: true,
      priority: 'medium'
    }
  };

  return hdReminders[hdType] ? [hdReminders[hdType]] : [];
};

/**
 * Crée des rappels récurrents
 */
export const createRecurringReminder = async (
  userId: string,
  title: string,
  description: string,
  time: string,
  frequency: 'daily' | 'weekly' | 'monthly',
  type: 'exercise' | 'practice' | 'ritual',
  priority: 'low' | 'medium' | 'high' = 'medium'
): Promise<{ error: Error | null }> => {
  try {
    const reminders: Omit<Reminder, 'id' | 'created_at'>[] = [];
    const today = new Date();
    
    // Générer les rappels pour les 30 prochains jours
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      let shouldCreate = false;
      
      switch (frequency) {
        case 'daily':
          shouldCreate = true;
          break;
        case 'weekly':
          shouldCreate = date.getDay() === today.getDay();
          break;
        case 'monthly':
          shouldCreate = date.getDate() === today.getDate();
          break;
      }
      
      if (shouldCreate) {
        reminders.push({
          user_id: userId,
          title,
          description,
          date: date.toISOString().split('T')[0],
          type,
          frequency,
          priority,
          auto_generated: false,
          completed: false
        });
      }
    }
    
    if (reminders.length > 0) {
      const { error } = await supabase
        .from('reminders')
        .insert(reminders);
      
      if (error) throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error creating recurring reminder:', error);
    return { error: error as Error };
  }
};