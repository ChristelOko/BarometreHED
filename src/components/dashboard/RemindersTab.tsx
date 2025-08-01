import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Bell, Clock, Check, X, Edit, Trash2, AlertCircle, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { useAuthStore } from '../../store/authStore';
import { useAlertStore } from '../../store/alertStore';
import { ConversationalAI } from '../../services/conversationalAI';
import { 
  getUserReminders, 
  getTodayReminders, 
  getUpcomingReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  completeReminder,
  createRecurringReminder,
  Reminder 
} from '../../services/reminderService';
import { format, parseISO, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RemindersTabProps {
  isOverviewMode?: boolean;
}

const RemindersTab = ({ isOverviewMode = false }: RemindersTabProps) => {
  const { user } = useAuthStore();
  const { showAlert } = useAlertStore();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [todayReminders, setTodayReminders] = useState<Reminder[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'all'>('today');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState<string | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [reminderToComplete, setReminderToComplete] = useState<string | null>(null);
  
  // IA conversationnelle pour des suggestions intelligentes
  const [conversationalAI, setConversationalAI] = useState<ConversationalAI | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'practice' as 'exercise' | 'practice' | 'ritual',
    priority: 'medium' as 'low' | 'medium' | 'high',
    frequency: '' as '' | 'daily' | 'weekly' | 'monthly'
  });

  useEffect(() => {
    if (user?.id) {
      fetchReminders();
      
      // Initialiser l'IA pour des suggestions de rappels
      const ai = new ConversationalAI(user.id, user.hdType || 'generator', user.name || 'utilisatrice');
      ai.initializeMemory().then(() => {
        setConversationalAI(ai);
      });
    }
  }, [user]);

  const fetchReminders = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      const [todayResult, upcomingResult, allResult] = await Promise.all([
        getTodayReminders(user.id),
        getUpcomingReminders(user.id, 7),
        getUserReminders(user.id, false, 20)
      ]);

      if (todayResult.error) throw todayResult.error;
      if (upcomingResult.error) throw upcomingResult.error;
      if (allResult.error) throw allResult.error;

      setTodayReminders(todayResult.data || []);
      setUpcomingReminders(upcomingResult.data || []);
      setReminders(allResult.data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      showAlert('Erreur lors du chargement des rappels', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReminder = async () => {
    if (!user?.id || !formData.title.trim()) {
      showAlert('Veuillez remplir au moins le titre', 'warning');
      return;
    }

    try {
      if (formData.frequency) {
        // Créer un rappel récurrent
        const { error } = await createRecurringReminder(
          user.id,
          formData.title,
          formData.description,
          '09:00', // Heure par défaut
          formData.frequency,
          formData.type,
          formData.priority
        );
        
        if (error) throw error;
        showAlert('Rappel récurrent créé avec succès', 'success');
      } else {
        // Créer un rappel unique
        const { error } = await createReminder({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          date: formData.date,
          type: formData.type,
          priority: formData.priority,
          auto_generated: false,
          completed: false
        });
        
        if (error) throw error;
        showAlert('Rappel créé avec succès', 'success');
      }
      
      // Reset form and refresh
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'practice',
        priority: 'medium',
        frequency: ''
      });
      setShowCreateForm(false);
      fetchReminders();
    } catch (error) {
      console.error('Error creating reminder:', error);
      showAlert('Erreur lors de la création du rappel', 'error');
    }
  };

  const handleCompleteReminder = async (reminderId: string) => {
    setReminderToComplete(reminderId);
    setShowCompleteDialog(true);
  };

  const confirmCompleteReminder = async () => {
    if (!reminderToComplete) return;
    
    try {
      const { error } = await completeReminder(reminderToComplete);
      if (error) throw error;
      
      showAlert('Rappel marqué comme terminé ! 🌸', 'success');
      fetchReminders();
    } catch (error) {
      console.error('Error completing reminder:', error);
      showAlert('Erreur lors de la completion du rappel', 'error');
    } finally {
      setShowCompleteDialog(false);
      setReminderToComplete(null);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    setReminderToDelete(reminderId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteReminder = async () => {
    if (!reminderToDelete) return;
    
    try {
      const { error } = await deleteReminder(reminderToDelete);
      if (error) throw error;
      
      showAlert('Rappel supprimé avec succès', 'success');
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      showAlert('Erreur lors de la suppression du rappel', 'error');
    } finally {
      setShowDeleteDialog(false);
      setReminderToDelete(null);
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'exercise': return '🏃‍♀️';
      case 'practice': return '🧘‍♀️';
      case 'ritual': return '✨';
      default: return '📝';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-primary';
    }
  };

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Aujourd\'hui';
    if (isTomorrow(date)) return 'Demain';
    if (isThisWeek(date)) return format(date, 'EEEE', { locale: fr });
    return format(date, 'dd MMM', { locale: fr });
  };

  if (isOverviewMode) {
    return (
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-neutral-dark/70">Chargement...</p>
          </div>
        ) : todayReminders.length > 0 ? (
          <div className="space-y-3">
            {todayReminders.slice(0, 3).map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 bg-neutral/10 rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getReminderIcon(reminder.type)}</span>
                  <div>
                    <p className="font-medium text-sm">{reminder.title}</p>
                    <p className="text-xs text-neutral-dark/60">{reminder.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCompleteReminder(reminder.id!)}
                  className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                >
                  <Check size={16} />
                </button>
              </div>
            ))}
            {todayReminders.length > 3 && (
              <p className="text-xs text-center text-neutral-dark/60">
                +{todayReminders.length - 3} autres rappels
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <Bell size={32} className="mx-auto text-primary/50 mb-3" />
            <p className="text-neutral-dark/70 mb-4">Aucun rappel pour aujourd'hui</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateForm(true)}
              icon={<Plus size={16} />}
            >
              Créer un rappel
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl">Mes rappels</h3>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(true)}
          icon={<Plus size={18} />}
        >
          Nouveau rappel
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-neutral/20 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'today'
              ? 'bg-white text-primary shadow-sm'
              : 'text-neutral-dark/70 hover:text-primary'
          }`}
        >
          Aujourd'hui ({todayReminders.length})
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-white text-primary shadow-sm'
              : 'text-neutral-dark/70 hover:text-primary'
          }`}
        >
          À venir ({upcomingReminders.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-white text-primary shadow-sm'
              : 'text-neutral-dark/70 hover:text-primary'
          }`}
        >
          Tous ({reminders.length})
        </button>
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-neutral/10"
          >
            <h4 className="font-display text-lg mb-4">Créer un rappel</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  placeholder="Ex: Méditation matinale"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Décrivez votre rappel..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="input-field"
                  >
                    <option value="practice">Pratique</option>
                    <option value="exercise">Exercice</option>
                    <option value="ritual">Rituel</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">
                    Priorité
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="input-field"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Élevée</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">
                    Date (si unique)
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="input-field"
                    disabled={!!formData.frequency}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">
                    Récurrence (optionnel)
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="input-field"
                  >
                    <option value="">Rappel unique</option>
                    <option value="daily">Quotidien</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuel</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({
                      title: '',
                      description: '',
                      date: new Date().toISOString().split('T')[0],
                      type: 'practice',
                      priority: 'medium',
                      frequency: ''
                    });
                  }}
                  fullWidth
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateReminder}
                  fullWidth
                  disabled={!formData.title.trim()}
                >
                  Créer le rappel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminders List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-dark/70">Chargement des rappels...</p>
          </div>
        ) : (
          <>
            {activeTab === 'today' && (
              <div className="space-y-3">
                {todayReminders.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar size={48} className="mx-auto text-neutral-dark/30 mb-4" />
                    <h4 className="font-display text-lg text-neutral-dark/70 mb-2">
                      Aucun rappel pour aujourd'hui
                    </h4>
                    {conversationalAI && (() => {
                      const memorySummary = conversationalAI.getMemorySummary();
                      if (memorySummary && memorySummary.dominantEmotions.length > 0) {
                        return (
                          <p className="text-neutral-dark/50 mb-4">
                            Basé sur tes patterns récents ({memorySummary.dominantEmotions.join(', ')}), 
                            que dirais-tu d'un moment de {memorySummary.averageEnergyLevel > 2 ? 'célébration' : 'douceur'} aujourd'hui ?
                          </p>
                        );
                      }
                      return (
                        <p className="text-neutral-dark/50 mb-4">
                          Profitez de cette journée libre ou créez un nouveau rappel
                        </p>
                      );
                    })()}
                  </div>
                ) : (
                  todayReminders.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onComplete={() => handleCompleteReminder(reminder.id!)}
                      onDelete={() => handleDeleteReminder(reminder.id!)}
                      showDate={false}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'upcoming' && (
              <div className="space-y-3">
                {upcomingReminders.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell size={48} className="mx-auto text-neutral-dark/30 mb-4" />
                    <h4 className="font-display text-lg text-neutral-dark/70 mb-2">
                      Aucun rappel à venir
                    </h4>
                    <p className="text-neutral-dark/50 mb-4">
                      Créez des rappels pour organiser vos prochaines pratiques
                    </p>
                  </div>
                ) : (
                  upcomingReminders.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onComplete={() => handleCompleteReminder(reminder.id!)}
                      onDelete={() => handleDeleteReminder(reminder.id!)}
                      showDate={true}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'all' && (
              <div className="space-y-3">
                {reminders.length === 0 ? (
                  <div className="text-center py-12">
                    <Sparkles size={48} className="mx-auto text-neutral-dark/30 mb-4" />
                    <h4 className="font-display text-xl text-neutral-dark/70 mb-2">
                      Aucun rappel configuré
                    </h4>
                    {conversationalAI && (() => {
                      const memorySummary = conversationalAI.getMemorySummary();
                      if (memorySummary && memorySummary.preferredCategories.length > 0) {
                        return (
                          <p className="text-neutral-dark/50 mb-6">
                            Je remarque que tu explores souvent {memorySummary.preferredCategories[0]}. 
                            Que dirais-tu de créer des rappels personnalisés pour cette dimension ?
                          </p>
                        );
                      }
                      return (
                        <p className="text-neutral-dark/50 mb-6">
                          Créez des rappels personnalisés pour vos pratiques énergétiques quotidiennes
                        </p>
                      );
                    })()}
                    <Button
                      variant="primary"
                      onClick={() => setShowCreateForm(true)}
                      icon={<Plus size={18} />}
                    >
                      Créer mon premier rappel
                    </Button>
                  </div>
                ) : (
                  reminders.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onComplete={() => handleCompleteReminder(reminder.id!)}
                      onDelete={() => handleDeleteReminder(reminder.id!)}
                      showDate={true}
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Dialog de confirmation de suppression */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Supprimer ce rappel ?"
        message="Cette action est irréversible. Êtes-vous sûre de vouloir supprimer définitivement ce rappel ?"
        type="warning"
        showActions={true}
        onConfirm={confirmDeleteReminder}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
      
      {/* Dialog de confirmation de completion */}
      <ConfirmationDialog
        isOpen={showCompleteDialog}
        onClose={() => setShowCompleteDialog(false)}
        title="Marquer comme terminé ?"
        message="Félicitations ! Vous avez accompli cette pratique énergétique. Voulez-vous la marquer comme terminée ?"
        type="success"
        showActions={true}
        onConfirm={confirmCompleteReminder}
        confirmText="Oui, c'est fait ! 🌸"
        cancelText="Pas encore"
      />
    </div>
  );
};

// Composant pour afficher un rappel
const ReminderCard = ({ 
  reminder, 
  onComplete, 
  onDelete, 
  showDate = true 
}: { 
  reminder: Reminder; 
  onComplete: () => void; 
  onDelete: () => void; 
  showDate?: boolean;
}) => {
  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'exercise': return '🏃‍♀️';
      case 'practice': return '🧘‍♀️';
      case 'ritual': return '✨';
      default: return '📝';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-error';
      case 'medium': return 'border-l-warning';
      case 'low': return 'border-l-success';
      default: return 'border-l-primary';
    }
  };

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Aujourd\'hui';
    if (isTomorrow(date)) return 'Demain';
    if (isThisWeek(date)) return format(date, 'EEEE', { locale: fr });
    return format(date, 'dd MMM', { locale: fr });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${getPriorityColor(reminder.priority || 'medium')} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-xl">{getReminderIcon(reminder.type)}</span>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-neutral-dark">{reminder.title}</h4>
              {reminder.auto_generated && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  Auto
                </span>
              )}
              {reminder.frequency && (
                <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                  {reminder.frequency === 'daily' ? 'Quotidien' : 
                   reminder.frequency === 'weekly' ? 'Hebdo' : 'Mensuel'}
                </span>
              )}
            </div>
            {reminder.description && (
              <p className="text-sm text-neutral-dark/70 mb-2">{reminder.description}</p>
            )}
            <div className="flex items-center space-x-4 text-xs text-neutral-dark/60">
              {showDate && (
                <span className="flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {getDateLabel(reminder.date)}
                </span>
              )}
              <span className="capitalize">{reminder.type}</span>
              <span className={`capitalize ${
                reminder.priority === 'high' ? 'text-error' :
                reminder.priority === 'medium' ? 'text-warning' : 'text-success'
              }`}>
                {reminder.priority === 'high' ? 'Priorité élevée' :
                 reminder.priority === 'medium' ? 'Priorité moyenne' : 'Priorité faible'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onComplete}
            className="p-2 text-success hover:bg-success/10 rounded-full transition-colors"
            title="Marquer comme terminé"
          >
            <Check size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-error hover:bg-error/10 rounded-full transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RemindersTab;