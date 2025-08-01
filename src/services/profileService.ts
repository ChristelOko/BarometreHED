import { supabase } from './supabaseClient';

export interface PublicProfile {
  id: string;
  name: string;
  bio: string;
  avatar_url?: string;
  hd_type?: string;
  location?: string;
  website?: string;
  joined_date: string;
  is_verified: boolean;
  is_premium: boolean;
  stats: {
    total_scans: number;
    average_score: number;
    posts_count: number;
    followers_count: number;
    following_count: number;
  };
  recent_posts: any[];
  is_following?: boolean;
  privacy_settings: {
    show_stats: boolean;
    show_posts: boolean;
    show_hd_type: boolean;
  };
}

export interface PrivacySettings {
  show_stats: boolean;
  show_posts: boolean;
  show_hd_type: boolean;
  show_location: boolean;
  show_website: boolean;
  allow_messages: boolean;
  allow_follow: boolean;
}

/**
 * Récupère tous les profils publics pour l'annuaire
 */
export const getAllPublicProfiles = async (limit: number = 50): Promise<{ data: any[] | null; error: Error | null }> => {
  try {
    // Récupérer tous les utilisateurs actifs avec leurs profils
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        hd_type,
        bio,
        avatar_url,
        is_active,
        created_at
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (usersError) throw usersError;
    if (!usersData) return { data: [], error: null };

    // Pour chaque utilisateur, récupérer les informations étendues et de confidentialité
    const profilesPromises = usersData.map(async (userData) => {
      // Récupérer les informations étendues
      const { data: extendedData } = await supabase
        .from('user_profiles_extended')
        .select(`
          location,
          website,
          is_verified
        `)
        .eq('user_id', userData.id)
        .maybeSingle();

      // Récupérer les paramètres de confidentialité
      const { data: privacyData } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', userData.id)
        .maybeSingle();

      const privacySettings = privacyData || {
        profile_visible: true,
        show_stats: true,
        show_posts: true,
        show_hd_type: true,
        show_location: false,
        show_website: true
      };

      // Ne retourner que les profils visibles publiquement
      if (!privacySettings.profile_visible) {
        return null;
      }

      // Récupérer les statistiques si autorisées
      let stats = {
        posts_count: 0,
        followers_count: 0
      };

      if (privacySettings.show_stats) {
        // Compter les posts
        const { count: postsCount } = await supabase
          .from('community_posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userData.id)
          .eq('is_published', true);

        // Compter les followers
        const { count: followersCount } = await supabase
          .from('user_follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', userData.id);

        stats = {
          posts_count: postsCount || 0,
          followers_count: followersCount || 0
        };
      }

      // Vérifier si c'est une bétatesteuse
      const { data: betaData } = await supabase
        .from('free_access_grants')
        .select('grant_type')
        .eq('user_id', userData.id)
        .eq('grant_type', 'beta_tester')
        .eq('is_active', true)
        .maybeSingle();

      const isBetaTester = !!betaData;

      return {
        id: userData.id,
        name: userData.full_name,
        bio: userData.bio || '',
        avatar_url: userData.avatar_url,
        hd_type: privacySettings.show_hd_type ? (userData.hd_type || 'generator') : undefined,
        location: privacySettings.show_location ? extendedData?.location : undefined,
        website: privacySettings.show_website ? extendedData?.website : undefined,
        is_verified: extendedData?.is_verified || false,
        is_premium: isBetaTester, // Les bétatesteuses ont accès premium
        role: userData.role || 'user',
        privacy_settings: privacySettings,
        stats
      };
    });

    const profiles = (await Promise.all(profilesPromises)).filter(profile => profile !== null);

    // Hiérarchiser les profils selon leur statut
    const hierarchizedProfiles = profiles.sort((a, b) => {
      // 1. Admins en premier
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (b.role === 'admin' && a.role !== 'admin') return 1;
      
      // 2. Bétatesteuses ensuite
      if (a.is_premium && !b.is_premium) return -1;
      if (b.is_premium && !a.is_premium) return 1;
      
      // 3. Profils vérifiés
      if (a.is_verified && !b.is_verified) return -1;
      if (b.is_verified && !a.is_verified) return 1;
      
      // 4. Profils avec photos
      if (a.avatar_url && !b.avatar_url) return -1;
      if (b.avatar_url && !a.avatar_url) return 1;
      
      // 5. Par nombre de posts (plus actifs en premier)
      const aPostCount = a.stats?.posts_count || 0;
      const bPostCount = b.stats?.posts_count || 0;
      if (aPostCount !== bPostCount) return bPostCount - aPostCount;
      
      // 6. Par nombre de followers
      const aFollowerCount = a.stats?.followers_count || 0;
      const bFollowerCount = b.stats?.followers_count || 0;
      if (aFollowerCount !== bFollowerCount) return bFollowerCount - aFollowerCount;
      
      // 7. Par ordre alphabétique
      return a.name.localeCompare(b.name);
    });

    return { data: hierarchizedProfiles, error: null };
  } catch (error) {
    console.error('Error fetching all public profiles:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Récupère les nouveaux membres des dernières 48 heures
 */
export const getNewMembers = async (hours: number = 48): Promise<{ data: any[] | null; error: Error | null }> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);
    
    // Récupérer les utilisateurs créés dans les dernières 48h
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        hd_type,
        bio,
        avatar_url,
        is_active,
        created_at
      `)
      .eq('is_active', true)
      .gte('created_at', cutoffDate.toISOString())
      .order('created_at', { ascending: false });

    if (usersError) throw usersError;
    if (!usersData) return { data: [], error: null };

    // Pour chaque utilisateur, récupérer les informations étendues et de confidentialité
    const profilesPromises = usersData.map(async (userData) => {
      // Récupérer les informations étendues
      const { data: extendedData } = await supabase
        .from('user_profiles_extended')
        .select(`
          location,
          website,
          is_verified
        `)
        .eq('user_id', userData.id)
        .maybeSingle();

      // Récupérer les paramètres de confidentialité
      const { data: privacyData } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', userData.id)
        .maybeSingle();

      const privacySettings = privacyData || {
        profile_visible: true,
        show_stats: true,
        show_posts: true,
        show_hd_type: true,
        show_location: false,
        show_website: true
      };

      // Ne retourner que les profils visibles publiquement
      if (!privacySettings.profile_visible) {
        return null;
      }

      // Vérifier si c'est une bétatesteuse
      const { data: betaData } = await supabase
        .from('free_access_grants')
        .select('grant_type')
        .eq('user_id', userData.id)
        .eq('grant_type', 'beta_tester')
        .eq('is_active', true)
        .maybeSingle();

      const isBetaTester = !!betaData;

      // Calculer les heures depuis l'inscription
      const hoursSinceJoined = Math.floor(
        (Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60)
      );

      return {
        id: userData.id,
        name: userData.full_name,
        bio: userData.bio || '',
        avatar_url: userData.avatar_url,
        hd_type: privacySettings.show_hd_type ? (userData.hd_type || 'generator') : undefined,
        location: privacySettings.show_location ? extendedData?.location : undefined,
        website: privacySettings.show_website ? extendedData?.website : undefined,
        is_verified: extendedData?.is_verified || false,
        is_premium: isBetaTester,
        role: userData.role || 'user',
        privacy_settings: privacySettings,
        created_at: userData.created_at,
        hoursSinceJoined,
        isNew: hoursSinceJoined <= hours
      };
    });

    const profiles = (await Promise.all(profilesPromises)).filter(profile => profile !== null);

    return { data: profiles, error: null };
  } catch (error) {
    console.error('Error fetching new members:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Sélectionne les membres à mettre en lumière selon des critères spécifiques
 */
export const getFeaturedMembers = (profiles: any[], maxCount: number = 8): any[] => {
  // Critères de sélection pour la mise en lumière
  const scoredProfiles = profiles.map(profile => {
    let score = 0;
    
    // 1. Statut spécial (poids: 50 points)
    if (profile.role === 'admin') score += 50;
    else if (profile.is_premium) score += 40;
    else if (profile.is_verified) score += 30;
    
    // 2. Photo de profil (poids: 20 points)
    if (profile.avatar_url) score += 20;
    
    // 3. Activité dans la communauté (poids: 15 points)
    const postCount = profile.stats?.posts_count || 0;
    if (postCount > 5) score += 15;
    else if (postCount > 2) score += 10;
    else if (postCount > 0) score += 5;
    
    // 4. Popularité (poids: 10 points)
    const followerCount = profile.stats?.followers_count || 0;
    if (followerCount > 10) score += 10;
    else if (followerCount > 5) score += 7;
    else if (followerCount > 0) score += 3;
    
    // 5. Profil complet (poids: 5 points)
    if (profile.bio && profile.bio.length > 50) score += 5;
    
    return { ...profile, featuredScore: score };
  });
  
  // Trier par score et prendre les meilleurs
  return scoredProfiles
    .sort((a, b) => b.featuredScore - a.featuredScore)
    .slice(0, maxCount);
};
/**
 * Récupère le profil public d'un utilisateur
 */
export const getPublicProfile = async (userId: string): Promise<{ data: PublicProfile | null; error: Error | null }> => {
  try {
    console.log('Getting public profile for userId:', userId);
    
    // Récupérer les informations de base depuis la table profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        bio,
        photo_url,
        hd_type,
        created_at,
        updated_at
      `)
      .eq('id', userId)
      .maybeSingle();

    console.log('Profile data from profiles table:', profileData);
    console.log('Profile error from profiles table:', profileError);

    if (profileError) throw profileError;
    
    let finalProfileData = profileData;
    
    if (!profileData) {
      console.log('No profile found in profiles table, checking users table...');
      
      // Fallback: essayer la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          bio,
          avatar_url,
          hd_type,
          created_at,
          updated_at,
          is_active
        `)
        .eq('id', userId)
        .eq('is_active', true)
        .maybeSingle();
      
      console.log('User data from users table:', userData);
      
      if (userError) throw userError;
      if (!userData) return { data: null, error: null };
      
      // Convertir les données users vers le format profiles
      finalProfileData = {
        id: userData.id,
        name: userData.full_name,
        bio: userData.bio,
        photo_url: userData.avatar_url,
        hd_type: userData.hd_type || 'generator',
        created_at: userData.created_at,
        updated_at: userData.updated_at
      };
      
      console.log('Converted profile data:', finalProfileData);
    }

    // Récupérer les informations étendues du profil
    const { data: extendedData } = await supabase
      .from('user_profiles_extended')
      .select(`
        location,
        website,
        is_verified,
        social_links
      `)
      .eq('user_id', userId)
      .maybeSingle();

    console.log('Extended data:', extendedData);

    // Récupérer les paramètres de confidentialité
    const { data: privacyData } = await supabase
      .from('user_privacy_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    console.log('Privacy data:', privacyData);

    const privacySettings = privacyData || {
      profile_visible: true,
      show_stats: true,
      show_posts: true,
      show_hd_type: true,
      show_location: false,
      show_website: true,
      show_cover_photo: true,
      allow_messages: true,
      allow_follow: true
    };

    // Récupérer les statistiques si autorisées
    let stats = {
      total_scans: 0,
      average_score: 0,
      posts_count: 0,
      followers_count: 0,
      following_count: 0
    };

    if (privacySettings.show_stats) {
      // Compter les scans
      const { count: scanCount } = await supabase
        .from('scans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Calculer le score moyen
      const { data: scansData } = await supabase
        .from('scans')
        .select('score')
        .eq('user_id', userId);

      const averageScore = scansData && scansData.length > 0
        ? Math.round(scansData.reduce((sum, scan) => sum + scan.score, 0) / scansData.length)
        : 0;

      // Compter les posts
      const { count: postsCount } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_published', true);

      // Compter les followers
      const { count: followersCount } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

      // Compter les following
      const { count: followingCount } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

      stats = {
        total_scans: scanCount || 0,
        average_score: averageScore,
        posts_count: postsCount || 0,
        followers_count: followersCount || 0,
        following_count: followingCount || 0
      };
    }

    // Récupérer les posts récents si autorisés
    let recentPosts: any[] = [];
    if (privacySettings.show_posts) {
      const { data: postsData } = await supabase
        .from('community_posts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(5);

      recentPosts = postsData || [];
    }

    // Vérifier si l'utilisateur actuel suit ce profil
    let isFollowing = false;
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      const { data: followData } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', currentUser.id)
        .eq('following_id', userId)
        .maybeSingle();

      isFollowing = !!followData;
    }

    const profile: PublicProfile = {
      id: finalProfileData.id,
      name: finalProfileData.name,
      bio: finalProfileData.bio || '',
      avatar_url: finalProfileData.avatar_url || null,
      hd_type: privacySettings.show_hd_type ? (finalProfileData.hd_type || 'generator') : undefined,
      location: privacySettings.show_location ? (extendedData?.location || undefined) : undefined,
      website: privacySettings.show_website ? (extendedData?.website || undefined) : undefined,
      joined_date: finalProfileData.created_at,
      is_verified: extendedData?.is_verified || false,
      is_premium: false, // À récupérer depuis les abonnements
      stats,
      recent_posts: recentPosts,
      is_following: isFollowing,
      privacy_settings: {
        show_stats: privacySettings.show_stats,
        show_posts: privacySettings.show_posts,
        show_hd_type: privacySettings.show_hd_type
      }
    };

    console.log('Final profile object:', profile);
    return { data: profile, error: null };
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Récupère les posts d'un utilisateur
 */
export const getUserPosts = async (userId: string, limit: number = 10): Promise<{ data: any[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Récupérer la liste des utilisateurs suivis par l'utilisateur actuel
 */
export const getFollowingUsersList = async (): Promise<{ data: string[] | null; error: Error | null }> => {
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return { data: [], error: null };

    const { data, error } = await supabase
      .from('user_follows')
      .select('following_id')
      .eq('follower_id', currentUser.id);

    if (error) throw error;
    
    const followingIds = data?.map(follow => follow.following_id) || [];
    return { data: followingIds, error: null };
  } catch (error) {
    console.error('Error fetching following users list:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Suivre un utilisateur
 */
export const followUser = async (userId: string): Promise<{ error: Error | null }> => {
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) throw new Error('Non authentifié');

    // Vérifier si l'utilisateur est déjà suivi
    const { data: existingFollow } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', currentUser.id)
      .eq('following_id', userId)
      .maybeSingle();

    if (existingFollow) {
      return { error: null }; // Déjà suivi, pas d'erreur
    }

    const { error } = await supabase
      .from('user_follows')
      .insert({
        follower_id: currentUser.id,
        following_id: userId,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error following user:', error);
    return { error: error as Error };
  }
};

/**
 * Ne plus suivre un utilisateur
 */
export const unfollowUser = async (userId: string): Promise<{ error: Error | null }> => {
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) throw new Error('Non authentifié');

    const { error } = await supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', currentUser.id)
      .eq('following_id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return { error: error as Error };
  }
};

/**
 * Mettre à jour les paramètres de confidentialité
 */
export const updatePrivacySettings = async (settings: PrivacySettings): Promise<{ error: Error | null }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const { error } = await supabase
      .from('user_privacy_settings')
      .upsert({
        user_id: user.id,
        ...settings,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    return { error: error as Error };
  }
};

/**
 * Récupérer les paramètres de confidentialité
 */
export const getPrivacySettings = async (): Promise<{ data: PrivacySettings | null; error: Error | null }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const { data, error } = await supabase
      .from('user_privacy_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;

    // Paramètres par défaut si aucun n'existe
    const defaultSettings: PrivacySettings = {
      show_stats: true,
      show_posts: true,
      show_hd_type: true,
      show_location: false,
      show_website: true,
      allow_messages: true,
      allow_follow: true,
      profile_visible: true,
      show_cover_photo: true
    };

    return { data: data || defaultSettings, error: null };
  } catch (error) {
    console.error('Error fetching privacy settings:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Mettre à jour le profil étendu d'un utilisateur (location, website, etc.)
 */
export const updateExtendedProfile = async (userId: string, data: { location?: string; website?: string }): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('user_profiles_extended')
      .upsert({
        user_id: userId,
        ...data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating extended profile:', error);
    return { error: error as Error };
  }
};

/**
 * Rechercher des profils publics
 */
export const searchPublicProfiles = async (query: string, limit: number = 20): Promise<{ data: any[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        bio,
        photo_url,
        hd_type,
        created_at
      `)
      .ilike('name', `%${query}%`)
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error searching profiles:', error);
    return { data: null, error: error as Error };
  }
};