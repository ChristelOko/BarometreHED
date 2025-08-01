import { supabase } from './supabaseClient';

export interface EnergeticReading {
  id: string;
  date: string;
  day_number: number;
  day_energy: string;
  month_energy: string;
  year_energy: string;
  description: string;
  mantra: string;
  created_at: string;
}

// Cache pour éviter les requêtes répétées
let todayReadingCache: EnergeticReading | null = null;
let cacheDate: string | null = null;

export const getTodayEnergeticReading = async (): Promise<EnergeticReading | null> => {
  const today = new Date().toISOString().split('T')[0];
  
  // Vérifier le cache
  if (todayReadingCache && cacheDate === today) {
    return todayReadingCache;
  }

  try {
    const { data, error } = await supabase
      .from('energetic_readings')
      .select('*')
      .eq('date', today)
      .maybeSingle();

    if (error) throw error;

    // Mettre en cache
    todayReadingCache = data;
    cacheDate = today;

    return data;
  } catch (error) {
    console.error('Error fetching today energetic reading:', error);
    return null;
  }
};

export const getEnergeticReadingByDate = async (date: string): Promise<EnergeticReading | null> => {
  try {
    const { data, error } = await supabase
      .from('energetic_readings')
      .select('*')
      .eq('date', date)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching energetic reading by date:', error);
    return null;
  }
};

export const getRecentEnergeticReadings = async (limit: number = 7): Promise<EnergeticReading[]> => {
  try {
    const { data, error } = await supabase
      .from('energetic_readings')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent energetic readings:', error);
    return [];
  }
};

// Fonction pour créer une lecture énergétique (pour les admins)
export const createEnergeticReading = async (reading: Omit<EnergeticReading, 'id' | 'created_at'>): Promise<{ data: EnergeticReading | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('energetic_readings')
      .insert([reading])
      .select()
      .single();

    if (error) throw error;

    // Invalider le cache si c'est la lecture d'aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    if (reading.date === today) {
      todayReadingCache = null;
      cacheDate = null;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating energetic reading:', error);
    return { data: null, error: error as Error };
  }
};

// Fonction pour invalider le cache
export const invalidateEnergeticReadingCache = (): void => {
  todayReadingCache = null;
  cacheDate = null;
};