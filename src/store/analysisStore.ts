import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HDType = 'projector' | 'generator' | 'manifesting-generator' | 'manifestor' | 'reflector';

export interface CategoryScore {
  score: number;
  details: string[];
}

export interface AnalysisResult {
  hdType: HDType;
  generalScore: CategoryScore;
  emotionalScore: CategoryScore;
  physicalScore: CategoryScore;
  affectedCenter: string;
  guidance: string;
  element: string;
  practice: string;
  intention: string;
}

interface AnalysisState {
  results: AnalysisResult | null;
  setResults: (results: AnalysisResult) => void;
  clearResults: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      results: null,
      setResults: (results) => set({ results }),
      clearResults: () => set({ results: null }),
    }),
    {
      name: 'analysis-storage',
    }
  )
);

// Scoring thresholds
export const SCORE_THRESHOLDS = {
  HIGH: 10,
  MEDIUM: 6,
  LOW: 0,
};

// Analysis functions
export const getScoreLevel = (score: number): 'high' | 'medium' | 'low' => {
  if (score >= SCORE_THRESHOLDS.HIGH) return 'high';
  if (score >= SCORE_THRESHOLDS.MEDIUM) return 'medium';
  return 'low';
};

export const getAnalysisForType = (
  hdType: HDType,
  generalScore: number,
  emotionalScore: number,
  physicalScore: number
): Pick<AnalysisResult, 'guidance' | 'element' | 'practice' | 'intention'> => {
  const scoreLevel = getScoreLevel(
    (generalScore + emotionalScore + physicalScore) / 3
  );

  // Base guidance by type and score level
  const guidanceMap = {
    projector: {
      high: "Tu es dans ton alignement naturel. Continue d'observer et de guider avec sagesse.",
      medium: "Prends du recul pour retrouver ta clarté. Tu n'as pas à tout comprendre maintenant.",
      low: "Il est temps de te retirer pour te reconnecter à ta sagesse unique.",
    },
    generator: {
      high: "Ton énergie sacrale est bien alignée. Continue de suivre ce qui te fait dire 'oui'.",
      medium: "Écoute les signaux de ton corps. Certains 'oui' sont peut-être des 'non'.",
      low: "Reviens à ton centre sacral. La frustration est un signal de réalignement.",
    },
    'manifesting-generator': {
      high: "Tu es dans ton flux naturel, rapide et multitâche. Profite de cette énergie créative.",
      medium: "Vérifie que tes multiples engagements te nourrissent vraiment.",
      low: "Trop de directions simultanées. Recentre-toi sur ce qui t'allume vraiment.",
    },
    manifestor: {
      high: "Tu es dans ta puissance d'initiation. Continue d'informer avec grâce.",
      medium: "Certaines initiatives attendent d'être lancées. Fais-leur confiance.",
      low: "Ta colère est un signal. Libère ton énergie d'initiation.",
    },
    reflector: {
      high: "Tu reflètes la santé de ton environnement. Tout est en harmonie.",
      medium: "Prends le temps d'un cycle lunaire pour clarifier ce que tu ressens.",
      low: "Ton environnement demande à être ajusté. Écoute ta sagesse.",
    },
  };

  // Elements and practices based on HD type
  const elementPracticeMap = {
    projector: {
      element: "Éther",
      practice: "Méditation contemplative, repos conscient",
    },
    generator: {
      element: "Terre",
      practice: "Activités physiques rythmées, jardinage",
    },
    'manifesting-generator': {
      element: "Feu",
      practice: "Sport dynamique, créativité spontanée",
    },
    manifestor: {
      element: "Air",
      practice: "Respiration profonde, expression libre",
    },
    reflector: {
      element: "Eau",
      practice: "Bain de lune, fluidité corporelle",
    },
  };

  // Intentions based on HD type
  const intentionMap = {
    projector: "Je m'autorise à être vue pour ma sagesse, pas pour ma productivité.",
    generator: "Je fais confiance à mes réponses sacrales et j'honore mon rythme.",
    'manifesting-generator': "Je suis libre de changer de direction quand mon énergie change.",
    manifestor: "J'initie avec confiance et j'informe avec amour.",
    reflector: "Je prends le temps d'un cycle lunaire pour toute décision importante.",
  };

  return {
    guidance: guidanceMap[hdType][scoreLevel],
    element: elementPracticeMap[hdType].element,
    practice: elementPracticeMap[hdType].practice,
    intention: intentionMap[hdType],
  };
};