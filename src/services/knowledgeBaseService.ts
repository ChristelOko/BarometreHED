import { supabase } from './supabaseClient';

export interface KnowledgeBaseEntry {
  id: string;
  category: string;
  title: string;
  content: string;
}

export interface GuidanceResult {
  guidance: string;
  mantra: {
    inhale: string;
    exhale: string;
  };
  realignmentExercise?: string;
}

export const getGuidanceByType = async (
  hdType: string,
  score: number,
  center: string
): Promise<GuidanceResult | null> => {
  try {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('category', 'guidance')
      .eq('hd_type', hdType)
      .gte('min_score', score)
      .lte('max_score', score)
      .eq('center', center);

    if (error) throw error;
    if (!data || data.length === 0) return null;

    // Return the first matching guidance
    return {
      guidance: data[0].content,
      mantra: data[0].mantra,
      realignmentExercise: data[0].realignment_exercise
    };
  } catch (error) {
    console.error('Error fetching guidance:', error);
    return null;
  }
};

export const saveResult = async (
  scanId: string,
  guidance: string,
  mantra: { inhale: string; exhale: string },
  realignmentExercise?: string
) => {
  try {
    const { error } = await supabase
      .from('results')
      .insert([
        {
          scan_id: scanId,
          guidance,
          mantra,
          realignment_exercise: realignmentExercise
        }
      ]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error saving result:', error);
    return { error };
  }
};

export const getResultByScanId = async (scanId: string): Promise<GuidanceResult | null> => {
  try {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('scan_id', scanId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      guidance: data.guidance,
      mantra: data.mantra,
      realignmentExercise: data.realignment_exercise
    };
  } catch (error) {
    console.error('Error fetching result:', error);
    return null;
  }
};