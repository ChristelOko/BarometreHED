import { ReactNode, memo } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
}

const Button = memo(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false,
  icon,
  className = '',
}: ButtonProps) => {
  const baseClasses = 'rounded-full font-medium transition-all duration-300 ease-in-out inline-flex items-center justify-center touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary/50';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md active:scale-95',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-sm hover:shadow-md active:scale-95',
    outline: 'border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 active:scale-95',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;