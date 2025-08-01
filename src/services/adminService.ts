import { supabase } from './supabaseClient';

export interface User {
  id: string;
  email: string;
  full_name: string;
  hd_type?: string;
  role: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  birthdate?: string;
  is_active: boolean;
  last_seen?: string;
  created_at: string;
  updated_at: string;
  scan_count?: number;
  is_beta_tester?: boolean;
  free_access_expires?: string;
  lifetime_access?: boolean;
}

export interface BetaTester {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  status: 'active' | 'inactive' | 'suspended';
  access_level: 'full' | 'limited' | 'categories_only';
  granted_by?: string;
  granted_at: string;
  expires_at?: string;
  notes?: string;
  total_scans?: number;
  average_score?: number;
  last_scan_date?: string;
  last_seen?: string;
}

export interface FreeAccessGrant {
  id: string;
  user_id: string;
  grant_type: 'beta_tester' | 'temporary' | 'permanent' | 'category_specific';
  access_scope: 'full' | 'categories_only' | 'specific_category';
  specific_categories?: string[];
  granted_by: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
  notes?: string;
}

export interface AppSettings {
  showPremiumPage: boolean;
  freeRegistration: boolean;
}

export interface AnalyticsData {
  totalUsers: number;
  userGrowth: number;
  totalScans: number;
  scanGrowth: number;
  dailyScans: number;
  dailyScanGrowth: number;
  averageScore: number;
  scoreGrowth: number;
  scansByCategory: {
    general: number;
    emotional: number;
    physical: number;
  };
  scansByCenter: Record<string, number>;
  scansTrend: Array<{
    date: string;
    count: number;
  }>;
}

export const getAppSettings = async (): Promise<{ data: AppSettings | null; error: Error | null }> => {
  try {
    // Return default settings for now
    const defaultSettings: AppSettings = {
      showPremiumPage: false,
      freeRegistration: true
    };
    
    return { data: defaultSettings, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const updateAppSettings = async (settings: Partial<AppSettings>): Promise<{ error: Error | null }> => {
  try {
    // Placeholder implementation
    console.log('Updating app settings:', settings);
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const getAllUsers = async (): Promise<{ data: User[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        beta_testers!left(status, expires_at),
        free_access_grants!left(is_active, expires_at)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const usersWithBetaStatus = data?.map(user => ({
      ...user,
      is_beta_tester: user.beta_testers?.length > 0 && user.beta_testers[0]?.status === 'active',
      free_access_expires: user.free_access_grants?.find(g => g.is_active)?.expires_at
    }));

    return { data: usersWithBetaStatus, error: null };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { data: null, error: error as Error };
  }
};

export const getAllBetaTesters = async (): Promise<{ data: BetaTester[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('beta_testers_stats')
      .select('*')
      .order('granted_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching beta testers:', error);
    return { data: null, error: error as Error };
  }
};

export const addBetaTester = async (
  email: string,
  accessLevel: 'full' | 'limited' | 'categories_only' = 'full',
  expiresAt?: string,
  notes?: string
): Promise<{ error: Error | null }> => {
  try {
    // Vérifier si l'utilisateur existe
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (authError || !authUser?.user) {
      throw new Error('Utilisateur non trouvé. L\'utilisateur doit d\'abord créer un compte.');
    }

    const userId = authUser.user.id;

    // Ajouter à la liste des bétatesteuses
    const { error: betaError } = await supabase
      .from('beta_testers')
      .insert({
        user_id: userId,
        email,
        full_name: authUser.user.user_metadata?.full_name || email.split('@')[0],
        access_level: accessLevel,
        expires_at: expiresAt,
        notes,
        granted_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (betaError) throw betaError;

    // Créer un accès gratuit correspondant
    const { error: accessError } = await supabase
      .from('free_access_grants')
      .insert({
        user_id: userId,
        grant_type: 'beta_tester',
        access_scope: accessLevel === 'categories_only' ? 'categories_only' : 'full',
        expires_at: expiresAt,
        notes: `Bétatesteuse - ${notes || ''}`,
        granted_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (accessError) throw accessError;

    return { error: null };
  } catch (error) {
    console.error('Error adding beta tester:', error);
    return { error: error as Error };
  }
};

export const removeBetaTester = async (betaTesterId: string): Promise<{ error: Error | null }> => {
  try {
    // Récupérer les infos de la bétatesteuse
    const { data: betaTester, error: fetchError } = await supabase
      .from('beta_testers')
      .select('user_id')
      .eq('id', betaTesterId)
      .single();

    if (fetchError) throw fetchError;

    // Supprimer de la liste des bétatesteuses
    const { error: deleteError } = await supabase
      .from('beta_testers')
      .delete()
      .eq('id', betaTesterId);

    if (deleteError) throw deleteError;

    // Désactiver les accès gratuits
    const { error: accessError } = await supabase
      .from('free_access_grants')
      .update({ is_active: false })
      .eq('user_id', betaTester.user_id)
      .eq('grant_type', 'beta_tester');

    if (accessError) throw accessError;

    return { error: null };
  } catch (error) {
    console.error('Error removing beta tester:', error);
    return { error: error as Error };
  }
};

export const grantFreeAccess = async (
  userId: string,
  grantType: 'temporary' | 'permanent' | 'category_specific',
  accessScope: 'full' | 'categories_only' | 'specific_category',
  specificCategories?: string[],
  expiresAt?: string,
  notes?: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('free_access_grants')
      .insert({
        user_id: userId,
        grant_type: grantType,
        access_scope: accessScope,
        specific_categories: specificCategories,
        expires_at: expiresAt,
        notes,
        granted_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error granting free access:', error);
    return { error: error as Error };
  }
};

export const updateUserRole = async (userId: string, role: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const deleteUser = async (userId: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const getAnalyticsData = async (): Promise<{ data: AnalyticsData | null; error: Error | null }> => {
  try {
    // Placeholder implementation
    const mockData: AnalyticsData = {
      totalUsers: 0,
      userGrowth: 0,
      totalScans: 0,
      scanGrowth: 0,
      dailyScans: 0,
      dailyScanGrowth: 0,
      averageScore: 0,
      scoreGrowth: 0,
      scansByCategory: {
        general: 0,
        emotional: 0,
        physical: 0
      },
      scansByCenter: {},
      scansTrend: []
    };
    
    return { data: mockData, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};