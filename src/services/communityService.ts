/**
 * Service de communauté pour le partage d'expériences entre utilisatrices
 * Permet l'échange sécurisé et bienveillant d'insights énergétiques
 */

import { supabase } from './supabaseClient';

export interface CommunityPost {
  id?: string;
  user_id: string;
  user_name: string;
  user_avatar_url?: string;
  hd_type?: string;
  title: string;
  content: string;
  category: 'experience' | 'question' | 'insight' | 'celebration';
  tags: string[];
  is_anonymous: boolean;
  like_count: number;
  comment_count: number;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CommunityComment {
  id?: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar_url?: string;
  content: string;
  is_anonymous: boolean;
  like_count: number;
  created_at?: string;
}

export interface CommunityStats {
  totalPosts: number;
  totalMembers: number;
  activeToday: number;
  topTags: Array<{ tag: string; count: number }>;
}

export class CommunityService {
  /**
   * Récupère les posts de la communauté avec filtres
   */
  static async getCommunityPosts(
    category?: string,
    tag?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ data: CommunityPost[] | null; error: Error | null }> {
    try {
      let query = supabase
        .from('community_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (category) {
        query = query.eq('category', category);
      }

      if (tag) {
        query = query.contains('tags', [tag]);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching community posts:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Crée un nouveau post dans la communauté
   */
  static async createPost(
    post: Omit<CommunityPost, 'id' | 'like_count' | 'comment_count' | 'created_at' | 'updated_at'>
  ): Promise<{ data: CommunityPost | null; error: Error | null }> {
    try {
      // Modération automatique du contenu
      const moderatedContent = await this.moderateContent(post.content);
      if (!moderatedContent.approved) {
        throw new Error('Le contenu ne respecte pas nos guidelines communautaires');
      }

      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          ...post,
          content: moderatedContent.content,
          like_count: 0,
          comment_count: 0,
          is_published: true,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating community post:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Ajoute un commentaire à un post
   */
  static async addComment(
    comment: Omit<CommunityComment, 'id' | 'like_count' | 'created_at'>
  ): Promise<{ data: CommunityComment | null; error: Error | null }> {
    try {
      // Modération du commentaire
      const moderatedContent = await this.moderateContent(comment.content);
      if (!moderatedContent.approved) {
        throw new Error('Le commentaire ne respecte pas nos guidelines');
      }

      const { data, error } = await supabase
        .from('community_comments')
        .insert([{
          ...comment,
          content: moderatedContent.content,
          like_count: 0,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Incrémenter le compteur de commentaires du post
      await supabase
        .from('community_posts')
        .update({ comment_count: supabase.sql`comment_count + 1` })
        .eq('id', comment.post_id);

      return { data, error: null };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Like/Unlike un post
   */
  static async toggleLike(
    postId: string,
    userId: string
  ): Promise<{ liked: boolean; error: Error | null }> {
    try {
      // Vérifier si déjà liké
      const { data: existingLike } = await supabase
        .from('community_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingLike) {
        // Supprimer le like
        await supabase
          .from('community_likes')
          .delete()
          .eq('id', existingLike.id);

        // Décrémenter le compteur
        await supabase
          .from('community_posts')
          .update({ like_count: supabase.sql`like_count - 1` })
          .eq('id', postId);

        return { liked: false, error: null };
      } else {
        // Ajouter le like
        await supabase
          .from('community_likes')
          .insert([{ post_id: postId, user_id: userId }]);

        // Incrémenter le compteur
        await supabase
          .from('community_posts')
          .update({ like_count: supabase.sql`like_count + 1` })
          .eq('id', postId);

        return { liked: true, error: null };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return { liked: false, error: error as Error };
    }
  }

  /**
   * Récupère les statistiques de la communauté
   */
  static async getCommunityStats(): Promise<{ data: CommunityStats | null; error: Error | null }> {
    try {
      // Compter les posts
      const { count: totalPosts } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      // Compter les membres actifs (ayant posté ou commenté)
      const { data: activeMembers } = await supabase
        .from('community_posts')
        .select('user_id')
        .eq('is_published', true);

      const uniqueMembers = new Set(activeMembers?.map(m => m.user_id) || []);

      // Membres actifs aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const { count: activeToday } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)
        .gte('created_at', today);

      // Tags populaires
      const { data: posts } = await supabase
        .from('community_posts')
        .select('tags')
        .eq('is_published', true);

      const tagCounts: Record<string, number> = {};
      posts?.forEach(post => {
        post.tags?.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      const topTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }));

      const stats: CommunityStats = {
        totalPosts: totalPosts || 0,
        totalMembers: uniqueMembers.size,
        activeToday: activeToday || 0,
        topTags
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching community stats:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Recherche dans la communauté
   */
  static async searchPosts(
    query: string,
    filters: {
      category?: string;
      hdType?: string;
      dateFrom?: string;
      dateTo?: string;
    } = {}
  ): Promise<{ data: CommunityPost[] | null; error: Error | null }> {
    try {
      let searchQuery = supabase
        .from('community_posts')
        .select('*')
        .eq('is_published', true)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (filters.category) {
        searchQuery = searchQuery.eq('category', filters.category);
      }

      if (filters.hdType) {
        searchQuery = searchQuery.eq('hd_type', filters.hdType);
      }

      if (filters.dateFrom) {
        searchQuery = searchQuery.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        searchQuery = searchQuery.lte('created_at', filters.dateTo);
      }

      const { data, error } = await searchQuery.limit(50);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error searching posts:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Récupère les posts recommandés pour un utilisateur
   */
  static async getRecommendedPosts(
    userId: string,
    hdType: string,
    recentCategories: string[] = []
  ): Promise<{ data: CommunityPost[] | null; error: Error | null }> {
    try {
      // Algorithme de recommandation simple basé sur :
      // 1. Type HD similaire
      // 2. Catégories récemment explorées
      // 3. Posts populaires

      let query = supabase
        .from('community_posts')
        .select('*')
        .eq('is_published', true)
        .order('like_count', { ascending: false })
        .limit(10);

      // Prioriser les posts du même type HD
      if (hdType) {
        query = query.eq('hd_type', hdType);
      }

      const { data: hdTypePosts, error: hdError } = await query;

      if (hdError) throw hdError;

      // Si pas assez de posts du même type HD, récupérer des posts populaires
      if ((hdTypePosts?.length || 0) < 5) {
        const { data: popularPosts, error: popularError } = await supabase
          .from('community_posts')
          .select('*')
          .eq('is_published', true)
          .order('like_count', { ascending: false })
          .limit(10);

        if (popularError) throw popularError;

        // Mélanger les résultats
        const combinedPosts = [...(hdTypePosts || []), ...(popularPosts || [])]
          .filter((post, index, self) => 
            index === self.findIndex(p => p.id === post.id)
          )
          .slice(0, 10);

        return { data: combinedPosts, error: null };
      }

      return { data: hdTypePosts, error: null };
    } catch (error) {
      console.error('Error getting recommended posts:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Modération automatique du contenu
   */
  private static async moderateContent(content: string): Promise<{
    approved: boolean;
    content: string;
    flags: string[];
  }> {
    const flags: string[] = [];
    let moderatedContent = content;

    // Liste de mots/phrases à modérer
    const inappropriateWords = [
      'spam', 'publicité', 'vente', 'achat',
      // Ajouter d'autres mots selon les besoins
    ];

    const lowerContent = content.toLowerCase();
    
    // Vérifier les mots inappropriés
    inappropriateWords.forEach(word => {
      if (lowerContent.includes(word)) {
        flags.push(`Contenu commercial détecté: ${word}`);
      }
    });

    // Vérifier la longueur
    if (content.length > 2000) {
      flags.push('Contenu trop long');
    }

    if (content.length < 10) {
      flags.push('Contenu trop court');
    }

    // Vérifier les liens suspects
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlRegex);
    if (urls && urls.length > 2) {
      flags.push('Trop de liens externes');
    }

    // Approuver si pas de flags critiques
    const approved = flags.length === 0;

    return {
      approved,
      content: moderatedContent,
      flags
    };
  }

  /**
   * Signaler un contenu inapproprié
   */
  static async reportContent(
    contentId: string,
    contentType: 'post' | 'comment',
    reason: string,
    reporterId: string
  ): Promise<{ error: Error | null }> {
    try {
      await supabase
        .from('content_reports')
        .insert([{
          content_id: contentId,
          content_type: contentType,
          reason,
          reporter_id: reporterId,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);

      return { error: null };
    } catch (error) {
      console.error('Error reporting content:', error);
      return { error: error as Error };
    }
  }

  /**
   * Récupère les guidelines de la communauté
   */
  static getCommunityGuidelines(): string[] {
    return [
      '🌸 Partagez avec bienveillance et authenticité',
      '💗 Respectez la diversité des expériences énergétiques',
      '🌙 Évitez les conseils médicaux - partagez votre vécu personnel',
      '✨ Utilisez un langage inclusif et non-jugeant',
      '🌿 Gardez le focus sur l\'énergie et le Human Design',
      '💫 Célébrez les victoires et soutenez les défis',
      '🦋 Respectez l\'anonymat quand demandé',
      '🌺 Évitez la promotion commerciale directe'
    ];
  }

  /**
   * Suggestions de tags populaires
   */
  static getPopularTags(): string[] {
    return [
      'première-fois', 'breakthrough', 'confusion', 'clarté',
      'fatigue', 'énergie-haute', 'cycle-féminin', 'travail',
      'relations', 'famille', 'créativité', 'spiritualité',
      'generator', 'projector', 'manifestor', 'reflector',
      'manifesting-generator', 'autorité-sacrale', 'autorité-émotionnelle',
      'centres-ouverts', 'centres-définis', 'profil', 'incarnation'
    ];
  }
}