import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { BarChart2 } from 'lucide-react';

interface EnergyTrendProps {
  trend: 'improving' | 'stable' | 'declining';
  averageScore: number; 
  previousScore?: number;
}

const EnergyTrend = ({ trend, averageScore, previousScore }: EnergyTrendProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="text-success" size={20} />; 
      case 'declining':
        return <TrendingDown className="text-error" size={20} />;
      default:
        return <Minus className="text-primary" size={20} />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'improving': return 'En amélioration';
      case 'declining': return 'En diminution';
      default: return 'Stable';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'improving':
        return 'text-success'; 
      case 'declining':
        return 'text-error';
      default:
        return 'text-primary';
    }
  };

  const getScoreChange = () => {
    if (!previousScore) return null;
    const change = averageScore - previousScore;
    return change > 0 ? `+${change}` : change.toString(); 
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BarChart2 size={20} className="text-primary mr-2" />
          <h3 className="font-display text-lg">Tendance énergétique</h3>
        </div>
        {getTrendIcon()}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-display text-primary">{Math.round(averageScore)}%</span>
            {getScoreChange() && (
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                ({getScoreChange()})
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-dark/70">Score énergétique moyen</p>
        </div>

        <div className="flex items-center space-x-2">
          {getTrendIcon()}
          <span className={`font-medium ${getTrendColor()}`}>
            {getTrendText()}
          </span>
        </div>

        <div className="w-full bg-neutral rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-primary"
            initial={{ width: 0 }} 
            animate={{ width: `${Math.round(averageScore)}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default EnergyTrend;