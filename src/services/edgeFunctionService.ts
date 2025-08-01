import { supabase } from './supabaseClient';

/**
 * Interface pour la réponse de l'Edge Function make-admin
 */
interface MakeAdminResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Appelle l'Edge Function pour promouvoir un utilisateur en tant qu'administrateur
 */
export const makeUserAdmin = async (email: string): Promise<MakeAdminResponse> => {
  try {
    if (!email || !email.includes('@')) {
      return {
        success: false,
        error: 'Adresse email invalide'
      };
    }

    // Construire l'URL de l'Edge Function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      return {
        success: false,
        error: 'Configuration Supabase manquante'
      };
    }

    const functionUrl = `${supabaseUrl}/functions/v1/make-admin`;

    // Faire l'appel à l'Edge Function
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge Function response error:', errorText);
      
      return {
        success: false,
        error: `Erreur HTTP ${response.status}: ${errorText}`
      };
    }

    const result = await response.json();
    
    if (result.success) {
      return {
        success: true,
        message: result.message || 'Utilisateur promu administrateur avec succès'
      };
    } else {
      return {
        success: false,
        error: result.error || 'Erreur inconnue lors de la promotion'
      };
    }

  } catch (error) {
    console.error('Error calling make-admin Edge Function:', error);
    
    // Fournir des messages d'erreur plus spécifiques
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.'
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

/**
 * Teste la connectivité avec les Edge Functions
 */
export const testEdgeFunctionConnectivity = async (): Promise<boolean> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) return false;

    // Tester avec un endpoint simple (health check si disponible)
    const response = await fetch(`${supabaseUrl}/functions/v1/make-admin`, {
      method: 'OPTIONS',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Edge Function connectivity test failed:', error);
    return false;
  }
};