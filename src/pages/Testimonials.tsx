import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Send, Heart } from 'lucide-react';
import { getPublicFeedbacks, submitFeedback } from '../services/feedbackService';
import { Feedback } from '../models/feedback';
import { useAuthStore } from '../store/authStore';
import { useAlertStore } from '../store/alertStore';
import Button from '../components/common/Button';

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const { user, isAuthenticated } = useAuthStore();
  const { showAlert } = useAlertStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await getPublicFeedbacks();
        if (error) throw error;
        setFeedbacks(data || []);
      } catch (error) {
        console.error('Error fetching public feedbacks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? 'text-warning fill-warning'
                : 'text-neutral-dark/30'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated || !user) {
      showAlert('Veuillez vous connecter pour laisser un commentaire', 'warning');
      return;
    }

    if (!newComment.trim()) {
      showAlert('Veuillez écrire un commentaire', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await submitFeedback({
        user_id: user.id,
        user_name: user.name,
        user_avatar_url: user.photo,
        rating: 5, // Default rating for forum comments
        comment: newComment,
        is_public: true
      });

      if (error) throw error;

      showAlert('Votre commentaire a été publié avec succès !', 'success');
      setNewComment('');
      
      // Refresh feedbacks
      const { data } = await getPublicFeedbacks();
      if (data) setFeedbacks(data);
    } catch (error) {
      console.error('Error submitting comment:', error);
      showAlert('Une erreur est survenue lors de la publication de votre commentaire', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="font-display text-xl text-primary">Chargement des témoignages...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-display text-4xl text-center mb-4">Témoignages</h1>
          <p className="text-neutral-dark/80 text-center mb-8 max-w-2xl mx-auto">
            Découvrez ce que notre communauté dit du Baromètre Énergétique et partagez votre propre expérience. 
            Chaque ressenti est unique et précieux, tout comme votre parcours énergétique. Votre témoignage pourra aider d'autres femmes dans leur cheminement.
          </p>

          {/* Forum section for new comments */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-12">
            <h2 className="font-display text-2xl mb-6 flex items-center">
              <Heart size={24} className="text-primary mr-2" />
              Partagez votre expérience
            </h2>
            
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={isAuthenticated 
                  ? "Comment le Baromètre Énergétique a-t-il transformé votre quotidien ? Qu'avez-vous découvert sur vous-même ? Partagez librement votre expérience..."
                  : "Connectez-vous pour partager votre expérience..."
                }
                className="input-field resize-none w-full"
                rows={5}
                disabled={!isAuthenticated || isSubmitting}
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleSubmitComment}
                disabled={!isAuthenticated || isSubmitting || !newComment.trim()}
                icon={<Send size={18} />}
              >
                {isSubmitting ? 'Publication...' : 'Publier mon témoignage'}
              </Button>
            </div>
            
            {!isAuthenticated && (
              <p className="text-sm text-neutral-dark/60 mt-4 text-center">
                Connectez-vous pour partager votre expérience avec notre communauté
              </p>
            )}
          </div>

          <h2 className="font-display text-2xl mb-6 text-center">Ce que dit notre communauté</h2>

          {feedbacks.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <MessageSquare size={48} className="mx-auto text-neutral-dark/30 mb-4" />
              <h3 className="font-display text-xl text-neutral-dark/70 mb-2">
                Aucun témoignage pour le moment
              </h3>
              <p className="text-neutral-dark/50">
                Soyez la première à partager votre expérience !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {feedbacks.map((feedback, index) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <span className="text-primary font-medium">
                        {feedback.user_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{feedback.user_name}</p>
                        <div className="mt-1">
                          {renderStars(feedback.rating)}
                        </div>
                      </div>
                      <p className="text-xs text-neutral-dark/50">
                        {new Date(feedback.created_at!).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-neutral/10 p-4 rounded-lg">
                    {feedback.comment ? (
                      <p className="text-neutral-dark/80">{feedback.comment}</p>
                    ) : (
                      <p className="text-neutral-dark/50 italic">Aucun commentaire</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Call to action */}
          <div className="mt-12 text-center">
            <p className="text-lg text-neutral-dark/80 mb-4">
              Votre parcours énergétique est unique. Partagez-le avec notre communauté !
            </p>
            <Button
              variant="primary"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              icon={<MessageSquare size={18} />}
            >
              Ajouter mon témoignage
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;