import { useState, useEffect } from 'react';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Crown, Shield, Heart, User, MessageCircle, Camera, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
import ProfileCard from '../../components/community/ProfileCard';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import { getAllPublicProfiles, searchPublicProfiles, followUser, unfollowUser, getFollowingUsersList, getFeaturedMembers, getNewMembers } from '../../services/profileService';
import { useNavigate } from 'react-router-dom';

// Skeleton component pour le loading
const ProfileSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral/10 animate-pulse">
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="w-24 h-24 bg-neutral/20 rounded-full"></div>
      <div className="w-full space-y-2">
        <div className="h-4 bg-neutral/20 rounded w-3/4 mx-auto"></div>
        <div className="h-3 bg-neutral/20 rounded w-1/2 mx-auto"></div>
        <div className="h-8 bg-neutral/20 rounded w-full"></div>
      </div>
    </div>
  </div>
);

// Cache pour les profils
let profilesCache: any[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const CommunityDirectory = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { showAlert } = useAlertStore();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [newMembers, setNewMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHDType, setSelectedHDType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PROFILES_PER_PAGE = 20;

  const hdTypes = [
    { value: '', label: 'Tous les types' },
    { value: 'generator', label: 'Generator' },
    { value: 'projector', label: 'Projector' },
    { value: 'manifesting-generator', label: 'Manifesting Generator' },
    { value: 'manifestor', label: 'Manifestor' },
    { value: 'reflector', label: 'Reflector' }
  ];

  useEffect(() => {
    loadProfiles();
    loadNewMembers();
    loadFollowingUsers();
  }, []);

  const loadFollowingUsers = async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      const { data, error } = await getFollowingUsersList();
      if (error) throw error;
      
      setFollowingUsers(new Set(data || []));
    } catch (error) {
      console.error('Error loading following users:', error);
    }
  };

  const loadProfiles = async () => {
    try {
      setIsLoading(true);
      
      // Vérifier le cache
      const now = Date.now();
      if (profilesCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
        setProfiles(profilesCache);
        const featured = getFeaturedMembers(profilesCache, 8);
        setFeaturedProfiles(featured);
        setIsLoading(false);
        return;
      }
      
      // Charger les profils avec pagination
      const { data, error } = await getAllPublicProfiles(100); // Limite raisonnable
      
      if (error) throw error;

      const profilesData = data || [];
      
      // Mettre en cache
      profilesCache = profilesData;
      cacheTimestamp = now;
      
      setProfiles(profilesData);
      
      // Sélectionner les membres à mettre en lumière
      const featured = getFeaturedMembers(profilesData, 8);
      setFeaturedProfiles(featured);
    } catch (error) {
      console.error('Error loading profiles:', error);
      showAlert('Erreur lors du chargement des profils', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadNewMembers = async () => {
    try {
      const { data, error } = await getNewMembers(48); // Dernières 48 heures
      
      if (error) throw error;
      setNewMembers(data || []);
    } catch (error) {
      console.error('Error loading new members:', error);
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadProfiles();
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await searchPublicProfiles(searchQuery);
      
      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error searching profiles:', error);
      showAlert('Erreur lors de la recherche', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!isAuthenticated || !user?.id) {
      showAlert('Connectez-vous pour suivre des membres', 'warning');
      return;
    }

    // Empêcher l'auto-suivi
    if (user.id === userId) {
      showAlert('Vous ne pouvez pas vous suivre vous-même', 'warning');
      return;
    }

    try {
      const isCurrentlyFollowing = followingUsers.has(userId);
      
      if (isCurrentlyFollowing) {
        const { error } = await unfollowUser(userId);
        if (error) throw error;
        
        setFollowingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        showAlert('Vous ne suivez plus cette personne', 'info');
      } else {
        const { error } = await followUser(userId);
        if (error) throw error;
        
        setFollowingUsers(prev => new Set(prev).add(userId));
        showAlert('Vous suivez maintenant cette personne', 'success');
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      showAlert('Erreur lors de l\'action', 'error');
    }
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesHDType = !selectedHDType || profile.hd_type === selectedHDType;
      const matchesLocation = !selectedLocation || profile.location?.includes(selectedLocation);
      return matchesHDType && matchesLocation;
    });
  }, [profiles, selectedHDType, selectedLocation]);

  // Pagination virtuelle
  const paginatedProfiles = filteredProfiles.slice(0, currentPage * PROFILES_PER_PAGE);
  
  const loadMore = () => {
    if (paginatedProfiles.length < filteredProfiles.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full"></div>
              <h1 className="font-display text-4xl md:text-5xl mb-4 relative z-10">
                🌸 Annuaire de la Communauté
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-neutral-dark/80 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Découvrez les visages de notre communauté énergétique ! Connectez-vous avec des femmes qui partagent votre chemin de conscience et d'éveil.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6 mb-8"
            >
              <div className="flex items-center space-x-2 text-primary bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Users size={20} />
                <span className="font-medium">Communauté authentique</span>
              </div>
              <div className="flex items-center space-x-2 text-secondary bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Heart size={20} />
                <span className="font-medium">Connexions sincères</span>
              </div>
              <div className="flex items-center space-x-2 text-accent bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <MessageCircle size={20} />
                <span className="font-medium">Partage bienveillant</span>
              </div>
            </motion.div>
          </div>

          {/* Galerie de photos en vedette */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
              <h2 className="font-display text-2xl text-center mb-6 text-primary">
                ✨ Nos Membres en Lumière
              </h2>
              <div className="flex justify-center items-center space-x-4 mb-6">
                {featuredProfiles.map((profile, index) => (
                  <motion.div
                    key={profile.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="relative group cursor-pointer"
                    onClick={() => navigate(`/profile/public/${profile.id}`)}
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-3 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {(profile.role === 'admin' || profile.is_premium) && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-warning rounded-full flex items-center justify-center shadow-md">
                        {profile.role === 'admin' ? (
                          <Shield size={12} className="text-white" />
                        ) : (
                          <Crown size={12} className="text-white" />
                        )}
                      </div>
                    )}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-medium text-primary">{profile.name.split(' ')[0]}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-neutral-dark/70 text-sm">
                ✨ Membres mis en lumière selon leur contribution à la communauté
              </p>
            </div>
          </motion.div>

          {/* Section nouveaux membres */}
          {newMembers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-12"
            >
              <div className="bg-gradient-to-r from-success/10 to-accent/10 rounded-2xl p-8 border border-success/20">
                <h2 className="font-display text-2xl text-center mb-6 text-success">
                  🌱 Nouvelles Arrivées (48h)
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                  {newMembers.slice(0, 12).map((profile, index) => (
                    <motion.div
                      key={profile.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                      className="relative group cursor-pointer text-center"
                      onClick={() => navigate(`/profile/public/${profile.id}`)}
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-3 border-success shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto mb-2">
                        {profile.avatar_url ? (
                          <img 
                            src={profile.avatar_url} 
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-success/20 flex items-center justify-center">
                            <span className="text-success font-medium text-lg">
                              {profile.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Badge "Nouveau" */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-bold">N</span>
                      </div>
                      
                      {/* Badges de statut */}
                      {(profile.role === 'admin' || profile.is_premium) && (
                        <div className="absolute -top-1 -left-1 w-5 h-5 bg-warning rounded-full flex items-center justify-center shadow-md">
                          {profile.role === 'admin' ? (
                            <Shield size={10} className="text-white" />
                          ) : (
                            <Crown size={10} className="text-white" />
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs font-medium text-success truncate">
                        {profile.name.split(' ')[0]}
                      </div>
                      <div className="text-xs text-neutral-dark/60">
                        {profile.hoursSinceJoined}h
                      </div>
                      {profile.hd_type && (
                        <div className="text-xs text-success/70 truncate">
                          {profile.hd_type}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-sm text-neutral-dark/70 mb-4">
                    🌸 {newMembers.length} nouvelle{newMembers.length > 1 ? 's' : ''} membre{newMembers.length > 1 ? 's' : ''} nous {newMembers.length > 1 ? 'ont' : 'a'} rejoint{newMembers.length > 1 ? 'es' : ''} !
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Scroll vers la liste complète
                      const profilesList = document.getElementById('profiles-list');
                      if (profilesList) {
                        profilesList.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    icon={<Users size={18} />}
                    className="border-2 border-success/30 hover:border-success/50 text-success hover:bg-success/10"
                  >
                    Découvrir tous les profils
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          {/* Header original simplifié */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl mb-4">
              🌸 Annuaire de la Communauté
            </h1>
            <p className="text-lg text-neutral-dark/80 max-w-3xl mx-auto">
              Explorez tous les profils de notre communauté et créez des connexions authentiques.
            </p>
            
            {/* Explication de la mise en lumière */}
            <div className="bg-primary/5 rounded-xl p-4 mb-8 border border-primary/20">
              <h3 className="font-medium text-primary mb-2 text-center">
                🌟 Comment nous choisissons les membres en lumière
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-neutral-dark/80">
                <div className="flex items-center space-x-2">
                  <Shield size={16} className="text-purple-500" />
                  <span>Administratrices (50 pts)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Crown size={16} className="text-warning" />
                  <span>Bétatesteuses (40 pts)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Camera size={16} className="text-secondary" />
                  <span>Photo de profil (20 pts)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle size={16} className="text-accent" />
                  <span>Activité communauté (15 pts)</span>
                </div>
              </div>
              <p className="text-xs text-center text-neutral-dark/60 mt-2 italic">
                Plus vous participez, plus vous avez de chances d'être mise en lumière ! ✨
              </p>
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Recherche */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-dark/50" />
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="input-field pl-10"
                />
              </div>

              {/* Type HD */}
              <select
                value={selectedHDType}
                onChange={(e) => setSelectedHDType(e.target.value)}
                className="input-field"
              >
                {hdTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {/* Localisation */}
              <input
                type="text"
                placeholder="Ville ou région..."
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="input-field"
              />

              {/* Bouton recherche */}
              <Button
                variant="primary"
                onClick={handleSearch}
                icon={<Heart size={18} />}
                fullWidth
              >
                Rechercher
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-primary/10"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-primary" />
              </div>
              <div className="text-2xl font-display text-primary">{profiles.length}</div>
              <div className="text-sm text-neutral-dark/70">Membres actifs</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-secondary/10"
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera size={24} className="text-secondary" />
              </div>
              <div className="text-2xl font-display text-secondary">
                {profiles.filter(p => p.avatar_url).length}
              </div>
              <div className="text-sm text-neutral-dark/70">Avec photo</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-purple-500/10"
            >
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-purple-500" />
              </div>
              <div className="text-2xl font-display text-purple-500">
                {profiles.filter(p => p.role === 'admin').length}
              </div>
              <div className="text-sm text-neutral-dark/70">Administratrices</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-warning/10"
            >
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown size={24} className="text-warning" />
              </div>
              <div className="text-2xl font-display text-warning">
                {profiles.filter(p => p.is_premium || p.is_beta_tester).length}
              </div>
              <div className="text-sm text-neutral-dark/70">Bétatesteuses</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-success/10"
            >
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-success" />
              </div>
              <div className="text-2xl font-display text-success">
                {newMembers.length}
              </div>
              <div className="text-sm text-neutral-dark/70">Nouvelles (48h)</div>
            </motion.div>
          </div>

          {/* Liste des profils */}
          <div id="profiles-list">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="font-display text-xl text-primary mb-2">Chargement des profils...</h3>
              <p className="text-neutral-dark/70">Découverte de notre belle communauté en cours</p>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-neutral/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-neutral-dark/30" />
              </div>
              <h3 className="font-display text-xl text-neutral-dark/70 mb-2">
                Aucun profil trouvé
              </h3>
              <p className="text-neutral-dark/50 mb-6">
                Rejoindre la communauté
              </p>
              <Button
                variant="outline"
                icon={<User size={18} />}
                onClick={() => {
                  setSelectedHDType('');
                  setSelectedLocation('');
                  loadProfiles();
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProfileCard
                    profile={profile}
                    showStats={true}
                    onFollow={handleFollow}
                    isFollowing={followingUsers.has(profile.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
          </div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 border border-primary/20 shadow-lg">
              <h3 className="font-display text-2xl md:text-3xl mb-6 text-primary">
                Rejoignez notre communauté !
              </h3>
              <p className="text-lg md:text-xl text-neutral-dark/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Chaque visage raconte une histoire unique. Partagez la vôtre et connectez-vous avec des âmes sœurs sur le chemin de la conscience énergétique.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button
                  variant="primary"
                  onClick={() => navigate('/community')}
                  icon={<MessageCircle size={18} />}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
                >
                  Participer aux discussions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/profile')}
                  icon={<Users size={18} />}
                  className="border-2 border-primary/30 hover:border-primary/50"
                >
                  Compléter mon profil
                </Button>
              </div>
              <p className="text-sm text-neutral-dark/60 italic">
                ✨ Plus de {profiles.length} femmes partagent déjà leur voyage énergétique
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityDirectory;