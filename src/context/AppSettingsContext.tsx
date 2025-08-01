import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAppSettings, AppSettings } from '../services/adminService';

interface AppSettingsContextType {
  settings: AppSettings;
  isLoading: boolean;
  error: Error | null;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  showPremiumPage: true,
  freeRegistration: true
};

const AppSettingsContext = createContext<AppSettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  error: null,
  refreshSettings: async () => {}
});

interface AppSettingsProviderProps {
  children: ReactNode;
}

export const AppSettingsProvider = ({ children }: AppSettingsProviderProps) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load settings from localStorage for demo
      const storedSettings = localStorage.getItem('appSettings');
      let data = null;
      let error = null;
      
      if (storedSettings) {
        try {
          data = JSON.parse(storedSettings);
        } catch (parseError) {
          console.error('Error parsing stored settings:', parseError);
          error = parseError;
        }
      }
      
      if (data) {
        setSettings(data);
        console.log('App settings loaded:', data);
      } else {
        console.log('No app settings found, using defaults');
      }
    } catch (err) {
      console.error('Error fetching app settings:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    await fetchSettings();
  };

  return (
    <AppSettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        refreshSettings
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => useContext(AppSettingsContext);