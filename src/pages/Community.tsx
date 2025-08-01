import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, Heart, MessageCircle, User, Sparkles, Search, Filter, TrendingUp, Calendar, Star } from 'lucide-react';
import Button from '../components/common/Button';
import CommunityFeed from '../components/community/CommunityFeed';
import { CommunityService, CommunityPost } from '../services/communityService';
import { useAuthStore } from '../store/authStore';
import { useAlertStore } from '../store/alertStore';
import ConfirmationDialog from '../components/common/ConfirmationDialog';

const Community = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { showAlert, showAlertDialog } = useAlertStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'experience' as 'experience' | 'question' | 'insight' | 'celebration',
    tags: [] as string[],
    is_anonymous: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const categories = [
    { 
      id: 'experience', 
      label: 'Partager une expérience', 
      emoji: '✨', 
      desc: 'Racontez votre parcours énergétique et vos découvertes',
      color: 'from-primary/20 to-primary/10 border-primary/30'
    },
    { 
      id: 'question', 
      label: 'Poser une question', 
      emoji: '❓', 
      desc: 'Demandez conseil à la communauté bienveillante',
      color: 'from-secondary/20 to-secondary/10 border-secondary/30'
    },
    { 
      id: 'insight', 
      label: 'Partager un insight', 
      emoji: '💡', 
      desc: 'Partagez une découverte ou réalisation profonde',
      color: 'from-accent/20 to-accent/10 border-accent/30'
    },
    { 
      id: 'celebration', 
      label: 'Célébrer', 
      emoji: '🎉', 
      desc: 'Célébrez vos victoires et transformations énergétiques',
      color: 'from-success/20 to-success/10 border-success/30'
    }
  ];

  const handleCreatePost = async () => {
    if (!isAuthenticated || !user) {
      showAlertDialog(
        'Connexion requise 🔐',
        'Vous devez être connectée pour partager avec notre communauté bienveillante.',
        'warning',
        () => navigate('/login')
      );
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setValidationMessage('Veuillez remplir le titre et le contenu de votre partage pour continuer.');
      setShowValidationDialog(true);
      return;
    }

    if (formData.content.length < 20) {
      setValidationMessage('Votre message doit contenir au moins 20 caractères pour être partagé avec la communauté.');
      setShowValidationDialog(true);
      return;
    }

    try {
      setIsSubmitting(true);

      const { data, error } = await CommunityService.createPost({
        user_id: user.id,
        user_name: formData.is_anonymous ? 'Utilisatrice anonyme' : user.name,
        hd_type: formData.is_anonymous ? undefined : user.hdType,
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        is_anonymous: formData.is_anonymous,
        is_featured: false
      });

      if (error) throw error;

      setShowSuccessDialog(true);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        category: 'experience',
        tags: [],
        is_anonymous: false
      });
      setShowCreateForm(false);

      // Actualiser les données sans recharger la page
      setTimeout(() => {
        window.dispatchEvent(new Event('communityUpdate'));
      }, 1000);

    } catch (error) {
      console.error('Error creating post:', error);
      showAlertDialog(
        'Erreur de publication 📝',
        'Impossible de publier votre partage pour le moment. Veuillez vérifier votre connexion et réessayer.',
        'warning'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const tag = input.value.trim().toLowerCase();
      
      if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        input.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const suggestedTags = [
    'première-fois', 'breakthrough', 'fatigue', 'énergie-haute', 'cycle-féminin',
    'relations', 'travail', 'créativité', 'spiritualité', 'transformation',
    'generator', 'projector', 'manifestor', 'reflector', 'manifesting-generator'
  ];

  return (
    <div className="min-h-screen py-32 bg-gradient-to-br from-neutral via-neutral to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header amélioré */}
          <PageHeader
            title="🌸 Communauté Énergétique"
            subtitle="Un espace bienveillant pour partager vos expériences, poser vos questions et célébrer votre parcours énergétique avec d'autres femmes conscientes."
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button
                variant="primary"
                onClick={() => setShowCreateForm(true)}
                icon={<Plus size={18} />}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
              >
                Partager mon expérience
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/community/directory')}
                icon={<Users size={18} />}
                className="border-2 border-primary/30 hover:border-primary/50"
              >
                Découvrir les membres
              </Button>
            </div>
          </PageHeader>

          {/* Formulaire de création amélioré */}
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-8 border border-primary/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl flex items-center">
                  <Sparkles size={24} className="text-primary mr-3" />
                  Partager avec la communauté
                </h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-neutral-dark/50 hover:text-neutral-dark transition-colors p-2"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Sélection de catégorie améliorée */}
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-4">
                    Type de partage
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map(category => (
                      <motion.button
                        key={category.id}
                        onClick={() => setFormData(prev => ({ ...prev, category: category.id as any }))}
                        className={`p-4 rounded-xl text-left transition-all border-2 ${
                          formData.category === category.id
                            ? `bg-gradient-to-br ${category.color} shadow-md`
                            : 'bg-neutral hover:bg-primary/5 border-transparent hover:border-primary/20'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{category.emoji}</span>
                          <span className="font-medium">{category.label}</span>
                        </div>
                        <p className="text-sm text-neutral-dark/70">{category.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Titre avec compteur */}
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Titre de votre partage *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Ma première expérience de scan énergétique..."
                    className="input-field"
                    maxLength={100}
                  />
                  <div className={`text-xs mt-1 text-right ${
                    formData.title.length > 80 ? 'text-warning' : 'text-neutral-dark/60'
                  }`}>
                    {formData.title.length}/100 caractères
                  </div>
                </div>

                {/* Contenu avec compteur et aide */}
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Votre message *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Partagez votre expérience, vos questions ou vos insights avec authenticité et bienveillance..."
                    className="input-field resize-none"
                    rows={6}
                    maxLength={2000}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs text-neutral-dark/60">
                      Minimum 20 caractères pour publier
                    </div>
                    <div className={`text-xs ${
                      formData.content.length > 1800 ? 'text-warning' : 
                      formData.content.length < 20 ? 'text-error' : 'text-neutral-dark/60'
                    }`}>
                      {formData.content.length}/2000 caractères
                    </div>
                  </div>
                </div>

                {/* Tags avec suggestions */}
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Tags (optionnel)
                  </label>
                  <input
                    type="text"
                    onKeyDown={handleTagInput}
                    placeholder="Tapez un tag et appuyez sur Entrée..."
                    className="input-field"
                  />
                  
                  {/* Tags sélectionnés */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          #{tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-primary/70 hover:text-primary"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Suggestions de tags */}
                  <div className="mt-3">
                    <p className="text-xs text-neutral-dark/60 mb-2">Suggestions populaires :</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.slice(0, 8).map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (!formData.tags.includes(tag) && formData.tags.length < 5) {
                              setFormData(prev => ({
                                ...prev,
                                tags: [...prev.tags, tag]
                              }));
                            }
                          }}
                          className={`px-2 py-1 rounded-full text-xs transition-colors ${
                            formData.tags.includes(tag)
                              ? 'bg-primary/20 text-primary cursor-not-allowed'
                              : 'bg-neutral hover:bg-primary/10 text-neutral-dark hover:text-primary'
                          }`}
                          disabled={formData.tags.includes(tag) || formData.tags.length >= 5}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-neutral-dark/60 mt-1">
                      {formData.tags.length}/5 tags • Cliquez pour ajouter
                    </div>
                  </div>
                </div>

                {/* Options avec design amélioré */}
                <div className="bg-neutral/30 rounded-xl p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_anonymous}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_anonymous: e.target.checked }))}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <span className="text-sm font-medium">Publier anonymement</span>
                      <p className="text-xs text-neutral-dark/60">
                        Votre nom ne sera pas affiché, mais votre partage restera visible
                      </p>
                    </div>
                  </label>
                </div>

                {/* Actions avec validation */}
                <div className="flex space-x-3 pt-4 border-t border-neutral/10">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCreatePost}
                    disabled={isSubmitting || !formData.title.trim() || formData.content.length < 20}
                    icon={isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Plus size={18} />
                    )}
                    fullWidth
                  >
                    {isSubmitting ? 'Publication...' : 'Publier mon partage'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Guidelines de la communauté */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mb-8 border border-primary/20"
          >
            <h3 className="font-display text-xl mb-4 text-primary flex items-center">
              <Heart size={20} className="mr-2" />
              💫 Notre charte de bienveillance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-dark/80">
              {CommunityService.getCommunityGuidelines().map((guideline, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{guideline}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feed de la communauté */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <CommunityFeed onCreatePost={() => setShowCreateForm(true)} />
          </motion.div>

          {/* Call to action final */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mt-12"
          >
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
              <h3 className="font-display text-2xl mb-4 text-primary">
                🌸 Rejoignez notre cercle énergétique !
              </h3>
              <p className="text-neutral-dark/80 mb-6 max-w-2xl mx-auto">
                Chaque partage enrichit notre communauté. Votre expérience unique peut éclairer 
                le chemin d'une autre femme en quête d'alignement énergétique.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!showCreateForm && (
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateForm(true)}
                    icon={<MessageCircle size={18} />}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    Partager mon expérience
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => navigate('/community/directory')}
                  icon={<Users size={18} />}
                  className="border-2 border-primary/30 hover:border-primary/50"
                >
                  Découvrir les membres
                </Button>
              </div>
              
              <div className="mt-6 text-sm text-neutral-dark/60">
                ✨ Plus de 1000 femmes partagent déjà leur voyage énergétique
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Dialogues de confirmation */}
      <ConfirmationDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="Partage publié ! 🌸"
        message="Votre expérience a été partagée avec succès dans notre communauté. Merci de contribuer à cet espace bienveillant !"
        type="success"
        showActions={false}
      />
      
      <ConfirmationDialog
        isOpen={showValidationDialog}
        onClose={() => setShowValidationDialog(false)}
        title="Informations manquantes ✍️"
        message={validationMessage}
        type="warning"
        showActions={false}
      />
    </div>
  );
};

export default Community;