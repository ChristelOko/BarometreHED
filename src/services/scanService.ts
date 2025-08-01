import { supabase } from './supabaseClient';

export interface Scan {
  id: string;
  user_id: string;
  score: number;
  general_score: number;
  emotional_score: number;
  physical_score: number;
  category: 'general' | 'emotional' | 'physical';
  center: string;
  date: string;
  selected_feelings: string[];
  created_at?: string;
}

export interface ScanDetails {
  id: string;
  scan_id: string;
  guidance?: string;
  mantra?: {
    inhale: string;
    exhale: string;
  };
  realignment_exercise?: string;
  personalized_insights?: string[];
  created_at: string;
}

export interface FullScanData extends Scan {
  details?: ScanDetails;
}

export interface CategoryScores {
  general: { score: number; lastScan: string | null };
  emotional: { score: number; lastScan: string | null }; 
  physical: { score: number; lastScan: string | null }; 
  mental: { score: number; lastScan: string | null };
  digestive: { score: number; lastScan: string | null };
  somatic: { score: number; lastScan: string | null };
  energetic: { score: number; lastScan: string | null };
  feminine_cycle: { score: number; lastScan: string | null };
  hd_specific: { score: number; lastScan: string | null };
}

export const getScanDetails = async (
  scanId: string
): Promise<{ data: ScanDetails | null; error: Error | null }> => {
  try {
    // Get scan data
    const { data: scanData, error: scanError } = await supabase
      .from('scans')
      .select('*')
      .eq('id', scanId)
      .single();

    if (scanError) throw scanError;
    if (!scanData) throw new Error('Scan not found');

    // Get associated results if they exist
    const { data: resultData } = await supabase
      .from('results')
      .select('*')
      .eq('scan_id', scanId)
      .maybeSingle();

    const scanDetails: ScanDetails = {
      ...scanData,
      guidance: resultData?.guidance,
      mantra: resultData?.mantra,
      realignment_exercise: resultData?.realignment_exercise,
      personalized_insights: resultData?.personalized_insights
    };

    return { data: scanDetails, error: null };
  } catch (error) {
    console.error('Error fetching scan details:', error);
    return { data: null, error: error as Error };
  }
};

export const getFullScanData = async (
  scanId: string
): Promise<{ data: FullScanData | null; error: Error | null }> => {
  try {
    // Get scan data
    const { data: scanData, error: scanError } = await supabase
      .from('scans')
      .select('*')
      .eq('id', scanId)
      .single();

    if (scanError) throw scanError;

    // Get scan details (results)
    const { data: detailsData } = await supabase
      .from('results')
      .select('*')
      .eq('scan_id', scanId)
      .maybeSingle();

    const fullScanData: FullScanData = {
      ...scanData,
      details: detailsData || undefined
    };

    return { data: fullScanData, error: null };
  } catch (error) {
    console.error('Error fetching full scan data:', error);
    return { data: null, error: error as Error };
  }
};

