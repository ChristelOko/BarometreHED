import { useState, useEffect } from 'react';
import { getTodayEnergeticReading, EnergeticReading } from '../services/energeticReadingService';

export const useDailyEnergy = () => {
  const [reading, setReading] = useState<EnergeticReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTodayReading = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const todayReading = await getTodayEnergeticReading();
        setReading(todayReading);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement de l\'énergie du jour');
        console.error('Error loading daily energy:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodayReading();
  }, []);

  // Helpers pour accéder facilement aux données
  const getDayEnergy = () => reading?.day_energy || '';
  const getMonthEnergy = () => reading?.month_energy || '';
  const getYearEnergy = () => reading?.year_energy || '';
  const getDescription = () => reading?.description || '';
  const getMantra = () => reading?.mantra || '';
  const getDayNumber = () => reading?.day_number || 0;

  const hasReading = () => reading !== null;

  return {
    reading,
    isLoading,
    error,
    hasReading,
    getDayEnergy,
    getMonthEnergy,
    getYearEnergy,
    getDescription,
    getMantra,
    getDayNumber
  };
};