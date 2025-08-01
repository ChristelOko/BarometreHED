import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, XCircle, X, AlertTriangle } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
  type: AlertType;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

const Alert = ({ type, message, isOpen, onClose, duration = 5000 }: AlertProps) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const alertStyles: Record<AlertType, { icon: ReactNode; classes: string }> = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      classes: 'bg-success/10 text-success border-success/20 shadow-lg'
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      classes: 'bg-error/10 text-error border-error/20 shadow-lg'
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      classes: 'bg-warning/10 text-warning border-warning/20 shadow-lg'
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      classes: 'bg-primary/10 text-primary border-primary/20 shadow-lg'
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 max-w-md min-w-[300px]"
        >
          <div className={`rounded-xl border-2 p-4 backdrop-blur-sm ${alertStyles[type].classes}`}>
            <div className="flex items-start gap-3">
              {alertStyles[type].icon}
              <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
              <button
                onClick={onClose}
                className="text-current opacity-70 hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;