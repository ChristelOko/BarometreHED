import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, ArrowLeft, Calendar, Sparkles, Moon, Download, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import { useDailyEnergy } from '../../hooks/useDailyEnergy';
import { formatReadingText } from '../../utils/formatReadingText';

const DailyEnergyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showAlertDialog } = useAlertStore();
  const { 
    reading, 
    isLoading, 
    error, 
    hasReading, 
    getDayEnergy, 
    getMonthEnergy, 
    getYearEnergy, 
    getDescription, 
    getMantra, 
    getDayNumber 
  } = useDailyEnergy();

  const handleShare = async () => {
    const shareText = `Mon tirage énergétique du jour 🌸\n\n${getDayEnergy()}\n\nBaromètre Énergétique`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mon Tirage Énergétique du Jour',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        await navigator.clipboard.writeText(shareText);
        showAlertDialog(
          'Tirage copié ! 📋',
          'Votre tirage énergétique a été copié dans le presse-papier.',
          'success'
        );
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      showAlertDialog(
        'Tirage copié ! 📋',
        'Votre tirage énergétique a été copié dans le presse-papier.',
        'success'
      );
    }
  };

  const handleDownload = () => {
    const content = `
🌸 TIRAGE ÉNERGÉTIQUE DU JOUR 🌸
${new Date().toLocaleDateString('fr-FR', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

✨ ÉNERGIE DU JOUR :
${getDayEnergy()}

🌙 ÉNERGIE DU MOIS :
${getMonthEnergy()}

⭐ ÉNERGIE DE L'ANNÉE :
${getYearEnergy()}

💫 MESSAGE DU JOUR :
${getDescription()}

🧘‍♀️ MANTRA :
${getMantra()}

---
Généré par le Baromètre Énergétique
Votre guide énergétique personnel 🌸
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tirage-energetique-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    showAlertDialog(
      'Tirage téléchargé ! 📄',
      'Votre tirage énergétique a été sauvegardé sur votre appareil.',
      'success'
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="font-display text-xl text-accent mb-2">Chargement de votre énergie...</h2>
          <p className="text-neutral-dark/70">Connexion aux énergies cosmiques</p>
        </div>
      </div>
    );
  }

  if (error || !hasReading()) {
    return (
      <div className="min-h-screen py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              icon={<ArrowLeft size={18} />}
              className="mb-8"
            >
              Retour au tableau de bord
            </Button>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral/10">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sun size={40} className="text-accent" />
              </div>
              <h2 className="font-display text-3xl text-accent mb-4">
                ☀️ Tirage du Jour
              </h2>
              <p className="text-lg text-neutral-dark/80 mb-6">
                Votre énergie quotidienne personnalisée
              </p>
              <div className="bg-warning/10 rounded-xl p-6 border border-warning/20 mb-6">
                <p className="text-warning font-medium">Tirage non disponible</p>
                <p className="text-neutral-dark/70 mt-2">
                  Le tirage énergétique du jour n'est pas encore configuré.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => navigate('/scan')}
                icon={<Sparkles size={18} />}
                className="bg-gradient-to-r from-accent to-warning hover:from-accent/90 hover:to-warning/90"
              >
                Faire un scan énergétique
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const today = new Date();
  const dayName = today.toLocaleDateString('fr-FR', { weekday: 'long' });
  const dateString = today.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen py-32 bg-gradient-to-br from-neutral via-accent/5 to-warning/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                icon={<ArrowLeft size={18} />}
                className="mb-4 bg-white/90 backdrop-blur-sm"
              >
                Retour au tableau de bord
              </Button>
              <h1 className="font-display text-4xl text-accent mb-2">
                ☀️ Tirage du Jour
              </h1>
              <div className="flex items-center text-neutral-dark/70 mb-2">
                <Calendar size={20} className="mr-2" />
                <span className="capitalize text-lg font-medium">{dayName} {dateString}</span>
                {getDayNumber() > 0 && (
                  <span className="ml-4 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                    Jour {getDayNumber()}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleShare}
                icon={<Share2 size={18} />}
                className="bg-white/90 backdrop-blur-sm"
              >
                Partager
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                icon={<Download size={18} />}
                className="bg-white/90 backdrop-blur-sm"
              >
                Télécharger
              </Button>
            </div>
          </div>

          {/* Énergies du jour */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Énergie du jour */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-accent/20"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mr-3">
                  <Sun size={24} className="text-accent" />
                </div>
                <h3 className="font-display text-xl text-accent">Énergie du jour</h3>
              </div>
              {(() => {
                const formatted = formatReadingText(getDayEnergy());
                return formatted.__html ? (
                  <div
                    className="text-neutral-dark/90 leading-relaxed prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: formatted.__html }}
                  />
                ) : (
                  <p className="text-neutral-dark/90 leading-relaxed whitespace-pre-line">
                    {formatted.text}
                  </p>
                );
              })()}
            </motion.div>

            {/* Énergie du mois */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-secondary/20"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mr-3">
                  <Moon size={24} className="text-secondary" />
                </div>
                <h3 className="font-display text-xl text-secondary">Énergie du mois</h3>
              </div>
              {(() => {
                const formatted = formatReadingText(getMonthEnergy());
                return formatted.__html ? (
                  <div
                    className="text-neutral-dark/90 leading-relaxed prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: formatted.__html }}
                  />
                ) : (
                  <p className="text-neutral-dark/90 leading-relaxed whitespace-pre-line">
                    {formatted.text}
                  </p>
                );
              })()}
            </motion.div>

            {/* Énergie de l'année */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary/20"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                  <Sparkles size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-xl text-primary">Énergie de l'année</h3>
              </div>
              {(() => {
                const formatted = formatReadingText(getYearEnergy());
                return formatted.__html ? (
                  <div
                    className="text-neutral-dark/90 leading-relaxed prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: formatted.__html }}
                  />
                ) : (
                  <p className="text-neutral-dark/90 leading-relaxed whitespace-pre-line">
                    {formatted.text}
                  </p>
                );
              })()}
            </motion.div>
          </div>

          {/* Message et Mantra */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Message du jour */}
            {getDescription() && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary/20"
              >
                <h3 className="font-display text-xl mb-4 text-primary">💫 Message du jour</h3>
                {(() => {
                  const formatted = formatReadingText(getDescription());
                  return formatted.__html ? (
                    <div
                      className="text-neutral-dark/90 leading-relaxed prose prose-sm"
                      dangerouslySetInnerHTML={{ __html: formatted.__html }}
                    />
                  ) : (
                    <p className="text-neutral-dark/90 leading-relaxed whitespace-pre-line">
                      {formatted.text}
                    </p>
                  );
                })()}
              </motion.div>
            )}

            {/* Mantra du jour */}
            {getMantra() && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-secondary/20 to-accent/20 rounded-xl p-6 shadow-lg border border-secondary/20"
              >
                <h3 className="font-display text-xl mb-4 text-secondary">🧘‍♀️ Mantra du jour</h3>
                <div className="bg-white/50 rounded-lg p-4">
                  {(() => {
                    const formatted = formatReadingText(getMantra());
                    return formatted.__html ? (
                      <div
                        className="text-neutral-dark/90 leading-relaxed prose prose-sm text-center italic"
                        dangerouslySetInnerHTML={{ __html: formatted.__html }}
                      />
                    ) : (
                      <p className="text-neutral-dark/90 leading-relaxed text-center italic font-medium">
                        "{formatted.text}"
                      </p>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="text-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-neutral/10">
              <h3 className="font-display text-2xl mb-4 text-primary">
                🌸 Intégrez cette énergie dans votre journée
              </h3>
              <p className="text-neutral-dark/80 mb-6 max-w-2xl mx-auto">
                Prenez quelques minutes pour méditer sur ces messages et laissez cette énergie vous guider.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  onClick={() => navigate('/scan')}
                  icon={<Sparkles size={18} />}
                  className="bg-gradient-to-r from-accent to-warning hover:from-accent/90 hover:to-warning/90"
                >
                  Faire mon scan énergétique
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/oracle')}
                  icon={<Moon size={18} />}
                >
                  Consulter l'Oracle
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DailyEnergyPage;