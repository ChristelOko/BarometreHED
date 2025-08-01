import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Flag, Filter, Search, Plus, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import { CommunityService, CommunityPost, CommunityStats } from '../../services/communityService';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';

interface CommunityFeedProps {
  onCreatePost?: () => void;
}

const CommunityFeed = ({ onCreatePost }: CommunityFeedProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showAlert } = useAlertStore();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const categories = [
    { id: '', label: 'Tous les posts', emoji: '🌸' },
    { id: 'experience', label: 'Expériences', emoji: '✨' },
    { id: 'question', label: 'Questions', emoji: '❓' },
    { id: 'insight', label: 'Insights', emoji: '💡' },
    { id: 'celebration', label: 'Célébrations', emoji: '🎉' }
  ];

  useEffect(() => {
    fetchCommunityData();
    fetchCommunityStats();
    
    // Actualiser les données toutes les 60 secondes
    const interval = setInterval(() => {
      fetchCommunityData();
      fetchCommunityStats();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [selectedCategory]);

  // Rafraîchir quand l'utilisateur revient sur l'onglet
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchCommunityData();
        fetchCommunityStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchCommunityData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await CommunityService.getCommunityPosts(
        selectedCategory || undefined,
        undefined,
        20,
        0
      );

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching community posts:', error);
      showAlert('Erreur lors du chargement des posts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommunityStats = async () => {
    try {
      const { data, error } = await CommunityService.getCommunityStats();
      if (error) throw error;
      setStats(data);
    } catch (error) {
      console.error('Error fetching community stats:', error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user?.id) {
      showAlert('Connectez-vous pour interagir avec la communauté', 'warning');
      return;
    }

    try {
      const { liked, error } = await CommunityService.toggleLike(postId, user.id);
      if (error) throw error;

      // Mettre à jour l'état local
      const newLikedPosts = new Set(likedPosts);
      if (liked) {
        newLikedPosts.add(postId);
      } else {
        newLikedPosts.delete(postId);
      }
      setLikedPosts(newLikedPosts);

      // Mettre à jour le post dans la liste
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, like_count: post.like_count + (liked ? 1 : -1) }
            : post
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      showAlert('Erreur lors de l\'interaction', 'error');
    }
  };

  const handleReport = async (postId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await CommunityService.reportContent(
        postId,
        'post',
        'Contenu inapproprié',
        user.id
      );

      if (error) throw error;
      showAlert('Contenu signalé. Merci de veiller à la bienveillance de notre communauté.', 'success');
    } catch (error) {
      console.error('Error reporting content:', error);
      showAlert('Erreur lors du signalement', 'error');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchCommunityData();
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await CommunityService.searchPosts(searchQuery, {
        category: selectedCategory || undefined
      });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error searching posts:', error);
      showAlert('Erreur lors de la recherche', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getHDTypeColor = (hdType: string) => {
    const colors: Record<string, string> = {
      'generator': 'bg-green-100 text-green-800',
      'projector': 'bg-blue-100 text-blue-800',
      'manifesting-generator': 'bg-purple-100 text-purple-800',
      'manifestor': 'bg-red-100 text-red-800',
      'reflector': 'bg-yellow-100 text-yellow-800'
    };
    return colors[hdType] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      'experience': '✨',
      'question': '❓',
      'insight': '💡',
      'celebration': '🎉'
    };
    return emojis[category] || '🌸';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header avec statistiques */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-primary">🌸 Fil de la communauté</h2>
          <Button
            variant="primary"
            onClick={onCreatePost}
            icon={<Plus size={18} />}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            Partager
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl">
            <div className="text-center">
              <div className="text-3xl font-display text-primary mb-1">{stats.totalPosts}</div>
              <div className="text-sm text-neutral-dark/70">Posts</div>
              <div className="w-8 h-1 bg-primary/30 rounded-full mx-auto mt-2"></div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display text-secondary mb-1">{stats.totalMembers}</div>
              <div className="text-sm text-neutral-dark/70">Membres</div>
              <div className="w-8 h-1 bg-secondary/30 rounded-full mx-auto mt-2"></div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display text-accent mb-1">{stats.activeToday}</div>
              <div className="text-sm text-neutral-dark/70">Actives aujourd'hui</div>
              <div className="w-8 h-1 bg-accent/30 rounded-full mx-auto mt-2"></div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display text-success mb-1">
                {stats.topTags.length > 0 ? stats.topTags[0].count : 0}
              </div>
              <div className="text-sm text-neutral-dark/70">
                {stats.topTags.length > 0 ? `#${stats.topTags[0].tag}` : 'Tags'}
              </div>
              <div className="w-8 h-1 bg-success/30 rounded-full mx-auto mt-2"></div>
            </div>
          </div>
        )}

        {/* Filtres et recherche */}
        <div className="space-y-4 bg-neutral/20 rounded-xl p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white hover:bg-primary/10 text-neutral-dark border border-neutral/20 hover:border-primary/30'
                }`}
              >
                {category.emoji} {category.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-dark/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Rechercher dans la communauté..."
                className="input-field pl-10 bg-white border-2 border-neutral/20 focus:border-primary/50"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleSearch}
              icon={<Search size={16} />}
              className="bg-white border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
              className="w-full sm:w-auto"
            >
              Rechercher
            </Button>
          </div>
        </div>
      </div>

      {/* Guidelines de la communauté */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20 shadow-sm">
        <h3 className="font-display text-lg text-primary mb-4 flex items-center">
          <Heart size={20} className="mr-2" />
          💫 Notre charte de bienveillance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-neutral-dark/80">
          {CommunityService.getCommunityGuidelines().slice(0, 4).map((guideline, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{guideline.split(' ').slice(1).join(' ')}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-primary/70 italic text-center">
          Ensemble, créons un espace de transformation et de soutien mutuel 🌸
        </div>
      </div>

      {/* Feed des posts */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-dark/70">Chargement de la communauté...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={32} className="text-primary" />
            </div>
            <h3 className="font-display text-xl text-neutral-dark/70 mb-2">
              Aucun post trouvé
            </h3>
            <p className="text-neutral-dark/50 mb-6 max-w-md mx-auto">
              Soyez la première à partager votre expérience !
            </p>
            <Button
              variant="primary"
              onClick={onCreatePost}
              icon={<Plus size={18} />}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              Créer le premier post
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header du post */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/public/${post.user_id}`);
                      }}
                      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors overflow-hidden"
                    >
                      {post.user_avatar_url && !post.is_anonymous ? (
                        <img 
                          src={post.user_avatar_url} 
                          alt={post.user_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-primary font-medium">
                          {post.is_anonymous ? '🌸' : post.user_name.charAt(0)}
                        </span>
                      )}
                    </button>
                    <div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/public/${post.user_id}`);
                          }}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {post.is_anonymous ? 'Utilisatrice anonyme' : post.user_name}
                        </button>
                        {post.hd_type && (
                          <span className={`px-2 py-1 rounded-full text-xs ${getHDTypeColor(post.hd_type)}`}>
                            {post.hd_type}
                          </span>
                        )}
                        <span className="text-xs text-neutral-dark/50">
                          {getCategoryEmoji(post.category)}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-dark/50">
                        {new Date(post.created_at!).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReport(post.id!)}
                    className="p-2 text-neutral-dark/30 hover:text-error transition-colors"
                    title="Signaler"
                  >
                    <Flag size={16} />
                  </button>
                </div>

                {/* Contenu du post */}
                <div className="mb-4">
                  <h3 className="font-display text-lg mb-2">{post.title}</h3>
                  <p className="text-neutral-dark/80 leading-relaxed">{post.content}</p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral/10">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id!)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-colors ${
                        likedPosts.has(post.id!)
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-primary/10 text-neutral-dark/70'
                      }`}
                    >
                      <Heart size={16} className={likedPosts.has(post.id!) ? 'fill-current' : ''} />
                      <span className="text-sm">{post.like_count}</span>
                    </button>

                    <button className="flex items-center space-x-1 px-3 py-2 rounded-full hover:bg-secondary/10 text-neutral-dark/70 transition-colors">
                      <MessageCircle size={16} />
                      <span className="text-sm">{post.comment_count}</span>
                    </button>
                  </div>

                  <button className="flex items-center space-x-1 px-3 py-2 rounded-full hover:bg-accent/10 text-neutral-dark/70 transition-colors">
                    <Share2 size={16} />
                    <span className="text-sm">Partager</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Tags populaires */}
      {stats && stats.topTags.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral/10">
          <h3 className="font-display text-lg mb-4 text-primary flex items-center">
            <Star size={20} className="mr-2" />
            🏷️ Tags Populaires
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.topTags.slice(0, 10).map((tag, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(`#${tag.tag}`);
                  handleSearch();
                }}
                className="px-3 py-2 bg-gradient-to-r from-neutral to-neutral/80 hover:from-primary/10 hover:to-primary/5 rounded-full text-sm transition-all hover:scale-105 border border-neutral/20 hover:border-primary/30"
              >
                <span className="font-medium">#{tag.tag}</span>
                <span className="text-primary ml-1">({tag.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;