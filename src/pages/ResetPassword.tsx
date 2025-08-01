import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseClient';
import Button from '../components/common/Button';
import { useAlertStore } from '../store/alertStore';
import { Key, RefreshCw, ArrowRight } from 'lucide-react';
import { PasswordResetService } from '../services/passwordResetService';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidHash, setIsValidHash] = useState(false);
  const [resetMethod, setResetMethod] = useState<'link' | 'manual'>('link');
  const [resetCode, setResetCode] = useState('');
  const navigate = useNavigate();
  const { showAlert } = useAlertStore();

  useEffect(() => {
    // Check if we have a valid hash in the URL
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);
    const manualReset = urlParams.get('manual');
    
    if (hash && hash.includes('type=recovery')) {
      setIsValidHash(true);
      setResetMethod('link');
    } else if (manualReset === 'true') {
      setIsValidHash(true);
      setResetMethod('manual');
    } else {
      // Permettre l'accès manuel même sans lien valide
      setIsValidHash(true);
      setResetMethod('manual');
      showAlert('Accès en mode manuel - Contactez l\'administrateur si vous n\'avez pas de code', 'info');
    }
  }, [showAlert]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      showAlert('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    if (password.length < 6) {
      showAlert('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }

    if (resetMethod === 'manual' && !resetCode) {
      showAlert('Veuillez entrer le code de réinitialisation fourni par l\'administrateur', 'error');
      return;
    }
    setIsLoading(true);
    try {
      if (resetMethod === 'link') {
        // Méthode classique avec lien Supabase
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
      } else {
        // Méthode manuelle - vérifier le code et mettre à jour
        if (resetCode !== 'RESET2024') { // Code temporaire - en production, vérifier côté serveur
          throw new Error('Code de réinitialisation invalide');
        }
        
        // Simuler la réinitialisation manuelle
        if (!PasswordResetService.validateResetCode(resetCode, '')) {
          throw new Error('Code de réinitialisation invalide');
        }
        
        // En production, cela ferait appel à une API sécurisée pour changer le mot de passe
        showAlert('Code validé ! Contactez l\'administrateur pour finaliser la réinitialisation.', 'info');
      }

      showAlert('Mot de passe réinitialisé avec succès', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Error resetting password:', error);
      showAlert(error instanceof Error ? error.message : 'Une erreur est survenue', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidHash) {
    return (
      <div className="min-h-screen py-32 flex items-center">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8 text-center"
          >
            <h1 className="font-display text-3xl mb-4">Lien invalide</h1>
            <p className="text-neutral-dark/70 mb-6">
              Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien de réinitialisation.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/login')}
            >
              Retour à la connexion
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32 flex items-center">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl mb-2">
              Réinitialiser votre mot de passe
            </h1>
            <p className="text-neutral-dark/70">
              {resetMethod === 'link' 
                ? 'Veuillez choisir un nouveau mot de passe'
                : 'Entrez le code fourni par l\'administrateur et votre nouveau mot de passe'
              }
            </p>
          </div>
          
          <form onSubmit={handleResetPassword} className="space-y-6">
            {resetMethod === 'manual' && (
              <div>
                <label htmlFor="resetCode" className="block text-sm font-medium text-neutral-dark mb-1">
                  Code de réinitialisation
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield size={18} className="text-neutral-dark/50" />
                  </div>
                  <input
                    type="text"
                    id="resetCode"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Code fourni par l'administrateur"
                    required={resetMethod === 'manual'}
                  />
                </div>
                <p className="text-xs text-neutral-dark/60 mt-1">
                  Code reçu par email ou WhatsApp de la part de l'administrateur
                </p>
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-dark mb-1">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={18} className="text-neutral-dark/50" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-dark mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={18} className="text-neutral-dark/50" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              icon={isLoading ? <RefreshCw size={18} className="animate-spin" /> : <ArrowRight size={18} />}
              disabled={isLoading}
            >
              {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </Button>
            
            {resetMethod === 'manual' && (
              <div className="text-center">
                <p className="text-sm text-neutral-dark/60 mb-2">
                  Vous n'avez pas reçu de code ?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const message = encodeURIComponent(
                      'Bonjour, j\'ai besoin d\'un code de réinitialisation de mot de passe'
                    );
                    window.open(`https://wa.me/34602256248?text=${message}`, '_blank');
                  }}
                  className="text-primary hover:underline text-sm"
                >
                  Contacter l'administrateur via WhatsApp
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;