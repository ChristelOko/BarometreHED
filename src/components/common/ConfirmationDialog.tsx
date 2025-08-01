import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Sparkles, AlertTriangle, Info } from 'lucide-react';
import Button from './Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  icon?: ReactNode;
  type?: 'success' | 'info' | 'warning';
  showActions?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationDialog = ({
  isOpen,
  onClose,
  title,
  message,
  icon,
  type = 'success',
  showActions = false,
  onConfirm,
  confirmText = 'Confirmer',
  cancelText = 'Annuler'
}: ConfirmationDialogProps) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          iconBg: 'bg-success/20',
          iconColor: 'text-success',
          titleColor: 'text-success',
          borderColor: 'border-success/30'
        };
      case 'warning':
        return {
          iconBg: 'bg-warning/20',
          iconColor: 'text-warning',
          titleColor: 'text-warning',
          borderColor: 'border-warning/30'
        };
      default:
        return {
          iconBg: 'bg-primary/20',
          iconColor: 'text-primary',
          titleColor: 'text-primary',
          borderColor: 'border-primary/30'
        };
    }
  };

  const styles = getTypeStyles();
  const defaultIcon = type === 'success' ? <CheckCircle size={32} /> : 
                     type === 'warning' ? <AlertTriangle size={32} /> :
                     type === 'info' ? <Info size={32} /> : <Sparkles size={32} />;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-2 ${styles.borderColor}`}
        >
          {/* Header avec icône */}
          <div className="p-6 text-center relative overflow-hidden">
            {/* Effet de lumière subtil */}
            <div className={`absolute inset-0 ${styles.iconBg} opacity-20`}></div>
            
            {/* Particules flottantes */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/40 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-10, -30],
                    opacity: [0, 0.6, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`w-20 h-20 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-xl`}
            >
              <div className={styles.iconColor}>
                {icon || defaultIcon}
              </div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`font-display text-2xl mb-4 ${styles.titleColor} relative z-10`}
            >
              {title}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-neutral-dark/80 leading-relaxed relative z-10 text-lg"
            >
              {message}
            </motion.p>
          </div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="px-6 pb-6 bg-gradient-to-t from-neutral/10 to-transparent"
          >
            {showActions ? (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  fullWidth
                  className="border-2"
                >
                  {cancelText}
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    onConfirm?.();
                    onClose();
                  }}
                  fullWidth
                  className="shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-secondary"
                >
                  {confirmText}
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={onClose}
                fullWidth
                className="shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-secondary"
              >
                Parfait ! 🌸
              </Button>
            )}
          </motion.div>

          {/* Bouton de fermeture */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-dark/50 hover:text-neutral-dark transition-colors hover:bg-white/20 rounded-full z-20"
          >
            <X size={20} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationDialog;