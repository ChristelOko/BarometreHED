import { memo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import BackButton from './BackButton';
import { TYPOGRAPHY, ANIMATIONS } from '../../utils/designSystem';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  children?: ReactNode;
  className?: string;
}

const PageHeader = memo(({ 
  title, 
  subtitle, 
  backTo, 
  backLabel,
  children,
  className = ''
}: PageHeaderProps) => {
  return (
    <motion.div
      {...ANIMATIONS.fadeIn}
      className={`mb-8 ${className}`}
    >
      {/* Bouton retour mobile */}
      {backTo && (
        <div className="md:hidden mb-4">
          <BackButton to={backTo} label={backLabel} variant="mobile" />
        </div>
      )}
      
      {/* Header desktop */}
      <div className="hidden md:flex items-center justify-between mb-6">
        {backTo && (
          <BackButton to={backTo} label={backLabel} variant="desktop" />
        )}
        
        <div className="flex-1 text-center">
          <h1 className={TYPOGRAPHY.display.lg}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-neutral-dark/70 mt-2">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="w-24">
          {children}
        </div>
      </div>
      
      {/* Titre mobile centré */}
      <div className="md:hidden text-center">
        <h1 className={TYPOGRAPHY.display.md}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-neutral-dark/70 mt-2">
            {subtitle}
          </p>
        )}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;