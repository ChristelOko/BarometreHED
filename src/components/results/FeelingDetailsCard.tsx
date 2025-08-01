import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import Button from '../common/Button';

interface FeelingDetailsCardProps {
  feeling: {
    name: string;
    description: string;
    probableOrigin: string;
    affectedCenters: string[];
    mirrorPhrase?: string;
    realignmentExercise?: string;
    encouragement?: string;
  };
  isPositive: boolean;
  delay?: number;
}

const FeelingDetailsCard = ({ feeling, isPositive, delay = 0 }: FeelingDetailsCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const centerColors: Record<string, string> = {
    'throat': 'bg-blue-500',
    'heart': 'bg-red-500',
    'solar-plexus': 'bg-yellow-500',
    'sacral': 'bg-orange-500',
    'root': 'bg-red-800',
    'spleen': 'bg-indigo-500',
    'g-center': 'bg-green-500',
    'ajna': 'bg-teal-500',
    'head': 'bg-purple-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 ${
        isPositive ? 'border-primary/20' : 'border-warning/20'
      }`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isPositive ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'
          }`}>
            <Info size={20} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display text-lg">{feeling.name}</h4>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-neutral-dark/50 hover:text-primary transition-colors"
              >
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {feeling.affectedCenters.map((center, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-xs text-white ${centerColors[center] || 'bg-gray-500'}`}
                >
                  {typeof center === 'string' ? center : (center.center || 'unknown')}
                </span>
              ))}
            </div>

            <p className="text-neutral-dark/80 mb-4">{feeling.description}</p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              icon={isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            >
              {isExpanded ? 'Voir moins' : 'Voir plus'}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-neutral/10 space-y-6"
            >
              <div>
                <p className="text-neutral-dark/70 mb-2">Origine probable</p>
                <p className="italic text-neutral-dark">{feeling.probableOrigin}</p>
              </div>

              {feeling.mirrorPhrase && (
                <div className="bg-neutral p-4 rounded-lg">
                  <p className="text-neutral-dark/70 mb-2">Phrase miroir</p>
                  <p className="italic text-primary font-medium">"{feeling.mirrorPhrase}"</p>
                </div>
              )}

              {feeling.realignmentExercise && (
                <div>
                  <p className="text-neutral-dark/70 mb-2">Exercice de réalignement</p>
                  <p className="text-neutral-dark">{feeling.realignmentExercise}</p>
                </div>
              )}

              {feeling.encouragement && (
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="italic text-primary">{feeling.encouragement}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus size={16} />}
                >
                  Ajouter aux rappels
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FeelingDetailsCard;