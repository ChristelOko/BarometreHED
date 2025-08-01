import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, User, LogOut, Shield, Crown, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useAlertStore } from '../../store/alertStore';
import { useSubscription } from '../../hooks/useSubscription';
import { useTranslation } from '../../context/LanguageContext';
import { useAppSettings } from '../../context/AppSettingsContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { showAlert } = useAlertStore();
  const { currentPlanName, isPremium } = useSubscription();
  const { t } = useTranslation();
  const { settings } = useAppSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await logout();
    showAlert('Déconnexion réussie', 'success');
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      } bg-white dark:bg-[#2D2424] shadow-sm`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="z-10 flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img 
              src="/favicon.svg" 
              alt="Baromètre Énergétique" 
              className="w-8 h-8 transition-transform hover:scale-110"
            />
          </div>
          <h1 className="font-display text-2xl font-semibold text-primary">
            Baromètre<span className="font-light italic"> Énergétique</span>
          </h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-body text-neutral-dark hover:text-primary transition-colors">
            Accueil
          </Link>
          <Link to="/scan" className="font-body text-neutral-dark hover:text-primary transition-colors">
            Diagnostic
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="font-body text-neutral-dark hover:text-primary transition-colors">
              Tableau de Bord
            </Link>
          )}
          <div className="relative group">
            <button className="font-body text-neutral-dark hover:text-primary transition-colors">
              Plus
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#2D2424] rounded-xl shadow-lg py-2 border border-neutral/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link 
                to="/about"
                className="block w-full text-left px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
              >
                À propos
              </Link>
              <Link 
                to="/testimonials"
                className="block w-full text-left px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
              >
                Témoignages
              </Link>
              <Link 
                to="/community"
                className="block w-full text-left px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
              >
                Communauté
              </Link>
              <Link 
                to="/community/directory"
                className="block w-full text-left px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
              >
                Annuaire membres
              </Link>
              <Link 
                to="/oracle"
                className="block w-full text-left px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
              >
                Oracle Énergétique
              </Link>
              <Link 
                to="/help"
                className="block w-full text-left px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>
          <Link to="/premium" className="font-body text-neutral-dark hover:text-primary transition-colors flex items-center">
            <Crown size={16} className="mr-1" />
            Premium
          </Link>

          <button
            onClick={toggleDarkMode}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-neutral/10 transition-colors"
          >
            {isDarkMode ? (
              <>
                <Moon size={16} className="text-primary" />
                <span className="text-sm hidden md:inline">Mode Nuit</span>
              </>
            ) : (
              <>
                <Sun size={16} className="text-primary" />
                <span className="text-sm hidden md:inline">Mode Jour</span>
              </>
            )}
          </button>

          {!isAuthenticated ? (
            <div>
              <Link 
                to="/login" 
                className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              >
                Connexion
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors relative"
              >
                {isPremium() && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full flex items-center justify-center">
                    <Crown size={10} className="text-white" />
                  </div>
                )}
                {user?.photo ? (
                  <img 
                    src={user.photo} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={18} />
                )}
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#2D2424] rounded-xl shadow-lg py-2 border border-neutral/10">
                    <div className="px-4 py-2 border-b border-neutral/10">
                      <p className="font-medium text-primary truncate">{user?.name || user?.email?.split('@')[0] || 'Utilisatrice'}</p>
                      <p className="text-xs text-neutral-dark/70 truncate">{user?.email}</p>
                      {user?.hdType && (
                        <p className="text-xs text-primary/70 truncate">Type HD: {user.hdType}</p>
                      )}
                      <div className="mt-1 flex items-center">
                        {isPremium() && <Crown size={12} className="text-warning mr-1" />}
                        <span className={`text-xs font-medium ${isPremium() ? 'text-warning' : 'text-neutral-dark/60'}`}>
                          {currentPlanName}
                        </span>
                      </div>
                    </div>
                    
                    <Link 
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-neutral-dark hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <User size={16} className="mr-2" />
                      Mon profil
                    </Link>
                    
                    <Link 
                      to="/profile/settings"
                      className="flex items-center px-4 py-2 text-sm text-neutral-dark hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <Settings size={16} className="mr-2" />
                      Paramètres
                    </Link>
                    
                    {settings.showPremiumPage && (
                      <Link 
                        to="/premium"
                        className="flex items-center px-4 py-2 text-sm text-neutral-dark hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <Crown size={16} className="mr-2" />
                        {isPremium() ? 'Mon abonnement' : 'Devenir Premium'}
                      </Link>
                    )}
                    
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-neutral-dark hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <Shield size={16} className="mr-2" />
                        Administration
                      </Link>
                    )}
                    
                    {user?.role === 'admin' && (
                      <div className="px-4 py-2 border-t border-neutral/10">
                        <p className="text-xs text-primary font-medium mb-1">🌸 Console Admin</p>
                        <p className="text-xs text-neutral-dark/60">Gérez votre Baromètre Énergétique</p>
                      </div>
                    )}
                    
                    <button 
                      onClick={toggleDarkMode}
                      className="w-full flex items-center px-4 py-2 text-sm text-neutral-dark hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      {isDarkMode ? <Moon size={16} className="mr-2" /> : <Sun size={16} className="mr-2" />}
                      {isDarkMode ? 'Mode nuit' : 'Mode jour'}
                    </button>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors"
                    >
                      <LogOut size={16} className="mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-neutral-dark hover:text-primary transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white dark:bg-[#2D2424] z-40 md:hidden overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={toggleMenu}
              className="absolute top-6 right-6 p-3 text-neutral-dark hover:text-primary transition-colors rounded-full hover:bg-neutral/10 mobile-touch-target"
              aria-label="Fermer le menu"
            >
              <X size={24} />
            </button>

            <div className="container mx-auto px-6 flex flex-col items-center justify-start h-full overflow-y-auto mobile-scroll pt-20">
              {isAuthenticated && (
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-full text-center mb-8 pb-6 border-b border-neutral/10 flex-shrink-0"
                >
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    {user?.photo ? (
                      <img 
                        src={user.photo} 
                        alt={user.name} 
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/default-avatar.svg';
                        }}
                      />
                    ) : (
                      <img 
                        src="/default-avatar.svg" 
                        alt="Avatar par défaut" 
                        className="w-full h-full rounded-full object-cover opacity-80"
                      />
                    )}
                    {isPremium() && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center shadow-lg">
                        <Crown size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-primary text-lg">{user?.name}</p>
                  <p className="text-sm text-neutral-dark/70 mt-1">{user?.email}</p>
                  {user?.hdType && (
                    <p className="text-xs text-primary/70 mt-2 px-3 py-1 bg-primary/10 rounded-full inline-block">
                      {user.hdType}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-center">
                    {isPremium() && <Crown size={14} className="text-warning mr-1" />}
                    <span className={`text-sm font-medium ${isPremium() ? 'text-warning' : 'text-neutral-dark/60'}`}>
                      {currentPlanName}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Theme toggle button */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full mb-8"
              >
                <button 
                  onClick={toggleDarkMode} 
                  className="w-full flex items-center justify-center px-6 py-4 bg-neutral/10 rounded-2xl mobile-touch-target mobile-nav-item"
                >
                  {isDarkMode ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-primary" />}
                  <span className="mx-4 font-medium">
                    {isDarkMode ? 'Mode nuit' : 'Mode jour'}
                  </span>
                  <div className={`w-14 h-7 rounded-full transition-colors backdrop-blur-sm ${
                    isDarkMode ? 'bg-primary' : 'bg-neutral-dark/20'
                  }`}>
                    <div
                      className={`w-6 h-6 rounded-full bg-white shadow transform transition-transform ${
                        isDarkMode ? 'translate-x-7' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col space-y-6 w-full text-center flex-1"
              >
                <Link 
                  to="/" 
                  onClick={toggleMenu}
                  className="font-body text-xl text-neutral-dark hover:text-primary transition-colors py-4 px-6 rounded-2xl hover:bg-primary/5 mobile-touch-target mobile-nav-item"
                >
                  Accueil
                </Link>
                <Link 
                  to="/scan" 
                  onClick={toggleMenu}
                  className="font-body text-xl text-neutral-dark hover:text-primary transition-colors py-4 px-6 rounded-2xl hover:bg-primary/5 mobile-touch-target mobile-nav-item"
                >
                  Diagnostic
                </Link>
                {isAuthenticated && (
                  <Link 
                    to="/dashboard" 
                    onClick={toggleMenu}
                    className="block font-body text-lg text-neutral-dark dark:text-neutral hover:text-primary transition-colors py-3 px-6 rounded-2xl hover:bg-primary/5 mobile-touch-target mobile-nav-item"
                  >
                    Tableau de Bord
                  </Link>
                )}
                {settings.showPremiumPage && (
                  <Link 
                    to="/premium" 
                    onClick={toggleMenu}
                    className="font-body text-xl text-neutral-dark hover:text-primary transition-colors py-4 px-6 rounded-2xl hover:bg-primary/5 mobile-touch-target mobile-nav-item flex items-center justify-center"
                  >
                    <Crown size={20} className="mr-2" />
                    Premium
                  </Link>
                )}
                <div className="w-full my-4 flex flex-col items-center">
                  <div className="font-body text-xl text-neutral-dark mb-2 text-center">
                    Plus
                  </div>
                  <div className="space-y-3 border-t-2 border-primary/20 pt-4 w-full text-center rounded-t-2xl">
                    <Link 
                      to="/about" 
                      onClick={toggleMenu}
                      className="block font-body text-lg text-neutral-dark/80 dark:text-neutral/80 hover:text-primary transition-colors py-3 px-6 rounded-2xl hover:bg-primary/5 mobile-touch-target mobile-nav-item"
                    >
                      À propos
                    </Link>
                    <Link 
                      to="/testimonials" 
                      onClick={toggleMenu}
                      className="block font-body text-lg text-neutral-dark/80 dark:text-neutral/80 hover:text-primary transition-colors py-3 px-6 rounded-2xl hover:bg-primary/5 mobile-touch-target mobile-nav-item"
                    >
                      Témoignages
                    </Link>
                    <Link 
                      to="/community" 
                      onClick={toggleMenu}
                      className="block font-body text-lg text-neutral-dark/80 dark:text-neutral/80 hover:text-primary transition-colors py-3 px-6 rounded-2xl hover:bg-primary/5 mobile-touch-target mobile-nav-item"
                    >
                      Communauté
                    </Link>
                    <Link 
                      to="/community/directory" 
                      onClick={toggleMenu}
                      className="block font-body text-lg text-neutral-dark/80 dark:text-neutral/80 hover:text-primary transition-colors py-3 px-6 rounded-2xl hover:bg-primary/5 mobile-touch-target mobile-nav-item"
                    >
                      Annuaire membres
                    </Link>
                    <Link 
                      to="/help" 
                      onClick={toggleMenu}
                      className="block font-body text-lg text-neutral-dark/80 dark:text-neutral/80 hover:text-primary transition-colors py-3 px-6 rounded-2xl hover:bg-primary/5 mobile-touch-target mobile-nav-item"
                    >
                      FAQ
                    </Link>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={toggleMenu}
                        className="block font-body text-lg text-primary hover:text-primary/80 transition-colors py-3 px-6 rounded-2xl hover:bg-primary/5 mobile-touch-target mobile-nav-item"
                      >
                        <Shield size={18} className="mr-2 inline-block" />
                        🌸 Administration
                      </Link>
                    )}
                  </div>
                </div>
              
                {!isAuthenticated ? (
                  <Link to="/login" className="w-full mt-6" onClick={toggleMenu}>
                    <button className="w-full px-6 py-4 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-colors mobile-button">
                      {t('nav.login')}
                    </button>
                  </Link>
                ) : (
                  <div className="w-full space-y-4 mt-6 pb-8">
                    <Link to="/profile" className="w-full block" onClick={toggleMenu}>
                      <button className="w-full px-6 py-4 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-colors mobile-button">
                        Mon profil
                      </button>
                    </Link>

                    {user?.role === 'admin' && (
                      <Link to="/admin" className="w-full block" onClick={toggleMenu}>
                        <button className="w-full px-6 py-4 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-colors mobile-button">
                          <Shield size={16} className="mr-2 inline-block" />
                          🌸 Console Admin
                        </button>
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="w-full px-6 py-4 bg-error/10 text-error rounded-2xl hover:bg-error/20 transition-colors mobile-button"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;