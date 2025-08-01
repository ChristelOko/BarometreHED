import { createContext, useContext, ReactNode } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Contexte simplifié sans traductions
interface LanguageContextType {
  formatDate: (date: Date | string, formatStr: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  formatDate: (date, formatStr) => '',
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Fonction pour formater les dates en français
  const formatDateFn = (date: Date | string, formatStr: string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: fr });
  };

  return (
    <LanguageContext.Provider value={{ formatDate: formatDateFn }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook simplifié pour le formatage de dates
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  
  // Fonction t simplifiée qui retourne juste la clé
  const t = (key: string, params?: Record<string, string>): string => {
    let result = key;
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        result = result.replace(new RegExp(`{${param}}`, 'g'), value);
      });
    }
    return result;
  };
  
  return { 
    ...context,
    t,
    currentLanguage: 'fr' as const,
    setLanguage: () => {},
    isLoading: false,
    availableLanguages: [{ code: 'fr' as const, name: 'Français', flag: '🇫🇷' }]
  };
};