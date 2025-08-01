import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Save, Mail, Phone, Calendar, Edit3, Settings, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Shield, MapPin, Globe } from 'lucide-react';
import Button from '../../components/common/Button';
import PhotoUpload from '../../components/profile/PhotoUpload';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { showAlert } = useAlertStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthdate: user?.birthdate || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || ''
  });
  
  const hdTypes = [
    { value: 'generator', label: 'Generator', description: 'Énergie vitale et créatrice' },
    { value: 'projector', label: 'Projector', description: 'Guide et observateur sage' },
    { value: 'manifesting-generator', label: 'Manifesting Generator', description: 'Multi-passionné et rapide' },
    { value: 'manifestor', label: 'Manifestor', description: 'Initiateur et indépendant' },
    { value: 'reflector', label: 'Reflector', description: 'Miroir de l\'environnement' }
  ];

  const currentHdType = hdTypes.find(type => type.value === user?.hdType);

  // Validation en temps réel
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Le nom est requis';
        if (value.length < 2) return 'Le nom doit contenir au moins 2 caractères';
        return '';
      case 'email':
        if (!value.trim()) return 'L\'email est requis';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Format d\'email invalide';
        return '';
      case 'phone':
        if (value && !/^(?:\+33|0)[1-9](?:[0-9]{8})$/.test(value.replace(/\s/g, ''))) {
          return 'Format de téléphone invalide';
        }
        return '';
      case 'website':
        if (value && !value.startsWith('http')) {
          return 'L\'URL doit commencer par http:// ou https://';
        }
        return '';
      case 'bio':
        if (value.length > 500) return 'La bio ne peut pas dépasser 500 caractères';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validation en temps réel
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showAlert('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }

    try {
      setIsSaving(true);
      
      await updateUser({
        ...formData,
      });
      
      setIsEditing(false);
      showAlert('Profil mis à jour avec succès ! 🌸', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert('Erreur lors de la mise à jour du profil', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthdate: user?.birthdate || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const renderField = (
    name: string,
    label: string,
    type: string = 'text',
    icon?: React.ReactNode,
    placeholder?: string,
    rows?: number
  ) => {
    const hasError = !!errors[name];
    const value = formData[name as keyof typeof formData];
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-dark">
          {icon && <span className="inline-flex items-center mr-2">{icon}</span>}
          {label}
        </label>
        
        {isEditing ? (
          <div className="space-y-1">
            {type === 'textarea' ? (
              <textarea
                name={name}
                value={value}
                onChange={handleInputChange}
                className={`input-field ${hasError ? 'border-error' : ''}`}
                placeholder={placeholder}
                rows={rows || 3}
              />
            ) : (
              <input
                type={type}
                name={name}
                value={value}
                onChange={handleInputChange}
                className={`input-field ${hasError ? 'border-error' : ''}`}
                placeholder={placeholder}
              />
            )}
            
            {hasError && (
              <div className="flex items-center text-error text-sm">
                <AlertCircle size={14} className="mr-1" />
                {errors[name]}
              </div>
            )}
            
            {name === 'bio' && (
              <div className="text-xs text-neutral-dark/60 text-right">
                {value.length}/500 caractères
              </div>
            )}
          </div>
        ) : (
          <div className="text-neutral-dark">
            {value || (
              <span className="text-neutral-dark/50 italic">Non renseigné</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                icon={<ArrowLeft size={18} />}
                className="mr-4"
              >
                Retour
              </Button>
              <div>
                <h1 className="font-display text-3xl">Mon Profil</h1>
                <p className="text-neutral-dark/70">
                  Gérez vos informations personnelles
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate('/profile/privacy')}
                icon={<Settings size={18} />}
                size="sm"
              >
                Confidentialité
              </Button>
              
              {!isEditing && (
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  icon={<Edit3 size={18} />}
                  size="sm"
                >
                  Modifier
                </Button>
              )}
            </div>
          </div>

          {/* Photo de couverture */}
          <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="p-6">
              <h3 className="font-display text-xl mb-4">Photo de couverture</h3>
              <p className="text-sm text-neutral-dark/60 mb-4">
                Recommandé : 1200x400px (ratio 3:1). L'image sera automatiquement recadrée pour s'adapter.
              </p>
              <PhotoUpload
                currentPhoto={user?.coverPhoto}
                onPhotoChange={(photo) => updateUser({ coverPhoto: photo })}
                type="cover"
              />
            </div>
          </div>

          {/* Photo de profil et informations principales */}
          <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Photo de profil</h4>
                  <p className="text-xs text-neutral-dark/60">
                    Recommandé : format carré (400x400px). L'image sera automatiquement recadrée.
                  </p>
                </div>
                <PhotoUpload
                  currentPhoto={user?.photo}
                  onPhotoChange={(photo) => updateUser({ photo })}
                  type="profile"
                  className="w-32"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="font-display text-2xl mb-2">
                  {user?.name || user?.email?.split('@')[0] || 'Utilisatrice'}
                </h2>
                <p className="text-neutral-dark/70 mb-4">{user?.email}</p>
                
                {/* Type HD Badge */}
                {currentHdType && (
                  <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full mb-4">
                    <span className="font-medium">{currentHdType.label}</span>
                  </div>
                )}
                
                {/* Statut de completion du profil */}
                <div className="mt-4">
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-sm">
                    <div className="flex items-center">
                      {user?.photo && <Check size={14} className="text-success mr-1" />}
                      <span className={user?.photo ? 'text-success' : 'text-neutral-dark/60'}>
                        Photo de profil
                      </span>
                    </div>
                    <span className="text-neutral-dark/30">•</span>
                    <div className="flex items-center">
                      {formData.bio && <Check size={14} className="text-success mr-1" />}
                      <span className={formData.bio ? 'text-success' : 'text-neutral-dark/60'}>
                        Bio complétée
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="font-display text-xl mb-6">Informations personnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                {renderField('name', 'Nom complet', 'text', <User size={16} />, 'Votre nom complet')}
              </div>
              
              <div className="md:col-span-2">
                {renderField('email', 'Email', 'email', <Mail size={16} />, 'votre@email.com')}
              </div>
              
              {renderField('phone', 'Téléphone', 'tel', <Phone size={16} />, '06 12 34 56 78')}
              
              {renderField('birthdate', 'Date de naissance', 'date', <Calendar size={16} />)}
              
              {renderField('location', 'Localisation', 'text', <MapPin size={16} />, 'Votre ville ou région')}
              
              {renderField('website', 'Site web', 'url', <Globe size={16} />, 'https://votre-site.com')}
              
              <div className="md:col-span-2">
                {renderField('bio', 'Bio', 'textarea', undefined, 'Parlez-nous un peu de vous...', 4)}
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-3 mt-8 pt-6 border-t border-neutral/10">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  fullWidth
                  disabled={isSaving}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={isSaving || Object.keys(errors).some(key => errors[key])}
                  icon={isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  fullWidth
                >
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </div>
            )}
          </div>

          {/* Type Human Design */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="font-display text-xl mb-4">Type Human Design</h3>
            {currentHdType ? (
              <div className="p-4 bg-primary/5 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-primary text-lg">{currentHdType.label}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/profile/settings')}
                  >
                    Modifier
                  </Button>
                </div>
                <p className="text-neutral-dark/80">{currentHdType.description}</p>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-neutral-dark/70 mb-4">
                  Votre type Human Design n'est pas encore défini
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/profile/settings')}
                >
                  Définir mon type HD
                </Button>
              </div>
            )}
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/profile/privacy')}
              icon={<Shield size={18} />}
              fullWidth
            >
              Paramètres de confidentialité
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/profile/settings')}
              icon={<Settings size={18} />}
              fullWidth
            >
              Paramètres généraux
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;