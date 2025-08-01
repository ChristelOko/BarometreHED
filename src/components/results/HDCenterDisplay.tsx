import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';

interface HDCenterDisplayProps {
  center: string;
}

const HDCenterDisplay = ({ center }: HDCenterDisplayProps) => {
  // Map of HD centers to their descriptions and colors
  const centerDescriptions: Record<string, { title: string, description: string, color: string }> = {
    'throat': {
      title: 'Centre de la Gorge',
      description: 'Communication, expression, manifestation',
      color: 'bg-blue-500'
    },
    'heart': {
      title: 'Centre du Cœur',
      description: 'Volonté, détermination, vitalité',
      color: 'bg-red-500'
    },
    'solar-plexus': {
      title: 'Plexus Solaire',
      description: 'Émotions, sensibilité, intuition',
      color: 'bg-yellow-500'
    },
    'sacral': {
      title: 'Centre Sacral',
      description: 'Énergie vitale, créativité, sexualité',
      color: 'bg-orange-500'
    },
    'root': {
      title: 'Centre Racine',
      description: 'Stress, pression, survie',
      color: 'bg-red-800'
    },
    'spleen': {
      title: 'Centre de la Rate',
      description: 'Intuition, système immunitaire, peur',
      color: 'bg-indigo-500'
    },
    'g-center': {
      title: 'Centre G (Identité)',
      description: 'Identité, amour, direction',
      color: 'bg-green-500'
    },
    'ajna': {
      title: 'Centre Ajna',
      description: 'Mental, conceptualisation, certitude',
      color: 'bg-teal-500'
    },
    'head': {
      title: 'Centre de la Tête',
      description: 'Inspiration, questions, pression mentale',
      color: 'bg-purple-500'
    }
  };

  const centerInfo = centerDescriptions[center] || {
    title: 'Centre Énergétique',
    description: 'Information non disponible',
    color: 'bg-gray-500'
  };

  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`w-24 h-24 rounded-full ${centerInfo.color} flex items-center justify-center mb-4 shadow-lg`}>
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
          <div className={`w-10 h-10 rounded-full ${centerInfo.color} bg-opacity-30`}></div>
        </div>
      </div>
      
      <h3 className="font-display text-xl mb-2">{centerInfo.title}</h3>
      <p className="text-sm text-center text-neutral-dark/70">{centerInfo.description}</p>
    </motion.div>
  );
};

export default HDCenterDisplay;