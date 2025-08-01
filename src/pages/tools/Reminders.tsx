import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, ArrowLeft, Plus, Calendar, Clock, Check, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import RemindersTab from '../../components/dashboard/RemindersTab';

const RemindersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showAlertDialog } = useAlertStore();

  return (
    <div className="min-h-screen py-32">
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
                className="mb-4"
              >
                Retour au tableau de bord
              </Button>
              <h1 className="font-display text-4xl text-primary mb-2">
                🔔 Rappels
              </h1>
              <p className="text-lg text-neutral-dark/80">
                Gérez vos rappels énergétiques personnalisés
              </p>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral/10 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell size={24} className="text-primary" />
              </div>
              <div className="text-2xl font-display text-primary mb-1">Actifs</div>
              <div className="text-sm text-neutral-dark/70">Rappels en cours</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral/10 text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check size={24} className="text-success" />
              </div>
              <div className="text-2xl font-display text-success mb-1">Terminés</div>
              <div className="text-sm text-neutral-dark/70">Cette semaine</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral/10 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar size={24} className="text-secondary" />
              </div>
              <div className="text-2xl font-display text-secondary mb-1">Aujourd'hui</div>
              <div className="text-sm text-neutral-dark/70">À faire</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral/10 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock size={24} className="text-accent" />
              </div>
              <div className="text-2xl font-display text-accent mb-1">Récurrents</div>
              <div className="text-sm text-neutral-dark/70">Automatiques</div>
            </div>
          </div>

          {/* Interface de gestion des rappels */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral/10">
            <RemindersTab />
          </div>

          {/* Conseils pour les rappels */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20 mt-8">
            <h3 className="font-display text-2xl mb-6 text-primary text-center">
              💡 Conseils pour vos rappels énergétiques
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-neutral-dark">🌅 Rappels matinaux :</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="font-medium">Scan énergétique du réveil</p>
                    <p className="text-neutral-dark/70">Commencez la journée en vous connectant à votre énergie</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="font-medium">Intention du jour</p>
                    <p className="text-neutral-dark/70">Définissez votre intention énergétique quotidienne</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-neutral-dark">🌙 Rappels du soir :</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="font-medium">Bilan énergétique</p>
                    <p className="text-neutral-dark/70">Faites le point sur votre journée énergétique</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="font-medium">Gratitude et libération</p>
                    <p className="text-neutral-dark/70">Remerciez et libérez les énergies de la journée</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RemindersPage;