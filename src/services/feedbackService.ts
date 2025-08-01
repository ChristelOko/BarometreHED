import { supabase } from './supabaseClient';

export interface Feedback {
  id?: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment?: string;
  is_public?: boolean;
  created_at?: string;
}

/**
 * Récupère tous les feedbacks publics
 */
export const getPublicFeedbacks = async (): Promise<{ data: Feedback[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching public feedbacks:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Soumet un nouveau feedback
 */
export const submitFeedback = async (feedback: Omit<Feedback, 'id' | 'created_at'>): Promise<{ data: Feedback | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .insert([{
        user_id: feedback.user_id,
        user_name: feedback.user_name,
        rating: feedback.rating,
        comment: feedback.comment,
        is_public: feedback.is_public ?? true
      }])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Récupère les feedbacks d'un utilisateur spécifique
 */
export const getUserFeedbacks = async (userId: string): Promise<{ data: Feedback[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user feedbacks:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Met à jour un feedback existant
 */
export const updateFeedback = async (feedbackId: string, updates: Partial<Feedback>): Promise<{ data: Feedback | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .update(updates)
      .eq('id', feedbackId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating feedback:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Supprime un feedback
 */
export const deleteFeedback = async (feedbackId: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('feedbacks')
      .delete()
      .eq('id', feedbackId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return { error: error as Error };
  }
};