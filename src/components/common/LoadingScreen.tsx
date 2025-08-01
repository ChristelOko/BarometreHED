import { memo } from 'react';
import { useTranslation } from '../../context/LanguageContext';

const LoadingScreen = memo(() => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-neutral via-primary/5 to-secondary/5 overflow-hidden">
      {/* Contenu principal */}
      <div className="text-center relative z-10 max-w-md mx-auto px-6">
        {/* Logo principal agrandi */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            <img 
              src="/favicon.svg" 
              alt="Baromètre Énergétique" 
              className="w-full h-full filter drop-shadow-2xl animate-pulse"
            />
          </div>
        </div>

        {/* Titre principal */}
        <h1 className="font-display text-3xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Baromètre Énergétique
        </h1>

        {/* Message de chargement */}
        <div className="space-y-2 mb-8">
          <p className="text-lg text-primary font-medium animate-pulse">
            Harmonisation des énergies...
          </p>
        </div>

        {/* Citation inspirante */}
        <blockquote className="text-sm italic text-neutral-dark/60 font-display">
          "Votre corps sait. Votre énergie parle. Écoutez."
        </blockquote>
      </div>
    </div>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;