import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Calendar, 
  MapPin, 
  Globe, 
  Heart, 
  MessageCircle, 
  Share2, 
  Flag,
  ArrowLeft,
  Star,
  Activity,
  Sparkles,
  Crown,
  Shield,
  EyeOff,
  Camera,
  Edit,
  Settings,
  MoreHorizontal,
  UserPlus,
  Mail,
  Phone
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import { getPublicProfile, getUserPosts, followUser, unfollowUser } from '../../services/profileService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PublicProfileData {
  id: string;
  name: string;
  bio: string;
  avatar_url?: string;
  cover_photo?: string;
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
    profile_visible: boolean;
    show_stats: boolean;
    show_posts: boolean;
    show_hd_type: boolean;
    show_location: boolean;
    show_website: boolean;
    show_cover_photo: boolean;
  };
}

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const { showAlert } = useAlertStore();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [profileVisible, setProfileVisible] = useState(true);
  const [showMoreActions, setShowMoreActions] = useState(false);

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const { data: profileData, error } = await getPublicProfile(userId);
      
      if (error) throw error;
      if (!profileData) {
        console.log('No profile data returned for userId:', userId);
        showAlert('Profil non trouvé ou privé', 'warning');
        // Don't navigate away immediately, show the private profile message instead
        setProfileVisible(false);
        return;
      }

      // Vérifier si le profil est visible publiquement
      if (profileData.privacy_settings && !profileData.privacy_settings.profile_visible && profileData.id !== currentUser?.id) {
        setProfileVisible(false);
        return;
      }

      setProfile(profileData);
      setIsFollowing(profileData.is_following || false);
      setFollowersCount(profileData.stats.followers_count);
    } catch (error) {
      console.error('Error loading profile:', error);
      console.log('Profile loading error details:', error);
      showAlert('Erreur lors du chargement du profil', 'warning');
      setProfileVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Si le profil n'est pas visible publiquement
  if (!profileVisible) {
    return (
      <div className="min-h-screen py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral/10">
              <div className="w-20 h-20 bg-neutral/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <EyeOff size={40} className="text-neutral-dark/40" />
              </div>
              <h2 className="font-display text-3xl text-neutral-dark/70 mb-4">
                Profil privé
              </h2>
              <p className="text-neutral-dark/60 mb-8 text-lg">
                Cette utilisatrice a choisi de garder son profil privé.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/community')}
                icon={<ArrowLeft size={18} />}
              >
                Retour à la communauté
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleFollow = async () => {
    if (!isAuthenticated || !currentUser?.id || !userId) {
      showAlert('Connectez-vous pour suivre des membres', 'warning');
      return;
    }

    try {
      if (isFollowing) {
        const { error } = await unfollowUser(userId);
        if (error) throw error;
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
        showAlert('Vous ne suivez plus cette personne', 'info');
      } else {
        const { error } = await followUser(userId);
        if (error) throw error;
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        showAlert('Vous suivez maintenant cette personne', 'success');
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      showAlert('Erreur lors de l\'action', 'error');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Profil de ${profile?.name} - Baromètre Énergétique`,
      text: `Découvrez le profil de ${profile?.name} sur notre communauté énergétique`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        await navigator.clipboard.writeText(window.location.href);
        showAlert('Lien copié dans le presse-papier', 'success');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showAlert('Lien copié dans le presse-papier', 'success');
    }
  };

  const handleReport = () => {
    showAlert('Signalement envoyé. Merci de veiller à la bienveillance de notre communauté.', 'success');
  };

  const handleContact = () => {
    if (profile?.website) {
      window.open(profile.website, '_blank');
    } else {
      showAlert('Aucun moyen de contact disponible', 'info');
    }
  };

  const getHDTypeColor = (hdType: string) => {
    const colors: Record<string, string> = {
      'generator': 'bg-green-100 text-green-800 border-green-200',
      'projector': 'bg-blue-100 text-blue-800 border-blue-200',
      'manifesting-generator': 'bg-purple-100 text-purple-800 border-purple-200',
      'manifestor': 'bg-red-100 text-red-800 border-red-200',
      'reflector': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[hdType] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-neutral-dark/70 text-lg">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen py-32 flex items-center justify-center">
        <div className="text-center">
          <User size={64} className="mx-auto text-neutral-dark/30 mb-6" />
          <h2 className="font-display text-2xl text-neutral-dark/70 mb-4">Profil non trouvé</h2>
          <Button variant="primary" onClick={() => navigate('/community')}>
            Retour à la communauté
          </Button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="min-h-screen bg-neutral">
      {/* Photo de couverture */}
      <div className="relative">
        {profile.cover_photo && profile.privacy_settings.show_cover_photo ? (
          <div className="h-64 md:h-80 lg:h-96 relative overflow-hidden">
            <img 
              src={profile.cover_photo} 
              alt="Couverture"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/default-cover.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="h-48 md:h-64 relative overflow-hidden">
            <img 
              src="/default-cover.svg" 
              alt="Couverture par défaut"
              className="w-full h-full object-cover object-center opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}

        {/* Header avec navigation */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/community')}
            icon={<ArrowLeft size={18} />}
            className="bg-white/90 backdrop-blur-sm border-white/20 text-neutral-dark hover:bg-white"
          >
            Retour
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              icon={<Share2 size={16} />}
              className="bg-white/90 backdrop-blur-sm border-white/20 text-neutral-dark hover:bg-white"
            >
              Partager
            </Button>
            
            {!isOwnProfile && (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  icon={<MoreHorizontal size={16} />}
                  className="bg-white/90 backdrop-blur-sm border-white/20 text-neutral-dark hover:bg-white"
                />
                
                <AnimatePresence>
                  {showMoreActions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral/10 py-2 z-20"
                    >
                      <button
                        onClick={handleContact}
                        className="w-full flex items-center px-4 py-2 text-sm text-neutral-dark hover:bg-neutral/10 transition-colors"
                      >
                        <Mail size={16} className="mr-2" />
                        Contacter
                      </button>
                      <button
                        onClick={handleReport}
                        className="w-full flex items-center px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                      >
                        <Flag size={16} className="mr-2" />
                        Signaler
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Carte profil principal */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral/10 overflow-hidden mb-8">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar */}
                <div className="relative mx-auto md:mx-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-4 border-white shadow-xl">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/default-avatar.svg';
                        }}
                      />
                    ) : (
                      <img 
                        src="/default-avatar.svg" 
                        alt={profile.name}
                        className="w-full h-full object-cover opacity-80"
                      />
                    )}
                  </div>
                  
                  {/* Badges de statut */}
                  <div className="absolute -bottom-2 -right-2 flex flex-col space-y-1">
                    {profile.is_verified && (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <Shield size={16} className="text-white" />
                      </div>
                    )}
                    {profile.is_premium && (
                      <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center shadow-lg">
                        <Crown size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations principales */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h1 className="font-display text-3xl md:text-4xl mb-2 flex items-center justify-center md:justify-start">
                        {profile.name}
                        {profile.is_verified && (
                          <Shield size={24} className="text-blue-500 ml-2" />
                        )}
                        {profile.is_premium && (
                          <Crown size={24} className="text-warning ml-2" />
                        )}
                      </h1>
                      
                      {profile.privacy_settings.show_hd_type && profile.hd_type && (
                        <div className="mb-4">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getHDTypeColor(profile.hd_type)}`}>
                            <Sparkles size={14} className="mr-2" />
                            {profile.hd_type}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions principales */}
                    {!isOwnProfile && isAuthenticated && (
                      <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                        <Button
                          variant={isFollowing ? "outline" : "primary"}
                          onClick={handleFollow}
                          icon={isFollowing ? <Heart size={18} className="fill-current" /> : <UserPlus size={18} />}
                          className="min-w-[120px]"
                        >
                          {isFollowing ? 'Suivi(e)' : 'Suivre'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => navigate('/community')}
                          icon={<MessageCircle size={18} />}
                        >
                          Message
                        </Button>
                      </div>
                    )}

                    {isOwnProfile && (
                      <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                        <Button
                          variant="primary"
                          onClick={() => navigate('/profile')}
                          icon={<Edit size={18} />}
                        >
                          Modifier
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => navigate('/profile/privacy')}
                          icon={<Settings size={18} />}
                        >
                          Confidentialité
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-neutral-dark/80 mb-6 leading-relaxed text-lg">
                      {profile.bio}
                    </p>
                  )}

                  {/* Métadonnées */}
                  <div className="flex flex-wrap gap-4 text-sm text-neutral-dark/70 justify-center md:justify-start">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      Membre depuis {format(new Date(profile.joined_date), 'MMMM yyyy', { locale: fr })}
                    </div>
                    
                    {profile.location && profile.privacy_settings.show_location && (
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2" />
                        {profile.location}
                      </div>
                    )}
                    
                    {profile.website && profile.privacy_settings.show_website && (
                      <a 
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-primary transition-colors"
                      >
                        <Globe size={16} className="mr-2" />
                        Site web
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              {profile.privacy_settings.show_stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8 pt-8 border-t border-neutral/10">
                  <div className="text-center">
                    <div className="text-3xl font-display text-primary mb-1">{profile.stats.total_scans}</div>
                    <div className="text-sm text-neutral-dark/70">Scans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-display text-secondary mb-1">{profile.stats.average_score}%</div>
                    <div className="text-sm text-neutral-dark/70">Score moyen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-display text-accent mb-1">{profile.stats.posts_count}</div>
                    <div className="text-sm text-neutral-dark/70">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-display text-success mb-1">{followersCount}</div>
                    <div className="text-sm text-neutral-dark/70">Abonnés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-display text-warning mb-1">{profile.stats.following_count}</div>
                    <div className="text-sm text-neutral-dark/70">Abonnements</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Posts récents */}
          {profile.privacy_settings.show_posts && profile.recent_posts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-neutral/10 overflow-hidden mb-8">
              <div className="p-6 md:p-8">
                <h2 className="font-display text-2xl mb-6 flex items-center">
                  <MessageCircle size={24} className="text-primary mr-3" />
                  Posts récents
                </h2>
                <div className="space-y-6">
                  {profile.recent_posts.map((post, index) => (
                    <div key={post.id} className="border-b border-neutral/10 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MessageCircle size={20} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-2 text-lg">{post.title}</h3>
                          <p className="text-neutral-dark/80 mb-3 line-clamp-3 leading-relaxed">{post.content}</p>
                          <div className="flex items-center space-x-6 text-sm text-neutral-dark/60">
                            <span>{format(new Date(post.created_at), 'dd MMM yyyy', { locale: fr })}</span>
                            <div className="flex items-center space-x-1">
                              <Heart size={14} />
                              <span>{post.like_count}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle size={14} />
                              <span>{post.comment_count}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/community')}
                    icon={<MessageCircle size={18} />}
                  >
                    Voir tous les posts dans la communauté
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Call to action final */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
              <h3 className="font-display text-2xl mb-4 text-primary">
                🌸 Rejoignez notre communauté !
              </h3>
              <p className="text-neutral-dark/80 mb-6 text-lg">
                Partagez votre expérience énergétique et connectez-vous avec d'autres femmes conscientes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isOwnProfile ? (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => navigate('/community')}
                      icon={<MessageCircle size={18} />}
                    >
                      Participer aux discussions
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/profile')}
                      icon={<Edit size={18} />}
                    >
                      Modifier mon profil
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => navigate('/community')}
                      icon={<MessageCircle size={18} />}
                    >
                      Participer aux discussions
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/community/directory')}
                      icon={<User size={18} />}
                    >
                      Découvrir d'autres profils
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicProfile;