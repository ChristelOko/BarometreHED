import { motion } from 'framer-motion';
import { Scan } from '../../services/scanService';
import { useTranslation } from '../../context/LanguageContext';
import { PieChart } from 'lucide-react';

interface CenterFrequencyProps {
  scans: Scan[];
  limit?: number;
}

const CenterFrequency = ({ scans, limit = 5 }: CenterFrequencyProps) => {

  const centerColors: Record<string, string> = {
    'throat': 'bg-blue-500 text-white',
    'heart': 'bg-red-500 text-white',
    'solar-plexus': 'bg-yellow-500 text-neutral-dark',
    'sacral': 'bg-orange-500 text-white',
    'root': 'bg-red-800 text-white',
    'spleen': 'bg-indigo-500 text-white',
    'g-center': 'bg-green-500 text-white',
    'ajna': 'bg-teal-500 text-white',
    'head': 'bg-purple-500 text-white'
  };

  const centerNames: Record<string, string> = {
    'throat': 'Gorge',
    'heart': 'Cœur',
    'solar-plexus': 'Plexus solaire',
    'sacral': 'Sacré',
    'root': 'Racine',
    'spleen': 'Rate',
    'g-center': 'Centre G',
    'ajna': 'Ajna',
    'head': 'Tête'
  };

  // Calculate center frequency
  const centerCounts = scans.reduce((acc, scan) => {
    acc[scan.center] = (acc[scan.center] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalScans = scans.length;
  const sortedCenters = Object.entries(centerCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit); // Limiter au nombre spécifié

  if (totalScans === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
        <div className="flex items-center mb-4">
          <PieChart size={20} className="text-primary mr-2" />
          <h3 className="font-display text-lg">Centres HD les plus actifs</h3>
        </div>
        <div className="text-center text-neutral-dark/70 py-4">
          Aucune donnée disponible
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <PieChart size={20} className="text-primary mr-2" />
        <h3 className="font-display text-lg">Centres HD les plus actifs</h3>
      </div>
      
      <div className="space-y-4">
        {sortedCenters.map(([center, count], index) => {
          const percentage = Math.round((count / totalScans) * 100);
          const centerName = centerNames[center] || center;
          
          return (
            <motion.div
              key={center}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className={`w-8 h-8 rounded-full ${centerColors[center]} flex items-center justify-center text-white text-xs font-medium`}>
                {centerNames[center].slice(0, 2).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-neutral-dark break-words">
                    {centerName}
                  </span>
                  <span className="text-sm text-neutral-dark/70 whitespace-nowrap">
                    {count} fois ({percentage}%)
                  </span>
                </div>
                
                <div className="w-full bg-neutral rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${centerColors[center]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CenterFrequency;