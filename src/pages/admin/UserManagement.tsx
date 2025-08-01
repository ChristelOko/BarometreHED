import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Edit, Trash2, UserPlus, Check, X, Eye, Mail, RefreshCw, Crown, Star, Settings, MessageSquare, Save } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAlertStore } from '../../store/alertStore';
import { useAuthStore } from '../../store/authStore';
import { getAllUsers, updateUserRole, deleteUser, User } from '../../services/adminService';
import { updateExtendedProfile } from '../../services/profileService';
import { supabase } from '../../services/supabaseClient';

const UserManagement = () => {
  const { showAlert } = useAlertStore();
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userComments, setUserComments] = useState<any[]>([]);
  const [editingComment, setEditingComment] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState({
    role: 'user',
    isLifetime: false,
    isBetaTester: false,
    betaAccessLevel: 'full' as 'full' | 'categories_only',
    betaExpiresAt: '',
    notes: ''
  });
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    hd_type: '',
    birthdate: '',
    location: '',
    website: '',
    avatar_url: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch users directly from the users table with scan count
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          hd_type,
          role,
          avatar_url,
          bio,
          phone,
          birthdate,
          is_active,
          last_seen,
          created_at,
          updated_at
        `);

      if (usersError) throw usersError;

      // Get scan counts for each user
      const { data: scanCounts, error: scanError } = await supabase
        .from('scans')
        .select('user_id')
        .not('user_id', 'is', null);

      if (scanError) throw scanError;

      // Count scans per user
      const scanCountMap = scanCounts.reduce((acc, scan) => {
        acc[scan.user_id] = (acc[scan.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Combine users with their scan counts
      const usersWithStats = usersData.map(user => ({
        ...user,
        scan_count: scanCountMap[user.id] || 0
      }));
      
      setUsers(usersWithStats);
    } catch (error) {
      console.error('Error fetching users:', error);
      showAlert('Erreur lors du chargement des utilisatrices', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.full_name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.is_active : !user.is_active
      );
    }

    setFilteredUsers(filtered);
  };

  const handleViewDetails = (user: User) => {
    showAlert(`Détails de ${user.full_name} - Email: ${user.email}`, 'info');
  };

  const handleEditUserStatus = (user: User) => {
    setUserToEdit(user);
    setNewStatus({
      role: user.role,
      isLifetime: user.email === 'christel.aplogan@gmail.com' || user.role === 'lifetime',
      isBetaTester: user.is_beta_tester || false,
      betaAccessLevel: 'full',
      betaExpiresAt: user.free_access_expires || '',
      notes: ''
    });
    setShowStatusModal(true);
  };

  const handleEditUserData = (user: User) => {
    setUserToEdit(user);
    setEditForm({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      hd_type: user.hd_type || '',
      birthdate: user.birthdate || '',
      location: user.location || '',
      website: user.website || '',
      avatar_url: user.avatar_url || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateUserStatus = async () => {
    if (!userToEdit) return;

    try {
      // Mettre à jour le rôle utilisateur
      const { error: roleError } = await supabase
        .from('users')
        .update({ 
          role: newStatus.isLifetime ? 'lifetime' : newStatus.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userToEdit.id);

      if (roleError) throw roleError;

      // Gérer l'accès bétatesteuse
      if (newStatus.isBetaTester) {
        // Ajouter ou mettre à jour l'accès gratuit
        const { error: grantError } = await supabase
          .from('free_access_grants')
          .upsert({
            user_id: userToEdit.id,
            grant_type: 'beta_tester',
            access_scope: newStatus.betaAccessLevel,
            expires_at: newStatus.betaExpiresAt || null,
            notes: newStatus.notes || 'Statut modifié par admin',
            granted_by: user?.id,
            is_active: true
          }, {
            onConflict: 'user_id,grant_type'
          });

        if (grantError) throw grantError;
      } else {
        // Supprimer l'accès bétatesteuse si désactivé
        const { error: removeError } = await supabase
          .from('free_access_grants')
          .update({ is_active: false })
          .eq('user_id', userToEdit.id)
          .eq('grant_type', 'beta_tester');

        if (removeError) throw removeError;
      }

      showAlert('Statut utilisateur mis à jour avec succès', 'success');
      setShowStatusModal(false);
      setUserToEdit(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      showAlert('Erreur lors de la mise à jour du statut', 'error');
    }
  };

  const handleUpdateUserData = async () => {
    if (!userToEdit) return;

    try {
      // Séparer les champs selon les tables
      const userFields = {
        full_name: editForm.full_name,
        email: editForm.email,
        phone: editForm.phone,
        bio: editForm.bio,
        hd_type: editForm.hd_type,
        birthdate: editForm.birthdate || null,
        avatar_url: editForm.avatar_url,
        updated_at: new Date().toISOString()
      };

      const extendedFields = {
        location: editForm.location,
        website: editForm.website
      };

      // Mettre à jour la table users
      const { error } = await supabase
        .from('users')
        .update(userFields)
        .eq('id', userToEdit.id);

      if (error) throw error;

      // Mettre à jour la table user_profiles_extended
      const { error: extendedError } = await updateExtendedProfile(userToEdit.id, extendedFields);
      if (extendedError) throw extendedError;

      showAlert('Données utilisateur mises à jour avec succès', 'success');
      setShowEditModal(false);
      setUserToEdit(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user data:', error);
      showAlert('Erreur lors de la mise à jour des données', 'error');
    }
  };

  const handleViewComments = async (user: User) => {
    try {
      const { data: comments, error } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUserComments(comments || []);
      setUserToEdit(user);
      setShowCommentsModal(true);
    } catch (error) {
      console.error('Error fetching user comments:', error);
      showAlert('Erreur lors du chargement des commentaires', 'error');
    }
  };

  const handleUpdateComment = async (commentId: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('feedbacks')
        .update({ comment: newContent })
        .eq('id', commentId);

      if (error) throw error;

      showAlert('Commentaire mis à jour avec succès', 'success');
      setEditingComment(null);
      
      // Refresh comments
      if (userToEdit) {
        handleViewComments(userToEdit);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      showAlert('Erreur lors de la mise à jour du commentaire', 'error');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Êtes-vous sûre de vouloir supprimer ce commentaire ?')) return;

    try {
      const { error } = await supabase
        .from('feedbacks')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      showAlert('Commentaire supprimé avec succès', 'success');
      
      // Refresh comments
      if (userToEdit) {
        handleViewComments(userToEdit);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      showAlert('Erreur lors de la suppression du commentaire', 'error');
    }
  };

  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsConfirmDeleteOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      // Supprimer l'utilisateur directement dans Supabase
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userToDelete.id);

      if (error) throw error;

      // Supprimer l'utilisateur de l'état local
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
      showAlert('Utilisatrice supprimée avec succès', 'success');
      setIsConfirmDeleteOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      showAlert('Erreur lors de la suppression de l\'utilisatrice', 'error');
    }
  };

  const handleSendEmail = (user: User) => {
    // This would open your email client or a modal to compose an email
    window.open(`mailto:${user.email}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-dark/70">Chargement des utilisatrices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Gestion des utilisatrices</h2>
          <p className="text-neutral-dark/70">
            {users.length} utilisatrices enregistrées
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchUsers}
            icon={<RefreshCw size={16} />}
          >
            Actualiser
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // This would open a modal to add a new user
              showAlert('Fonctionnalité à venir', 'info');
            }}
            icon={<UserPlus size={16} />}
          >
            Ajouter
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={18} className="text-primary" />
          <h3 className="font-display text-lg">Filtres</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-dark/50" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="editor">Éditeur</option>
            <option value="user">Utilisatrice</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white dark:bg-[#2D2424] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral/30">
                <th className="text-left py-4 px-6 font-medium">Utilisatrice</th>
                <th className="text-left py-4 px-6 font-medium">Email</th>
                <th className="text-left py-4 px-6 font-medium">Rôle</th>
                <th className="text-left py-4 px-6 font-medium">Statut</th>
                <th className="text-left py-4 px-6 font-medium">Dernière connexion</th>
                <th className="text-center py-4 px-6 font-medium">Scans</th>
                <th className="text-right py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                        {user.is_beta_tester && (
                          <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs mt-1">
                            <Crown size={10} className="mr-1" />
                            Bétatesteuse
                          </span>
                        )}
                  <td colSpan={6} className="text-center py-8 text-neutral-dark/70">
                    {/* Removed duplicate beta tester badge code */}
                    Aucune utilisatrice trouvée
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border-b border-neutral/10 ${
                      index % 2 === 0 ? 'bg-white dark:bg-[#2D2424]' : 'bg-neutral/5 dark:bg-[#3D3232]/20'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.full_name} 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-primary font-medium">
                              {user.full_name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-xs text-neutral-dark/60">
                            {user.hd_type || 'Type HD non défini'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-primary/10 text-primary' 
                          : user.role === 'editor'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-neutral text-neutral-dark'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`flex items-center ${
                        user.is_active ? 'text-success' : 'text-error'
                      }`}>
                        {user.is_active ? (
                          <>
                            <Check size={16} className="mr-1" />
                            <span>Actif</span>
                          </>
                        ) : (
                          <>
                            <X size={16} className="mr-1" />
                            <span>Inactif</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {user.last_seen ? (
                        new Date(user.last_seen).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      ) : (
                        <span className="text-neutral-dark/50">Jamais</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-medium text-primary">{user.scan_count || 0}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="p-2 text-neutral-dark/70 hover:text-primary transition-colors rounded-full hover:bg-neutral/10"
                          title="Voir les détails"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleSendEmail(user)}
                          className="p-2 text-neutral-dark/70 hover:text-primary transition-colors rounded-full hover:bg-neutral/10"
                          title="Envoyer un email"
                        >
                          <Mail size={16} />
                        </button>
                        <button
                          onClick={() => handleEditUserData(user)}
                          className="p-2 text-neutral-dark/70 hover:text-primary transition-colors rounded-full hover:bg-neutral/10"
                          title="Modifier les données"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleEditUserStatus(user)}
                          className="p-2 text-neutral-dark/70 hover:text-primary transition-colors rounded-full hover:bg-neutral/10"
                          title="Modifier le statut"
                        >
                          <Settings size={16} />
                        </button>
                        <button
                          onClick={() => handleViewComments(user)}
                          className="p-2 text-neutral-dark/70 hover:text-secondary transition-colors rounded-full hover:bg-secondary/10"
                          title="Voir les commentaires"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button
                          onClick={() => confirmDeleteUser(user)}
                          className="p-2 text-neutral-dark/70 hover:text-error transition-colors rounded-full hover:bg-error/10"
                          title="Supprimer"
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

      {/* Confirm delete modal */}
      {isConfirmDeleteOpen && userToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#2D2424] rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="font-display text-xl mb-4 text-error">Confirmer la suppression</h3>
            <p className="text-neutral-dark/80 mb-6">
              Êtes-vous sûr de vouloir supprimer l'utilisatrice <strong>{userToDelete.full_name}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsConfirmDeleteOpen(false)}
                fullWidth
              >
                Annuler
              </Button>
              <Button
                variant="outline"
                className="text-error hover:bg-error/10 hover:text-error border-error/20"
                onClick={handleDeleteUser}
                fullWidth
              >
                Supprimer
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal d'édition des données utilisateur */}
      {showEditModal && userToEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#2D2424] rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h3 className="font-display text-xl mb-4 text-primary">
                Modifier les données de {userToEdit.full_name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Type HD
                  </label>
                  <select
                    value={editForm.hd_type}
                    onChange={(e) => setEditForm(prev => ({ ...prev, hd_type: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="generator">Generator</option>
                    <option value="projector">Projector</option>
                    <option value="manifesting-generator">Manifesting Generator</option>
                    <option value="manifestor">Manifestor</option>
                    <option value="reflector">Reflector</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={editForm.birthdate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, birthdate: e.target.value }))}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="input-field"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                    className="input-field"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    URL Avatar
                  </label>
                  <input
                    type="url"
                    value={editForm.avatar_url}
                    onChange={(e) => setEditForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                    className="input-field"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="input-field"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setUserToEdit(null);
                  }}
                  fullWidth
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpdateUserData}
                  icon={<Save size={16} />}
                  fullWidth
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de gestion des commentaires */}
      {showCommentsModal && userToEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#2D2424] rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h3 className="font-display text-xl mb-4 text-primary">
                Commentaires et témoignages de {userToEdit.full_name}
              </h3>
              
              {userComments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={48} className="mx-auto text-neutral-dark/30 mb-4" />
                  <p className="text-neutral-dark/70">Aucun commentaire trouvé</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userComments.map((comment) => (
                    <div key={comment.id} className="bg-neutral/10 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={`${
                                  star <= comment.rating
                                    ? 'text-warning fill-warning'
                                    : 'text-neutral-dark/30'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-neutral-dark/60">
                            {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            comment.is_public ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                          }`}>
                            {comment.is_public ? 'Public' : 'Privé'}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingComment(comment)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-2 text-error hover:bg-error/10 rounded-full transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {editingComment?.id === comment.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editingComment.comment}
                            onChange={(e) => setEditingComment({...editingComment, comment: e.target.value})}
                            className="input-field w-full"
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingComment(null)}
                            >
                              Annuler
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleUpdateComment(comment.id, editingComment.comment)}
                              icon={<Save size={14} />}
                            >
                              Sauvegarder
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-neutral-dark/80">{comment.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCommentsModal(false);
                    setUserToEdit(null);
                    setUserComments([]);
                    setEditingComment(null);
                  }}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de modification du statut */}
      {showStatusModal && userToEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#2D2424] rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="font-display text-xl mb-4 text-primary">
              Modifier le statut de {userToEdit.full_name}
            </h3>
            
            <div className="space-y-4">
              {/* Rôle */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Rôle
                </label>
                <select
                  value={newStatus.role}
                  onChange={(e) => setNewStatus(prev => ({ ...prev, role: e.target.value }))}
                  className="input-field"
                  disabled={newStatus.isLifetime}
                >
                  <option value="user">Utilisatrice</option>
                  <option value="editor">Éditrice</option>
                  <option value="admin">Administratrice</option>
                </select>
              </div>

              {/* Plan à vie */}
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Star size={18} className="text-warning" />
                  <div>
                    <p className="font-medium text-sm">Plan à vie</p>
                    <p className="text-xs text-neutral-dark/70">Accès premium permanent</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={newStatus.isLifetime}
                  onChange={(e) => setNewStatus(prev => ({ ...prev, isLifetime: e.target.checked }))}
                  className="w-4 h-4"
                />
              </div>

              {/* Bétatesteuse */}
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Crown size={18} className="text-primary" />
                  <div>
                    <p className="font-medium text-sm">Bétatesteuse</p>
                    <p className="text-xs text-neutral-dark/70">Accès gratuit temporaire</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={newStatus.isBetaTester}
                  onChange={(e) => setNewStatus(prev => ({ ...prev, isBetaTester: e.target.checked }))}
                  className="w-4 h-4"
                />
              </div>

              {/* Options bétatesteuse */}
              {newStatus.isBetaTester && (
                <div className="space-y-3 p-3 bg-neutral/10 rounded-xl">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-1">
                      Niveau d'accès
                    </label>
                    <select
                      value={newStatus.betaAccessLevel}
                      onChange={(e) => setNewStatus(prev => ({ ...prev, betaAccessLevel: e.target.value as any }))}
                      className="input-field text-sm"
                    >
                      <option value="full">Accès complet</option>
                      <option value="categories_only">Catégories seulement</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-1">
                      Date d'expiration (optionnel)
                    </label>
                    <input
                      type="date"
                      value={newStatus.betaExpiresAt}
                      onChange={(e) => setNewStatus(prev => ({ ...prev, betaExpiresAt: e.target.value }))}
                      className="input-field text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-1">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={newStatus.notes}
                      onChange={(e) => setNewStatus(prev => ({ ...prev, notes: e.target.value }))}
                      className="input-field text-sm"
                      placeholder="Notes sur ce statut..."
                    />
                  </div>
                </div>
              )}

              {/* Informations spéciales */}
              {userToEdit.email === 'christel.aplogan@gmail.com' && (
                <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                  <div className="flex items-center space-x-2">
                    <Crown size={16} className="text-primary" />
                    <p className="text-sm font-medium text-primary">👑 Fondatrice</p>
                  </div>
                  <p className="text-xs text-neutral-dark/70 mt-1">
                    Accès administrateur permanent et privilèges spéciaux
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowStatusModal(false);
                  setUserToEdit(null);
                }}
                fullWidth
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateUserStatus}
                fullWidth
              >
                Mettre à jour
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;