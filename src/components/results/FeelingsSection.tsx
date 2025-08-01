import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import FeelingDetailsCard from './FeelingDetailsCard';
import { Feeling } from '../../store/feelingsStore';
import { useAuthStore } from '../../store/authStore';

interface FeelingsSectionProps {
  selectedFeelings: string[];
  allFeelings: Feeling[];
}

const FeelingsSection = ({ selectedFeelings, allFeelings }: FeelingsSectionProps) => {
  const { user } = useAuthStore();
  
  // Normaliser les centres affectés pour s'assurer qu'ils sont des chaînes de caractères
  const normalizeAffectedCenters = (centers: any[]): string[] => {
    if (!centers || !Array.isArray(centers)) return [];
    
    return centers.map(center => {
      if (typeof center === 'string') return center;
      if (typeof center === 'object' && center.center) return center.center;
      return 'unknown';
    });
  };
  
  // Filtrer les ressentis sélectionnés et les mapper avec leurs détails complets
  const selectedFeelingObjects = selectedFeelings
    .map(name => {
      // Chercher dans tous les ressentis disponibles
      // Filtrer par type HD si disponible
      const feeling = allFeelings.find(f => 
        f.name === name && 
        (!f.type_hd || !user?.hdType || f.type_hd === user.hdType)
      );
      
      if (feeling) {
        // Normaliser les centres affectés
        const normalizedFeeling = {
          ...feeling,
          affectedCenters: normalizeAffectedCenters(feeling.affectedCenters)
        };
        return normalizedFeeling;
      }
      return allFeelings.find(f => f.name === name);
    })
    .filter(f => f !== undefined);

  // Séparer les ressentis positifs et négatifs
  const positiveFeelings = selectedFeelingObjects.filter(f => f.isPositive);
  const negativeFeelings = selectedFeelingObjects.filter(f => !f.isPositive);

  if (selectedFeelingObjects.length === 0) {
    return (
      <div className="text-center text-neutral-dark/70 py-8">
        <p>Aucun ressenti sélectionné à analyser.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Ressentis positifs */}
      {positiveFeelings.length > 0 && (
        <div>
          <h3 className="font-display text-xl mb-4 text-primary">  
            ✨ Ressentis positifs ({positiveFeelings.length})
          </h3>
          <div className="space-y-4">
            {positiveFeelings.map((feeling, index) => (
              <FeelingDetailsCard
                key={`positive-${index}`}
                feeling={feeling}
                isPositive={true}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ressentis négatifs */}
      {negativeFeelings.length > 0 && (
        <div>
          <h3 className="font-display text-xl mb-4 text-warning">  
            🍂 Ressentis à observer ({negativeFeelings.length})
          </h3>
          <div className="space-y-4">
            {negativeFeelings.map((feeling, index) => (
              <FeelingDetailsCard
                key={`negative-${index}`}
                feeling={feeling}
                isPositive={false}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Message de synthèse */}
      <div className="bg-primary/5 p-6 rounded-xl">
        <h4 className="font-display text-lg mb-3 text-primary">
          📊 Synthèse de tes ressentis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-display text-primary">{selectedFeelingObjects.length}</div>
            <div className="text-sm text-neutral-dark/70">Ressentis analysés</div>
          </div>
          <div>
            <div className="text-2xl font-display text-success">{positiveFeelings.length}</div>
            <div className="text-sm text-neutral-dark/70">Ressentis positifs</div>
          </div>
          <div>
            <div className="text-2xl font-display text-warning">{negativeFeelings.length}</div>
            <div className="text-sm text-neutral-dark/70">Ressentis à observer</div>
          </div>
        </div>
        <p className="text-sm text-neutral-dark/80 mt-4 italic text-center">
          Chaque ressenti que tu as sélectionné est une information précieuse sur ton état énergétique actuel.
        </p>
      </div>
    </div>
  );
};

export default FeelingsSection;