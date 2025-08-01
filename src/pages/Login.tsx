import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabaseClient';
import Button from '../components/common/Button';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { useAuthStore } from '../store/authStore';
import { useAlertStore } from '../store/alertStore';
import { User, Key, Mail, ArrowRight, Shield, RefreshCw, ArrowLeft, CheckCircle, AlertTriangle, Info, Heart, Sparkles, Eye, EyeOff } from 'lucide-react';
import { PasswordResetService } from '../services/passwordResetService';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [hdType, setHdType] = useState('generator');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [adminContactSent, setAdminContactSent] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', message: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginStore, register: registerStore } = useAuthStore();
  const { showAlert } = useAlertStore();
  const returnTo = location.state?.returnTo || '/dashboard';

  const hdTypes = [
    { 
      value: 'generator', 
      label: 'Generator',
      emoji: '⚡',
      description: 'Vous avez une énergie vitale constante et créatrice. Vous répondez aux opportunités qui se présentent.',
      characteristics: ['Énergie sacrale', 'Réponse gut feeling', 'Endurance naturelle'],
      percentage: '70%'
    },
    { 
      value: 'projector', 
      label: 'Projector',
      emoji: '👁️',
      description: 'Vous êtes un guide naturel avec une capacité unique à voir les autres et les systèmes.',
      characteristics: ['Sagesse intuitive', 'Besoin de reconnaissance', 'Énergie focalisée'],
      percentage: '20%'
    },
    { 
      value: 'manifesting-generator', 
      label: 'Manifesting Generator',
      emoji: '🌟',
      description: 'Vous combinez l\'énergie du Generator avec la capacité d\'initiation du Manifestor.',
      characteristics: ['Multi-passionné', 'Énergie rapide', 'Capacité de manifestation'],
      percentage: '33%'
    },
    { 
      value: 'manifestor', 
      label: 'Manifestor',
      emoji: '🚀',
      description: 'Vous êtes un initiateur naturel avec la capacité de créer et d\'impacter.',
      characteristics: ['Énergie d\'initiation', 'Indépendance', 'Impact sur les autres'],
      percentage: '9%'
    },
    { 
      value: 'reflector', 
      label: 'Reflector',
      emoji: '🌙',
      description: 'Vous êtes un miroir de votre environnement avec une sagesse cyclique unique.',
      characteristics: ['Sensibilité environnementale', 'Sagesse lunaire', 'Perspective unique'],
      percentage: '1%'
    }
  ];

  // Fonction pour afficher les dialogues au lieu des alertes
  const showDialog = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setDialogContent({ title, message });
    switch (type) {
      case 'success':
        setShowSuccessDialog(true);
        break;
      case 'error':
        setShowErrorDialog(true);
        break;
      case 'warning':
        setShowWarningDialog(true);
        break;
      case 'info':
        setShowInfoDialog(true);
        break;
    }
  };

  const validateStep1 = () => {
    if (!name.trim()) {
      showDialog('error', 'Nom requis', 'Veuillez entrer votre nom complet pour continuer.');
      return false;
    }
    if (name.trim().length < 2) {
      showDialog('error', 'Nom trop court', 'Votre nom doit contenir au moins 2 caractères.');
      return false;
    }
    if (!email.trim()) {
      showDialog('error', 'Email requis', 'Veuillez entrer votre adresse email pour continuer.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showDialog('error', 'Email invalide', 'Veuillez entrer une adresse email valide (ex: votre@email.com).');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!password) {
      showDialog('error', 'Mot de passe requis', 'Veuillez créer un mot de passe pour sécuriser votre compte.');
      return false;
    }
    if (password.length < 6) {
      showDialog('error', 'Mot de passe trop court', 'Votre mot de passe doit contenir au moins 6 caractères pour votre sécurité.');
      return false;
    }
    if (password !== confirmPassword) {
      showDialog('error', 'Mots de passe différents', 'Les mots de passe ne correspondent pas. Veuillez vérifier la saisie.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!hdType) {
      showDialog('error', 'Type HD requis', 'Votre type Human Design est nécessaire pour personnaliser votre expérience.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (registrationStep === 1 && validateStep1()) {
      setRegistrationStep(2);
      showDialog('success', 'Étape 1 validée ! 🌸', 'Vos informations personnelles ont été enregistrées. Passons maintenant à la sécurisation de votre compte.');
    } else if (registrationStep === 2 && validateStep2()) {
      setRegistrationStep(3);
      showDialog('success', 'Mot de passe créé ! 🔐', 'Votre compte est maintenant sécurisé. Dernière étape : définissons votre profil énergétique.');
    }
  };

  const handlePrevStep = () => {
    if (registrationStep > 1) {
      setRegistrationStep(registrationStep - 1);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { error: loginError } = await loginStore(email, password);
        if (loginError) {
          showDialog('error', 'Connexion échouée', `Impossible de vous connecter : ${loginError.message}`);
          return;
        }
        setSuccessMessage('Connexion réussie ! Bienvenue dans votre espace énergétique 🌸');
        setShowSuccessDialog(true);
        setTimeout(() => {
          setShowSuccessDialog(false);
          navigate(returnTo);
        }, 2000);
      } else {
        // Validation finale pour l'inscription
        if (!validateStep1() || !validateStep2() || !validateStep3()) {
          return;
        }
        const { error: registerError } = await registerStore(email, password, name, hdType, bio);
        if (registerError) {
          showDialog('error', 'Inscription échouée', `Impossible de créer votre compte : ${registerError.message}`);
          return;
        }
        setSuccessMessage('Compte créé avec succès ! Votre voyage énergétique commence maintenant 🌟');
        setShowSuccessDialog(true);
        setTimeout(() => {
          setShowSuccessDialog(false);
          navigate(returnTo);
        }, 2000);
      }
    } catch (error) {
      showDialog('error', 'Erreur inattendue', error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const getHDTypeDescription = (type: string) => {
    const typeInfo = hdTypes.find(t => t.value === type);
    return typeInfo?.description || '';
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showDialog('error', 'Email requis', 'Veuillez entrer votre adresse email pour recevoir les instructions de réinitialisation.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        const result = await PasswordResetService.resetByEmail(email);
        
        if (!result.success) {
          showDialog('warning', 'Envoi automatique indisponible', 'L\'envoi automatique ne fonctionne pas. Nous allons contacter l\'administrateur pour vous.');
          const result = await PasswordResetService.createManualRequest(email);
          
          if (result.success) {
            setAdminContactSent(true);
            showDialog('success', 'Demande transmise ! 📧', 'Votre demande a été transmise à l\'administrateur. Vous recevrez une réponse sous 24h.');
          } else {
            throw new Error('Erreur lors de l\'envoi de la demande');
          }
        } else {
          setResetSent(true);
          showDialog('success', 'Email envoyé ! 📧', 'Les instructions de réinitialisation ont été envoyées à votre adresse email.');
        }
      } else {
        setResetSent(true);
        showDialog('success', 'Email envoyé ! 📧', 'Les instructions de réinitialisation ont été envoyées à votre adresse email.');
      }
    } catch (error) {
      showDialog('error', 'Erreur d\'envoi', 'Une erreur est survenue. Vous pouvez nous contacter directement via WhatsApp.');
      const whatsappLink = PasswordResetService.generateWhatsAppLink(email);
      setTimeout(() => {
        window.open(whatsappLink, '_blank');
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <div className="min-h-screen py-32 flex items-center">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 border border-primary/10"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-primary" />
              </div>
              <h1 className="font-display text-3xl mb-2 text-primary">
                Mot de passe oublié
              </h1>
              <p className="text-neutral-dark/70">
                Entrez votre email pour recevoir les instructions de réinitialisation
              </p>
            </div>
            
            <form onSubmit={handleForgotPassword} className="space-y-6">
              {!resetSent && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-neutral-dark/50" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>
              )}
              
              {!resetSent ? (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={isLoading ? <RefreshCw size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                  disabled={isLoading}
                >
                  {isLoading ? 'Envoi en cours...' : 'Envoyer les instructions'}
                </Button>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} className="text-success" />
                  </div>
                  <p className="text-success font-medium">Email envoyé avec succès !</p>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetSent(false);
                    }}
                  >
                    Retour à la connexion
                  </Button>
                </div>
              )}
            </form>
            
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetSent(false);
                }}
                className="text-primary hover:underline"
              >
                ← Retour à la connexion
              </button>
            </div>
          </motion.div>
        </div>

        {/* Dialogues de confirmation */}
        <ConfirmationDialog
          isOpen={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          title={dialogContent.title}
          message={dialogContent.message}
          type="success"
          showActions={false}
        />
        
        <ConfirmationDialog
          isOpen={showErrorDialog}
          onClose={() => setShowErrorDialog(false)}
          title={dialogContent.title}
          message={dialogContent.message}
          type="warning"
          showActions={false}
        />
        
        <ConfirmationDialog
          isOpen={showWarningDialog}
          onClose={() => setShowWarningDialog(false)}
          title={dialogContent.title}
          message={dialogContent.message}
          type="warning"
          showActions={false}
        />
        
        <ConfirmationDialog
          isOpen={showInfoDialog}
          onClose={() => setShowInfoDialog(false)}
          title={dialogContent.title}
          message={dialogContent.message}
          type="info"
          showActions={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32 flex items-center bg-gradient-to-br from-neutral via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-primary/10"
        >
          {/* Header avec logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <img 
                src="/favicon.svg" 
                alt="Baromètre Énergétique" 
                className="w-full h-full filter drop-shadow-lg"
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
            <h1 className="font-display text-3xl mb-2 text-primary">
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </h1>
            <p className="text-neutral-dark/70">
              {isLogin 
                ? 'Accédez à votre tableau de bord énergétique' 
                : registrationStep === 1 ? 'Commençons par vos informations personnelles'
                  : registrationStep === 2 ? 'Sécurisons votre compte'
                  : 'Définissons votre profil énergétique'}
            </p>
            
            {/* Indicateur de progression pour l'inscription */}
            {!isLogin && (
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  {[1, 2, 3].map((step) => (
                    <motion.div
                      key={step}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        step < registrationStep ? 'bg-success' :
                        step === registrationStep ? 'bg-primary' : 'bg-neutral-dark/20'
                      }`}
                      animate={step === registrationStep ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  ))}
                </div>
                <div className="ml-4 text-sm text-neutral-dark/60">
                  Étape {registrationStep} sur 3
                </div>
              </div>
            )}
          </div>
          
          {isLogin ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-neutral-dark/50" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-dark mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key size={18} className="text-neutral-dark/50" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff size={18} className="text-neutral-dark/50" /> : <Eye size={18} className="text-neutral-dark/50" />}
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <button 
                  type="button" 
                  className="text-sm text-primary hover:underline"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Mot de passe oublié ?
                </button>
              </div>
              
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={isLoading ? <RefreshCw size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Étape 1: Informations personnelles */}
              {registrationStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <User size={16} className="text-primary" />
                      <span className="text-sm font-medium text-primary">Étape 1 : Qui êtes-vous ?</span>
                    </div>
                    <p className="text-xs text-neutral-dark/70">
                      Ces informations nous permettront de personnaliser votre expérience énergétique
                    </p>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-dark mb-2">
                      Nom complet *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-neutral-dark/50" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field pl-10"
                        placeholder="Votre nom complet"
                        required
                      />
                    </div>
                    <p className="text-xs text-neutral-dark/60 mt-1">
                      Utilisé pour personnaliser vos messages et analyses
                    </p>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-2">
                      Adresse email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-neutral-dark/50" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field pl-10"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    <p className="text-xs text-neutral-dark/60 mt-1">
                      Sera votre identifiant de connexion
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleNextStep}
                    icon={<ArrowRight size={18} />}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    Continuer vers la sécurité
                  </Button>
                </motion.div>
              )}

              {/* Étape 2: Mot de passe */}
              {registrationStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-secondary/5 rounded-xl p-4 border border-secondary/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield size={16} className="text-secondary" />
                      <span className="text-sm font-medium text-secondary">Étape 2 : Sécurité</span>
                    </div>
                    <p className="text-xs text-neutral-dark/70">
                      Créez un mot de passe sécurisé pour protéger votre espace personnel
                    </p>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-dark mb-2">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={18} className="text-neutral-dark/50" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field pl-10 pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff size={18} className="text-neutral-dark/50" /> : <Eye size={18} className="text-neutral-dark/50" />}
                      </button>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className={`text-xs flex items-center ${password.length >= 6 ? 'text-success' : 'text-neutral-dark/60'}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${password.length >= 6 ? 'bg-success' : 'bg-neutral-dark/30'}`}></div>
                        Au moins 6 caractères
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-dark mb-2">
                      Confirmer le mot de passe *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={18} className="text-neutral-dark/50" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field pl-10 pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? <EyeOff size={18} className="text-neutral-dark/50" /> : <Eye size={18} className="text-neutral-dark/50" />}
                      </button>
                    </div>
                    <div className="mt-2">
                      <div className={`text-xs flex items-center ${password && confirmPassword && password === confirmPassword ? 'text-success' : 'text-neutral-dark/60'}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${password && confirmPassword && password === confirmPassword ? 'bg-success' : 'bg-neutral-dark/30'}`}></div>
                        Les mots de passe correspondent
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      fullWidth
                      onClick={handlePrevStep}
                      icon={<ArrowLeft size={18} />}
                    >
                      Retour
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handleNextStep}
                      icon={<ArrowRight size={18} />}
                      className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90"
                    >
                      Continuer
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Étape 3: Type HD et finalisation */}
              {registrationStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-accent/5 rounded-xl p-4 border border-accent/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles size={16} className="text-accent" />
                      <span className="text-sm font-medium text-accent">Étape 3 : Votre Énergie Unique</span>
                    </div>
                    <p className="text-xs text-neutral-dark/70">
                      Votre type Human Design nous permet de personnaliser entièrement votre expérience
                    </p>
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="font-display text-xl mb-2 text-primary">Quel est votre type Human Design ?</h3>
                    <p className="text-sm text-neutral-dark/70">
                      Cette information est <strong>essentielle</strong> pour personnaliser vos analyses énergétiques
                    </p>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {hdTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        type="button"
                        onClick={() => setHdType(type.value)}
                        className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                          hdType === type.value
                            ? 'bg-primary/20 border-primary shadow-lg scale-105'
                            : 'bg-neutral hover:bg-primary/10 border-neutral-dark/20 hover:border-primary/30'
                        }`}
                        whileHover={{ scale: hdType === type.value ? 1.05 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{type.emoji}</span>
                            <div>
                              <span className={`font-medium text-lg ${hdType === type.value ? 'text-primary' : 'text-neutral-dark'}`}>
                                {type.label}
                              </span>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                  {type.percentage} de la population
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            hdType === type.value
                              ? 'border-primary bg-primary'
                              : 'border-neutral-dark/30'
                          }`}>
                            {hdType === type.value && (
                              <div className="w-3 h-3 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-neutral-dark/80 mb-3 leading-relaxed">{type.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {type.characteristics.map((char, index) => (
                            <span
                              key={index}
                              className={`px-3 py-1 rounded-full text-xs ${
                                hdType === type.value
                                  ? 'bg-primary/30 text-primary'
                                  : 'bg-neutral-dark/10 text-neutral-dark/70'
                              }`}
                            >
                              {char}
                            </span>
                          ))}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-start space-x-3">
                      <Info size={16} className="text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-primary font-medium mb-1">
                          💡 Vous ne connaissez pas votre type ?
                        </p>
                        <p className="text-xs text-neutral-dark/70">
                          Choisissez "Generator" par défaut (70% de la population). Vous pourrez le modifier plus tard dans vos paramètres après avoir exploré votre énergie.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-neutral-dark mb-2">
                      Présentez-vous (optionnel)
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder="Parlez-nous brièvement de vous, votre parcours, vos aspirations..."
                      maxLength={300}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-neutral-dark/60">
                        Visible sur votre profil public
                      </p>
                      <p className="text-xs text-neutral-dark/60">
                        {bio.length}/300
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      fullWidth
                      onClick={handlePrevStep}
                      icon={<ArrowLeft size={18} />}
                    >
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handleSubmit}
                      disabled={isLoading}
                      icon={isLoading ? <RefreshCw size={18} className="animate-spin" /> : <Heart size={18} />}
                      className="bg-gradient-to-r from-accent to-warning hover:from-accent/90 hover:to-warning/90"
                    >
                      {isLoading ? 'Création...' : 'Créer mon espace énergétique'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
            
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setRegistrationStep(1);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setName('');
                setHdType('generator');
                setBio('');
              }}
              className="text-primary hover:underline transition-colors"
            >
              {isLogin ? 'Pas encore de compte ? Créez-en un' : 'Déjà un compte ? Connectez-vous'}
            </button>
          </div>

          {/* Informations de sécurité */}
          <div className="mt-6 p-4 bg-neutral/20 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Shield size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Sécurité & Confidentialité</span>
            </div>
            <p className="text-xs text-neutral-dark/70 leading-relaxed">
              Vos données sont chiffrées et sécurisées. Nous ne partageons jamais vos informations personnelles. 
              Votre parcours énergétique vous appartient entièrement.
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Dialogues de confirmation pour toutes les alertes */}
      <ConfirmationDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title={successMessage ? "Félicitations ! 🌸" : dialogContent.title}
        message={successMessage || dialogContent.message}
        type="success"
        showActions={false}
      />
      
      <ConfirmationDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        title={dialogContent.title}
        message={dialogContent.message}
        type="warning"
        showActions={false}
      />
      
      <ConfirmationDialog
        isOpen={showWarningDialog}
        onClose={() => setShowWarningDialog(false)}
        title={dialogContent.title}
        message={dialogContent.message}
        type="warning"
        showActions={false}
      />
      
      <ConfirmationDialog
        isOpen={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
        title={dialogContent.title}
        message={dialogContent.message}
        type="info"
        showActions={false}
      />
    </div>
  );
};

export default Login;