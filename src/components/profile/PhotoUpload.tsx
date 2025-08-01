import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Crop, RotateCw, Download, Eye, AlertCircle, Check } from 'lucide-react';
import Button from '../common/Button';
import { useAlertStore } from '../../store/alertStore';

interface PhotoUploadProps {
  currentPhoto?: string | null;
  onPhotoChange: (photo: string | null) => void;
  type: 'profile' | 'cover';
  className?: string;
}

interface PhotoState {
  preview: string | null;
  file: File | null;
  isProcessing: boolean;
  error: string | null;
}

const PhotoUpload = ({ currentPhoto, onPhotoChange, type, className = '' }: PhotoUploadProps) => {
  const { showAlert } = useAlertStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoState, setPhotoState] = useState<PhotoState>({
    preview: currentPhoto,
    file: null,
    isProcessing: false,
    error: null
  });
  const [showCropModal, setShowCropModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const maxSize = type === 'profile' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB pour profil, 10MB pour couverture
  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const dimensions = type === 'profile' 
    ? { width: 400, height: 400, aspectRatio: '1:1' }
    : { width: 1200, height: 400, aspectRatio: '3:1' };

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return 'Format non supporté. Utilisez JPG, PNG ou WebP.';
    }
    
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return `Fichier trop volumineux. Maximum ${maxSizeMB}MB.`;
    }
    
    return null;
  };

  const processImage = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const { width: targetWidth, height: targetHeight } = dimensions;
        
        // Calculer les dimensions pour préserver les proportions
        const imgAspectRatio = img.width / img.height;
        const targetAspectRatio = targetWidth / targetHeight;
        
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;
        
        // Recadrer l'image pour qu'elle remplisse le canvas sans déformation
        if (imgAspectRatio > targetAspectRatio) {
          // Image plus large que le ratio cible - recadrer horizontalement
          sourceWidth = img.height * targetAspectRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // Image plus haute que le ratio cible - recadrer verticalement
          sourceHeight = img.width / targetAspectRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        if (ctx) {
          // Fond blanc pour les images transparentes
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          
          // Dessiner l'image recadrée et redimensionnée
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight, // Source (recadrage)
            0, 0, targetWidth, targetHeight // Destination (canvas complet)
          );
          
          // Convertir en base64 avec qualité optimisée
          const quality = file.size > 1024 * 1024 ? 0.8 : 0.9;
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } else {
          reject(new Error('Impossible de traiter l\'image'));
        }
      };
      
      img.onerror = () => reject(new Error('Impossible de charger l\'image'));
      img.src = URL.createObjectURL(file);
    });
  }, [dimensions]);

  const handleFileSelect = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setPhotoState(prev => ({ ...prev, error }));
      showAlert(error, 'error');
      return;
    }

    setPhotoState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      error: null,
      file 
    }));

    try {
      const processedImage = await processImage(file);
      setPhotoState(prev => ({ 
        ...prev, 
        preview: processedImage,
        isProcessing: false 
      }));
      onPhotoChange(processedImage);
      showAlert('Photo mise à jour avec succès ! 🌸', 'success');
    } catch (error) {
      console.error('Error processing image:', error);
      setPhotoState(prev => ({ 
        ...prev, 
        isProcessing: false,
        error: 'Erreur lors du traitement de l\'image'
      }));
      showAlert('Erreur lors du traitement de l\'image', 'error');
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removePhoto = () => {
    setPhotoState({
      preview: null,
      file: null,
      isProcessing: false,
      error: null
    });
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const downloadPhoto = () => {
    if (photoState.preview) {
      const link = document.createElement('a');
      link.download = `${type}-photo.jpg`;
      link.href = photoState.preview;
      link.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone de upload */}
      <div
        className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
          dragOver 
            ? 'border-primary bg-primary/5 scale-105' 
            : photoState.preview 
              ? 'border-success bg-success/5' 
              : 'border-neutral-dark/20 hover:border-primary/50'
        } ${type === 'profile' ? 'aspect-square' : 'aspect-[3/1]'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {photoState.preview ? (
          <div className="relative w-full h-full group">
            <img 
              src={photoState.preview} 
              alt={`${type} preview`}
              className="w-full h-full object-cover rounded-lg"
            />
            
            {/* Overlay avec actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={openFileDialog}
                  className="p-2 bg-white/90 text-neutral-dark rounded-full hover:bg-white transition-colors"
                  title="Changer la photo"
                >
                  <Camera size={16} />
                </button>
                <button
                  onClick={downloadPhoto}
                  className="p-2 bg-white/90 text-neutral-dark rounded-full hover:bg-white transition-colors"
                  title="Télécharger"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={removePhoto}
                  className="p-2 bg-white/90 text-error rounded-full hover:bg-white transition-colors"
                  title="Supprimer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Indicateur de traitement */}
            {photoState.isProcessing && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                <div className="text-center text-white">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm">Traitement...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
            onClick={openFileDialog}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              dragOver ? 'bg-primary text-white' : 'bg-neutral-dark/10 text-neutral-dark/50'
            }`}>
              {photoState.isProcessing ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Upload size={24} />
              )}
            </div>
            
            <div className="text-center">
              <p className="font-medium text-neutral-dark mb-1">
                {dragOver ? 'Déposez votre photo ici' : `Ajouter une photo ${type === 'profile' ? 'de profil' : 'de couverture'}`}
              </p>
              <p className="text-sm text-neutral-dark/60 mb-2">
                Glissez-déposez ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-neutral-dark/50">
                {acceptedTypes.join(', ').toUpperCase()} • Max {maxSize / (1024 * 1024)}MB
              </p>
              <p className="text-xs text-neutral-dark/50">
                Recommandé: {dimensions.width}x{dimensions.height}px ({dimensions.aspectRatio})
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Messages d'erreur */}
      <AnimatePresence>
        {photoState.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-error text-sm bg-error/10 p-3 rounded-lg"
          >
            <AlertCircle size={16} />
            <span>{photoState.error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Informations sur la photo */}
      {photoState.file && (
        <div className="bg-neutral/20 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Check size={16} className="text-success" />
              <span className="font-medium">{photoState.file.name}</span>
            </div>
            <span className="text-neutral-dark/60">
              {(photoState.file.size / 1024 / 1024).toFixed(1)} MB
            </span>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={openFileDialog}
          icon={<Camera size={16} />}
          className="flex-1"
        >
          {photoState.preview ? 'Changer' : 'Sélectionner'}
        </Button>
        
        {photoState.preview && (
          <Button
            variant="outline"
            size="sm"
            onClick={removePhoto}
            icon={<X size={16} />}
            className="text-error hover:bg-error/10"
          >
            Supprimer
          </Button>
        )}
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default PhotoUpload;