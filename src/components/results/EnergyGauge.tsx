import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';

interface EnergyGaugeProps {
  score: number;
  affectedCenters?: string[];
}

const COLORS = {
  success: '#D4B483', // Or doux
  primary: '#C1A173', // Ocre moyen
  accent: '#B08968',  // Ocre foncé
  warning: '#A67B5B', // Terre de Sienne
  error: '#8B4513',   // Brun rustique
  neutral: '#F5E6D3',  // Beige clair
  background: '#FDF5E6' // Beige très clair
};

const centerColors: Record<string, string> = {
  'throat': '#C1A173',
  'heart': '#D4B483',
  'solar-plexus': '#B08968',
  'sacral': '#A67B5B',
  'root': '#8B4513',
  'spleen': '#D4B483',
  'g-center': '#C1A173',
  'ajna': '#B08968',
  'head': '#A67B5B'
};

const EnergyGauge = ({ score, affectedCenters = [] }: EnergyGaugeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const { t } = useTranslation();

  const getEnergyLevelMessage = () => {
    if (score >= 80) return "Énergie florissante ✨";
    if (score >= 60) return "Énergie équilibrée 🌸";
    if (score >= 40) return "Énergie fluctuante 🌊";
    if (score >= 20) return "Énergie en demande 🍃";
    return "Énergie en repos profond 🌙";
  };

  const getGaugeColor = () => {
    if (score >= 80) return COLORS.success;
    if (score >= 60) return COLORS.primary;
    if (score >= 40) return COLORS.accent;
    if (score >= 20) return COLORS.warning;
    return COLORS.error;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions with retina support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 300 * dpr;
    canvas.height = 300 * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = '300px';
    canvas.style.height = '300px';

    let time = 0;
    const centerX = 150;
    const centerY = 150;
    const radius = 120;
    const waveHeight = 8;
    const waveCount = 3;
    const angularSpeed = 0.02;
    const fillLevel = score / 100;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      // Draw background circle with gradient
      const bgGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      bgGradient.addColorStop(0, COLORS.background);
      bgGradient.addColorStop(1, COLORS.neutral);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = bgGradient;
      ctx.fill();
      
      // Create clipping path for the waves
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
      ctx.clip();

      // Draw waves with gradient
      const color = getGaugeColor();
      const waveGradient = ctx.createLinearGradient(
        centerX, centerY + radius * (1 - fillLevel),
        centerX, centerY + radius
      );
      waveGradient.addColorStop(0, color);
      waveGradient.addColorStop(1, COLORS.neutral);

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX - radius, centerY + radius * (1 - fillLevel));

        // Draw wave path
        for (let x = -radius; x <= radius; x++) {
          const relativeX = x / radius;
          const baseY = centerY + radius * (1 - fillLevel);
          const wave = Math.sin(time * angularSpeed + relativeX * 5 + i * 0.5) * waveHeight;
          const y = baseY + wave * (1 - Math.abs(relativeX));
          
          ctx.lineTo(centerX + x, y);
        }

        ctx.lineTo(centerX + radius, centerY + radius);
        ctx.lineTo(centerX - radius, centerY + radius);
        ctx.closePath();

        const alpha = 0.2 + (i * 0.2);
        ctx.fillStyle = `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      }
      ctx.restore();

      // Draw decorative ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `${color}33`;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw score with shadow
      ctx.shadowColor = `${color}66`;
      ctx.shadowBlur = 10;
      ctx.font = 'bold 48px "Cormorant Garamond"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;
      ctx.fillText(score.toString(), centerX, centerY - 10);
      ctx.shadowBlur = 0;

      // Draw "ÉNERGIE"
      ctx.font = '16px Montserrat';
      ctx.fillStyle = COLORS.accent;
      ctx.fillText('ÉNERGIE', centerX, centerY + 20);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-[250px] h-[250px] md:w-[300px] md:h-[300px]"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4B48333] to-transparent" />
        <canvas ref={canvasRef} className="w-full h-full touch-manipulation" />
        
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#C1A17333] to-[#B0896833] blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>
      
      <motion.p 
        className="mt-4 md:mt-6 font-display text-xl md:text-2xl text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {t(`energy_levels.${score >= 80 ? 'flourishing' : score >= 60 ? 'balanced' : score >= 40 ? 'fluctuating' : score >= 20 ? 'demanding' : 'resting'}`) || getEnergyLevelMessage()}
      </motion.p>

      {affectedCenters && affectedCenters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 md:mt-8 px-4"
        >
          <h3 className="text-center font-display text-lg mb-4">  
            {t('results.affected_centers') || 'Centres HD affectés'}
          </h3>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {affectedCenters.map((center, index) => (
              <motion.div
                key={center}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="relative group"
              >
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-xs font-medium mobile-touch-target"
                  style={{ backgroundColor: centerColors[center] || COLORS.primary }}
                >
                  {center.slice(0, 2).toUpperCase()}
                </div>
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm text-xs opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {center}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EnergyGauge;