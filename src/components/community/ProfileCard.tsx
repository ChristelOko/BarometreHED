import { motion } from 'framer-motion';
import { User, Crown, Shield, Heart, MessageCircle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    bio?: string;
    avatar_url?: string | null;
    hd_type?: string;
    location?: string;
    is_verified?: boolean;
    is_premium?: boolean;
    is_beta_tester?: boolean;
    stats?: {
      posts_count: number;
      followers_count: number;
    };
  };
  showStats?: boolean;
  onFollow?: (userId: string) => void;
  isFollowing?: boolean;
}

const ProfileCard = ({ profile, showStats = true, onFollow, isFollowing }: ProfileCardProps) => {
  const navigate = useNavigate();

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

  const getBadgeInfo = () => {
    const badges = [];
    
    if (profile.is_verified) {
      badges.push({
        icon: Shield,
        color: 'bg-blue-500',
        title: 'Profil vérifié'
      });
    }
    
    if (profile.is_beta_tester) {
      badges.push({
        icon: Crown,
        color: 'bg-primary',
        title: 'Bétatesteuse'
      });
    } else if (profile.is_premium) {
      badges.push({
        icon: Crown,
        color: 'bg-warning',
        title: 'Membre Premium'
      });
    }
    
    return badges;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer border border-neutral/10 hover:border-primary/20 group"
      onClick={() => navigate(`/profile/public/${profile.id}`)}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Avatar */}
        <div className="relative">
          <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden flex items-center justify-center border-4 shadow-lg group-hover:shadow-xl transition-all ${
            profile.role === 'admin' ? 'border-purple-300 bg-purple-50 ring-2 ring-purple-200' : 
            profile.is_premium ? 'border-warning bg-warning/10 ring-2 ring-warning/30' :
            profile.is_verified ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-200' :
            'border-white bg-primary/10'
          }`}>
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.name}
                className="w-full h-full object-cover object-center rounded-full group-hover:scale-105 transition-transform"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/default-avatar.svg';
                }}
              />
            ) : (
              <img 
                src="/default-avatar.svg" 
                alt={profile.name}
                className="w-full h-full object-cover object-center rounded-full group-hover:scale-105 transition-transform opacity-80"
              />
            )}
          </div>
          
          {/* Badges */}
          {getBadgeInfo().length > 0 && (
            <div className="absolute -bottom-2 -right-2 flex flex-col space-y-1">
              {getBadgeInfo().map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div 
                    key={index}
                    className={`w-6 h-6 ${badge.color} rounded-full flex items-center justify-center shadow-md border-2 border-white`}
                    title={badge.title}
                  >
                    <Icon size={12} className="text-white" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="w-full">
          <h3 className="font-display text-xl mb-2 text-neutral-dark flex items-center justify-center">
            {profile.name}
            {profile.role === 'admin' && (
              <div className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                Admin
              </div>
            )}
            {profile.is_premium && profile.role !== 'admin' && (
              <div className="ml-2 px-2 py-1 bg-warning/20 text-warning rounded-full text-xs font-medium">
                Beta
              </div>
            )}
            {profile.is_verified && !profile.is_premium && profile.role !== 'admin' && (
              <Shield size={16} className="text-blue-500 ml-2" />
            )}
          </h3>

          {/* Type HD */}
          {profile.hd_type && (
            <div className="mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getHDTypeColor(profile.hd_type)}`}>
              {profile.hd_type}
              </span>
            </div>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-neutral-dark/70 mb-4 line-clamp-3 leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Localisation */}
          {profile.location && (
            <div className="flex items-center justify-center text-xs text-neutral-dark/60 mb-4">
              <MapPin size={12} className="mr-1" />
              {profile.location}
            </div>
          )}

          {/* Statistiques */}
          {showStats && profile.stats && (
            <div className="flex items-center justify-center space-x-4 text-xs text-neutral-dark/60 mb-4">
              <div className="flex items-center">
                <MessageCircle size={12} className="mr-1" />
                {profile.stats.posts_count} posts
              </div>
              <div className="flex items-center">
                <Heart size={12} className="mr-1" />
                {profile.stats.followers_count} abonnés
              </div>
            </div>
          )}
          
          {/* Bouton de suivi */}
          {onFollow && (
            <Button
              variant={isFollowing ? "outline" : "primary"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onFollow(profile.id);
              }}
              icon={<Heart size={14} className={isFollowing ? "fill-current" : ""} />}
              fullWidth
            >
              {isFollowing ? 'Suivi(e)' : 'Suivre'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;