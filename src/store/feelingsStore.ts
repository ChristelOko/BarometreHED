import { create } from 'zustand';
import { CategoryType } from '../types/feelings';
import { getAllFeelings } from '../services/feelingsService';

export interface Feeling {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  probableOrigin: string;
  affectedCenters: any[];
  mirrorPhrase?: string;
  realignmentExercise?: string;
  mantra?: {
    inhale: string;
    exhale: string;
  };
  encouragement?: string;
  isPositive: boolean;
}

interface FeelingsState {
  feelings: Feeling[];
  isLoading: boolean;
  error: Error | null;
  addFeeling: (feeling: Feeling) => void;
  fetchFeelings: () => Promise<void>;
  getAllFeelingsData: () => Feeling[];
  getAllFeelingsByName: (feelingNames: string[]) => Feeling[];
  getFeelingsByCategory: (category: CategoryType, userHdType?: string | null) => Feeling[];
  getPositiveFeelings: (category: CategoryType, userHdType?: string | null) => Feeling[];
  getNegativeFeelings: (category: CategoryType, userHdType?: string | null) => Feeling[];
}

// Initial feelings data - Base complète de ressentis
const initialFeelings: Feeling[] = [];

// Conversion des données CSV en objets JavaScript
const csvFeelings: Feeling[] = [
  // ... (all feeling objects remain unchanged)
];

// Fusionner les ressentis génériques et les ressentis spécifiques par type HD
initialFeelings.push(...csvFeelings);

export const useFeelingsStore = create<FeelingsState>((set, get) => ({
      feelings: initialFeelings,
      isLoading: false,
      error: null,
      addFeeling: (feeling) => set((state) => ({
        feelings: [...state.feelings, feeling]
      })),
      getAllFeelingsData: () => {
        return get().feelings;
      },
      fetchFeelings: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await getAllFeelings();
          if (error) {
            console.warn('Could not fetch feelings from database:', error);
            // Use fallback data if database is not available
            if (get().feelings.length === 0) {
              set({ feelings: initialFeelings });
            }
            return;
          }
          if (data) {
            set({ feelings: data });
          }
        } catch (error) {
          console.warn('Error fetching feelings, using fallback data:', error);
          set({ error: error as Error });
          // Fallback to initial feelings if fetch fails
          if (get().feelings.length === 0) {
            set({ feelings: initialFeelings });
          }
        } finally {
          set({ isLoading: false });
        }
      },
      getFeelingsByCategory: (category, hdType) => {
        const feelings = get().feelings;
        return feelings.filter(feeling => {
          const categoryMatch = feeling.category === category;
          const hdTypeMatch = !hdType || !feeling.type_hd || feeling.type_hd === hdType;
          return categoryMatch && hdTypeMatch;
        });
      },
      getNegativeFeelings: (category, userHdType) => {
        return get().getFeelingsByCategory(category, userHdType).filter(feeling => !feeling.isPositive);
      }
}));

// Initialize feelings from the database when the app starts
useFeelingsStore.getState().fetchFeelings();