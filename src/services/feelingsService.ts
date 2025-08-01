import { supabase } from './supabaseClient';
import { Feeling, CategoryType } from '../types/feelings';

/**
 * Récupère tous les ressentis
 */
export const getAllFeelings = async (): Promise<{ data: Feeling[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('feelings')
      .select('*')
      .order('is_positive', { ascending: false })
      .order('name');

    if (error) throw error;

    // Transformer les données pour correspondre au type Feeling
    const feelings = data?.map(item => ({
      id: item.id,
      name: item.name,
      type_hd: item.type_hd,
      category: item.category as CategoryType,
      description: item.description,
      probableOrigin: item.probable_origin,
      affectedCenters: (item.affected_centers || []).map((center: any) => {
        if (typeof center === 'string') return center;
        if (typeof center === 'object' && center.center) return center.center;
        return 'unknown';
      }),
      mirrorPhrase: item.mirror_phrase,
      realignmentExercise: item.realignment_exercise,
      mantra: {
        inhale: item.mantra_inhale,
        exhale: item.mantra_exhale
      },
      encouragement: item.encouragement,
      isPositive: item.is_positive
    }));

    return { data: feelings, error: null };
  } catch (error) {
    console.error('Error fetching feelings:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Récupère les ressentis par catégorie
 */
export const getFeelingsByCategory = async (category: CategoryType): Promise<{ data: Feeling[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('feelings')
      .select('*')
      .eq('category', category)
      .order('is_positive', { ascending: false })
      .order('name');

    if (error) throw error;

    // Transformer les données pour correspondre au type Feeling
    const feelings = data?.map(item => ({
      id: item.id,
      name: item.name,
      type_hd: item.type_hd,
      category: item.category as CategoryType,
      description: item.description,
      probableOrigin: item.probable_origin,
      affectedCenters: (item.affected_centers || []).map((center: any) => {
        if (typeof center === 'string') return center;
        if (typeof center === 'object' && center.center) return center.center;
        return 'unknown';
      }),
      mirrorPhrase: item.mirror_phrase,
      realignmentExercise: item.realignment_exercise,
      mantra: {
        inhale: item.mantra_inhale,
        exhale: item.mantra_exhale
      },
      encouragement: item.encouragement,
      isPositive: item.is_positive
    }));

    return { data: feelings, error: null };
  } catch (error) {
    console.error(`Error fetching feelings for category ${category}:`, error);
    return { data: null, error: error as Error };
  }
};

/**
 * Récupère les ressentis positifs par catégorie
 */
export const getPositiveFeelings = async (category: CategoryType): Promise<{ data: Feeling[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('feelings')
      .select('*')
      .eq('category', category)
      .eq('is_positive', true)
      .order('name');

    if (error) throw error;

    // Transformer les données pour correspondre au type Feeling
    const feelings = data?.map(item => ({
      id: item.id,
      name: item.name,
      type_hd: item.type_hd,
      category: item.category as CategoryType,
      description: item.description,
      probableOrigin: item.probable_origin,
      affectedCenters: (item.affected_centers || []).map((center: any) => {
        if (typeof center === 'string') return center;
        if (typeof center === 'object' && center.center) return center.center;
        return 'unknown';
      }),
      mirrorPhrase: item.mirror_phrase,
      realignmentExercise: item.realignment_exercise,
      mantra: {
        inhale: item.mantra_inhale,
        exhale: item.mantra_exhale
      },
      encouragement: item.encouragement,
      isPositive: item.is_positive
    }));

    return { data: feelings, error: null };
  } catch (error) {
    console.error(`Error fetching positive feelings for category ${category}:`, error);
    return { data: null, error: error as Error };
  }
};

/**
 * Récupère les ressentis négatifs par catégorie
 */
export const getNegativeFeelings = async (category: CategoryType): Promise<{ data: Feeling[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('feelings')
      .select('*')
      .eq('category', category)
      .eq('is_positive', false)
      .order('name');

    if (error) throw error;

    // Transformer les données pour correspondre au type Feeling
    const feelings = data?.map(item => ({
      id: item.id,
      name: item.name,
      type_hd: item.type_hd,
      category: item.category as CategoryType,
      description: item.description,
      probableOrigin: item.probable_origin,
      affectedCenters: (item.affected_centers || []).map((center: any) => {
        if (typeof center === 'string') return center;
        if (typeof center === 'object' && center.center) return center.center;
        return 'unknown';
      }),
      mirrorPhrase: item.mirror_phrase,
      realignmentExercise: item.realignment_exercise,
      mantra: {
        inhale: item.mantra_inhale,
        exhale: item.mantra_exhale
      },
      encouragement: item.encouragement,
      isPositive: item.is_positive
    }));

    return { data: feelings, error: null };
  } catch (error) {
    console.error(`Error fetching negative feelings for category ${category}:`, error);
    return { data: null, error: error as Error };
  }
};

/**
 * Ajoute un nouveau ressenti
 */
export const addFeeling = async (feeling: Omit<Feeling, 'id'>): Promise<{ data: Feeling | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('feelings')
      .insert([{
        name: feeling.name,
        category: feeling.category,
        type_hd: feeling.type_hd,
        description: feeling.description,
        probable_origin: feeling.probableOrigin,
        affected_centers: feeling.affectedCenters,
        mirror_phrase: feeling.mirrorPhrase,
        realignment_exercise: feeling.realignmentExercise,
        mantra_inhale: feeling.mantra.inhale,
        mantra_exhale: feeling.mantra.exhale,
        encouragement: feeling.encouragement,
        is_positive: feeling.isPositive
      }])
      .select()
      .single();

    if (error) throw error;

    // Transformer les données pour correspondre au type Feeling
    const newFeeling: Feeling = {
      id: data.id,
      name: data.name,
      type_hd: data.type_hd,
      category: data.category as CategoryType,
      description: data.description,
      probableOrigin: data.probable_origin,
      affectedCenters: data.affected_centers?.map((center: any) => 
        typeof center === 'string' ? center : center.center || center
      ) || [],
      mirrorPhrase: data.mirror_phrase,
      realignmentExercise: data.realignment_exercise,
      mantra: {
        inhale: data.mantra_inhale,
        exhale: data.mantra_exhale
      },
      encouragement: data.encouragement,
      isPositive: data.is_positive
    };

    return { data: newFeeling, error: null };
  } catch (error) {
    console.error('Error adding feeling:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Met à jour un ressenti existant
 */
export const updateFeeling = async (id: string, feeling: Partial<Omit<Feeling, 'id'>>): Promise<{ data: Feeling | null; error: Error | null }> => {
  try {
    // Préparer les données pour la mise à jour
    const updateData: any = {};
    
    if (feeling.name !== undefined) updateData.name = feeling.name;
    if (feeling.category !== undefined) updateData.category = feeling.category;
    if (feeling.type_hd !== undefined) updateData.type_hd = feeling.type_hd;
    if (feeling.description !== undefined) updateData.description = feeling.description;
    if (feeling.probableOrigin !== undefined) updateData.probable_origin = feeling.probableOrigin;
    if (feeling.affectedCenters !== undefined) updateData.affected_centers = feeling.affectedCenters;
    if (feeling.mirrorPhrase !== undefined) updateData.mirror_phrase = feeling.mirrorPhrase;
    if (feeling.realignmentExercise !== undefined) updateData.realignment_exercise = feeling.realignmentExercise;
    if (feeling.mantra?.inhale !== undefined) updateData.mantra_inhale = feeling.mantra.inhale;
    if (feeling.mantra?.exhale !== undefined) updateData.mantra_exhale = feeling.mantra.exhale;
    if (feeling.encouragement !== undefined) updateData.encouragement = feeling.encouragement;
    if (feeling.isPositive !== undefined) updateData.is_positive = feeling.isPositive;

    const { data, error } = await supabase
      .from('feelings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Transformer les données pour correspondre au type Feeling
    const updatedFeeling: Feeling = {
      id: data.id,
      name: data.name,
      type_hd: data.type_hd,
      category: data.category as CategoryType,
      description: data.description,
      probableOrigin: data.probable_origin,
      affectedCenters: data.affected_centers?.map((center: any) => 
        typeof center === 'string' ? center : center.center || center
      ) || [],
      mirrorPhrase: data.mirror_phrase,
      realignmentExercise: data.realignment_exercise,
      mantra: {
        inhale: data.mantra_inhale,
        exhale: data.mantra_exhale
      },
      encouragement: data.encouragement,
      isPositive: data.is_positive
    };

    return { data: updatedFeeling, error: null };
  } catch (error) {
    console.error('Error updating feeling:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Supprime un ressenti
 */
export const deleteFeeling = async (id: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('feelings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error deleting feeling:', error);
    return { error: error as Error };
  }
};