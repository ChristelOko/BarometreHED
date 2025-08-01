import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import Button from '../../components/common/Button';
import { useAlertStore } from '../../store/alertStore';
import { makeUserAdmin } from '../../services/edgeFunctionService';

const AdminTools = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlertStore();

  const handleMakeAdmin = async () => {
    if (!email) {
      showAlert('Veuillez saisir une adresse email', 'error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Veuillez saisir une adresse email valide', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const { success, message, error } = await makeUserAdmin(email);
      
      if (success) {
        showAlert(message || 'Utilisateur promu administrateur avec succès', 'success');
        setEmail('');
      } else {
        // Provide more helpful error messages
        let errorMessage = error || 'Échec de la promotion de l\'utilisateur';
        
        if (error?.includes('User not found')) {
          errorMessage = 'Utilisateur non trouvé. Assurez-vous que l\'utilisateur a déjà créé un compte.';
        } else if (error?.includes('configuration error')) {
          errorMessage = 'Erreur de configuration du serveur. Veuillez contacter le support technique.';
        } else if (error?.includes('connect')) {
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
        }
        
        showAlert(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Unexpected error in handleMakeAdmin:', error);
      showAlert('Une erreur inattendue est survenue. Veuillez réessayer.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <Shield size={24} className="text-primary mr-3" />
        <h2 className="font-display text-2xl">Outils administrateur</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-primary/5 rounded-xl p-6">
          <h3 className="font-display text-xl mb-4 flex items-center">
            <User size={20} className="mr-2 text-primary" />
            Gestion des administrateurs
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-neutral-dark mb-2">
                Email de l'utilisateur à promouvoir
              </label>
              <input
                type="email"
                id="admin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="email@exemple.com"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-neutral-dark/70">
              <AlertTriangle size={16} className="text-warning" />
              <p>L'utilisateur doit déjà avoir un compte sur la plateforme.</p>
            </div>
            
            <Button
              variant="primary"
              onClick={handleMakeAdmin}
              disabled={isLoading || !email}
              icon={isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Shield size={16} />}
              className="mt-2"
            >
              {isLoading ? 'Traitement en cours...' : 'Promouvoir comme administrateur'}
            </Button>
          </div>
        </div>
        
        <div className="bg-neutral p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="mt-1">
              <Check size={16} className="text-success" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Fonctionnalités administrateur</h4>
              <ul className="mt-2 space-y-1 text-sm text-neutral-dark/70">
                <li>• Gestion des utilisateurs</li>
                <li>• Gestion du contenu</li>
                <li>• Accès aux statistiques</li>
                <li>• Configuration système</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Troubleshooting section */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle size={16} className="text-warning mt-1" />
            <div>
              <h4 className="font-medium text-sm text-warning">Résolution des problèmes</h4>
              <div className="mt-2 text-sm text-neutral-dark/70">
                <p className="mb-2">Si vous rencontrez des erreurs :</p>
                <ul className="space-y-1 ml-4">
                  <li>• Vérifiez que l'utilisateur a bien créé un compte</li>
                  <li>• Assurez-vous d'avoir une connexion internet stable</li>
                  <li>• Contactez le support si le problème persiste</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTools;