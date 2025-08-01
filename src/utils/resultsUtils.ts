import { getGuidanceByType } from '../services/knowledgeBaseService';
import { Feeling } from '../store/feelingsStore';

export const calculateOverallScore = (scores: number[]): number => {
  if (scores.length === 0) return 50;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};

export const determineAffectedCenter = (selectedFeelingNames: string[], allFeelings: Feeling[]): string => {
  const centerCounts: Record<string, number> = {};
  
  selectedFeelingNames.forEach(feelingName => {
    // Find the feeling in all feelings
    const feeling = allFeelings.find(f => f.name === feelingName);
    
    if (feeling?.affectedCenters) {
      // Handle both string[] and object[] formats for affectedCenters
      feeling.affectedCenters.forEach((centerData: any) => {
        // Extract center name from either string or object format
        const center = typeof centerData === 'string' 
          ? centerData 
          : (centerData.center || centerData);
        
        centerCounts[center] = (centerCounts[center] || 0) + 1;
      });
    }
  });

  let mostAffectedCenter = 'g-center';
  let maxCount = 0;

  Object.entries(centerCounts).forEach(([center, count]) => {
    if (count > maxCount) {
      mostAffectedCenter = center;
      maxCount = count;
    }
  });

  return mostAffectedCenter;
};

// Nouvelle fonction pour analyser les ressentis et créer une guidance personnalisée
export const analyzeSelectedFeelings = (
  selectedFeelingNames: string[], 
  allFeelings: Feeling[]
): {
  dominantThemes: string[];
  affectedCenters: string[];
  emotionalTone: 'positive' | 'mixed' | 'challenging';
  keyInsights: string[];
} => {
  const selectedFeelings = selectedFeelingNames
    .map(name => allFeelings.find(f => f.name === name))
    .filter(f => f !== undefined) as Feeling[];

  // Analyser les centres affectés
  const centerCounts: Record<string, number> = {};
  selectedFeelings.forEach(feeling => {
    feeling.affectedCenters.forEach(center => {
      // Normalize center name if it's an object
      const centerName = typeof center === 'string' ? center : 
                         (center.center || Object.values(center)[0] || 'unknown');
      centerCounts[centerName] = (centerCounts[centerName] || 0) + 1;
    });
  });

  const affectedCenters = Object.entries(centerCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([center]) => center);

  // Analyser le ton émotionnel
  const positiveCount = selectedFeelings.filter(f => f.isPositive).length;
  const negativeCount = selectedFeelings.filter(f => !f.isPositive).length;
  
  let emotionalTone: 'positive' | 'mixed' | 'challenging';
  if (positiveCount > negativeCount * 2) {
    emotionalTone = 'positive';
  } else if (negativeCount > positiveCount * 2) {
    emotionalTone = 'challenging';
  } else {
    emotionalTone = 'mixed';
  }

  // Identifier les thèmes dominants
  const themes: Record<string, number> = {};
  selectedFeelings.forEach(feeling => {
    // Extraire des mots-clés du nom du ressenti
    const keywords = feeling.name.toLowerCase().split(' ');
    keywords.forEach(keyword => {
      if (keyword.length > 3) { // Ignorer les mots trop courts
        themes[keyword] = (themes[keyword] || 0) + 1;
      }
    });
  });

  const dominantThemes = Object.entries(themes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([theme]) => theme);

  // Générer des insights clés
  const keyInsights = generateKeyInsights(selectedFeelings, emotionalTone, affectedCenters);

  return {
    dominantThemes,
    affectedCenters,
    emotionalTone,
    keyInsights
  };
};

const generateKeyInsights = (
  feelings: Feeling[], 
  tone: 'positive' | 'mixed' | 'challenging',
  centers: string[]
): string[] => {
  const insights: string[] = [];

  // Insight basé sur le ton émotionnel
  switch (tone) {
    case 'positive':
      insights.push("Tu es dans une phase d'épanouissement énergétique. Continue à cultiver cette harmonie.");
      break;
    case 'challenging':
      insights.push("Ton énergie traverse une période de transformation. C'est le moment de t'accorder de la douceur.");
      break;
    case 'mixed':
      insights.push("Tu vis une période de transition énergétique. Accueille cette dualité avec bienveillance.");
      break;
  }

  // Insight basé sur les centres principaux
  if (centers.includes('solar-plexus')) {
    insights.push("Ton plexus solaire demande une attention particulière. Honore tes émotions sans les juger.");
  }
  if (centers.includes('heart')) {
    insights.push("Ton centre cœur est très actif. C'est le moment d'écouter ta vérité intérieure.");
  }
  if (centers.includes('sacral')) {
    insights.push("Ton énergie créatrice et vitale est en mouvement. Respecte tes rythmes naturels.");
  }

  // Insight basé sur la diversité des ressentis
  if (feelings.length > 5) {
    insights.push("La richesse de tes ressentis témoigne de ta sensibilité et de ta conscience corporelle.");
  }

  return insights.slice(0, 3); // Limiter à 3 insights maximum
};