export const saveScan = async (
  userId: string,
  score: number,
  center: string,
  selectedFeelings: string[],
  categoryScores: { general: number; emotional: number; physical: number; mental: number; digestive: number; somatic: number; energetic: number; feminine_cycle: number; hd_specific: number },
  primaryCategory: 'general' | 'emotional' | 'physical'
): Promise<{ data: any | null; error: Error | null }> => {
  try {
    const scanData = {
      user_id: userId,
      score,
      general_score: categoryScores.general,
      emotional_score: categoryScores.emotional,
      physical_score: categoryScores.physical, 
      mental_score: categoryScores.mental,
      digestive_score: categoryScores.digestive,
      somatic_score: categoryScores.somatic,
      energetic_score: categoryScores.energetic,
      feminine_cycle_score: categoryScores.feminine_cycle,
      hd_specific_score: categoryScores.hd_specific,
      center,
      date: new Date().toISOString(),
      selected_feelings: selectedFeelings,
      category: primaryCategory
    };

    // Toujours créer un nouveau scan (plusieurs scans par jour autorisés)
    const { data, error } = await supabase
      .from('scans')
      .insert([scanData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving scan:', error);
    return { data: null, error: error as Error };
  }
};

export const getCategoryScores = async (
  userId: string
): Promise<{ data: CategoryScores | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('category, general_score, emotional_score, physical_score, mental_score, digestive_score, somatic_score, energetic_score, feminine_cycle_score, hd_specific_score, date')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(10);

    if (error) throw error;

    if (!data?.length) {
      return {
        data: {
          general: { score: 0, lastScan: null }, 
          emotional: { score: 0, lastScan: null }, 
          physical: { score: 0, lastScan: null },
          mental: { score: 0, lastScan: null },
          digestive: { score: 0, lastScan: null },
          somatic: { score: 0, lastScan: null },
          energetic: { score: 0, lastScan: null },
          feminine_cycle: { score: 0, lastScan: null },
          hd_specific: { score: 0, lastScan: null }
        },
        error: null
      };
    }

    // Get the latest scan for each category
    const categoryData: CategoryScores = {
      general: { score: 0, lastScan: null },
      emotional: { score: 0, lastScan: null }, 
      physical: { score: 0, lastScan: null },
      mental: { score: 0, lastScan: null },
      digestive: { score: 0, lastScan: null },
      somatic: { score: 0, lastScan: null },
      energetic: { score: 0, lastScan: null },
      feminine_cycle: { score: 0, lastScan: null },
      hd_specific: { score: 0, lastScan: null }
    };

    // Find the most recent scan with data for each category
    for (const scan of data) {
      if (scan.general_score > 0 && !categoryData.general.lastScan) {
        categoryData.general = { 
          score: scan.general_score,
          lastScan: scan.date
        };
      }
      if (scan.emotional_score > 0 && !categoryData.emotional.lastScan) {
        categoryData.emotional = {
          score: scan.emotional_score,
          lastScan: scan.date
        };
      }
      if (scan.physical_score > 0 && !categoryData.physical.lastScan) {
        categoryData.physical = {
          score: scan.physical_score,
          lastScan: scan.date
        };
      }
      if (scan.mental_score > 0 && !categoryData.mental.lastScan) {
        categoryData.mental = {
          score: scan.mental_score,
          lastScan: scan.date
        };
      }
      if (scan.digestive_score > 0 && !categoryData.digestive.lastScan) {
        categoryData.digestive = {
          score: scan.digestive_score,
          lastScan: scan.date
        };
      }
      if (scan.somatic_score > 0 && !categoryData.somatic.lastScan) {
        categoryData.somatic = {
          score: scan.somatic_score,
          lastScan: scan.date
        };
      }
      if (scan.energetic_score > 0 && !categoryData.energetic.lastScan) {
        categoryData.energetic = {
          score: scan.energetic_score,
          lastScan: scan.date
        };
      }
      if (scan.feminine_cycle_score > 0 && !categoryData.feminine_cycle.lastScan) {
        categoryData.feminine_cycle = {
          score: scan.feminine_cycle_score,
          lastScan: scan.date
        };
      }
      if (scan.hd_specific_score > 0 && !categoryData.hd_specific.lastScan) {
        categoryData.hd_specific = {
          score: scan.hd_specific_score,
          lastScan: scan.date
        };
      }
    }

    return { data: categoryData, error: null };
  } catch (error) {
    console.error('Error fetching category scores:', error);
    return { data: null, error: error as Error };
  }
};

export const getRecentScans = async (
  userId: string,
  limit: number = 3
): Promise<{ data: Scan[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching scans:', error);
    return { data: null, error: error as Error };
  }
};

export const getAllUserScans = async (
  userId: string
): Promise<{ data: Scan[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching all scans:', error);
    return { data: null, error: error as Error };
  }
};

export const getScansInDateRange = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<{ data: Scan[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching scans in date range:', error);
    return { data: null, error: error as Error };
  }
};

export const getScansStats = async (
  userId: string
): Promise<{ 
  averageScore: number;
  mostFrequentCenter: string; 
  trend: 'improving' | 'stable' | 'declining'; 
  categoryScores: {
    general: { score: number; lastScan: string | null };
    emotional: { score: number; lastScan: string | null };
    physical: { score: number; lastScan: string | null };
    mental: { score: number; lastScan: string | null };
    digestive: { score: number; lastScan: string | null };
    somatic: { score: number; lastScan: string | null };
    energetic: { score: number; lastScan: string | null };
    feminine_cycle: { score: number; lastScan: string | null };
    hd_specific: { score: number; lastScan: string | null };
  }
}> => {
  try {
    const { data: scans, error: scansError } = await supabase
      .from('scans')
      .select('score, center, date, general_score, emotional_score, physical_score, mental_score, digestive_score, somatic_score, energetic_score, feminine_cycle_score, hd_specific_score')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30); // Plus de données pour de meilleures statistiques

    if (scansError) {
      console.error('Error fetching scans for stats:', scansError);
      throw scansError;
    }

    if (!scans?.length) {
      return {
        averageScore: 0,
        mostFrequentCenter: 'g-center', 
        trend: 'stable',
        categoryScores: {
          general: { score: 0, lastScan: null },
          emotional: { score: 0, lastScan: null },
          physical: { score: 0, lastScan: null },
          mental: { score: 0, lastScan: null },
          digestive: { score: 0, lastScan: null },
          somatic: { score: 0, lastScan: null },
          energetic: { score: 0, lastScan: null },
          feminine_cycle: { score: 0, lastScan: null },
          hd_specific: { score: 0, lastScan: null }
        }
      };
    }

    // Calculate average score
    const averageScore = Math.round(
      scans.reduce((sum, scan) => sum + scan.score, 0) / scans.length
    );

    // Find most frequent center
    const centerCounts = scans.reduce((acc, scan) => {
      acc[scan.center] = (acc[scan.center] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostFrequentCenter = Object.entries(centerCounts)
      .reduce((a, b) => (a[1] > b[1] ? a : b))[0];

    // Calculate trend (compare first half vs second half of recent scans)
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (scans.length >= 4) {
      const halfPoint = Math.floor(scans.length / 2);
      const recentScores = scans.slice(0, halfPoint).map(s => s.score);
      const olderScores = scans.slice(halfPoint).map(s => s.score);
      
      const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
      const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;
      
      const difference = recentAvg - olderAvg;
      trend = difference > 5 
        ? 'improving'
        : difference < -5 
          ? 'declining' 
          : 'stable';
    }

    // Calculer les scores moyens par catégorie (pas seulement le dernier)
    const categoryScores = {
      general: { score: 0, lastScan: null as string | null },
      emotional: { score: 0, lastScan: null as string | null },
      physical: { score: 0, lastScan: null as string | null },
      mental: { score: 0, lastScan: null as string | null },
      digestive: { score: 0, lastScan: null as string | null },
      somatic: { score: 0, lastScan: null as string | null },
      energetic: { score: 0, lastScan: null as string | null },
      feminine_cycle: { score: 0, lastScan: null as string | null },
      hd_specific: { score: 0, lastScan: null as string | null }
    };
    
    // Calculer les moyennes et trouver les derniers scans pour chaque catégorie
    const categoryData = {
      general: { scores: [] as number[], dates: [] as string[] },
      emotional: { scores: [] as number[], dates: [] as string[] },
      physical: { scores: [] as number[], dates: [] as string[] },
      mental: { scores: [] as number[], dates: [] as string[] },
      digestive: { scores: [] as number[], dates: [] as string[] },
      somatic: { scores: [] as number[], dates: [] as string[] },
      energetic: { scores: [] as number[], dates: [] as string[] },
      feminine_cycle: { scores: [] as number[], dates: [] as string[] },
      hd_specific: { scores: [] as number[], dates: [] as string[] }
    };

    // Collecter tous les scores par catégorie
    for (const scan of scans) {
      if (scan.general_score > 0) {
        categoryData.general.scores.push(scan.general_score);
        categoryData.general.dates.push(scan.date);
      }
      if (scan.emotional_score > 0) {
        categoryData.emotional.scores.push(scan.emotional_score);
        categoryData.emotional.dates.push(scan.date);
      }
      if (scan.physical_score > 0) {
        categoryData.physical.scores.push(scan.physical_score);
        categoryData.physical.dates.push(scan.date);
      }
      if (scan.mental_score > 0) {
        categoryData.mental.scores.push(scan.mental_score);
        categoryData.mental.dates.push(scan.date);
      }
      if (scan.digestive_score > 0) {
        categoryData.digestive.scores.push(scan.digestive_score);
        categoryData.digestive.dates.push(scan.date);
      }
      if (scan.somatic_score > 0) {
        categoryData.somatic.scores.push(scan.somatic_score);
        categoryData.somatic.dates.push(scan.date);
      }
      if (scan.energetic_score > 0) {
        categoryData.energetic.scores.push(scan.energetic_score);
        categoryData.energetic.dates.push(scan.date);
      }
      if (scan.feminine_cycle_score > 0) {
        categoryData.feminine_cycle.scores.push(scan.feminine_cycle_score);
        categoryData.feminine_cycle.dates.push(scan.date);
      }
      if (scan.hd_specific_score > 0) {
        categoryData.hd_specific.scores.push(scan.hd_specific_score);
        categoryData.hd_specific.dates.push(scan.date);
      }
    }

    // Calculer les moyennes et dernières dates pour chaque catégorie
    Object.keys(categoryData).forEach(category => {
      const data = categoryData[category as keyof typeof categoryData];
      if (data.scores.length > 0) {
        const averageScore = Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length);
        const lastScan = data.dates[0]; // Le plus récent (déjà trié par date desc)
        
        categoryScores[category as keyof typeof categoryScores] = {
          score: averageScore,
          lastScan
        };
      }
    });

    return { averageScore, mostFrequentCenter, trend, categoryScores };
  } catch (error) {
    console.error('Error getting scan stats:', error);
    return {
      averageScore: 0,
      mostFrequentCenter: 'g-center',
      trend: 'stable',
      categoryScores: {
        general: { score: 0, lastScan: null },
        emotional: { score: 0, lastScan: null },
        physical: { score: 0, lastScan: null },
        mental: { score: 0, lastScan: null },
        digestive: { score: 0, lastScan: null },
        somatic: { score: 0, lastScan: null },
        energetic: { score: 0, lastScan: null },
        feminine_cycle: { score: 0, lastScan: null },
        hd_specific: { score: 0, lastScan: null }
      }
    };
  }
};