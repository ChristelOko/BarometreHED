import { memo } from 'react';
import { COMMON_CLASSES } from '../../utils/designSystem';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const LoadingSpinner = memo(({ 
  size = 'md', 
  message = 'Chargement...', 
  className = '' 
}: LoadingSpinnerProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6 border-2';
      case 'lg': return 'w-16 h-16 border-4';
      default: return 'w-12 h-12 border-4';
    }
  };

  return (
    <div className={`text-center ${className}`}>
      <div className={`${getSizeClasses()} border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
      {message && (
        <p className="text-neutral-dark/70">{message}</p>
      )}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;