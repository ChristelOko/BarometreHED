import { memo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'mobile' | 'desktop';
}

const BackButton = memo(({ 
  to, 
  label = 'Retour', 
  className = '',
  variant = 'default'
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'mobile':
        return 'md:hidden bg-white/95 backdrop-blur-sm border-primary/30 text-primary hover:bg-white shadow-sm w-12 h-12 p-0';
      case 'desktop':
        return 'hidden md:flex bg-white/95 backdrop-blur-sm border-primary/30 text-primary hover:bg-white shadow-sm';
      default:
        return 'bg-white/95 backdrop-blur-sm border-primary/30 text-primary hover:bg-white shadow-sm';
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      icon={<ArrowLeft size={18} />}
      className={`${getVariantClasses()} ${className}`}
    >
      {variant !== 'mobile' && label}
    </Button>
  );
});

BackButton.displayName = 'BackButton';

export default BackButton;