import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { format } from 'date-fns';
import { fr, enUS, id } from 'date-fns/locale';

interface Scan {
  date: string;
  score: number;
  center: string;
  general_score?: number;
  emotional_score?: number;
  physical_score?: number;
}

interface ScanHistoryChartProps {
  scanHistory: Scan[];
}

const ScanHistoryChart = ({ scanHistory }: ScanHistoryChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);
  
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions and scaling for retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    // Configuration
    const padding = 40;
    const cWidth = rect.width - padding * 2;
    const cHeight = rect.height - padding * 2;
    setChartWidth(cWidth);
    setChartHeight(cHeight);
    const dataPoints = scanHistory.length;
    
    if (dataPoints === 0) {
      // Draw empty state message
      ctx.font = '16px Montserrat';
      ctx.fillStyle = 'rgba(111, 89, 89, 0.5)';
      ctx.textAlign = 'center';
      ctx.fillText('Pas encore d\'historique de scan', rect.width / 2, rect.height / 2);
      return;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, rect.height - padding);
    ctx.lineTo(rect.width - padding, rect.height - padding);
    ctx.strokeStyle = 'rgba(111, 89, 89, 0.2)';
    ctx.stroke();
    
    // Draw Y-axis labels
    ctx.font = '12px Montserrat';
    ctx.fillStyle = 'rgba(111, 89, 89, 0.8)';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 100; i += 20) {
      const y = rect.height - padding - (i / 100) * cHeight;
      ctx.fillText(i.toString(), padding - 10, y + 4);
      
      // Draw horizontal grid lines
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(rect.width - padding, y); 
      ctx.strokeStyle = 'rgba(111, 89, 89, 0.1)';
      ctx.stroke();
    }
    
    // Sort scans by date
    const sortedScans = [...scanHistory].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Draw data points and connecting lines
    if (dataPoints > 1) {
      ctx.beginPath();
      
      sortedScans.forEach((scan, index) => {
        const x = padding + (index / (dataPoints - 1)) * cWidth;
        const y = rect.height - padding - (scan.score / 100) * cHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.strokeStyle = 'rgb(168, 120, 120)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw area under the line
      ctx.lineTo(padding + cWidth, rect.height - padding);
      ctx.lineTo(padding, rect.height - padding);
      ctx.closePath();
      ctx.fillStyle = 'rgba(168, 120, 120, 0.1)';
      ctx.fill();
      
      // Draw data points
      sortedScans.forEach((scan, index) => {
        const x = padding + (index / (dataPoints - 1)) * cWidth;
        const y = rect.height - padding - (scan.score / 100) * cHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = 'rgb(168, 120, 120)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw date label for first, last, and some middle points
        if (index === 0 || index === dataPoints - 1 || index % Math.max(1, Math.floor(dataPoints / 5)) === 0) {
          const date = new Date(scan.date);
          const dateLabel = format(date, 'dd MMM', { locale: fr });
          
          ctx.font = '10px Montserrat';
          ctx.fillStyle = 'rgba(111, 89, 89, 0.7)';
          ctx.textAlign = 'center';
          ctx.fillText(dateLabel, x, rect.height - padding + 20);
        }
      });
    }
    
  }, [scanHistory]);

  // Fonction pour générer des données de légende
  const generateLegendData = () => {
    if (scanHistory.length === 0) return null;
    
    const minScore = Math.min(...scanHistory.map(scan => scan.score));
    const maxScore = Math.max(...scanHistory.map(scan => scan.score));
    const avgScore = Math.round(scanHistory.reduce((sum, scan) => sum + scan.score, 0) / scanHistory.length);
    
    return { minScore, maxScore, avgScore };
  };

  const legendData = generateLegendData();
  
  return (
    <div className="w-full h-full flex flex-col">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
      
      {/* Légende du graphique */}
      {legendData && (
        <div className="flex justify-between mt-4 text-sm text-neutral-dark/70 px-4">
          <div>
            <span className="font-medium text-error">Min: {legendData.minScore}%</span>
          </div>
          <div>
            <span className="font-medium text-primary">Moy: {legendData.avgScore}%</span>
          </div>
          <div>
            <span className="font-medium text-success">Max: {legendData.maxScore}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanHistoryChart;