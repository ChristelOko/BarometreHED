import { Home, Sparkles, User, LayoutDashboard } from 'lucide-react';
import { Users, Shield, MessageCircle, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

const BottomNav = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/scan', icon: Sparkles, label: 'Scan' },
    { 
      path: '/community',
      icon: Users,
      label: 'Communauté'
    },
    { path: '/scan-conversational', icon: MessageCircle, label: 'Aminata' }
  ];

  // Add dashboard button if authenticated
  if (isAuthenticated) {
    navItems.push({
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Tableau'
    });
  }
  
  // Add oracle button if authenticated
  if (isAuthenticated) {
    navItems.push({
      path: '/oracle',
      icon: Star,
      label: 'Oracle'
    });
  }

  // Add admin button for Christel
  if (isAuthenticated && user?.role === 'admin') {
    navItems.push({
      path: '/admin',
      icon: Shield,
      label: 'Admin'
    });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 pb-safe">
      <div className="bg-white dark:bg-[#2D2424] border-t border-neutral/20 shadow-lg rounded-t-2xl">
        <nav className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = !item.external && location.pathname === item.path;
            const isMiddleButton = item.path === '/scan';

            const buttonContent = (
              <div className={`relative flex flex-col items-center transition-all duration-200 ${
                isMiddleButton ? 'transform -translate-y-6' : ''
              }`}>
                {isMiddleButton ? (
                  <div className="absolute -top-3 w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center shadow-xl shadow-primary/40 border-3 border-white dark:border-[#3D3232]">
                    <div className="flex flex-col items-center">
                      <Icon size={18} className="text-white mb-0.5" />
                      <span className="text-[10px] text-white font-semibold">Scan</span>
                    </div>
                  </div>
                ) : (
                  <div className={`p-2 rounded-xl transition-all duration-200 ${
                    item.external ? "bg-primary/10" : 
                    isActive ? "bg-primary/10" : "hover:bg-neutral/10"
                  }`}>
                    <Icon 
                      size={20} 
                      className={`transition-all duration-300 ${
                        isActive ? 'text-primary scale-110' : 
                        item.external ? 'text-primary' : 
                        'text-neutral-dark/60 dark:text-neutral/60'
                      }`}
                    />
                  </div>
                )}
                <span className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary font-semibold' : 
                    item.external ? 'text-primary' : 
                    'text-neutral-dark/60 dark:text-neutral/60'
                  } ${isMiddleButton ? 'mt-8' : ''}`}
                >
                  {item.label}
                </span>
              </div>
            );

            return item.external ? (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex justify-center py-1"
              >
                {buttonContent}
              </a>
            ) : (
              <div
                key={item.path}
                className="flex-1 flex justify-center py-1"
              >
                <Link to={item.path}>
                  {buttonContent}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;