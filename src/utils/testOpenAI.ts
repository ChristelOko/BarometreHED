/**
 * Test de la clé OpenAI pour vérifier la connectivité
 */
import OpenAI from 'openai';

export const testOpenAIConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        message: 'Clé OpenAI non trouvée dans les variables d\'environnement'
      };
    }

    if (apiKey.includes('your_openai_api_key') || apiKey === 'demo_key') {
      return {
        success: false,
        message: 'Clé OpenAI est une valeur de démonstration, pas une vraie clé'
      };
    }

    console.log('🔑 Test de la clé OpenAI...');
    
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });

    // Test simple avec un prompt minimal
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: 'Réponds simplement "Test réussi" si tu me reçois.'
        }
      ],
      max_tokens: 10,
      temperature: 0.1
    });

    const response = completion.choices[0]?.message?.content || '';
    
    return {
      success: true,
      message: `✅ Clé OpenAI fonctionnelle ! Réponse: "${response}"`,
      details: {
        model: completion.model,
        usage: completion.usage,
        response: response
      }
    };

  } catch (error: any) {
    console.error('❌ Erreur test OpenAI:', error);
    
    let errorMessage = 'Erreur inconnue';
    
    if (error.status === 401) {
      errorMessage = 'Clé OpenAI invalide ou expirée (401 Unauthorized)';
    } else if (error.status === 429) {
      errorMessage = 'Limite de taux atteinte (429 Too Many Requests)';
    } else if (error.status === 403) {
      errorMessage = 'Accès refusé - vérifiez les permissions de la clé (403 Forbidden)';
    } else if (error.code === 'insufficient_quota') {
      errorMessage = 'Quota insuffisant sur le compte OpenAI';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: `❌ ${errorMessage}`,
      details: {
        status: error.status,
        code: error.code,
        type: error.type
      }
    };
  }
};