export const generateGuidance = async (
  overallScore: number, 
  affectedCenter: string,
  selectedFeelings: string[] = [],
  allFeelings: Feeling[] = [],
  hdType: string = 'generator'
): Promise<{
  guidance: string;
  mantra: { inhale: string; exhale: string };
  realignmentExercise?: string;
  personalizedInsights?: string[];
}> => {
  try {
    // Analyser les ressentis sélectionnés
    const feelingsAnalysis = analyzeSelectedFeelings(selectedFeelings, allFeelings);
    
    // Récupérer la guidance de base depuis la base de données
    const baseResult = await getGuidanceByType(hdType, overallScore, affectedCenter);
    
    if (!baseResult) {
      throw new Error('No guidance found');
    }

    // Personnaliser la guidance en fonction des ressentis
    const personalizedGuidance = personalizeGuidance(
      baseResult.guidance,
      feelingsAnalysis,
      overallScore
    );

    // Personnaliser le mantra
    const personalizedMantra = personalizeMantra(
      baseResult.mantra,
      feelingsAnalysis.emotionalTone
    );

    return {
      guidance: personalizedGuidance,
      mantra: personalizedMantra,
      realignmentExercise: baseResult.realignmentExercise,
      personalizedInsights: feelingsAnalysis.keyInsights
    };
  } catch (error) {
    // Fallback values if no guidance is found in the database
    const fallbackAnalysis = analyzeSelectedFeelings(selectedFeelings, allFeelings);
    
    return {
      guidance: generateFallbackGuidance(overallScore, affectedCenter, fallbackAnalysis),
      mantra: {
        inhale: "Je m'accueille",
        exhale: "Je m'équilibre"
      },
      realignmentExercise: "Prenez un moment de pause consciente pour vous reconnecter à votre essence.",
      personalizedInsights: fallbackAnalysis.keyInsights
    };
  }
};

const personalizeGuidance = (
  baseGuidance: string,
  analysis: ReturnType<typeof analyzeSelectedFeelings>,
  score: number
): string => {
  let personalizedGuidance = baseGuidance;

  // Ajouter des éléments personnalisés selon l'analyse
  const additions: string[] = [];

  if (analysis.emotionalTone === 'positive' && score > 70) {
    additions.push("Cette belle énergie que tu ressens est précieuse. Continue à la cultiver avec gratitude.");
  } else if (analysis.emotionalTone === 'challenging' && score < 40) {
    additions.push("Les défis que tu traverses sont temporaires. Ton corps et ton cœur savent comment retrouver l'équilibre.");
  } else if (analysis.emotionalTone === 'mixed') {
    additions.push("Cette diversité de ressentis montre ta richesse émotionnelle. Accueille chaque nuance avec douceur.");
  }

  // Ajouter des conseils spécifiques aux centres affectés
  if (analysis.affectedCenters.includes('solar-plexus')) {
    additions.push("Ton plexus solaire te guide vers une meilleure compréhension de tes émotions.");
  }

  if (additions.length > 0) {
    personalizedGuidance += " " + additions.join(" ");
  }

  return personalizedGuidance;
};

const personalizeMantra = (
  baseMantra: { inhale: string; exhale: string },
  emotionalTone: 'positive' | 'mixed' | 'challenging'
): { inhale: string; exhale: string } => {
  switch (emotionalTone) {
    case 'positive':
      return {
        inhale: "Je célèbre",
        exhale: "ma vitalité"
      };
    case 'challenging':
      return {
        inhale: "Je m'accueille",
        exhale: "avec tendresse"
      };
    case 'mixed':
      return {
        inhale: "J'accueille",
        exhale: "ma complexité"
      };
    default:
      return baseMantra;
  }
};

const generateFallbackGuidance = (
  score: number,
  center: string,
  analysis: ReturnType<typeof analyzeSelectedFeelings>
): string => {
  let guidance = `Concentrez-vous sur l'équilibre de votre centre ${center}. `;
  
  if (score < 30) {
    guidance += 'Prenez un temps de repos et de ressourcement. ';
  } else if (score < 60) {
    guidance += 'Maintenez une attention bienveillante à votre équilibre énergétique. ';
  } else {
    guidance += 'Continuez à cultiver cette harmonie énergétique. ';
  }

  // Ajouter des éléments basés sur l'analyse des ressentis
  if (analysis.emotionalTone === 'challenging') {
    guidance += 'Les ressentis que vous traversez sont des messagers précieux. Écoutez-les avec compassion.';
  } else if (analysis.emotionalTone === 'positive') {
    guidance += 'Cette belle énergie que vous ressentez mérite d\'être célébrée et partagée.';
  }

  return guidance;
};