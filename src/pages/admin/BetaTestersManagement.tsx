import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Edit, Trash2, Crown, Calendar, Check, X, Mail, Clock } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAlertStore } from '../../store/alertStore';
import { supabase } from '../../services/supabaseClient';
import { 
  getAllBetaTesters, 
  addBetaTester, 
  removeBetaTester, 
  grantFreeAccess,
  BetaTester 
} from '../../services/adminService';

const BetaTestersManagement = () => {
  const { showAlert } = useAlertStore();
  const [betaTesters, setBetaTesters] = useState<BetaTester[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGrantForm, setShowGrantForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  
  const [addForm, setAddForm] = useState({
    email: '',
    accessLevel: 'full' as 'full' | 'limited' | 'categories_only',
    expiresAt: '',
    notes: ''
  });

  const [grantForm, setGrantForm] = useState({
    grantType: 'temporary' as 'temporary' | 'permanent' | 'category_specific',
    accessScope: 'full' as 'full' | 'categories_only' | 'specific_category',
    specificCategories: [] as string[],
    expiresAt: '',
    notes: ''
  });

  const categories = [
    'emotional', 'physical', 'mental', 'digestive', 
    'somatic', 'energetic', 'feminine_cycle', 'hd_specific'
  ];

  useEffect(() => {
    fetchBetaTesters();
  }, []);

  const fetchBetaTesters = async () => {
    try {
      setIsLoading(true);
      
      // Fetch beta testers from free_access_grants
      const { data: grantsData, error: grantsError } = await supabase
        .from('free_access_grants')
        .select('id, user_id, grant_type, access_scope, granted_at, expires_at, is_active, notes')
        .eq('grant_type', 'beta_tester')
        .order('granted_at', { ascending: false });
      
      if (grantsError) {
        console.error('Error fetching beta testers:', grantsError);
        // Fallback to mock data for demo
        const mockBetaTesters: BetaTester[] = [
          {
            id: '1',
            user_id: 'user1',
            email: 'marie.test@example.com',
            full_name: 'Marie Test',
            status: 'active',
            access_level: 'full',
            granted_at: new Date().toISOString(),
            total_scans: 15,
            average_score: 78
          },
          {
            id: '2',
            user_id: 'user2',
            email: 'sophie.beta@example.com',
            full_name: 'Sophie Beta',
            status: 'active',
            access_level: 'categories_only',
            granted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            total_scans: 8,
            average_score: 65
          }
        ];
        setBetaTesters(mockBetaTesters);
      } else {
        // Get unique user IDs
        const userIds = grantsData?.map(grant => grant.user_id).filter(Boolean) || [];
        
        // Fetch user details separately
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, email, full_name')
          .in('id', userIds);
        
        if (usersError) {
          console.error('Error fetching user details:', usersError);
          setBetaTesters([]);
        } else {
          // Create a map of user details
          const usersMap = new Map(usersData?.map(user => [user.id, user]) || []);
          
          // Transform data to match BetaTester interface
          const transformedData = grantsData?.map(item => {
            const userDetails = usersMap.get(item.user_id);
            return {
              id: item.id,
              user_id: item.user_id,
              email: userDetails?.email || 'Email non trouvé',
              full_name: userDetails?.full_name || 'Nom non trouvé',
              status: item.is_active ? 'active' : 'inactive',
              access_level: item.access_scope === 'full' ? 'full' : 'categories_only',
              granted_at: item.granted_at,
              expires_at: item.expires_at,
              notes: item.notes,
              total_scans: 0, // Would need to be calculated
              average_score: 0 // Would need to be calculated
            };
          }) || [];
          
          setBetaTesters(transformedData);
        }
      }
    } catch (error) {
      console.error('Error fetching beta testers:', error);
      showAlert('Erreur lors du chargement des bétatesteuses', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBetaTester = async () => {
    if (!addForm.email) {
      showAlert('L\'email est requis', 'warning');
      return;
    }

    try {
      // Create beta tester access directly
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('free_access_grants')
        .insert({
          user_id: 'temp-user-id', // In real app, would need to find user by email first
          grant_type: 'beta_tester',
          access_scope: addForm.accessLevel === 'categories_only' ? 'categories_only' : 'full',
          expires_at: addForm.expiresAt || null,
          notes: `Bétatesteuse - ${addForm.notes}`,
          granted_by: currentUser?.id,
          is_active: true
        });

      if (error) throw error;

      showAlert('Bétatesteuse ajoutée avec succès', 'success');
      setShowAddForm(false);
      setAddForm({ email: '', accessLevel: 'full', expiresAt: '', notes: '' });
      fetchBetaTesters();
    } catch (error) {
      console.error('Error adding beta tester:', error);
      showAlert(error instanceof Error ? error.message : 'Erreur lors de l\'ajout', 'error');
    }
  };

  const handleRemoveBetaTester = async (betaTesterId: string) => {
    if (!confirm('Êtes-vous sûre de vouloir retirer cette bétatesteuse ?')) return;

    try {
      const { error } = await removeBetaTester(betaTesterId);
      
      if (error) throw error;
      
      showAlert('Bétatesteuse retirée avec succès', 'success');
      fetchBetaTesters();
    } catch (error) {
      console.error('Error removing beta tester:', error);
      showAlert('Erreur lors de la suppression', 'error');
    }
  };

  const handleGrantAccess = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await grantFreeAccess(
        selectedUser,
        grantForm.grantType,
        grantForm.accessScope,
        grantForm.specificCategories.length > 0 ? grantForm.specificCategories : undefined,
        grantForm.expiresAt || undefined,
        grantForm.notes
      );

      if (error) throw error;

      showAlert('Accès gratuit accordé avec succès', 'success');
      setShowGrantForm(false);
      setSelectedUser(null);
      setGrantForm({
        grantType: 'temporary',
        accessScope: 'full',
        specificCategories: [],
        expiresAt: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error granting access:', error);
      showAlert('Erreur lors de l\'attribution d\'accès', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'inactive': return 'text-neutral-dark bg-neutral-dark/10';
      case 'suspended': return 'text-error bg-error/10';
      default: return 'text-neutral-dark bg-neutral-dark/10';
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full': return 'text-primary bg-primary/10';
      case 'limited': return 'text-warning bg-warning/10';
      case 'categories_only': return 'text-secondary bg-secondary/10';
      default: return 'text-neutral-dark bg-neutral-dark/10';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-dark/70">Chargement des bétatesteuses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl flex items-center">
            <Crown size={24} className="text-primary mr-2" />
            Gestion des Bétatesteuses
          </h2>
          <p className="text-neutral-dark/70">
            {betaTesters.length} bétatesteuses • Accès gratuit configuré par l'admin
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowGrantForm(true)}
            icon={<Plus size={16} />}
          >
            Accorder accès
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
            icon={<Plus size={16} />}
          >
            Ajouter bétatesteuse
          </Button>
        </div>
      </div>

      {/* Formulaire d'ajout de bétatesteuse */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm border border-primary/20"
        >
          <h3 className="font-display text-xl mb-4">Ajouter une bétatesteuse</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Email *
              </label>
              <input
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                className="input-field"
                placeholder="email@exemple.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Niveau d'accès
              </label>
              <select
                value={addForm.accessLevel}
                onChange={(e) => setAddForm(prev => ({ ...prev, accessLevel: e.target.value as any }))}
                className="input-field"
              >
                <option value="full">Accès complet</option>
                <option value="limited">Accès limité</option>
                <option value="categories_only">Catégories seulement</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Date d'expiration (optionnel)
              </label>
              <input
                type="datetime-local"
                value={addForm.expiresAt}
                onChange={(e) => setAddForm(prev => ({ ...prev, expiresAt: e.target.value }))}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Notes
              </label>
              <input
                type="text"
                value={addForm.notes}
                onChange={(e) => setAddForm(prev => ({ ...prev, notes: e.target.value }))}
                className="input-field"
                placeholder="Notes sur cette bétatesteuse..."
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowAddForm(false)}
              fullWidth
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleAddBetaTester}
              fullWidth
            >
              Ajouter
            </Button>
          </div>
        </motion.div>
      )}

      {/* Liste des bétatesteuses */}
      <div className="bg-white dark:bg-[#2D2424] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral/30">
                <th className="text-left py-4 px-6 font-medium">Bétatesteuse</th>
                <th className="text-left py-4 px-6 font-medium">Statut</th>
                <th className="text-left py-4 px-6 font-medium">Accès</th>
                <th className="text-left py-4 px-6 font-medium">Expiration</th>
                <th className="text-left py-4 px-6 font-medium">Activité</th>
                <th className="text-right py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {betaTesters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-neutral-dark/70">
                    Aucune bétatesteuse configurée
                  </td>
                </tr>
              ) : (
                betaTesters.map((betaTester, index) => (
                  <motion.tr
                    key={betaTester.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border-b border-neutral/10 ${
                      index % 2 === 0 ? 'bg-white dark:bg-[#2D2424]' : 'bg-neutral/5 dark:bg-[#3D3232]/20'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div>
                        <div className="flex items-center">
                          <Crown size={16} className="text-primary mr-2" />
                          <div>
                            <p className="font-medium">{betaTester.full_name || betaTester.email.split('@')[0]}</p>
                            <p className="text-sm text-neutral-dark/60">{betaTester.email}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(betaTester.status)}`}>
                        {betaTester.status}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(betaTester.access_level)}`}>
                        {betaTester.access_level}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      {betaTester.expires_at ? (
                        <div className="text-sm">
                          <Calendar size={14} className="inline mr-1" />
                          {new Date(betaTester.expires_at).toLocaleDateString('fr-FR')}
                        </div>
                      ) : (
                        <span className="text-success text-sm">Permanent</span>
                      )}
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div>{betaTester.total_scans || 0} scans</div>
                        {betaTester.average_score && (
                          <div className="text-primary">{Math.round(betaTester.average_score)}% moy.</div>
                        )}
                        {betaTester.last_seen && (
                          <div className="text-xs text-neutral-dark/60">
                            Vu le {new Date(betaTester.last_seen).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(betaTester.user_id);
                            setShowGrantForm(true);
                          }}
                          className="p-2 text-neutral-dark/70 hover:text-primary transition-colors rounded-full hover:bg-neutral/10"
                          title="Accorder accès supplémentaire"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => handleRemoveBetaTester(betaTester.id)}
                          className="p-2 text-neutral-dark/70 hover:text-error transition-colors rounded-full hover:bg-error/10"
                          title="Retirer de la liste"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-display text-primary">{betaTesters.length}</div>
          <div className="text-sm text-neutral-dark/70">Total bétatesteuses</div>
        </div>
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-display text-success">
            {betaTesters.filter(bt => bt.status === 'active').length}
          </div>
          <div className="text-sm text-neutral-dark/70">Actives</div>
        </div>
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-display text-warning">
            {betaTesters.filter(bt => bt.expires_at && new Date(bt.expires_at) < new Date()).length}
          </div>
          <div className="text-sm text-neutral-dark/70">Expirées</div>
        </div>
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-display text-secondary">
            {betaTesters.reduce((sum, bt) => sum + (bt.total_scans || 0), 0)}
          </div>
          <div className="text-sm text-neutral-dark/70">Scans totaux</div>
        </div>
      </div>
    </div>
  );
};

export default BetaTestersManagement;