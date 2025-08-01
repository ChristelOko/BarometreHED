import { z } from 'zod';

export const HDCenter = {
  THROAT: 'throat',
  HEART: 'heart',
  SOLAR_PLEXUS: 'solar-plexus',
  SACRAL: 'sacral',
  ROOT: 'root',
  SPLEEN: 'spleen',
  G_CENTER: 'g-center',
  AJNA: 'ajna',
  HEAD: 'head'
} as const;

export type HDCenterType = typeof HDCenter[keyof typeof HDCenter];

export const Category = {
  GENERAL: 'general',
  EMOTIONAL: 'emotional',
  PHYSICAL: 'physical'
} as const;

export type CategoryType = typeof Category[keyof typeof Category];

export interface Feeling {
  id: string;
  type_hd?: string;
  name: string;
  type_hd?: string;
  category: CategoryType;
  description: string;
  probableOrigin: string;
  affectedCenters: HDCenterType[];
  mirrorPhrase: string;
  realignmentExercise: string;
  mantra: {
    inhale: string;
    exhale: string;
  };
  encouragement: string;
  isPositive: boolean;
}

export const feelingSchema = z.object({
  id: z.string(),
  name: z.string(),
  type_hd: z.string().optional(),
  type_hd: z.string().optional(),
  category: z.enum([Category.GENERAL, Category.EMOTIONAL, Category.PHYSICAL]),
  description: z.string(),
  probableOrigin: z.string(),
  affectedCenters: z.array(z.enum([
    HDCenter.THROAT,
    HDCenter.HEART,
    HDCenter.SOLAR_PLEXUS,
    HDCenter.SACRAL,
    HDCenter.ROOT,
    HDCenter.SPLEEN,
    HDCenter.G_CENTER,
    HDCenter.AJNA,
    HDCenter.HEAD
  ])),
  mirrorPhrase: z.string(),
  realignmentExercise: z.string(),
  mantra: z.object({
    inhale: z.string(),
    exhale: z.string()
  }),
  encouragement: z.string(),
  isPositive: z.boolean()
});

export type FeelingData = z.infer<typeof feelingSchema>;

// Helper function to create a new feeling
export const createFeeling = (data: Omit<FeelingData, 'id'>): FeelingData => {
  const id = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const feeling = {
    id,
    ...data
  };

  return feelingSchema.parse(feeling);
};