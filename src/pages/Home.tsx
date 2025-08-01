import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState, memo, useCallback } from 'react';
import Button from '../components/common/Button';
import { Heart, Brain, Compass, Sun, Scan, Lightbulb, Activity, Shield, Sparkles, ChevronDown, MessageCircle, Crown, BookOpen } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAlertStore } from '../store/alertStore';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import DailyEnergySection from '../components/home/DailyEnergySection';
import { testOpenAIConnection } from '../utils/testOpenAI';

const Home = memo(() => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { showAlert, showAlertDialog } = useAlertStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  
  // Test automatique de la clé OpenAI au chargement
  useEffect(() => {
    const testOpenAI = async () => {
      console.log('🔑 Test automatique de la clé OpenAI...');
      const result = await testOpenAIConnection();
      console.log('📊 Résultat du test OpenAI:', result);
      
      if (result.success) {
        console.log('✅ Clé OpenAI fonctionnelle !');
        // Ne pas afficher de dialogue automatique pour le test réussi
      } else {
        console.log('❌ Problème avec la clé OpenAI:', result.message);
        // Afficher un dialogue seulement si erreur critique
        if (result.message.includes('invalide') || result.message.includes('expired')) {
          showAlertDialog(
            'Configuration OpenAI requise 🔑',
            'La clé OpenAI n\'est pas configurée correctement. Certaines fonctionnalités conversationnelles pourraient être limitées.',
            'warning'
          );
        }
      }
    };
    
    // Tester après 2 secondes pour laisser le temps à la page de se charger
    setTimeout(testOpenAI, 2000);
  }, [showAlert]);
  
  // Effet pour faire défiler jusqu'à la section du tirage énergétique si le hash est présent
  useEffect(() => {
    if (window.location.hash === '#daily-energy') {
      setTimeout(() => {
        const dailyEnergySection = document.getElementById('daily-energy');
        if (dailyEnergySection) {
          dailyEnergySection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Petit délai pour s'assurer que la section est rendue
    }
  }, []);
  
  const handleStartScan = useCallback(() => {
    if (!isAuthenticated) {
      showAlertDialog(
        'Connexion requise 🔐',
        'Connectez-vous pour accéder à votre diagnostic énergétique personnalisé et découvrir votre paysage intérieur.',
        'info',
        () => navigate('/login')
      );
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      navigate('/scan');
      setIsLoading(false);
    }, 500);
  }, [isAuthenticated, navigate, showAlert]);

  const goToAdmin = useCallback(() => {
    if (!user?.role || user.role !== 'admin') {
      showAlert('Accès administrateur requis', 'error');
      return;
    }
    navigate('/admin');
  }, [user, navigate, showAlert]);

  const handleConversationalScan = useCallback(() => {
    if (!isAuthenticated) {
      showAlertDialog(
        'Connexion requise pour Aminata 🌸',
        'Connectez-vous pour dialoguer avec Aminata, votre guide énergétique IA, et bénéficier d\'un diagnostic personnalisé.',
        'info',
        () => navigate('/login')
      );
      return;
    }
    navigate('/scan-conversational');
  }, [isAuthenticated, navigate, showAlert]);
  // Données des étapes codées en dur
  const steps = [
    {
      icon: 'scan',
      color: 'primary',
      title: 'Scanne tes ressentis',
      content: 'Choisis parmi 9 catégories celle qui résonne avec ton état du moment et sélectionne tes ressentis.'
    },
    {
      icon: 'lightbulb',
      color: 'secondary', 
      title: 'Reçois ton analyse',
      content: 'Découvre ton score énergétique, les centres HD affectés et une guidance personnalisée selon ton type.'
    },
    {
      icon: 'heart',
      color: 'accent',
      title: 'Applique tes conseils',
      content: 'Suis les pratiques et mantras adaptés à ton design pour retrouver ton alignement énergétique.'
    }
  ];

  const scrollToContent = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Icônes pour les étapes
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'scan': return <Scan size={24} />;
      case 'lightbulb': return <Lightbulb size={24} />;
      case 'heart': return <Heart size={24} />;
      case 'compass': return <Compass size={24} />;
      case 'sun': return <Sun size={24} />;
      case 'brain': return <Brain size={24} />;
      case 'activity': return <Activity size={24} />;
      case 'sparkles': return <Sparkles size={24} />;
      default: return <Sparkles size={24} />;
    }
  };

  // Couleurs pour les étapes
  const getStepColor = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary';
      case 'secondary': return 'bg-secondary';
      case 'accent': return 'bg-accent';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-texture bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-white/30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-light mb-6"
            >
              Ressentez votre énergie profonde
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl font-body text-neutral-dark/80 mb-10 leading-relaxed"
            >
              Explorez votre équilibre énergétique basé sur le Human Design.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-10"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleStartScan} 
                  disabled={isLoading}
                  icon={<Sparkles size={18} />}
                  className={isLoading ? 'opacity-75 cursor-not-allowed' : ''}
                >
                  {isLoading ? 'Chargement...' : 'Lancer le scan'}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleConversationalScan}
                  icon={<MessageCircle size={18} />}
                >
                  Scan avec Aminata IA
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-display italic text-neutral-dark/60"
            >
              "Votre corps sait. Votre énergie parle. Écoutez."
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-primary-light/20 blur-2xl opacity-30" />
        <div className="absolute bottom-1/4 right-10 w-40 h-40 rounded-full bg-secondary/20 blur-2xl opacity-20" />

        {/* Scroll Down Indicator */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-neutral-dark/60 hover:text-primary transition-colors"
        >
          <ChevronDown size={32} />
        </button>
      </section>

      {/* Section Oracle et Outils Énergétiques */}
      <section className="py-20 bg-gradient-to-br from-neutral via-primary/5 to-secondary/5 relative overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/20 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-secondary/20 blur-2xl animate-pulse"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full"></div>
                <h2 className="font-display text-3xl md:text-4xl mb-4 relative z-10">
                  🔮 Vos Outils Énergétiques
                </h2>
              </motion.div>
              
              <p className="text-lg md:text-xl text-neutral-dark max-w-3xl mx-auto leading-relaxed">
                Découvrez trois façons uniques d'explorer et d'harmoniser votre énergie quotidienne
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Carte Tirage du Jour */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer"
               onClick={() => {
                 const dailySection = document.getElementById('daily-energy');
                 if (dailySection) {
                   dailySection.scrollIntoView({ behavior: 'smooth' });
                 } else {
                   showAlert('Section tirage du jour non trouvée', 'warning');
                 }
               }}
              >
                <div className="bg-white/95 dark:bg-neutral-dark/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary/20 relative overflow-hidden">
                  {/* Effet de lumière */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent"
                    animate={{ x: [-300, 300] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Sun size={32} className="text-white" />
                    </div>
                    
                    <h3 className="font-display text-2xl mb-4 text-center text-neutral-dark dark:text-white">Tirage du Jour</h3>
                    
                    <p className="text-neutral-dark/80 dark:text-white/90 text-center mb-6 leading-relaxed">
                      Recevez votre guidance énergétique quotidienne personnalisée selon votre type Human Design
                    </p>
                    
                    <div className="bg-gradient-to-r from-accent/20 to-warning/20 rounded-2xl p-4 mb-6">
                      <div className="flex items-center justify-center space-x-2 text-sm text-neutral-dark dark:text-white">
                        <Sparkles size={16} />
                        <span>Énergie • Mantra • Guidance</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent to-warning text-white rounded-full text-sm font-medium group-hover:shadow-lg transition-shadow">
                        Découvrir mon énergie du jour
                        <ChevronDown size={16} className="ml-2 group-hover:translate-y-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Carte Oracle Énergétique */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => navigate('/oracle')}
              >
                <div className="bg-white/95 dark:bg-neutral-dark/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary/20 relative overflow-hidden">
                  {/* Effet mystique */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/20 to-transparent"
                    animate={{ x: [-300, 300] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                    >
                      <span className="text-white text-2xl">🔮</span>
                    </motion.div>
                    
                    <h3 className="font-display text-2xl mb-4 text-center text-neutral-dark dark:text-white">Oracle Énergétique</h3>
                    
                    <p className="text-neutral-dark/80 dark:text-white/90 text-center mb-6 leading-relaxed">
                      Consultez les cartes oracle pour recevoir des messages et guidance spirituelle personnalisés
                    </p>
                    
                    <div className="bg-gradient-to-r from-secondary/20 to-primary/20 rounded-2xl p-4 mb-6">
                      <div className="flex items-center justify-center space-x-2 text-sm text-neutral-dark dark:text-white">
                        <span className="text-lg">🃏</span>
                        <span>Cartes • Messages • Sagesse</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-secondary to-primary text-white rounded-full text-sm font-medium group-hover:shadow-lg transition-shadow">
                        Consulter l'Oracle
                        <Sparkles size={16} className="ml-2 group-hover:rotate-12 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Carte Scan Énergétique */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => navigate('/scan')}
              >
                <div className="bg-white/95 dark:bg-neutral-dark/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary/20 relative overflow-hidden">
                  {/* Effet énergétique */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                    animate={{ x: [-300, 300] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                    >
                      <Activity size={32} className="text-white" />
                    </motion.div>
                    
                    <h3 className="font-display text-2xl mb-4 text-center text-neutral-dark dark:text-white">Scan Énergétique</h3>
                    
                    <p className="text-neutral-dark/80 dark:text-white/90 text-center mb-6 leading-relaxed">
                      Analysez votre état énergétique actuel avec notre diagnostic complet basé sur le Human Design
                    </p>
                    
                    <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-4 mb-6">
                      <div className="flex items-center justify-center space-x-2 text-sm text-neutral-dark dark:text-white">
                        <Activity size={16} />
                        <span>9 Catégories • Analyse • Conseils</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-medium group-hover:shadow-lg transition-shadow">
                        Commencer le scan
                        <Activity size={16} className="ml-2 group-hover:scale-110 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Call to action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <div className="bg-white/95 dark:bg-neutral-dark/80 backdrop-blur-sm rounded-2xl p-8 border border-primary/20">
                <h3 className="font-display text-2xl mb-4 text-neutral-dark dark:text-white">
                  ✨ Votre parcours énergétique commence ici
                </h3>
                <p className="text-neutral-dark/80 dark:text-white/90 mb-6 max-w-2xl mx-auto">
                  Chaque outil vous offre une perspective unique sur votre énergie. 
                  Explorez, découvrez et alignez-vous avec votre essence profonde.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="primary" 
                    onClick={handleStartScan}
                    icon={<Sparkles size={18} />}
                  >
                    Commencer maintenant
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/about')}
                    icon={<BookOpen size={18} />}
                  >
                    En savoir plus
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pourquoi scanner ton énergie Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl mb-8 text-primary">
              Pourquoi scanner ton énergie ?
            </h2>
            
            <div className="text-lg text-neutral-dark/80 leading-relaxed mb-8 space-y-4">
              <p>Parce que ton corps te parle constamment, mais nous avons oublié comment l'écouter.</p>
              <p>Chaque sensation, chaque émotion, chaque pensée est un message de ton système énergétique.</p>
              <p>Le Baromètre t'aide à décoder ces signaux selon ton design Human Design unique, pour retrouver ton alignement naturel.</p>
            </div>
            
            <div className="font-display text-xl text-primary italic">
              "Quand une femme honore ses cycles et son énergie unique, elle retrouve sa puissance naturelle."
            </div>
            
            <div className="mt-8">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleStartScan}
                icon={<Sparkles size={20} />}
              >
                Commencer mon scan
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comment ça marche Section */}
      <section id="how-it-works" className="py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl text-center mb-4">
              Comment ça marche
            </h2>
            
            <p className="text-lg text-neutral-dark/80 text-center mb-12">
              Découvrez votre équilibre énergétique en quelques minutes
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={`w-20 h-20 ${getStepColor(step.color)} rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}>
                    {getStepIcon(step.icon)}
                  </div>
                  
                  <h3 className="font-display text-xl mb-4">{step.title}</h3>
                  
                  <p className="text-neutral-dark/80 leading-relaxed">
                    {step.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
            
      {/* Daily Energy Section - Données dynamiques depuis la base */}
      <DailyEnergySection onStartScan={handleStartScan} />
      
      {/* Premium Subscription Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-texture bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-8">
              <Crown size={32} className="text-white" />
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl mb-6 text-primary">
              Débloquez tout votre potentiel énergétique
            </h2>
            
            <p className="text-lg md:text-xl text-neutral-dark/80 mb-8 leading-relaxed">
              Accédez à toutes les catégories de diagnostic, rapports PDF personnalisés, 
              tirage énergétique quotidien et bien plus encore.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-neutral-dark/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-primary/20">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-lg mb-2 text-white">9 Catégories Complètes</h3>
                <p className="text-sm text-white/90">
                  Explorez toutes les dimensions de votre être : émotionnel, physique, mental, énergétique...
                </p>
              </div>
              
              <div className="bg-neutral-dark/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-secondary/20">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={24} className="text-secondary" />
                </div>
                <h3 className="font-display text-lg mb-2 text-white">Rapports PDF</h3>
                <p className="text-sm text-white/90">
                  Recevez des analyses détaillées et personnalisées à conserver ou imprimer
                </p>
              </div>
              
              <div className="bg-neutral-dark/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-accent/20">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sun size={24} className="text-accent" />
                </div>
                <h3 className="font-display text-lg mb-2 text-white">Tirage Quotidien</h3>
                <p className="text-sm text-white/90">
                  Guidance énergétique et mantra personnalisé chaque jour selon votre type HD
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/premium')}
                icon={<Crown size={20} />}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
              >
                Découvrir nos offres
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/scan-conversational')} 
                disabled={isLoading}
                icon={<Sparkles size={20} />}
                className="border-2 border-primary/30 hover:border-primary/50"
              >
                {isLoading ? 'Chargement...' : 'Essayer gratuitement'}
              </Button>
            </div>
            {/* Admin access for Christel (fondatrice) on homepage */}
            {isAuthenticated && user?.email === 'christel.aplogan@gmail.com' && (
              <div className="mt-6 flex justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToAdmin}
                  icon={<Shield size={16} />}
                  className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 text-primary hover:bg-primary/20"
                >
                  🌸 Console Admin
                </Button>
              </div>
            )}
            
            <p className="text-sm text-neutral-dark/60 mt-8">
              ✨ Rejoignez plus de 1000 femmes qui ont transformé leur relation à l'énergie
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Dialogues */}
      <ConfirmationDialog
        isOpen={showTestDialog}
        onClose={() => setShowTestDialog(false)}
        title={testResult?.success ? "Test OpenAI réussi ! ✅" : "Test OpenAI échoué ❌"}
        message={testResult?.message || 'Test en cours...'}
        type={testResult?.success ? "success" : "warning"}
        showActions={false}
      />
      
    </div>
  );
});

export default Home;